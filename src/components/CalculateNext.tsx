"use client";

import Link from "next/link";
import { CALCULATORS, type CalculatorMeta } from "@/lib/calculators";

interface CalculateNextProps {
  currentSlug: string;
}

interface Suggestion {
  slug: string;
  reason: string;
}

const RECOMMENDATIONS: Record<string, Suggestion[]> = {
  emi: [
    { slug: "loan-eligibility", reason: "Now check how much loan you can afford" },
    { slug: "mortgage", reason: "Compare your EMI with a mortgage plan" },
    { slug: "savings-goal", reason: "Plan savings for your down payment" },
  ],
  sip: [
    { slug: "investment", reason: "See how a lump-sum investment compares" },
    { slug: "cagr", reason: "Find the growth rate of your portfolio" },
    { slug: "retirement", reason: "Check if your SIP will fund retirement" },
  ],
  mortgage: [
    { slug: "emi", reason: "Compare with a standard loan EMI" },
    { slug: "loan-eligibility", reason: "Find out your maximum loan amount" },
    { slug: "savings-goal", reason: "Plan savings for your down payment" },
  ],
  "income-tax": [
    { slug: "salary", reason: "See your full salary breakdown" },
    { slug: "savings-goal", reason: "Plan tax-saving investments" },
    { slug: "retirement", reason: "Estimate post-retirement tax savings" },
  ],
  bmi: [
    { slug: "calorie", reason: "Find your daily calorie target" },
    { slug: "body-fat", reason: "Get a detailed body composition analysis" },
    { slug: "water-intake", reason: "Check your recommended daily water intake" },
  ],
  calorie: [
    { slug: "bmi", reason: "See where your weight falls on the BMI scale" },
    { slug: "body-fat", reason: "Estimate your body fat percentage" },
    { slug: "water-intake", reason: "Stay hydrated for your fitness goals" },
  ],
  pregnancy: [
    { slug: "age", reason: "Calculate exact age for medical forms" },
    { slug: "date", reason: "Count days between key appointments" },
    { slug: "calorie", reason: "Check recommended calorie intake" },
  ],
  scientific: [
    { slug: "percentage", reason: "Quick percentage calculations" },
    { slug: "unit-converter", reason: "Convert units for your equations" },
    { slug: "gpa", reason: "Calculate your grade point average" },
  ],
  currency: [
    { slug: "inflation", reason: "See how inflation affects your money abroad" },
    { slug: "investment", reason: "Calculate returns in your home currency" },
    { slug: "salary", reason: "Compare salary across currencies" },
  ],
  retirement: [
    { slug: "sip", reason: "Start a SIP to hit your retirement goal" },
    { slug: "investment", reason: "See how investments grow over time" },
    { slug: "savings-goal", reason: "Set a monthly savings target" },
  ],
  percentage: [
    { slug: "discount", reason: "Apply percentage discounts to prices" },
    { slug: "profit-margin", reason: "Calculate business profit margins" },
    { slug: "gst", reason: "Add or remove tax percentages" },
  ],
  "break-even": [
    { slug: "profit-margin", reason: "Calculate your profit per unit" },
    { slug: "savings-goal", reason: "Plan savings from your profits" },
    { slug: "investment", reason: "Invest your break-even surplus" },
  ],
  "profit-margin": [
    { slug: "break-even", reason: "Find how many units to cover costs" },
    { slug: "savings-goal", reason: "Set a savings target from profits" },
    { slug: "gst", reason: "Factor in tax on your margins" },
  ],
  gpa: [
    { slug: "percentage", reason: "Convert between grades and percentages" },
    { slug: "date", reason: "Count days until your next exam" },
    { slug: "age", reason: "Calculate your exact age for applications" },
  ],
  date: [
    { slug: "age", reason: "Find your exact age from your birthdate" },
    { slug: "timezone", reason: "Convert times across time zones" },
    { slug: "pregnancy", reason: "Track pregnancy milestones by date" },
  ],
  "unit-converter": [
    { slug: "scientific", reason: "Do advanced math with your converted values" },
    { slug: "fuel", reason: "Calculate fuel costs with unit conversions" },
    { slug: "currency", reason: "Convert currencies alongside units" },
  ],
  // Additional calculators with contextual suggestions
  "compound-interest": [
    { slug: "sip", reason: "Compare with systematic monthly investing" },
    { slug: "investment", reason: "Try different investment scenarios" },
    { slug: "inflation", reason: "See if your returns beat inflation" },
  ],
  gst: [
    { slug: "profit-margin", reason: "Calculate margins after tax" },
    { slug: "discount", reason: "Apply discounts before or after tax" },
    { slug: "income-tax", reason: "Estimate your total tax burden" },
  ],
  salary: [
    { slug: "income-tax", reason: "See how much tax you owe" },
    { slug: "sip", reason: "Invest a portion of your salary monthly" },
    { slug: "savings-goal", reason: "Set a savings target from your pay" },
  ],
  discount: [
    { slug: "percentage", reason: "Calculate any percentage quickly" },
    { slug: "gst", reason: "Add tax to your discounted price" },
    { slug: "profit-margin", reason: "Check margins after discounting" },
  ],
  tip: [
    { slug: "discount", reason: "Check the discounted bill before tipping" },
    { slug: "percentage", reason: "Calculate custom tip percentages" },
    { slug: "currency", reason: "Convert tip amount to another currency" },
  ],
  fuel: [
    { slug: "unit-converter", reason: "Convert between km, miles, and more" },
    { slug: "savings-goal", reason: "Save money on your commute costs" },
    { slug: "currency", reason: "Compare fuel costs across countries" },
  ],
  "loan-eligibility": [
    { slug: "emi", reason: "Calculate EMI for your eligible loan" },
    { slug: "mortgage", reason: "See full mortgage payment breakdown" },
    { slug: "savings-goal", reason: "Save for a bigger down payment" },
  ],
  "savings-goal": [
    { slug: "sip", reason: "Start a SIP to reach your goal faster" },
    { slug: "investment", reason: "See how investing accelerates savings" },
    { slug: "compound-interest", reason: "Understand how your savings compound" },
  ],
  investment: [
    { slug: "cagr", reason: "Measure your portfolio growth rate" },
    { slug: "sip", reason: "Compare lump-sum vs monthly investing" },
    { slug: "inflation", reason: "Check if returns outpace inflation" },
  ],
  inflation: [
    { slug: "retirement", reason: "Plan retirement accounting for inflation" },
    { slug: "investment", reason: "Find investments that beat inflation" },
    { slug: "savings-goal", reason: "Adjust your savings target for inflation" },
  ],
  cagr: [
    { slug: "investment", reason: "Model your investment with this growth rate" },
    { slug: "sip", reason: "Start a SIP at your target CAGR" },
    { slug: "compound-interest", reason: "See detailed compounding breakdown" },
  ],
  "body-fat": [
    { slug: "bmi", reason: "Compare with your BMI reading" },
    { slug: "calorie", reason: "Adjust calories based on body composition" },
    { slug: "water-intake", reason: "Hydration needs vary with lean mass" },
  ],
  "water-intake": [
    { slug: "bmi", reason: "Check if your weight is in a healthy range" },
    { slug: "calorie", reason: "Pair hydration with your calorie plan" },
    { slug: "body-fat", reason: "Get a full body composition picture" },
  ],
  "heart-rate": [
    { slug: "calorie", reason: "Match calorie intake to your training zones" },
    { slug: "bmi", reason: "Check your BMI alongside heart health" },
    { slug: "body-fat", reason: "Assess body composition for fitness" },
  ],
  age: [
    { slug: "date", reason: "Calculate days between any two dates" },
    { slug: "retirement", reason: "See how many years until retirement" },
    { slug: "pregnancy", reason: "Track pregnancy milestones" },
  ],
  timezone: [
    { slug: "date", reason: "Calculate date differences across zones" },
    { slug: "age", reason: "Find exact age accounting for time zones" },
    { slug: "currency", reason: "Markets follow time zones" },
  ],
};

