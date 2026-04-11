"use client";

import { useState, useEffect } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function SalaryCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [amount, setAmount] = useState(50000);
  const [inputType, setInputType] = useState<"annual" | "monthly" | "weekly" | "daily" | "hourly">("annual");
  const [hoursPerWeek, setHoursPerWeek] = useState(40);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setAmount(detected.defaultSalary);
  }, []);

  const toAnnual = () => {
    switch (inputType) {
      case "annual": return amount;
      case "monthly": return amount * 12;
      case "weekly": return amount * 52;
      case "daily": return amount * 260;
      case "hourly": return amount * hoursPerWeek * 52;
    }
  };

  const annual = toAnnual();
  const monthly = annual / 12;
  const weekly = annual / 52;
  const daily = annual / 260;
  const hourly = hoursPerWeek > 0 ? annual / (hoursPerWeek * 52) : 0;

  const fmt = (v: number) => formatAmount(v, currency);

  const rows = [
    { label: "Hourly", value: hourly, period: "per hour" },
    { label: "Daily", value: daily, period: "per day" },
    { label: "Weekly", value: weekly, period: "per week" },
    { label: "Monthly", value: monthly, period: "per month" },
    { label: "Annual", value: annual, period: "per year" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setAmount(c.defaultSalary); }}
          accentColor="indigo"
        />

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">I earn</label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[140px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{currency.symbol}</span>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl text-lg font-bold text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
            <select value={inputType} onChange={(e) => setInputType(e.target.value as typeof inputType)} className="px-4 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
              <option value="hourly">Per Hour</option>
              <option value="daily">Per Day</option>
              <option value="weekly">Per Week</option>
              <option value="monthly">Per Month</option>
              <option value="annual">Per Year</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Hours per Week</label>
            <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value) || 1)} min={1} max={80} className="w-20 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5" />
          </div>
          <input type="range" min={1} max={80} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Results */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        {rows.map((row, i) => (
          <div key={row.label} className={`flex items-center justify-between px-6 py-4 ${i !== rows.length - 1 ? "border-b border-gray-100" : ""} ${row.label.toLowerCase() === inputType ? "bg-indigo-50" : ""}`}>
            <div>
              <p className="text-sm font-bold text-gray-800">{row.label}</p>
              <p className="text-xs text-gray-400">{row.period}</p>
            </div>
            <p className={`text-xl font-extrabold ${row.label.toLowerCase() === inputType ? "text-indigo-600" : "text-gray-900"} animate-count-up`}>
              {fmt(row.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
