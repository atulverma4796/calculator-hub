import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CALCULATORS, CALCULATOR_LIST } from "@/lib/calculators";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
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
};

export function generateStaticParams() {
  return Object.keys(CALCULATOR_COMPONENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const calc = CALCULATORS[slug];
  if (!calc) return {};

  return {
    title: `Free ${calc.name} Online — Interactive Charts & PDF Export`,
    description: calc.description,
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
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border-b border-indigo-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <nav className="text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700">{calc.name}</span>
          </nav>

          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${calc.color} ${calc.colorTo} flex items-center justify-center text-2xl shadow-lg`}>
              {calc.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{calc.name}</h1>
              <p className="text-gray-600 text-sm mt-1 max-w-xl">{calc.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Component />
        </div>
      </section>

      {/* Related Calculators */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...related, ...otherCategory].slice(0, 6).map((c) => (
              <Link
                key={c.slug}
                href={`/calculator/${c.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-1">{c.icon}</div>
                <p className="text-xs font-semibold text-gray-800 group-hover:text-indigo-600">{c.shortName}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
