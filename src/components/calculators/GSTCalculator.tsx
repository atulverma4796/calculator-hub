"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import VoiceInputButton from "@/components/VoiceInputButton";

interface TaxSystem {
  name: string;       // "GST", "VAT", "Sales Tax", "Tax"
  rates: number[];    // preset rate buttons
  hasSplit: boolean;  // CGST/SGST split (India only)
  splitLabels?: [string, string]; // e.g. ["CGST", "SGST"]
  defaultRate: number;
}

// Verified tax rates (April 2026) — official sources:
// India: cbic.gov.in — GST slabs 5%, 12%, 18%, 28% (+ 40% sin goods from Sep 2025)
// UK: GOV.UK — VAT standard 20%, reduced 5%, zero 0%
// Germany/EU: EC taxation — standard 19%, reduced 7%
// Sweden/Norway: standard 25%, reduced 12%/6%
// Switzerland: ESTV — standard 8.1%, reduced 2.6%
// Turkey: GIB — standard 20%, reduced 10%, super-reduced 1%
// US: Tax Foundation — state rates 0-10%, avg combined ~7%
// UAE/SAR/BHD/OMR/QAR: govt portals — VAT 5%
// Australia: ATO — GST 10%  |  NZ: IRD — GST 15%
// Singapore: IRAS — GST 9% (since Jan 2024)
// Canada: CRA — GST 5%, HST 13% (ON), 14% (NS), 15% (NB/NL/PE)
// Japan: NTA — standard 10%, reduced 8% (food/newspapers)
// South Korea: NTS — VAT 10%
// Mexico: SAT — IVA standard 16%, zero-rated 0%
// South Africa: SARS — VAT 15%
// Nigeria: FIRS — VAT 7.5%
// Pakistan: FBR — sales tax 18%
// Thailand: Revenue Dept — VAT 7%  |  Indonesia: DJP — VAT 12%
// Philippines: BIR — VAT 12%  |  Vietnam: GDT — VAT 5%/8%/10%
function getTaxSystem(code: string): TaxSystem {
  switch (code) {
    case "INR":
      return { name: "GST", rates: [5, 12, 18, 28], hasSplit: true, splitLabels: ["CGST", "SGST"], defaultRate: 18 };
    case "GBP":
      return { name: "VAT", rates: [0, 5, 20], hasSplit: false, defaultRate: 20 };
    case "EUR": case "PLN":
      return { name: "VAT", rates: [0, 7, 19], hasSplit: false, defaultRate: 19 };
    case "SEK": case "NOK":
      return { name: "VAT", rates: [0, 6, 12, 25], hasSplit: false, defaultRate: 25 };
    case "CHF":
      return { name: "VAT", rates: [0, 2.6, 3.8, 8.1], hasSplit: false, defaultRate: 8.1 };
    case "TRY":
      return { name: "VAT", rates: [1, 10, 20], hasSplit: false, defaultRate: 20 };
    case "USD":
      return { name: "Sales Tax", rates: [0, 4, 5, 6, 7, 8, 9, 10], hasSplit: false, defaultRate: 7 };
    case "AED": case "SAR": case "BHD": case "OMR": case "QAR":
      return { name: "VAT", rates: [0, 5], hasSplit: false, defaultRate: 5 };
    case "AUD":
      return { name: "GST", rates: [0, 10], hasSplit: false, defaultRate: 10 };
    case "NZD":
      return { name: "GST", rates: [0, 15], hasSplit: false, defaultRate: 15 };
    case "SGD":
      return { name: "GST", rates: [0, 9], hasSplit: false, defaultRate: 9 };
    case "CAD":
      return { name: "GST/HST", rates: [5, 13, 14, 15], hasSplit: false, defaultRate: 13 };
    case "JPY":
      return { name: "Consumption Tax", rates: [8, 10], hasSplit: false, defaultRate: 10 };
    case "KRW":
      return { name: "VAT", rates: [0, 10], hasSplit: false, defaultRate: 10 };
    case "MXN":
      return { name: "IVA", rates: [0, 16], hasSplit: false, defaultRate: 16 };
    case "ZAR":
      return { name: "VAT", rates: [0, 15], hasSplit: false, defaultRate: 15 };
    case "NGN":
      return { name: "VAT", rates: [0, 7.5], hasSplit: false, defaultRate: 7.5 };
    case "EGP":
      return { name: "VAT", rates: [0, 14], hasSplit: false, defaultRate: 14 };
    case "PKR":
      return { name: "Sales Tax", rates: [0, 18], hasSplit: false, defaultRate: 18 };
    case "THB":
      return { name: "VAT", rates: [0, 7], hasSplit: false, defaultRate: 7 };
    case "IDR":
      return { name: "VAT", rates: [0, 11, 12], hasSplit: false, defaultRate: 12 };
    case "PHP":
      return { name: "VAT", rates: [0, 12], hasSplit: false, defaultRate: 12 };
    case "VND":
      return { name: "VAT", rates: [0, 5, 8, 10], hasSplit: false, defaultRate: 10 };
    case "BRL":
      return { name: "Tax", rates: [0, 7, 12, 17, 25], hasSplit: false, defaultRate: 17 };
    default:
      return { name: "Tax", rates: [5, 10, 15, 20], hasSplit: false, defaultRate: 10 };
  }
}

