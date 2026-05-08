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

type Regime = "old" | "new";

// FY 2025-26 (Budget 2025) — verified May 2026
function calcOldRegime(taxableIncome: number): number {
  if (taxableIncome <= 500000) return 0; // 87A rebate
  let tax = 0;
  let remaining = taxableIncome;
  remaining -= 250000; // 0-2.5L: nil
  if (remaining <= 0) return 0;
  tax += Math.min(remaining, 250000) * 0.05; // 2.5-5L
  remaining -= 250000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += Math.min(remaining, 500000) * 0.20; // 5-10L
  remaining -= 500000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += remaining * 0.30; // 10L+
  return tax + tax * 0.04;
}

function calcNewRegime(taxableIncome: number): number {
  if (taxableIncome <= 1200000) return 0; // 87A rebate ₹60K
  let tax = 0;
  let remaining = taxableIncome;
  remaining -= 400000; // 0-4L: nil
  if (remaining <= 0) return 0;
  tax += Math.min(remaining, 400000) * 0.05; // 4-8L
  remaining -= 400000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += Math.min(remaining, 400000) * 0.10; // 8-12L
  remaining -= 400000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += Math.min(remaining, 400000) * 0.15; // 12-16L
  remaining -= 400000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += Math.min(remaining, 400000) * 0.20; // 16-20L
  remaining -= 400000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += Math.min(remaining, 400000) * 0.25; // 20-24L
  remaining -= 400000;
  if (remaining <= 0) return tax + tax * 0.04;
  tax += remaining * 0.30; // 24L+
  return tax + tax * 0.04;
}

