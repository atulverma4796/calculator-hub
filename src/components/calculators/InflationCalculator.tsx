"use client";

import { useState, useEffect, useMemo } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import AffiliateCard from "@/components/AffiliateCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function InflationCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [currentAmount, setCurrentAmount] = useState(getNumber("currentAmount", 100000));
  const [inflationRate, setInflationRate] = useState(getNumber("inflationRate", 6));
  const [years, setYears] = useState(getNumber("years", 10));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setCurrentAmount(detected.defaultLoan);
    }
  }, [hasParams]);

  useShareableURL({ currentAmount, inflationRate, years, currency: currency.code });

  const result = useMemo(() => {
    if (inflationRate <= 0 || years <= 0) {
      return { futureValue: currentAmount, purchasingPower: currentAmount, costIncrease: 0, powerLoss: 0 };
    }

    const factor = Math.pow(1 + inflationRate / 100, years);
    const futureValue = Math.round(currentAmount * factor);
    const purchasingPower = Math.round(currentAmount / factor);
    const costIncrease = futureValue - currentAmount;
    const powerLoss = currentAmount - purchasingPower;

    return { futureValue, purchasingPower, costIncrease, powerLoss };
  }, [currentAmount, inflationRate, years]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("inflation", { currentAmount, inflationRate, years, currency: currency.code }, `Future Cost: ${fmt(result.futureValue)} — Purchasing Power: ${fmt(result.purchasingPower)}`);

  const powerLossPct = currentAmount > 0 ? Math.round((result.powerLoss / currentAmount) * 100) : 0;

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setCurrentAmount(c.defaultLoan);
        setInflationRate(6);
        setYears(10);
      }} pdfData={{
        calculatorName: "Inflation Calculator",
        inputs: [
          { label: "Current Amount", value: fmt(currentAmount) },
          { label: "Inflation Rate", value: `${inflationRate}% p.a.` },
          { label: "Time Period", value: `${years} years` },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Future Cost (what it will cost)", value: fmt(result.futureValue) },
          { label: "Purchasing Power (what your money buys)", value: fmt(result.purchasingPower) },
          { label: "Cost Increase", value: fmt(result.costIncrease) },
          { label: "Purchasing Power Loss", value: `${powerLossPct}%` },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setCurrentAmount(c.defaultLoan); }}
          />

          {/* Current Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={currentAmount}
                  onChange={setCurrentAmount}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setCurrentAmount(v)} />
              </div>
            </div>
            <input type="range" min={100} max={50000000} step={100} value={currentAmount} onChange={(e) => setCurrentAmount(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(100, currency)}</span>
              <span>{formatAmount(50000000, currency)}</span>
            </div>
          </div>

          {/* Inflation Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Inflation Rate (% p.a.)</label>
              <CalcInput
                value={inflationRate}
                onChange={setInflationRate}
                step={0.1}
                min={0.1}
                max={30}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setInflationRate(v)} />
            </div>
            <input type="range" min={0.5} max={30} step={0.1} value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0.5%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Period (Years)</label>
              <CalcInput
                value={years}
                onChange={setYears}
                min={1}
                max={50}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setYears(v)} />
            </div>
            <input type="range" min={1} max={50} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1 Year</span>
              <span>50 Years</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Future Cost Card */}
          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-red-200">
            <p className="text-sm font-medium text-red-100">Future Cost</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">{fmt(result.futureValue)}</p>
            <p className="text-xs text-red-200 mt-1">What costs {fmt(currentAmount)} today will cost this much in {years} years</p>
            <div className="mt-4">
              <p className="text-xs text-red-200">Cost Increase</p>
              <p className="text-lg font-bold text-amber-300">+{fmt(result.costIncrease)}</p>
            </div>
          </div>

          {/* Purchasing Power Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <p className="text-sm font-medium text-indigo-200">Purchasing Power</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">{fmt(result.purchasingPower)}</p>
            <p className="text-xs text-indigo-200 mt-1">Your {fmt(currentAmount)} will only buy this much in {years} years</p>
            <div className="mt-4">
              <p className="text-xs text-indigo-200">Value Lost</p>
              <p className="text-lg font-bold text-amber-300">-{powerLossPct}%</p>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={powerLossPct > 50 ? "⚠️" : "💡"}
        title="Inflation Insight"
        color={powerLossPct > 50 ? "red" : powerLossPct > 25 ? "amber" : "blue"}
        insight={`In ${years} years, what costs ${fmt(currentAmount)} today will cost ${fmt(result.futureValue)}. Your ${fmt(currentAmount)} will only buy ${fmt(result.purchasingPower)} worth of goods — a ${powerLossPct}% loss in purchasing power.`}
        tip={inflationRate > 5 ? "To beat inflation, your investments should earn at least " + inflationRate + "% annually. Consider equity or index funds for long-term wealth preservation." : undefined}
      />

      <AffiliateCard type="investment" />

      <CalculationHistory calculator="inflation" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.currentAmount) setCurrentAmount(Number(inputs.currentAmount));
        if (inputs.inflationRate) setInflationRate(Number(inputs.inflationRate));
        if (inputs.years) setYears(Number(inputs.years));
      }} />
    </div>
  );
}
