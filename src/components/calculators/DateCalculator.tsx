"use client";

import { useState, useMemo } from "react";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

type Mode = "between" | "addsubtract" | "dayofyear";

export default function DateCalculator() {
  const { getString, getNumber } = useInitialParams();
  const today = new Date().toISOString().split("T")[0];

  const [mode, setMode] = useState<Mode>(getString("mode", "between") as Mode);

  // Days Between
  const [date1, setDate1] = useState(getString("date1", today));
  const [date2, setDate2] = useState(getString("date2", "2025-01-01"));

  // Add/Subtract
  const [baseDate, setBaseDate] = useState(getString("baseDate", today));
  const [amount, setAmount] = useState(getNumber("days", 30));
  const [unit, setUnit] = useState(getString("unit", "days"));
  const [operation, setOperation] = useState(getString("op", "add"));

  // Day of Year
  const [doyDate, setDoyDate] = useState(getString("doyDate", today));

  useShareableURL({ mode, date1, date2, baseDate, days: amount, unit, op: operation, doyDate });

  // Days Between calculation
  const betweenResult = useMemo(() => {
    if (!date1 || !date2) return null;
    const d1 = new Date(date1 + "T00:00:00");
    const d2 = new Date(date2 + "T00:00:00");
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Calculate months/years difference
    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;

    return { totalDays, weeks, remainingDays, years, months, days, totalMonths };
  }, [date1, date2]);

  // Add/Subtract calculation
  const addSubResult = useMemo(() => {
    if (!baseDate) return null;
    const d = new Date(baseDate + "T00:00:00");
    if (isNaN(d.getTime())) return null;

    const multiplier = operation === "add" ? 1 : -1;
    const val = amount * multiplier;

    const result = new Date(d);
    switch (unit) {
      case "days":
        result.setDate(result.getDate() + val);
        break;
      case "weeks":
        result.setDate(result.getDate() + val * 7);
        break;
      case "months":
        result.setMonth(result.getMonth() + val);
        break;
      case "years":
        result.setFullYear(result.getFullYear() + val);
        break;
    }

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return {
      date: result.toISOString().split("T")[0],
      formatted: result.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      dayName: dayNames[result.getDay()],
    };
  }, [baseDate, amount, unit, operation]);

  // Day of Year calculation
  const doyResult = useMemo(() => {
    if (!doyDate) return null;
    const d = new Date(doyDate + "T00:00:00");
    if (isNaN(d.getTime())) return null;

    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const endOfYear = new Date(d.getFullYear(), 11, 31);
    const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalDaysInYear = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDaysInYear - dayOfYear;
    const isLeapYear = totalDaysInYear === 366;

    // Week number (ISO)
    const tempDate = new Date(d.getTime());
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((tempDate.getTime() - week1.getTime()) / (1000 * 60 * 60 * 24) - 3 + ((week1.getDay() + 6) % 7)) / 7);

    const quarter = Math.ceil((d.getMonth() + 1) / 3);
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const percentComplete = ((dayOfYear / totalDaysInYear) * 100).toFixed(1);

    return {
      dayOfYear,
      weekNumber,
      daysRemaining,
      totalDaysInYear,
      isLeapYear,
      quarter,
      dayName: dayNames[d.getDay()],
      percentComplete,
    };
  }, [doyDate]);

  // History string
  const historyStr = useMemo(() => {
    if (mode === "between" && betweenResult) return `${betweenResult.totalDays} days between ${date1} and ${date2}`;
    if (mode === "addsubtract" && addSubResult) return `${baseDate} ${operation} ${amount} ${unit} = ${addSubResult.date}`;
    if (mode === "dayofyear" && doyResult) return `${doyDate}: Day ${doyResult.dayOfYear}, Week ${doyResult.weekNumber}`;
    return "";
  }, [mode, betweenResult, addSubResult, doyResult, date1, date2, baseDate, operation, amount, unit, doyDate]);

  useCalcHistory("date", { mode, date1, date2, baseDate, days: amount, unit, op: operation, doyDate }, historyStr);

  const tabClass = (m: Mode) =>
    `flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
      mode === m
        ? "bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    }`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ActionButtons
        onReset={() => {
          setDate1(today);
          setDate2("2025-01-01");
          setBaseDate(today);
          setAmount(30);
          setUnit("days");
          setOperation("add");
          setDoyDate(today);
        }}
        pdfData={{
          calculatorName: "Date Calculator",
          inputs:
            mode === "between"
              ? [{ label: "Date 1", value: date1 }, { label: "Date 2", value: date2 }]
              : mode === "addsubtract"
              ? [{ label: "Base Date", value: baseDate }, { label: "Operation", value: `${operation} ${amount} ${unit}` }]
              : [{ label: "Date", value: doyDate }],
          results:
            mode === "between" && betweenResult
              ? [
                  { label: "Total Days", value: String(betweenResult.totalDays) },
                  { label: "Weeks + Days", value: `${betweenResult.weeks} weeks, ${betweenResult.remainingDays} days` },
                  { label: "Years/Months/Days", value: `${betweenResult.years}y ${betweenResult.months}m ${betweenResult.days}d` },
                ]
              : mode === "addsubtract" && addSubResult
              ? [{ label: "Resulting Date", value: addSubResult.formatted }]
              : mode === "dayofyear" && doyResult
              ? [
                  { label: "Day of Year", value: String(doyResult.dayOfYear) },
                  { label: "Week Number", value: String(doyResult.weekNumber) },
                  { label: "Days Remaining", value: String(doyResult.daysRemaining) },
                ]
              : [],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      {/* Mode Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <button type="button" className={tabClass("between")} onClick={() => setMode("between")}>
          Days Between
        </button>
        <button type="button" className={tabClass("addsubtract")} onClick={() => setMode("addsubtract")}>
          Add / Subtract
        </button>
        <button type="button" className={tabClass("dayofyear")} onClick={() => setMode("dayofyear")}>
          Day of Year
        </button>
      </div>

      {/* Mode 1: Days Between */}
      {mode === "between" && (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">End Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
          </div>

          {betweenResult && (
            <>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-200 dark:shadow-violet-900/30 text-center">
                <p className="text-sm text-violet-100">Days Between</p>
                <p className="text-5xl font-extrabold mt-2 animate-count-up">{betweenResult.totalDays}</p>
                <p className="text-sm text-violet-200 mt-1">days</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Years", value: String(betweenResult.years) },
                  { label: "Months", value: String(betweenResult.totalMonths) },
                  { label: "Weeks", value: String(betweenResult.weeks) },
                  { label: "Days", value: String(betweenResult.totalDays) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <InsightCard
                icon="📅"
                title="Date Insight"
                color="blue"
                insight={`There are ${betweenResult.totalDays} days between these dates — that's about ${betweenResult.totalMonths} months and ${betweenResult.weeks} weeks.`}
                tip={betweenResult.years > 0 ? `That's ${betweenResult.years} year${betweenResult.years > 1 ? "s" : ""}, ${betweenResult.months} month${betweenResult.months !== 1 ? "s" : ""}, and ${betweenResult.days} day${betweenResult.days !== 1 ? "s" : ""}.` : undefined}
              />
            </>
          )}
        </>
      )}

      {/* Mode 2: Add/Subtract */}
      {mode === "addsubtract" && (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Start Date</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Operation</label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="add">Add (+)</option>
                  <option value="subtract">Subtract (-)</option>
                </select>
              </div>
              <div className="w-28">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Amount</label>
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </div>

          {addSubResult && (
            <>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-200 dark:shadow-violet-900/30 text-center">
                <p className="text-sm text-violet-100">Resulting Date</p>
                <p className="text-2xl sm:text-3xl font-extrabold mt-2">{addSubResult.formatted}</p>
              </div>

              <InsightCard
                icon="📅"
                title="Date Insight"
                color="blue"
                insight={`${operation === "add" ? "Adding" : "Subtracting"} ${amount} ${unit} ${operation === "add" ? "to" : "from"} ${new Date(baseDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} gives you ${addSubResult.formatted}.`}
              />
            </>
          )}
        </>
      )}

      {/* Mode 3: Day of Year */}
      {mode === "dayofyear" && (
        <>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Select a Date</label>
            <input
              type="date"
              value={doyDate}
              onChange={(e) => setDoyDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          {doyResult && (
            <>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-200 dark:shadow-violet-900/30 text-center">
                <p className="text-sm text-violet-100">Day of Year</p>
                <p className="text-5xl font-extrabold mt-2 animate-count-up">{doyResult.dayOfYear}</p>
                <p className="text-sm text-violet-200 mt-1">of {doyResult.totalDaysInYear} ({doyResult.isLeapYear ? "leap year" : "common year"})</p>
              </div>

              {/* Progress bar */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Year Progress</span>
                  <span className="font-bold text-violet-600 dark:text-violet-400">{doyResult.percentComplete}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${doyResult.percentComplete}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Day of Year", value: String(doyResult.dayOfYear) },
                  { label: "Week Number", value: String(doyResult.weekNumber) },
                  { label: "Quarter", value: `Q${doyResult.quarter}` },
                  { label: "Days Remaining", value: String(doyResult.daysRemaining) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <InsightCard
                icon="📅"
                title="Day Insight"
                color="blue"
                insight={`${doyDate} is a ${doyResult.dayName}, day ${doyResult.dayOfYear} of ${doyResult.totalDaysInYear} (week ${doyResult.weekNumber}, Q${doyResult.quarter}). There are ${doyResult.daysRemaining} days remaining in the year.`}
              />
            </>
          )}
        </>
      )}

      <CalculationHistory
        calculator="date"
        onLoad={(inputs) => {
          setMode(String(inputs.mode) as Mode);
          setDate1(String(inputs.date1));
          setDate2(String(inputs.date2));
          setBaseDate(String(inputs.baseDate));
          setAmount(Number(inputs.days));
          setUnit(String(inputs.unit));
          setOperation(String(inputs.op));
          setDoyDate(String(inputs.doyDate));
        }}
      />
    </div>
  );
}
