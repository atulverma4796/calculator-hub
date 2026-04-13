"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

export default function SIPCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [monthly, setMonthly] = useState(getNumber("monthly", 500));
  const [rate, setRate] = useState(getNumber("rate", 12));
  const [years, setYears] = useState(getNumber("years", 10));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setMonthly(detected.defaultSIP);
    }
  }, [hasParams]);

  useShareableURL({ monthly, rate, years, currency: currency.code });

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 12 / 100;
    const invested = monthly * months;

    if (monthly <= 0 || rate <= 0 || years <= 0) {
      return { invested: 0, futureValue: 0, returns: 0, chartData: [] };
    }

    const futureValue = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const returns = futureValue - invested;

    const chartData: { year: number; invested: number; value: number }[] = [];
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const inv = monthly * m;
      const fv = monthly * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
      chartData.push({ year: y, invested: Math.round(inv), value: Math.round(fv) });
    }

    return { invested: Math.round(invested), futureValue: Math.round(futureValue), returns: Math.round(returns), chartData };
  }, [monthly, rate, years]);

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("sip", { monthly, rate, years, currency: currency.code }, `SIP: ${fmt(result.futureValue)} in ${years} years`);

  return (
    <div className="space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setMonthly(c.defaultSIP);
        setRate(12);
        setYears(10);
      }} pdfData={{
        calculatorName: "SIP Calculator",
        inputs: [
          { label: "Monthly Investment", value: fmt(monthly) },
          { label: "Expected Return", value: `${rate}% p.a.` },
          { label: "Time Period", value: `${years} years` },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Total Invested", value: fmt(result.invested) },
          { label: "Total Value", value: fmt(result.futureValue) },
          { label: "Returns", value: fmt(result.returns) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setMonthly(c.defaultSIP); }}
            accentColor="emerald"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Investment</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-32 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setMonthly(v)} />
              </div>
            </div>
            <input type="range" min={500} max={500000} step={500} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Return Rate (% p.a.)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} step={0.5} className="w-24 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setRate(v)} />
              </div>
            </div>
            <input type="range" min={1} max={30} step={0.5} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Time Period (Years)</label>
              <div className="flex items-center gap-1">
                <input type="number" value={years} onChange={(e) => setYears(Math.max(1, Number(e.target.value)))} min={1} max={40} className="w-20 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
                <VoiceInputButton onResult={(v) => setYears(v)} />
              </div>
            </div>
            <input type="range" min={1} max={40} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
            <p className="text-sm font-medium text-emerald-200">Total Value</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.futureValue)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-200">Invested</p>
                <p className="text-lg font-bold text-blue-200">{fmt(result.invested)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200">Returns</p>
                <p className="text-lg font-bold text-amber-300">{fmt(result.returns)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Growth Over Time</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#colorValue)" strokeWidth={2} name="Total Value" />
                  <Area type="monotone" dataKey="invested" stroke="#6366f1" fill="url(#colorInvested)" strokeWidth={2} name="Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      <InsightCard
        icon="📈"
        title="Investment Insight"
        color={result.returns > result.invested ? "green" : "blue"}
        insight={`By investing ${fmt(monthly)}/month, you'll build wealth of ${fmt(result.futureValue)} in ${years} years. Your total investment is ${fmt(result.invested)} — the remaining ${fmt(result.returns)} is profit from compounding.`}
        tip={`Your money grew ${result.invested > 0 ? (result.futureValue / result.invested).toFixed(1) : 0}x. ${years < 15 ? "Extending to 20+ years would amplify returns dramatically." : "Long-term SIP is the smartest wealth-building strategy."}`}
      />

      <CalculationHistory
        calculator="sip"
        onLoad={(inputs) => {
          setCurrency(getCurrencyConfig(String(inputs.currency)));
          setMonthly(Number(inputs.monthly));
          setRate(Number(inputs.rate));
          setYears(Number(inputs.years));
        }}
      />

      {CALCULATOR_CONTENT.sip && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.sip}
          calculatorName="SIP Calculator"
          dynamicExample={{
            setup: `You invest ${fmt(monthly)} every month in a mutual fund for ${years} years, expecting ${rate}% annual returns.`,
            calculation: `Over ${years} years, you put in ${fmt(monthly)} x 12 x ${years} = ${fmt(result.invested)} from your pocket. But your money doesn't just sit there — each month's investment earns returns, and those returns earn more returns. This compounding effect accelerates over time.`,
            result: `Your ${fmt(result.invested)} investment grows to ${fmt(result.futureValue)}. That's ${fmt(result.returns)} in pure returns — ${result.invested > 0 ? `a ${((result.returns / result.invested) * 100).toFixed(0)}% gain` : ""}. ${years >= 15 ? "With this long time horizon, compounding is doing the heavy lifting." : "Extending to 20+ years would amplify returns dramatically."}`,
          }}
        />
      )}
    </div>
  );
}
