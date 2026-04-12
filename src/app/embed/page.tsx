import { Metadata } from "next";
import { CALCULATORS, CALCULATOR_LIST } from "@/lib/calculators";
import CopyCodeButton from "./CopyCodeButton";

const SITE_URL = "https://thecalchub.org";

const EMBED_SLUGS = [
  "emi", "sip", "compound-interest", "gst", "percentage", "bmi",
  "age", "discount", "mortgage", "salary", "income-tax", "currency",
  "fuel", "retirement", "tip",
];

export const metadata: Metadata = {
  title: "Embed Free Calculators on Your Website",
  description:
    "Embed CalcHub calculators on your website for free. Copy-paste iframe code for EMI, SIP, mortgage, tax, BMI, and 10+ more calculators. No API key needed.",
  keywords: [
    "embed calculator", "free calculator widget", "iframe calculator",
    "embed EMI calculator", "embed SIP calculator", "embed mortgage calculator",
    "website calculator widget", "free embeddable calculator",
  ],
  alternates: { canonical: `${SITE_URL}/embed` },
  openGraph: {
    title: "Embed Free Calculators on Your Website — CalcHub",
    description:
      "Add powerful, beautiful calculators to your site with one line of code. Free forever, auto-updates, mobile responsive.",
    url: `${SITE_URL}/embed`,
  },
};

function getIframeCode(slug: string) {
  return `<iframe src="${SITE_URL}/embed/${slug}" width="100%" height="600" frameborder="0" style="border:0;border-radius:12px;" loading="lazy"></iframe>`;
}

export default function EmbedPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border-b border-indigo-100/50 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            Free Embed Widget
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            Embed Free Calculators{" "}
            <span className="text-indigo-600 dark:text-indigo-400">on Your Website</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Add powerful, beautiful calculators to your blog, portal, or app with a single line of code.
            No API key, no signup, no cost — just copy and paste.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 sm:py-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Why Embed CalcHub?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: "🆓",
                title: "Free Forever",
                desc: "No cost, no limits, no hidden fees. Use on unlimited pages.",
              },
              {
                icon: "🔄",
                title: "Auto-Updates",
                desc: "We improve calculators constantly. Your embeds update automatically.",
              },
              {
                icon: "📱",
                title: "Mobile Responsive",
                desc: "Looks great on every screen size. Adapts to your layout.",
              },
              {
                icon: "🔑",
                title: "No API Key Needed",
                desc: "Just paste the iframe code. No registration or configuration.",
              },
            ].map((b) => (
              <div
                key={b.title}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 text-center"
              >
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {b.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "1", title: "Pick a Calculator", desc: "Choose from 15 calculators below." },
              { step: "2", title: "Copy the Code", desc: "Click the copy button to grab the iframe HTML." },
              { step: "3", title: "Paste on Your Site", desc: "Add it anywhere in your HTML. Done!" },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Embed Codes */}
      <section className="py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Choose a Calculator to Embed
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 text-center">
            Click &quot;Copy Code&quot; to copy the iframe HTML to your clipboard.
          </p>

          <div className="space-y-6">
            {EMBED_SLUGS.map((slug) => {
              const calc = CALCULATORS[slug];
              if (!calc) return null;
              const code = getIframeCode(slug);

              return (
                <div
                  key={slug}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${calc.color} ${calc.colorTo} flex items-center justify-center text-lg shadow-sm`}
                      >
                        {calc.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {calc.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {calc.description}
                        </p>
                      </div>
                    </div>
                    <CopyCodeButton code={code} />
                  </div>

                  {/* Code block */}
                  <div className="relative">
                    <pre className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto font-mono whitespace-pre-wrap break-all">
                      <code>{code}</code>
                    </pre>
                  </div>

                  {/* Preview link */}
                  <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                    Preview:{" "}
                    <a
                      href={`/embed/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {SITE_URL}/embed/{slug}
                    </a>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Preview */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            Live Preview
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
            This is exactly what the embed looks like on your website.
          </p>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                your-website.com
              </span>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Your blog content goes here...
              </p>
              <iframe
                src="/embed/emi"
                width="100%"
                height="600"
                frameBorder="0"
                style={{ border: 0, borderRadius: 12 }}
                loading="lazy"
                title="CalcHub EMI Calculator Embed Preview"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                ...and your content continues below.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Is embedding really free?",
                a: "Yes, 100% free. No limits on embeds, pages, or traffic. We only ask that you keep the \"Powered by CalcHub\" credit link visible.",
              },
              {
                q: "Can I customize the height?",
                a: "Yes! Adjust the height attribute in the iframe code. We recommend 500-700px for most calculators. The width is always 100% to fit your container.",
              },
              {
                q: "Will it slow down my website?",
                a: "No. The iframe loads lazily (only when scrolled into view) and is served from a fast CDN. It won't affect your page load speed.",
              },
              {
                q: "Does it work with WordPress, Wix, Squarespace, etc.?",
                a: "Yes! Any platform that supports custom HTML or iframe blocks will work. Just paste the code in an HTML block.",
              },
              {
                q: "Do I need an API key or account?",
                a: "No. Just copy the iframe code and paste it on your site. No signup, no API key, no configuration.",
              },
            ].map((item) => (
              <div key={item.q}>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {item.q}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
