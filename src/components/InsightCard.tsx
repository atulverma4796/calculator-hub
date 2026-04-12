"use client";

interface InsightCardProps {
  icon: string;
  title: string;
  insight: string;
  tip?: string;
  color: "blue" | "green" | "amber" | "red";
}

const colorMap = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "bg-blue-100 text-blue-600", title: "text-blue-900", text: "text-blue-800", tip: "text-blue-600 bg-blue-100" },
  green: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "bg-emerald-100 text-emerald-600", title: "text-emerald-900", text: "text-emerald-800", tip: "text-emerald-600 bg-emerald-100" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "bg-amber-100 text-amber-600", title: "text-amber-900", text: "text-amber-800", tip: "text-amber-600 bg-amber-100" },
  red: { bg: "bg-red-50", border: "border-red-200", icon: "bg-red-100 text-red-600", title: "text-red-900", text: "text-red-800", tip: "text-red-600 bg-red-100" },
};

export default function InsightCard({ icon, title, insight, tip, color }: InsightCardProps) {
  const c = colorMap[color];
  return (
    <div className={`calc-extra ${c.bg} border ${c.border} rounded-2xl p-5 sm:p-6`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center text-lg shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-bold ${c.title} mb-1`}>{title}</h3>
          <p className={`text-sm ${c.text} leading-relaxed`}>{insight}</p>
          {tip && (
            <p className={`text-xs ${c.tip} rounded-lg px-3 py-2 mt-3 inline-block font-medium`}>
              💡 {tip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
