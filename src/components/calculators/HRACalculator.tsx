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

type CityType = "metro" | "non-metro";

export default function HRACalculator() {
  const { getNumber, getString } = useInitialParams();
  const [basicSalary, setBasicSalary] = useState(getNumber("basicSalary", 50000));
  const [hraReceived, setHraReceived] = useState(getNumber("hraReceived", 25000));
  const [rentPaid, setRentPaid] = useState(getNumber("rentPaid", 20000));
  const [cityType, setCityType] = useState<CityType>(
    (getString("cityType", "metro") as CityType) === "non-metro" ? "non-metro" : "metro",
  );
  const [taxSlab, setTaxSlab] = useState(getNumber("taxSlab", 30));

  useShareableURL({ basicSalary, hraReceived, rentPaid, cityType, taxSlab });

  const result = useMemo(() => {
    // Annualize all monthly inputs.
    const annualBasic = basicSalary * 12;
    const annualHra = hraReceived * 12;
    const annualRent = rentPaid * 12;

    // Three legal caps under Section 10(13A).
    const cap1Actual = annualHra;
    const cap2Salary = annualBasic * (cityType === "metro" ? 0.5 : 0.4);
    const cap3Rent = Math.max(annualRent - 0.1 * annualBasic, 0);

    const exemption = Math.max(0, Math.min(cap1Actual, cap2Salary, cap3Rent));
    const taxable = Math.max(0, annualHra - exemption);
    const taxSaved = exemption * (taxSlab / 100);

    // Find which cap is binding so we can explain it.
    let bindingCap: "actual" | "salary" | "rent" | "none" = "none";
    if (exemption === 0) {
      bindingCap = "rent";
    } else if (exemption === cap1Actual) {
      bindingCap = "actual";
    } else if (exemption === cap2Salary) {
      bindingCap = "salary";
    } else {
      bindingCap = "rent";
    }

    return {
      annualBasic,
      annualHra,
      annualRent,
      cap1Actual,
      cap2Salary,
      cap3Rent,
      exemption,
      taxable,
      taxSaved,
      bindingCap,
    };
  }, [basicSalary, hraReceived, rentPaid, cityType, taxSlab]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "hra",
    { basicSalary, hraReceived, rentPaid, cityType, taxSlab },
    `HRA Exempt: ₹${fmtINR(result.exemption)}/yr · Tax saved ≈ ₹${fmtINR(result.taxSaved)}`,
  );

  const bindingExplanation = (() => {
    if (result.exemption === 0) {
      return "Your rent is less than 10% of your basic salary, so no HRA exemption applies. You must pay rent above ₹" +
        fmtINR(0.1 * result.annualBasic / 12) +
        "/month to start claiming an exemption.";
    }
    switch (result.bindingCap) {
      case "actual":
        return "Your exemption is limited by the actual HRA you receive. To claim more, your employer would need to pay you a higher HRA component.";
      case "salary":
        return cityType === "metro"
          ? "Your exemption is capped at 50% of your basic salary (the metro-city rule)."
          : "Your exemption is capped at 40% of your basic salary (the non-metro rule).";
      case "rent":
        return "Your exemption is limited by 'Rent paid minus 10% of basic salary'. Higher rent (or a lower basic) would increase the exemption.";
      default:
        return "";
    }
  })();

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setBasicSalary(50000);
          setHraReceived(25000);
          setRentPaid(20000);
          setCityType("metro");
          setTaxSlab(30);
        }}
        pdfData={{
          calculatorName: "HRA Exemption Calculator",
          inputs: [
            { label: "Basic Salary (monthly)", value: `₹${fmtINR(basicSalary)}` },
            { label: "HRA Received (monthly)", value: `₹${fmtINR(hraReceived)}` },
            { label: "Rent Paid (monthly)", value: `₹${fmtINR(rentPaid)}` },
            { label: "City Type", value: cityType === "metro" ? "Metro" : "Non-metro" },
            { label: "Tax Slab", value: `${taxSlab}%` },
          ],
          results: [
            { label: "Annual HRA Exemption", value: `₹${fmtINR(result.exemption)}` },
            { label: "Taxable HRA (annual)", value: `₹${fmtINR(result.taxable)}` },
            { label: "Estimated Tax Saved", value: `₹${fmtINR(result.taxSaved)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Section 10(13A) of the Income Tax Act, 1961. All inputs are monthly amounts in INR.
          </p>

          {/* Basic Salary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Basic Salary <span className="text-gray-400 font-normal">(monthly)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={basicSalary}
                  onChange={setBasicSalary}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setBasicSalary(v)} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={500000}
              step={1000}
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹5,00,000</span>
            </div>
          </div>

          {/* HRA Received */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                HRA Received <span className="text-gray-400 font-normal">(monthly)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={hraReceived}
                  onChange={setHraReceived}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setHraReceived(v)} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={300000}
              step={500}
              value={hraReceived}
              onChange={(e) => setHraReceived(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹3,00,000</span>
            </div>
          </div>

          {/* Rent Paid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Rent Paid <span className="text-gray-400 font-normal">(monthly)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={rentPaid}
                  onChange={setRentPaid}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setRentPaid(v)} />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={300000}
              step={500}
              value={rentPaid}
              onChange={(e) => setRentPaid(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹0</span>
              <span>₹3,00,000</span>
            </div>
          </div>

          {/* City Type */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              City Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCityType("metro")}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  cityType === "metro"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-emerald-400"
                }`}
              >
                Metro <span className="text-[11px] font-normal opacity-80">(50% of basic)</span>
              </button>
              <button
                type="button"
                onClick={() => setCityType("non-metro")}
                className={`px-4 py-3 rounded-lg text-sm font-semibold border transition-colors ${
                  cityType === "non-metro"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-emerald-400"
                }`}
              >
                Non-metro <span className="text-[11px] font-normal opacity-80">(40% of basic)</span>
              </button>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              Metro = Delhi, Mumbai, Kolkata, Chennai. Everywhere else is non-metro.
            </p>
          </div>

          {/* Tax Slab */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Your Tax Slab <span className="text-gray-400 font-normal">(for tax-saved estimate)</span>
              </label>
              <div className="flex items-center gap-1">
                <CalcInput
                  value={taxSlab}
                  onChange={setTaxSlab}
                  min={0}
                  max={45}
                  step={1}
                  className="w-20 text-right text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <span className="text-xs text-gray-500">%</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={42}
              step={1}
              value={taxSlab}
              onChange={(e) => setTaxSlab(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>0%</span>
              <span>42%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200">
            <p className="text-sm font-medium text-emerald-100">Annual HRA Exemption</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">
              ₹{fmtINR(result.exemption)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-emerald-100">Taxable HRA</p>
                <p className="text-lg font-bold">₹{fmtINR(result.taxable)}</p>
              </div>
              <div>
                <p className="text-xs text-emerald-100">Tax Saved (~)</p>
                <p className="text-lg font-bold text-amber-300">₹{fmtINR(result.taxSaved)}</p>
              </div>
            </div>
          </div>

          {/* Three caps breakdown */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              The three legal caps (annual)
            </p>
            <div className={`flex justify-between items-center ${result.bindingCap === "actual" ? "font-bold text-emerald-700 dark:text-emerald-400" : ""}`}>
              <span className="text-sm text-gray-600 dark:text-gray-400">1. Actual HRA received</span>
              <span className="text-sm">₹{fmtINR(result.cap1Actual)}</span>
            </div>
            <div className={`flex justify-between items-center ${result.bindingCap === "salary" ? "font-bold text-emerald-700 dark:text-emerald-400" : ""}`}>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                2. {cityType === "metro" ? "50%" : "40%"} of basic
              </span>
              <span className="text-sm">₹{fmtINR(result.cap2Salary)}</span>
            </div>
            <div className={`flex justify-between items-center ${result.bindingCap === "rent" ? "font-bold text-emerald-700 dark:text-emerald-400" : ""}`}>
              <span className="text-sm text-gray-600 dark:text-gray-400">3. Rent − 10% of basic</span>
              <span className="text-sm">₹{fmtINR(result.cap3Rent)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Exemption = lowest of these</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                ₹{fmtINR(result.exemption)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon={result.exemption === 0 ? "⚠️" : "💡"}
        title="HRA Insight"
        color={result.exemption === 0 ? "amber" : "blue"}
        insight={bindingExplanation}
        tip={
          result.exemption > 0 && taxSlab > 0
            ? `Saves you about ₹${fmtINR(result.taxSaved)} in tax this year (at the ${taxSlab}% slab).`
            : undefined
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="hra"
        onLoad={(inputs) => {
          if (inputs.basicSalary !== undefined) setBasicSalary(Number(inputs.basicSalary));
          if (inputs.hraReceived !== undefined) setHraReceived(Number(inputs.hraReceived));
          if (inputs.rentPaid !== undefined) setRentPaid(Number(inputs.rentPaid));
          if (inputs.cityType) setCityType((inputs.cityType as CityType) === "non-metro" ? "non-metro" : "metro");
          if (inputs.taxSlab !== undefined) setTaxSlab(Number(inputs.taxSlab));
        }}
      />
    </div>
  );
}
