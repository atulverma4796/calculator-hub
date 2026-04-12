"use client";

import toast from "react-hot-toast";
import type { CalcPDFData } from "@/lib/generateCalcPDF";
import type { CSVData } from "@/lib/generateCSV";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useCompareContext } from "@/components/CompareToggle";

interface ActionButtonsProps {
  onReset: () => void;
  pdfData?: CalcPDFData;
  csvData?: CSVData;
}

export default function ActionButtons({ onReset, pdfData, csvData }: ActionButtonsProps) {
  const onCompare = useCompareContext();
  // PDF is disabled when results are empty (no meaningful data to download)
  const hasResults = pdfData && pdfData.results.length > 0 &&
    pdfData.results.some((r) => r.value && r.value !== "0" && r.value !== "$0" && r.value !== "NaN");

  useKeyboardShortcuts({
    onReset,
    onPDF: hasResults ? () => handlePDF() : undefined,
  });

  const handlePDF = async () => {
    if (!pdfData || !hasResults) return;
    try {
      toast.loading("Generating PDF...", { id: "pdf" });
      const { generateCalcPDF } = await import("@/lib/generateCalcPDF");
      await generateCalcPDF(pdfData);
      toast.success("PDF downloaded!", { id: "pdf" });
    } catch {
      toast.error("Failed to generate PDF.", { id: "pdf" });
    }
  };

  const handleCSV = async () => {
    if (!csvData) return;
    try {
      const { generateCSV } = await import("@/lib/generateCSV");
      generateCSV(csvData);
      toast.success("CSV downloaded!");
    } catch {
      toast.error("Failed to generate CSV.");
    }
  };

  return (
    <div className="calc-extra sticky top-[68px] z-30 flex items-center justify-center gap-2 sm:gap-3 flex-wrap py-2 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-xl -mx-1 px-1">
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-800 transition-all"
        title="Reset to defaults (Esc)"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
        </svg>
        Reset
      </button>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied! Share it with anyone.");
        }}
        className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all"
        title="Copy shareable link (Ctrl+S)"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
        Share
      </button>
      {pdfData && (
        <button
          type="button"
          onClick={hasResults ? handlePDF : undefined}
          disabled={!hasResults}
          className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
            hasResults
              ? "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
              : "text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50"
          }`}
          title={hasResults ? "Download PDF (Ctrl+P)" : "Enter values to download PDF"}
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          PDF
        </button>
      )}
      {csvData && (
        <button
          type="button"
          onClick={handleCSV}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-teal-600 bg-teal-50 border border-teal-200 hover:bg-teal-100 dark:text-teal-400 dark:bg-teal-950 dark:border-teal-800 dark:hover:bg-teal-900 transition-all"
          title="Export to CSV/Excel"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M12 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
          </svg>
          CSV
        </button>
      )}
      {onCompare && (
        <button
          type="button"
          onClick={onCompare}
          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Compare
        </button>
      )}
    </div>
  );
}
