"use client";

import { useState, useEffect } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function TipCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [bill, setBill] = useState(50);
  const [tipPct, setTipPct] = useState(15);
  const [people, setPeople] = useState(1);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setBill(detected.defaultBill);
  }, []);

  const tipAmount = (bill * tipPct) / 100;
  const total = bill + tipAmount;
  const perPerson = people > 0 ? total / people : total;
  const tipPerPerson = people > 0 ? tipAmount / people : tipAmount;

  const fmt = (v: number) => formatAmount(v, currency);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setBill(c.defaultBill); }}
          accentColor="yellow"
        />

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Bill Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">{currency.symbol}</span>
            <input type="number" value={bill} onChange={(e) => setBill(Number(e.target.value) || 0)} className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-2xl font-bold text-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">Tip Percentage</label>
          <div className="grid grid-cols-5 gap-2">
            {[10, 15, 18, 20, 25].map((t) => (
              <button key={t} type="button" onClick={() => setTipPct(t)} className={`py-3 rounded-xl text-sm font-bold transition-all ${tipPct === t ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}%</button>
            ))}
          </div>
          <div className="mt-3">
            <input type="range" min={0} max={50} step={1} value={tipPct} onChange={(e) => setTipPct(Number(e.target.value))} className="w-full" />
            <p className="text-center text-xs text-gray-400 mt-1">Custom: {tipPct}%</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Split Between</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors">-</button>
            <span className="text-2xl font-extrabold text-gray-900 w-12 text-center">{people}</span>
            <button type="button" onClick={() => setPeople(people + 1)} className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 font-bold text-lg hover:bg-gray-200 transition-colors">+</button>
            <span className="text-sm text-gray-500 ml-2">{people === 1 ? "person" : "people"}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-yellow-100">Tip Amount</p>
            <p className="text-2xl font-extrabold mt-0.5">{fmt(tipAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-yellow-100">Total</p>
            <p className="text-2xl font-extrabold mt-0.5 animate-count-up">{fmt(total)}</p>
          </div>
        </div>
        {people > 1 && (
          <div className="mt-4 pt-4 border-t border-yellow-400/30 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-yellow-100">Tip per Person</p>
              <p className="text-lg font-bold">{fmt(tipPerPerson)}</p>
            </div>
            <div>
              <p className="text-xs text-yellow-100">Total per Person</p>
              <p className="text-lg font-bold">{fmt(perPerson)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
