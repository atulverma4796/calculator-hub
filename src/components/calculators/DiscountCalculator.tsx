"use client";

import { useState, useEffect } from "react";
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

export default function DiscountCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [price, setPrice] = useState(getNumber("price", 100));
  const [discount, setDiscount] = useState(getNumber("discount", 20));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setPrice(detected.defaultPrice * 10);
    }
  }, [hasParams]);

  useShareableURL({ price, discount, currency: currency.code });

  const savings = (price * discount) / 100;
  const finalPrice = price - savings;

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("discount", { price, discount, currency: currency.code }, `${discount}% off: ${fmt(price)} → ${fmt(finalPrice)}`);

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setPrice(c.defaultPrice * 10);
        setDiscount(20);
      }} pdfData={{
        calculatorName: "Discount Calculator",
        inputs: [
          { label: "Original Price", value: fmt(price) },
          { label: "Discount", value: `${discount}%` },
        ],
        results: [
          { label: "You Save", value: fmt(savings) },
          { label: "Final Price", value: fmt(finalPrice) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setPrice(c.defaultPrice * 10); }}
          accentColor="red"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Original Price</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
              <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-32 text-right text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              <VoiceInputButton onResult={(v) => setPrice(v)} />
            </div>
          </div>
          <input type="range" min={1} max={100000} step={10} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Discount (%)</label>
            <div className="flex items-center gap-1">
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min={0} max={100} className="w-24 text-right text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-red-500 focus:border-transparent" />
              <VoiceInputButton onResult={(v) => setDiscount(v)} />
            </div>
          </div>
          <input type="range" min={0} max={100} step={1} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-full" />
          <div className="flex justify-center gap-2 mt-3">
            {[10, 15, 20, 25, 30, 50, 70].map((d) => (
              <button key={d} type="button" onClick={() => setDiscount(d)} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${discount === d ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>{d}%</button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl shadow-red-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-red-200">Original</p>
            <p className="text-xl font-bold line-through opacity-70">{fmt(price)}</p>
          </div>
          <div>
            <p className="text-xs text-red-200">You Save</p>
            <p className="text-xl font-bold text-green-300">{fmt(savings)}</p>
          </div>
          <div>
            <p className="text-xs text-red-200">Final Price</p>
            <p className="text-2xl font-extrabold animate-count-up">{fmt(finalPrice)}</p>
          </div>
        </div>
      </div>


      <InsightCard
        icon="🏷️"
        title="Savings Insight"
        color={discount >= 50 ? "green" : "blue"}
        insight={`You save ${fmt(savings)} (${discount}% off) and pay ${fmt(finalPrice)} instead of ${fmt(price)}.`}
        tip={discount >= 50 ? "That's a massive deal — you're paying less than half!" : discount >= 30 ? "Solid discount — over a third off!" : undefined}
      />

      <CalculationHistory
        calculator="discount"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setPrice(Number(inputs.price));
          setDiscount(Number(inputs.discount));
        }}
      />

      {CALCULATOR_CONTENT.discount && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.discount}
          calculatorName="Discount Calculator"
          dynamicExample={{
            setup: `An item costs ${fmt(price)} and the store is offering ${discount}% off.`,
            calculation: `Savings = ${fmt(price)} x ${discount}% = ${fmt(savings)}. Final price = ${fmt(price)} - ${fmt(savings)} = ${fmt(finalPrice)}.`,
            result: `You save ${fmt(savings)} and pay ${fmt(finalPrice)}. ${discount >= 50 ? "That's a massive deal — you're paying less than half!" : discount >= 30 ? "Solid discount — over a third off the original price." : "Every bit counts!"}`,
          }}
        />
      )}
    </div>
  );
}
