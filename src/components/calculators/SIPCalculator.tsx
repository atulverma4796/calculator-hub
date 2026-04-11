"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function SIPCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setMonthly(detected.defaultSIP);
  }, []);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;
    const invested = monthly * months;

    if (monthly <= 0 || rate <= 0 || years <= 0) {
      return { invested: 0, futureValue: 0, returns: 0, chartData: [] };
    }

    const futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const returns = futureValue - invested;

    const chartData: { year: number; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const inv = monthly * m;
      const fv = monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      chartData.push({ year: y, invested: Math.round(inv), value: Math.round(fv) });
    }

    return { invested: Math.round(invested), futureValue: Math.round(futureValue), returns: Math.round(returns), chartData };
  }, [monthly, rate, years]);

  const fmt = (v: number) => formatAmount(v, currency);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setMonthly(c.defaultSIP); }}
            accentColor="emerald"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Monthly Investment</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{currency.symbol}</span>
                <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
              </div>
            </div>
            <input type="range" min={500} max={500000} step={500} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Expected Return Rate (% p.a.)</label>
              <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} step={0.5} className="w-24 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Time Period (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 1)} min={1} max={40} className="w-20 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
            <p className="text-sm font-medium text-emerald-200">Total Value</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.futureValue)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-200">Invested</p>
                <p className="text-lg font-bold text-blue-200">{fmt(result.invested)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200">Returns</p>
                <p className="text-lg font-bold text-amber-300">{fmt(result.returns)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-4">Growth Over Time</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#colorValue)" strokeWidth={2} name="Total Value" />
                  <Area type="monotone" dataKey="invested" stroke="#6366f1" fill="url(#colorInvested)" strokeWidth={2} name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
