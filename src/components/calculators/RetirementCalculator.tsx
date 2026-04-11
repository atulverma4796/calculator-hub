"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function RetirementCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(60);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlySaving, setMonthlySaving] = useState(500);
  const [returnRate, setReturnRate] = useState(10);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setCurrentSavings(detected.defaultSIP * 100);
    setMonthlySaving(detected.defaultSIP * 2);
  }, []);

  const handleCurrencyChange = (c: CurrencyConfig) => {
    setCurrency(c);
    setCurrentSavings(c.defaultSIP * 100);
    setMonthlySaving(c.defaultSIP * 2);
  };

  const result = useMemo(() => {
    const years = retireAge - currentAge;
    if (years <= 0) return { total: currentSavings, invested: currentSavings, returns: 0, chartData: [] };

    const monthlyRate = returnRate / 12 / 100;
    const months = years * 12;

    const existingGrowth = currentSavings * Math.pow(1 + returnRate / 100, years);
    const sipGrowth = returnRate > 0 && monthlySaving > 0
      ? monthlySaving * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : monthlySaving * months;
    const total = existingGrowth + sipGrowth;
    const invested = currentSavings + monthlySaving * months;
    const returns = total - invested;

    const chartData = [];
    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const eg = currentSavings * Math.pow(1 + returnRate / 100, y);
      const sg = y > 0 && returnRate > 0 && monthlySaving > 0
        ? monthlySaving * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate)
        : monthlySaving * m;
      const inv = currentSavings + monthlySaving * m;
      chartData.push({ age: currentAge + y, value: Math.round(eg + sg), invested: Math.round(inv) });
    }

    return { total: Math.round(total), invested: Math.round(invested), returns: Math.round(returns), chartData };
  }, [currentAge, retireAge, currentSavings, monthlySaving, returnRate]);

  const fmt = (v: number) => formatAmount(v, currency);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={handleCurrencyChange}
            accentColor="fuchsia"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value) || 18)} min={18} max={70} className="w-full text-center text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Retire at Age</label>
              <input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value) || 50)} min={currentAge + 1} max={80} className="w-full text-center text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Current Savings</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{currency.symbol}</span>
                <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5" />
              </div>
            </div>
            <input type="range" min={0} max={10000000} step={10000} value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Monthly Saving</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{currency.symbol}</span>
                <input type="number" value={monthlySaving} onChange={(e) => setMonthlySaving(Number(e.target.value) || 0)} className="w-28 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5" />
              </div>
            </div>
            <input type="range" min={0} max={500000} step={1000} value={monthlySaving} onChange={(e) => setMonthlySaving(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Expected Return (%)</label>
              <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value) || 0)} step={0.5} className="w-20 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5" />
            </div>
            <input type="range" min={1} max={20} step={0.5} value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-fuchsia-200">
            <p className="text-sm text-fuchsia-100">Retirement Corpus</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.total)}</p>
            <p className="text-xs text-fuchsia-200 mt-1">at age {retireAge} ({retireAge - currentAge} years from now)</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><p className="text-xs text-fuchsia-200">Total Invested</p><p className="text-lg font-bold text-blue-200">{fmt(result.invested)}</p></div>
              <div><p className="text-xs text-fuchsia-200">Returns Earned</p><p className="text-lg font-bold text-amber-300">{fmt(result.returns)}</p></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-4">Savings Growth</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chartData}>
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="age" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Age", position: "bottom", fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="#d946ef" fill="url(#retGrad)" strokeWidth={2} name="Total Value" />
                  <Area type="monotone" dataKey="invested" stroke="#6366f1" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
