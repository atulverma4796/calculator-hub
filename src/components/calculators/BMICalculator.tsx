"use client";

import { useState, useMemo } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const BMI_CATEGORIES = [
  { min: 0, max: 18.5, label: "Underweight", color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  { min: 18.5, max: 25, label: "Normal", color: "text-green-600", bg: "bg-green-50", bar: "bg-green-500" },
  { min: 25, max: 30, label: "Overweight", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  { min: 30, max: 100, label: "Obese", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" },
];

export default function BMICalculator() {
  const { getString, getNumber } = useInitialParams();
  const [weight, setWeight] = useState(getNumber("weight", 70));
  const [height, setHeight] = useState(getNumber("height", 170));
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">(getString("weightUnit", "kg") as "kg" | "lbs");

  useShareableURL({ weight, height, weightUnit });

  const bmi = useMemo(() => {
    const w = weightUnit === "lbs" ? weight * 0.453592 : weight;
    const h = height / 100;
    if (h <= 0 || w <= 0) return 0;
    return w / (h * h);
  }, [weight, height, weightUnit]);

  const category = BMI_CATEGORIES.find((c) => bmi >= c.min && bmi < c.max) ?? BMI_CATEGORIES[3];
  const normalMin = 18.5 * Math.pow(height / 100, 2);
  const normalMax = 24.9 * Math.pow(height / 100, 2);

  useCalcHistory("bmi", { weight, height, weightUnit }, `BMI: ${bmi.toFixed(1)} — ${category.label}`);

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        setWeight(70);
        setHeight(170);
        setWeightUnit("kg");
      }} pdfData={{
        calculatorName: "BMI Calculator",
        inputs: [
          { label: "Weight", value: `${weight} ${weightUnit}` },
          { label: "Height", value: `${height} cm` },
        ],
        results: [
          { label: "BMI", value: bmi.toFixed(1) },
          { label: "Category", value: category.label },
          { label: "Healthy Range", value: `${normalMin.toFixed(0)} - ${normalMax.toFixed(0)} kg` },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Unit toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Weight in:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button type="button" onClick={() => setWeightUnit("kg")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${weightUnit === "kg" ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>kg</button>
            <button type="button" onClick={() => setWeightUnit("lbs")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${weightUnit === "lbs" ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>lbs</button>
          </div>
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight ({weightUnit})</label>
            <div className="flex items-center gap-1">
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <VoiceInputButton onResult={(v) => setWeight(v)} />
            </div>
          </div>
          <input type="range" min={weightUnit === "kg" ? 30 : 66} max={weightUnit === "kg" ? 200 : 440} step={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Height (cm)</label>
            <div className="flex items-center gap-1">
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value) || 0)} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <VoiceInputButton onResult={(v) => setHeight(v)} />
            </div>
          </div>
          <input type="range" min={100} max={220} step={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Result */}
      <div className={`rounded-2xl p-6 shadow-sm border ${category.bg} border-gray-200`}>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your BMI</p>
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
          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            <span>Underweight</span>
            <span>Normal</span>
            <span>Overweight</span>
            <span>Obese</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Healthy weight for your height: <strong>{normalMin.toFixed(0)} - {normalMax.toFixed(0)} kg</strong>
        </p>
      </div>


      <InsightCard
        icon={category.label === "Normal" ? "✅" : category.label === "Obese" ? "⚠️" : "📊"}
        title="BMI Insight"
        color={category.label === "Normal" ? "green" : category.label === "Overweight" ? "amber" : category.label === "Obese" ? "red" : "blue"}
        insight={`Your BMI is ${bmi.toFixed(1)} — ${category.label}. Healthy weight for ${height}cm: ${normalMin.toFixed(0)}-${normalMax.toFixed(0)} kg.`}
        tip={category.label === "Normal" ? "You're in the healthy range — maintain your current lifestyle!" : category.label !== "Normal" ? `A healthy BMI (18.5-24.9) for your height means ${normalMin.toFixed(0)}-${normalMax.toFixed(0)} kg.` : undefined}
      />

      <CalculationHistory
        calculator="bmi"
        onLoad={(inputs) => {
          setWeight(Number(inputs.weight));
          setHeight(Number(inputs.height));
          setWeightUnit(String(inputs.weightUnit) as "kg" | "lbs");
        }}
      />

      {CALCULATOR_CONTENT.bmi && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.bmi}
          calculatorName="BMI Calculator"
          dynamicExample={{
            setup: `You weigh ${weight} ${weightUnit} and are ${height} cm tall.`,
            calculation: `BMI = weight (kg) / height (m)^2. ${weightUnit === "lbs" ? `First, convert ${weight} lbs to ${(weight * 0.453592).toFixed(1)} kg. Then, ` : ""}${height} cm = ${(height / 100).toFixed(2)} m. So BMI = ${weightUnit === "lbs" ? (weight * 0.453592).toFixed(1) : weight} / (${(height / 100).toFixed(2)})^2 = ${bmi.toFixed(1)}.`,
            result: `Your BMI is ${bmi.toFixed(1)}, which falls in the "${category.label}" category. ${category.label === "Normal" ? `Great — you're in the healthy range! A healthy weight for your height is ${normalMin.toFixed(0)}-${normalMax.toFixed(0)} kg.` : `A healthy BMI (18.5-24.9) for your height means weighing between ${normalMin.toFixed(0)}-${normalMax.toFixed(0)} kg.`}`,
          }}
        />
      )}
    </div>
  );
}