export default function GSTCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [amount, setAmount] = useState(getNumber("amount", 100));
  const [taxRate, setTaxRate] = useState(getNumber("taxRate", 7));
  const [mode, setMode] = useState<"add" | "remove">(getString("mode", "add") as "add" | "remove");

  const taxSystem = getTaxSystem(currency.code);

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setAmount(detected.defaultPrice * 10);
      setTaxRate(getTaxSystem(detected.code).defaultRate);
    }
  }, [hasParams]);

  useShareableURL({ amount, taxRate, mode, currency: currency.code });

  const handleCurrencyChange = (c: CurrencyConfig) => {
    setCurrency(c);
    setAmount(c.defaultPrice * 10);
    const sys = getTaxSystem(c.code);
    setTaxRate(sys.defaultRate);
  };

  const result = useMemo(() => {
    if (mode === "add") {
      const taxAmount = (amount * taxRate) / 100;
      const split1 = taxSystem.hasSplit ? taxAmount / 2 : taxAmount;
      const split2 = taxSystem.hasSplit ? taxAmount / 2 : 0;
      return { original: amount, taxAmount, split1, split2, total: amount + taxAmount };
    } else {
      const original = (amount * 100) / (100 + taxRate);
      const taxAmount = amount - original;
      const split1 = taxSystem.hasSplit ? taxAmount / 2 : taxAmount;
      const split2 = taxSystem.hasSplit ? taxAmount / 2 : 0;
      return { original: Math.round(original), taxAmount: Math.round(taxAmount), split1: Math.round(split1), split2: Math.round(split2), total: amount };
    }
  }, [amount, taxRate, mode, taxSystem.hasSplit]);

  const fmt = (v: number) => formatAmount(v, currency);
  const taxName = taxSystem.name;

  useCalcHistory("gst", { amount, taxRate, mode, currency: currency.code }, `${taxName}: ${fmt(result.taxAmount)} — Total: ${fmt(result.total)}`);

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        handleCurrencyChange(c);
        setMode("add");
      }} pdfData={{
        calculatorName: `${taxName} Calculator`,
        inputs: [
          { label: "Amount", value: fmt(amount) },
          { label: `${taxName} Rate`, value: `${taxRate}%` },
          { label: "Mode", value: mode === "add" ? `Add ${taxName}` : `Remove ${taxName}` },
        ],
        results: [
          { label: "Original Amount", value: fmt(result.original) },
          { label: `${taxName} Amount`, value: fmt(result.taxAmount) },
          { label: "Total", value: fmt(result.total) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={handleCurrencyChange}
          accentColor="violet"
        />

        {/* Mode toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button type="button" onClick={() => setMode("add")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "add" ? "bg-white dark:bg-gray-700 text-violet-700 dark:text-violet-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>
            Add {taxName} (+)
          </button>
          <button type="button" onClick={() => setMode("remove")} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === "remove" ? "bg-white dark:bg-gray-700 text-violet-700 dark:text-violet-300 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}>
            Remove {taxName} (-)
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            {mode === "add" ? `Amount (Before ${taxName})` : `Amount (Including ${taxName})`}
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">{currency.symbol}</span>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-bold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
            </div>
            <VoiceInputButton onResult={(v) => setAmount(v)} />
          </div>
        </div>

        {/* Tax Rate */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{taxName} Rate</label>
          <div className={`grid gap-2 ${taxSystem.rates.length <= 4 ? "grid-cols-4" : taxSystem.rates.length <= 6 ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-4 sm:grid-cols-7"}`}>
            {taxSystem.rates.map((r) => (
              <button key={r} type="button" onClick={() => setTaxRate(r)} className={`py-3 rounded-xl text-sm font-bold transition-all ${taxRate === r ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
                {r}%
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-gray-500">Custom rate:</span>
            <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} step={0.5} min={0} max={100} className="w-20 text-center text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-violet-500" />
            <VoiceInputButton onResult={(v) => setTaxRate(v)} />
            <span className="text-xs text-gray-400 dark:text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-200">
        <div className={`grid gap-4 ${taxSystem.hasSplit ? "grid-cols-2" : "grid-cols-2"}`}>
          <div>
            <p className="text-xs text-violet-200">{mode === "add" ? "Original Amount" : `Amount Before ${taxName}`}</p>
            <p className="text-xl font-bold mt-0.5">{fmt(result.original)}</p>
          </div>
          <div>
            <p className="text-xs text-violet-200">{taxName} Amount ({taxRate}%)</p>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{fmt(result.taxAmount)}</p>
          </div>
          {taxSystem.hasSplit && taxSystem.splitLabels && (
            <>
              <div>
                <p className="text-xs text-violet-200">{taxSystem.splitLabels[0]} ({taxRate / 2}%)</p>
                <p className="text-lg font-semibold mt-0.5">{fmt(result.split1)}</p>
              </div>
              <div>
                <p className="text-xs text-violet-200">{taxSystem.splitLabels[1]} ({taxRate / 2}%)</p>
                <p className="text-lg font-semibold mt-0.5">{fmt(result.split2)}</p>
              </div>
            </>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-violet-500/30">
          <p className="text-sm text-violet-200">Total Amount</p>
          <p className="text-3xl font-extrabold animate-count-up">{fmt(result.total)}</p>
        </div>
      </div>


      <InsightCard
        icon="🧾"
        title={`${taxName} Insight`}
        color="blue"
        insight={mode === "add" ? `Adding ${taxRate}% ${taxName} to ${fmt(amount)} gives a total of ${fmt(result.total)}. The tax component is ${fmt(result.taxAmount)}.` : `Out of ${fmt(amount)}, the pre-tax price is ${fmt(result.original)} and ${fmt(result.taxAmount)} is ${taxName}.`}
      />

      <CalculationHistory
        calculator="gst"
        onLoad={(inputs) => {
          handleCurrencyChange(getCurrencyConfig(String(inputs.currency)));
          setAmount(Number(inputs.amount));
          setTaxRate(Number(inputs.taxRate));
          setMode(String(inputs.mode) as "add" | "remove");
        }}
      />

      {CALCULATOR_CONTENT.gst && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.gst}
          calculatorName={`${taxName} Calculator`}
          dynamicExample={{
            setup: `You have ${mode === "add" ? `a product priced at ${fmt(amount)} before ${taxName}` : `an invoice of ${fmt(amount)} that already includes ${taxName}`}. The ${taxName} rate is ${taxRate}%.`,
            calculation: `${mode === "add" ? `${taxName} is calculated as ${fmt(amount)} x ${taxRate}% = ${fmt(result.taxAmount)}.${taxSystem.hasSplit && taxSystem.splitLabels ? ` This is split into ${taxSystem.splitLabels[0]} (${taxRate / 2}%) = ${fmt(result.split1)} and ${taxSystem.splitLabels[1]} (${taxRate / 2}%) = ${fmt(result.split2)}.` : ""}` : `To extract ${taxName} from ${fmt(amount)}: original price = ${fmt(amount)} x 100 / (100 + ${taxRate}) = ${fmt(result.original)}. The ${taxName} component is ${fmt(result.taxAmount)}.`}`,
            result: `${mode === "add" ? `Total price including ${taxName} is ${fmt(result.total)}. The tax adds ${fmt(result.taxAmount)} to the base price.` : `Price before ${taxName} was ${fmt(result.original)}. Out of your ${fmt(amount)}, ${fmt(result.taxAmount)} is tax.`}`,
          }}
        />
      )}
    </div>
  );
}
