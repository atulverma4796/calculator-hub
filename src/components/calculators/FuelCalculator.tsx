"use client";

import { useState, useEffect } from "react";
import { detectCurrency, getCurrencyConfig, formatAmount, CurrencyConfig } from "@/lib/currency";
import CurrencySelector from "@/components/CurrencySelector";

export default function FuelCalculator() {
  const [currency, setCurrency] = useState<CurrencyConfig>(getCurrencyConfig("USD"));
  const [distance, setDistance] = useState(500);
  const [efficiency, setEfficiency] = useState(30);
  const [fuelPrice, setFuelPrice] = useState(3.5);

  useEffect(() => {
    const detected = detectCurrency();
    setCurrency(detected);
    setFuelPrice(detected.defaultFuelPrice);
    setEfficiency(detected.fuelUnit === "mpg" ? 30 : 15);
  }, []);

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

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <CurrencySelector
          selected={currency.code}
          onChange={handleCurrencyChange}
          accentColor="orange"
        />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Distance ({distUnit})</label>
            <input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value) || 0)} className="w-28 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5" />
          </div>
          <input type="range" min={1} max={5000} step={10} value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Fuel Efficiency ({efficiencyLabel})</label>
            <input type="number" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value) || 0)} step={0.5} className="w-24 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5" />
          </div>
          <input type="range" min={1} max={currency.fuelUnit === "kmpl" ? 40 : 80} step={0.5} value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Fuel Price ({currency.symbol}/{currency.fuelUnit === "kmpl" ? "liter" : "gallon"})</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{currency.symbol}</span>
              <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value) || 0)} step={0.1} className="w-28 text-right text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5" />
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
    </div>
  );
}
