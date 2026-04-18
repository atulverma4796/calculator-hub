"use client";

import { useState, useMemo } from "react";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import AffiliateCard from "@/components/AffiliateCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function CAGRCalculator() {
  const { getNumber } = useInitialParams();
  const [beginningValue, setBeginningValue] = useState(getNumber("beginningValue", 10000));
  const [endingValue, setEndingValue] = useState(getNumber("endingValue", 25000));
  const [years, setYears] = useState(getNumber("years", 5));

  useShareableURL({ beginningValue, endingValue, years });

  const result = useMemo(() => {
    if (beginningValue <= 0 || endingValue <= 0 || years <= 0) {
      return { cagr: 0, absoluteReturn: 0, totalMultiplier: 0 };
    }

    const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100;
    const absoluteReturn = ((endingValue - beginningValue) / beginningValue) * 100;
    const totalMultiplier = endingValue / beginningValue;

    return { cagr, absoluteReturn, totalMultiplier };
  }, [beginningValue, endingValue, years]);

  const fmtNum = (v: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);

  useCalcHistory("cagr", { beginningValue, endingValue, years }, `CAGR: ${result.cagr.toFixed(2)}% — ${result.totalMultiplier.toFixed(2)}x growth`);

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        setBeginningValue(10000);
        setEndingValue(25000);
        setYears(5);
      }} pdfData={{
        calculatorName: "CAGR Calculator",
        inputs: [
          { label: "Beginning Value", value: fmtNum(beginningValue) },
          { label: "Ending Value", value: fmtNum(endingValue) },
          { label: "Number of Years", value: `${years}` },
        ],
        results: [
          { label: "CAGR", value: `${result.cagr.toFixed(2)}%` },
          { label: "Absolute Return", value: `${result.absoluteReturn.toFixed(1)}%` },
          { label: "Growth Multiplier", value: `${result.totalMultiplier.toFixed(2)}x` },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Works with any currency — just enter the values in your preferred currency.
          </p>

          {/* Beginning Value */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Beginning Value</label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={beginningValue}
                  onChange={setBeginningValue}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setBeginningValue(v)} />
              </div>
            </div>
            <input type="range" min={100} max={100000000} step={100} value={beginningValue} onChange={(e) => setBeginningValue(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>100</span>
              <span>100,000,000</span>
            </div>
          </div>

          {/* Ending Value */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ending Value</label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={endingValue}
                  onChange={setEndingValue}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setEndingValue(v)} />
              </div>
            </div>
            <input type="range" min={100} max={100000000} step={100} value={endingValue} onChange={(e) => setEndingValue(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>100</span>
              <span>100,000,000</span>
            </div>
          </div>

          {/* Number of Years */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Number of Years</label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={years}
                  onChange={setYears}
                  min={1}
                  max={100}
                  step={0.5}
                  className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setYears(v)} />
              </div>
            </div>
            <input type="range" min={1} max={50} step={0.5} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1 Year</span>
              <span>50 Years</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <p className="text-sm font-medium text-indigo-200">CAGR (Compound Annual Growth Rate)</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">{result.cagr.toFixed(2)}%</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-200">Absolute Return</p>
                <p className="text-lg font-bold text-amber-300">{result.absoluteReturn.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200">Growth Multiplier</p>
                <p className="text-lg font-bold">{result.totalMultiplier.toFixed(2)}x</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Summary</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Beginning Value</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmtNum(beginningValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Ending Value</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmtNum(endingValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Gain/Loss</span>
              <span className={`text-sm font-bold ${endingValue >= beginningValue ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {endingValue >= beginningValue ? "+" : ""}{fmtNum(endingValue - beginningValue)}
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Over</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{years} years</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={endingValue < beginningValue ? "📉" : result.cagr > 15 ? "🚀" : "💡"}
        title="CAGR Insight"
        color={endingValue < beginningValue ? "red" : result.cagr > 15 ? "green" : "blue"}
        insight={
          endingValue < beginningValue
            ? `Your investment declined at ${Math.abs(result.cagr).toFixed(1)}% per year. Over ${years} years, it lost ${Math.abs(result.absoluteReturn).toFixed(0)}% of its value.`
            : `Your investment grew at ${result.cagr.toFixed(1)}% per year. It took ${years} years to ${result.totalMultiplier.toFixed(1)}x your money.`
        }
        tip={result.cagr > 0 && result.cagr < 7 ? "A CAGR below 7% may not beat inflation in many countries. Consider diversifying into higher-growth assets." : undefined}
      />

      <AffiliateCard type="investment" />

      <CalculationHistory calculator="cagr" onLoad={(inputs) => {
        if (inputs.beginningValue) setBeginningValue(Number(inputs.beginningValue));
        if (inputs.endingValue) setEndingValue(Number(inputs.endingValue));
        if (inputs.years) setYears(Number(inputs.years));
      }} />
    </div>
  );
}
