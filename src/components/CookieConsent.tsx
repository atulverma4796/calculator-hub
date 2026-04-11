"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "calchub_cookie_consent";

type ConsentValue = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentValue;
      if (stored !== "accepted" && stored !== "rejected") {
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch { /* ignore */ }
    setVisible(false);
    if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
      });
    }
  }

  function reject() {
    try {
      localStorage.setItem(STORAGE_KEY, "rejected");
    } catch { /* ignore */ }
    setVisible(false);
    if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
      });
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:bottom-6 sm:max-w-md z-[60]"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              <circle cx="9" cy="11" r="1" fill="currentColor" />
              <circle cx="14" cy="14" r="1" fill="currentColor" />
              <circle cx="16" cy="9" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="cookie-title" className="text-sm font-bold text-gray-900 mb-1">
              We value your privacy
            </h3>
            <p id="cookie-description" className="text-xs text-gray-600 leading-relaxed">
              We use cookies for analytics and to improve CalcHub. Your calculation data stays in
              your browser — we never store it.{" "}
              <a href="/privacy" className="text-indigo-600 hover:underline">
                Read more
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={accept}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={reject}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
