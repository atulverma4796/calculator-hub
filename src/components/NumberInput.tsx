"use client";

import { useId, useState, useRef, useEffect } from "react";

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
 * - Mobile UX: clears the field on focus so a typed value replaces (not
 *   appends to) the existing default. Restores the prior value if the
 *   user taps away without typing.
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
  const [display, setDisplay] = useState(String(value));
  const focused = useRef(false);
  const valueAtFocus = useRef("");

  useEffect(() => {
    if (!focused.current) {
      setDisplay(String(value));
    }
  }, [value]);

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
          type="text"
          inputMode="decimal"
          aria-label={label}
          value={display}
          onChange={(e) => {
            // Strip everything except digits, decimal point, and minus sign
            const raw = e.target.value.replace(/[^\d.\-]/g, "");
            setDisplay(raw);
            if (raw === "" || raw === "-" || raw === ".") return;
            const parsed = parseFloat(raw);
            if (!isNaN(parsed)) onChange(parsed);
          }}
          onFocus={() => {
            focused.current = true;
            valueAtFocus.current = display;
            setDisplay("");
          }}
          onBlur={() => {
            focused.current = false;
            const trimmed = display.trim();
            if (trimmed === "" || trimmed === "-" || trimmed === ".") {
              setDisplay(valueAtFocus.current);
              return;
            }
            const parsed = parseFloat(trimmed);
            if (isNaN(parsed)) {
              setDisplay(valueAtFocus.current);
            } else {
              setDisplay(String(parsed));
              onChange(parsed);
            }
          }}
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
