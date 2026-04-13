"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function InvestmentCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [initialInvestment, setInitialInvestment] = useState(getNumber("initialInvestment", 10000));
  const [monthlyAddition, setMonthlyAddition] = useState(getNumber("monthlyAddition", 500));
  const [annualReturn, setAnnualReturn] = useState(getNumber("annualReturn", 10));
  const [years, setYears] = useState(getNumber("years", 15));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setInitialInvestment(detected.defaultSIP * 20);
      setMonthlyAddition(detected.defaultSIP);
    }
  }, [hasParams]);

  useShareableURL({ initialInvestment, monthlyAddition, annualReturn, years, currency: currency.code });

  const result = useMemo(() => {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const chartData: { year: number; invested: number; value: number }[] = [];

    let balance = initialInvestment;
    let totalInvested = initialInvestment;

    // Year 0
    chartData.push({ year: 0, invested: initialInvestment, value: initialInvestment });

    for (let m = 1; m <= months; m++) {
      balance = balance * (1 + monthlyRate) + monthlyAddition;
      totalInvested += monthlyAddition;

      if (m % 12 === 0) {
        chartData.push({
          year: m / 12,
          invested: Math.round(totalInvested),
          value: Math.round(balance),
        });
      }
    }

    const finalValue = Math.round(balance);
    const totalInvestedFinal = Math.round(totalInvested);
    const totalReturns = finalValue - totalInvestedFinal;
    const growthMultiplier = totalInvestedFinal > 0 ? finalValue / totalInvestedFinal : 0;

    return { finalValue, totalInvested: totalInvestedFinal, totalReturns, growthMultiplier, chartData };
  }, [initialInvestment, monthlyAddition, annualReturn, years]);

  const fmt = (v: number) => formatAmount(v, currency);
  const fmtShort = (v: number) => {
    if (v >= 1e7) return `${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e4) return `${(v / 1e3).toFixed(0)}K`;
    return v.toLocaleString();
  };

  useCalcHistory("investment", { initialInvestment, monthlyAddition, annualReturn, years, currency: currency.code }, `Final: ${fmt(result.finalValue)} — ${result.growthMultiplier.toFixed(1)}x growth`);

  return (
    <div className="space-y-8">
      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setInitialInvestment(c.defaultSIP * 20);
        setMonthlyAddition(c.defaultSIP);
        setAnnualReturn(10);
        setYears(15);
      }} pdfData={{
        calculatorName: "Investment Calculator",
        inputs: [
          { label: "Initial Investment", value: fmt(initialInvestment) },
          { label: "Monthly Addition", value: fmt(monthlyAddition) },
          { label: "Annual Return", value: `${annualReturn}%` },
          { label: "Investment Period", value: `${years} years` },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Final Value", value: fmt(result.finalValue) },
          { label: "Total Invested", value: fmt(result.totalInvested) },
          { label: "Total Returns", value: fmt(result.totalReturns) },
          { label: "Growth Multiplier", value: `${result.growthMultiplier.toFixed(2)}x` },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setInitialInvestment(c.defaultSIP * 20); setMonthlyAddition(c.defaultSIP); }}
          />

          {/* Initial Investment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Initial Investment</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={initialInvestment}
                  onChange={setInitialInvestment}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setInitialInvestment(v)} />
              </div>
            </div>
            <input type="range" min={0} max={10000000} step={1000} value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(0, currency)}</span>
              <span>{formatAmount(10000000, currency)}</span>
            </div>
          </div>

          {/* Monthly Addition */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Addition</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <CalcInput
                  value={monthlyAddition}
                  onChange={setMonthlyAddition}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setMonthlyAddition(v)} />
              </div>
            </div>
            <input type="range" min={0} max={500000} step={100} value={monthlyAddition} onChange={(e) => setMonthlyAddition(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(0, currency)}</span>
              <span>{formatAmount(500000, currency)}</span>
            </div>
          </div>

          {/* Annual Return */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Annual Return Rate (%)</label>
              <CalcInput
                value={annualReturn}
                onChange={setAnnualReturn}
                step={0.5}
                min={0}
                max={50}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setAnnualReturn(v)} />
            </div>
            <input type="range" min={0} max={50} step={0.5} value={annualReturn} onChange={(e) => setAnnualReturn(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Investment Period (Years)</label>
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
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <p className="text-sm font-medium text-indigo-200">Final Portfolio Value</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">{fmt(result.finalValue)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-200">Total Invested</p>
                <p className="text-lg font-bold text-amber-300">{fmt(result.totalInvested)}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200">Returns Earned</p>
                <p className="text-lg font-bold">{fmt(result.totalReturns)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-indigo-200">Growth Multiplier</p>
              <p className="text-2xl font-extrabold text-amber-300">{result.growthMultiplier.toFixed(2)}x</p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      {result.chartData.length > 1 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Growth Over Time</p>
          <div style={{ width: "100%", height: 288 }}>
            <ResponsiveContainer width="100%" height={288}>
              <AreaChart data={result.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  tickFormatter={(v) => `Y${v}`}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  tickFormatter={(v) => fmtShort(v)}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  width={60}
                />
                <Tooltip
                  formatter={(value, name) => [fmt(Number(value)), name === "value" ? "Portfolio Value" : "Total Invested"]}
                  labelFormatter={(label) => `Year ${label}`}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px", backgroundColor: "rgba(255,255,255,0.95)" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="value"
                />
                <Area
                  type="monotone"
                  dataKey="invested"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                  name="invested"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Total Invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Portfolio Value</span>
            </div>
          </div>
        </div>
      )}

      <InsightCard
        icon={result.growthMultiplier >= 3 ? "🚀" : "💡"}
        title="Investment Insight"
        color={result.growthMultiplier >= 3 ? "green" : result.growthMultiplier >= 1.5 ? "blue" : "amber"}
        insight={`Your money grew ${result.growthMultiplier.toFixed(1)} times. You invested ${fmt(result.totalInvested)} and earned ${fmt(result.totalReturns)} in pure returns — that's money working for you.`}
        tip={years < 10 ? "Investing for 10+ years dramatically increases the compounding effect. Time in market beats timing the market." : undefined}
      />

      <CalculationHistory calculator="investment" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.initialInvestment) setInitialInvestment(Number(inputs.initialInvestment));
        if (inputs.monthlyAddition) setMonthlyAddition(Number(inputs.monthlyAddition));
        if (inputs.annualReturn) setAnnualReturn(Number(inputs.annualReturn));
        if (inputs.years) setYears(Number(inputs.years));
      }} />
    </div>
  );
}
