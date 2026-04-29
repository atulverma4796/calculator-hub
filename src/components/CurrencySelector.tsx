"use client";

import { useState, useRef, useEffect } from "react";
import { ALL_CURRENCIES, CurrencyConfig } from "@/lib/currency";

interface CurrencySelectorProps {
  selected: string;
  onChange: (config: CurrencyConfig) => void;
  accentColor?: string;
}

// Popular currencies shown as quick-access buttons
const POPULAR_CODES = ["USD", "INR", "EUR", "GBP", "AED", "CAD", "AUD", "JPY"];

export default function CurrencySelector({ selected, onChange, accentColor = "indigo" }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const borderActive = `border-${accentColor}-500`;
  const bgActive = `bg-${accentColor}-50`;
  const textActive = `text-${accentColor}-700`;

  const popularCurrencies = ALL_CURRENCIES.filter((c) => POPULAR_CODES.includes(c.code));
  const selectedConfig = ALL_CURRENCIES.find((c) => c.code === selected);

  // Filter for dropdown
  const filtered = ALL_CURRENCIES.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSelect = (c: CurrencyConfig) => {
    onChange(c);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="space-y-2">
      {/* Quick-access popular currencies */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {popularCurrencies.map((c) => (
          <button
            key={c.code}
            type="button"
            onClick={() => handleSelect(c)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
              selected === c.code
                ? `${borderActive} ${bgActive} ${textActive}`
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {c.symbol} {c.code}
          </button>
        ))}

        {/* More currencies dropdown trigger */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
              !POPULAR_CODES.includes(selected)
                ? `${borderActive} ${bgActive} ${textActive}`
                : "border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400"
            }`}
          >
            {!POPULAR_CODES.includes(selected) && selectedConfig
              ? `${selectedConfig.symbol} ${selectedConfig.code}`
              : `+${ALL_CURRENCIES.length - POPULAR_CODES.length} more`}
            <svg className={`w-3 h-3 inline-block ml-1 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Search */}
              <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  placeholder="Search currency..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Currency list */}
              <div className="max-h-56 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 text-center">No currency found</p>
                ) : (
                  filtered.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleSelect(c)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selected === c.code ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span className="w-8 text-center font-medium text-gray-500 dark:text-gray-400">{c.symbol}</span>
                      <span className="font-semibold">{c.code}</span>
                      <span className="text-xs text-gray-400 truncate">{c.name}</span>
                      {selected === c.code && (
                        <svg className="w-4 h-4 ml-auto text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
