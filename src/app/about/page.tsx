import { Metadata } from "next";
import Link from "next/link";
import { CALCULATOR_LIST, CATEGORIES } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "About CalcHub",
  description: "CalcHub provides 30+ free online calculators for finance, math, health, and utility. No signup, no limits, beautiful results.",
  alternates: { canonical: "https://calculatorhub.org/about" },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">About CalcHub</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Free online calculators for everyone, everywhere.</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Our Mission</h2>
          <p>
            CalcHub provides free, beautiful, and accurate online calculators that anyone can use without
            signup, payment, or limits. We believe essential tools like EMI calculators, tax estimators,
            and health calculators should be accessible to everyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">What Makes CalcHub Different</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>100% Free:</strong> No premium tier, no paywalls, no hidden charges. Every feature is free.</li>
            <li><strong>No Signup:</strong> Use any calculator instantly. No account, no email, no phone number required.</li>
            <li><strong>Privacy First:</strong> All calculations run in your browser. Your data never leaves your device.</li>
            <li><strong>Multi-Currency:</strong> Auto-detects your currency from your timezone. Supports 9 currencies.</li>
            <li><strong>Beautiful UI:</strong> Modern, responsive design with interactive charts and sliders.</li>
            <li><strong>Mobile-First:</strong> Every calculator works perfectly on phones and tablets.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Our Calculators</h2>
          <div className="space-y-4 mt-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{cat.icon} {cat.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CALCULATOR_LIST.filter((c) => c.category === cat.id).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/calculator/${c.slug}`}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      {c.icon} {c.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Feedback</h2>
          <p>
            Have an idea, found a bug, or want to suggest a feature? Use our{" "}
            <Link href="/#feedback" className="text-indigo-600 hover:underline">feedback form</Link>{" "}
            — it goes straight to the developer. We read every message.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">&larr; Back to Calculators</Link>
      </div>
    </div>
  );
}
