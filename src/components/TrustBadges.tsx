"use client";

interface TrustBadgesProps {
  calculatorName: string;
  dataSources?: string[];
}

/** Maps calculator slug keywords to their data sources */
const DATA_SOURCES_BY_CALCULATOR: Record<string, string[]> = {
  emi: ["Standard financial formulas"],
  sip: ["Standard financial formulas"],
  "compound-interest": ["Standard financial formulas"],
  mortgage: ["Standard financial formulas"],
  retirement: ["Standard financial formulas"],
  "income-tax": [
    "IRS (US), HMRC (UK), Income Tax Dept (India) tax slabs",
  ],
  currency: ["European Central Bank (ECB) via Frankfurter API"],
  bmi: ["World Health Organization (WHO) BMI classification"],
  gst: ["Government tax rate schedules"],
  salary: ["Standard mathematical formulas"],
  discount: ["Standard mathematical formulas"],
  percentage: ["Standard mathematical formulas"],
  tip: ["Standard mathematical formulas"],
  fuel: ["Standard mathematical formulas"],
  age: ["Standard mathematical formulas"],
};

function getDataSources(
  calculatorName: string,
  dataSources?: string[]
): string[] {
  if (dataSources && dataSources.length > 0) return dataSources;

  // Try to match calculator name to a known slug
  const slug = calculatorName
    .toLowerCase()
    .replace(/ calculator$/i, "")
    .replace(/\s+/g, "-");

  return DATA_SOURCES_BY_CALCULATOR[slug] || ["Standard mathematical formulas"];
}

function getCurrentMonthYear(): string {
  const d = new Date();
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export default function TrustBadges({
  calculatorName,
  dataSources,
}: TrustBadgesProps) {
  const sources = getDataSources(calculatorName, dataSources);

  return (
    <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto space-y-3 text-xs text-gray-500 dark:text-gray-400">
        {/* Last updated badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2.5 py-0.5 text-green-700 dark:text-green-400 font-medium">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Last updated: {getCurrentMonthYear()}
          </span>
        </div>

        {/* Data sources */}
        <p className="leading-relaxed">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            Data sources:
          </span>{" "}
          {sources.join(", ")}
        </p>

        {/* Disclaimer */}
        <p className="leading-relaxed text-gray-400 dark:text-gray-500">
          For informational purposes only. Not financial, medical, or legal
          advice. Always consult a qualified professional for decisions affecting
          your finances or health.
        </p>

        {/* Report an error */}
        <p>
          <a
            href={`/#feedback`}
            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline underline-offset-2 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            Report an error
          </a>
        </p>
      </div>
    </div>
  );
}

export { DATA_SOURCES_BY_CALCULATOR };
export type { TrustBadgesProps };
