import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface DeviceInfo {
  browser?: string;
  os?: string;
  platform?: string;
  screen?: string;
  language?: string;
  userAgent?: string;
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface GeoLookup {
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  isp?: string;
  org?: string;
  asn?: string;
  timezone?: string;
  proxy?: boolean;
  hosting?: boolean;
  mobile?: boolean;
}

async function lookupGeo(ip: string): Promise<GeoLookup | null> {
  if (!ip || ip === "unknown" || ip.startsWith("127.") || ip.startsWith("::1")) return null;

  // 1) ipapi.co — HTTPS, accurate, generous free tier
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "CalcHub-Analytics/1.0" },
    });
    if (res.ok) {
      const j = await res.json();
      if (j && !j.error && j.country_name) {
        return {
          city: j.city,
          region: j.region,
          country: j.country_name,
          countryCode: j.country_code,
          isp: j.org,
          org: j.org,
          asn: j.asn,
          timezone: j.timezone,
        };
      }
    }
  } catch {
    // fall through
  }

  // 2) Fallback: ip-api.com (HTTP only, but extra signals like proxy/hosting/mobile)
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,regionName,city,isp,org,as,proxy,hosting,mobile,timezone`,
    );
    if (res.ok) {
      const j = await res.json();
      if (j && j.status === "success") {
        return {
          city: j.city,
          region: j.regionName,
          country: j.country,
          countryCode: j.countryCode,
          isp: j.isp,
          org: j.org,
          asn: j.as,
          timezone: j.timezone,
          proxy: j.proxy,
          hosting: j.hosting,
          mobile: j.mobile,
        };
      }
    }
  } catch {
    // ignore
  }

  return null;
}

function botSignals(geo: GeoLookup | null, device: DeviceInfo, browserTimezone: string, referrer: string): string[] {
  const flags: string[] = [];
  if (geo?.hosting) flags.push("hosting/datacenter IP");
  if (geo?.proxy) flags.push("proxy/VPN");
  if (geo && geo.timezone && browserTimezone && geo.timezone !== browserTimezone) {
    flags.push(`timezone mismatch (IP: ${geo.timezone} vs browser: ${browserTimezone})`);
  }
  const ua = (device.userAgent || "").toLowerCase();
  if (/(bot|crawler|spider|headless|phantom|puppeteer|playwright|selenium|httpclient|curl|wget)/i.test(ua)) {
    flags.push("automated user-agent");
  }
  if (!device.screen || device.screen === "0x0") flags.push("missing screen size");
  if (!referrer) flags.push("no referrer");
  return flags;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      device = {} as DeviceInfo,
      timezone: browserTimezone = "",
      referrer = "",
      url = "",
      path = "",
    } = body || {};

    // IP from headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";

    // Vercel geo headers — more accurate than third-party IP lookups because
    // Vercel uses MaxMind directly. Decode URI components since some headers
    // (city, region) come URL-encoded for non-ASCII names.
    const safeDecode = (v: string | null) => {
      if (!v) return undefined;
      try {
        return decodeURIComponent(v);
      } catch {
        return v;
      }
    };
    const vercelGeo: GeoLookup | null = (() => {
      const country = safeDecode(req.headers.get("x-vercel-ip-country"));
      const city = safeDecode(req.headers.get("x-vercel-ip-city"));
      const region = safeDecode(req.headers.get("x-vercel-ip-country-region"));
      const tz = safeDecode(req.headers.get("x-vercel-ip-timezone"));
      if (!country) return null;
      return {
        countryCode: country,
        country,
        city,
        region,
        timezone: tz,
      };
    })();

    // Use Vercel's geo if available; fall back to third-party for ISP/proxy/hosting flags.
    const externalGeo = await lookupGeo(ip);
    const geo: GeoLookup | null = vercelGeo
      ? {
          ...vercelGeo,
          // Pull ISP/proxy/hosting/mobile from external lookup since Vercel
          // doesn't expose those.
          isp: externalGeo?.isp,
          org: externalGeo?.org,
          asn: externalGeo?.asn,
          proxy: externalGeo?.proxy,
          hosting: externalGeo?.hosting,
          mobile: externalGeo?.mobile,
          // Prefer Vercel's country/city/region; keep timezone from Vercel.
          country: vercelGeo.country || externalGeo?.country,
          city: vercelGeo.city || externalGeo?.city,
          region: vercelGeo.region || externalGeo?.region,
        }
      : externalGeo;

    const locationLine = geo
      ? [geo.city, geo.region, geo.country].filter(Boolean).join(", ")
      : "Unknown";
    const ispLine = geo?.isp || geo?.org || "Unknown";
    const flags = botSignals(geo, device, browserTimezone, referrer);

    // Suppress email only on STRONG bot signals (datacenter IP or automated
    // user-agent). Soft signals like "no referrer" or "missing screen size"
    // false-positive too easily on real direct visits and privacy-conscious
    // mobile users — they're surfaced in the email body, not used to drop it.
    const isLikelyBot = flags.some(
      (f) => f === "hosting/datacenter IP" || f === "automated user-agent",
    );

    // Allow ?force=1 in the page URL to bypass suppression for testing.
    const forceSend = typeof url === "string" && /[?&]force=1\b/.test(url);

    if (isLikelyBot && !forceSend) {
      return NextResponse.json({ success: true, suppressed: true });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const subjectGeo = geo?.countryCode || (locationLine !== "Unknown" ? geo?.country : "??");
    const subjectDevice = `${device.browser || "?"} on ${device.os || "?"}`;
    const subjectPath = path || "/";

    const flagsBlock = flags.length
      ? `<div style="margin:12px 0;padding:10px 12px;background:#fef3c7;border:1px solid #fbbf24;border-radius:6px;">
          <strong style="color:#92400e;">⚠️ Soft signals:</strong>
          <ul style="margin:4px 0 0 18px;padding:0;color:#92400e;font-size:13px;">${flags.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
        </div>`
      : `<div style="margin:12px 0;padding:10px 12px;background:#dcfce7;border:1px solid #86efac;border-radius:6px;color:#166534;font-size:13px;">
          ✅ Likely a real user.
        </div>`;

    await transporter.sendMail({
      from: `"CalcHub Visits" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[CalcHub Visit] ${subjectGeo} · ${subjectPath} · ${subjectDevice}`,
      html: `
        <div style="font-family:sans-serif;max-width:780px;padding:20px;background:#fff;color:#111;">
          <h2 style="color:#6366f1;margin:0 0 4px 0;">New Visit</h2>
          <p style="margin:0 0 12px 0;color:#6b7280;font-size:13px;">Tracked at ${escapeHtml(now)} IST · admin-only · one beacon per browser session</p>

          ${flagsBlock}

          <h3 style="color:#374151;margin-top:18px;">Visit</h3>
          <table style="border-collapse:collapse;width:100%;font-size:14px;">
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:8px;font-weight:bold;color:#374151;width:200px;">Landing path</td><td style="padding:8px;color:#6b7280;">${escapeHtml(path)}</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;"><td style="padding:8px;font-weight:bold;color:#374151;">Full URL</td><td style="padding:8px;color:#6b7280;word-break:break-all;">${escapeHtml(url)}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#374151;">Referrer</td><td style="padding:8px;color:#6b7280;word-break:break-all;">${escapeHtml(referrer) || "<span style='color:#9ca3af;'>direct / none</span>"}</td></tr>
          </table>

          <h3 style="color:#374151;margin-top:18px;">Visitor</h3>
          <table style="border-collapse:collapse;width:100%;font-size:13px;">
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;width:200px;">IP Address</td><td style="padding:6px 8px;color:#6b7280;">${escapeHtml(ip)}</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;">Location</td><td style="padding:6px 8px;color:#6b7280;">${escapeHtml(locationLine)}</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;">ISP / Org</td><td style="padding:6px 8px;color:#6b7280;">${escapeHtml(ispLine)}${geo?.asn ? ` · ${escapeHtml(geo.asn)}` : ""}</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;">IP timezone / Browser timezone</td><td style="padding:6px 8px;color:#6b7280;">${escapeHtml(geo?.timezone || "?")} / ${escapeHtml(browserTimezone)}</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;">Connection type</td><td style="padding:6px 8px;color:#6b7280;">${geo?.mobile ? "📱 Mobile" : ""}${geo?.proxy ? " 🛡️ Proxy/VPN" : ""}${geo?.hosting ? " 🖥️ Hosting/datacenter" : ""}${!geo?.mobile && !geo?.proxy && !geo?.hosting ? "Residential / Unknown" : ""}</td></tr>
            <tr style="border-bottom:1px solid #e5e7eb;background:#f9fafb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;">Browser / OS</td><td style="padding:6px 8px;color:#6b7280;">${escapeHtml(device.browser)} on ${escapeHtml(device.os)} (${escapeHtml(device.platform)})</td></tr>
            <tr><td style="padding:6px 8px;font-weight:bold;color:#374151;">Screen / Language</td><td style="padding:6px 8px;color:#6b7280;">${escapeHtml(device.screen)} · ${escapeHtml(device.language)}</td></tr>
            <tr style="background:#f9fafb;"><td style="padding:6px 8px;font-weight:bold;color:#374151;">User Agent</td><td style="padding:6px 8px;color:#6b7280;font-size:11px;word-break:break-all;">${escapeHtml(device.userAgent)}</td></tr>
          </table>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Visit track error:", error);
    return NextResponse.json({ success: false });
  }
}
