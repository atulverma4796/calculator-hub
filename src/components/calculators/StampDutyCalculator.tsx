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

// State-wise approximate stamp duty + registration rates as of 2025-26.
// Rates change periodically — these are illustrative; users should verify
// at the state Sub-Registrar before transacting.
interface StateRate {
  name: string;
  male: number; // stamp duty % for male sole/joint with male
  female: number; // stamp duty % for female sole owner
  registration: number; // registration fee %
  registrationCap?: number; // some states cap registration fee
}

const STATE_RATES: Record<string, StateRate> = {
  maharashtra: { name: "Maharashtra", male: 6, female: 5, registration: 1, registrationCap: 30000 },
  karnataka: { name: "Karnataka", male: 5, female: 5, registration: 1 },
  "tamil-nadu": { name: "Tamil Nadu", male: 7, female: 7, registration: 4 },
  delhi: { name: "Delhi", male: 6, female: 4, registration: 1 },
  "uttar-pradesh": { name: "Uttar Pradesh", male: 7, female: 6, registration: 1 },
  "west-bengal": { name: "West Bengal", male: 6, female: 6, registration: 1 },
  gujarat: { name: "Gujarat", male: 4.9, female: 4.9, registration: 1 },
  telangana: { name: "Telangana", male: 6, female: 6, registration: 0.5 },
  rajasthan: { name: "Rajasthan", male: 6, female: 5, registration: 1 },
  punjab: { name: "Punjab", male: 5, female: 3, registration: 1 },
  haryana: { name: "Haryana", male: 7, female: 5, registration: 1 },
  "andhra-pradesh": { name: "Andhra Pradesh", male: 5, female: 5, registration: 1 },
  kerala: { name: "Kerala", male: 8, female: 8, registration: 2 },
  "madhya-pradesh": { name: "Madhya Pradesh", male: 7.5, female: 7.5, registration: 3 },
  odisha: { name: "Odisha", male: 5, female: 4, registration: 2 },
  bihar: { name: "Bihar", male: 6, female: 5.7, registration: 2 },
  chhattisgarh: { name: "Chhattisgarh", male: 5, female: 4, registration: 4 },
  jharkhand: { name: "Jharkhand", male: 4, female: 4, registration: 3 },
  assam: { name: "Assam", male: 8.25, female: 8.25, registration: 1 },
  "himachal-pradesh": { name: "Himachal Pradesh", male: 5, female: 4, registration: 2 },
  uttarakhand: { name: "Uttarakhand", male: 5, female: 3.75, registration: 2 },
};

const STATE_LIST = Object.entries(STATE_RATES).map(([slug, data]) => ({ slug, ...data }));

type Gender = "male" | "female" | "joint";

