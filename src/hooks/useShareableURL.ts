"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

/**
 * Hook to sync calculator state with URL query params.
 * - On mount, reads params from URL and returns them
 * - On state change, debounces writing params back to URL (500ms)
 * - Uses router.replace to avoid polluting browser history
 */
export function useShareableURL(params: Record<string, string | number | undefined>) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  // Debounced URL update — skip on first render to avoid overwriting URL params
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const sp = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          sp.set(key, String(value));
        }
      }
      const qs = sp.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.values(params).join(",")]);
}

/**
 * Read initial values from URL search params.
 * Returns a getter function that reads a param with type coercion.
 */
export function useInitialParams() {
  const searchParams = useSearchParams();

  const getString = useCallback((key: string, fallback: string): string => {
    return searchParams.get(key) ?? fallback;
  }, [searchParams]);

  const getNumber = useCallback((key: string, fallback: number): number => {
    const val = searchParams.get(key);
    if (val === null) return fallback;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  }, [searchParams]);

  const hasParams = searchParams.toString().length > 0;

  return { getString, getNumber, hasParams };
}
