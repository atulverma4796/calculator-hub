"use client";

import { useEffect } from "react";

const SESSION_KEY = "ch_visit_tracked";

function getDeviceInfo() {
  if (typeof window === "undefined") return null;
  const ua = window.navigator.userAgent;
  let browser = "Unknown";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/")) browser = "Safari";

  let os = "Unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return {
    browser,
    os,
    platform: window.navigator.platform || "Unknown",
    screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
    language: window.navigator.language || "Unknown",
    userAgent: ua,
  };
}

/**
 * Silent visit tracker — admin-only, never shown to users.
 * Fires one beacon per browser session to /api/t with anonymous metadata
 * (country, browser, IP, etc.). The API route detects bots and suppresses
 * email for them. No invoice / calculator content is ever transmitted.
 */
export default function VisitTracker() {
  useEffect(() => {
    try {
      // Throttle: one beacon per browser session.
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");

      const device = getDeviceInfo();
      if (!device) return;

      let timezone = "";
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      } catch {
        // ignore
      }

      const payload = JSON.stringify({
        device,
        timezone,
        referrer: document.referrer || "",
        url: window.location.href,
        path: window.location.pathname,
      });

      if (typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/t", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/t", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Silent — never block the user.
    }
  }, []);

  return null;
}
