"use client";

interface ReverseModeProps {
  forwardLabel: string;
  reverseLabel: string;
  mode: "forward" | "reverse";
  onToggle: (mode: "forward" | "reverse") => void;
}

export default function ReverseMode({ forwardLabel, reverseLabel, mode, onToggle }: ReverseModeProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 p-1 border border-gray-200 dark:border-gray-700 shadow-inner">
        {/* Sliding pill */}
        <div
          className={`
            absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/25
            transition-all duration-300 ease-in-out
            ${mode === "forward" ? "left-1" : "left-[calc(50%)]"}
          `}
          style={{ width: "calc(50% - 4px)" }}
        />

        {/* Forward button */}
        <button
          type="button"
          onClick={() => onToggle("forward")}
          className={`
            relative z-10 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold
            transition-colors duration-200 whitespace-nowrap
            ${mode === "forward"
              ? "text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }
          `}
          aria-pressed={mode === "forward"}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
            {forwardLabel}
          </span>
        </button>

        {/* Reverse button */}
        <button
          type="button"
          onClick={() => onToggle("reverse")}
          className={`
            relative z-10 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold
            transition-colors duration-200 whitespace-nowrap
            ${mode === "reverse"
              ? "text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }
          `}
          aria-pressed={mode === "reverse"}
        >
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            {reverseLabel}
          </span>
        </button>
      </div>
    </div>
  );
}
