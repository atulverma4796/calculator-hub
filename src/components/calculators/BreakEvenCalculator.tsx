"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function BreakEvenCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [fixedCosts, setFixedCosts] = useState(getNumber("fixedCosts", 10000));
  const [variableCost, setVariableCost] = useState(getNumber("variableCost", 20));
  const [sellingPrice, setSellingPrice] = useState(getNumber("sellingPrice", 50));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setFixedCosts(detected.defaultPrice * 100);
      setVariableCost(detected.defaultPrice / 5);
      setSellingPrice(detected.defaultPrice / 2);
    }
  }, [hasParams]);

  useShareableURL({ fixedCosts, variableCost, sellingPrice, currency: currency.code });

  const result = useMemo(() => {
    const contributionMargin = sellingPrice - variableCost;

    if (contributionMargin <= 0 || fixedCosts <= 0) {
      return { breakEvenQty: Infinity, breakEvenRevenue: 0, contributionMargin: 0, contributionMarginPct: 0, profitPerUnit: 0 };
    }

    const breakEvenQty = Math.ceil(fixedCosts / contributionMargin);
    const breakEvenRevenue = Math.round(breakEvenQty * sellingPrice);
    const contributionMarginPct = (contributionMargin / sellingPrice) * 100;
    const profitPerUnit = contributionMargin;

    return { breakEvenQty, breakEvenRevenue, contributionMargin, contributionMarginPct, profitPerUnit };
  }, [fixedCosts, variableCost, sellingPrice]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("break-even", { fixedCosts, variableCost, sellingPrice, currency: currency.code }, `Break-even: ${result.breakEvenQty === Infinity ? "N/A" : `${result.breakEvenQty} units`} — Revenue: ${fmt(result.breakEvenRevenue)}`);

  const isValid = result.breakEvenQty !== Infinity && sellingPrice > variableCost;

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setFixedCosts(c.defaultPrice * 100);
        setVariableCost(c.defaultPrice / 5);
        setSellingPrice(c.defaultPrice / 2);
      }} pdfData={{
        calculatorName: "Break-Even Calculator",
        inputs: [
          { label: "Fixed Costs", value: fmt(fixedCosts) },
          { label: "Variable Cost per Unit", value: fmt(variableCost) },
          { label: "Selling Price per Unit", value: fmt(sellingPrice) },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Break-Even Quantity", value: isValid ? `${result.breakEvenQty} units` : "N/A" },
          { label: "Break-Even Revenue", value: isValid ? fmt(result.breakEvenRevenue) : "N/A" },
          { label: "Contribution Margin", value: isValid ? `${fmt(result.contributionMargin)} (${result.contributionMarginPct.toFixed(1)}%)` : "N/A" },
          { label: "Profit per Unit (after break-even)", value: isValid ? fmt(result.profitPerUnit) : "N/A" },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setFixedCosts(c.defaultPrice * 100); setVariableCost(c.defaultPrice / 5); setSellingPrice(c.defaultPrice / 2); }}
          />

          {/* Fixed Costs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fixed Costs (Total)</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input
                  type="number"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Number(e.target.value) || 0)}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setFixedCosts(v)} />
              </div>
            </div>
            <input type="range" min={100} max={10000000} step={100} value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(100, currency)}</span>
              <span>{formatAmount(10000000, currency)}</span>
            </div>
          </div>

          {/* Variable Cost per Unit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Variable Cost per Unit</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input
                  type="number"
                  value={variableCost}
                  onChange={(e) => setVariableCost(Number(e.target.value) || 0)}
                  step={0.01}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setVariableCost(v)} />
              </div>
            </div>
            <input type="range" min={0} max={10000} step={1} value={variableCost} onChange={(e) => setVariableCost(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(0, currency)}</span>
              <span>{formatAmount(10000, currency)}</span>
            </div>
          </div>

          {/* Selling Price per Unit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Selling Price per Unit</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value) || 0)}
                  step={0.01}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setSellingPrice(v)} />
              </div>
            </div>
            <input type="range" min={1} max={10000} step={1} value={sellingPrice} onChange={(e) => setSellingPrice(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(1, currency)}</span>
              <span>{formatAmount(10000, currency)}</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`bg-gradient-to-br ${isValid ? "from-indigo-600 to-purple-700 shadow-indigo-200" : "from-red-500 to-orange-600 shadow-red-200"} rounded-2xl p-6 text-white shadow-xl`}>
            <p className={`text-sm font-medium ${isValid ? "text-indigo-200" : "text-red-200"}`}>Break-Even Point</p>
            {isValid ? (
              <>
                <p className="text-3xl sm:text-4xl font-extrabold mt-1">{result.breakEvenQty.toLocaleString()} units</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-indigo-200">Break-Even Revenue</p>
                    <p className="text-lg font-bold text-amber-300">{fmt(result.breakEvenRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200">Profit per Unit</p>
                    <p className="text-lg font-bold">{fmt(result.profitPerUnit)}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-lg font-bold mt-2">
                {sellingPrice <= variableCost
                  ? "Selling price must be higher than variable cost to break even."
                  : "Enter valid values to calculate."}
              </p>
            )}
          </div>

          {isValid && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Margin Analysis</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Selling Price</span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmt(sellingPrice)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Variable Cost</span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">-{fmt(variableCost)}</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Contribution Margin</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmt(result.contributionMargin)} ({result.contributionMarginPct.toFixed(1)}%)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <InsightCard
        icon={!isValid ? "⚠️" : result.breakEvenQty > 10000 ? "📊" : "💡"}
        title="Break-Even Insight"
        color={!isValid ? "red" : result.breakEvenQty > 10000 ? "amber" : "green"}
        insight={
          !isValid
            ? "Your selling price must be higher than your variable cost per unit. Otherwise, you lose money on every sale."
            : `You need to sell ${result.breakEvenQty.toLocaleString()} units to cover your costs. After that, every unit earns ${fmt(result.profitPerUnit)} profit.`
        }
        tip={isValid && result.contributionMarginPct < 30 ? "A contribution margin below 30% is tight. Consider raising prices or reducing variable costs to improve profitability." : undefined}
      />

      <CalculationHistory calculator="break-even" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.fixedCosts) setFixedCosts(Number(inputs.fixedCosts));
        if (inputs.variableCost) setVariableCost(Number(inputs.variableCost));
        if (inputs.sellingPrice) setSellingPrice(Number(inputs.sellingPrice));
      }} />
    </div>
  );
}
