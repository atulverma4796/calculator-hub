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

const TAX_EXEMPT_CAP = 2000000; // ₹20 lakh

export default function GratuityCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [lastSalary, setLastSalary] = useState(getNumber("lastSalary", 60000));
  const [years, setYears] = useState(getNumber("years", 10));
  const [covered, setCovered] = useState<"yes" | "no">(
    (getString("covered", "yes") as "yes" | "no") === "no" ? "no" : "yes",
  );

  useShareableURL({ lastSalary, years, covered });

  const result = useMemo(() => {
    if (lastSalary <= 0 || years <= 0) {
      return { gratuity: 0, exempt: 0, taxable: 0, eligible: false };
    }
    // Eligibility: 5+ years (or death/disablement, ignored here for simplicity).
    const eligible = years >= 5;
    if (!eligible) {
      return { gratuity: 0, exempt: 0, taxable: 0, eligible: false };
    }

    // For "covered" employees, partial year of 6+ months counts as 1 full year.
    // For "not covered", only completed years count.
    const completedYears = Math.floor(years);
    const monthsExtra = (years - completedYears) * 12;
    let countedYears: number;
    if (covered === "yes") {
      countedYears = monthsExtra >= 6 ? completedYears + 1 : completedYears;
    } else {
      countedYears = completedYears;
    }

    // Gratuity formula:
    //   Covered:     (last salary × 15 × years) / 26
    //   Not covered: (last salary × 15 × years) / 30
    const divisor = covered === "yes" ? 26 : 30;
    const gratuity = (lastSalary * 15 * countedYears) / divisor;

    const exempt = Math.min(gratuity, TAX_EXEMPT_CAP);
    const taxable = Math.max(gratuity - TAX_EXEMPT_CAP, 0);

    return { gratuity, exempt, taxable, eligible, countedYears };
  }, [lastSalary, years, covered]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "gratuity",
    { lastSalary, years, covered },
    `Gratuity: ₹${fmtINR(result.gratuity)} (exempt ₹${fmtINR(result.exempt)})`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setLastSalary(60000);
          setYears(10);
          setCovered("yes");
        }}
        pdfData={{
          calculatorName: "Gratuity Calculator",
          inputs: [
            { label: "Last Salary (Basic + DA, monthly)", value: `₹${fmtINR(lastSalary)}` },
            { label: "Years of Service", value: `${years}` },
            { label: "Covered by Gratuity Act", value: covered === "yes" ? "Yes" : "No" },
          ],
          results: [
            { label: "Gratuity Amount", value: `₹${fmtINR(result.gratuity)}` },
            { label: "Tax-Exempt", value: `₹${fmtINR(result.exempt)}` },
            { label: "Taxable Portion", value: `₹${fmtINR(result.taxable)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Payment of Gratuity Act, 1972. Eligibility starts at 5 years of continuous service. Tax exemption capped at ₹20 lakh.
          </p>

          {/* Last drawn salary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Last Salary <span className="text-gray-400 font-normal">(Basic + DA, monthly)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={lastSalary}
                  onChange={setLastSalary}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setLastSalary(v)} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={1000}
              value={lastSalary}
              onChange={(e) => setLastSalary(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Years of Service
              </label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={years}
                  onChange={setYears}
                  min={0}
                  max={50}
                  step={0.5}
                  className="w-24 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setYears(v)} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={0.5}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0</span>
              <span>50</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              For covered employees, a partial year of 6+ months counts as a full year.
            </p>
          </div>

          {/* Covered toggle */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              Covered by the Gratuity Act?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCovered("yes")}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  covered === "yes"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-400"
                }`}
              >
                Yes <span className="text-[11px] font-normal opacity-80">(divisor 26)</span>
              </button>
              <button
                type="button"
                onClick={() => setCovered("no")}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  covered === "no"
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-400"
                }`}
              >
                No <span className="text-[11px] font-normal opacity-80">(divisor 30)</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              Covered = your employer has 10+ employees and is registered under the Act. Most private companies are.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-white shadow-xl shadow-orange-200">
            <p className="text-sm font-medium text-orange-100">Gratuity Amount</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">
              ₹{fmtINR(result.gratuity)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-orange-100">Tax-Exempt</p>
                <p className="text-lg font-bold">₹{fmtINR(result.exempt)}</p>
              </div>
              <div>
                <p className="text-xs text-orange-100">Taxable</p>
                <p className="text-lg font-bold text-amber-300">₹{fmtINR(result.taxable)}</p>
              </div>
            </div>
          </div>

          {/* Formula breakdown */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Formula</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {covered === "yes" ? "(Salary × 15 × Years) / 26" : "(Salary × 15 × Years) / 30"}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Counted Years</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {result.eligible ? result.countedYears : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Daily wage equivalent</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                ₹{fmtINR(lastSalary / (covered === "yes" ? 26 : 30))}
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">15 days × counted years</span>
              <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                ₹{fmtINR(result.gratuity)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={!result.eligible ? "⚠️" : "💡"}
        title="Gratuity Insight"
        color={!result.eligible ? "amber" : "blue"}
        insight={
          !result.eligible
            ? "Gratuity requires 5 or more years of continuous service. Below 5 years, no gratuity is payable (except in case of death or disablement)."
            : `You'll receive ₹${fmtINR(result.gratuity)} as gratuity. ${
                result.taxable > 0
                  ? `₹${fmtINR(TAX_EXEMPT_CAP)} is tax-exempt under Section 10(10); the remaining ₹${fmtINR(result.taxable)} is taxable as salary.`
                  : "The full amount is tax-exempt under Section 10(10) (within the ₹20 lakh cap)."
              }`
        }
        tip={
          result.eligible && covered === "no"
            ? "If your employer becomes covered under the Act later, the divisor changes from 30 to 26 — increasing your gratuity by about 15%."
            : undefined
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="gratuity"
        onLoad={(inputs) => {
          if (inputs.lastSalary !== undefined) setLastSalary(Number(inputs.lastSalary));
          if (inputs.years !== undefined) setYears(Number(inputs.years));
          if (inputs.covered) setCovered((inputs.covered as "yes" | "no") === "no" ? "no" : "yes");
        }}
      />
    </div>
  );
}
