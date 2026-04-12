"use client";

import { useState, useMemo } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const BODY_FAT_CATEGORIES_MALE = [
  { min: 0, max: 6, label: "Essential Fat", color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  { min: 6, max: 14, label: "Athletes", color: "text-green-600", bg: "bg-green-50", bar: "bg-green-500" },
  { min: 14, max: 18, label: "Fitness", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
  { min: 18, max: 25, label: "Average", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  { min: 25, max: 100, label: "Obese", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" },
];

const BODY_FAT_CATEGORIES_FEMALE = [
  { min: 0, max: 14, label: "Essential Fat", color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  { min: 14, max: 21, label: "Athletes", color: "text-green-600", bg: "bg-green-50", bar: "bg-green-500" },
  { min: 21, max: 25, label: "Fitness", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" },
  { min: 25, max: 32, label: "Average", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  { min: 32, max: 100, label: "Obese", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" },
];

export default function BodyFatCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [gender, setGender] = useState<"male" | "female">(getString("gender", "male") as "male" | "female");
  const [unit, setUnit] = useState<"metric" | "imperial">(getString("unit", "metric") as "metric" | "imperial");
  const [height, setHeight] = useState(getNumber("height", 175));
  const [neck, setNeck] = useState(getNumber("neck", 38));
  const [waist, setWaist] = useState(getNumber("waist", 85));
  const [hip, setHip] = useState(getNumber("hip", 95));
  const [weight, setWeight] = useState(getNumber("weight", 80));

  useShareableURL({ gender, unit, height, neck, waist, hip: gender === "female" ? hip : undefined, weight });

  const result = useMemo(() => {
    // Convert to cm if imperial (inches)
    const h = unit === "imperial" ? height * 2.54 : height;
    const n = unit === "imperial" ? neck * 2.54 : neck;
    const w = unit === "imperial" ? waist * 2.54 : waist;
    const hp = unit === "imperial" ? hip * 2.54 : hip;
    const weightKg = unit === "imperial" ? weight * 0.453592 : weight;

    if (h <= 0 || n <= 0 || w <= 0 || weightKg <= 0) return null;
    if (gender === "female" && hp <= 0) return null;

    let bodyFat: number;
    if (gender === "male") {
      // US Navy Method: Male
      const diff = w - n;
      if (diff <= 0) return null;
      bodyFat = 86.010 * Math.log10(diff) - 70.041 * Math.log10(h) + 36.76;
    } else {
      // US Navy Method: Female
      const sum = w + hp - n;
      if (sum <= 0) return null;
      bodyFat = 163.205 * Math.log10(sum) - 97.684 * Math.log10(h) - 78.387;
    }

    bodyFat = Math.max(0, Math.min(60, bodyFat));
    const fatMass = (bodyFat / 100) * weightKg;
    const leanMass = weightKg - fatMass;

    const categories = gender === "male" ? BODY_FAT_CATEGORIES_MALE : BODY_FAT_CATEGORIES_FEMALE;
    const category = categories.find((c) => bodyFat >= c.min && bodyFat < c.max) ?? categories[categories.length - 1];

    const athleteRange = gender === "male" ? "6-14%" : "14-21%";

    return { bodyFat, fatMass, leanMass, category, athleteRange, weightKg };
  }, [gender, unit, height, neck, waist, hip, weight]);

  useCalcHistory("bodyfat", { gender, unit, height, neck, waist, hip, weight }, result ? `Body Fat: ${result.bodyFat.toFixed(1)}% — ${result.category.label}` : "");

  const onReset = () => {
    setGender("male");
    setUnit("metric");
    setHeight(175);
    setNeck(38);
    setWaist(85);
    setHip(95);
    setWeight(80);
  };

  const unitLabel = unit === "metric" ? "cm" : "in";
  const weightLabel = unit === "metric" ? "kg" : "lbs";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ActionButtons onReset={onReset} pdfData={{
        calculatorName: "Body Fat Calculator",
        inputs: [
          { label: "Gender", value: gender },
          { label: "Weight", value: `${weight} ${weightLabel}` },
          { label: "Height", value: `${height} ${unitLabel}` },
          { label: "Neck", value: `${neck} ${unitLabel}` },
          { label: "Waist", value: `${waist} ${unitLabel}` },
          ...(gender === "female" ? [{ label: "Hip", value: `${hip} ${unitLabel}` }] : []),
        ],
        results: result ? [
          { label: "Body Fat", value: `${result.bodyFat.toFixed(1)}%` },
          { label: "Fat Mass", value: `${result.fatMass.toFixed(1)} kg` },
          { label: "Lean Mass", value: `${result.leanMass.toFixed(1)} kg` },
          { label: "Category", value: result.category.label },
        ] : [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Unit toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Units:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button type="button" onClick={() => setUnit("metric")} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${unit === "metric" ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Metric (cm/kg)</button>
            <button type="button" onClick={() => setUnit("imperial")} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${unit === "imperial" ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Imperial (in/lbs)</button>
          </div>
        </div>

        {/* Gender toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Gender:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button type="button" onClick={() => setGender("male")} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${gender === "male" ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Male</button>
            <button type="button" onClick={() => setGender("female")} className={`flex-1 sm:flex-none px-4 py-2.5 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${gender === "female" ? "bg-white dark:bg-gray-700 text-pink-700 dark:text-pink-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Female</button>
          </div>
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight ({weightLabel})</label>
            <div className="flex items-center gap-1">
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
              <VoiceInputButton onResult={(v) => setWeight(v)} />
            </div>
          </div>
          <input type="range" min={unit === "metric" ? 30 : 66} max={unit === "metric" ? 200 : 440} step={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Height ({unitLabel})</label>
            <div className="flex items-center gap-1">
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
              <VoiceInputButton onResult={(v) => setHeight(v)} />
            </div>
          </div>
          <input type="range" min={unit === "metric" ? 100 : 40} max={unit === "metric" ? 220 : 87} step={unit === "metric" ? 1 : 0.5} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
        </div>

        {/* Neck */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Neck circumference ({unitLabel})</label>
            <div className="flex items-center gap-1">
              <input type="number" value={neck} onChange={(e) => setNeck(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
              <VoiceInputButton onResult={(v) => setNeck(v)} />
            </div>
          </div>
          <input type="range" min={unit === "metric" ? 20 : 8} max={unit === "metric" ? 60 : 24} step={unit === "metric" ? 0.5 : 0.25} value={neck} onChange={(e) => setNeck(Number(e.target.value))} className="w-full" />
        </div>

        {/* Waist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Waist circumference ({unitLabel})</label>
            <div className="flex items-center gap-1">
              <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
              <VoiceInputButton onResult={(v) => setWaist(v)} />
            </div>
          </div>
          <input type="range" min={unit === "metric" ? 50 : 20} max={unit === "metric" ? 150 : 60} step={unit === "metric" ? 0.5 : 0.25} value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full" />
        </div>

        {/* Hip (women only) */}
        {gender === "female" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hip circumference ({unitLabel})</label>
              <div className="flex items-center gap-1">
                <input type="number" value={hip} onChange={(e) => setHip(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
                <VoiceInputButton onResult={(v) => setHip(v)} />
              </div>
            </div>
            <input type="range" min={unit === "metric" ? 60 : 24} max={unit === "metric" ? 160 : 63} step={unit === "metric" ? 0.5 : 0.25} value={hip} onChange={(e) => setHip(Number(e.target.value))} className="w-full" />
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <>
          <div className={`rounded-2xl p-6 shadow-sm border ${result.category.bg} border-gray-200 dark:border-gray-700`}>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Body Fat Percentage</p>
              <p className={`text-5xl font-extrabold mt-2 ${result.category.color} animate-count-up`}>{result.bodyFat.toFixed(1)}%</p>
              <p className={`text-lg font-bold mt-2 ${result.category.color}`}>{result.category.label}</p>
            </div>

            {/* Category scale */}
            <div className="mt-6">
              <div className="flex h-3 rounded-full overflow-hidden">
                <div className="flex-1 bg-blue-400" />
                <div className="flex-1 bg-green-400" />
                <div className="flex-1 bg-emerald-400" />
                <div className="flex-1 bg-amber-400" />
                <div className="flex-1 bg-red-400" />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                <span>Essential</span>
                <span>Athletes</span>
                <span>Fitness</span>
                <span>Average</span>
                <span>Obese</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Fat Mass</p>
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 mt-1">{result.fatMass.toFixed(1)} kg</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Lean Mass</p>
              <p className="text-2xl font-extrabold text-green-600 dark:text-green-400 mt-1">{result.leanMass.toFixed(1)} kg</p>
            </div>
          </div>

          <InsightCard
            icon="📏"
            title="Body Fat Insight"
            color={result.category.label === "Fitness" || result.category.label === "Athletes" ? "green" : result.category.label === "Average" ? "amber" : result.category.label === "Obese" ? "red" : "blue"}
            insight={`Your body fat is ${result.bodyFat.toFixed(1)}% — categorized as "${result.category.label}". Athletes typically maintain ${result.athleteRange}.`}
            tip={`You have ${result.fatMass.toFixed(1)} kg of fat mass and ${result.leanMass.toFixed(1)} kg of lean mass. The US Navy method uses circumference measurements for estimation.`}
          />
        </>
      )}

      <CalculationHistory
        calculator="bodyfat"
        onLoad={(inputs) => {
          setGender(String(inputs.gender) as "male" | "female");
          setUnit(String(inputs.unit) as "metric" | "imperial");
          setHeight(Number(inputs.height));
          setNeck(Number(inputs.neck));
          setWaist(Number(inputs.waist));
          setHip(Number(inputs.hip));
          setWeight(Number(inputs.weight));
        }}
      />
    </div>
  );
}
