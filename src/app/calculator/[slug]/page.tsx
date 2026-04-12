import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CALCULATORS, CALCULATOR_LIST } from "@/lib/calculators";
import { VARIANTS_BY_CALCULATOR } from "@/lib/calculatorVariants";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import MobileSwipeNav from "@/components/MobileSwipeNav";
import CompareToggle from "@/components/CompareToggle";
import TrustBadges from "@/components/TrustBadges";
import CalculateNext from "@/components/CalculateNext";
import FeatureBadges from "@/components/FeatureBadges";
import EMICalculator from "@/components/calculators/EMICalculator";
import SIPCalculator from "@/components/calculators/SIPCalculator";
import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator";
import GSTCalculator from "@/components/calculators/GSTCalculator";
import PercentageCalculator from "@/components/calculators/PercentageCalculator";
import BMICalculator from "@/components/calculators/BMICalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import DiscountCalculator from "@/components/calculators/DiscountCalculator";
import TipCalculator from "@/components/calculators/TipCalculator";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import SalaryCalculator from "@/components/calculators/SalaryCalculator";
import IncomeTaxCalculator from "@/components/calculators/IncomeTaxCalculator";
import CurrencyConverter from "@/components/calculators/CurrencyConverter";
import FuelCalculator from "@/components/calculators/FuelCalculator";
import RetirementCalculator from "@/components/calculators/RetirementCalculator";
import LoanEligibilityCalculator from "@/components/calculators/LoanEligibilityCalculator";
import SavingsGoalCalculator from "@/components/calculators/SavingsGoalCalculator";
import InvestmentCalculator from "@/components/calculators/InvestmentCalculator";
import InflationCalculator from "@/components/calculators/InflationCalculator";
import CAGRCalculator from "@/components/calculators/CAGRCalculator";
import BreakEvenCalculator from "@/components/calculators/BreakEvenCalculator";
import ProfitMarginCalculator from "@/components/calculators/ProfitMarginCalculator";
import CalorieCalculator from "@/components/calculators/CalorieCalculator";
import PregnancyCalculator from "@/components/calculators/PregnancyCalculator";
import BodyFatCalculator from "@/components/calculators/BodyFatCalculator";
import WaterIntakeCalculator from "@/components/calculators/WaterIntakeCalculator";
import HeartRateCalculator from "@/components/calculators/HeartRateCalculator";
import ScientificCalculator from "@/components/calculators/ScientificCalculator";
import DateCalculator from "@/components/calculators/DateCalculator";
import TimeZoneConverter from "@/components/calculators/TimeZoneConverter";
import GPACalculator from "@/components/calculators/GPACalculator";
import UnitConverter from "@/components/calculators/UnitConverter";

const SITE_URL = "https://calculatorhub.org";

const CALCULATOR_COMPONENTS: Record<string, React.ComponentType> = {
  emi: EMICalculator,
  sip: SIPCalculator,
  "compound-interest": CompoundInterestCalculator,
  gst: GSTCalculator,
  percentage: PercentageCalculator,
  bmi: BMICalculator,
  age: AgeCalculator,
  discount: DiscountCalculator,
  mortgage: MortgageCalculator,
  salary: SalaryCalculator,
  "income-tax": IncomeTaxCalculator,
  currency: CurrencyConverter,
  fuel: FuelCalculator,
  retirement: RetirementCalculator,
  tip: TipCalculator,
  "loan-eligibility": LoanEligibilityCalculator,
  "savings-goal": SavingsGoalCalculator,
  investment: InvestmentCalculator,
  inflation: InflationCalculator,
  cagr: CAGRCalculator,
  "break-even": BreakEvenCalculator,
  "profit-margin": ProfitMarginCalculator,
  calorie: CalorieCalculator,
  pregnancy: PregnancyCalculator,
  "body-fat": BodyFatCalculator,
  "water-intake": WaterIntakeCalculator,
  "heart-rate": HeartRateCalculator,
  scientific: ScientificCalculator,
  date: DateCalculator,
  timezone: TimeZoneConverter,
  gpa: GPACalculator,
  "unit-converter": UnitConverter,
};

const COMPARE_ENABLED = new Set(["emi", "sip", "mortgage", "retirement"]);

export function generateStaticParams() {
  return Object.keys(CALCULATOR_COMPONENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calc = CALCULATORS[slug];
  if (!calc) return {};

  return {
    title: `Free ${calc.name} Online — Charts, PDF Export & Dark Mode`,
    description: `${calc.description} Compare scenarios side-by-side, export PDF/CSV, share via link. Works offline. No signup.`,
    keywords: calc.keywords,
    alternates: { canonical: `${SITE_URL}/calculator/${slug}` },
    openGraph: {
      title: `Free ${calc.name} — CalcHub`,
      description: calc.description,
      url: `${SITE_URL}/calculator/${slug}`,
    },
  };
}

export default async function CalculatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calc = CALCULATORS[slug];
  if (!calc) notFound();

  const Component = CALCULATOR_COMPONENTS[slug];
  if (!Component) notFound();

  const related = CALCULATOR_LIST.filter((c) => c.slug !== slug && c.category === calc.category).slice(0, 3);
  const otherCategory = CALCULATOR_LIST.filter((c) => c.category !== calc.category).slice(0, 3);
  const variants = VARIANTS_BY_CALCULATOR[slug] || [];

  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://calculatorhub.org" },
          { "@type": "ListItem", position: 2, name: calc.name, item: `https://calculatorhub.org/calculator/${slug}` },
        ],
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: calc.name,
        url: `https://calculatorhub.org/calculator/${slug}`,
        description: calc.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border-b border-indigo-100/50 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700 dark:text-gray-300">{calc.name}</span>
          </nav>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${calc.color} ${calc.colorTo} flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0 mt-1`}>
              {calc.icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">{calc.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">{calc.description}</p>
              <FeatureBadges />
            </div>
          </div>
        </div>
      </section>

      <MobileSwipeNav currentSlug={slug} />

      {/* Calculator */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
            <CompareToggle calculator={Component} enabled={COMPARE_ENABLED.has(slug)}>
              <Component />

              {/* Variant pages — more specific calculators */}
              {variants.length > 0 && (
                <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Specialized {calc.name}s</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Choose a specific use case for more targeted calculations and tips.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {variants.map((v) => (
                      <Link
                        key={v.variant}
                        href={`/calculator/${slug}/${v.variant}`}
                        className="group bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600">{v.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{v.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Calculators — hidden in compare mode */}
              <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 dark:bg-gray-800">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Calculators</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[...related, ...otherCategory].slice(0, 6).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/calculator/${c.slug}`}
                      className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="text-2xl mb-1">{c.icon}</div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600">{c.shortName}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </CompareToggle>
            <TrustBadges calculatorName={calc.name} />
            <CalculateNext currentSlug={slug} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
