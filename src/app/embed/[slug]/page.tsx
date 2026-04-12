import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CALCULATORS } from "@/lib/calculators";
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

export function generateStaticParams() {
  return Object.keys(CALCULATOR_COMPONENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calc = CALCULATORS[slug];
  if (!calc) return {};

  return {
    title: `${calc.name} — Embed`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedCalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calc = CALCULATORS[slug];
  if (!calc) notFound();

  const Component = CALCULATOR_COMPONENTS[slug];
  if (!Component) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Calculator */}
      <main className="flex-1 py-4 px-3 sm:px-6">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Component />
        </Suspense>
      </main>

      {/* Powered by CalcHub credit */}
      <footer className="py-3 px-4 border-t border-gray-200 dark:border-gray-800 text-center">
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <span>Powered by</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Calc<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
          </span>
          <span>— Free Online Calculators</span>
        </a>
      </footer>
    </div>
  );
}
