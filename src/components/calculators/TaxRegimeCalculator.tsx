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

// India FY 2025-26 (AY 2026-27) tax slabs — verified against
// Budget 2025 (Feb 1, 2025). New regime slabs and 87A rebate
// were significantly revised this year.

function calcOldRegime(taxableIncome: number): number {
  // Section 87A rebate: ₹12,500 if taxable income ≤ ₹5L
  if (taxableIncome <= 500000) {
    // tax computed below would be at most ₹12,500, fully rebated.
    return 0;
  }
  let tax = 0;
  let remaining = taxableIncome;
  // 0 - 2.5L: nil
  remaining -= 250000;
  if (remaining <= 0) return 0;
  // 2.5L - 5L: 5%
  const slab1 = Math.min(remaining, 250000);
  tax += slab1 * 0.05;
  remaining -= slab1;
  if (remaining <= 0) return tax + tax * 0.04;
  // 5L - 10L: 20%
  const slab2 = Math.min(remaining, 500000);
  tax += slab2 * 0.20;
  remaining -= slab2;
  if (remaining <= 0) return tax + tax * 0.04;
  // 10L+: 30%
  tax += remaining * 0.30;
  return tax + tax * 0.04; // 4% Health & Education Cess
}

function calcNewRegime(taxableIncome: number): number {
  // Section 87A rebate (Budget 2025): up to ₹60,000 — makes income
  // up to ₹12L effectively tax-free under the new regime.
  if (taxableIncome <= 1200000) return 0;
  let tax = 0;
  let remaining = taxableIncome;
  // 0 - 4L: nil
  remaining -= 400000;
  if (remaining <= 0) return 0;
  // 4 - 8L: 5%
  const slab1 = Math.min(remaining, 400000);
  tax += slab1 * 0.05;
  remaining -= slab1;
  if (remaining <= 0) return tax + tax * 0.04;
  // 8 - 12L: 10%
  const slab2 = Math.min(remaining, 400000);
  tax += slab2 * 0.10;
  remaining -= slab2;
  if (remaining <= 0) return tax + tax * 0.04;
  // 12 - 16L: 15%
  const slab3 = Math.min(remaining, 400000);
  tax += slab3 * 0.15;
  remaining -= slab3;
  if (remaining <= 0) return tax + tax * 0.04;
  // 16 - 20L: 20%
  const slab4 = Math.min(remaining, 400000);
  tax += slab4 * 0.20;
  remaining -= slab4;
  if (remaining <= 0) return tax + tax * 0.04;
  // 20 - 24L: 25%
  const slab5 = Math.min(remaining, 400000);
  tax += slab5 * 0.25;
  remaining -= slab5;
  if (remaining <= 0) return tax + tax * 0.04;
  // 24L+: 30%
  tax += remaining * 0.30;
  return tax + tax * 0.04; // 4% Health & Education Cess
}

