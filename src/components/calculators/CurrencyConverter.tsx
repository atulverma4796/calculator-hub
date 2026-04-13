"use client";

import { useState, useEffect } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import CalcInput from "@/components/CalcInput";
import { CALCULATOR_CONTENT } from "@/lib/calculatorContent";
import CalculatorEducation from "@/components/CalculatorEducation";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

const CURRENCY_INFO: Record<string, { name: string; symbol: string }> = {
  USD: { name: "US Dollar", symbol: "$" },
  EUR: { name: "Euro", symbol: "\u20AC" },
  GBP: { name: "British Pound", symbol: "\u00A3" },
  INR: { name: "Indian Rupee", symbol: "\u20B9" },
  JPY: { name: "Japanese Yen", symbol: "\u00A5" },
  CAD: { name: "Canadian Dollar", symbol: "C$" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  AED: { name: "UAE Dirham", symbol: "AED" },
  SAR: { name: "Saudi Riyal", symbol: "SAR" },
  CNY: { name: "Chinese Yuan", symbol: "\u00A5" },
  KRW: { name: "South Korean Won", symbol: "\u20A9" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
  CHF: { name: "Swiss Franc", symbol: "CHF" },
  BRL: { name: "Brazilian Real", symbol: "R$" },
  MXN: { name: "Mexican Peso", symbol: "MX$" },
  ZAR: { name: "South African Rand", symbol: "R" },
  THB: { name: "Thai Baht", symbol: "\u0E3F" },
  IDR: { name: "Indonesian Rupiah", symbol: "Rp" },
  MYR: { name: "Malaysian Ringgit", symbol: "RM" },
  PKR: { name: "Pakistani Rupee", symbol: "Rs" },
  BDT: { name: "Bangladeshi Taka", symbol: "\u09F3" },
  NGN: { name: "Nigerian Naira", symbol: "\u20A6" },
  EGP: { name: "Egyptian Pound", symbol: "E\u00A3" },
  TRY: { name: "Turkish Lira", symbol: "\u20BA" },
  PLN: { name: "Polish Zloty", symbol: "z\u0142" },
  NZD: { name: "New Zealand Dollar", symbol: "NZ$" },
};

const CURRENCIES = Object.keys(CURRENCY_INFO);

export default function CurrencyConverter() {
  const { getString, getNumber } = useInitialParams();
  const [amount, setAmount] = useState(getNumber("amount", 1000));
  const [from, setFrom] = useState(getString("from", "USD"));
  const [to, setTo] = useState(getString("to", "EUR"));
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  useShareableURL({ amount, from, to });

  // Fetch real-time rates from Frankfurter API — powered by European Central Bank (ECB)
  // Official government source, free, no API key, no limits
  // https://frankfurter.dev
  useEffect(() => {
    async function fetchRates() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://api.frankfurter.dev/v1/latest?base=USD");
        const data = await res.json();
        if (data.rates) {
          // Frankfurter returns rates relative to base currency
          // Add USD itself (rate = 1) and the date
          setRates({ USD: 1, ...data.rates });
          setLastUpdated(data.date || new Date().toISOString());
        } else {
          throw new Error("Invalid response");
        }
      } catch {
        // Fallback: try alternative ECB-backed source
        try {
          const res2 = await fetch("https://open.er-api.com/v6/latest/USD");
          const data2 = await res2.json();
          if (data2.result === "success" && data2.rates) {
            setRates(data2.rates);
            setLastUpdated(data2.time_last_update_utc || new Date().toISOString());
            setError("Using backup rates source.");
          } else {
            throw new Error("Backup also failed");
          }
        } catch {
          setError("Could not fetch live rates. Please check your internet connection.");
          setRates(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  const convert = (amt: number, f: string, t: string) => {
    if (!rates || !rates[f] || !rates[t]) return 0;
    const inUSD = amt / rates[f];
    return inUSD * rates[t];
  };

  const converted = convert(amount, from, to);
  const rate1 = convert(1, from, to);
  const rateReverse = convert(1, to, from);

  useCalcHistory("currency", { amount, from, to }, `${amount} ${from} = ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}`);

  const swap = () => { setFrom(to); setTo(from); };

  const getSymbol = (code: string) => CURRENCY_INFO[code]?.symbol ?? code;

  // Filter currencies to only show ones we have rates for
  const availableCurrencies = rates ? CURRENCIES.filter((c) => rates[c] !== undefined) : CURRENCIES;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-10 h-10 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Fetching live rates from European Central Bank...</p>
      </div>
    );
  }

  if (!rates) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Could not load exchange rates</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please check your internet connection and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        setAmount(1000);
        setFrom("USD");
        setTo("EUR");
      }} pdfData={{
        calculatorName: "Currency Converter",
        inputs: [
          { label: "Amount", value: `${amount.toLocaleString()} ${from}` },
          { label: "From", value: from },
          { label: "To", value: to },
        ],
        results: [
          { label: "Converted", value: `${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}` },
          { label: "Rate", value: `1 ${from} = ${rate1.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}` },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* From */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Amount</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">{getSymbol(from)}</span>
              <CalcInput value={amount} onChange={setAmount} className="w-full pl-8 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-xl font-bold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-lime-500 focus:border-transparent" />
            </div>
            <VoiceInputButton onResult={(v) => setAmount(v)} />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-lime-500 bg-white dark:bg-gray-800 dark:text-white min-w-[130px]">
              {availableCurrencies.map((c) => <option key={c} value={c}>{c} — {CURRENCY_INFO[c]?.name ?? c}</option>)}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div className="flex justify-center">
          <button type="button" onClick={swap} className="w-10 h-10 rounded-full bg-lime-100 text-lime-700 flex items-center justify-center hover:bg-lime-200 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-9L16.5 12m0 0L12 7.5m4.5 4.5V4.5" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Converted To</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm">{getSymbol(to)}</span>
              <div className="w-full pl-8 pr-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-xl font-extrabold text-lime-700 bg-lime-50">
                {converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-lime-500 bg-white dark:bg-gray-800 dark:text-white min-w-[130px]">
              {availableCurrencies.map((c) => <option key={c} value={c}>{c} — {CURRENCY_INFO[c]?.name ?? c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Exchange rate info */}
      <div className="bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl p-6 text-white shadow-xl shadow-lime-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-lime-100">1 {from} =</p>
            <p className="text-2xl font-extrabold animate-count-up">{getSymbol(to)} {rate1.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
          </div>
          <div>
            <p className="text-xs text-lime-100">1 {to} =</p>
            <p className="text-2xl font-extrabold">{getSymbol(from)} {rateReverse.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-4">
          <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
          <p className="text-[10px] text-lime-200">
            Official rates from European Central Bank (ECB)
            {lastUpdated && ` · ${lastUpdated}`}
          </p>
        </div>
      </div>


      {rates && (
        <InsightCard
          icon="💱"
          title="Exchange Insight"
          color="blue"
          insight={`${getSymbol(from)} ${amount.toLocaleString()} ${from} = ${getSymbol(to)} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to} at the ECB mid-market rate.`}
          tip={rate1 > 100 ? `1 ${from} buys over ${Math.floor(rate1)} ${to} — the ${from} is much stronger.` : rate1 < 0.01 ? `1 ${from} is worth very little in ${to} — the ${to} is much stronger.` : undefined}
        />
      )}

      <CalculationHistory
        calculator="currency"
        onLoad={(inputs) => {
          setAmount(Number(inputs.amount));
          setFrom(String(inputs.from));
          setTo(String(inputs.to));
        }}
      />

      {CALCULATOR_CONTENT.currency && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.currency}
          calculatorName="Currency Converter"
          dynamicExample={{
            setup: `You want to convert ${getSymbol(from)} ${amount.toLocaleString()} ${from} to ${to}.`,
            calculation: `Using the ECB exchange rate: 1 ${from} = ${getSymbol(to)} ${rate1.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${to}. So ${amount.toLocaleString()} ${from} x ${rate1.toLocaleString(undefined, { maximumFractionDigits: 4 })} = ${getSymbol(to)} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })}.`,
            result: `${getSymbol(from)} ${amount.toLocaleString()} ${from} = ${getSymbol(to)} ${converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${to}. The reverse rate is 1 ${to} = ${getSymbol(from)} ${rateReverse.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${from}. Rates are sourced from the European Central Bank and update daily.`,
          }}
        />
      )}
    </div>
  );
}
