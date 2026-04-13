"use client";

import { useState, useMemo, useEffect } from "react";
import VoiceInputButton from "@/components/VoiceInputButton";
import ActionButtons from "@/components/ActionButtons";
import CalculationHistory from "@/components/CalculationHistory";
import InsightCard from "@/components/InsightCard";
import { useShareableURL, useInitialParams } from "@/hooks/useShareableURL";
import { useCalcHistory } from "@/hooks/useCalcHistory";

interface TimezoneInfo {
  label: string;
  value: string;
  offset: number; // hours from UTC
  abbr: string;
  region: string;
}

const TIMEZONES: TimezoneInfo[] = [
  // Americas
  { label: "Hawaii (HST)", value: "Pacific/Honolulu", offset: -10, abbr: "HST", region: "Americas" },
  { label: "Alaska (AKST)", value: "America/Anchorage", offset: -9, abbr: "AKST", region: "Americas" },
  { label: "Pacific Time (PST)", value: "America/Los_Angeles", offset: -8, abbr: "PST", region: "Americas" },
  { label: "Mountain Time (MST)", value: "America/Denver", offset: -7, abbr: "MST", region: "Americas" },
  { label: "Central Time (CST)", value: "America/Chicago", offset: -6, abbr: "CST", region: "Americas" },
  { label: "Eastern Time (EST)", value: "America/New_York", offset: -5, abbr: "EST", region: "Americas" },
  { label: "Atlantic (AST)", value: "America/Halifax", offset: -4, abbr: "AST", region: "Americas" },
  { label: "Buenos Aires (ART)", value: "America/Argentina/Buenos_Aires", offset: -3, abbr: "ART", region: "Americas" },
  { label: "Sao Paulo (BRT)", value: "America/Sao_Paulo", offset: -3, abbr: "BRT", region: "Americas" },
  { label: "Mexico City (CST)", value: "America/Mexico_City", offset: -6, abbr: "CST", region: "Americas" },
  // Europe & Africa
  { label: "GMT / UTC", value: "Europe/London", offset: 0, abbr: "GMT", region: "Europe & Africa" },
  { label: "Central European (CET)", value: "Europe/Berlin", offset: 1, abbr: "CET", region: "Europe & Africa" },
  { label: "Paris (CET)", value: "Europe/Paris", offset: 1, abbr: "CET", region: "Europe & Africa" },
  { label: "Eastern European (EET)", value: "Europe/Bucharest", offset: 2, abbr: "EET", region: "Europe & Africa" },
  { label: "Moscow (MSK)", value: "Europe/Moscow", offset: 3, abbr: "MSK", region: "Europe & Africa" },
  { label: "Istanbul (TRT)", value: "Europe/Istanbul", offset: 3, abbr: "TRT", region: "Europe & Africa" },
  { label: "Cairo (EET)", value: "Africa/Cairo", offset: 2, abbr: "EET", region: "Europe & Africa" },
  { label: "Lagos (WAT)", value: "Africa/Lagos", offset: 1, abbr: "WAT", region: "Europe & Africa" },
  { label: "Johannesburg (SAST)", value: "Africa/Johannesburg", offset: 2, abbr: "SAST", region: "Europe & Africa" },
  // Asia
  { label: "Dubai (GST)", value: "Asia/Dubai", offset: 4, abbr: "GST", region: "Asia" },
  { label: "India (IST)", value: "Asia/Kolkata", offset: 5.5, abbr: "IST", region: "Asia" },
  { label: "Nepal (NPT)", value: "Asia/Kathmandu", offset: 5.75, abbr: "NPT", region: "Asia" },
  { label: "Bangladesh (BST)", value: "Asia/Dhaka", offset: 6, abbr: "BST", region: "Asia" },
  { label: "Bangkok (ICT)", value: "Asia/Bangkok", offset: 7, abbr: "ICT", region: "Asia" },
  { label: "Singapore (SGT)", value: "Asia/Singapore", offset: 8, abbr: "SGT", region: "Asia" },
  { label: "China (CST)", value: "Asia/Shanghai", offset: 8, abbr: "CST", region: "Asia" },
  { label: "Hong Kong (HKT)", value: "Asia/Hong_Kong", offset: 8, abbr: "HKT", region: "Asia" },
  { label: "Japan (JST)", value: "Asia/Tokyo", offset: 9, abbr: "JST", region: "Asia" },
  { label: "Korea (KST)", value: "Asia/Seoul", offset: 9, abbr: "KST", region: "Asia" },
  // Oceania
  { label: "AEST (Sydney)", value: "Australia/Sydney", offset: 10, abbr: "AEST", region: "Oceania" },
  { label: "ACST (Adelaide)", value: "Australia/Adelaide", offset: 9.5, abbr: "ACST", region: "Oceania" },
  { label: "AWST (Perth)", value: "Australia/Perth", offset: 8, abbr: "AWST", region: "Oceania" },
  { label: "New Zealand (NZST)", value: "Pacific/Auckland", offset: 12, abbr: "NZST", region: "Oceania" },
  { label: "Fiji (FJT)", value: "Pacific/Fiji", offset: 12, abbr: "FJT", region: "Oceania" },
];

