"use client";

import { useState, useMemo, useCallback } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useCalcHistory } from "@/hooks/useCalcHistory";

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0,
  "F": 0.0,
};

const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

function percentageToGrade(pct: number): string {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 60) return "D";
  return "F";
}

function gpaToLetter(gpa: number): string {
  if (gpa >= 3.85) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.15) return "B+";
  if (gpa >= 2.85) return "B";
  if (gpa >= 2.5) return "B-";
  if (gpa >= 2.15) return "C+";
  if (gpa >= 1.85) return "C";
  if (gpa >= 1.5) return "C-";
  if (gpa >= 1.15) return "D+";
  if (gpa >= 0.5) return "D";
  return "F";
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function createCourse(): Course {
  return { id: generateId(), name: "", credits: 3, grade: "A" };
}

function createSemester(num: number): Semester {
  return {
    id: generateId(),
    name: `Semester ${num}`,
    courses: [createCourse(), createCourse(), createCourse()],
  };
}

type InputMode = "letter" | "percentage";

export default function GPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([createSemester(1)]);
  const [inputMode, setInputMode] = useState<InputMode>("letter");
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [targetGPA, setTargetGPA] = useState(3.5);

  const updateCourse = useCallback((semId: string, courseId: string, field: keyof Course, value: string | number) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId
          ? { ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, [field]: value } : c)) }
          : s
      )
    );
  }, []);

  const addCourse = useCallback((semId: string) => {
    setSemesters((prev) =>
      prev.map((s) => (s.id === semId ? { ...s, courses: [...s.courses, createCourse()] } : s))
    );
  }, []);

  const removeCourse = useCallback((semId: string, courseId: string) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.id === semId ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) } : s
      )
    );
  }, []);

  const addSemester = useCallback(() => {
    setSemesters((prev) => [...prev, createSemester(prev.length + 1)]);
  }, []);

  const removeSemester = useCallback((semId: string) => {
    setSemesters((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== semId) : prev));
  }, []);

  const handlePercentageChange = useCallback((courseId: string, pct: number) => {
    setPercentages((prev) => ({ ...prev, [courseId]: pct }));
  }, []);

  // Calculate semester and cumulative GPAs
  const results = useMemo(() => {
    const semesterResults = semesters.map((sem) => {
      let totalPoints = 0;
      let totalCredits = 0;

      sem.courses.forEach((course) => {
        const grade = inputMode === "percentage" ? percentageToGrade(percentages[course.id] ?? 0) : course.grade;
        const points = GRADE_POINTS[grade] ?? 0;
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      });

      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
      return { id: sem.id, name: sem.name, gpa, totalCredits, totalPoints };
    });

    let cumulativePoints = 0;
    let cumulativeCredits = 0;
    semesterResults.forEach((s) => {
      cumulativePoints += s.totalPoints;
      cumulativeCredits += s.totalCredits;
    });

    const cumulativeGPA = cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0;

    // Calculate what's needed to reach target
    const creditsNeeded = 15; // assume 15 more credits
    const neededGPA =
      cumulativeCredits > 0
        ? (targetGPA * (cumulativeCredits + creditsNeeded) - cumulativePoints) / creditsNeeded
        : targetGPA;

    return {
      semesters: semesterResults,
      cumulativeGPA,
      cumulativeCredits,
      cumulativePoints,
      neededGPA: Math.max(0, neededGPA),
      targetReachable: neededGPA <= 4.0 && neededGPA >= 0,
    };
  }, [semesters, inputMode, percentages, targetGPA]);

  useCalcHistory(
    "gpa",
    { semesters: semesters.length, credits: results.cumulativeCredits },
    `GPA: ${results.cumulativeGPA.toFixed(2)} (${results.cumulativeCredits} credits)`
  );

  const gpaColor = results.cumulativeGPA >= 3.5 ? "text-emerald-600 dark:text-emerald-400" : results.cumulativeGPA >= 2.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ActionButtons
        onReset={() => {
          setSemesters([createSemester(1)]);
          setPercentages({});
          setTargetGPA(3.5);
        }}
        pdfData={{
          calculatorName: "GPA Calculator",
          inputs: results.semesters.map((s) => ({
            label: s.name,
            value: `GPA: ${s.gpa.toFixed(2)} (${s.totalCredits} credits)`,
          })),
          results: [
            { label: "Cumulative GPA", value: results.cumulativeGPA.toFixed(2) },
            { label: "Total Credits", value: String(results.cumulativeCredits) },
            { label: "Letter Grade", value: gpaToLetter(results.cumulativeGPA) },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      {/* Input Mode Toggle */}
      <div className="flex gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl">
        <button
          type="button"
          className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-xl transition-all ${inputMode === "letter" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          onClick={() => setInputMode("letter")}
        >
          Letter Grade
        </button>
        <button
          type="button"
          className={`flex-1 py-2.5 px-3 text-sm font-semibold rounded-xl transition-all ${inputMode === "percentage" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900" : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
          onClick={() => setInputMode("percentage")}
        >
          Percentage
        </button>
      </div>

      {/* Semesters */}
      {semesters.map((sem, semIdx) => (
        <div key={sem.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={sem.name}
              onChange={(e) =>
                setSemesters((prev) =>
                  prev.map((s) => (s.id === sem.id ? { ...s, name: e.target.value } : s))
                )
              }
              className="text-sm font-bold text-gray-800 dark:text-gray-200 bg-transparent border-none outline-none focus:ring-0 p-0"
            />
            <div className="flex items-center gap-2">
              {results.semesters[semIdx] && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                  GPA: {results.semesters[semIdx].gpa.toFixed(2)}
                </span>
              )}
              {semesters.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSemester(sem.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Course Headers — hidden on mobile since fields stack */}
          <div className="hidden sm:grid grid-cols-12 gap-2 mb-2 px-1">
            <span className="col-span-4 text-xs font-semibold text-gray-500 dark:text-gray-400">Course Name</span>
            <span className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Credits</span>
            <span className="col-span-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
              {inputMode === "letter" ? "Grade" : "Percentage"}
            </span>
            <span className="col-span-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Points</span>
          </div>

          {/* Courses — stack vertically on mobile, row on sm+ */}
          <div className="space-y-3 sm:space-y-2">
            {sem.courses.map((course) => {
              const effectiveGrade = inputMode === "percentage" ? percentageToGrade(percentages[course.id] ?? 0) : course.grade;
              const points = GRADE_POINTS[effectiveGrade] ?? 0;

              return (
                <div key={course.id} className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:items-center bg-gray-50 dark:bg-gray-800 sm:bg-transparent sm:dark:bg-transparent rounded-xl p-3 sm:p-0">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(sem.id, course.id, "name", e.target.value)}
                    placeholder="Course name"
                    className="w-full sm:col-span-4 text-sm px-3 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <div className="flex gap-2 sm:contents">
                    <input
                      type="number"
                      value={course.credits}
                      min={1}
                      max={10}
                      onChange={(e) => updateCourse(sem.id, course.id, "credits", Math.max(1, Number(e.target.value)))}
                      className="w-20 sm:w-auto sm:col-span-2 text-sm text-center px-2 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <VoiceInputButton onResult={(v) => updateCourse(sem.id, course.id, "credits", Math.max(1, Math.min(10, v)))} />
                    {inputMode === "letter" ? (
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(sem.id, course.id, "grade", e.target.value)}
                        className="flex-1 sm:flex-none sm:col-span-4 text-sm px-2 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g} value={g}>
                            {g} ({GRADE_POINTS[g].toFixed(1)})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex-1 sm:flex-none sm:col-span-4 flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={percentages[course.id] ?? 0}
                          onChange={(e) => handlePercentageChange(course.id, Number(e.target.value))}
                          className="flex-1 text-sm text-center px-2 py-2.5 sm:py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          = {effectiveGrade}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{points.toFixed(1)} pts</span>
                    {sem.courses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourse(sem.id, course.id)}
                        className="min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => addCourse(sem.id)}
            className="mt-3 min-h-[44px] text-sm sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            + Add Course
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addSemester}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-all"
      >
        + Add Semester
      </button>

      {/* Cumulative GPA Result */}
      <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200 dark:shadow-emerald-900/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-emerald-100">Cumulative GPA</p>
            <p className={`text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up`}>{results.cumulativeGPA.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-100">Total Credits</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{results.cumulativeCredits}</p>
          </div>
          <div>
            <p className="text-xs text-emerald-100">Letter Grade</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 text-amber-300">{gpaToLetter(results.cumulativeGPA)}</p>
          </div>
        </div>
      </div>

      {/* Per-Semester Breakdown */}
      {results.semesters.length > 1 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Semester Breakdown</h3>
          <div className="space-y-2">
            {results.semesters.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{s.totalCredits} credits</span>
                  <span className={`text-sm font-bold ${s.gpa >= 3.5 ? "text-emerald-600 dark:text-emerald-400" : s.gpa >= 2.5 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                    {s.gpa.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target GPA */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">Target GPA Calculator</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">I want a cumulative GPA of</span>
          <input
            type="number"
            step={0.1}
            min={0}
            max={4}
            value={targetGPA}
            onChange={(e) => setTargetGPA(Number(e.target.value))}
            className="w-20 text-center text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg px-2 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
          {results.targetReachable ? (
            <>
              You need an average GPA of <strong className={gpaColor}>{results.neededGPA.toFixed(2)}</strong> in your next 15 credits to reach {targetGPA.toFixed(1)}.
            </>
          ) : results.neededGPA > 4.0 ? (
            <span className="text-red-500">
              A {targetGPA.toFixed(1)} GPA is not reachable with 15 more credits (would need {results.neededGPA.toFixed(2)}, max is 4.0).
            </span>
          ) : (
            <>You have already exceeded your target GPA!</>
          )}
        </p>
      </div>

      <InsightCard
        icon="🎓"
        title="GPA Insight"
        color={results.cumulativeGPA >= 3.5 ? "green" : results.cumulativeGPA >= 2.5 ? "amber" : "red"}
        insight={`Your GPA is ${results.cumulativeGPA.toFixed(2)} (${gpaToLetter(results.cumulativeGPA)}) across ${results.cumulativeCredits} credits.${results.targetReachable ? ` You need a ${results.neededGPA.toFixed(2)} average in your next 15 credits to reach ${targetGPA.toFixed(1)} GPA.` : ""}`}
        tip={results.cumulativeGPA >= 3.5 ? "Great work! You're performing well above average." : results.cumulativeGPA >= 2.5 ? "You're doing okay. Focus on raising grades in high-credit courses for maximum impact." : "Consider reaching out to academic advisors for support."}
      />

      <CalculationHistory
        calculator="gpa"
        onLoad={() => {
          // GPA has too many dynamic fields to restore from history
        }}
      />
    </div>
  );
}
