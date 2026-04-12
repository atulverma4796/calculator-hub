"use client";

import { useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";

/* ------------------------------------------------------------------ */
/*  TypeScript declarations for the Web Speech API                     */
/* ------------------------------------------------------------------ */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

/* ------------------------------------------------------------------ */
/*  Number-word parsing                                                */
/* ------------------------------------------------------------------ */

const WORD_TO_NUM: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
  eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40,
  fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const MULTIPLIERS: Record<string, number> = {
  hundred: 100,
  thousand: 1_000,
  k: 1_000,
  lakh: 100_000,
  lakhs: 100_000,
  million: 1_000_000,
  crore: 10_000_000,
  crores: 10_000_000,
  billion: 1_000_000_000,
};

/**
 * Parse a spoken string into a number.
 *
 * Handles:
 *  - Plain digits: "5000", "10.5"
 *  - Shorthand: "5k", "1.5 million", "2 lakh"
 *  - Word numbers: "five thousand", "twenty five hundred", "ten point five"
 *  - Percent suffix is stripped: "fifty percent" -> 50
 */
function parseSpokenNumber(raw: string): number | null {
  let text = raw.toLowerCase().trim();

  // Strip trailing "percent" / "per cent" — caller gets the bare number
  text = text.replace(/\s*(percent|per\s*cent|%)$/i, "").trim();

  if (!text) return null;

  // ---- 1. Try pure numeric (possibly with commas) ----
  const numericOnly = text.replace(/,/g, "");
  if (/^-?\d+(\.\d+)?$/.test(numericOnly)) {
    return parseFloat(numericOnly);
  }

  // ---- 2. Shorthand multiplier: "5k", "1.5 million", "2 lakh" ----
  const shorthandRe = /^(-?\d+(\.\d+)?)\s*(k|thousand|lakh|lakhs|million|crore|crores|billion)$/;
  const shortMatch = numericOnly.match(shorthandRe) || text.match(shorthandRe);
  if (shortMatch) {
    const base = parseFloat(shortMatch[1]);
    const mult = MULTIPLIERS[shortMatch[3]];
    if (mult !== undefined) return base * mult;
  }

  // ---- 3. Word-based number parsing ----
  // Replace "point" with "." for decimals
  const parts = text.split(/\s+point\s+/);
  const integerPart = parseWordGroup(parts[0]);
  if (integerPart === null) return null;

  if (parts.length === 2) {
    const decimalWords = parts[1].split(/\s+/);
    let decStr = "";
    for (const w of decimalWords) {
      const d = WORD_TO_NUM[w];
      if (d !== undefined) {
        decStr += d.toString();
      } else if (/^\d+$/.test(w)) {
        decStr += w;
      } else {
        return null;
      }
    }
    return parseFloat(`${integerPart}.${decStr}`);
  }

  return integerPart;
}

/** Parse a word group like "twenty five hundred" or "five thousand three hundred" */
function parseWordGroup(text: string): number | null {
  const tokens = text.trim().split(/[\s-]+/);
  let total = 0;
  let current = 0;
  let hasWord = false;

  for (const token of tokens) {
    // Pure digit token
    if (/^\d+(\.\d+)?$/.test(token)) {
      current += parseFloat(token);
      hasWord = true;
      continue;
    }

    const wordVal = WORD_TO_NUM[token];
    if (wordVal !== undefined) {
      current += wordVal;
      hasWord = true;
      continue;
    }

    const mult = MULTIPLIERS[token];
    if (mult !== undefined) {
      if (current === 0) current = 1;
      if (mult >= 1000) {
        current *= mult;
        total += current;
        current = 0;
      } else {
        // "hundred"
        current *= mult;
      }
      hasWord = true;
      continue;
    }

    // Unrecognised token — bail
    return hasWord ? total + current : null;
  }

  return hasWord ? total + current : null;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: (onResult: (value: number) => void) => void;
  stopListening: () => void;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const callbackRef = useRef<((value: number) => void) | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(
    (onResult: (value: number) => void) => {
      if (!isSupported) {
        toast.error("Voice input is not supported in this browser.");
        return;
      }

      // Stop any existing session
      stopListening();

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      callbackRef.current = onResult;
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (!transcript) {
          toast.error("Could not understand. Try again.");
          setIsListening(false);
          return;
        }

        const value = parseSpokenNumber(transcript);
        if (value !== null && !isNaN(value)) {
          callbackRef.current?.(value);
          toast.success(`Got it: ${value.toLocaleString()}`);
        } else {
          toast.error(`Couldn't parse "${transcript}" as a number.`);
        }
        setIsListening(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        recognitionRef.current = null;

        switch (event.error) {
          case "not-allowed":
            toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
            break;
          case "no-speech":
            toast.error("No speech detected. Please try again.");
            break;
          case "network":
            toast.error("Network error. Voice input requires an internet connection.");
            break;
          default:
            toast.error("Voice input error. Please try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      try {
        recognition.start();
        setIsListening(true);
        toast("Listening... speak a number", { icon: "🎤", duration: 2000 });
      } catch {
        toast.error("Could not start voice input.");
        setIsListening(false);
      }
    },
    [isSupported, stopListening],
  );

  return { isListening, isSupported, startListening, stopListening };
}
