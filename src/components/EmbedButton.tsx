"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface EmbedButtonProps {
  slug: string;
  calculatorName: string;
}

export default function EmbedButton({ slug, calculatorName }: EmbedButtonProps) {
  const [showCode, setShowCode] = useState(false);
  const embedCode = `<iframe src="https://thecalchub.org/embed/${slug}" width="100%" height="600" style="border:none;border-radius:12px;" loading="lazy" title="${calculatorName}"></iframe>`;

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setShowCode(!showCode)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
        </svg>
        {showCode ? "Hide Embed Code" : "Embed This Calculator"}
      </button>

      {showCode && (
        <div className="mt-3 bg-gray-900 dark:bg-gray-950 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400">Copy this code to embed on your website</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success("Embed code copied!");
              }}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Copy Code
            </button>
          </div>
          <pre className="text-xs text-green-400 whitespace-pre-wrap break-all font-mono leading-relaxed">
            {embedCode}
          </pre>
          <p className="text-[10px] text-gray-500 mt-3">
            Free to use. No API key needed.{" "}
            <a href="/embed" className="text-indigo-400 hover:text-indigo-300 underline">
              See all embeddable calculators →
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