export default function Form16Calculator() {
  const { getNumber, getString } = useInitialParams();

  // Salary components (annual)
  const [basicSalary, setBasicSalary] = useState(getNumber("basicSalary", 600000));
  const [hra, setHra] = useState(getNumber("hra", 240000));
  const [specialAllowance, setSpecialAllowance] = useState(getNumber("specialAllowance", 360000));
  const [bonus, setBonus] = useState(getNumber("bonus", 100000));
  const [otherIncome, setOtherIncome] = useState(getNumber("otherIncome", 0));

  // Exemptions / deductions
  const [hraExemption, setHraExemption] = useState(getNumber("hraExemption", 0));
  const [section80C, setSection80C] = useState(getNumber("section80C", 150000));
  const [section80D, setSection80D] = useState(getNumber("section80D", 25000));
  const [homeLoanInterest, setHomeLoanInterest] = useState(getNumber("homeLoanInterest", 0));
  const [otherDeductions, setOtherDeductions] = useState(getNumber("otherDeductions", 0));

  // TDS already deducted
  const [tdsDeducted, setTdsDeducted] = useState(getNumber("tdsDeducted", 0));

  const [regime, setRegime] = useState<Regime>(
    (getString("regime", "new") as Regime) === "old" ? "old" : "new",
  );

  useShareableURL({
    basicSalary, hra, specialAllowance, bonus, otherIncome,
    hraExemption, section80C, section80D, homeLoanInterest, otherDeductions,
    tdsDeducted, regime,
  });

  const result = useMemo(() => {
    const grossSalary = basicSalary + hra + specialAllowance + bonus + otherIncome;
    const STD_DEDUCTION = regime === "new" ? 75000 : 50000;

    let totalDeductions: number;
    let taxableIncome: number;
    let tax: number;

    if (regime === "old") {
      // Old: standard + HRA exemption + Chapter VI-A
      totalDeductions =
        STD_DEDUCTION +
        hraExemption +
        Math.min(section80C, 150000) +
        Math.min(section80D, 100000) +
        Math.min(homeLoanInterest, 200000) +
        otherDeductions;
      taxableIncome = Math.max(0, grossSalary - totalDeductions);
      tax = calcOldRegime(taxableIncome);
    } else {
      // New: only standard deduction allowed for salaried
      totalDeductions = STD_DEDUCTION;
      taxableIncome = Math.max(0, grossSalary - totalDeductions);
      tax = calcNewRegime(taxableIncome);
    }

    const balance = tax - tdsDeducted;
    const monthlyTds = tax / 12;

    return { grossSalary, totalDeductions, taxableIncome, tax, balance, monthlyTds, stdDeduction: STD_DEDUCTION };
  }, [basicSalary, hra, specialAllowance, bonus, otherIncome,
      hraExemption, section80C, section80D, homeLoanInterest, otherDeductions,
      tdsDeducted, regime]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "form-16",
    { basicSalary, hra, specialAllowance, bonus, otherIncome,
      hraExemption, section80C, section80D, homeLoanInterest, otherDeductions,
      tdsDeducted, regime },
    `Form 16 (${regime} regime): Gross ₹${fmtINR(result.grossSalary)}, Tax ₹${fmtINR(result.tax)}`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setBasicSalary(600000);
          setHra(240000);
          setSpecialAllowance(360000);
          setBonus(100000);
          setOtherIncome(0);
          setHraExemption(0);
          setSection80C(150000);
          setSection80D(25000);
          setHomeLoanInterest(0);
          setOtherDeductions(0);
          setTdsDeducted(0);
          setRegime("new");
        }}
        pdfData={{
          calculatorName: "Form 16 Tax Estimator (India FY 2025-26)",
          inputs: [
            { label: "Basic Salary", value: `₹${fmtINR(basicSalary)}` },
            { label: "HRA", value: `₹${fmtINR(hra)}` },
            { label: "Special Allowance", value: `₹${fmtINR(specialAllowance)}` },
            { label: "Bonus", value: `₹${fmtINR(bonus)}` },
            { label: "Other Income", value: `₹${fmtINR(otherIncome)}` },
            { label: "Tax Regime", value: regime === "new" ? "New" : "Old" },
          ],
          results: [
            { label: "Gross Annual Salary", value: `₹${fmtINR(result.grossSalary)}` },
            { label: "Total Deductions", value: `₹${fmtINR(result.totalDeductions)}` },
            { label: "Taxable Income", value: `₹${fmtINR(result.taxableIncome)}` },
            { label: "Tax + 4% Cess", value: `₹${fmtINR(result.tax)}` },
            { label: "Monthly TDS", value: `₹${fmtINR(result.monthlyTds)}` },
            { label: "TDS Already Deducted", value: `₹${fmtINR(tdsDeducted)}` },
            { label: result.balance >= 0 ? "Balance Tax Payable" : "Refund Due", value: `₹${fmtINR(Math.abs(result.balance))}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            FY 2025-26 (AY 2026-27) — Budget 2025 slabs. Use this to estimate the TDS your employer will deduct (Form 16 Part B). Match against your annual Form 16 to verify accuracy.
          </p>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Tax Regime</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setRegime("new")}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  regime === "new"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:border-emerald-400"
                }`}>
                New (default) <span className="text-[11px] font-normal opacity-80">— ₹12L tax-free</span>
              </button>
              <button type="button" onClick={() => setRegime("old")}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  regime === "old"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 hover:border-blue-400"
                }`}>
                Old <span className="text-[11px] font-normal opacity-80">— with deductions</span>
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Salary Components (annual)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Basic Salary</label>
                <CalcInput value={basicSalary} onChange={setBasicSalary} min={0}
                  className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">HRA</label>
                <CalcInput value={hra} onChange={setHra} min={0}
                  className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Special Allowance</label>
                <CalcInput value={specialAllowance} onChange={setSpecialAllowance} min={0}
                  className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Bonus / Variable</label>
                <CalcInput value={bonus} onChange={setBonus} min={0}
                  className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Other Income (LTA, etc.)</label>
              <CalcInput value={otherIncome} onChange={setOtherIncome} min={0}
                className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            </div>
          </div>

          {regime === "old" && (
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Deductions (Old Regime only)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">HRA Exemption (annual)</label>
                  <CalcInput value={hraExemption} onChange={setHraExemption} min={0}
                    className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Section 80C (max ₹1.5L)</label>
                  <CalcInput value={section80C} onChange={setSection80C} min={0} max={150000}
                    className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Section 80D (max ₹1L)</label>
                  <CalcInput value={section80D} onChange={setSection80D} min={0} max={100000}
                    className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Home Loan Interest (max ₹2L)</label>
                  <CalcInput value={homeLoanInterest} onChange={setHomeLoanInterest} min={0} max={200000}
                    className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Other (80E, 80G, NPS, etc.)</label>
                <CalcInput value={otherDeductions} onChange={setOtherDeductions} min={0}
                  className="w-full text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">TDS Already Deducted by Employer (cumulative)</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">₹</span>
              <CalcInput value={tdsDeducted} onChange={setTdsDeducted} min={0}
                className="flex-1 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <VoiceInputButton onResult={setTdsDeducted} />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Check your latest payslip for "TDS YTD" or Form 26AS</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {/* Form 16-style summary */}
          <div className="bg-white dark:bg-gray-900 border-2 border-indigo-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-indigo-700 mb-3 uppercase tracking-wide">Form 16 — Part B Summary</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Salary</span>
                <span className="font-bold">₹{fmtINR(result.grossSalary)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>− Standard Deduction</span>
                <span>−₹{fmtINR(result.stdDeduction)}</span>
              </div>
              {regime === "old" && hraExemption > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>− HRA Exemption</span>
                  <span>−₹{fmtINR(hraExemption)}</span>
                </div>
              )}
              {regime === "old" && (
                <div className="flex justify-between text-gray-500">
                  <span>− Chapter VI-A (80C/D etc.)</span>
                  <span>−₹{fmtINR(result.totalDeductions - result.stdDeduction - hraExemption)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-100 pt-2 mt-2">
                <span className="text-gray-700 font-semibold">Taxable Income</span>
                <span className="font-bold">₹{fmtINR(result.taxableIncome)}</span>
              </div>
              <div className="flex justify-between text-indigo-700 pt-1">
                <span className="font-semibold">Tax + 4% Cess</span>
                <span className="font-bold">₹{fmtINR(result.tax)}</span>
              </div>
            </div>
          </div>

          {/* Balance / refund */}
          <div className={`rounded-2xl p-5 shadow-xl text-white ${
            result.balance >= 0
              ? "bg-gradient-to-br from-rose-600 to-pink-700 shadow-rose-200"
              : "bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-200"
          }`}>
            <p className="text-xs font-medium opacity-90">
              {result.balance >= 0 ? "Balance Tax Payable" : "Refund Due"}
            </p>
            <p className="text-3xl font-extrabold mt-1">₹{fmtINR(Math.abs(result.balance))}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="opacity-80">Tax Liability</p>
                <p className="font-bold">₹{fmtINR(result.tax)}</p>
              </div>
              <div>
                <p className="opacity-80">TDS Deducted</p>
                <p className="font-bold">₹{fmtINR(tdsDeducted)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 rounded-xl p-4 text-xs">
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Monthly TDS estimate:</span> ₹{fmtINR(result.monthlyTds)}
            </p>
            <p className="text-gray-500 mt-1">
              Your employer should deduct roughly this amount each month and reflect it in Form 16 Part A.
            </p>
          </div>
        </div>
      </div>

      <InsightCard
        icon={result.balance >= 0 ? "⚠️" : "💰"}
        title="Form 16 Insight"
        color={result.balance >= 0 ? "amber" : "green"}
        insight={
          result.balance > 0
            ? `Your projected tax (₹${fmtINR(result.tax)}) exceeds TDS already deducted (₹${fmtINR(tdsDeducted)}) by ₹${fmtINR(result.balance)}. Either ask your employer to deduct more in remaining months, or pay this as self-assessment tax with your ITR.`
            : result.balance < 0
            ? `Your employer has deducted ₹${fmtINR(Math.abs(result.balance))} more than the actual liability. You'll get this refund after filing your ITR.`
            : `TDS matches tax liability — no balance to pay or refund expected. File ITR for compliance.`
        }
        tip={
          regime === "new" && result.taxableIncome > 1200000 && result.taxableIncome < 1275000
            ? "You're in the 'marginal relief' zone (income just over ₹12L). Section 87A's marginal relief caps your tax so you don't lose more than the amount you exceed ₹12L by."
            : regime === "old" && result.totalDeductions < 200000
            ? "You're using the Old regime but have low deductions. Try the Old vs New comparator to see which regime saves more."
            : undefined
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="form-16"
        onLoad={(inputs) => {
          if (inputs.basicSalary !== undefined) setBasicSalary(Number(inputs.basicSalary));
          if (inputs.hra !== undefined) setHra(Number(inputs.hra));
          if (inputs.specialAllowance !== undefined) setSpecialAllowance(Number(inputs.specialAllowance));
          if (inputs.bonus !== undefined) setBonus(Number(inputs.bonus));
          if (inputs.otherIncome !== undefined) setOtherIncome(Number(inputs.otherIncome));
          if (inputs.hraExemption !== undefined) setHraExemption(Number(inputs.hraExemption));
          if (inputs.section80C !== undefined) setSection80C(Number(inputs.section80C));
          if (inputs.section80D !== undefined) setSection80D(Number(inputs.section80D));
          if (inputs.homeLoanInterest !== undefined) setHomeLoanInterest(Number(inputs.homeLoanInterest));
          if (inputs.otherDeductions !== undefined) setOtherDeductions(Number(inputs.otherDeductions));
          if (inputs.tdsDeducted !== undefined) setTdsDeducted(Number(inputs.tdsDeducted));
          if (inputs.regime) setRegime((inputs.regime as Regime) === "old" ? "old" : "new");
        }}
      />
    </div>
  );
}
