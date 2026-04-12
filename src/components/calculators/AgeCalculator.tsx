"use client";

import { useState, useMemo } from "react";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

export default function AgeCalculator() {
  const { getString } = useInitialParams();
  const today = new Date();
  const [dob, setDob] = useState(getString("dob", "1995-06-15"));

  useShareableURL({ dob });

  const result = useMemo(() => {
    if (!dob) return null;
    const birth = new Date(dob + "T00:00:00");
    if (isNaN(birth.getTime()) || birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) { months--; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday };
  }, [dob]);

  useCalcHistory("age", { dob }, result ? `${result.years}y ${result.months}m ${result.days}d — Next birthday: ${result.daysUntilBirthday} days` : "");

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        setDob("1995-06-15");
      }} pdfData={{
        calculatorName: "Age Calculator",
        inputs: [
          { label: "Date of Birth", value: dob },
        ],
        results: result ? [
          { label: "Age", value: `${result.years} years, ${result.months} months, ${result.days} days` },
          { label: "Total Days", value: result.totalDays.toLocaleString() },
          { label: "Next Birthday", value: `${result.daysUntilBirthday} days` },
        ] : [],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Your Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={today.toISOString().split("T")[0]} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
      </div>

      {result && (
        <>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-cyan-200 text-center">
            <p className="text-sm text-cyan-100">Your Age</p>
            <p className="text-4xl sm:text-5xl font-extrabold mt-2 animate-count-up">
              {result.years} <span className="text-lg font-medium text-cyan-200">years</span>{" "}
              {result.months} <span className="text-lg font-medium text-cyan-200">months</span>{" "}
              {result.days} <span className="text-lg font-medium text-cyan-200">days</span>
            </p>
            <p className="text-sm text-cyan-100 mt-4">
              🎂 Next birthday in <strong className="text-amber-300">{result.daysUntilBirthday} days</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Months", value: result.totalMonths.toLocaleString() },
              { label: "Total Weeks", value: result.totalWeeks.toLocaleString() },
              { label: "Total Days", value: result.totalDays.toLocaleString() },
              { label: "Total Hours", value: result.totalHours.toLocaleString() },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </>
      )}


      {result && (
        <InsightCard
          icon="🎂"
          title="Age Insight"
          color="blue"
          insight={`You are ${result.years} years, ${result.months} months, and ${result.days} days old. That's ${result.totalDays.toLocaleString()} days on this planet!`}
          tip={`Your next birthday is in ${result.daysUntilBirthday} days. ${result.daysUntilBirthday < 30 ? "Almost time to celebrate!" : ""}`}
        />
      )}

      <CalculationHistory
        calculator="age"
        onLoad={(inputs) => {
          setDob(String(inputs.dob));
        }}
      />

      {CALCULATOR_CONTENT.age && result && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.age}
          calculatorName="Age Calculator"
          dynamicExample={{
            setup: `Your date of birth is ${dob}.`,
            calculation: `From ${dob} to today, we count the exact difference in years, months, and days — accounting for varying month lengths and leap years. We also calculate total days, weeks, and hours lived.`,
            result: `You are ${result.years} years, ${result.months} months, and ${result.days} days old. That's ${result.totalDays.toLocaleString()} days or ${result.totalHours.toLocaleString()} hours on this planet. Your next birthday is in ${result.daysUntilBirthday} days!`,
          }}
        />
      )}
    </div>
  );
}
