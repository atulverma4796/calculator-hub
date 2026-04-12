"use client";

import { useVoiceInput } from "@/hooks/useVoiceInput";

interface VoiceInputButtonProps {
  onResult: (value: number) => void;
  className?: string;
}

export default function VoiceInputButton({ onResult, className = "" }: VoiceInputButtonProps) {
  const { isListening, isSupported, startListening, stopListening } = useVoiceInput();

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onResult);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isSupported}
      title={
        !isSupported
          ? "Voice input not supported in this browser"
          : isListening
            ? "Stop listening"
            : "Speak a number"
      }
      className={`
        relative flex items-center justify-center w-8 h-8 shrink-0 rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${
          !isSupported
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
            : isListening
              ? "text-red-500 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900"
              : "text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
        }
        ${className}
      `}
      aria-label={isListening ? "Stop voice input" : "Start voice input"}
    >
      {/* Pulsing ring when listening */}
      {isListening && (
        <span className="absolute inset-0 rounded-lg animate-ping bg-red-400/30" />
      )}

      {/* Microphone SVG — 20x20 */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        {/* Mic body */}
        <rect x="9" y="1" width="6" height="12" rx="3" />
        {/* Left arc */}
        <path d="M5 10a7 7 0 0 0 14 0" />
        {/* Stand */}
        <line x1="12" y1="17" x2="12" y2="21" />
        {/* Base */}
        <line x1="8" y1="21" x2="16" y2="21" />
      </svg>
    </button>
  );
}
