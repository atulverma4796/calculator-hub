"use client";

import { useState, useMemo } from "react";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const MILESTONES = [
  { week: 6, label: "First heartbeat detectable", icon: "💓" },
  { week: 12, label: "End of first trimester", icon: "🎉" },
  { week: 18, label: "Gender scan possible (18-20w)", icon: "👶" },
  { week: 24, label: "Viability milestone", icon: "⭐" },
  { week: 37, label: "Full term", icon: "🏁" },
  { week: 40, label: "Estimated due date", icon: "📅" },
];

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function getTrimester(week: number): number {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

export default function PregnancyCalculator() {
  const { getString } = useInitialParams();
  const today = new Date();
  const [method, setMethod] = useState<"lmp" | "due" | "conception">(getString("method", "lmp") as "lmp" | "due" | "conception");
  const [dateValue, setDateValue] = useState(getString("date", ""));

  useShareableURL({ method, date: dateValue });

  const result = useMemo(() => {
    if (!dateValue) return null;
    const inputDate = new Date(dateValue + "T00:00:00");
    if (isNaN(inputDate.getTime())) return null;

    let lmpDate: Date;
    let dueDate: Date;
    let conceptionDate: Date;

    if (method === "lmp") {
      lmpDate = inputDate;
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280); // Naegele's rule
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14); // ~2 weeks after LMP
    } else if (method === "due") {
      dueDate = inputDate;
      lmpDate = new Date(dueDate);
      lmpDate.setDate(lmpDate.getDate() - 280);
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14);
    } else {
      // conception
      conceptionDate = inputDate;
      lmpDate = new Date(conceptionDate);
      lmpDate.setDate(lmpDate.getDate() - 14);
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
    }

    const totalDaysPregnant = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(totalDaysPregnant / 7);
    const currentDay = totalDaysPregnant % 7;
    const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const trimester = getTrimester(currentWeek);
    const progressPercent = Math.min(100, Math.max(0, (totalDaysPregnant / 280) * 100));

    // If pregnancy is in the future or already past, we still show the info
    const isActive = totalDaysPregnant >= 0 && totalDaysPregnant <= 300;

    return {
      lmpDate,
      dueDate,
      conceptionDate,
      currentWeek: Math.max(0, currentWeek),
      currentDay: Math.max(0, currentDay),
      daysRemaining,
      trimester,
      progressPercent,
      isActive,
      totalDaysPregnant,
    };
  }, [dateValue, method]);

  useCalcHistory("pregnancy", { method, date: dateValue }, result ? `Due: ${formatDate(result.dueDate)} — Week ${result.currentWeek}` : "");

  const onReset = () => {
    setMethod("lmp");
    setDateValue("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ActionButtons onReset={onReset} pdfData={{
        calculatorName: "Pregnancy Due Date Calculator",
        inputs: [
          { label: "Method", value: method === "lmp" ? "Last Menstrual Period" : method === "due" ? "Known Due Date" : "Conception Date" },
          { label: "Date", value: dateValue },
        ],
        results: result ? [
          { label: "Due Date", value: formatDate(result.dueDate) },
          { label: "Current Week", value: `Week ${result.currentWeek}, Day ${result.currentDay}` },
          { label: "Trimester", value: `${result.trimester}` },
          { label: "Days Remaining", value: `${result.daysRemaining}` },
          { label: "Conception Date", value: formatDate(result.conceptionDate) },
        ] : [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Method toggle */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Calculate from:</label>
          <div className="flex flex-col sm:flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5 sm:gap-0">
            {([
              { value: "lmp", label: "Last Period (LMP)" },
              { value: "due", label: "Due Date" },
              { value: "conception", label: "Conception Date" },
            ] as const).map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMethod(m.value)}
                className={`flex-1 px-3 py-2.5 sm:py-1.5 rounded-md text-xs font-semibold transition-all ${
                  method === m.value
                    ? "bg-white dark:bg-gray-700 text-pink-700 dark:text-pink-300 shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date input */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            {method === "lmp" ? "First day of your last menstrual period" : method === "due" ? "Your known due date" : "Estimated conception date"}
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Results */}
      {result && (
        <>
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-pink-200 dark:shadow-pink-900/30 text-center">
            <p className="text-sm text-pink-100">Estimated Due Date</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-2 animate-count-up">{formatDate(result.dueDate)}</p>
            {result.isActive && result.daysRemaining > 0 && (
              <p className="text-sm text-pink-200 mt-3">
                Week <strong className="text-white">{result.currentWeek}</strong>, Day <strong className="text-white">{result.currentDay}</strong> — Trimester <strong className="text-white">{result.trimester}</strong>
              </p>
            )}
            {result.daysRemaining > 0 && (
              <p className="text-sm text-pink-200 mt-1">
                <strong className="text-amber-300">{result.daysRemaining}</strong> days to go!
              </p>
            )}
          </div>

          {/* Progress bar */}
          {result.isActive && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Week 0</span>
                <span>Week 40</span>
              </div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${result.progressPercent}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                {result.progressPercent.toFixed(0)}% complete
              </p>
            </div>
          )}

          {/* Key dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">LMP Date</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">{formatDate(result.lmpDate)}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Conception (est.)</p>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1">{formatDate(result.conceptionDate)}</p>
            </div>
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
              <p className="text-sm font-bold text-pink-700 dark:text-pink-300 mt-1">{formatDate(result.dueDate)}</p>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">Pregnancy Milestones</h3>
            <div className="space-y-3">
              {MILESTONES.map((milestone) => {
                const isPast = result.currentWeek >= milestone.week;
                const isCurrent = result.currentWeek >= milestone.week - 1 && result.currentWeek <= milestone.week + 1;
                return (
                  <div
                    key={milestone.week}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      isPast
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : isCurrent
                        ? "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 ring-2 ring-pink-200 dark:ring-pink-800"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <span className="text-lg">{milestone.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isPast ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"}`}>
                        Week {milestone.week}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{milestone.label}</p>
                    </div>
                    {isPast && (
                      <span className="text-green-600 dark:text-green-400 text-xs font-semibold">Reached</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <InsightCard
            icon="🤰"
            title="Pregnancy Insight"
            color="blue"
            insight={`You're in week ${result.currentWeek} of your pregnancy (Trimester ${result.trimester}). Your estimated due date is ${formatDate(result.dueDate)}. About ${result.daysRemaining > 0 ? result.daysRemaining : 0} days to go!`}
            tip={result.trimester === 1 ? "First trimester — focus on prenatal vitamins and rest." : result.trimester === 2 ? "Second trimester — the 'golden period'. Energy often improves!" : "Third trimester — the home stretch. Prepare your hospital bag!"}
          />
        </>
      )}

      <CalculationHistory
        calculator="pregnancy"
        onLoad={(inputs) => {
          setMethod(String(inputs.method) as "lmp" | "due" | "conception");
          setDateValue(String(inputs.date));
        }}
      />
    </div>
  );
}