function getFallbackSuggestions(currentSlug: string): Suggestion[] {
  const current = CALCULATORS[currentSlug];
  if (!current) return [];

  const sameCategory = Object.values(CALCULATORS)
    .filter((c) => c.category === current.category && c.slug !== currentSlug)
    .slice(0, 3);

  return sameCategory.map((c) => ({
    slug: c.slug,
    reason: `Try our ${c.shortName} calculator next`,
  }));
}

export default function CalculateNext({ currentSlug }: CalculateNextProps) {
  const suggestions = RECOMMENDATIONS[currentSlug] || getFallbackSuggestions(currentSlug);

  if (suggestions.length === 0) return null;

  const cards = suggestions
    .map((s) => {
      const meta = CALCULATORS[s.slug];
      if (!meta) return null;
      return { ...s, meta };
    })
    .filter(Boolean) as { slug: string; reason: string; meta: CalculatorMeta }[];

  if (cards.length === 0) return null;

  return (
    <section className="mt-10">
      {/* Gradient banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 border border-indigo-100 dark:border-gray-600 p-6 sm:p-8">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200/30 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-200/30 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Heading */}
        <div className="relative flex items-center gap-2 mb-5">
          <span className="text-2xl">&#x1F9ED;</span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            What to Calculate Next
          </h2>
        </div>

        {/* Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.slug}
              href={`/calculator/${card.slug}`}
              className="group flex flex-col gap-3 rounded-xl bg-white/80 dark:bg-gray-900 backdrop-blur-sm border border-white/60 dark:border-gray-600 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 hover:-translate-y-0.5"
            >
              {/* Icon + name */}
              <div className="flex items-center gap-3">
                <span className="text-2xl w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-800 dark:to-purple-800 flex items-center justify-center shrink-0">
                  {card.meta.icon}
                </span>
                <span className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {card.meta.name}
                </span>
              </div>

              {/* Reason */}
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {card.reason}
              </p>

              {/* Arrow hint */}
              <div className="flex items-center gap-1 text-xs font-medium text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors mt-auto">
                Calculate now
                <svg
                  className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
