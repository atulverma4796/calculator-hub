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
 *
 * Mobile UX: on focus, the field is cleared visually so the user can
 * type a fresh value without fighting an existing default like "1000".
 * If they tap away without typing anything, the previous value is
 * restored. (Programmatic `select()` is unreliable on mobile browsers
 * during the touch-focus → virtual-keyboard sequence — clearing the
 * input is the robust alternative.)
 */
export default function CalcInput({ value, onChange, min, max, step, className = "" }: CalcInputProps) {
  const [display, setDisplay] = useState(String(value));
  const focused = useRef(false);
  // Snapshot of the display value at focus time, so we can restore it
  // if the user taps away without typing.
  const valueAtFocus = useRef("");

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
          }
          // If raw is empty/incomplete, leave the parent value untouched
          // so we can restore it on blur if the user tapped away.
        }
      }}
      onFocus={() => {
        focused.current = true;
        valueAtFocus.current = display;
        // Clear the field so a typed value replaces — does not append to —
        // any existing default. Works reliably across mobile browsers.
        setDisplay("");
      }}
      onBlur={() => {
        focused.current = false;
        const trimmed = display.trim();
        if (trimmed === "" || trimmed === "-" || trimmed === ".") {
          // User tapped away without typing a valid value — restore the
          // value that was there before focus.
          setDisplay(valueAtFocus.current);
          return;
        }
        const num = parseFloat(trimmed);
        if (isNaN(num)) {
          setDisplay(valueAtFocus.current);
        } else {
          setDisplay(String(num)); // removes leading zeros like "05" → "5"
          onChange(num);
        }
      }}
      min={min}
      max={max}
      step={step}
      className={className}
    />
  );
}