const POPULAR_TZ = ["America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney", "America/Los_Angeles"];

function formatTimeInTZ(date: Date, tz: string): string {
  try {
    return date.toLocaleTimeString("en-US", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
}

function formatDateInTZ(date: Date, tz: string): string {
  try {
    return date.toLocaleDateString("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function TimeZoneConverter() {
  const { getString, getNumber } = useInitialParams();

  const [hour, setHour] = useState(getNumber("h", 12));
  const [minute, setMinute] = useState(getNumber("m", 0));
  const [fromTz, setFromTz] = useState(getString("from", "America/New_York"));
  const [toTz, setToTz] = useState(getString("to", "Asia/Kolkata"));
  const [now, setNow] = useState(new Date());

  useShareableURL({ h: hour, m: minute, from: fromTz, to: toTz });

  // Update live clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const result = useMemo(() => {
    const fromInfo = TIMEZONES.find((t) => t.value === fromTz);
    const toInfo = TIMEZONES.find((t) => t.value === toTz);
    if (!fromInfo || !toInfo) return null;

    const diff = toInfo.offset - fromInfo.offset;

    let targetHour = hour + diff;
    let dayChange = 0;

    if (targetHour >= 24) {
      targetHour -= 24;
      dayChange = 1;
    } else if (targetHour < 0) {
      targetHour += 24;
      dayChange = -1;
    }

    const targetMinute = minute;
    const targetHourInt = Math.floor(targetHour);
    const targetMinFraction = (targetHour - targetHourInt) * 60 + targetMinute;
    const finalMinute = Math.round(targetMinFraction) % 60;
    const extraHour = Math.floor(targetMinFraction / 60);
    let finalHour = targetHourInt + extraHour;

    if (finalHour >= 24) {
      finalHour -= 24;
      dayChange = 1;
    } else if (finalHour < 0) {
      finalHour += 24;
      dayChange = -1;
    }

    const formatTime = (h: number, m: number) => {
      const period = h >= 12 ? "PM" : "AM";
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
      return `${displayHour}:${String(m).padStart(2, "0")} ${period}`;
    };

    const diffSign = diff >= 0 ? "+" : "";
    const diffStr = Number.isInteger(diff) ? `${diffSign}${diff}` : `${diffSign}${diff}`;

    return {
      time: formatTime(finalHour, finalMinute),
      dayChange,
      diff,
      diffStr: `${diffStr} hours`,
      fromLabel: fromInfo.label,
      toLabel: toInfo.label,
      sourceFormatted: formatTime(hour, minute),
    };
  }, [hour, minute, fromTz, toTz]);

  useCalcHistory(
    "timezone",
    { h: hour, m: minute, from: fromTz, to: toTz },
    result ? `${result.sourceFormatted} ${result.fromLabel} = ${result.time} ${result.toLabel}` : ""
  );

  const regions = [...new Set(TIMEZONES.map((t) => t.region))];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ActionButtons
        onReset={() => {
          setHour(12);
          setMinute(0);
          setFromTz("America/New_York");
          setToTz("Asia/Kolkata");
        }}
        pdfData={{
          calculatorName: "Time Zone Converter",
          inputs: [
            { label: "Time", value: `${hour}:${String(minute).padStart(2, "0")}` },
            { label: "From", value: fromTz },
            { label: "To", value: toTz },
          ],
          results: result
            ? [
                { label: "Converted Time", value: result.time },
                { label: "Time Difference", value: result.diffStr },
                { label: "Day Change", value: result.dayChange === 1 ? "+1 day" : result.dayChange === -1 ? "-1 day" : "Same day" },
              ]
            : [],
          generatedAt: new Date().toLocaleDateString(),
          url: typeof window !== "undefined" ? window.location.href : "",
        }}
      />

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm space-y-5">
        {/* Time Input */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Time</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(Math.min(23, Math.max(0, Number(e.target.value))))}
              className="w-20 text-center text-xl font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl px-3 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <VoiceInputButton onResult={(v) => setHour(Math.min(23, Math.max(0, v)))} />
            <span className="text-2xl font-bold text-gray-400">:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => setMinute(Math.min(59, Math.max(0, Number(e.target.value))))}
              className="w-20 text-center text-xl font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700 rounded-xl px-3 py-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <VoiceInputButton onResult={(v) => setMinute(Math.min(59, Math.max(0, v)))} />
            <span className="text-sm text-gray-400 dark:text-gray-500 ml-2">(24h format)</span>
          </div>
        </div>

        {/* From Timezone */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">From Timezone</label>
          <select
            value={fromTz}
            onChange={(e) => setFromTz(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {regions.map((region) => (
              <optgroup key={region} label={region}>
                {TIMEZONES.filter((t) => t.region === region).map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => { setFromTz(toTz); setToTz(fromTz); }}
            className="p-3 min-w-[44px] min-h-[44px] rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="Swap timezones"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 rotate-90" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
          </button>
        </div>

        {/* To Timezone */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">To Timezone</label>
          <select
            value={toTz}
            onChange={(e) => setToTz(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-800 dark:text-white dark:bg-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {regions.map((region) => (
              <optgroup key={region} label={region}>
                {TIMEZONES.filter((t) => t.region === region).map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl shadow-teal-200 dark:shadow-teal-900/30 text-center">
          <p className="text-sm text-teal-100">{result.toLabel}</p>
          <p className="text-4xl sm:text-5xl font-extrabold mt-2 animate-count-up">{result.time}</p>
          {result.dayChange !== 0 && (
            <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
              {result.dayChange === 1 ? "+1 day (next day)" : "-1 day (previous day)"}
            </span>
          )}
          <p className="text-sm text-teal-200 mt-2">Time difference: {result.diffStr}</p>
        </div>
      )}

      {/* Popular Timezones - Live Clock */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3">World Clock</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {POPULAR_TZ.map((tz) => {
            const info = TIMEZONES.find((t) => t.value === tz);
            return (
              <div key={tz} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{info?.abbr || tz}</p>
                <p className="text-lg font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">{formatTimeInTZ(now, tz)}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDateInTZ(now, tz)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {result && (
        <InsightCard
          icon="🌐"
          title="Time Zone Insight"
          color="blue"
          insight={`When it's ${result.sourceFormatted} in ${result.fromLabel}, it's ${result.time} in ${result.toLabel}. The time difference is ${Math.abs(result.diff)} hours.`}
          tip={result.dayChange !== 0 ? `Note: this crosses midnight — the date changes by ${result.dayChange > 0 ? "+1" : "-1"} day.` : undefined}
        />
      )}

      <CalculationHistory
        calculator="timezone"
        onLoad={(inputs) => {
          setHour(Number(inputs.h));
          setMinute(Number(inputs.m));
          setFromTz(String(inputs.from));
          setToTz(String(inputs.to));
        }}
      />
    </div>
  );
}
