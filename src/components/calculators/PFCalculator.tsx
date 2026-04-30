"use client";

import { useState, useMemo } from "react";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import AffiliateCard from "@/components/AffiliateCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";

export default function PFCalculator() {
  const { getNumber } = useInitialParams();
  const [monthlyBasic, setMonthlyBasic] = useState(getNumber("monthlyBasic", 30000));
  const [currentAge, setCurrentAge] = useState(getNumber("currentAge", 28));
  const [retirementAge, setRetirementAge] = useState(getNumber("retirementAge", 58));
  const [currentBalance, setCurrentBalance] = useState(getNumber("currentBalance", 50000));
  const [interestRate, setInterestRate] = useState(getNumber("interestRate", 8.25));
  const [salaryGrowth, setSalaryGrowth] = useState(getNumber("salaryGrowth", 5));
  const [employeePct, setEmployeePct] = useState(getNumber("employeePct", 12));
  const [employerPct, setEmployerPct] = useState(getNumber("employerPct", 12));

  useShareableURL({
    monthlyBasic,
    currentAge,
    retirementAge,
    currentBalance,
    interestRate,
    salaryGrowth,
    employeePct,
    employerPct,
  });

  const result = useMemo(() => {
    const yearsLeft = Math.max(0, retirementAge - currentAge);
    if (yearsLeft <= 0 || monthlyBasic <= 0) {
      return {
        maturity: currentBalance,
        totalContribution: 0,
        totalInterest: 0,
        yearsLeft: 0,
      };
    }
    const r = interestRate / 100;
    const g = salaryGrowth / 100;
    const contribPct = (employeePct + employerPct) / 100;

    let balance = currentBalance;
    let basic = monthlyBasic;
    let totalContribution = 0;
    for (let y = 0; y < yearsLeft; y++) {
      const annualContribution = basic * 12 * contribPct;
      totalContribution += annualContribution;
      balance = (balance + annualContribution) * (1 + r);
      basic *= 1 + g;
    }
    const totalInterest = balance - currentBalance - totalContribution;
    return {
      maturity: balance,
      totalContribution,
      totalInterest,
      yearsLeft,
    };
  }, [
    monthlyBasic,
    currentAge,
    retirementAge,
    currentBalance,
    interestRate,
    salaryGrowth,
    employeePct,
    employerPct,
  ]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "pf",
    {
      monthlyBasic,
      currentAge,
      retirementAge,
      currentBalance,
      interestRate,
      salaryGrowth,
      employeePct,
      employerPct,
    },
    `PF Maturity at ${retirementAge}: ₹${fmtINR(result.maturity)}`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setMonthlyBasic(30000);
          setCurrentAge(28);
          setRetirementAge(58);
          setCurrentBalance(50000);
          setInterestRate(8.25);
          setSalaryGrowth(5);
          setEmployeePct(12);
          setEmployerPct(12);
        }}
        pdfData={{
          calculatorName: "EPF (PF) Calculator",
          inputs: [
            { label: "Monthly Basic", value: `₹${fmtINR(monthlyBasic)}` },
            { label: "Current Age", value: `${currentAge}` },
            { label: "Retirement Age", value: `${retirementAge}` },
            { label: "Current PF Balance", value: `₹${fmtINR(currentBalance)}` },
            { label: "Interest Rate", value: `${interestRate}%` },
            { label: "Salary Growth", value: `${salaryGrowth}%` },
            { label: "Employee Contribution", value: `${employeePct}%` },
            { label: "Employer Contribution", value: `${employerPct}%` },
          ],
          results: [
            { label: "Maturity at Retirement", value: `₹${fmtINR(result.maturity)}` },
            { label: "Total Contribution", value: `₹${fmtINR(result.totalContribution)}` },
            { label: "Total Interest", value: `₹${fmtINR(result.totalInterest)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Standard EPF: 12% from employee + 12% from employer (a portion of which goes to EPS). EPFO sets the rate yearly — currently 8.25%.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Monthly Basic Salary</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={monthlyBasic}
                  onChange={setMonthlyBasic}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setMonthlyBasic(v)} />
              </div>
            </div>
            <input type="range" min={5000} max={500000} step={1000} value={monthlyBasic} onChange={(e) => setMonthlyBasic(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹5,000</span><span>₹5,00,000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Age</label>
                <CalcInput
                  value={currentAge}
                  onChange={setCurrentAge}
                  min={18}
                  max={70}
                  className="w-20 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <input type="range" min={18} max={70} step={1} value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Retirement Age</label>
                <CalcInput
                  value={retirementAge}
                  onChange={setRetirementAge}
                  min={45}
                  max={75}
                  className="w-20 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
              <input type="range" min={45} max={75} step={1} value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current PF Balance</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={currentBalance}
                  onChange={setCurrentBalance}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setCurrentBalance(v)} />
              </div>
            </div>
            <input type="range" min={0} max={5000000} step={5000} value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interest Rate</label>
                <div className="flex items-center gap-1">
                  <CalcInput
                    value={interestRate}
                    onChange={setInterestRate}
                    min={0}
                    max={15}
                    step={0.05}
                    className="w-20 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
              <input type="range" min={5} max={12} step={0.05} value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Salary Growth</label>
                <div className="flex items-center gap-1">
                  <CalcInput
                    value={salaryGrowth}
                    onChange={setSalaryGrowth}
                    min={0}
                    max={20}
                    step={0.5}
                    className="w-20 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
              <input type="range" min={0} max={15} step={0.5} value={salaryGrowth} onChange={(e) => setSalaryGrowth(Number(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employee %</label>
                <div className="flex items-center gap-1">
                  <CalcInput
                    value={employeePct}
                    onChange={setEmployeePct}
                    min={0}
                    max={30}
                    step={0.5}
                    className="w-20 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employer %</label>
                <div className="flex items-center gap-1">
                  <CalcInput
                    value={employerPct}
                    onChange={setEmployerPct}
                    min={0}
                    max={30}
                    step={0.5}
                    className="w-20 text-right text-sm font-bold text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-200">
            <p className="text-sm font-medium text-violet-100">PF Maturity at Age {retirementAge}</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">₹{fmtINR(result.maturity)}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-violet-100">Contributed</p>
                <p className="text-lg font-bold">₹{fmtINR(result.totalContribution)}</p>
              </div>
              <div>
                <p className="text-xs text-violet-100">Interest</p>
                <p className="text-lg font-bold text-amber-300">₹{fmtINR(result.totalInterest)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Summary</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Years to retirement</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{result.yearsLeft}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Starting balance</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(currentBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total contribution</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result.totalContribution)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Interest earned</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₹{fmtINR(result.totalInterest)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Maturity</span>
              <span className="text-sm font-bold text-violet-700 dark:text-violet-400">₹{fmtINR(result.maturity)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon="💡"
        title="EPF Insight"
        color="blue"
        insight={`At retirement (age ${retirementAge}), your EPF will be worth ₹${fmtINR(result.maturity)} — ${result.totalContribution > 0 ? Math.round((result.totalInterest / result.totalContribution) * 100) : 0}% of which is interest the EPFO paid you on your savings.`}
        tip="EPF is fully tax-exempt at withdrawal if you've completed 5 years of continuous service. Voluntary Provident Fund (VPF) lets you contribute beyond 12% at the same interest rate."
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="pf"
        onLoad={(inputs) => {
          if (inputs.monthlyBasic !== undefined) setMonthlyBasic(Number(inputs.monthlyBasic));
          if (inputs.currentAge !== undefined) setCurrentAge(Number(inputs.currentAge));
          if (inputs.retirementAge !== undefined) setRetirementAge(Number(inputs.retirementAge));
          if (inputs.currentBalance !== undefined) setCurrentBalance(Number(inputs.currentBalance));
          if (inputs.interestRate !== undefined) setInterestRate(Number(inputs.interestRate));
          if (inputs.salaryGrowth !== undefined) setSalaryGrowth(Number(inputs.salaryGrowth));
          if (inputs.employeePct !== undefined) setEmployeePct(Number(inputs.employeePct));
          if (inputs.employerPct !== undefined) setEmployerPct(Number(inputs.employerPct));
        }}
      />
    </div>
  );
}
