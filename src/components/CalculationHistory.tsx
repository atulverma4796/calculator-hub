"use client";

import { useState, useEffect } from "react";
import { getHistory, clearCalculatorHistory, HistoryEntry } from "@/lib/calculationHistory";

interface Props {
  calculator: string;
  onLoad?: (inputs: Record<string, string | number>) => void;
}

export default function CalculationHistory({ calculator, onLoad }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEntries(getHistory(calculator));
  }, [calculator]);

  // Refresh entries when component re-renders (after new calculation)
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries(getHistory(calculator));
    }, 3000);
    return () => clearInterval(interval);
  }, [calculator]);

  if (entries.length === 0) return null;

  const displayed = entries.slice(0, 5);

  return (
    <div className="calc-extra bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Calculations ({entries.length})
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          {displayed.map((entry) => {
            const time = new Date(entry.timestamp);
            const timeStr = time.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

            return (
              <div key={entry.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{entry.result}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{timeStr}</p>
                </div>
                {onLoad && (
                  <button
                    type="button"
                    onClick={() => onLoad(entry.inputs)}
                    className="ml-3 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors shrink-0"
                  >
                    Load
                  </button>
                )}
              </div>
            );
          })}
          <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => {
                clearCalculatorHistory(calculator);
                setEntries([]);
              }}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear history
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
