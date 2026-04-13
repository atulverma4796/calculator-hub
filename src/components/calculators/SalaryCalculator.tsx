"use client";

import { useState, useEffect } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function SalaryCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [amount, setAmount] = useState(getNumber("amount", 50000));
  const [inputType, setInputType] = useState<"annual" | "monthly" | "weekly" | "daily" | "hourly">(getString("inputType", "annual") as "annual" | "monthly" | "weekly" | "daily" | "hourly");
  const [hoursPerWeek, setHoursPerWeek] = useState(getNumber("hoursPerWeek", 40));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setAmount(detected.defaultSalary);
    }
  }, [hasParams]);

  useShareableURL({ amount, inputType, hoursPerWeek, currency: currency.code });

  const toAnnual = () => {
    switch (inputType) {
      case "annual": return amount;
      case "monthly": return amount * 12;
      case "weekly": return amount * 52;
      case "daily": return amount * 260;
      case "hourly": return amount * hoursPerWeek * 52;
    }
  };

  const annual = toAnnual();
  const monthly = annual / 12;
  const weekly = annual / 52;
  const daily = annual / 260;
  const hourly = hoursPerWeek > 0 ? annual / (hoursPerWeek * 52) : 0;

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("salary", { amount, inputType, hoursPerWeek, currency: currency.code }, `Annual: ${fmt(annual)} — Hourly: ${fmt(hourly)}`);

  const rows = [
    { label: "Hourly", value: hourly, period: "per hour" },
    { label: "Daily", value: daily, period: "per day" },
    { label: "Weekly", value: weekly, period: "per week" },
    { label: "Monthly", value: monthly, period: "per month" },
    { label: "Annual", value: annual, period: "per year" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setAmount(c.defaultSalary);
        setInputType("annual");
        setHoursPerWeek(40);
      }} pdfData={{
        calculatorName: "Salary Calculator",
        inputs: [
          { label: "Amount", value: fmt(amount) },
          { label: "Period", value: inputType },
          { label: "Hours/Week", value: `${hoursPerWeek}` },
        ],
        results: [
          { label: "Annual", value: fmt(annual) },
          { label: "Monthly", value: fmt(monthly) },
          { label: "Hourly", value: fmt(hourly) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setAmount(c.defaultSalary); }}
          accentColor="indigo"
        />

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">I earn</label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[140px]">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full pl-7 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-bold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <VoiceInputButton onResult={(v) => setAmount(v)} />
            </div>
            <select value={inputType} onChange={(e) => setInputType(e.target.value as typeof inputType)} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 dark:text-white">
              <option value="hourly">Per Hour</option>
              <option value="daily">Per Day</option>
              <option value="weekly">Per Week</option>
              <option value="monthly">Per Month</option>
              <option value="annual">Per Year</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hours per Week</label>
            <div className="flex items-center gap-1">
              <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} min={1} max={80} className="w-20 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5" />
              <VoiceInputButton onResult={(v) => setHoursPerWeek(v)} />
            </div>
          </div>
          <input type="range" min={1} max={80} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        {rows.map((row, i) => (
          <div key={row.label} className={`flex items-center justify-between px-6 py-4 ${i !== rows.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""} ${row.label.toLowerCase() === inputType ? "bg-indigo-50 dark:bg-indigo-950" : ""}`}>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{row.label}</p>
              <p className="text-xs text-gray-400">{row.period}</p>
            </div>
            <p className={`text-xl font-extrabold ${row.label.toLowerCase() === inputType ? "text-indigo-600" : "text-gray-900 dark:text-gray-100"} animate-count-up`}>
              {fmt(row.value)}
            </p>
          </div>
        ))}
      </div>


      <InsightCard
        icon="💼"
        title="Salary Insight"
        color="blue"
        insight={`Your ${inputType} rate of ${fmt(amount)} converts to ${fmt(annual)} per year or ${fmt(hourly)} per hour (at ${hoursPerWeek} hrs/week).`}
      />

      <CalculationHistory
        calculator="salary"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setAmount(Number(inputs.amount));
          setInputType(String(inputs.inputType) as "annual" | "monthly" | "weekly" | "daily" | "hourly");
          setHoursPerWeek(Number(inputs.hoursPerWeek));
        }}
      />

      {CALCULATOR_CONTENT.salary && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.salary}
          calculatorName="Salary Calculator"
          dynamicExample={{
            setup: `You earn ${fmt(amount)} ${inputType === "annual" ? "per year" : inputType === "monthly" ? "per month" : inputType === "weekly" ? "per week" : inputType === "daily" ? "per day" : "per hour"}, working ${hoursPerWeek} hours per week.`,
            calculation: `Starting from your ${inputType} rate, we convert across all periods. Annual = ${fmt(annual)}, then: monthly = annual/12, weekly = annual/52, daily = annual/260 (working days), hourly = annual/(${hoursPerWeek} hours x 52 weeks).`,
            result: `Your salary breaks down to ${fmt(hourly)}/hour, ${fmt(daily)}/day, ${fmt(weekly)}/week, ${fmt(monthly)}/month, and ${fmt(annual)}/year. ${inputType === "hourly" ? `At ${hoursPerWeek}hrs/week, that's ${fmt(annual)} annually.` : `That works out to about ${fmt(hourly)} per hour.`}`,
          }}
        />
      )}
    </div>
  );
}
