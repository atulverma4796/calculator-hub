"use client";

import { useState, useMemo } from "react";

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: "Underweight", color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  { min: 18.5, max: 25, label: "Normal", color: "text-green-600", bg: "bg-green-50", bar: "bg-green-500" },
  { min: 25, max: 30, label: "Overweight", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  { min: 30, max: 100, label: "Obese", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" },
];

export default function BMICalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");

  const bmi = useMemo(() => {
    const w = weightUnit === "lbs" ? weight * 0.453592 : weight;
    const h = height / 100;
    if (h <= 0 || w <= 0) return 0;
    return w / (h * h);
  }, [weight, height, weightUnit]);

  const category = BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ?? BMI_CATEGORIES[3];
  const normalMin = 18.5 * Math.pow(height / 100, 2);
  const normalMax = 24.9 * Math.pow(height / 100, 2);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Unit toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Weight in:</span>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button type="button" onClick={() => setWeightUnit("kg")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${weightUnit === "kg" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"}`}>kg</button>
            <button type="button" onClick={() => setWeightUnit("lbs")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${weightUnit === "lbs" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"}`}>lbs</button>
          </div>
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Weight ({weightUnit})</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <input type="range" min={weightUnit === "kg" ? 30 : 66} max={weightUnit === "kg" ? 200 : 440} step={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          </div>
          <input type="range" min={100} max={220} step={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Result */}
      <div className={`rounded-2xl p-6 shadow-sm border ${category.bg} border-gray-200`}>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600">Your BMI</p>
          <p className={`text-5xl font-extrabold mt-2 ${category.color} animate-count-up`}>{bmi.toFixed(1)}</p>
          <p className={`text-lg font-bold mt-2 ${category.color}`}>{category.label}</p>
        </div>

        {/* BMI Scale */}
        <div className="mt-6">
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="flex-1 bg-blue-400" />
            <div className="flex-1 bg-green-400" />
            <div className="flex-1 bg-amber-400" />
            <div className="flex-1 bg-red-400" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Healthy weight for your height: <strong>{normalMin.toFixed(0)} - {normalMax.toFixed(0)} kg</strong>
        </p>
      </div>
    </div>
  );
}
