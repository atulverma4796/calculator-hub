"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

export default function RetirementCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [currentAge, setCurrentAge] = useState(getNumber("currentAge", 30));
  const [retireAge, setRetireAge] = useState(getNumber("retireAge", 65));
  const [currentSavings, setCurrentSavings] = useState(getNumber("currentSavings", 10000));
  const [monthlySaving, setMonthlySaving] = useState(getNumber("monthlySaving", 500));
  const [returnRate, setReturnRate] = useState(getNumber("returnRate", 10));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setCurrentSavings(detected.defaultSIP * 100);
      setMonthlySaving(detected.defaultSIP * 2);
      const retireAgeMap: Record<string, number> = { INR: 60, USD: 67, GBP: 68, AUD: 67, EUR: 65, CAD: 65, JPY: 65 };
      setRetireAge(retireAgeMap[detected.code] ?? 65);
    }
  }, [hasParams]);

  useShareableURL({ currentAge, retireAge, currentSavings, monthlySaving, returnRate, currency: currency.code });

  const handleCurrencyChange = (c: CurrencyConfig) => {
    setCurrency(c);
    setCurrentSavings(c.defaultSIP * 100);
    setMonthlySaving(c.defaultSIP * 2);
  };

  const result = useMemo(() => {
    const years = retireAge - currentAge;
    if (years <= 0) return { total: currentSavings, invested: currentSavings, returns: 0, chartData: [] };

    const monthlyRate = returnRate / 12 / 100;
    const months = years * 12;

    const existingGrowth = currentSavings * Math.pow(1 + returnRate / 100, years);
    const sipGrowth = returnRate > 0 && monthlySaving > 0
      ? monthlySaving * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : monthlySaving * months;
    const total = existingGrowth + sipGrowth;
    const invested = currentSavings + monthlySaving * months;
    const returns = total - invested;

    const chartData = [];
    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const eg = currentSavings * Math.pow(1 + returnRate / 100, y);
      const sg = y > 0 && returnRate > 0 && monthlySaving > 0
        ? monthlySaving * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate)
        : monthlySaving * m;
      const inv = currentSavings + monthlySaving * m;
      chartData.push({ age: currentAge + y, value: Math.round(eg + sg), invested: Math.round(inv) });
    }

    return { total: Math.round(total), invested: Math.round(invested), returns: Math.round(returns), chartData };
  }, [currentAge, retireAge, currentSavings, monthlySaving, returnRate]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("retirement", { currentAge, retireAge, currentSavings, monthlySaving, returnRate, currency: currency.code }, `Corpus at ${retireAge}: ${fmt(result.total)}`);

  return (
    <div className="space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setCurrentAge(30);
        const retireMap: Record<string, number> = { INR: 60, USD: 67, GBP: 68, AUD: 67, EUR: 65, CAD: 65, JPY: 65 };
        setRetireAge(retireMap[c.code] ?? 65);
        setCurrentSavings(c.defaultSIP * 100);
        setMonthlySaving(c.defaultSIP * 2);
        setReturnRate(10);
      }} pdfData={{
        calculatorName: "Retirement Calculator",
        inputs: [
          { label: "Current Age", value: `${currentAge}` },
          { label: "Retire at", value: `${retireAge}` },
          { label: "Current Savings", value: fmt(currentSavings) },
          { label: "Monthly Saving", value: fmt(monthlySaving) },
          { label: "Expected Return", value: `${returnRate}%` },
        ],
        results: [
          { label: "Retirement Corpus", value: fmt(result.total) },
          { label: "Total Invested", value: fmt(result.invested) },
          { label: "Returns Earned", value: fmt(result.returns) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={handleCurrencyChange}
            accentColor="fuchsia"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Current Age</label>
              <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value) || 18)} min={18} max={70} className="w-full text-center text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-2" />
              <VoiceInputButton onResult={(v) => setCurrentAge(v)} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Retire at Age</label>
              <input type="number" value={retireAge} onChange={(e) => setRetireAge(Number(e.target.value) || 50)} min={currentAge + 1} max={80} className="w-full text-center text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-2" />
              <VoiceInputButton onResult={(v) => setRetireAge(v)} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Savings</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setCurrentSavings(v)} />
              </div>
            </div>
            <input type="range" min={0} max={10000000} step={10000} value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Saving</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input type="number" value={monthlySaving} onChange={(e) => setMonthlySaving(Number(e.target.value) || 0)} className="w-28 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setMonthlySaving(v)} />
              </div>
            </div>
            <input type="range" min={0} max={500000} step={1000} value={monthlySaving} onChange={(e) => setMonthlySaving(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Return (%)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value) || 0)} step={0.5} className="w-20 text-right text-sm font-bold text-fuchsia-700 bg-fuchsia-50 border border-fuchsia-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setReturnRate(v)} />
              </div>
            </div>
            <input type="range" min={1} max={20} step={0.5} value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-fuchsia-200">
            <p className="text-sm text-fuchsia-100">Retirement Corpus</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.total)}</p>
            <p className="text-xs text-fuchsia-200 mt-1">at age {retireAge} ({retireAge - currentAge} years from now)</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><p className="text-xs text-fuchsia-200">Total Invested</p><p className="text-lg font-bold text-blue-200">{fmt(result.invested)}</p></div>
              <div><p className="text-xs text-fuchsia-200">Returns Earned</p><p className="text-lg font-bold text-amber-300">{fmt(result.returns)}</p></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Savings Growth</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chartData}>
                  <defs>
                    <linearGradient id="retGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="age" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} label={{ value: "Age", position: "bottom", fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="#d946ef" fill="url(#retGrad)" strokeWidth={2} name="Total Value" />
                  <Area type="monotone" dataKey="invested" stroke="#6366f1" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      <InsightCard
        icon={result.returns > result.invested * 2 ? "🎉" : "📊"}
        title="Retirement Insight"
        color={result.total > result.invested * 3 ? "green" : result.total > result.invested * 1.5 ? "blue" : "amber"}
        insight={`By age ${retireAge}, you'll have ${fmt(result.total)}. You invest ${fmt(result.invested)} from your pocket — ${fmt(result.returns)} comes from returns.`}
        tip={`Using the 4% rule, your ${fmt(result.total)} corpus could support about ${fmt(Math.round(result.total * 0.04))}/year in retirement withdrawals.`}
      />

      <CalculationHistory
        calculator="retirement"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setCurrentAge(Number(inputs.currentAge));
          setRetireAge(Number(inputs.retireAge));
          setCurrentSavings(Number(inputs.currentSavings));
          setMonthlySaving(Number(inputs.monthlySaving));
          setReturnRate(Number(inputs.returnRate));
        }}
      />

      {CALCULATOR_CONTENT.retirement && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.retirement}
          calculatorName="Retirement Calculator"
          dynamicExample={{
            setup: `You're ${currentAge} and want to retire at ${retireAge}. You have ${fmt(currentSavings)} saved and can invest ${fmt(monthlySaving)} monthly, expecting ${returnRate}% annual returns.`,
            calculation: `Over ${retireAge - currentAge} years, your existing ${fmt(currentSavings)} compounds annually at ${returnRate}%. Meanwhile, your ${fmt(monthlySaving)}/month contributions grow via SIP compounding. Both streams combine into your retirement corpus.`,
            result: `By age ${retireAge}, you'll have ${fmt(result.total)}. You will have invested ${fmt(result.invested)} from your pocket and earned ${fmt(result.returns)} in returns — ${result.invested > 0 ? `a ${((result.returns / result.invested) * 100).toFixed(0)}% gain from compounding` : ""}. ${retireAge - currentAge >= 25 ? "With this long runway, compounding is doing most of the heavy lifting." : "Starting earlier would amplify returns significantly."}`,
          }}
        />
      )}
    </div>
  );
}
