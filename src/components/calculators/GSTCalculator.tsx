"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

const GST_RATES = [5, 12, 18, 28];

export default function GSTCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [amount, setAmount] = useState(100);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<"add" | "remove">("add");

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setAmount(detected.defaultPrice * 10);
  }, []);

  const result = useMemo(() => {
    if (mode === "add") {
      const gstAmount = (amount * gstRate) / 100;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return { original: amount, gstAmount, cgst, sgst, total: amount + gstAmount };
    } else {
      const original = (amount * 100) / (100 + gstRate);
      const gstAmount = amount - original;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      return { original: Math.round(original), gstAmount: Math.round(gstAmount), cgst: Math.round(cgst), sgst: Math.round(sgst), total: amount };
    }
  }, [amount, gstRate, mode]);

  const fmt = (v: number) => formatAmount(v, currency);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setAmount(c.defaultPrice * 10); }}
          accentColor="violet"
        />

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button type="button" onClick={() => setMode("add")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "add" ? "bg-white text-violet-700 shadow-sm" : "text-gray-500"}`}>
            Add GST (+)
          </button>
          <button type="button" onClick={() => setMode("remove")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "remove" ? "bg-white text-violet-700 shadow-sm" : "text-gray-500"}`}>
            Remove GST (-)
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            {mode === "add" ? "Amount (Before GST)" : "Amount (Including GST)"}
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{currency.symbol}</span>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-lg font-bold text-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
          </div>
        </div>

        {/* GST Rate */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">GST Rate</label>
          <div className="grid grid-cols-4 gap-2">
            {GST_RATES.map((r) => (
              <button key={r} type="button" onClick={() => setGstRate(r)} className={`py-3 rounded-xl text-sm font-bold transition-all ${gstRate === r ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {r}%
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-400">Custom rate:</span>
            <input type="number" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value) || 0)} step={0.5} min={0} max={100} className="w-20 text-center text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-violet-500" />
            <span className="text-xs text-gray-400">%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-violet-200">{mode === "add" ? "Original Amount" : "Amount Before GST"}</p>
            <p className="text-xl font-bold mt-0.5">{fmt(result.original)}</p>
          </div>
          <div>
            <p className="text-xs text-violet-200">GST Amount ({gstRate}%)</p>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{fmt(result.gstAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-violet-200">CGST ({gstRate / 2}%)</p>
            <p className="text-lg font-semibold mt-0.5">{fmt(result.cgst)}</p>
          </div>
          <div>
            <p className="text-xs text-violet-200">SGST ({gstRate / 2}%)</p>
            <p className="text-lg font-semibold mt-0.5">{fmt(result.sgst)}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-violet-500/30">
          <p className="text-sm text-violet-200">Total Amount</p>
          <p className="text-3xl font-extrabold animate-count-up">{fmt(result.total)}</p>
        </div>
      </div>
    </div>
  );
}
