"use client";

import { useState, useEffect, useCallback } from "react";

interface SpeakResultButtonProps {
  text: string;
}

export default function SpeakResultButton({ text }: SpeakResultButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  // Sync state if speech ends externally (e.g., another utterance, or natural end)
  useEffect(() => {
    if (!isSupported) return;

    const handleEnd = () => setIsSpeaking(false);
    // Poll because speechSynthesis events can be unreliable across browsers
    const interval = setInterval(() => {
      if (!window.speechSynthesis.speaking && isSpeaking) {
        setIsSpeaking(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isSupported, isSpeaking]);

  const handleSpeak = useCallback(() => {
    if (!isSupported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to pick a good English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Google")
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [isSupported, isSpeaking, text]);

  return (
    <button
      type="button"
      onClick={handleSpeak}
      disabled={!isSupported || !text}
      title={
        !isSupported
          ? "Voice narration not supported in this browser"
          : isSpeaking
            ? "Stop narration"
            : "Read result aloud"
      }
      className={`
        relative inline-flex items-center justify-center w-9 h-9 rounded-xl
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${
          !isSupported || !text
            ? "text-gray-300 dark:text-gray-600 cursor-not-allowed bg-gray-50 dark:bg-gray-900"
            : isSpeaking
              ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 shadow-sm"
              : "text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
        }
      `}
      aria-label={isSpeaking ? "Stop narration" : "Read result aloud"}
    >
      {/* Pulsing ring while speaking */}
      {isSpeaking && (
        <span className="absolute inset-0 rounded-xl animate-ping bg-indigo-400/20" />
      )}

      {isSpeaking ? (
        /* Stop icon */
        <svg
          className="relative z-10 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        /* Speaker icon */
        <svg
          className="relative z-10 w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 010 7.07" />
          <path d="M19.07 4.93a10 10 0 010 14.14" />
        </svg>
      )}
    </button>
  );
}
