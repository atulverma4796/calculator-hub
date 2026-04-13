"use client";

import { useState, useMemo } from "react";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Desk job, minimal movement", multiplier: 1.0 },
  { value: "moderate", label: "Moderate", desc: "Some walking, light activity", multiplier: 1.2 },
  { value: "active", label: "Active", desc: "Regular exercise, physical job", multiplier: 1.3 },
  { value: "very_active", label: "Very Active", desc: "Intense daily exercise, athlete", multiplier: 1.4 },
];

const CLIMATES = [
  { value: "temperate", label: "Temperate", desc: "Mild weather", multiplier: 1.0 },
  { value: "hot", label: "Hot / Humid", desc: "Tropical or desert climate", multiplier: 1.2 },
  { value: "cold", label: "Cold", desc: "Winter or cold climate", multiplier: 1.1 },
];

export default function WaterIntakeCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [weight, setWeight] = useState(getNumber("weight", 70));
  const [unit, setUnit] = useState<"metric" | "imperial">(getString("unit", "metric") as "metric" | "imperial");
  const [activity, setActivity] = useState(getString("activity", "moderate"));
  const [climate, setClimate] = useState(getString("climate", "temperate"));
  const [exerciseMin, setExerciseMin] = useState(getNumber("exercise", 30));

  useShareableURL({ weight, unit, activity, climate, exercise: exerciseMin });

  const result = useMemo(() => {
    const weightKg = unit === "imperial" ? weight * 0.453592 : weight;
    if (weightKg <= 0) return null;

    const activityMultiplier = ACTIVITY_LEVELS.find((a) => a.value === activity)?.multiplier ?? 1.0;
    const climateMultiplier = CLIMATES.find((c) => c.value === climate)?.multiplier ?? 1.0;

    // Base water = weight(kg) * 0.033 liters
    const baseWater = weightKg * 0.033;
    const adjustedWater = baseWater * activityMultiplier * climateMultiplier;

    // Additional for exercise: 350ml per 30 min
    const exerciseWater = (exerciseMin / 30) * 0.35;
    const totalLiters = adjustedWater + exerciseWater;
    const glasses = Math.ceil(totalLiters / 0.25); // 250ml per glass
    const totalOz = totalLiters * 33.814;

    return {
      baseLiters: baseWater,
      totalLiters,
      totalOz,
      glasses,
      exerciseWaterMl: Math.round(exerciseWater * 1000),
    };
  }, [weight, unit, activity, climate, exerciseMin]);

  const activityLabel = ACTIVITY_LEVELS.find((a) => a.value === activity)?.label ?? "Moderate";
  const climateLabel = CLIMATES.find((c) => c.value === climate)?.label ?? "Temperate";

  useCalcHistory("water", { weight, unit, activity, climate, exercise: exerciseMin }, result ? `${result.totalLiters.toFixed(1)}L/day (${result.glasses} glasses)` : "");

  const onReset = () => {
    setWeight(70);
    setUnit("metric");
    setActivity("moderate");
    setClimate("temperate");
    setExerciseMin(30);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ActionButtons onReset={onReset} pdfData={{
        calculatorName: "Water Intake Calculator",
        inputs: [
          { label: "Weight", value: `${weight} ${unit === "metric" ? "kg" : "lbs"}` },
          { label: "Activity Level", value: activityLabel },
          { label: "Climate", value: climateLabel },
          { label: "Exercise", value: `${exerciseMin} min/day` },
        ],
        results: result ? [
          { label: "Daily Water", value: `${result.totalLiters.toFixed(1)} L` },
          { label: "Glasses (250ml)", value: `${result.glasses}` },
          { label: "In Ounces", value: `${result.totalOz.toFixed(0)} oz` },
          { label: "Exercise Extra", value: `${result.exerciseWaterMl} ml` },
        ] : [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Unit toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Units:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            <button type="button" onClick={() => setUnit("metric")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${unit === "metric" ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Metric (kg/L)</button>
            <button type="button" onClick={() => setUnit("imperial")} className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${unit === "imperial" ? "bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>Imperial (lbs/oz)</button>
          </div>
        </div>

        {/* Weight */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
            <div className="flex items-center gap-1">
              <CalcInput value={weight} onChange={setWeight} className="w-24 text-right text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700" />
              <VoiceInputButton onResult={(v) => setWeight(v)} />
            </div>
          </div>
          <input type="range" min={unit === "metric" ? 30 : 66} max={unit === "metric" ? 150 : 330} step={1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full" />
        </div>

        {/* Exercise duration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Exercise (min/day)</label>
            <div className="flex items-center gap-1">
              <CalcInput value={exerciseMin} onChange={setExerciseMin} className="w-24 text-right text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700" />
              <VoiceInputButton onResult={(v) => setExerciseMin(v)} />
            </div>
          </div>
          <input type="range" min={0} max={180} step={5} value={exerciseMin} onChange={(e) => setExerciseMin(Number(e.target.value))} className="w-full" />
        </div>

        {/* Activity Level */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Activity Level</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setActivity(level.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activity === level.value
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className={`text-sm font-semibold ${activity === level.value ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>{level.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Climate */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Climate</label>
          <div className="grid grid-cols-3 gap-2">
            {CLIMATES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setClimate(c.value)}
                className={`px-3 py-3 rounded-xl border text-center transition-all ${
                  climate === c.value
                    ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-200 dark:ring-blue-800"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <span className={`text-sm font-semibold block ${climate === c.value ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>{c.label}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{c.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/30 text-center">
            <p className="text-sm text-blue-100">Recommended Daily Water Intake</p>
            <p className="text-5xl font-extrabold mt-2 animate-count-up">
              {unit === "metric" ? `${result.totalLiters.toFixed(1)} L` : `${result.totalOz.toFixed(0)} oz`}
            </p>
            <p className="text-lg text-blue-200 mt-1">{result.glasses} glasses (250ml each)</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Base Intake</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mt-1">{result.baseLiters.toFixed(1)} L</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Exercise Extra</p>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{result.exerciseWaterMl} ml</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm sm:col-span-1 col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total (oz)</p>
              <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-1">{result.totalOz.toFixed(0)} oz</p>
            </div>
          </div>

          {/* Visual glasses */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">Your daily glasses</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.min(result.glasses, 20) }).map((_, i) => (
                <div key={i} className="w-8 h-10 rounded-md bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 flex items-end justify-center overflow-hidden">
                  <div className="w-full bg-blue-400 dark:bg-blue-500 rounded-t-sm" style={{ height: "70%" }} />
                </div>
              ))}
              {result.glasses > 20 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 self-center ml-1">+{result.glasses - 20} more</span>
              )}
            </div>
          </div>

          <InsightCard
            icon="💧"
            title="Hydration Insight"
            color="blue"
            insight={`You should drink approximately ${result.totalLiters.toFixed(1)} liters (${result.glasses} glasses) of water daily. During exercise, add ${result.exerciseWaterMl} ml extra.`}
            tip="Spread your water intake throughout the day. Drink a glass when you wake up, before meals, and during/after exercise."
          />
        </>
      )}

      <CalculationHistory
        calculator="water"
        onLoad={(inputs) => {
          setWeight(Number(inputs.weight));
          setUnit(String(inputs.unit) as "metric" | "imperial");
          setActivity(String(inputs.activity));
          setClimate(String(inputs.climate));
          setExerciseMin(Number(inputs.exercise));
        }}
      />
    </div>
  );
}
