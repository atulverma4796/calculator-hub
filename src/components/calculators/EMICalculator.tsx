"use client";

import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig, CURRENCY_CODES } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function EMICalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [amount, setAmount] = useState(300000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [showTable, setShowTable] = useState(false);

  // Auto-detect user's currency on mount
  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setAmount(detected.defaultLoan);
  }, []);
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Currency selector */}
          <CurrencySelector
            selected={currency.code}
            onChange={(c) => { setCurrency(c); setAmount(c.defaultLoan); }}
          />

          {/* Loan Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Amount</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">{currency.symbol}</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-32 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{currency.symbol}10K</span>
              <span>{currency.symbol}5Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Interest Rate (% p.a.)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                step={0.1}
                min={0.1}
                max={30}
                className="w-24 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
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
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value) || 1)}
                  min={1}
                  max={tenureType === "years" ? 30 : 360}
                  className="w-20 text-right text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => { setTenureType("years"); setTenure(Math.min(tenure, 30)); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      tenureType === "years" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
                    }`}
                  >
                    Years
                  </button>
                  <button
                    type="button"
                    onClick={() => { setTenureType("months"); setTenure(Math.min(tenure * 12, 360)); }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      tenureType === "months" ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500"
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
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
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
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-700 mb-4">Payment Breakdown</p>
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
                <span className="text-xs text-gray-600">Principal ({Math.round((amount / result.totalPayment) * 100)}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-gray-600">Interest ({Math.round((result.totalInterest / result.totalPayment) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowTable(!showTable)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-all"
        >
          <svg className={`w-4 h-4 transition-transform ${showTable ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          {showTable ? "Hide" : "Show"} Month-by-Month Breakdown
        </button>
      </div>

      {/* Amortization Table */}
      {showTable && result.schedule.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-700">Amortization Schedule</h3>
            <p className="text-xs text-gray-500 mt-0.5">{result.schedule.length} monthly payments</p>
          </div>
          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Month</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Principal</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Interest</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.schedule.map((row) => (
                  <tr key={row.month} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-4 py-2.5 text-gray-700 font-medium">{row.month}</td>
                    <td className="px-4 py-2.5 text-right text-green-700 font-medium">{fmt(row.principal)}</td>
                    <td className="px-4 py-2.5 text-right text-amber-700">{fmt(row.interest)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-600">{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
