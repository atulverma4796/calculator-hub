"use client";

import { useState, useRef, useEffect, useCallback, createContext, useContext, useMemo } from "react";
import toast from "react-hot-toast";

// Context to pass onCompare to ActionButtons inside the calculator
const CompareContext = createContext<(() => void) | undefined>(undefined);
export function useCompareContext() { return useContext(CompareContext); }

interface Props {
  calculator: React.ComponentType;
  enabled: boolean;
  children: React.ReactNode;
}

interface ScenarioResult {
  label: string;
  value: string;
}

function parseResults(box: HTMLElement): ScenarioResult[] {
  const results: ScenarioResult[] = [];
  const resultCard = box.querySelector("[class*='bg-gradient-to-br']");
  if (!resultCard) return results;

  const labels = resultCard.querySelectorAll("[class*='text-xs']");
  const values = resultCard.querySelectorAll("[class*='font-extrabold'], [class*='font-bold']");

  labels.forEach((label, i) => {
    if (values[i]) {
      results.push({
        label: label.textContent?.trim() || "",
        value: values[i].textContent?.trim() || "",
      });
    }
  });
  return results;
}

export default function CompareToggle({ calculator: Calculator, enabled, children }: Props) {
  const [comparing, setComparing] = useState(false);
  const [activeTab, setActiveTab] = useState<"a" | "b">("a");
  const [verdict, setVerdict] = useState("");
  const boxARef = useRef<HTMLDivElement>(null);
  const boxBRef = useRef<HTMLDivElement>(null);

  const updateVerdict = useCallback(() => {
    if (!boxARef.current || !boxBRef.current) return;
    const resultsA = parseResults(boxARef.current);
    const resultsB = parseResults(boxBRef.current);

    if (resultsA.length === 0 || resultsB.length === 0) {
      setVerdict("");
      return;
    }

    const primaryA = resultsA[0]?.value || "";
    const primaryB = resultsB[0]?.value || "";

    if (primaryA && primaryB && primaryA !== primaryB) {
      setVerdict(`Scenario A: ${resultsA[0]?.label} = ${primaryA}  vs  Scenario B: ${resultsB[0]?.label} = ${primaryB}`);
    } else if (primaryA === primaryB) {
      setVerdict("Both scenarios produce the same result. Try changing values to see the difference.");
    } else {
      setVerdict("");
    }
  }, []);

  useEffect(() => {
    if (!comparing) return;
    const interval = setInterval(updateVerdict, 1000);
    return () => clearInterval(interval);
  }, [comparing, updateVerdict]);

  const resultsA = useMemo(() => boxARef.current ? parseResults(boxARef.current) : [], [verdict]);
  const resultsB = useMemo(() => boxBRef.current ? parseResults(boxBRef.current) : [], [verdict]);

  const handlePrint = () => {
    const a = boxARef.current ? parseResults(boxARef.current) : [];
    const b = boxBRef.current ? parseResults(boxBRef.current) : [];
    const win = window.open("", "_blank", "width=800,height=600");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>CalcHub Comparison</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #1f2937; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 20px; color: #6366f1; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .box { border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; }
        .box-a { border-color: #93c5fd; }
        .box-b { border-color: #c4b5fd; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; text-align: center; }
        .label-a { color: #1d4ed8; }
        .label-b { color: #7c3aed; }
        .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f4f6; }
        .row:last-child { border-bottom: none; }
        .row-label { font-size: 12px; color: #6b7280; }
        .row-value { font-size: 13px; font-weight: 700; color: #111827; }
        .verdict { background: linear-gradient(to right, #eff6ff, #f5f3ff); border: 1px solid #c7d2fe; border-radius: 10px; padding: 14px; text-align: center; }
        .verdict-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6366f1; margin-bottom: 6px; }
        .verdict-text { font-size: 13px; font-weight: 500; color: #374151; }
        .footer { text-align: center; margin-top: 16px; font-size: 10px; color: #9ca3af; }
      </style>
    </head><body>
      <h1>CalcHub — Scenario Comparison</h1>
      <div class="grid">
        <div class="box box-a">
          <div class="label label-a">Scenario A</div>
          ${a.map(r => `<div class="row"><span class="row-label">${r.label}</span><span class="row-value">${r.value}</span></div>`).join("")}
        </div>
        <div class="box box-b">
          <div class="label label-b">Scenario B</div>
          ${b.map(r => `<div class="row"><span class="row-label">${r.label}</span><span class="row-value">${r.value}</span></div>`).join("")}
        </div>
      </div>
      ${verdict ? `<div class="verdict"><div class="verdict-title">Comparison Result</div><div class="verdict-text">${verdict}</div></div>` : ""}
      <div class="footer">Generated at CalcHub — ${window.location.href}</div>
      <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}</script>
    </body></html>`);
    win.document.close();
  };

  if (!enabled) return <>{children}</>;

  return (
    <div>
      {comparing ? (
        <>
          {/* Compare toolbar */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              Share
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Print
            </button>
            <button
              type="button"
              onClick={() => { setComparing(false); setVerdict(""); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border-2 border-red-300 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Exit Compare
            </button>
          </div>

          {/* Mobile: tab switcher */}
          <div className="flex lg:hidden justify-center gap-2 mb-4">
            <button type="button" onClick={() => setActiveTab("a")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "a" ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700" : "bg-gray-100 dark:bg-gray-800 text-gray-500 border-2 border-transparent"}`}>
              Scenario A
            </button>
            <button type="button" onClick={() => setActiveTab("b")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "b" ? "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-700" : "bg-gray-100 dark:bg-gray-800 text-gray-500 border-2 border-transparent"}`}>
              Scenario B
            </button>
          </div>

          {/* Side by side / tabbed + verdict — all inside one print-area */}
          <div className="print-area">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
              <div className={activeTab !== "a" ? "hidden lg:block" : ""}>
                <div className="text-center mb-3 hidden lg:block">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold">Scenario A</span>
                </div>
                <div ref={boxARef} className="compare-compact border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-3 sm:p-4 overflow-hidden">
                  <Calculator />
                </div>
              </div>
              <div className={activeTab !== "b" ? "hidden lg:block" : ""}>
                <div className="text-center mb-3 hidden lg:block">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-bold">Scenario B</span>
                </div>
                <div ref={boxBRef} className="compare-compact border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-3 sm:p-4 overflow-hidden">
                  <Calculator />
                </div>
              </div>
            </div>

            {/* Verdict */}
            {verdict && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-indigo-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 text-center">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Comparison Result</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{verdict}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        // Normal mode — pass onCompare via context so ActionButtons can show the Compare button
        <CompareContext.Provider value={() => setComparing(true)}>
          {children}
        </CompareContext.Provider>
      )}
    </div>
  );
}
