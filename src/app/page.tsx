import Link from "next/link";
import { CALCULATOR_LIST, CATEGORIES } from "@/lib/calculators";
import HeroAnimation from "@/components/HeroAnimation";
import FeedbackForm from "@/components/FeedbackForm";
import JsonLd from "@/components/JsonLd";

export default function Home() {
  return (
    <div>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "Is CalcHub free?", acceptedAnswer: { "@type": "Answer", text: "Yes, all 30+ calculators are 100% free. No signup, no premium tier, no hidden charges." }},
          { "@type": "Question", name: "Is my data safe on CalcHub?", acceptedAnswer: { "@type": "Answer", text: "All calculations happen entirely in your browser. No data is ever sent to any server." }},
          { "@type": "Question", name: "Does CalcHub support multiple currencies?", acceptedAnswer: { "@type": "Answer", text: "Yes, CalcHub auto-detects your currency from your timezone and supports 37 currencies including USD, EUR, GBP, INR, JPY, AED, SGD, CHF, KRW, and many more." }},
          { "@type": "Question", name: "How accurate are the currency exchange rates?", acceptedAnswer: { "@type": "Answer", text: "The Currency Converter uses live exchange rates from the European Central Bank (ECB) via the Frankfurter API." }},
        ],
      }} />
      {/* ── HERO — Premium with orbiting icons + rich gradient ── */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
        {/* Rich animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 via-50% to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 animate-gradient" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-cyan-200/15 dark:bg-cyan-900/10 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 rounded-full px-4 py-1.5 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold text-indigo-700">15+ Free Calculators</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-[1.15]">
                Every answer you need,{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                    before you even ask
                  </span>
                  <svg className="absolute -bottom-1 left-0 w-full h-2 text-indigo-300/40" viewBox="0 0 200 8" preserveAspectRatio="none">
                    <path d="M0 7 Q50 0 100 7 Q150 0 200 7" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                Your loan EMI. Your retirement corpus. Your tax liability.
                Beautiful charts, instant results — no signup, no limits, free forever.
              </p>

              {/* Quick access pills */}
              <div className="mt-8 flex flex-wrap gap-2">
                {CALCULATOR_LIST.slice(0, 6).map((calc) => (
                  <Link
                    key={calc.slug}
                    href={`/calculator/${calc.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md hover:border-indigo-300 hover:text-indigo-600 transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-base">{calc.icon}</span>
                    {calc.shortName}
                  </Link>
                ))}
                <Link
                  href="#all"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  +{CALCULATOR_LIST.length - 6} more →
                </Link>
              </div>
            </div>

            {/* Right — Animated visual */}
            <div className="hidden lg:flex items-center justify-center">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE — clickable, navigates to calculator ── */}
      <div className="bg-gray-900 py-3 overflow-hidden">
        <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
          {[...CALCULATOR_LIST, ...CALCULATOR_LIST].map((calc, i) => (
            <Link
              key={`${calc.slug}-${i}`}
              href={`/calculator/${calc.slug}`}
              className="flex items-center gap-2 text-sm text-gray-400 shrink-0 px-3 py-1 rounded-full hover:bg-white/10 hover:text-white transition-all"
            >
              <span>{calc.icon}</span>
              <span className="font-medium">{calc.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Calculator Categories ── */}
      <div id="calculators">
        {CATEGORIES.map((cat, catIdx) => {
          const calcs = CALCULATOR_LIST.filter((c) => c.category === cat.id);
          if (calcs.length === 0) return null;

          return (
            <section key={cat.id} id={cat.id} className={`py-14 ${catIdx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/80 dark:bg-gray-800/80"}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{cat.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{cat.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {calcs.map((calc, i) => (
                    <Link
                      key={calc.slug}
                      href={`/calculator/${calc.slug}`}
                      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 animate-scale-in"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {/* Top gradient line — appears on hover */}
                      <div className={`absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r ${calc.color} ${calc.colorTo} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />

                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${calc.color} ${calc.colorTo} flex items-center justify-center text-lg shrink-0 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                          {calc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors">
                            {calc.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                            {calc.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── All Calculators — compact grid ── */}
      <section id="all" className="py-14 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">All Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {CALCULATOR_LIST.map((calc) => (
              <Link
                key={calc.slug}
                href={`/calculator/${calc.slug}`}
                className="group bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 text-center hover:bg-white dark:hover:bg-gray-900 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="text-xl mb-1 group-hover:scale-125 transition-transform duration-200">{calc.icon}</div>
                <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors leading-tight">{calc.shortName}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feedback ── */}
      <FeedbackForm />

      {/* ── Bottom CTA ── */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Stop guessing. Start calculating.
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Accurate results. Beautiful charts. Always free.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/calculator/emi" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-indigo-50 transition-colors shadow-lg">
              EMI Calculator →
            </Link>
            <Link href="/calculator/sip" className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/20 transition-colors">
              SIP Calculator →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
