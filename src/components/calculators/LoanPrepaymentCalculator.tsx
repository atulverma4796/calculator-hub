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

function calcEMI(principal: number, monthlyRate: number, months: number): number {
  if (monthlyRate === 0) return principal / months;
  const f = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * f) / (f - 1);
}

function balanceAfterMonths(
  principal: number,
  monthlyRate: number,
  emi: number,
  monthsElapsed: number,
): number {
  if (monthsElapsed <= 0) return principal;
  if (monthlyRate === 0) return Math.max(principal - emi * monthsElapsed, 0);
  const f = Math.pow(1 + monthlyRate, monthsElapsed);
  return principal * f - emi * ((f - 1) / monthlyRate);
}

function monthsToPayoff(balance: number, monthlyRate: number, emi: number): number {
  if (balance <= 0) return 0;
  if (emi <= balance * monthlyRate) return Infinity;
  if (monthlyRate === 0) return balance / emi;
  return Math.log(emi / (emi - balance * monthlyRate)) / Math.log(1 + monthlyRate);
}

export default function LoanPrepaymentCalculator() {
  const { getNumber } = useInitialParams();
  const [loanAmount, setLoanAmount] = useState(getNumber("loanAmount", 5000000));
  const [annualRate, setAnnualRate] = useState(getNumber("annualRate", 8.5));
  const [originalYears, setOriginalYears] = useState(getNumber("originalYears", 20));
  const [prepayAmount, setPrepayAmount] = useState(getNumber("prepayAmount", 500000));
  const [prepayMonth, setPrepayMonth] = useState(getNumber("prepayMonth", 12));

  useShareableURL({ loanAmount, annualRate, originalYears, prepayAmount, prepayMonth });

  const result = useMemo(() => {
    const originalMonths = Math.round(originalYears * 12);
    const monthlyRate = annualRate / 100 / 12;
    if (loanAmount <= 0 || originalMonths <= 0 || annualRate < 0) {
      return null;
    }
    const emi = calcEMI(loanAmount, monthlyRate, originalMonths);
    const originalTotalPayment = emi * originalMonths;
    const originalTotalInterest = originalTotalPayment - loanAmount;

    // Scenario: same EMI, reduce tenure.
    const cappedPrepayMonth = Math.min(Math.max(prepayMonth, 0), originalMonths);
    const balanceBefore = balanceAfterMonths(loanAmount, monthlyRate, emi, cappedPrepayMonth);
    const cappedPrepay = Math.min(prepayAmount, balanceBefore);
    const balanceAfter = Math.max(balanceBefore - cappedPrepay, 0);

    const remainingMonths =
      balanceAfter <= 0 ? 0 : monthsToPayoff(balanceAfter, monthlyRate, emi);

    if (!isFinite(remainingMonths)) {
      // Pre-payment is so small that EMI doesn't cover monthly interest — shouldn't happen normally.
      return null;
    }

    const newTotalMonths = cappedPrepayMonth + remainingMonths;
    const newTotalPayment = emi * newTotalMonths + cappedPrepay;
    const newTotalInterest = newTotalPayment - loanAmount - cappedPrepay;

    const interestSaved = Math.max(originalTotalInterest - newTotalInterest, 0);
    const monthsSaved = Math.max(originalMonths - newTotalMonths, 0);

    return {
      emi,
      originalTotalInterest,
      originalTotalPayment,
      balanceBefore,
      cappedPrepay,
      balanceAfter,
      newTotalMonths,
      newTotalInterest,
      newTotalPayment,
      interestSaved,
      monthsSaved,
    };
  }, [loanAmount, annualRate, originalYears, prepayAmount, prepayMonth]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  const interestSaved = result?.interestSaved ?? 0;
  const monthsSaved = result?.monthsSaved ?? 0;
  const yearsSaved = monthsSaved / 12;
  const newTotalMonths = result?.newTotalMonths ?? 0;

  useCalcHistory(
    "loan-prepayment",
    { loanAmount, annualRate, originalYears, prepayAmount, prepayMonth },
    `Prepay ₹${fmtINR(prepayAmount)} → save ₹${fmtINR(interestSaved)} interest, ${monthsSaved.toFixed(0)} months`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setLoanAmount(5000000);
          setAnnualRate(8.5);
          setOriginalYears(20);
          setPrepayAmount(500000);
          setPrepayMonth(12);
        }}
        pdfData={{
          calculatorName: "Loan Prepayment Calculator",
          inputs: [
            { label: "Loan Amount", value: `₹${fmtINR(loanAmount)}` },
            { label: "Interest Rate", value: `${annualRate}% p.a.` },
            { label: "Original Tenure", value: `${originalYears} years` },
            { label: "Prepayment Amount", value: `₹${fmtINR(prepayAmount)}` },
            { label: "Prepayment Month", value: `${prepayMonth}` },
          ],
          results: [
            { label: "Monthly EMI", value: `₹${fmtINR(result?.emi ?? 0)}` },
            { label: "Original Total Interest", value: `₹${fmtINR(result?.originalTotalInterest ?? 0)}` },
            { label: "New Total Interest", value: `₹${fmtINR(result?.newTotalInterest ?? 0)}` },
            { label: "Interest Saved", value: `₹${fmtINR(interestSaved)}` },
            { label: "Tenure Reduction", value: `${monthsSaved.toFixed(0)} months (${yearsSaved.toFixed(1)} years)` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Reduce-tenure mode: same EMI continues, but the loan finishes earlier — usually saves the most interest. Floating-rate home loans have no prepayment penalty in India.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Original Loan Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={loanAmount}
                  onChange={setLoanAmount}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setLoanAmount(v)} />
              </div>
            </div>
            <input type="range" min={100000} max={50000000} step={100000} value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate</label>
                <div className="flex items-center gap-1">
                  <CalcInput
                    value={annualRate}
                    onChange={setAnnualRate}
                    min={0}
                    max={20}
                    step={0.05}
                    className="w-20 text-right text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
              <input type="range" min={5} max={15} step={0.05} value={annualRate} onChange={(e) => setAnnualRate(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tenure (years)</label>
                <CalcInput
                  value={originalYears}
                  onChange={setOriginalYears}
                  min={1}
                  max={40}
                  step={1}
                  className="w-20 text-right text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>
              <input type="range" min={1} max={30} step={1} value={originalYears} onChange={(e) => setOriginalYears(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Prepayment Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={prepayAmount}
                  onChange={setPrepayAmount}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setPrepayAmount(v)} />
              </div>
            </div>
            <input type="range" min={0} max={5000000} step={10000} value={prepayAmount} onChange={(e) => setPrepayAmount(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">After how many months from start?</label>
              <CalcInput
                value={prepayMonth}
                onChange={setPrepayMonth}
                min={1}
                max={originalYears * 12}
                step={1}
                className="w-20 text-right text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <input type="range" min={1} max={Math.max(2, originalYears * 12 - 1)} step={1} value={prepayMonth} onChange={(e) => setPrepayMonth(Number(e.target.value))} className="w-full" />
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              Earlier prepayment = bigger savings. The first 1/3 of any loan is mostly interest.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-6 text-white shadow-xl shadow-rose-200">
            <p className="text-sm font-medium text-rose-100">Interest Saved</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">₹{fmtINR(interestSaved)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-rose-100">Tenure cut</p>
                <p className="text-lg font-bold">{monthsSaved.toFixed(0)} mo</p>
                <p className="text-[11px] text-rose-200">≈ {yearsSaved.toFixed(1)} yrs</p>
              </div>
              <div>
                <p className="text-xs text-rose-100">New total months</p>
                <p className="text-lg font-bold text-amber-300">{newTotalMonths.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Comparison</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result?.emi ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Original interest</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result?.originalTotalInterest ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">After prepayment interest</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result?.newTotalInterest ?? 0)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Net saving</span>
              <span className="text-sm font-bold text-rose-700 dark:text-rose-400">₹{fmtINR(interestSaved)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={interestSaved > 0 ? "🎯" : "💡"}
        title="Prepayment Insight"
        color={interestSaved > 100000 ? "green" : "blue"}
        insight={
          interestSaved > 0
            ? `A ₹${fmtINR(prepayAmount)} prepayment in month ${prepayMonth} saves you ₹${fmtINR(interestSaved)} in interest and finishes the loan ${yearsSaved.toFixed(1)} years earlier — without changing your EMI.`
            : "Try increasing the prepayment amount or moving it earlier in the loan tenure."
        }
        tip={
          prepayMonth > originalYears * 6
            ? "You're prepaying late in the loan when most of the EMI is already principal. Earlier prepayments save significantly more."
            : interestSaved > prepayAmount * 0.5
              ? `Each rupee of prepayment is saving you about ${(interestSaved / prepayAmount).toFixed(2)} rupees of future interest — a strong return.`
              : undefined
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="loan-prepayment"
        onLoad={(inputs) => {
          if (inputs.loanAmount !== undefined) setLoanAmount(Number(inputs.loanAmount));
          if (inputs.annualRate !== undefined) setAnnualRate(Number(inputs.annualRate));
          if (inputs.originalYears !== undefined) setOriginalYears(Number(inputs.originalYears));
          if (inputs.prepayAmount !== undefined) setPrepayAmount(Number(inputs.prepayAmount));
          if (inputs.prepayMonth !== undefined) setPrepayMonth(Number(inputs.prepayMonth));
        }}
      />
    </div>
  );
}
