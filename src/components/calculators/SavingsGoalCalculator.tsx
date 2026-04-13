"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function SavingsGoalCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [targetAmount, setTargetAmount] = useState(getNumber("targetAmount", 100000));
  const [currentSavings, setCurrentSavings] = useState(getNumber("currentSavings", 10000));
  const [monthlyContribution, setMonthlyContribution] = useState(getNumber("monthlyContribution", 1000));
  const [returnRate, setReturnRate] = useState(getNumber("returnRate", 8));
  const [mode, setMode] = useState<"time" | "amount">(getString("mode", "time") as "time" | "amount");
  const [targetYears, setTargetYears] = useState(getNumber("targetYears", 5));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setTargetAmount(detected.defaultLoan);
      setCurrentSavings(Math.round(detected.defaultLoan * 0.05));
      setMonthlyContribution(detected.defaultSIP);
    }
  }, [hasParams]);

  useShareableURL({ targetAmount, currentSavings, monthlyContribution, returnRate, mode, targetYears, currency: currency.code });

  const result = useMemo(() => {
    const monthlyRate = returnRate / 12 / 100;

    if (mode === "time") {
      // Solve for n: targetAmount = currentSavings*(1+r)^n + PMT*((1+r)^n - 1)/r
      if (monthlyContribution <= 0 && currentSavings <= 0) {
        return { months: Infinity, years: 0, remainingMonths: 0, totalContributed: 0, totalReturns: 0, monthlyNeeded: 0 };
      }

      // Iterative approach to find months
      let balance = currentSavings;
      let monthCount = 0;
      const maxMonths = 600; // 50 years cap

      while (balance < targetAmount && monthCount < maxMonths) {
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        monthCount++;
      }

      const years = Math.floor(monthCount / 12);
      const remainingMonths = monthCount % 12;
      const totalContributed = currentSavings + monthlyContribution * monthCount;
      const totalReturns = balance - totalContributed;

      return {
        months: monthCount,
        years,
        remainingMonths,
        totalContributed: Math.round(totalContributed),
        totalReturns: Math.round(Math.max(0, totalReturns)),
        monthlyNeeded: 0,
      };
    } else {
      // Solve for PMT given target years
      const months = targetYears * 12;
      const futureValueOfCurrent = currentSavings * Math.pow(1 + monthlyRate, months);
      const remaining = targetAmount - futureValueOfCurrent;

      let monthlyNeeded = 0;
      if (remaining > 0 && monthlyRate > 0) {
        monthlyNeeded = remaining * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
      } else if (remaining > 0 && monthlyRate === 0) {
        monthlyNeeded = remaining / months;
      }

      const totalContributed = currentSavings + monthlyNeeded * months;
      const totalReturns = targetAmount - totalContributed;

      return {
        months,
        years: targetYears,
        remainingMonths: 0,
        totalContributed: Math.round(totalContributed),
        totalReturns: Math.round(Math.max(0, totalReturns)),
        monthlyNeeded: Math.round(Math.max(0, monthlyNeeded)),
      };
    }
  }, [targetAmount, currentSavings, monthlyContribution, returnRate, mode, targetYears]);

  const fmt = (v: number) => formatAmount(v, currency);

  const resultLabel = mode === "time"
    ? `Goal in ${result.years}y ${result.remainingMonths}m — Contributed: ${fmt(result.totalContributed)}`
    : `Need ${fmt(result.monthlyNeeded)}/mo for ${targetYears}y`;

  useCalcHistory("savings-goal", { targetAmount, currentSavings, monthlyContribution, returnRate, mode, targetYears, currency: currency.code }, resultLabel);

  // Calculate what starting 2 years earlier would save per month
  const earlierSavings = useMemo(() => {
    if (mode !== "time") return 0;
    const monthlyRate = returnRate / 12 / 100;
    const totalMonths = result.months + 24;
    const futureValueOfCurrent = currentSavings * Math.pow(1 + monthlyRate, totalMonths);
    const remaining = targetAmount - futureValueOfCurrent;
    if (remaining <= 0) return monthlyContribution;
    const neededMonthly = remaining * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(Math.max(0, monthlyContribution - neededMonthly));
  }, [mode, returnRate, result.months, currentSavings, targetAmount, monthlyContribution]);

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setTargetAmount(c.defaultLoan);
        setCurrentSavings(Math.round(c.defaultLoan * 0.05));
        setMonthlyContribution(c.defaultSIP);
        setReturnRate(8);
        setMode("time");
        setTargetYears(5);
      }} pdfData={{
        calculatorName: "Savings Goal Calculator",
        inputs: [
          { label: "Target Amount", value: fmt(targetAmount) },
          { label: "Current Savings", value: fmt(currentSavings) },
          { label: "Monthly Contribution", value: fmt(monthlyContribution) },
          { label: "Expected Return", value: `${returnRate}% p.a.` },
          { label: "Mode", value: mode === "time" ? "Time to Goal" : "Amount Needed" },
          ...(mode === "amount" ? [{ label: "Target Years", value: `${targetYears} years` }] : []),
          { label: "Currency", value: currency.code },
        ],
        results: mode === "time" ? [
          { label: "Time to Goal", value: `${result.years} years ${result.remainingMonths} months` },
          { label: "Total Contributed", value: fmt(result.totalContributed) },
          { label: "Total Returns Earned", value: fmt(result.totalReturns) },
        ] : [
          { label: "Monthly Amount Needed", value: fmt(result.monthlyNeeded) },
          { label: "Total Contributed", value: fmt(result.totalContributed) },
          { label: "Total Returns Earned", value: fmt(result.totalReturns) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setTargetAmount(c.defaultLoan); setCurrentSavings(Math.round(c.defaultLoan * 0.05)); setMonthlyContribution(c.defaultSIP); }}
          />

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setMode("time")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "time" ? "bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              How long to reach goal?
            </button>
            <button
              type="button"
              onClick={() => setMode("amount")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                mode === "amount" ? "bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              How much to save monthly?
            </button>
          </div>

          {/* Target Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={targetAmount}
                  onChange={setTargetAmount}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setTargetAmount(v)} />
              </div>
            </div>
            <input type="range" min={1000} max={50000000} step={1000} value={targetAmount} onChange={(e) => setTargetAmount(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(1000, currency)}</span>
              <span>{formatAmount(50000000, currency)}</span>
            </div>
          </div>

          {/* Current Savings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Savings</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={currentSavings}
                  onChange={setCurrentSavings}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setCurrentSavings(v)} />
              </div>
            </div>
            <input type="range" min={0} max={10000000} step={1000} value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(0, currency)}</span>
              <span>{formatAmount(10000000, currency)}</span>
            </div>
          </div>

          {mode === "time" ? (
            /* Monthly Contribution */
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Contribution</label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                  <CalcInput
                    value={monthlyContribution}
                    onChange={setMonthlyContribution}
                    className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <VoiceInputButton onResult={(v) => setMonthlyContribution(v)} />
                </div>
              </div>
              <input type="range" min={100} max={500000} step={100} value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                <span>{formatAmount(100, currency)}</span>
                <span>{formatAmount(500000, currency)}</span>
              </div>
            </div>
          ) : (
            /* Target Years */
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target Timeline (Years)</label>
                <CalcInput
                  value={targetYears}
                  onChange={setTargetYears}
                  min={1}
                  max={50}
                  className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setTargetYears(v)} />
              </div>
              <input type="range" min={1} max={50} step={1} value={targetYears} onChange={(e) => setTargetYears(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                <span>1 Year</span>
                <span>50 Years</span>
              </div>
            </div>
          )}

          {/* Expected Return Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Return Rate (% p.a.)</label>
              <CalcInput
                value={returnRate}
                onChange={setReturnRate}
                step={0.1}
                min={0}
                max={30}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setReturnRate(v)} />
            </div>
            <input type="range" min={0} max={30} step={0.5} value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            {mode === "time" ? (
              <>
                <p className="text-sm font-medium text-indigo-200">Time to Reach Goal</p>
                <p className="text-3xl sm:text-4xl font-extrabold mt-1">
                  {result.months >= 600 ? "50+ years" : `${result.years}y ${result.remainingMonths}m`}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-indigo-200">Monthly Savings Needed</p>
                <p className="text-3xl sm:text-4xl font-extrabold mt-1">{fmt(result.monthlyNeeded)}</p>
              </>
            )}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-200">Total Contributed</p>
                <p className="text-lg font-bold text-amber-300">{fmt(result.totalContributed)}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200">Returns Earned</p>
                <p className="text-lg font-bold">{fmt(result.totalReturns)}</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Target</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmt(targetAmount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">From Current Savings</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(currentSavings)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Gap to Fill</span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{fmt(Math.max(0, targetAmount - currentSavings))}</span>
            </div>
            {result.totalReturns > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Compounding Earns You</span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{fmt(result.totalReturns)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <InsightCard
        icon={result.months >= 600 ? "⚠️" : "💡"}
        title="Savings Insight"
        color={result.months >= 600 ? "red" : result.years > 10 ? "amber" : "green"}
        insight={
          mode === "time"
            ? `You'll reach your goal of ${fmt(targetAmount)} in ${result.years} years and ${result.remainingMonths} months.${earlierSavings > 0 ? ` Starting 2 years earlier would need ${fmt(earlierSavings)} less per month.` : ""}`
            : `To reach ${fmt(targetAmount)} in ${targetYears} years, you need to save ${fmt(result.monthlyNeeded)} every month. Compounding will contribute ${fmt(result.totalReturns)} toward your goal.`
        }
        tip={result.totalReturns < result.totalContributed * 0.1 ? "A higher return rate (like equity mutual funds at 12%) can significantly reduce the time or amount needed." : undefined}
      />

      <CalculationHistory calculator="savings-goal" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.targetAmount) setTargetAmount(Number(inputs.targetAmount));
        if (inputs.currentSavings) setCurrentSavings(Number(inputs.currentSavings));
        if (inputs.monthlyContribution) setMonthlyContribution(Number(inputs.monthlyContribution));
        if (inputs.returnRate) setReturnRate(Number(inputs.returnRate));
        if (inputs.mode) setMode(inputs.mode as "time" | "amount");
        if (inputs.targetYears) setTargetYears(Number(inputs.targetYears));
      }} />
    </div>
  );
}
