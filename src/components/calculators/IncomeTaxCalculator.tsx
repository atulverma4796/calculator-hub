"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";

// Sources (all verified May 2026 via official tax authority pages):
// India New: incometax.gov.in AY 2026-27 (Section 115BAC, Budget 2025)
// India Old: incometax.gov.in AY 2026-27 (default exemption ₹2.5L)
// US: IRS Rev. Proc. 2025-32 (Tax Year 2026, post-OBBBA), single filer
// UK: GOV.UK HMRC 2026/27 (England, Wales & Northern Ireland)
// Canada: CRA 2026 federal brackets (effective 1 Jan 2026)
// Australia: ATO 2025-26 (Stage 3 rates, effective 1 Jul 2024)
const TAX_REGIMES = {
  india_new: {
    name: "🇮🇳 India — New Regime (FY 2025-26)",
    currencyCode: "INR",
    brackets: [
      { min: 0, max: 400000, rate: 0 },
      { min: 400000, max: 800000, rate: 5 },
      { min: 800000, max: 1200000, rate: 10 },
      { min: 1200000, max: 1600000, rate: 15 },
      { min: 1600000, max: 2000000, rate: 20 },
      { min: 2000000, max: 2400000, rate: 25 },
      { min: 2400000, max: Infinity, rate: 30 },
    ],
  },
  india_old: {
    name: "🇮🇳 India — Old Regime (FY 2025-26)",
    currencyCode: "INR",
    brackets: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 1000000, rate: 20 },
      { min: 1000000, max: Infinity, rate: 30 },
    ],
  },
  us: {
    name: "🇺🇸 USA — Federal (Tax Year 2026, Single)",
    currencyCode: "USD",
    brackets: [
      { min: 0, max: 12400, rate: 10 },
      { min: 12400, max: 50400, rate: 12 },
      { min: 50400, max: 105700, rate: 22 },
      { min: 105700, max: 201775, rate: 24 },
      { min: 201775, max: 256225, rate: 32 },
      { min: 256225, max: 640600, rate: 35 },
      { min: 640600, max: Infinity, rate: 37 },
    ],
  },
  uk: {
    name: "🇬🇧 UK — PAYE (2026/27)",
    currencyCode: "GBP",
    brackets: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12570, max: 50270, rate: 20 },
      { min: 50270, max: 125140, rate: 40 },
      { min: 125140, max: Infinity, rate: 45 },
    ],
  },
  canada: {
    name: "🇨🇦 Canada — Federal (2026)",
    currencyCode: "CAD",
    brackets: [
      { min: 0, max: 58523, rate: 14 },
      { min: 58523, max: 117045, rate: 20.5 },
      { min: 117045, max: 181440, rate: 26 },
      { min: 181440, max: 258482, rate: 29 },
      { min: 258482, max: Infinity, rate: 33 },
    ],
  },
  australia: {
    name: "🇦🇺 Australia — ATO Resident (2025-26)",
    currencyCode: "AUD",
    brackets: [
      { min: 0, max: 18200, rate: 0 },
      { min: 18200, max: 45000, rate: 16 },
      { min: 45000, max: 135000, rate: 30 },
      { min: 135000, max: 190000, rate: 37 },
      { min: 190000, max: Infinity, rate: 45 },
    ],
  },
};

type RegimeKey = keyof typeof TAX_REGIMES;

function getDefaultRegime(code: string): RegimeKey {
  if (code === "INR") return "india_new";
  if (code === "GBP") return "uk";
  if (code === "CAD") return "canada";
  if (code === "AUD") return "australia";
  return "us";
}

