"use client";

import { useState, useMemo } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const ZONES = [
  { zone: 1, name: "Warm Up", desc: "Very light effort, recovery", minPct: 0.50, maxPct: 0.60, color: "bg-gray-400", textColor: "text-gray-700 dark:text-gray-300", border: "border-gray-300 dark:border-gray-600", bg: "bg-gray-50 dark:bg-gray-800" },
  { zone: 2, name: "Fat Burn", desc: "Light effort, fat burning", minPct: 0.60, maxPct: 0.70, color: "bg-green-500", textColor: "text-green-700 dark:text-green-300", border: "border-green-300 dark:border-green-700", bg: "bg-green-50 dark:bg-green-900/20" },
  { zone: 3, name: "Cardio", desc: "Moderate effort, aerobic endurance", minPct: 0.70, maxPct: 0.80, color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-300 dark:border-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  { zone: 4, name: "Hard", desc: "Hard effort, anaerobic threshold", minPct: 0.80, maxPct: 0.90, color: "bg-orange-500", textColor: "text-orange-700 dark:text-orange-300", border: "border-orange-300 dark:border-orange-700", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { zone: 5, name: "Peak", desc: "Maximum effort, VO2 max", minPct: 0.90, maxPct: 1.00, color: "bg-red-500", textColor: "text-red-700 dark:text-red-300", border: "border-red-300 dark:border-red-700", bg: "bg-red-50 dark:bg-red-900/20" },
];

export default function HeartRateCalculator() {
  const { getNumber } = useInitialParams();
  const [age, setAge] = useState(getNumber("age", 30));
  const [restingHR, setRestingHR] = useState(getNumber("rhr", 0));
  const useKarvonen = restingHR > 0;

  useShareableURL({ age, rhr: restingHR || undefined });

  const result = useMemo(() => {
    if (age <= 0 || age > 120) return null;

    const maxHR = 220 - age;

    const zones = ZONES.map((z) => {
      let minBpm: number;
      let maxBpm: number;

      if (useKarvonen && restingHR > 0) {
        // Karvonen formula: Target = ((MaxHR - RestHR) * intensity%) + RestHR
        const reserve = maxHR - restingHR;
        minBpm = Math.round(reserve * z.minPct + restingHR);
        maxBpm = Math.round(reserve * z.maxPct + restingHR);
      } else {
        // Simple percentage of max HR
        minBpm = Math.round(maxHR * z.minPct);
        maxBpm = Math.round(maxHR * z.maxPct);
      }

      return { ...z, minBpm, maxBpm };
    });

    const fatBurnZone = zones[1]; // Zone 2
    const cardioZone = zones[2]; // Zone 3

    return { maxHR, zones, fatBurnZone, cardioZone };
  }, [age, restingHR, useKarvonen]);

  useCalcHistory("heartrate", { age, rhr: restingHR }, result ? `Max HR: ${result.maxHR} bpm — Fat Burn: ${result.fatBurnZone.minBpm}-${result.fatBurnZone.maxBpm} bpm` : "");

  const onReset = () => {
    setAge(30);
    setRestingHR(0);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ActionButtons onReset={onReset} pdfData={{
        calculatorName: "Heart Rate Zone Calculator",
        inputs: [
          { label: "Age", value: `${age} years` },
          ...(restingHR > 0 ? [{ label: "Resting HR", value: `${restingHR} bpm` }] : []),
        ],
        results: result ? [
          { label: "Max Heart Rate", value: `${result.maxHR} bpm` },
          { label: "Fat Burn Zone", value: `${result.fatBurnZone.minBpm}-${result.fatBurnZone.maxBpm} bpm` },
          { label: "Cardio Zone", value: `${result.cardioZone.minBpm}-${result.cardioZone.maxBpm} bpm` },
          ...result.zones.map((z) => ({ label: `Zone ${z.zone} (${z.name})`, value: `${z.minBpm}-${z.maxBpm} bpm` })),
        ] : [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Age */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Age (years)</label>
            <div className="flex items-center gap-1">
              <input type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-24 text-right text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-red-300 dark:border-red-700" />
              <VoiceInputButton onResult={(v) => setAge(v)} />
            </div>
          </div>
          <input type="range" min={10} max={90} step={1} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full" />
        </div>

        {/* Resting Heart Rate (optional) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Resting Heart Rate (bpm)
              <span className="text-xs font-normal text-gray-400 dark:text-gray-500 ml-1">optional</span>
            </label>
            <div className="flex items-center gap-1">
              <input type="number" value={restingHR} onChange={(e) => setRestingHR(Number(e.target.value))} className="w-24 text-right text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-800 dark:text-red-300 dark:border-red-700" />
              <VoiceInputButton onResult={(v) => setRestingHR(v)} />
            </div>
          </div>
          <input type="range" min={0} max={120} step={1} value={restingHR} onChange={(e) => setRestingHR(Number(e.target.value))} className="w-full" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {useKarvonen
              ? "Using Karvonen formula (more accurate with resting HR)"
              : "Set your resting heart rate for more accurate zones (Karvonen method). Leave at 0 for standard calculation."}
          </p>
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl shadow-red-200 dark:shadow-red-900/30 text-center">
            <p className="text-sm text-red-100">Maximum Heart Rate</p>
            <p className="text-5xl font-extrabold mt-2 animate-count-up">{result.maxHR}</p>
            <p className="text-lg text-red-200 mt-1">bpm</p>
            {useKarvonen && (
              <p className="text-xs text-red-200 mt-2">Using Karvonen formula (resting HR: {restingHR} bpm)</p>
            )}
          </div>

          {/* Training Zones */}
          <div className="space-y-3">
            {result.zones.map((z) => {
              const widthPct = ((z.maxBpm - z.minBpm) / result.maxHR) * 100;
              return (
                <div key={z.zone} className={`${z.bg} border ${z.border} rounded-xl p-4 shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${z.color} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{z.zone}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${z.textColor}`}>{z.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{z.desc}</p>
                      </div>
                    </div>
                    <p className={`text-lg font-extrabold ${z.textColor}`}>{z.minBpm}-{z.maxBpm}</p>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full ${z.color} rounded-full transition-all`} style={{ width: `${Math.min(100, widthPct * 3)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Zones Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-green-600 dark:text-green-400">Fat Burn Zone</p>
              <p className="text-2xl font-extrabold text-green-700 dark:text-green-300 mt-1">{result.fatBurnZone.minBpm}-{result.fatBurnZone.maxBpm}</p>
              <p className="text-xs text-green-500 dark:text-green-400">bpm</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">Cardio Zone</p>
              <p className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-300 mt-1">{result.cardioZone.minBpm}-{result.cardioZone.maxBpm}</p>
              <p className="text-xs text-yellow-500 dark:text-yellow-400">bpm</p>
            </div>
          </div>

          <InsightCard
            icon="❤️"
            title="Heart Rate Insight"
            color="red"
            insight={`Your max heart rate is ${result.maxHR} bpm. For fat burning, keep your heart rate between ${result.fatBurnZone.minBpm}-${result.fatBurnZone.maxBpm} bpm. For cardio fitness, aim for ${result.cardioZone.minBpm}-${result.cardioZone.maxBpm} bpm.`}
            tip={useKarvonen
              ? `With your resting HR of ${restingHR} bpm, the Karvonen formula provides personalized zones. A lower resting HR typically indicates better cardiovascular fitness.`
              : "For more accurate zones, measure your resting heart rate first thing in the morning and enter it above."}
          />
        </>
      )}

      <CalculationHistory
        calculator="heartrate"
        onLoad={(inputs) => {
          setAge(Number(inputs.age));
          setRestingHR(Number(inputs.rhr));
        }}
      />
    </div>
  );
}
