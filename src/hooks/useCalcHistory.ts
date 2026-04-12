"use client";

import { useEffect, useRef } from "react";
import { addToHistory } from "@/lib/calculationHistory";

/**
 * Debounced history save — only saves after 2 seconds of no changes.
 */
export function useCalcHistory(
  calculator: string,
  inputs: Record<string, string | number>,
  result: string,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip first render (initial defaults)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!result || result === "0" || result === "$0") return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      addToHistory({ calculator, inputs, result });
    }, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);
}
