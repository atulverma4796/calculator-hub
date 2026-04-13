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

export default function ProfitMarginCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [inputMode, setInputMode] = useState<"revenue-cost" | "cost-margin">(getString("inputMode", "revenue-cost") as "revenue-cost" | "cost-margin");
  const [revenue, setRevenue] = useState(getNumber("revenue", 1000));
  const [cost, setCost] = useState(getNumber("cost", 600));
  const [quantity, setQuantity] = useState(getNumber("quantity", 100));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setRevenue(detected.defaultPrice * 10);
      setCost(detected.defaultPrice * 6);
    }
  }, [hasParams]);

  useShareableURL({ revenue, cost, quantity, inputMode, currency: currency.code });

  const result = useMemo(() => {
    if (revenue <= 0 || cost < 0) {
      return { profit: 0, profitMargin: 0, markup: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0 };
    }

    const profit = revenue - cost;
    const profitMargin = (profit / revenue) * 100;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    const totalRevenue = revenue * quantity;
    const totalCost = cost * quantity;
    const totalProfit = profit * quantity;

    return { profit, profitMargin, markup, totalRevenue, totalCost, totalProfit };
  }, [revenue, cost, quantity]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("profit-margin", { revenue, cost, quantity, inputMode, currency: currency.code }, `Margin: ${result.profitMargin.toFixed(1)}% — Markup: ${result.markup.toFixed(1)}% — Total Profit: ${fmt(result.totalProfit)}`);

  const isProfitable = result.profit > 0;
  const perDollarKeep = revenue > 0 ? (result.profit / revenue).toFixed(2) : "0.00";

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setRevenue(c.defaultPrice * 10);
        setCost(c.defaultPrice * 6);
        setQuantity(100);
        setInputMode("revenue-cost");
      }} pdfData={{
        calculatorName: "Profit Margin Calculator",
        inputs: [
          { label: "Revenue per Unit", value: fmt(revenue) },
          { label: "Cost per Unit", value: fmt(cost) },
          { label: "Quantity", value: quantity.toLocaleString() },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Profit per Unit", value: fmt(result.profit) },
          { label: "Profit Margin", value: `${result.profitMargin.toFixed(2)}%` },
          { label: "Markup", value: `${result.markup.toFixed(2)}%` },
          { label: "Total Revenue", value: fmt(result.totalRevenue) },
          { label: "Total Cost", value: fmt(result.totalCost) },
          { label: "Total Profit", value: fmt(result.totalProfit) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setRevenue(c.defaultPrice * 10); setCost(c.defaultPrice * 6); }}
          />

          {/* Mode Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              type="button"
              onClick={() => setInputMode("revenue-cost")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                inputMode === "revenue-cost" ? "bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Revenue & Cost
            </button>
            <button
              type="button"
              onClick={() => setInputMode("cost-margin")}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                inputMode === "cost-margin" ? "bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Cost & Revenue
            </button>
          </div>

          {/* Revenue per Unit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Revenue (Selling Price) per Unit</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  step={0.01}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setRevenue(v)} />
              </div>
            </div>
            <input type="range" min={1} max={100000} step={1} value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(1, currency)}</span>
              <span>{formatAmount(100000, currency)}</span>
            </div>
          </div>

          {/* Cost per Unit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Cost per Unit</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  step={0.01}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setCost(v)} />
              </div>
            </div>
            <input type="range" min={0} max={100000} step={1} value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(0, currency)}</span>
              <span>{formatAmount(100000, currency)}</span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity (Units)</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
                max={1000000}
                className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setQuantity(v)} />
            </div>
            <input type="range" min={1} max={100000} step={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1</span>
              <span>100,000</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`bg-gradient-to-br ${isProfitable ? "from-indigo-600 to-purple-700 shadow-indigo-200" : "from-red-500 to-orange-600 shadow-red-200"} rounded-2xl p-6 text-white shadow-xl`}>
            <p className={`text-sm font-medium ${isProfitable ? "text-indigo-200" : "text-red-200"}`}>Profit Margin</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">{result.profitMargin.toFixed(2)}%</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className={`text-xs ${isProfitable ? "text-indigo-200" : "text-red-200"}`}>Markup</p>
                <p className="text-lg font-bold text-amber-300">{result.markup.toFixed(1)}%</p>
              </div>
              <div>
                <p className={`text-xs ${isProfitable ? "text-indigo-200" : "text-red-200"}`}>Profit per Unit</p>
                <p className="text-lg font-bold">{fmt(result.profit)}</p>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Totals ({quantity.toLocaleString()} units)</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{fmt(result.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Cost</span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">{fmt(result.totalCost)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Profit</span>
              <span className={`text-lg font-bold ${isProfitable ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{fmt(result.totalProfit)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={!isProfitable ? "⚠️" : result.profitMargin > 40 ? "🚀" : "💡"}
        title="Margin Insight"
        color={!isProfitable ? "red" : result.profitMargin > 40 ? "green" : "blue"}
        insight={
          !isProfitable
            ? `You're losing ${fmt(Math.abs(result.profit))} on every unit sold. Your cost of ${fmt(cost)} exceeds your revenue of ${fmt(revenue)}.`
            : `Your profit margin is ${result.profitMargin.toFixed(1)}%. For every ${currency.symbol}1 of revenue, you keep ${currency.symbol}${perDollarKeep}.`
        }
        tip={isProfitable && result.profitMargin < 20 ? "A margin below 20% leaves little room for unexpected costs. Consider if you can raise prices or find cheaper suppliers." : undefined}
      />

      <CalculationHistory calculator="profit-margin" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.revenue) setRevenue(Number(inputs.revenue));
        if (inputs.cost) setCost(Number(inputs.cost));
        if (inputs.quantity) setQuantity(Number(inputs.quantity));
        if (inputs.inputMode) setInputMode(inputs.inputMode as "revenue-cost" | "cost-margin");
      }} />
    </div>
  );
}
