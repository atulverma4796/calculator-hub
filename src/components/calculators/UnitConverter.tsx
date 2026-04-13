"use client";

import { useState, useMemo, useCallback } from "react";
import CalcInput from "@/components/CalcInput";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

type Category = "length" | "weight" | "temperature" | "speed" | "area" | "volume" | "digital" | "time";

interface UnitDef {
  label: string;
  value: string;
  toBase: (v: number) => number;  // convert to base unit
  fromBase: (v: number) => number; // convert from base unit
}

const CATEGORIES: { key: Category; label: string; icon: string }[] = [
  { key: "length", label: "Length", icon: "📏" },
  { key: "weight", label: "Weight", icon: "⚖️" },
  { key: "temperature", label: "Temp", icon: "🌡️" },
  { key: "speed", label: "Speed", icon: "🏎️" },
  { key: "area", label: "Area", icon: "📐" },
  { key: "volume", label: "Volume", icon: "🧪" },
  { key: "digital", label: "Digital", icon: "💾" },
  { key: "time", label: "Time", icon: "⏱️" },
];

// Base units: meter, kilogram, celsius, m/s, m², liter, byte, second
const UNITS: Record<Category, UnitDef[]> = {
  length: [
    { label: "Millimeter (mm)", value: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Centimeter (cm)", value: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { label: "Meter (m)", value: "m", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilometer (km)", value: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Inch (in)", value: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    { label: "Foot (ft)", value: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { label: "Yard (yd)", value: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { label: "Mile (mi)", value: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { label: "Nautical Mile (nmi)", value: "nmi", toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
  ],
  weight: [
    { label: "Milligram (mg)", value: "mg", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
    { label: "Gram (g)", value: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Kilogram (kg)", value: "kg", toBase: (v) => v, fromBase: (v) => v },
    { label: "Ounce (oz)", value: "oz", toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
    { label: "Pound (lb)", value: "lb", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    { label: "Stone (st)", value: "st", toBase: (v) => v * 6.35029318, fromBase: (v) => v / 6.35029318 },
    { label: "Metric Ton (t)", value: "t", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { label: "Imperial Ton", value: "impTon", toBase: (v) => v * 1016.0469088, fromBase: (v) => v / 1016.0469088 },
  ],
  temperature: [
    { label: "Celsius (°C)", value: "C", toBase: (v) => v, fromBase: (v) => v },
    { label: "Fahrenheit (°F)", value: "F", toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { label: "Kelvin (K)", value: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  speed: [
    { label: "m/s", value: "ms", toBase: (v) => v, fromBase: (v) => v },
    { label: "km/h", value: "kmh", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { label: "mph", value: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { label: "Knots", value: "kn", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
    { label: "ft/s", value: "fts", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  ],
  area: [
    { label: "mm²", value: "mm2", toBase: (v) => v / 1_000_000, fromBase: (v) => v * 1_000_000 },
    { label: "cm²", value: "cm2", toBase: (v) => v / 10_000, fromBase: (v) => v * 10_000 },
    { label: "m²", value: "m2", toBase: (v) => v, fromBase: (v) => v },
    { label: "km²", value: "km2", toBase: (v) => v * 1_000_000, fromBase: (v) => v / 1_000_000 },
    { label: "in²", value: "in2", toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
    { label: "ft²", value: "ft2", toBase: (v) => v * 0.09290304, fromBase: (v) => v / 0.09290304 },
    { label: "Acre", value: "acre", toBase: (v) => v * 4046.8564224, fromBase: (v) => v / 4046.8564224 },
    { label: "Hectare (ha)", value: "ha", toBase: (v) => v * 10_000, fromBase: (v) => v / 10_000 },
  ],
  volume: [
    { label: "Milliliter (mL)", value: "ml", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { label: "Liter (L)", value: "L", toBase: (v) => v, fromBase: (v) => v },
    { label: "US Gallon", value: "galUS", toBase: (v) => v * 3.785411784, fromBase: (v) => v / 3.785411784 },
    { label: "UK Gallon", value: "galUK", toBase: (v) => v * 4.54609, fromBase: (v) => v / 4.54609 },
    { label: "Cup (US)", value: "cup", toBase: (v) => v * 0.2365882365, fromBase: (v) => v / 0.2365882365 },
    { label: "Fluid Ounce (US)", value: "floz", toBase: (v) => v * 0.0295735295625, fromBase: (v) => v / 0.0295735295625 },
    { label: "Tablespoon", value: "tbsp", toBase: (v) => v * 0.0147867647813, fromBase: (v) => v / 0.0147867647813 },
    { label: "Teaspoon", value: "tsp", toBase: (v) => v * 0.00492892159375, fromBase: (v) => v / 0.00492892159375 },
  ],
  digital: [
    { label: "Bit", value: "bit", toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    { label: "Byte", value: "B", toBase: (v) => v, fromBase: (v) => v },
    { label: "Kilobyte (KB)", value: "KB", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { label: "Megabyte (MB)", value: "MB", toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
    { label: "Gigabyte (GB)", value: "GB", toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
    { label: "Terabyte (TB)", value: "TB", toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    { label: "Petabyte (PB)", value: "PB", toBase: (v) => v * 1024 ** 5, fromBase: (v) => v / 1024 ** 5 },
  ],
  time: [
    { label: "Second", value: "s", toBase: (v) => v, fromBase: (v) => v },
    { label: "Minute", value: "min", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { label: "Hour", value: "hr", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { label: "Day", value: "day", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { label: "Week", value: "wk", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    { label: "Month (30d)", value: "mo", toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
    { label: "Year (365d)", value: "yr", toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
  ],
};

function formatResult(num: number): string {
  if (num === 0) return "0";
  const abs = Math.abs(num);
  if (abs >= 1e15 || (abs < 1e-10 && abs > 0)) {
    return num.toExponential(6);
  }
  // Use toPrecision for very small numbers
  if (abs < 0.001) return Number(num.toPrecision(6)).toString();
  // Reasonable numbers
  if (Number.isInteger(num)) return num.toLocaleString();
  // Limit decimals
  const str = num.toPrecision(10);
  return Number(str).toString();
}

export default function UnitConverter() {
  const { getString, getNumber } = useInitialParams();

  const [category, setCategory] = useState<Category>(getString("category", "length") as Category);
  const [fromUnit, setFromUnit] = useState(getString("from", "km"));
  const [toUnit, setToUnit] = useState(getString("to", "mi"));
  const [fromValue, setFromValue] = useState(getString("value", "1"));
  const [toValue, setToValue] = useState("");
  const [editingSide, setEditingSide] = useState<"from" | "to">("from");

  useShareableURL({ category, from: fromUnit, to: toUnit, value: fromValue });

  const units = UNITS[category];

  // Auto-select valid units when category changes
  const handleCategoryChange = useCallback((cat: Category) => {
    setCategory(cat);
    const catUnits = UNITS[cat];
    setFromUnit(catUnits[0]?.value || "");
    setToUnit(catUnits[1]?.value || catUnits[0]?.value || "");
    setFromValue("1");
    setToValue("");
    setEditingSide("from");
  }, []);

  // Convert
  const convertedValue = useMemo(() => {
    const fromDef = units.find((u) => u.value === fromUnit);
    const toDef = units.find((u) => u.value === toUnit);
    if (!fromDef || !toDef) return "";

    if (editingSide === "from") {
      const num = parseFloat(fromValue);
      if (isNaN(num)) return "";
      const base = fromDef.toBase(num);
      const result = toDef.fromBase(base);
      return formatResult(result);
    } else {
      const num = parseFloat(toValue);
      if (isNaN(num)) return "";
      const base = toDef.toBase(num);
      const result = fromDef.fromBase(base);
      return formatResult(result);
    }
  }, [fromValue, toValue, fromUnit, toUnit, units, editingSide]);

  // Sync display values
  const displayFrom = editingSide === "from" ? fromValue : convertedValue;
  const displayTo = editingSide === "to" ? toValue : convertedValue;

  // 1:X ratio
  const ratio = useMemo(() => {
    const fromDef = units.find((u) => u.value === fromUnit);
    const toDef = units.find((u) => u.value === toUnit);
    if (!fromDef || !toDef) return "";
    const base = fromDef.toBase(1);
    const result = toDef.fromBase(base);
    return formatResult(result);
  }, [fromUnit, toUnit, units]);

  const fromLabel = units.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = units.find((u) => u.value === toUnit)?.label || toUnit;

  useCalcHistory(
    "unit",
    { category, from: fromUnit, to: toUnit, value: fromValue },
    `${displayFrom} ${fromUnit} = ${displayTo} ${toUnit}`
  );

  const handleSwap = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(displayTo);
    setToValue(displayFrom);
    setEditingSide("from");
  }, [fromUnit, toUnit, displayFrom, displayTo]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ActionButtons
        onReset={() => {
          setCategory("length");
          setFromUnit("km");
          setToUnit("mi");
          setFromValue("1");
          setToValue("");
          setEditingSide("from");
        }}
        pdfData={{
          calculatorName: "Unit Converter",
          inputs: [
            { label: "Category", value: category },
            { label: "From", value: `${displayFrom} ${fromLabel}` },
            { label: "To", value: `${displayTo} ${toLabel}` },
          ],
          results: [
            { label: "Conversion", value: `${displayFrom} ${fromLabel} = ${displayTo} ${toLabel}` },
            { label: "Rate", value: `1 ${fromLabel} = ${ratio} ${toLabel}` },
          ],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      {/* Category Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            className={`flex-shrink-0 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
              category === cat.key
                ? "bg-sky-600 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => handleCategoryChange(cat.key)}
          >
            <span className="mr-1">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5">
        {/* From */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">From</label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <CalcInput
              value={Number(displayFrom) || 0}
              onChange={(v) => { setFromValue(String(v)); setEditingSide("from"); }}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <VoiceInputButton onResult={(v) => { setFromValue(String(v)); setEditingSide("from"); }} />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full sm:w-48 px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 min-w-[44px] min-h-[44px] rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-300 dark:hover:border-sky-600 transition-all group"
            title="Swap units"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-sky-500 rotate-90 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </button>
        </div>

        {/* To */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">To</label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <CalcInput
              value={Number(displayTo) || 0}
              onChange={(v) => { setToValue(String(v)); setEditingSide("to"); }}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-lg font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <VoiceInputButton onResult={(v) => { setToValue(String(v)); setEditingSide("to"); }} />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full sm:w-48 px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
            >
              {units.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Result Card */}
      {displayFrom && displayTo && (
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-sky-200 dark:shadow-sky-900/30 text-center">
          <p className="text-lg sm:text-xl font-bold">
            {displayFrom} {fromLabel}
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold mt-2 animate-count-up">
            = {displayTo} {toLabel}
          </p>
        </div>
      )}

      {/* Conversion Rate */}
      <InsightCard
        icon="🔄"
        title="Conversion Rate"
        color="blue"
        insight={`1 ${fromLabel} = ${ratio} ${toLabel}`}
      />

      <CalculationHistory
        calculator="unit"
        onLoad={(inputs) => {
          setCategory(String(inputs.category) as Category);
          setFromUnit(String(inputs.from));
          setToUnit(String(inputs.to));
          setFromValue(String(inputs.value));
          setEditingSide("from");
        }}
      />
    </div>
  );
}
