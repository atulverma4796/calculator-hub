"use client";

import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function MortgageCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [price, setPrice] = useState(300000);
  const [down, setDown] = useState(60000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setPrice(detected.defaultLoan);
    setDown(Math.round(detected.defaultLoan * 0.2));
  }, []);

  const loan = price - down;
  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  const result = useMemo(() => {
    if (loan <= 0 || rate <= 0 || months <= 0) return { monthly: 0, totalPayment: 0, totalInterest: 0 };
    const monthly = (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthly * months;
    const totalInterest = totalPayment - loan;
    return { monthly: Math.round(monthly), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) };
  }, [loan, rate, months, monthlyRate]);

  const pieData = [
    { name: "Principal", value: loan, color: "#6366f1" },
    { name: "Interest", value: result.totalInterest, color: "#f59e0b" },
    { name: "Down Payment", value: down, color: "#10b981" },
  ];

  const fmt = (v: number) => formatAmount(v, currency);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setPrice(c.defaultLoan); setDown(Math.round(c.defaultLoan * 0.2)); }}
            accentColor="sky"
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Home Price</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{currency.symbol}</span>
                <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
              </div>
            </div>
            <input type="range" min={10000} max={5000000} step={5000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Down Payment</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{currency.symbol}</span>
                <input type="number" value={down} onChange={(e) => setDown(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
              </div>
            </div>
            <input type="range" min={0} max={price} step={1000} value={down} onChange={(e) => setDown(Number(e.target.value))} className="w-full" />
            <p className="text-[10px] text-gray-400 mt-1">Down payment: {price > 0 ? ((down / price) * 100).toFixed(1) : 0}% | Loan: {fmt(loan)}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Interest Rate (%)</label>
              <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} step={0.1} className="w-24 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
            </div>
            <input type="range" min={1} max={15} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Term (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 1)} min={1} max={30} className="w-20 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
            </div>
            <div className="flex gap-2 mt-2">
              {[10, 15, 20, 25, 30].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${years === y ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-600"}`}>{y}yr</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-sky-200">
            <p className="text-sm text-sky-100">Monthly Payment</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.monthly)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><p className="text-xs text-sky-200">Total Interest</p><p className="text-lg font-bold text-amber-300">{fmt(result.totalInterest)}</p></div>
              <div><p className="text-xs text-sky-200">Total Cost</p><p className="text-lg font-bold">{fmt(result.totalPayment + down)}</p></div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-4">Cost Breakdown</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-xs text-gray-600">{d.name}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
