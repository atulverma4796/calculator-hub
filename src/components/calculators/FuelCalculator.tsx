"use client";

import { useState, useEffect } from "react";
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
import CalcInput from "@/components/CalcInput";

export default function FuelCalculator() {
  const { getString, getNumber, hasParams } = useInitialParams();
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig(getString("currency", "USD")));
  const [distance, setDistance] = useState(getNumber("distance", 500));
  const [efficiency, setEfficiency] = useState(getNumber("efficiency", 30));
  const [fuelPrice, setFuelPrice] = useState(getNumber("fuelPrice", 3.5));

  useEffect(() => {
    if (!hasParams) {
      const detected = detectCurrency();
      setCurrency(detected);
      setFuelPrice(detected.defaultFuelPrice);
      setEfficiency(detected.fuelUnit === "mpg" ? 30 : 15);
    }
  }, [hasParams]);

  useShareableURL({ distance, efficiency, fuelPrice, currency: currency.code });

  const handleCurrencyChange = (c: CurrencyConfig) => {
    setCurrency(c);
    setFuelPrice(c.defaultFuelPrice);
    setEfficiency(c.fuelUnit === "mpg" ? 30 : 15);
  };

  const distUnit = currency.distanceUnit;
  const fuelUnitLabel = currency.fuelUnit === "kmpl" ? "liters" : "gallons";
  const efficiencyLabel = currency.fuelUnit === "kmpl" ? "km/L" : "MPG";

  const fuelNeeded = efficiency > 0 ? distance / efficiency : 0;
  const totalCost = fuelNeeded * fuelPrice;
  const costPerUnit = distance > 0 ? totalCost / distance : 0;

  const fmt = (v: number) => formatAmount(v, currency);

  useCalcHistory("fuel", { distance, efficiency, fuelPrice, currency: currency.code }, `${distance} ${distUnit}: ${fmt(totalCost)}`);

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      <ActionButtons onReset={() => {
        const c = detectCurrency();
        handleCurrencyChange(c);
        setDistance(500);
      }} pdfData={{
        calculatorName: "Fuel Cost Calculator",
        inputs: [
          { label: "Distance", value: `${distance} ${distUnit}` },
          { label: "Efficiency", value: `${efficiency} ${efficiencyLabel}` },
          { label: "Fuel Price", value: fmt(fuelPrice) },
        ],
        results: [
          { label: "Fuel Needed", value: `${fuelNeeded.toFixed(1)} ${fuelUnitLabel}` },
          { label: "Total Cost", value: fmt(totalCost) },
          { label: `Cost per ${distUnit}`, value: fmt(costPerUnit) },
        ],
        generatedAt: new Date().toLocaleDateString(),
        url: typeof window !== "undefined" ? window.location.href : "",
      }} />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={handleCurrencyChange}
          accentColor="orange"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Distance ({distUnit})</label>
            <div className="flex items-center gap-1">
              <CalcInput value={distance} onChange={setDistance} className="w-28 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5" />
              <VoiceInputButton onResult={(v) => setDistance(v)} />
            </div>
          </div>
          <input type="range" min={1} max={5000} step={10} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fuel Efficiency ({efficiencyLabel})</label>
            <div className="flex items-center gap-1">
              <CalcInput value={efficiency} onChange={setEfficiency} step={0.5} className="w-24 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5" />
              <VoiceInputButton onResult={(v) => setEfficiency(v)} />
            </div>
          </div>
          <input type="range" min={1} max={currency.fuelUnit === "kmpl" ? 40 : 80} step={0.5} value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fuel Price ({currency.symbol}/{currency.fuelUnit === "kmpl" ? "liter" : "gallon"})</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400 dark:text-gray-500">{currency.symbol}</span>
              <CalcInput value={fuelPrice} onChange={setFuelPrice} step={0.1} className="w-28 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5" />
              <VoiceInputButton onResult={(v) => setFuelPrice(v)} />
            </div>
          </div>
          <input type="range" min={0.5} max={currency.fuelUnit === "kmpl" ? 200 : 10} step={0.1} value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} className="w-full" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl shadow-orange-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-orange-100">Fuel Needed</p>
            <p className="text-2xl font-extrabold animate-count-up">{fuelNeeded.toFixed(1)}</p>
            <p className="text-xs text-orange-200">{fuelUnitLabel}</p>
          </div>
          <div>
            <p className="text-xs text-orange-100">Total Cost</p>
            <p className="text-2xl font-extrabold text-amber-300 animate-count-up">{fmt(totalCost)}</p>
          </div>
          <div>
            <p className="text-xs text-orange-100">Cost per {distUnit}</p>
            <p className="text-2xl font-extrabold animate-count-up">{fmt(costPerUnit)}</p>
          </div>
        </div>
      </div>


      <InsightCard
        icon="⛽"
        title="Trip Cost Insight"
        color="blue"
        insight={`${distance} ${distUnit} trip needs ${fuelNeeded.toFixed(1)} ${fuelUnitLabel} of fuel, costing ${fmt(totalCost)} (${fmt(costPerUnit)} per ${distUnit}).`}
        tip={distance > 500 ? "For long trips, even a small improvement in fuel efficiency saves a lot." : undefined}
      />

      <CalculationHistory
        calculator="fuel"
        onLoad={(inputs) => {
          handleCurrencyChange(getCurrencyConfig(String(inputs.currency)));
          setDistance(Number(inputs.distance));
          setEfficiency(Number(inputs.efficiency));
          setFuelPrice(Number(inputs.fuelPrice));
        }}
      />

      {CALCULATOR_CONTENT.fuel && (
        <CalculatorEducation
          data={CALCULATOR_CONTENT.fuel}
          calculatorName="Fuel Cost Calculator"
          dynamicExample={{
            setup: `You're planning a ${distance} ${distUnit} trip. Your vehicle does ${efficiency} ${efficiencyLabel} and fuel costs ${fmt(fuelPrice)} per ${currency.fuelUnit === "kmpl" ? "liter" : "gallon"}.`,
            calculation: `Fuel needed = ${distance} ${distUnit} / ${efficiency} ${efficiencyLabel} = ${fuelNeeded.toFixed(1)} ${fuelUnitLabel}. Total cost = ${fuelNeeded.toFixed(1)} x ${fmt(fuelPrice)} = ${fmt(totalCost)}.`,
            result: `Your trip will need ${fuelNeeded.toFixed(1)} ${fuelUnitLabel} of fuel, costing ${fmt(totalCost)}. That's ${fmt(costPerUnit)} per ${distUnit}. ${distance > 500 ? "For a long trip like this, even a small improvement in fuel efficiency makes a big difference." : ""}`,
          }}
        />
      )}
    </div>
  );
}
