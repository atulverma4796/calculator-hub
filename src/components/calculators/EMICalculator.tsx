"use client";

import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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

export default function EMICalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [amount, setAmount] = useState(getNumber("amount", 300000));
  const [rate, setRate] = useState(getNumber("rate", 8.5));
  const [tenure, setTenure] = useState(getNumber("tenure", 20));
  const [tenureType, setTenureType] = useState<"years" | "months">(getString("tenureType", "years") as "years" | "months");
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setAmount(detected.defaultLoan);
    }
  }, [hasParams]);

  useShareableURL({ amount, rate, tenure, tenureType, currency: currency.code });
  const months = tenureType === "years" ? tenure * 12 : tenure;
  const monthlyRate = rate / 12 / 100;

  const result = useMemo(() => {
    if (amount <= 0 || rate <= 0 || months <= 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }

    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - amount;

    // Amortization schedule
    let balance = amount;
    const schedule: { month: number; principal: number; interest: number; balance: number; totalPaid: number }[] = [];

    for (let i = 1; i <= months; i++) {
      const interestPart = balance * monthlyRate;
      const principalPart = emi - interestPart;
      balance -= principalPart;

      schedule.push({
        month: i,
        principal: Math.round(principalPart),
        interest: Math.round(interestPart),
        balance: Math.max(0, Math.round(balance)),
        totalPaid: Math.round(emi * i),
      });
    }

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      schedule,
    };
  }, [amount, rate, months, monthlyRate]);

  const pieData = [
    { name: "Principal", value: amount, color: "#6366f1" },
    { name: "Interest", value: result.totalInterest, color: "#f59e0b" },
  ];

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("emi", { amount, rate, tenure, tenureType, currency: currency.code }, `EMI: ${fmt(result.emi)}/mo — Total: ${fmt(result.totalPayment)}`);

  return (
    <div className="space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        setCurrency(c);
        setAmount(c.defaultLoan);
        setRate(8.5);
        setTenure(20);
        setTenureType("years");
      }} pdfData={{
        calculatorName: "EMI Calculator",
        inputs: [
          { label: "Loan Amount", value: fmt(amount) },
          { label: "Interest Rate", value: `${rate}% p.a.` },
          { label: "Tenure", value: `${tenure} ${tenureType}` },
          { label: "Currency", value: currency.code },
        ],
        results: [
          { label: "Monthly EMI", value: fmt(result.emi) },
          { label: "Total Interest", value: fmt(result.totalInterest) },
          { label: "Total Payment", value: fmt(result.totalPayment) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Currency selector */}
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setAmount(c.defaultLoan); }}
          />

          {/* Loan Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setAmount(v)} />
              </div>
            </div>
            <input
              type="range"
              min={10000}
              max={50000000}
              step={10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>{formatAmount(10000, currency)}</span>
              <span>{formatAmount(50000000, currency)}</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                step={0.1}
                min={0.1}
                max={30}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <VoiceInputButton onResult={(v) => setRate(v)} />
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Loan Tenure</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  min={1}
                  max={tenureType === "years" ? 30 : 360}
                  className="w-20 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setTenure(v)} />
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => { setTenureType("years"); setTenure(Math.min(tenure, 30)); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      tenureType === "years" ? "bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTenureType("months"); setTenure(Math.min(tenure * 12, 360)); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      tenureType === "months" ? "bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 shadow-sm" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    Months
                  </button>
                </div>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={tenureType === "years" ? 30 : 360}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>1 {tenureType === "years" ? "Year" : "Month"}</span>
              <span>{tenureType === "years" ? "30 Years" : "360 Months"}</span>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* EMI Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
            <p className="text-sm font-medium text-indigo-200">Monthly EMI</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 animate-count-up">{fmt(result.emi)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-indigo-200">Total Interest</p>
                <p className="text-lg font-bold text-amber-300">{fmt(result.totalInterest)}</p>
              </div>
              <div>
                <p className="text-xs text-indigo-200">Total Payment</p>
                <p className="text-lg font-bold">{fmt(result.totalPayment)}</p>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Payment Breakdown</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => fmt(Number(value))}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Principal ({Math.round((amount / result.totalPayment) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Interest ({Math.round((result.totalInterest / result.totalPayment) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={result.totalInterest > amount ? "⚠️" : "💡"}
        title="Loan Insight"
        color={result.totalInterest > amount ? "red" : result.totalInterest > amount * 0.5 ? "amber" : "green"}
        insight={`You're borrowing ${fmt(amount)} and will pay back ${fmt(result.totalPayment)} over ${tenureType === "years" ? `${tenure} years` : `${tenure} months`}. That means ${fmt(result.totalInterest)} goes to the bank as interest${result.totalInterest > amount ? " — more than the loan itself!" : "."}`}
        tip={result.totalInterest > amount ? `Reducing your tenure to ${Math.max(5, tenure - 5)} years would save significantly on interest.` : undefined}
      />

      <CalculationHistory calculator="emi" onLoad={(inputs) => {
        if (inputs.currency) setCurrency(getCurrencyConfig(String(inputs.currency)));
        if (inputs.amount) setAmount(Number(inputs.amount));
        if (inputs.rate) setRate(Number(inputs.rate));
        if (inputs.tenure) setTenure(Number(inputs.tenure));
        if (inputs.tenureType) setTenureType(inputs.tenureType as "years" | "months");
      }} />

      {/* Amortization Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
        >
          <svg className={`w-4 h-4 transition-transform ${showTable ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          {showTable ? "Hide" : "Show"} Month-by-Month Breakdown
        </button>
      </div>

      {/* Amortization Table */}
      {showTable && result.schedule.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">Amortization Schedule</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{result.schedule.length} monthly payments</p>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Month</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">EMI</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Principal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Interest</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {result.schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-indigo-50/50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300 font-medium">{row.month}</td>
                    <td className="px-4 py-2.5 text-right text-indigo-700 dark:text-indigo-400 font-bold">{fmt(result.emi)}</td>
                    <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-400 font-medium">{fmt(row.principal)}</td>
                    <td className="px-4 py-2.5 text-right text-amber-700 dark:text-amber-400">{fmt(row.interest)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600 dark:text-gray-400">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Educational Content with LIVE example from user's inputs */}
      {CALCULATOR_CONTENT.emi && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.emi}
          calculatorName="EMI Calculator"
          dynamicExample={{
            setup: `You take a loan of ${fmt(amount)} at ${rate}% annual interest for ${tenureType === "years" ? `${tenure} years` : `${tenure} months`}.`,
            calculation: `The bank splits your ${fmt(amount)} loan into ${months} equal monthly payments. Each payment covers principal repayment plus interest on the remaining balance. In the early months, most of your EMI goes toward interest. Over time, more goes toward paying off the actual loan.`,
            result: `Your monthly EMI is ${fmt(result.emi)}. Over ${tenureType === "years" ? `${tenure} years` : `${tenure} months`}, you'll pay a total of ${fmt(result.totalPayment)} — meaning ${fmt(result.totalInterest)} is pure interest. ${result.totalInterest > amount ? "That's more than the original loan amount! Consider a shorter tenure or lower rate to save on interest." : ""}`,
          }}
        />
      )}
    </div>
  );
}
