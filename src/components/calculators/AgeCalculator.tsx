"use client";

import { useState, useMemo } from "react";

export default function AgeCalculator() {
  const today = new Date();
  const [dob, setDob] = useState("1995-06-15");

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Your Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={today.toISOString().split("T")[0]} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg font-semibold text-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent" />
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
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
