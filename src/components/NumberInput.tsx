"use client";

import { useId } from "react";

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string; // e.g., "$" or "₹"
  suffix?: string; // e.g., "%" or "years"
}

/**
 * Accessible number input with mobile numeric keyboard support.
 * - `inputMode="decimal"` triggers the numeric keypad on mobile devices
 * - Proper `aria-label` derived from the label prop
 * - Strips non-numeric characters on input
 * - Dark mode support
 * - Optional prefix/suffix display
 */
export default function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix,
  suffix,
}: NumberInputProps) {
  const id = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip everything except digits, decimal point, and minus sign
    const raw = e.target.value.replace(/[^\d.\-]/g, "");
    if (raw === "" || raw === "-") {
      onChange(0);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-sm text-gray-500 dark:text-gray-400 pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          aria-label={label}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          className={[
            "w-full rounded-xl border border-gray-200 dark:border-gray-700",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
            "text-sm py-2.5 outline-none transition-all",
            "focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            prefix ? "pl-8" : "pl-3",
            suffix ? "pr-12" : "pr-3",
          ].join(" ")}
        />
        {suffix && (
          <span className="absolute right-3 text-sm text-gray-500 dark:text-gray-400 pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
