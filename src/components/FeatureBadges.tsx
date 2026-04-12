"use client";

const BADGES = [
  { icon: "🌙", label: "Dark Mode" },
  { icon: "🎤", label: "Voice Input" },
  { icon: "📥", label: "PDF & CSV" },
  { icon: "🔗", label: "Shareable Link" },
  { icon: "⚖️", label: "Compare Mode" },
  { icon: "📴", label: "Works Offline" },
  { icon: "🌍", label: "37 Currencies" },
];

export default function FeatureBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {BADGES.map((b) => (
        <span
          key={b.label}
          className="inline-flex items-center gap-1 text-[10px] font-medium bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-full px-2.5 py-1 text-gray-600 dark:text-gray-400"
        >
          <span className="text-xs">{b.icon}</span>
          {b.label}
        </span>
      ))}
    </div>
  );
}
