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

export default function RDCalculator() {
  const { getNumber } = useInitialParams();
  const [monthlyDeposit, setMonthlyDeposit] = useState(getNumber("monthlyDeposit", 5000));
  const [rate, setRate] = useState(getNumber("rate", 7.0));
  const [years, setYears] = useState(getNumber("years", 5));

  useShareableURL({ monthlyDeposit, rate, years });

  const result = useMemo(() => {
    if (monthlyDeposit <= 0 || rate <= 0 || years <= 0) {
      return { maturity: 0, totalDeposited: 0, interest: 0 };
    }
    const totalMonths = Math.round(years * 12);
    const quarterlyRate = rate / 100 / 4;
    // Each monthly deposit compounds quarterly until maturity.
    // Months remaining for the k-th deposit = totalMonths - k + 1.
    let maturity = 0;
    for (let m = 1; m <= totalMonths; m++) {
      const monthsRemaining = totalMonths - m + 1;
      const quartersRemaining = monthsRemaining / 3;
      maturity += monthlyDeposit * Math.pow(1 + quarterlyRate, quartersRemaining);
    }
    const totalDeposited = monthlyDeposit * totalMonths;
    const interest = maturity - totalDeposited;
    return { maturity, totalDeposited, interest };
  }, [monthlyDeposit, rate, years]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "rd",
    { monthlyDeposit, rate, years },
    `RD: ₹${fmtINR(monthlyDeposit)}/mo × ${years} yrs @ ${rate}% → ₹${fmtINR(result.maturity)}`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setMonthlyDeposit(5000);
          setRate(7);
          setYears(5);
        }}
        pdfData={{
          calculatorName: "Recurring Deposit Calculator",
          inputs: [
            { label: "Monthly Deposit", value: `₹${fmtINR(monthlyDeposit)}` },
            { label: "Interest Rate", value: `${rate}% p.a.` },
            { label: "Tenure", value: `${years} years` },
          ],
          results: [
            { label: "Maturity Amount", value: `₹${fmtINR(result.maturity)}` },
            { label: "Total Deposited", value: `₹${fmtINR(result.totalDeposited)}` },
            { label: "Interest Earned", value: `₹${fmtINR(result.interest)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Indian RDs typically compound quarterly. Tenure is usually 6 months to 10 years. Premature withdrawal carries a small penalty.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Deposit</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={monthlyDeposit}
                  onChange={setMonthlyDeposit}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setMonthlyDeposit(v)} />
              </div>
            </div>
            <input
              type="range"
              min={100}
              max={100000}
              step={100}
              value={monthlyDeposit}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹100</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate <span className="text-gray-400 font-normal">(annual)</span></label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={rate}
                  onChange={setRate}
                  min={0}
                  max={20}
                  step={0.1}
                  className="w-24 text-right text-sm font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1%</span>
              <span>15%</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tenure</label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={years}
                  onChange={setYears}
                  min={0.5}
                  max={20}
                  step={0.5}
                  className="w-24 text-right text-sm font-bold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500">yrs</span>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0.5 yr</span>
              <span>10 yrs</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-cyan-200">
            <p className="text-sm font-medium text-cyan-100">Maturity Amount</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">₹{fmtINR(result.maturity)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-cyan-100">Deposited</p>
                <p className="text-lg font-bold">₹{fmtINR(result.totalDeposited)}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-100">Interest</p>
                <p className="text-lg font-bold text-amber-300">₹{fmtINR(result.interest)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total months</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{Math.round(years * 12)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total deposited</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result.totalDeposited)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Interest earned</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{fmtINR(result.interest)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Maturity</span>
              <span className="text-sm font-bold text-cyan-700 dark:text-cyan-400">₹{fmtINR(result.maturity)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon="💡"
        title="RD Insight"
        color="blue"
        insight={`Saving ₹${fmtINR(monthlyDeposit)}/month for ${years} years at ${rate}% builds you ₹${fmtINR(result.maturity)} — your money grew by ${result.totalDeposited > 0 ? ((result.interest / result.totalDeposited) * 100).toFixed(1) : "0"}%.`}
        tip="RD interest is fully taxable as per your slab. TDS applies if total interest from a single bank crosses ₹40,000/year (₹50,000 for senior citizens)."
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="rd"
        onLoad={(inputs) => {
          if (inputs.monthlyDeposit !== undefined) setMonthlyDeposit(Number(inputs.monthlyDeposit));
          if (inputs.rate !== undefined) setRate(Number(inputs.rate));
          if (inputs.years !== undefined) setYears(Number(inputs.years));
        }}
      />
    </div>
  );
}
