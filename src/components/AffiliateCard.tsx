"use client";

import { useEffect, useState } from "react";

// Affiliate program types. Existing pages use "wise", "groww", "investment".
// New types "loan" and "hosting" cover worldwide audiences.
//
// PLACEHOLDER URLs marked with TODO — replace once affiliate sign-up is
// complete. See AFFILIATE_SETUP.md for sign-up steps + commission rates.
type AffiliateType =
  | "wise"        // Currency converter, money transfer (worldwide)
  | "groww"       // India investing (legacy — kept for backwards compat)
  | "investment"  // Generic investing (legacy)
  | "loan"        // EMI / mortgage / loan eligibility
  | "hosting";    // Tech audience — Hostinger 40-60% commission

interface AffiliateCardProps {
  type: AffiliateType;
}

interface Offer {
  icon: string;
  title: string;
  desc: string;
  cta: string;
  url: string;
  palette: keyof typeof PALETTES;
}

const PALETTES = {
  emerald: { bg: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30", border: "border-emerald-200 dark:border-emerald-800", iconBg: "bg-emerald-100 dark:bg-emerald-900/50", title: "text-emerald-900 dark:text-emerald-300", desc: "text-emerald-700 dark:text-emerald-400", cta: "text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300" },
  blue:    { bg: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",   border: "border-blue-200 dark:border-blue-800",   iconBg: "bg-blue-100 dark:bg-blue-900/50",   title: "text-blue-900 dark:text-blue-300",   desc: "text-blue-700 dark:text-blue-400",   cta: "text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" },
  amber:   { bg: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30", border: "border-amber-200 dark:border-amber-800", iconBg: "bg-amber-100 dark:bg-amber-900/50", title: "text-amber-900 dark:text-amber-300", desc: "text-amber-700 dark:text-amber-400", cta: "text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300" },
  violet:  { bg: "from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/30", border: "border-violet-200 dark:border-violet-800", iconBg: "bg-violet-100 dark:bg-violet-900/50", title: "text-violet-900 dark:text-violet-300", desc: "text-violet-700 dark:text-violet-400", cta: "text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300" },
  rose:    { bg: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",       border: "border-rose-200 dark:border-rose-800",   iconBg: "bg-rose-100 dark:bg-rose-900/50",   title: "text-rose-900 dark:text-rose-300",   desc: "text-rose-700 dark:text-rose-400",   cta: "text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300" },
};

// Each type has a default (worldwide) offer plus optional region overrides
// keyed by ISO country code (IN, US, GB, AU, CA, etc.). Detection is based
// on the user's IANA timezone.
const OFFERS: Record<AffiliateType, { default: Offer; byCountry?: Partial<Record<string, Offer>> }> = {
  wise: {
    default: {
      icon: "💸",
      title: "Send money abroad without the bank fees.",
      desc: "Wise uses the real mid-market rate with no hidden markup. Trusted by 16M+ people in 70+ countries.",
      cta: "Try Wise — first transfer fee-free",
      // TODO: Replace once Wise affiliate is approved (Partnerize): wise.com/affiliate-program
      url: "https://wise.com/invite/dic/atulv111",
      palette: "emerald",
    },
  },
  groww: {
    default: {
      icon: "📈",
      title: "Ready to start investing?",
      desc: "Open a free demat account in 5 minutes. Start SIP from ₹100/month. Zero account opening charges.",
      cta: "Open Free Account on Groww",
      // TODO: Replace with user's Groww refer code
      url: "https://groww.in",
      palette: "blue",
    },
    byCountry: {
      US: {
        icon: "📈",
        title: "Start investing in the US market.",
        desc: "Zero-commission stock + ETF trading. Fractional shares from $1. Most major US brokers offer signup bonuses.",
        cta: "See US broker options",
        // TODO: Replace with broker affiliate (e.g. Robinhood, Webull) once approved
        url: "https://wise.com/invite/dic/atulv111",
        palette: "blue",
      },
    },
  },
  investment: {
    default: {
      icon: "💰",
      title: "Want to grow your money?",
      desc: "Start investing in index funds and mutual funds. Build wealth with consistent monthly contributions.",
      cta: "Start Investing Today",
      url: "https://groww.in",
      palette: "amber",
    },
  },
  loan: {
    default: {
      icon: "🏦",
      title: "Compare loan offers (no hard credit pull).",
      desc: "See pre-approved rates from multiple lenders. Lock in the cheapest one. Most platforms only soft-pull your credit.",
      cta: "Compare loan offers",
      // TODO: Add country-specific loan affiliate (US: Credit Karma / LendingTree / SoFi)
      url: "https://wise.com/invite/dic/atulv111",
      palette: "amber",
    },
    byCountry: {
      IN: {
        icon: "🏦",
        title: "Need a personal loan or home loan?",
        desc: "Compare offers from 50+ Indian banks and NBFCs. See pre-approved rates without a hard CIBIL inquiry.",
        cta: "Compare loan offers (India)",
        // TODO: Replace with BankBazaar / Paisabazaar affiliate once approved
        url: "https://wise.com/invite/dic/atulv111",
        palette: "amber",
      },
    },
  },
  hosting: {
    default: {
      icon: "🌐",
      title: "Need your own website? Hosting from $1.99/mo.",
      desc: "Hostinger powers 3M+ sites in 178 countries. Domain + WordPress hosting in 5 minutes. 30-day money-back.",
      cta: "Get Hostinger (up to 60% off)",
      // TODO: Replace with user's Hostinger affiliate link after sign-up at hostinger.com/affiliates
      url: "https://www.hostinger.com/affiliates",
      palette: "violet",
    },
  },
};

// Detect the user's country from their IANA timezone. Lightweight, no network call.
const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US",
  "America/Los_Angeles": "US", "America/Phoenix": "US", "America/Anchorage": "US",
  "Europe/London": "GB",
  "Europe/Berlin": "DE", "Europe/Paris": "FR", "Europe/Rome": "IT", "Europe/Madrid": "ES",
  "Europe/Amsterdam": "NL", "Europe/Stockholm": "SE",
  "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU", "Australia/Perth": "AU",
  "America/Toronto": "CA", "America/Vancouver": "CA",
  "Asia/Singapore": "SG", "Asia/Dubai": "AE", "Asia/Tokyo": "JP", "Asia/Shanghai": "CN",
  "Pacific/Auckland": "NZ",
};

function useDetectedCountry(): string {
  const [country, setCountry] = useState<string>("");
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      setCountry(TIMEZONE_TO_COUNTRY[tz] || "");
    } catch {
      // ignore
    }
  }, []);
  return country;
}

export default function AffiliateCard({ type }: AffiliateCardProps) {
  const country = useDetectedCountry();
  const config = OFFERS[type];
  const offer = (country && config.byCountry?.[country]) || config.default;
  const palette = PALETTES[offer.palette];

  return (
    <div className={`bg-gradient-to-br ${palette.bg} border ${palette.border} rounded-2xl p-5 mt-6`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${palette.iconBg} flex items-center justify-center text-lg shrink-0`}>{offer.icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${palette.title}`}>{offer.title}</p>
          <p className={`text-xs ${palette.desc} mt-1 leading-relaxed`}>{offer.desc}</p>
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`inline-flex items-center gap-1.5 mt-3 text-xs font-semibold ${palette.cta} transition-colors`}
          >
            {offer.cta}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 leading-snug">
            Partner link — supports thecalchub.org at no extra cost to you.
          </p>
        </div>
      </div>
    </div>
  );
}
