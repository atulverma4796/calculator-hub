"use client";

import { useState, useMemo } from "react";

const TAX_REGIMES = {
  india_new: {
    name: "India (New Regime 2026)",
    currency: "\u20B9",
    brackets: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 700000, rate: 5 },
      { min: 700000, max: 1000000, rate: 10 },
      { min: 1000000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: Infinity, rate: 30 },
    ],
  },
  us: {
    name: "USA (Federal 2026)",
    currency: "$",
    brackets: [
      { min: 0, max: 11600, rate: 10 },
      { min: 11600, max: 47150, rate: 12 },
      { min: 47150, max: 100525, rate: 22 },
      { min: 100525, max: 191950, rate: 24 },
      { min: 191950, max: 243725, rate: 32 },
      { min: 243725, max: 609350, rate: 35 },
      { min: 609350, max: Infinity, rate: 37 },
    ],
  },
  uk: {
    name: "UK (2026/27)",
    currency: "\u00A3",
    brackets: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12570, max: 50270, rate: 20 },
      { min: 50270, max: 125140, rate: 40 },
      { min: 125140, max: Infinity, rate: 45 },
    ],
  },
};

type RegimeKey = keyof typeof TAX_REGIMES;

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(1000000);
  const [regime, setRegime] = useState<RegimeKey>("india_new");

  const r = TAX_REGIMES[regime];

  const result = useMemo(() => {
    let tax = 0;
    const breakdown: { bracket: string; taxable: number; rate: number; tax: number }[] = [];

    for (const b of r.brackets) {
      if (income <= b.min) break;
      const taxable = Math.min(income, b.max) - b.min;
      const t = (taxable * b.rate) / 100;
      tax += t;
      if (taxable > 0) {
        breakdown.push({
          bracket: b.max === Infinity ? `${r.currency}${b.min.toLocaleString()}+` : `${r.currency}${b.min.toLocaleString()} - ${r.currency}${b.max.toLocaleString()}`,
          taxable,
          rate: b.rate,
          tax: Math.round(t),
        });
      }
    }

    const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
    const afterTax = income - tax;

    return { tax: Math.round(tax), effectiveRate, afterTax: Math.round(afterTax), breakdown };
  }, [income, r]);

  const fmt = (v: number) => `${r.currency}${v.toLocaleString()}`;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Tax Regime</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(TAX_REGIMES) as [RegimeKey, typeof TAX_REGIMES[RegimeKey]][]).map(([key, val]) => (
              <button key={key} type="button" onClick={() => setRegime(key)} className={`px-4 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${regime === key ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500"}`}>{val.name}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Annual Income</label>
            <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value) || 0)} className="w-36 text-right text-sm font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5" />
          </div>
          <input type="range" min={0} max={regime === "india_new" ? 5000000 : 500000} step={10000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Result card */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-teal-100">Tax Payable</p>
            <p className="text-2xl font-extrabold text-amber-300 animate-count-up">{fmt(result.tax)}</p>
          </div>
          <div>
            <p className="text-xs text-teal-100">Effective Rate</p>
            <p className="text-2xl font-extrabold animate-count-up">{result.effectiveRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-teal-100">After Tax</p>
            <p className="text-2xl font-extrabold text-green-300 animate-count-up">{fmt(result.afterTax)}</p>
          </div>
        </div>
      </div>

      {/* Bracket breakdown */}
      {result.breakdown.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b"><h3 className="text-sm font-bold text-gray-700">Tax Bracket Breakdown</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Bracket</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Taxable</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.breakdown.map((row) => (
                  <tr key={row.bracket} className="hover:bg-teal-50/50">
                    <td className="px-4 py-2.5 text-gray-700">{row.bracket}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.taxable)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-700">{row.rate}%</td>
                    <td className="px-4 py-2.5 text-right font-bold text-amber-700">{fmt(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
