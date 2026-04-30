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

type Compounding = "annually" | "quarterly" | "monthly";

const COMPOUNDING_N: Record<Compounding, number> = {
  annually: 1,
  quarterly: 4,
  monthly: 12,
};

export default function FDCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [principal, setPrincipal] = useState(getNumber("principal", 100000));
  const [rate, setRate] = useState(getNumber("rate", 7.0));
  const [years, setYears] = useState(getNumber("years", 5));
  const [compounding, setCompounding] = useState<Compounding>(
    ((getString("compounding", "quarterly") as Compounding) in COMPOUNDING_N
      ? (getString("compounding", "quarterly") as Compounding)
      : "quarterly"),
  );

  useShareableURL({ principal, rate, years, compounding });

  const result = useMemo(() => {
    if (principal <= 0 || rate <= 0 || years <= 0) {
      return { maturity: principal, interest: 0 };
    }
    const r = rate / 100;
    const n = COMPOUNDING_N[compounding];
    const maturity = principal * Math.pow(1 + r / n, n * years);
    const interest = maturity - principal;
    return { maturity, interest };
  }, [principal, rate, years, compounding]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "fd",
    { principal, rate, years, compounding },
    `FD: ₹${fmtINR(principal)} → ₹${fmtINR(result.maturity)} in ${years} yrs @ ${rate}%`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setPrincipal(100000);
          setRate(7);
          setYears(5);
          setCompounding("quarterly");
        }}
        pdfData={{
          calculatorName: "Fixed Deposit Calculator",
          inputs: [
            { label: "Principal", value: `₹${fmtINR(principal)}` },
            { label: "Interest Rate", value: `${rate}% p.a.` },
            { label: "Tenure", value: `${years} years` },
            { label: "Compounding", value: compounding[0].toUpperCase() + compounding.slice(1) },
          ],
          results: [
            { label: "Maturity Amount", value: `₹${fmtINR(result.maturity)}` },
            { label: "Interest Earned", value: `₹${fmtINR(result.interest)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Most Indian banks compound FDs quarterly. Senior citizens typically get +0.5% above the listed rate.
          </p>

          {/* Principal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Principal Amount
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={principal}
                  onChange={setPrincipal}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setPrincipal(v)} />
              </div>
            </div>
            <input
              type="range"
              min={1000}
              max={10000000}
              step={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹1,000</span>
              <span>₹1,00,00,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Interest Rate <span className="text-gray-400 font-normal">(annual)</span>
              </label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={rate}
                  onChange={setRate}
                  min={0}
                  max={20}
                  step={0.1}
                  className="w-24 text-right text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tenure
              </label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={years}
                  onChange={setYears}
                  min={0}
                  max={30}
                  step={0.5}
                  className="w-24 text-right text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500">yrs</span>
              </div>
            </div>
            <input
              type="range"
              min={0.5}
              max={20}
              step={0.5}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0.5 yr</span>
              <span>20 yrs</span>
            </div>
          </div>

          {/* Compounding */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Compounding Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["annually", "quarterly", "monthly"] as Compounding[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompounding(c)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors capitalize ${
                    compounding === c
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
            <p className="text-sm font-medium text-blue-100">Maturity Amount</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">
              ₹{fmtINR(result.maturity)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-100">Principal</p>
                <p className="text-lg font-bold">₹{fmtINR(principal)}</p>
              </div>
              <div>
                <p className="text-xs text-blue-100">Interest</p>
                <p className="text-lg font-bold text-amber-300">₹{fmtINR(result.interest)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breakdown</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Invested</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(principal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{fmtINR(result.interest)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Effective annual yield</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {principal > 0 && years > 0
                  ? `${(((Math.pow(result.maturity / principal, 1 / years) - 1) * 100) || 0).toFixed(2)}%`
                  : "—"}
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Maturity</span>
              <span className="text-sm font-bold text-blue-700 dark:text-blue-400">₹{fmtINR(result.maturity)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon="💡"
        title="FD Insight"
        color="blue"
        insight={`Your ₹${fmtINR(principal)} grows to ₹${fmtINR(result.maturity)} in ${years} year${years === 1 ? "" : "s"} at ${rate}% p.a. (${compounding} compounding) — ₹${fmtINR(result.interest)} of interest.`}
        tip={
          rate > 0 && rate < 6
            ? "FD interest is fully taxable as per your slab. After tax, this rate may underperform inflation."
            : rate >= 7
              ? "Interest above ₹40,000 in a year (₹50,000 for senior citizens) attracts TDS at 10%. Submit Form 15G/15H if your total income is below the basic exemption limit."
              : undefined
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="fd"
        onLoad={(inputs) => {
          if (inputs.principal !== undefined) setPrincipal(Number(inputs.principal));
          if (inputs.rate !== undefined) setRate(Number(inputs.rate));
          if (inputs.years !== undefined) setYears(Number(inputs.years));
          if (inputs.compounding && (inputs.compounding as string) in COMPOUNDING_N) {
            setCompounding(inputs.compounding as Compounding);
          }
        }}
      />
    </div>
  );
}
