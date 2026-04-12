import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CALCULATORS, CALCULATOR_LIST } from "@/lib/calculators";
import { CALCULATOR_VARIANTS, getVariant, VARIANTS_BY_CALCULATOR } from "@/lib/calculatorVariants";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import MobileSwipeNav from "@/components/MobileSwipeNav";
import CompareToggle from "@/components/CompareToggle";
import TrustBadges from "@/components/TrustBadges";
import CalculateNext from "@/components/CalculateNext";
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
import VariantDefaults from "@/components/VariantDefaults";

const SITE_URL = "https://thecalchub.org";

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
  return CALCULATOR_VARIANTS.map((v) => ({ slug: v.slug, variant: v.variant }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; variant: string }> }): Promise<Metadata> {
  const { slug, variant } = await params;
  const v = getVariant(slug, variant);
  if (!v) return {};

  return {
    title: v.title,
    description: v.description,
    keywords: v.keywords,
    alternates: { canonical: `${SITE_URL}/calculator/${slug}/${variant}` },
    openGraph: {
      title: v.title,
      description: v.description,
      url: `${SITE_URL}/calculator/${slug}/${variant}`,
    },
  };
}

export default async function VariantPage({ params }: { params: Promise<{ slug: string; variant: string }> }) {
  const { slug, variant } = await params;
  const v = getVariant(slug, variant);
  const calc = CALCULATORS[slug];
  if (!v || !calc) notFound();

  const Component = CALCULATOR_COMPONENTS[slug];
  if (!Component) notFound();

  // Related: other variants of the same calculator + related calculators
  const otherVariants = (VARIANTS_BY_CALCULATOR[slug] || []).filter((x) => x.variant !== variant).slice(0, 3);
  const relatedCalcs = CALCULATOR_LIST.filter((c) => c.slug !== slug && c.category === calc.category).slice(0, 3);

  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: calc.name, item: `${SITE_URL}/calculator/${slug}` },
          { "@type": "ListItem", position: 3, name: v.name, item: `${SITE_URL}/calculator/${slug}/${variant}` },
        ],
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: v.name,
        url: `${SITE_URL}/calculator/${slug}/${variant}`,
        description: v.description,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }} />
      {v.faqs.length > 0 && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: v.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }} />
      )}

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border-b border-indigo-100/50 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">›</span>
            <Link href={`/calculator/${slug}`} className="hover:text-indigo-600">{calc.name}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700 dark:text-gray-300">{v.name}</span>
          </nav>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${calc.color} ${calc.colorTo} flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0 mt-1`}>
              {calc.icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">{v.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">{v.description}</p>
            </div>
          </div>
        </div>
      </section>

      <MobileSwipeNav currentSlug={slug} />

      {/* Variant intro */}
      <section className="py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-indigo-100 dark:border-gray-700 rounded-2xl p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{v.intro}</p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
            <VariantDefaults defaults={v.defaults || {}}>
              <CompareToggle calculator={Component} enabled={COMPARE_ENABLED.has(slug)}>
                <Component />
              </CompareToggle>
            </VariantDefaults>
          </Suspense>
        </div>
      </section>

      {/* Variant-specific tips */}
      {v.tips.length > 0 && (
        <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Tips for {v.name.replace(" Calculator", "")}</h2>
            <div className="space-y-3">
              {v.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Variant-specific FAQs */}
      {v.faqs.length > 0 && (
        <section className="py-8 sm:py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {v.faqs.map((faq, i) => (
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
          </div>
        </section>
      )}

      {/* Trust badges */}
      <section className="pb-2">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges calculatorName={calc.name} />
          <CalculateNext currentSlug={slug} />
        </div>
      </section>

      {/* Related variants + calculators */}
      <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {otherVariants.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">More {calc.name.replace(" Calculator", "")} Calculators</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {otherVariants.map((ov) => (
                  <Link
                    key={ov.variant}
                    href={`/calculator/${ov.slug}/${ov.variant}`}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="text-2xl mb-1">{calc.icon}</div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-indigo-600">{ov.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ov.description}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {relatedCalcs.map((c) => (
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
      </section>
    </div>
  );
}