export default function IncomeTaxCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [income, setIncome] = useState(getNumber("income", 55000));
  const [regime, setRegime] = useState<RegimeKey>(getString("regime", "us") as RegimeKey);

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      const defaultRegime = getDefaultRegime(detected.code);
      setRegime(defaultRegime);
      setIncome(detected.defaultSalary);
    }
  }, [hasParams]);

  useShareableURL({ income, regime });

  const r = TAX_REGIMES[regime];
  const regimeCurrency = getCurrencyConfig(r.currencyCode);

  const result = useMemo(() => {
    let tax = 0;
    const breakdown: { bracket: string; taxable: number; rate: number; tax: number }[] = [];

    for (const b of r.brackets) {
      if (income <= b.min) break;
      const taxable = Math.min(income, b.max) - b.min;
      const t = (taxable * b.rate) / 100;
      tax += t;
      if (taxable > 0) {
        breakdown.push({
          bracket: b.max === Infinity
            ? `${formatAmount(b.min, regimeCurrency)}+`
            : `${formatAmount(b.min, regimeCurrency)} – ${formatAmount(b.max, regimeCurrency)}`,
          taxable,
          rate: b.rate,
          tax: Math.round(t),
        });
      }
    }

    // India FY 2025-26 — apply Section 87A rebate + 4% cess.
    // - New Regime: rebate ₹60K when income ≤ ₹12L (makes income up to ₹12L tax-free)
    // - Old Regime: rebate ₹12,500 when income ≤ ₹5L (makes income up to ₹5L tax-free)
    let rebate = 0;
    let cess = 0;
    if (regime === "india_new") {
      if (income <= 1200000) {
        rebate = Math.min(tax, 60000);
        tax = tax - rebate;
      }
      cess = tax * 0.04;
      tax = tax + cess;
    } else if (regime === "india_old") {
      if (income <= 500000) {
        rebate = Math.min(tax, 12500);
        tax = tax - rebate;
      }
      cess = tax * 0.04;
      tax = tax + cess;
    }

    const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
    const afterTax = income - tax;

    return {
      tax: Math.round(tax),
      effectiveRate,
      afterTax: Math.round(afterTax),
      breakdown,
      rebate: Math.round(rebate),
      cess: Math.round(cess),
    };
  }, [income, r, regime, regimeCurrency]);

  const fmt = (v: number) => formatAmount(v, regimeCurrency);

  useCalcHistory("income-tax", { income, regime }, `Tax: ${fmt(result.tax)} — Effective: ${result.effectiveRate.toFixed(1)}%`);

  const maxSlider =
    regime === "india_new" || regime === "india_old"
      ? 5000000
      : regime === "uk"
      ? 300000
      : regime === "canada"
      ? 400000
      : regime === "australia"
      ? 400000
      : 500000;

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        const defaultRegime = getDefaultRegime(c.code);
        setRegime(defaultRegime);
        setIncome(c.defaultSalary);
      }} pdfData={{
        calculatorName: "Income Tax Calculator",
        inputs: [
          { label: "Annual Income", value: fmt(income) },
          { label: "Tax Regime", value: r.name },
        ],
        results: [
          { label: "Tax Payable", value: fmt(result.tax) },
          { label: "Effective Rate", value: `${result.effectiveRate.toFixed(1)}%` },
          { label: "After Tax", value: fmt(result.afterTax) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Tax Regime</label>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(TAX_REGIMES) as [RegimeKey, typeof TAX_REGIMES[RegimeKey]][]).map(([key, val]) => (
              <button key={key} type="button" onClick={() => { setRegime(key); setIncome(getCurrencyConfig(val.currencyCode).defaultSalary); }} className={`px-4 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${regime === key ? "border-teal-500 bg-teal-50 text-teal-700" : "border-gray-200 text-gray-500 dark:text-gray-400"}`}>{val.name}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Annual Income</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">{regimeCurrency.symbol}</span>
              <CalcInput value={income} onChange={setIncome} className="w-36 text-right text-sm font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5" />
            </div>
          </div>
          <input type="range" min={0} max={maxSlider} step={10000} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Result card */}
      <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-teal-100">Tax Payable</p>
            <p className="text-2xl font-extrabold text-amber-300 animate-count-up">{fmt(result.tax)}</p>
          </div>
          <div>
            <p className="text-xs text-teal-100">Effective Rate</p>
            <p className="text-2xl font-extrabold animate-count-up">{result.effectiveRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-teal-100">After Tax</p>
            <p className="text-2xl font-extrabold text-green-300 animate-count-up">{fmt(result.afterTax)}</p>
          </div>
        </div>
      </div>

      {/* Bracket breakdown */}
      {result.breakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b"><h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Tax Bracket Breakdown</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Bracket</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Taxable</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Rate</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {result.breakdown.map((row) => (
                  <tr key={row.bracket} className="hover:bg-teal-50/50 dark:hover:bg-gray-800">
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.bracket}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">{fmt(row.taxable)}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-gray-700 dark:text-gray-300">{row.rate}%</td>
                    <td className="px-4 py-2.5 text-right font-bold text-amber-700 dark:text-amber-400">{fmt(row.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      <InsightCard
        icon={result.effectiveRate < 15 ? "✅" : "📊"}
        title="Tax Insight"
        color={result.effectiveRate < 10 ? "green" : result.effectiveRate < 25 ? "blue" : "amber"}
        insight={`On ${fmt(income)} income, your tax is ${fmt(result.tax)}. Your effective rate is ${result.effectiveRate.toFixed(1)}% — much lower than your top bracket rate thanks to progressive taxation.`}
        tip={`After tax, you take home ${fmt(result.afterTax)} (${(100 - result.effectiveRate).toFixed(0)}% of your income).`}
      />

      {/* What's included / what's NOT — protects users from over- or under-estimating their real take-home */}
      <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 sm:p-5 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
        <strong className="block mb-2 text-amber-900 dark:text-amber-100">
          What this calculator does &amp; doesn&apos;t include
        </strong>
        {regime === "india_new" && (
          <>
            <p>
              <strong>🇮🇳 India — New Regime FY 2025-26 (verified per Budget 2025 / Finance Act 2025).</strong>
              {" "}Includes: progressive slab tax + Section 87A rebate (₹60K, making ≤₹12L tax-free) + 4% Health &amp; Education cess.
            </p>
            <p className="mt-2">
              Does NOT include: standard deduction (₹75K — apply it to your gross to get taxable income), Section 80C/80D/80G deductions, surcharge for incomes &gt; ₹50L,
              {" "}or Old Regime computation. For Old vs New comparison use the{" "}
              <a href="/calculator/tax-regime" className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-100">Tax Regime Calculator</a>.
            </p>
          </>
        )}
        {regime === "india_old" && (
          <>
            <p>
              <strong>🇮🇳 India — Old Regime FY 2025-26 (below-60 individual, default exemption ₹2.5L).</strong>
              {" "}Includes: progressive slabs (2.5L/5L/10L) + Section 87A rebate (₹12,500, making ≤₹5L tax-free) + 4% Health &amp; Education cess.
            </p>
            <p className="mt-2">
              Does NOT include: standard deduction (₹50K), Section 80C (₹1.5L), 80D (medical insurance), 80G (donations), HRA exemption,
              {" "}home loan interest, or surcharge for incomes &gt; ₹50L. Senior citizens (60-80) get higher basic exemption (₹3L), super senior (80+) gets ₹5L —
              {" "}not modeled here. For a full Old vs New comparison use the{" "}
              <a href="/calculator/tax-regime" className="underline font-semibold hover:text-amber-700 dark:hover:text-amber-100">Tax Regime Calculator</a>.
            </p>
          </>
        )}
        {regime === "canada" && (
          <>
            <p>
              <strong>🇨🇦 Canada — Federal income tax 2026 (CRA, lower bracket reduced from 15% to 14% effective 1 Jul 2025).</strong>
              {" "}Includes: progressive federal brackets only.
            </p>
            <p className="mt-2">
              Does NOT include: PROVINCIAL tax (varies hugely — Quebec 14-25.75%, Ontario 5.05-13.16%, Alberta 8-15%, etc., applied on top of federal), Basic Personal Amount tax credit ($16,452 for 2026, tapered for income &gt; ~$177K), CPP/EI contributions, RRSP/TFSA deductions, dividend tax credit, or non-refundable credits. For accurate take-home you must add your province&apos;s rate to the federal tax shown here.
            </p>
          </>
        )}
        {regime === "australia" && (
          <>
            <p>
              <strong>🇦🇺 Australia — ATO 2025-26 (Stage 3 rates, tax-free threshold $18,200).</strong>
              {" "}Includes: progressive resident brackets only.
            </p>
            <p className="mt-2">
              Does NOT include: 2% Medicare Levy (most residents pay this on taxable income; Medicare Levy Surcharge applies above income thresholds without private health cover), Low Income Tax Offset (LITO, up to $700 if income ≤ $66,667), HECS/HELP repayments (1-10% above $54,435), super (super contributions are taxed separately at 15%), or non-resident rates (higher, no tax-free threshold). For Queensland/NSW/Vic land tax or stamp duty those are separate state taxes.
            </p>
          </>
        )}
        {regime === "us" && (
          <>
            <p>
              <strong>USA — Federal Tax Year 2026, Single filer (IRS Rev. Proc. 2025-32, post-OBBBA).</strong>
              {" "}Brackets verified against IRS official rates.
            </p>
            <p className="mt-2">
              Does NOT include: standard deduction ($16,100 for 2026 single — subtract from gross for taxable income), FICA payroll tax (Social Security 6.2% + Medicare 1.45% = 7.65%), state/local income tax (varies by state), or filing statuses other than Single (MFJ, MFS, HoH have different brackets).
            </p>
          </>
        )}
        {regime === "uk" && (
          <>
            <p>
              <strong>UK — PAYE 2026/27 (HMRC — England, Wales &amp; Northern Ireland).</strong>
              {" "}Includes: Personal Allowance £12,570 + Basic/Higher/Additional rate progressive brackets.
            </p>
            <p className="mt-2">
              Does NOT include: National Insurance contributions (Class 1 employee NI is 8% on £12,570-£50,270, 2% above), Personal Allowance taper (reduces by £1 for every £2 over £100K), Scottish income tax bands (different rates apply if Scottish resident), or other reliefs / pension contributions.
            </p>
          </>
        )}
      </div>

      <CalculationHistory
        calculator="income-tax"
        onLoad={(inputs) => {
          setIncome(Number(inputs.income));
          setRegime(String(inputs.regime) as RegimeKey);
        }}
      />

      {CALCULATOR_CONTENT["income-tax"] && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT["income-tax"]}
          calculatorName="Income Tax Calculator"
          dynamicExample={{
            setup: `Your annual income is ${fmt(income)} under the ${r.name} tax regime.`,
            calculation: `Income tax uses progressive brackets — you don't pay the highest rate on your entire income. ${result.breakdown.map((b) => `${b.bracket} at ${b.rate}% = ${fmt(b.tax)}`).join(", ")}. These add up to your total tax.`,
            result: `Your total tax is ${fmt(result.tax)}, giving you an effective tax rate of ${result.effectiveRate.toFixed(1)}%. After tax, you take home ${fmt(result.afterTax)}. ${result.effectiveRate < 15 ? "Your effective rate is quite low thanks to the progressive bracket system." : "Consider tax-saving investments to reduce your liability."}`,
          }}
        />
      )}
    </div>
  );
}
