"use client";

import { useState } from "react";

export default function PercentageCalculator() {
  const [num1, setNum1] = useState(200);
  const [pct1, setPct1] = useState(15);

  const [num2a, setNum2a] = useState(50);
  const [num2b, setNum2b] = useState(200);

  const [num3a, setNum3a] = useState(100);
  const [num3b, setNum3b] = useState(150);

  const result1 = (num1 * pct1) / 100;
  const result2 = num2b !== 0 ? (num2a / num2b) * 100 : 0;
  const result3 = num3a !== 0 ? ((num3b - num3a) / num3a) * 100 : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Calculator 1: What is X% of Y? */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-4">What is X% of Y?</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600">What is</span>
          <input type="number" value={pct1} onChange={(e) => setPct1(Number(e.target.value) || 0)} className="w-20 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <span className="text-sm text-gray-600">% of</span>
          <input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value) || 0)} className="w-28 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <span className="text-sm text-gray-600">?</span>
        </div>
        <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
          <span className="text-sm font-medium">Result:</span>
          <span className="text-xl font-extrabold animate-count-up">{result1.toFixed(2)}</span>
        </div>
      </div>

      {/* Calculator 2: X is what percent of Y? */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-4">X is what percent of Y?</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <input type="number" value={num2a} onChange={(e) => setNum2a(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <span className="text-sm text-gray-600">is what % of</span>
          <input type="number" value={num2b} onChange={(e) => setNum2b(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <span className="text-sm text-gray-600">?</span>
        </div>
        <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
          <span className="text-sm font-medium">Result:</span>
          <span className="text-xl font-extrabold animate-count-up">{result2.toFixed(2)}%</span>
        </div>
      </div>

      {/* Calculator 3: Percentage change */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Percentage Change</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600">From</span>
          <input type="number" value={num3a} onChange={(e) => setNum3a(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <span className="text-sm text-gray-600">to</span>
          <input type="number" value={num3b} onChange={(e) => setNum3b(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
        </div>
        <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
          <span className="text-sm font-medium">{result3 >= 0 ? "Increase" : "Decrease"}:</span>
          <span className="text-xl font-extrabold animate-count-up">{Math.abs(result3).toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}
