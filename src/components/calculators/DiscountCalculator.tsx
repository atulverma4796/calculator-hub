"use client";

import { useState, useEffect } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function DiscountCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [price, setPrice] = useState(100);
  const [discount, setDiscount] = useState(20);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setPrice(detected.defaultPrice * 10);
  }, []);

  const savings = (price * discount) / 100;
  const finalPrice = price - savings;

  const fmt = (v: number) => formatAmount(v, currency);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setPrice(c.defaultPrice * 10); }}
          accentColor="red"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Original Price</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{currency.symbol}</span>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
          </div>
          <input type="range" min={1} max={100000} step={10} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Discount (%)</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} min={0} max={100} className="w-24 text-right text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <input type="range" min={0} max={100} step={1} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full" />
          <div className="flex justify-center gap-2 mt-3">
            {[10, 15, 20, 25, 30, 50, 70].map((d) => (
              <button key={d} type="button" onClick={() => setDiscount(d)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${discount === d ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{d}%</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-red-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-red-200">Original</p>
            <p className="text-xl font-bold line-through opacity-70">{fmt(price)}</p>
          </div>
          <div>
            <p className="text-xs text-red-200">You Save</p>
            <p className="text-xl font-bold text-green-300">{fmt(savings)}</p>
          </div>
          <div>
            <p className="text-xs text-red-200">Final Price</p>
            <p className="text-2xl font-extrabold animate-count-up">{fmt(finalPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
