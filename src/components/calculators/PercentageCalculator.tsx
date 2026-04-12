"use client";

import { useState } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

export default function PercentageCalculator() {
  const { getNumber } = useInitialParams();
  const [num1, setNum1] = useState(getNumber("num1", 200));
  const [pct1, setPct1] = useState(getNumber("pct1", 15));

  const [num2a, setNum2a] = useState(getNumber("num2a", 50));
  const [num2b, setNum2b] = useState(getNumber("num2b", 200));

  const [num3a, setNum3a] = useState(getNumber("num3a", 100));
  const [num3b, setNum3b] = useState(getNumber("num3b", 150));

  useShareableURL({ num1, pct1, num2a, num2b, num3a, num3b });

  const result1 = (num1 * pct1) / 100;
  const result2 = num2b !== 0 ? (num2a / num2b) * 100 : 0;
  const result3 = num3a !== 0 ? ((num3b - num3a) / num3a) * 100 : 0;

  useCalcHistory("percentage", { num1, pct1, num2a, num2b, num3a, num3b }, `${pct1}% of ${num1} = ${result1.toFixed(2)}`);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ActionButtons onReset={() => {
        setNum1(200);
        setPct1(15);
        setNum2a(50);
        setNum2b(200);
        setNum3a(100);
        setNum3b(150);
      }} pdfData={{
        calculatorName: "Percentage Calculator",
        inputs: [
          { label: `${pct1}% of ${num1}`, value: result1.toFixed(2) },
          { label: `${num2a} is what % of ${num2b}`, value: `${result2.toFixed(2)}%` },
          { label: `Change: ${num3a} → ${num3b}`, value: `${result3 >= 0 ? "+" : ""}${result3.toFixed(2)}%` },
        ],
        results: [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      {/* Calculator 1: What is X% of Y? */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">What is X% of Y?</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">What is</span>
          <input type="number" value={pct1} onChange={(e) => setPct1(Number(e.target.value) || 0)} className="w-20 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <VoiceInputButton onResult={(v) => setPct1(v)} />
          <span className="text-sm text-gray-600 dark:text-gray-400">% of</span>
          <input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value) || 0)} className="w-28 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <VoiceInputButton onResult={(v) => setNum1(v)} />
          <span className="text-sm text-gray-600 dark:text-gray-400">?</span>
        </div>
        <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
          <span className="text-sm font-medium">Result:</span>
          <span className="text-xl font-extrabold animate-count-up">{result1.toFixed(2)}</span>
        </div>
      </div>

      {/* Calculator 2: X is what percent of Y? */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">X is what percent of Y?</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <input type="number" value={num2a} onChange={(e) => setNum2a(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <VoiceInputButton onResult={(v) => setNum2a(v)} />
          <span className="text-sm text-gray-600 dark:text-gray-400">is what % of</span>
          <input type="number" value={num2b} onChange={(e) => setNum2b(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <VoiceInputButton onResult={(v) => setNum2b(v)} />
          <span className="text-sm text-gray-600 dark:text-gray-400">?</span>
        </div>
        <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
          <span className="text-sm font-medium">Result:</span>
          <span className="text-xl font-extrabold animate-count-up">{result2.toFixed(2)}%</span>
        </div>
      </div>

      {/* Calculator 3: Percentage change */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Percentage Change</h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">From</span>
          <input type="number" value={num3a} onChange={(e) => setNum3a(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <VoiceInputButton onResult={(v) => setNum3a(v)} />
          <span className="text-sm text-gray-600 dark:text-gray-400">to</span>
          <input type="number" value={num3b} onChange={(e) => setNum3b(Number(e.target.value) || 0)} className="w-24 text-center text-sm font-bold text-pink-700 bg-pink-50 border border-pink-200 rounded-lg px-2 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
          <VoiceInputButton onResult={(v) => setNum3b(v)} />
        </div>
        <div className="mt-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl px-5 py-3 inline-flex items-center gap-2">
          <span className="text-sm font-medium">{result3 >= 0 ? "Increase" : "Decrease"}:</span>
          <span className="text-xl font-extrabold animate-count-up">{Math.abs(result3).toFixed(2)}%</span>
        </div>
      </div>


      <InsightCard
        icon="%"
        title="Quick Answer"
        color="blue"
        insight={`${pct1}% of ${num1} = ${result1.toFixed(2)}. ${num2a} is ${result2.toFixed(2)}% of ${num2b}. Change from ${num3a} to ${num3b} = ${result3 >= 0 ? "+" : ""}${result3.toFixed(2)}%.`}
      />

      <CalculationHistory
        calculator="percentage"
        onLoad={(inputs) => {
          setNum1(Number(inputs.num1));
          setPct1(Number(inputs.pct1));
          setNum2a(Number(inputs.num2a));
          setNum2b(Number(inputs.num2b));
          setNum3a(Number(inputs.num3a));
          setNum3b(Number(inputs.num3b));
        }}
      />

      {CALCULATOR_CONTENT.percentage && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.percentage}
          calculatorName="Percentage Calculator"
          dynamicExample={{
            setup: `You want to find ${pct1}% of ${num1}, check what percentage ${num2a} is of ${num2b}, and see the change from ${num3a} to ${num3b}.`,
            calculation: `${pct1}% of ${num1} = ${num1} x ${pct1}/100 = ${result1.toFixed(2)}. ${num2a} out of ${num2b} = (${num2a}/${num2b}) x 100 = ${result2.toFixed(2)}%. Change from ${num3a} to ${num3b} = ((${num3b}-${num3a})/${num3a}) x 100 = ${result3 >= 0 ? "+" : ""}${result3.toFixed(2)}%.`,
            result: `${pct1}% of ${num1} is ${result1.toFixed(2)}. ${num2a} is ${result2.toFixed(2)}% of ${num2b}. Going from ${num3a} to ${num3b} is a ${Math.abs(result3).toFixed(2)}% ${result3 >= 0 ? "increase" : "decrease"}.`,
          }}
        />
      )}
    </div>
  );
}
