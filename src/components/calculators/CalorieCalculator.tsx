"use client";

import { useState, useMemo } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Sedentary", desc: "Little or no exercise" },
  { value: 1.375, label: "Light", desc: "Light exercise 1-3 days/week" },
  { value: 1.55, label: "Moderate", desc: "Moderate exercise 3-5 days/week" },
  { value: 1.725, label: "Active", desc: "Hard exercise 6-7 days/week" },
  { value: 1.9, label: "Very Active", desc: "Very hard exercise, physical job" },
];

export default function CalorieCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [age, setAge] = useState(getNumber("age", 25));
  const [gender, setGender] = useState<"male" | "female">(getString("gender", "male") as "male" | "female");
  const [weight, setWeight] = useState(getNumber("weight", 70));
  const [height, setHeight] = useState(getNumber("height", 170));
  const [heightFt, setHeightFt] = useState(getNumber("heightFt", 5));
  const [heightIn, setHeightIn] = useState(getNumber("heightIn", 7));
  const [activityLevel, setActivityLevel] = useState(getNumber("activity", 1.55));
  const [unit, setUnit] = useState<"metric" | "imperial">(getString("unit", "metric") as "metric" | "imperial");

  useShareableURL({ age, gender, weight, height: unit === "metric" ? height : undefined, heightFt: unit === "imperial" ? heightFt : undefined, heightIn: unit === "imperial" ? heightIn : undefined, activity: activityLevel, unit });

  const result = useMemo(() => {
    const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
    const heightCm = unit === "imperial" ? (heightFt * 30.48) + (heightIn * 2.54) : height;

    if (weightKg <= 0 || heightCm <= 0 || age <= 0) return null;

    // Mifflin-St Jeor equation
    const bmr = gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const tdee = bmr * activityLevel;
    const weightLoss = tdee - 500;
    const weightGain = tdee + 500;

    return { bmr: Math.round(bmr), tdee: Math.round(tdee), weightLoss: Math.round(weightLoss), weightGain: Math.round(weightGain) };
  }, [age, gender, weight, height, heightFt, heightIn, activityLevel, unit]);

  const activityLabel = ACTIVITY_LEVELS.find((a) => a.value === activityLevel)?.label ?? "Moderate";

  useCalcHistory("calorie", { age, gender, weight, unit, activity: activityLevel }, result ? `TDEE: ${result.tdee} cal/day — BMR: ${result.bmr} cal/day` : "");

  const onReset = () => {
    setAge(25);
    setGender("male");
    setWeight(70);
    setHeight(170);
    setHeightFt(5);
    setHeightIn(7);
    setActivityLevel(1.55);
    setUnit("metric");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ActionButtons onReset={onReset} pdfData={{
        calculatorName: "Calorie (TDEE) Calculator",
        inputs: [
          { label: "Age", value: `${age} years` },
          { label: "Gender", value: gender },
          { label: "Weight", value: `${weight} ${unit === "metric" ? "kg" : "lbs"}` },
          { label: "Height", value: unit === "metric" ? `${height} cm` : `${heightFt}' ${heightIn}"` },
          { label: "Activity Level", value: activityLabel },
        ],
        results: result ? [
          { label: "BMR", value: `${result.bmr} cal/day` },
          { label: "TDEE", value: `${result.tdee} cal/day` },
          { label: "Weight Loss", value: `${result.weightLoss} cal/day` },
          { label: "Weight Gain", value: `${result.weightGain} cal/day` },
        ] : [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Unit toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Units:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button type="button" onClick={() => setUnit("metric")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${unit === "metric" ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Metric (kg/cm)</button>
            <button type="button" onClick={() => setUnit("imperial")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${unit === "imperial" ? "bg-white dark:bg-gray-700 text-green-700 dark:text-green-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Imperial (lbs/ft)</button>
          </div>
        </div>

        {/* Gender toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Gender:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button type="button" onClick={() => setGender("male")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${gender === "male" ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Male</button>
            <button type="button" onClick={() => setGender("female")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${gender === "female" ? "bg-white dark:bg-gray-700 text-pink-700 dark:text-pink-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Female</button>
          </div>
        </div>

        {/* Age */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age (years)</label>
            <div className="flex items-center gap-1">
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
              <VoiceInputButton onResult={(v) => setAge(v)} />
            </div>
          </div>
          <input type="range" min={15} max={80} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
            <div className="flex items-center gap-1">
              <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
              <VoiceInputButton onResult={(v) => setWeight(v)} />
            </div>
          </div>
          <input type="range" min={unit === "metric" ? 30 : 66} max={unit === "metric" ? 200 : 440} step={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </div>

        {/* Height */}
        {unit === "metric" ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Height (cm)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-24 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
                <VoiceInputButton onResult={(v) => setHeight(v)} />
              </div>
            </div>
            <input type="range" min={100} max={220} step={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full" />
          </div>
        ) : (
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Feet</label>
                <div className="flex items-center gap-1">
                  <input type="number" value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="w-20 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
                  <VoiceInputButton onResult={(v) => setHeightFt(v)} />
                </div>
              </div>
              <input type="range" min={3} max={7} step={1} value={heightFt} onChange={(e) => setHeightFt(Number(e.target.value))} className="w-full" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Inches</label>
                <div className="flex items-center gap-1">
                  <input type="number" value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="w-20 text-right text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-green-300 dark:border-green-700" />
                  <VoiceInputButton onResult={(v) => setHeightIn(v)} />
                </div>
              </div>
              <input type="range" min={0} max={11} step={1} value={heightIn} onChange={(e) => setHeightIn(Number(e.target.value))} className="w-full" />
            </div>
          </div>
        )}

        {/* Activity Level */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Activity Level</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setActivityLevel(level.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activityLevel === level.value
                    ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 ring-2 ring-green-200 dark:ring-green-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className={`text-sm font-semibold ${activityLevel === level.value ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>{level.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl shadow-orange-200 dark:shadow-orange-900/30 text-center">
            <p className="text-sm text-orange-100">Your Daily Energy Expenditure (TDEE)</p>
            <p className="text-5xl font-extrabold mt-2 animate-count-up">{result.tdee.toLocaleString()}</p>
            <p className="text-lg text-orange-200 mt-1">calories / day</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">BMR (Basal)</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{result.bmr.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">cal/day</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-blue-600 dark:text-blue-400">Weight Loss (-0.5kg/wk)</p>
              <p className="text-2xl font-extrabold text-blue-700 dark:text-blue-300 mt-1">{result.weightLoss.toLocaleString()}</p>
              <p className="text-xs text-blue-500 dark:text-blue-400">cal/day</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-amber-600 dark:text-amber-400">Weight Gain (+0.5kg/wk)</p>
              <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{result.weightGain.toLocaleString()}</p>
              <p className="text-xs text-amber-500 dark:text-amber-400">cal/day</p>
            </div>
          </div>

          <InsightCard
            icon="🔥"
            title="Calorie Insight"
            color="amber"
            insight={`You burn approximately ${result.tdee.toLocaleString()} calories/day. To lose 0.5kg/week, eat ${result.weightLoss.toLocaleString()} calories/day. To gain 0.5kg/week, eat ${result.weightGain.toLocaleString()} calories/day.`}
            tip={`Your BMR is ${result.bmr.toLocaleString()} cal/day — that's what your body burns at complete rest. The remaining ${(result.tdee - result.bmr).toLocaleString()} calories are burned through activity.`}
          />
        </>
      )}

      <CalculationHistory
        calculator="calorie"
        onLoad={(inputs) => {
          setAge(Number(inputs.age));
          setGender(String(inputs.gender) as "male" | "female");
          setWeight(Number(inputs.weight));
          setUnit(String(inputs.unit) as "metric" | "imperial");
          setActivityLevel(Number(inputs.activity));
        }}
      />
    </div>
  );
}
