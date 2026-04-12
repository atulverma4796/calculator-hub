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

export default function CompoundInterestCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [principal, setPrincipal] = useState(getNumber("principal", 100000));
  const [rate, setRate] = useState(getNumber("rate", 8));
  const [years, setYears] = useState(getNumber("years", 10));
  const [compounding, setCompounding] = useState<1 | 2 | 4 | 12 | 365>(getNumber("compounding", 12) as 1 | 2 | 4 | 12 | 365);

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setPrincipal(Math.round(detected.defaultLoan / 3));
    }
  }, [hasParams]);

  useShareableURL({ principal, rate, years, compounding, currency: currency.code });

  const result = useMemo(() => {
    const n = compounding;
    const amount = principal * Math.pow(1 + rate / 100 / n, n * years);
    const interest = amount - principal;

    const chartData = [];
    for (let y = 0; y <= years; y++) {
      const val = principal * Math.pow(1 + rate / 100 / n, n * y);
      chartData.push({ year: y, value: Math.round(val), principal });
    }

    return { amount: Math.round(amount), interest: Math.round(interest), chartData };
  }, [principal, rate, years, compounding]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("compound-interest", { principal, rate, years, compounding, currency: currency.code }, `${fmt(principal)} → ${fmt(result.amount)} in ${years} years`);

  return (
    <div className="space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setPrincipal(Math.round(c.defaultLoan / 3));
        setRate(8);
        setYears(10);
        setCompounding(12);
      }} pdfData={{
        calculatorName: "Compound Interest Calculator",
        inputs: [
          { label: "Principal", value: fmt(principal) },
          { label: "Rate", value: `${rate}% p.a.` },
          { label: "Period", value: `${years} years` },
          { label: "Compounding", value: compounding === 1 ? "Annually" : compounding === 12 ? "Monthly" : compounding === 365 ? "Daily" : `${compounding}x/year` },
        ],
        results: [
          { label: "Final Amount", value: fmt(result.amount) },
          { label: "Interest Earned", value: fmt(result.interest) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setPrincipal(Math.round(c.defaultLoan / 3)); }}
            accentColor="amber"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Principal Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value) || 0)} className="w-32 text-right text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setPrincipal(v)} />
              </div>
            </div>
            <input type="range" min={1000} max={10000000} step={1000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} step={0.5} className="w-24 text-right text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setRate(v)} />
              </div>
            </div>
            <input type="range" min={0.5} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Period (Years)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value) || 1)} min={1} max={50} className="w-20 text-right text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setYears(v)} />
              </div>
            </div>
            <input type="range" min={1} max={50} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Compounding Frequency</label>
            <div className="flex flex-wrap gap-2">
              {([{ v: 1, l: "Annually" }, { v: 2, l: "Semi-Annual" }, { v: 4, l: "Quarterly" }, { v: 12, l: "Monthly" }, { v: 365, l: "Daily" }] as const).map((opt) => (
                <button key={opt.v} type="button" onClick={() => setCompounding(opt.v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${compounding === opt.v ? "border-amber-500 bg-amber-50 text-amber-700" : "border-gray-200 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"}`}>{opt.l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-200">
            <p className="text-sm font-medium text-amber-100">Total Amount</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.amount)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-amber-100">Principal</p>
                <p className="text-lg font-bold text-blue-200">{fmt(principal)}</p>
              </div>
              <div>
                <p className="text-xs text-amber-100">Interest Earned</p>
                <p className="text-lg font-bold text-green-200">{fmt(result.interest)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Growth Curve</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chartData}>
                  <defs>
                    <linearGradient id="ciGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#ciGrad)" strokeWidth={2} name="Total Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      <InsightCard
        icon="💰"
        title="Growth Insight"
        color={result.amount > principal * 2 ? "green" : "blue"}
        insight={`Your ${fmt(principal)} grows to ${fmt(result.amount)} in ${years} years — that's ${fmt(result.interest)} in pure interest earnings.`}
        tip={result.amount > principal * 2 ? `Your money more than doubled! The Rule of 72 says it takes about ${Math.round(72 / rate)} years to double at ${rate}%.` : `At ${rate}%, your money doubles in about ${Math.round(72 / rate)} years (Rule of 72).`}
      />

      <CalculationHistory
        calculator="compound-interest"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setPrincipal(Number(inputs.principal));
          setRate(Number(inputs.rate));
          setYears(Number(inputs.years));
          setCompounding(Number(inputs.compounding) as 1 | 2 | 4 | 12 | 365);
        }}
      />

      {CALCULATOR_CONTENT["compound-interest"] && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT["compound-interest"]}
          calculatorName="Compound Interest Calculator"
          dynamicExample={{
            setup: `You invest ${fmt(principal)} at ${rate}% annual interest, compounded ${compounding === 1 ? "annually" : compounding === 2 ? "semi-annually" : compounding === 4 ? "quarterly" : compounding === 12 ? "monthly" : "daily"}, for ${years} years.`,
            calculation: `Every ${compounding === 1 ? "year" : compounding === 12 ? "month" : compounding === 365 ? "day" : "period"}, interest is calculated on your total balance — not just your original ${fmt(principal)}. So each period, you earn interest on your interest from previous periods. This snowball effect is what makes compound interest so powerful.`,
            result: `After ${years} years, your ${fmt(principal)} grows to ${fmt(result.amount)}. You earned ${fmt(result.interest)} in interest — ${principal > 0 ? `that's a ${((result.interest / principal) * 100).toFixed(0)}% total gain` : ""}. ${result.amount > principal * 2 ? "Your money more than doubled!" : "A longer time period or higher rate would amplify this further."}`,
          }}
        />
      )}
    </div>
  );
}
