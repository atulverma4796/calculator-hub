import { CalculatorEducation as EducationData, DynamicExample } from "@/lib/calculatorContent";
import JsonLd from "./JsonLd";

interface Props {
  data: EducationData;
  calculatorName: string;
  dynamicExample?: DynamicExample; // live example from user's inputs — overrides default
}

export default function CalculatorEducation({ data, calculatorName, dynamicExample }: Props) {
  const example = dynamicExample ?? data.example;
  return (
    <>
      {/* FAQ Schema for Google */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: data.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }} />

      {/* HowTo Schema for Google */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to Use the ${calculatorName}`,
        description: data.howItWorks,
        totalTime: "PT1M",
        step: [
          { "@type": "HowToStep", position: 1, name: "Enter your values", text: "Use the sliders or input fields to enter your numbers. The calculator auto-detects your currency." },
          { "@type": "HowToStep", position: 2, name: "View results instantly", text: "Results update in real-time as you adjust values. Charts and breakdowns appear automatically." },
          { "@type": "HowToStep", position: 3, name: "Analyze the breakdown", text: "Review the detailed breakdown, charts, and amortization tables if available." },
        ],
      }} />

      <div className="calc-extra mt-12 space-y-10">
        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            How the {calculatorName} Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.howItWorks}</p>
        </section>

        {/* Formula */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Formula</h2>
          <div className="bg-gray-900 rounded-xl px-6 py-4 font-mono text-indigo-300 text-lg overflow-x-auto space-y-2">
            {data.formula.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
            <strong>Where:</strong> {data.formulaExplained}
          </p>
        </section>

        {/* Worked Example */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Example</h2>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-indigo-100 dark:border-gray-700 rounded-xl p-6 space-y-3">
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Setup</p>
              <p className="text-gray-700 dark:text-gray-300">{example.setup}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Calculation</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{example.calculation}</p>
            </div>
            <div className="pt-2 border-t border-indigo-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Result</p>
              <p className="text-gray-900 dark:text-gray-100 font-bold">{example.result}</p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Tips</h2>
          <div className="space-y-3">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold text-sm">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — visible to users AND Google */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition-colors text-sm">
                  {faq.q}
                  <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