export default function StampDutyCalculator() {
  const { getNumber, getString } = useInitialParams();
  const [propertyValue, setPropertyValue] = useState(getNumber("propertyValue", 5000000));
  const [state, setState] = useState(getString("state", "maharashtra"));
  const [gender, setGender] = useState<Gender>(
    (() => {
      const g = getString("gender", "male");
      return g === "female" || g === "joint" ? g : "male";
    })(),
  );

  useShareableURL({ propertyValue, state, gender });

  const result = useMemo(() => {
    const rates = STATE_RATES[state] || STATE_RATES.maharashtra;
    let stampPct: number;
    if (gender === "female") {
      stampPct = rates.female;
    } else if (gender === "joint") {
      stampPct = (rates.male + rates.female) / 2;
    } else {
      stampPct = rates.male;
    }

    const stampDuty = (propertyValue * stampPct) / 100;
    let registration = (propertyValue * rates.registration) / 100;
    if (rates.registrationCap && registration > rates.registrationCap) {
      registration = rates.registrationCap;
    }
    const total = stampDuty + registration;
    const totalCost = propertyValue + total;

    return { stampDuty, registration, total, totalCost, stampPct, rates };
  }, [propertyValue, state, gender]);

  const fmtINR = (v: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(v));

  useCalcHistory(
    "stamp-duty",
    { propertyValue, state, gender },
    `Stamp duty + reg in ${result.rates.name}: ₹${fmtINR(result.total)}`,
  );

  return (
    <div className="space-y-8">
      <ActionButtons
        onReset={() => {
          setPropertyValue(5000000);
          setState("maharashtra");
          setGender("male");
        }}
        pdfData={{
          calculatorName: "Stamp Duty & Registration Calculator",
          inputs: [
            { label: "Property Value", value: `₹${fmtINR(propertyValue)}` },
            { label: "State", value: result.rates.name },
            { label: "Owner", value: gender === "female" ? "Female" : gender === "joint" ? "Joint (M+F)" : "Male" },
          ],
          results: [
            { label: "Stamp Duty", value: `₹${fmtINR(result.stampDuty)} (${result.stampPct}%)` },
            { label: "Registration Fee", value: `₹${fmtINR(result.registration)}` },
            { label: "Total Charges", value: `₹${fmtINR(result.total)}` },
            { label: "All-in Property Cost", value: `₹${fmtINR(result.totalCost)}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 font-medium">
            Indicative rates as of 2025-26. Some states have sub-rules (urban/rural, slab-based). Always confirm with the local Sub-Registrar before transacting.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Property Value</label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">₹</span>
                <CalcInput
                  value={propertyValue}
                  onChange={setPropertyValue}
                  min={0}
                  className="w-32 text-right text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <VoiceInputButton onResult={(v) => setPropertyValue(v)} />
              </div>
            </div>
            <input type="range" min={500000} max={100000000} step={100000} value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              <span>₹5L</span><span>₹10 Cr</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">State</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 dark:bg-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {STATE_LIST.map((s) => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Owner</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  gender === "male"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-amber-400"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  gender === "female"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-amber-400"
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setGender("joint")}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  gender === "joint"
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-amber-400"
                }`}
              >
                Joint
              </button>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
              Many states offer 1–2% lower stamp duty for sole female owners — sometimes worth structuring around.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-6 text-white shadow-xl shadow-amber-200">
            <p className="text-sm font-medium text-amber-100">Total Charges</p>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1">₹{fmtINR(result.total)}</p>
            <p className="text-xs text-amber-200 mt-1">{result.rates.name} · {gender}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-amber-100">Stamp Duty</p>
                <p className="text-lg font-bold">₹{fmtINR(result.stampDuty)}</p>
                <p className="text-[11px] text-amber-200">{result.stampPct}%</p>
              </div>
              <div>
                <p className="text-xs text-amber-100">Registration</p>
                <p className="text-lg font-bold">₹{fmtINR(result.registration)}</p>
                <p className="text-[11px] text-amber-200">{result.rates.registration}%{result.rates.registrationCap ? ` (capped)` : ""}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">All-in Cost</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Property value</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(propertyValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">+ Stamp duty</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result.stampDuty)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">+ Registration</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{fmtINR(result.registration)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total cost</span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">₹{fmtINR(result.totalCost)}</span>
            </div>
          </div>
        </div>
      </div>

      <InsightCard
        icon="🏛️"
        title="Stamp Duty Insight"
        color="blue"
        insight={`Total ${((result.total / propertyValue) * 100).toFixed(2)}% of property value (${result.stampPct}% stamp + ${result.rates.registration}% registration) goes to ${result.rates.name} government charges. On a ₹${fmtINR(propertyValue)} property, that's ₹${fmtINR(result.total)} on top of the price.`}
        tip={
          gender === "male" && result.rates.male > result.rates.female
            ? `In ${result.rates.name}, registering in your wife's name (sole) saves ${result.rates.male - result.rates.female}% — that's ₹${fmtINR(((result.rates.male - result.rates.female) * propertyValue) / 100)} on this property.`
            : "Stamp duty is paid in addition to the property price — budget for it before signing the agreement."
        }
      />

      <AffiliateCard type="investment" />

      <CalculationHistory
        calculator="stamp-duty"
        onLoad={(inputs) => {
          if (inputs.propertyValue !== undefined) setPropertyValue(Number(inputs.propertyValue));
          if (inputs.state) setState(String(inputs.state));
          if (inputs.gender) {
            const g = String(inputs.gender);
            setGender(g === "female" || g === "joint" ? (g as Gender) : "male");
          }
        }}
      />
    </div>
  );
}
