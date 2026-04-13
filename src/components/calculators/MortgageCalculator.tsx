"use client";

import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
import CalcInput from "@/components/CalcInput";

export default function MortgageCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [price, setPrice] = useState(getNumber("price", 300000));
  const [down, setDown] = useState(getNumber("down", 60000));
  const [rate, setRate] = useState(getNumber("rate", 6.5));
  const [years, setYears] = useState(getNumber("years", 30));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setPrice(detected.defaultLoan);
      setDown(Math.round(detected.defaultLoan * 0.2));
    }
  }, [hasParams]);

  useShareableURL({ price, down, rate, years, currency: currency.code });

  const loan = price - down;
  const months = years * 12;
  const monthlyRate = rate / 12 / 100;

  const result = useMemo(() => {
    if (loan <= 0 || rate <= 0 || months <= 0) return { monthly: 0, totalPayment: 0, totalInterest: 0 };
    const monthly = (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = monthly * months;
    const totalInterest = totalPayment - loan;
    return { monthly: Math.round(monthly), totalPayment: Math.round(totalPayment), totalInterest: Math.round(totalInterest) };
  }, [loan, rate, months, monthlyRate]);

  const pieData = [
    { name: "Principal", value: loan, color: "#6366f1" },
    { name: "Interest", value: result.totalInterest, color: "#f59e0b" },
    { name: "Down Payment", value: down, color: "#10b981" },
  ];

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("mortgage", { price, down, rate, years, currency: currency.code }, `Monthly: ${fmt(result.monthly)} — Interest: ${fmt(result.totalInterest)}`);

  return (
    <div className="space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setPrice(c.defaultLoan);
        setDown(Math.round(c.defaultLoan * 0.2));
        setRate(6.5);
        setYears(30);
      }} pdfData={{
        calculatorName: "Mortgage Calculator",
        inputs: [
          { label: "Home Price", value: fmt(price) },
          { label: "Down Payment", value: `${fmt(down)} (${price > 0 ? ((down / price) * 100).toFixed(0) : 0}%)` },
          { label: "Interest Rate", value: `${rate}%` },
          { label: "Term", value: `${years} years` },
        ],
        results: [
          { label: "Monthly Payment", value: fmt(result.monthly) },
          { label: "Total Interest", value: fmt(result.totalInterest) },
          { label: "Total Cost", value: fmt(result.totalPayment + down) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setPrice(c.defaultLoan); setDown(Math.round(c.defaultLoan * 0.2)); }}
            accentColor="sky"
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Home Price</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput value={price} onChange={setPrice} className="w-32 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setPrice(v)} />
              </div>
            </div>
            <input type="range" min={10000} max={5000000} step={5000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Down Payment</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput value={down} onChange={setDown} className="w-32 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setDown(v)} />
              </div>
            </div>
            <input type="range" min={0} max={price} step={1000} value={down} onChange={(e) => setDown(Number(e.target.value))} className="w-full" />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Down payment: {price > 0 ? ((down / price) * 100).toFixed(1) : 0}% | Loan: {fmt(loan)}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate (%)</label>
              <div className="flex items-center gap-1">
                <CalcInput value={rate} onChange={setRate} step={0.1} className="w-24 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setRate(v)} />
              </div>
            </div>
            <input type="range" min={1} max={15} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Term (Years)</label>
              <div className="flex items-center gap-1">
                <CalcInput value={years} onChange={setYears} min={1} max={30} className="w-20 text-right text-sm font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg px-3 py-1.5" />
                <VoiceInputButton onResult={(v) => setYears(v)} />
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {[10, 15, 20, 25, 30].map((y) => (
                <button key={y} type="button" onClick={() => setYears(y)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${years === y ? "bg-sky-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>{y}yr</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-sky-200">
            <p className="text-sm text-sky-100">Monthly Payment</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.monthly)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><p className="text-xs text-sky-200">Total Interest</p><p className="text-lg font-bold text-amber-300">{fmt(result.totalInterest)}</p></div>
              <div><p className="text-xs text-sky-200">Total Cost</p><p className="text-lg font-bold">{fmt(result.totalPayment + down)}</p></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Cost Breakdown</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {pieData.map((e) => <Cell key={e.name} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-xs text-gray-600 dark:text-gray-400">{d.name}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <InsightCard
        icon={result.totalInterest > loan ? "⚠️" : "🏡"}
        title="Mortgage Insight"
        color={result.totalInterest > loan ? "red" : result.totalInterest > loan * 0.5 ? "amber" : "green"}
        insight={`With ${fmt(down)} down (${price > 0 ? ((down / price) * 100).toFixed(0) : 0}%), you borrow ${fmt(loan)}. Monthly payment: ${fmt(result.monthly)}. Total interest over ${years} years: ${fmt(result.totalInterest)}.`}
        tip={result.totalInterest > loan ? "The interest exceeds your loan amount! Consider a shorter term or larger down payment." : years > 20 ? `A ${years - 10}-year term would save over ${fmt(Math.round(result.totalInterest * 0.4))} in interest.` : undefined}
      />

      <CalculationHistory
        calculator="mortgage"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setPrice(Number(inputs.price));
          setDown(Number(inputs.down));
          setRate(Number(inputs.rate));
          setYears(Number(inputs.years));
        }}
      />

      {CALCULATOR_CONTENT.mortgage && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.mortgage}
          calculatorName="Mortgage Calculator"
          dynamicExample={{
            setup: `You're buying a home worth ${fmt(price)} with a ${fmt(down)} down payment (${price > 0 ? ((down / price) * 100).toFixed(0) : 0}%), borrowing ${fmt(loan)} at ${rate}% for ${years} years.`,
            calculation: `After your ${fmt(down)} down payment, the bank lends you ${fmt(loan)}. This is split into ${years * 12} equal monthly payments, each covering principal repayment plus interest on the remaining balance. Early payments are mostly interest; later payments pay off more principal.`,
            result: `Your monthly mortgage payment is ${fmt(result.monthly)}. Over ${years} years, you'll pay ${fmt(result.totalInterest)} in interest on top of the ${fmt(loan)} loan — making the total cost of the home ${fmt(result.totalPayment + down)} including your down payment. ${result.totalInterest > loan ? "The interest exceeds the loan itself! A shorter term or larger down payment would save significantly." : ""}`,
          }}
        />
      )}
    </div>
  );
}
