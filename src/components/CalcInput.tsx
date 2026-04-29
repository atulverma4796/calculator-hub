"use client";

import { useState, useEffect, useRef } from "react";

interface CalcInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * A number input that allows users to freely clear and retype values.
 * Uses string state internally to avoid the "05" / can't-clear problem.
 * Syncs back to the parent's number state on every change.
 */
export default function CalcInput({ value, onChange, min, max, step, className = "" }: CalcInputProps) {
  const [display, setDisplay] = useState(String(value));
  const focused = useRef(false);

  // Sync display when parent value changes (e.g., from slider, reset, voice input)
  // but NOT while the user is actively typing in this field
  useEffect(() => {
    if (!focused.current) {
      setDisplay(String(value));
    }
  }, [value]);

  return (
    <input
      type="text"
      inputMode="decimal"
      value={display}
      onChange={(e) => {
        const raw = e.target.value;
        // Allow empty, digits, decimal point, and minus
        if (raw === "" || raw === "-" || raw === "." || /^-?\d*\.?\d*$/.test(raw)) {
          setDisplay(raw);
          const num = parseFloat(raw);
          if (!isNaN(num)) {
            onChange(num);
          } else if (raw === "" || raw === "-" || raw === ".") {
            onChange(0);
          }
        }
      }}
      onFocus={(e) => {
        focused.current = true;
        // Select all text on focus so the next keystroke replaces the existing
        // value instead of appending to it. Critical on mobile, where users
        // can't easily Cmd+A or triple-click. Defer one tick so the virtual
        // keyboard's focus handling doesn't drop the selection.
        const target = e.target;
        setTimeout(() => target.select(), 0);
      }}
      onBlur={() => {
        focused.current = false;
        // Clean up display on blur
        const num = parseFloat(display);
        if (isNaN(num) || display === "") {
          setDisplay("0");
          onChange(0);
        } else {
          setDisplay(String(num)); // removes leading zeros like "05" → "5"
        }
      }}
      min={min}
      max={max}
      step={step}
      className={className}
    />
  );
}
