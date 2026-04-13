"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import VoiceInputButton from "@/components/VoiceInputButton";
import CalcInput from "@/components/CalcInput";

export default function LoanEligibilityCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [monthlyIncome, setMonthlyIncome] = useState(getNumber("monthlyIncome", 5000));
  const [existingEMIs, setExistingEMIs] = useState(getNumber("existingEMIs", 500));
  const [rate, setRate] = useState(getNumber("rate", 8.5));
  const [tenure, setTenure] = useState(getNumber("tenure", 20));
  const [downPaymentPct, setDownPaymentPct] = useState(getNumber("downPaymentPct", 20));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setMonthlyIncome(Math.round(detected.defaultSalary / 12));
      setExistingEMIs(0);
    }
  }, [hasParams]);

  useShareableURL({ monthlyIncome, existingEMIs, rate, tenure, downPaymentPct, currency: currency.code });

  const result = useMemo(() => {
    if (monthlyIncome <= 0 || rate <= 0 || tenure <= 0) {
      return { maxEMI: 0, maxLoan: 0, totalPropertyValue: 0, downPayment: 0, totalPayment: 0, totalInterest: 0 };
    }

    const maxEMI = Math.max(0, (monthlyIncome - existingEMIs) * 0.5);
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;

    // Reverse EMI formula: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
    const maxLoan = maxEMI > 0 && monthlyRate > 0
      ? maxEMI * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months))
      : 0;

    const downPaymentFraction = downPaymentPct / 100;
    // If loan covers (1 - downPaymentPct)% of property, total property = loan / (1 - downPaymentPct/100)
    const totalPropertyValue = downPaymentFraction < 1 ? maxLoan / (1 - downPaymentFraction) : 0;
    const downPayment = totalPropertyValue * downPaymentFraction;
    const totalPayment = maxEMI * months;
    const totalInterest = totalPayment - maxLoan;

    return {
      maxEMI: Math.round(maxEMI),
      maxLoan: Math.round(maxLoan),
      totalPropertyValue: Math.round(totalPropertyValue),
      downPayment: Math.round(downPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
    };
  }, [monthlyIncome, existingEMIs, rate, tenure, downPaymentPct]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("loan-eligibility", { monthlyIncome, existingEMIs, rate, tenure, downPaymentPct, currency: currency.code }, `Max Loan: ${fmt(result.maxLoan)} — Property: ${fmt(result.totalPropertyValue)}`);

  const affordableLabel = result.totalPropertyValue > result.maxLoan * 3 ? "home" : "home/car";

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setMonthlyIncome(Math.round(c.defaultSalary / 12));
        setExistingEMIs(0);
        setRate(8.5);
        setTenure(20);
        setDownPaymentPct(20);
      }} pdfData={{
        calculatorName: "Loan Eligibility Calculator",
        inputs: [
          { label: "Monthly Income", value: fmt(monthlyIncome) },
          { label: "Existing EMIs", value: fmt(existingEMIs) },
          { label: "Interest Rate", value: `${rate}% p.a.` },
          { label: "Tenure", value: `${tenure} years` },
          { label: "Down Payment", value: `${downPaymentPct}%` },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Max Affordable EMI", value: fmt(result.maxEMI) },
          { label: "Max Loan Amount", value: fmt(result.maxLoan) },
          { label: "Property Value You Can Afford", value: fmt(result.totalPropertyValue) },
          { label: "Down Payment Required", value: fmt(result.downPayment) },
          { label: "Total Interest", value: fmt(result.totalInterest) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setMonthlyIncome(Math.round(c.defaultSalary / 12)); setExistingEMIs(0); }}
          />

          {/* Monthly Income */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Income</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={monthlyIncome}
                  onChange={setMonthlyIncome}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setMonthlyIncome(v)} />
              </div>
            </div>
            <input type="range" min={500} max={500000} step={500} value={monthlyIncome} onChange={(e) => setMonthlyIncome(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(500, currency)}</span>
              <span>{formatAmount(500000, currency)}</span>
            </div>
          </div>

          {/* Existing EMIs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Existing EMIs / Obligations</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={existingEMIs}
                  onChange={setExistingEMIs}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setExistingEMIs(v)} />
              </div>
            </div>
            <input type="range" min={0} max={200000} step={100} value={existingEMIs} onChange={(e) => setExistingEMIs(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(0, currency)}</span>
              <span>{formatAmount(200000, currency)}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate (% p.a.)</label>
              <CalcInput
                value={rate}
                onChange={setRate}
                step={0.1}
                min={0.1}
                max={30}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setRate(v)} />
            </div>
            <input type="range" min={1} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Tenure (Years)</label>
              <CalcInput
                value={tenure}
                onChange={setTenure}
                min={1}
                max={30}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setTenure(v)} />
            </div>
            <input type="range" min={1} max={30} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Down Payment % */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Down Payment (%)</label>
              <CalcInput
                value={downPaymentPct}
                onChange={setDownPaymentPct}
                min={0}
                max={90}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setDownPaymentPct(v)} />
            </div>
            <input type="range" min={0} max={90} step={1} value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0%</span>
              <span>90%</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Result Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <p className="text-sm font-medium text-indigo-200">Maximum Loan Amount</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">{fmt(result.maxLoan)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-200">Affordable EMI</p>
                <p className="text-lg font-bold text-amber-300">{fmt(result.maxEMI)}/mo</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200">Total Interest</p>
                <p className="text-lg font-bold">{fmt(result.totalInterest)}</p>
              </div>
            </div>
          </div>

          {/* Property Value Card */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Property Affordability</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Property Value</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.totalPropertyValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Down Payment ({downPaymentPct}%)</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmt(result.downPayment)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{fmt(result.maxLoan)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Repayment</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmt(result.totalPayment)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={existingEMIs > monthlyIncome * 0.3 ? "⚠️" : "💡"}
        title="Eligibility Insight"
        color={existingEMIs > monthlyIncome * 0.3 ? "amber" : "green"}
        insight={`You can afford a ${affordableLabel} worth up to ${fmt(result.totalPropertyValue)} with ${fmt(result.downPayment)} down payment. Banks typically allow up to 50% of your net income (after existing obligations) as EMI.`}
        tip={existingEMIs > 0 ? `Clearing your existing EMIs of ${fmt(existingEMIs)}/mo would increase your eligible loan by ${fmt(Math.round(existingEMIs * 0.5 * (Math.pow(1 + rate / 1200, tenure * 12) - 1) / (rate / 1200 * Math.pow(1 + rate / 1200, tenure * 12))))}!` : undefined}
      />

      <CalculationHistory calculator="loan-eligibility" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.monthlyIncome) setMonthlyIncome(Number(inputs.monthlyIncome));
        if (inputs.existingEMIs) setExistingEMIs(Number(inputs.existingEMIs));
        if (inputs.rate) setRate(Number(inputs.rate));
        if (inputs.tenure) setTenure(Number(inputs.tenure));
        if (inputs.downPaymentPct) setDownPaymentPct(Number(inputs.downPaymentPct));
      }} />
    </div>
  );
}