export default function TaxRegimeCalculator() {
  const { getNumber } = useInitialParams();
  const [grossIncome, setGrossIncome] = useState(getNumber("grossIncome", 1500000));
  const [section80C, setSection80C] = useState(getNumber("section80C", 150000));
  const [section80D, setSection80D] = useState(getNumber("section80D", 25000));
  const [hraExemption, setHraExemption] = useState(getNumber("hraExemption", 0));
  const [homeLoanInterest, setHomeLoanInterest] = useState(getNumber("homeLoanInterest", 0));
  const [otherDeductions, setOtherDeductions] = useState(getNumber("otherDeductions", 0));

  useShareableURL({ grossIncome, section80C, section80D, hraExemption, homeLoanInterest, otherDeductions });

  const result = useMemo(() => {
    // Standard deduction
    const STANDARD_DEDUCTION_OLD = 50000;
    const STANDARD_DEDUCTION_NEW = 75000;

    // Old regime: gross - all deductions
    const totalOldDeductions =
      Math.min(section80C, 150000) +
      Math.min(section80D, 100000) +
      hraExemption +
      Math.min(homeLoanInterest, 200000) +
      otherDeductions +
      STANDARD_DEDUCTION_OLD;
    const taxableOld = Math.max(0, grossIncome - totalOldDeductions);
    const taxOld = calcOldRegime(taxableOld);

    // New regime: gross - standard deduction only (most exemptions removed)
    const taxableNew = Math.max(0, grossIncome - STANDARD_DEDUCTION_NEW);
    const taxNew = calcNewRegime(taxableNew);

    const better = taxOld < taxNew ? "old" : "new";
    const savings = Math.abs(taxOld - taxNew);

    return { taxableOld, taxOld, taxableNew, taxNew, better, savings };
  }, [grossIncome, section80C, section80D, hraExemption, homeLoanInterest, otherDeductions]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "tax-regime",
    { grossIncome, section80C, section80D, hraExemption, homeLoanInterest, otherDeductions },
    `${result.better.toUpperCase()} regime saves ₹${fmtINR(result.savings)} on ₹${fmtINR(grossIncome)} income`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setGrossIncome(1500000);
          setSection80C(150000);
          setSection80D(25000);
          setHraExemption(0);
          setHomeLoanInterest(0);
          setOtherDeductions(0);
        }}
        pdfData={{
          calculatorName: "Old vs New Tax Regime Calculator (India FY 2025-26)",
          inputs: [
            { label: "Gross Annual Income", value: `₹${fmtINR(grossIncome)}` },
            { label: "Section 80C", value: `₹${fmtINR(section80C)}` },
            { label: "Section 80D (Medical)", value: `₹${fmtINR(section80D)}` },
            { label: "HRA Exemption", value: `₹${fmtINR(hraExemption)}` },
            { label: "Home Loan Interest", value: `₹${fmtINR(homeLoanInterest)}` },
            { label: "Other Deductions", value: `₹${fmtINR(otherDeductions)}` },
          ],
          results: [
            { label: "Old Regime Tax", value: `₹${fmtINR(result.taxOld)}` },
            { label: "New Regime Tax", value: `₹${fmtINR(result.taxNew)}` },
            { label: "Better Regime", value: result.better === "old" ? "Old (with deductions)" : "New (lower slab rates)" },
            { label: "Savings", value: `₹${fmtINR(result.savings)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            FY 2025-26 (AY 2026-27) — Budget 2025 slabs. Standard deduction ₹50K (old) / ₹75K (new). New regime 87A rebate ₹60K makes income up to ₹12L tax-free; old regime rebate up to ₹5L.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Gross Annual Income</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput value={grossIncome} onChange={setGrossIncome} min={0}
                  className="w-32 text-right text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setGrossIncome(v)} />
              </div>
            </div>
            <input type="range" min={300000} max={10000000} step={50000} value={grossIncome}
              onChange={(e) => setGrossIncome(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹3L</span><span>₹1Cr</span>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Deductions (used only in Old Regime)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Section 80C <span className="text-gray-400">(max ₹1.5L)</span></label>
                <CalcInput value={section80C} onChange={setSection80C} min={0} max={150000}
                  className="w-full text-right text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Section 80D <span className="text-gray-400">(max ₹1L)</span></label>
                <CalcInput value={section80D} onChange={setSection80D} min={0} max={100000}
                  className="w-full text-right text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">HRA Exemption</label>
                <CalcInput value={hraExemption} onChange={setHraExemption} min={0}
                  className="w-full text-right text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Home Loan Interest <span className="text-gray-400">(max ₹2L)</span></label>
                <CalcInput value={homeLoanInterest} onChange={setHomeLoanInterest} min={0} max={200000}
                  className="w-full text-right text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Other Deductions <span className="text-gray-400">(80E, 80G, NPS, etc.)</span></label>
              <CalcInput value={otherDeductions} onChange={setOtherDeductions} min={0}
                className="w-full text-right text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className={`rounded-2xl p-6 shadow-xl text-white ${
            result.better === "new"
              ? "bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-200"
              : "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-200"
          }`}>
            <p className="text-sm font-medium opacity-90">Recommended for you</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">
              {result.better === "old" ? "Old Regime" : "New Regime"}
            </p>
            <p className="text-sm mt-2 opacity-90">Saves ₹{fmtINR(result.savings)}/year</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-blue-700 mb-2">OLD REGIME</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxable Income</span>
              <span className="font-bold">₹{fmtINR(result.taxableOld)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Tax Payable</span>
              <span className="font-bold text-blue-700">₹{fmtINR(result.taxOld)}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border-2 border-emerald-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-700 mb-2">NEW REGIME</p>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Taxable Income</span>
              <span className="font-bold">₹{fmtINR(result.taxableNew)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">Tax Payable</span>
              <span className="font-bold text-emerald-700">₹{fmtINR(result.taxNew)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon="💡"
        title="Tax Regime Insight"
        color={result.better === "new" ? "green" : "blue"}
        insight={
          result.better === "new"
            ? `New Regime is better for you — saves ₹${fmtINR(result.savings)} per year. The new regime has lower slab rates and no need to invest in 80C/80D to claim deductions.`
            : `Old Regime is better for you — saves ₹${fmtINR(result.savings)} per year. Your deductions (80C/80D/HRA/home loan) reduce taxable income enough to offset higher slab rates.`
        }
        tip={
          result.savings < 5000
            ? "The difference is small (under ₹5,000). Pick the simpler new regime if you don't already invest in 80C instruments."
            : "Switching regimes is allowed once per year (twice for salaried with no business income). File Form 10-IEA to opt out of the new regime."
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="tax-regime"
        onLoad={(inputs) => {
          if (inputs.grossIncome !== undefined) setGrossIncome(Number(inputs.grossIncome));
          if (inputs.section80C !== undefined) setSection80C(Number(inputs.section80C));
          if (inputs.section80D !== undefined) setSection80D(Number(inputs.section80D));
          if (inputs.hraExemption !== undefined) setHraExemption(Number(inputs.hraExemption));
          if (inputs.homeLoanInterest !== undefined) setHomeLoanInterest(Number(inputs.homeLoanInterest));
          if (inputs.otherDeductions !== undefined) setOtherDeductions(Number(inputs.otherDeductions));
        }}
      />
    </div>
  );
}
