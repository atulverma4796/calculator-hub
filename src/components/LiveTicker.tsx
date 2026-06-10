"use client";

// Each entry is a worked example, NOT a live data feed. Earlier
// versions claimed "ECB Live" on a hard-coded FX rate and showed a
// fixed age line ("30 years, 9 months") that quietly went stale every
// month. Anything that would drift with real data or real time has
// been re-phrased so the result holds whenever the page loads.
const TICKER_ITEMS = [
  { icon: "🏠", text: "Home Loan ₹50L @ 8.5% for 20yr = ₹43,391/mo" },
  { icon: "📈", text: "SIP ₹10K/mo for 20yr @ 12% = ₹99.91L (≈₹1 Cr)" },
  { icon: "💰", text: "₹5L compounded monthly @ 8% for 10yr = ₹11.10L" },
  { icon: "🧾", text: "₹10,000 + 18% GST = ₹11,800" },
  { icon: "💱", text: "1 USD ≈ ₹84.50 (indicative)" },
  { icon: "⚖️", text: "BMI: 70 kg, 170 cm = 24.2 (Normal)" },
  { icon: "🎂", text: "Age in years, months, weeks & days — precise to the day" },
  { icon: "🏡", text: "Mortgage $300K @ 6.5% for 30yr = $1,896/mo" },
  { icon: "%", text: "15% of 200 = 30" },
  { icon: "🏷️", text: "30% off $1,000 = Save $300, Pay $700" },
  { icon: "💼", text: "$50,000/yr = $24.04/hr (40hr/wk)" },
  { icon: "🍽️", text: "Bill $85 + 18% tip = $100.30" },
  { icon: "⛽", text: "500 km @ 15 km/L @ ₹100/L = ₹3,333" },
  { icon: "🏖️", text: "Save ₹10K/mo for 30yr @ 10% = ₹2.28 Cr corpus" },
  { icon: "📊", text: "₹12L income → Tax ₹0 (India New Regime, 87A rebate)" },
];

export default function LiveTicker() {
  // Double the items for seamless loop
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 py-3 overflow-hidden">
      <div className="animate-ticker flex items-center gap-8 whitespace-nowrap">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-sm">{item.icon}</span>
            <span className="text-sm font-medium text-white/90">{item.text}</span>
            <span className="text-white/30 ml-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
