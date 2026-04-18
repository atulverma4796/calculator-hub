"use client";

interface AffiliateCardProps {
  type: "wise" | "groww" | "investment";
}

const CARDS = {
  wise: {
    icon: "💸",
    bg: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
    title: "Need to actually send money abroad?",
    titleColor: "text-emerald-900 dark:text-emerald-300",
    desc: "Wise offers real mid-market exchange rates with low, transparent fees — no hidden markups. Trusted by 16M+ people worldwide.",
    descColor: "text-emerald-700 dark:text-emerald-400",
    cta: "Try Wise — your first transfer is free",
    ctaColor: "text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300",
    url: "https://wise.com/invite/dic/atulv111",
  },
  groww: {
    icon: "📈",
    bg: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30",
    border: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    title: "Ready to start investing?",
    titleColor: "text-blue-900 dark:text-blue-300",
    desc: "Open a free demat account in 5 minutes. Start SIP with as low as ₹100/month. Zero account opening charges.",
    descColor: "text-blue-700 dark:text-blue-400",
    cta: "Open Free Account on Groww",
    ctaColor: "text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300",
    url: "https://groww.in",
  },
  investment: {
    icon: "💰",
    bg: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
    border: "border-amber-200 dark:border-amber-800",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    title: "Want to grow your money?",
    titleColor: "text-amber-900 dark:text-amber-300",
    desc: "Start investing in index funds and mutual funds with zero commission. Build wealth with systematic monthly investments.",
    descColor: "text-amber-700 dark:text-amber-400",
    cta: "Start Investing Today",
    ctaColor: "text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300",
    url: "https://groww.in",
  },
};

export default function AffiliateCard({ type }: AffiliateCardProps) {
  const c = CARDS[type];

  return (
    <div className={`bg-gradient-to-br ${c.bg} border ${c.border} rounded-2xl p-5 mt-6`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center text-lg shrink-0`}>{c.icon}</div>
        <div>
          <p className={`text-sm font-semibold ${c.titleColor}`}>{c.title}</p>
          <p className={`text-xs ${c.descColor} mt-1 leading-relaxed`}>{c.desc}</p>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`inline-flex items-center gap-1.5 mt-3 text-xs font-semibold ${c.ctaColor} transition-colors`}
          >
            {c.cta}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
