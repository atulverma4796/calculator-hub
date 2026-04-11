"use client";

const TICKER_ITEMS = [
  { icon: "🏠", text: "Home Loan ₹50L @ 8.5% = ₹38,446/mo" },
  { icon: "📈", text: "SIP ₹10K/mo for 20yr @ 12% = ₹1.05 Cr" },
  { icon: "💰", text: "₹5L compounded monthly @ 8% for 10yr = ₹11.05L" },
  { icon: "🧾", text: "₹10,000 + 18% GST = ₹11,800" },
  { icon: "💱", text: "1 USD = ₹93.09 (ECB Live)" },
  { icon: "⚖️", text: "BMI: 70kg, 170cm = 24.2 (Normal)" },
  { icon: "🎂", text: "Born June 15, 1995 = 30 years, 9 months" },
  { icon: "🏡", text: "Mortgage $300K @ 6.5% for 30yr = $1,896/mo" },
  { icon: "%", text: "15% of 200 = 30" },
  { icon: "🏷️", text: "30% off $1,000 = Save $300, Pay $700" },
  { icon: "💼", text: "$50,000/yr = $24.04/hr (40hr/wk)" },
  { icon: "🍽️", text: "Bill $85 + 18% tip = $100.30" },
  { icon: "⛽", text: "500km @ 15km/L @ ₹100/L = ₹3,333" },
  { icon: "🏖️", text: "Save ₹10K/mo from age 30 → ₹3.5 Cr at 60" },
  { icon: "📊", text: "₹10L income → Tax ₹60,000 (India New Regime)" },
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
