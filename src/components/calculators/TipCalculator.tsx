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

export default function TipCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [bill, setBill] = useState(getNumber("bill", 50));
  const [tipPct, setTipPct] = useState(getNumber("tipPct", 15));
  const [people, setPeople] = useState(getNumber("people", 1));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setBill(detected.defaultBill);
      const tipMap: Record<string, number> = { USD: 15, CAD: 15, GBP: 10, EUR: 10, AED: 10, SAR: 10, INR: 10, JPY: 0, KRW: 0, CNY: 0 };
      setTipPct(tipMap[detected.code] ?? 10);
    }
  }, [hasParams]);

  useShareableURL({ bill, tipPct, people, currency: currency.code });

  const tipAmount = (bill * tipPct) / 100;
  const total = bill + tipAmount;
  const perPerson = people > 0 ? total / people : total;
  const tipPerPerson = people > 0 ? tipAmount / people : tipAmount;

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("tip", { bill, tipPct, people, currency: currency.code }, `Tip: ${fmt(tipAmount)} — Total: ${fmt(total)}`);

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setBill(c.defaultBill);
        const tipMap: Record<string, number> = { USD: 15, CAD: 15, GBP: 10, EUR: 10, AED: 10, SAR: 10, INR: 10, JPY: 0, KRW: 0, CNY: 0 };
        setTipPct(tipMap[c.code] ?? 10);
        setPeople(1);
      }} pdfData={{
        calculatorName: "Tip Calculator",
        inputs: [
          { label: "Bill", value: fmt(bill) },
          { label: "Tip %", value: `${tipPct}%` },
          { label: "People", value: `${people}` },
        ],
        results: [
          { label: "Tip Amount", value: fmt(tipAmount) },
          { label: "Total", value: fmt(total) },
          ...(people > 1 ? [{ label: "Per Person", value: fmt(perPerson) }] : []),
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={(c) => { setCurrency(c); setBill(c.defaultBill); }}
          accentColor="yellow"
        />

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Bill Amount</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg">{currency.symbol}</span>
              <input type="number" value={bill} onChange={(e) => setBill(Number(e.target.value) || 0)} className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-2xl font-bold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-yellow-500 focus:border-transparent" />
            </div>
            <VoiceInputButton onResult={(v) => setBill(v)} />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block">Tip Percentage</label>
          <div className="grid grid-cols-5 gap-2">
            {[10, 15, 18, 20, 25].map((t) => (
              <button key={t} type="button" onClick={() => setTipPct(t)} className={`py-3 rounded-xl text-sm font-bold transition-all ${tipPct === t ? "bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-200" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>{t}%</button>
            ))}
          </div>
          <div className="mt-3">
            <input type="range" min={0} max={50} step={1} value={tipPct} onChange={(e) => setTipPct(Number(e.target.value))} className="w-full" />
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-1">Custom: {tipPct}%</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Split Between</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">-</button>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 w-12 text-center">{people}</span>
            <button type="button" onClick={() => setPeople(people + 1)} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">+</button>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{people === 1 ? "person" : "people"}</span>
            <VoiceInputButton onResult={(v) => setPeople(Math.max(1, v))} />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-yellow-100">Tip Amount</p>
            <p className="text-2xl font-extrabold mt-0.5">{fmt(tipAmount)}</p>
          </div>
          <div>
            <p className="text-xs text-yellow-100">Total</p>
            <p className="text-2xl font-extrabold mt-0.5 animate-count-up">{fmt(total)}</p>
          </div>
        </div>
        {people > 1 && (
          <div className="mt-4 pt-4 border-t border-yellow-400/30 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-yellow-100">Tip per Person</p>
              <p className="text-lg font-bold">{fmt(tipPerPerson)}</p>
            </div>
            <div>
              <p className="text-xs text-yellow-100">Total per Person</p>
              <p className="text-lg font-bold">{fmt(perPerson)}</p>
            </div>
          </div>
        )}
      </div>


      <InsightCard
        icon="🍽️"
        title="Tip Insight"
        color={tipPct >= 20 ? "green" : "blue"}
        insight={`${tipPct}% tip on ${fmt(bill)} = ${fmt(tipAmount)}. Total: ${fmt(total)}.${people > 1 ? ` Split ${people} ways = ${fmt(perPerson)} each.` : ""}`}
        tip={tipPct >= 20 ? "Generous tip — your server will appreciate it!" : tipPct < 10 ? "Consider tipping 15-20% for good service in the US." : undefined}
      />

      <CalculationHistory
        calculator="tip"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setBill(Number(inputs.bill));
          setTipPct(Number(inputs.tipPct));
          setPeople(Number(inputs.people));
        }}
      />

      {CALCULATOR_CONTENT.tip && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.tip}
          calculatorName="Tip Calculator"
          dynamicExample={{
            setup: `Your bill is ${fmt(bill)} and you want to leave a ${tipPct}% tip${people > 1 ? `, split between ${people} people` : ""}.`,
            calculation: `Tip = ${fmt(bill)} x ${tipPct}% = ${fmt(tipAmount)}. Total = ${fmt(bill)} + ${fmt(tipAmount)} = ${fmt(total)}.${people > 1 ? ` Split ${people} ways: ${fmt(perPerson)} per person (including ${fmt(tipPerPerson)} tip each).` : ""}`,
            result: `Leave ${fmt(tipAmount)} as tip for a total of ${fmt(total)}.${people > 1 ? ` Each person pays ${fmt(perPerson)}.` : ""} ${tipPct >= 20 ? "That's a generous tip — your server will appreciate it!" : tipPct >= 15 ? "A standard tip — right in the sweet spot." : "Consider tipping 15-20% for good service."}`,
          }}
        />
      )}
    </div>
  );
}
