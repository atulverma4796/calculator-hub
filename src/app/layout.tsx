import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CALCULATOR_LIST } from "@/lib/calculators";
import JsonLd from "@/components/JsonLd";
import ToastProvider from "@/components/ToastProvider";
import MobileMenu from "@/components/MobileMenu";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import ThemeToggle from "@/components/ThemeToggle";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import HideOnEmbed from "@/components/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://calculatorhub.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Online Calculators — EMI, SIP, Tax, Loan, Mortgage | CalcHub",
    template: "%s | CalcHub — Free Online Calculators",
  },
  description:
    "Free online calculators for EMI, SIP, compound interest, mortgage, GST, income tax, BMI, percentage, and more. Beautiful charts, downloadable PDF results. No signup.",
  keywords: [
    "online calculator", "free online calculator", "free calculator online",
    "EMI calculator", "SIP calculator", "loan calculator", "mortgage calculator",
    "compound interest calculator", "GST calculator", "income tax calculator",
    "BMI calculator", "percentage calculator", "scientific calculator online",
    "financial calculator", "salary calculator", "age calculator", "tip calculator",
    "currency converter", "discount calculator", "fuel cost calculator",
    "retirement calculator", "calculator no signup", "home loan calculator",
    "car loan EMI", "mutual fund calculator", "401k calculator", "pension calculator",
    "calorie calculator", "TDEE calculator", "pregnancy due date calculator",
    "body fat calculator", "water intake calculator", "heart rate zone calculator",
    "GPA calculator", "date calculator", "unit converter online", "time zone converter",
    "investment calculator", "inflation calculator", "CAGR calculator",
    "break even calculator", "profit margin calculator", "loan eligibility calculator",
    "savings goal calculator", "scientific calculator", "days between dates calculator",
    "USD to INR", "BMI calculator kg", "salary to hourly converter",
    "income tax calculator India", "income tax calculator USA", "compound interest formula",
    "take home pay calculator", "loan EMI calculator online",
    "km to miles", "kg to lbs", "celsius to fahrenheit",
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Free Online Calculators — EMI, SIP, Tax, Loan, Mortgage",
    description: "30+ free calculators with dark mode, voice input, PDF/CSV export, compare mode, and 37-currency auto-detect. No signup, works offline.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "CalcHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Calculators — No Signup Required",
    description: "30+ free calculators with dark mode, voice input, PDF export, compare mode. EMI, SIP, mortgage, tax, BMI, calorie, and more.",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Analytics />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "CalcHub — Free Online Calculators",
          url: "https://calculatorhub.org",
          description: "30+ free online calculators with dark mode, voice input, PDF/CSV export, compare mode, and 37-currency auto-detect. EMI, SIP, mortgage, tax, BMI, calorie, scientific, and more.",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "EMI Calculator", "SIP Calculator", "Compound Interest Calculator",
            "Mortgage Calculator", "GST Calculator", "Income Tax Calculator",
            "Salary Calculator", "Currency Converter", "Retirement Calculator",
            "Loan Eligibility Calculator", "Savings Goal Calculator", "Investment Calculator",
            "Inflation Calculator", "CAGR Calculator", "Break-Even Calculator", "Profit Margin Calculator",
            "BMI Calculator", "Calorie Calculator", "Pregnancy Due Date Calculator",
            "Body Fat Calculator", "Water Intake Calculator", "Heart Rate Zone Calculator",
            "Percentage Calculator", "Discount Calculator", "Scientific Calculator",
            "Age Calculator", "Tip Calculator", "Fuel Cost Calculator",
            "Date Calculator", "Time Zone Converter", "GPA Calculator", "Unit Converter",
            "Dark Mode", "Voice Input", "PDF Export", "CSV Export", "Compare Mode",
            "Shareable Links", "Calculation History", "Keyboard Shortcuts",
            "37 Currency Auto-Detect", "PWA Offline Support", "Embeddable Widgets",
          ],
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Is CalcHub free?", acceptedAnswer: { "@type": "Answer", text: "Yes, all 15+ calculators are 100% free. No signup, no premium tier, no hidden charges." }},
            { "@type": "Question", name: "Is my data safe on CalcHub?", acceptedAnswer: { "@type": "Answer", text: "All calculations happen entirely in your browser. No data is ever sent to any server." }},
            { "@type": "Question", name: "Does CalcHub support multiple currencies?", acceptedAnswer: { "@type": "Answer", text: "Yes, CalcHub auto-detects your currency from your timezone and supports 37 currencies including USD, EUR, GBP, INR, JPY, AED, SGD, CHF, KRW, and many more." }},
            { "@type": "Question", name: "How accurate are the currency exchange rates?", acceptedAnswer: { "@type": "Answer", text: "The Currency Converter uses live exchange rates from the European Central Bank (ECB) via the Frankfurter API." }},
          ],
        }} />
        <HideOnEmbed>
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-indigo-100/60 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Calc<span className="text-indigo-600 dark:text-indigo-400">Hub</span>
                  </span>
                </Link>
                <div className="flex items-center gap-2">
                  <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-600 dark:text-gray-400">
                    <Link href="/#financial" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Financial</Link>
                    <Link href="/#math" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Math</Link>
                    <Link href="/#health" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Health</Link>
                    <Link href="/#utility" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Utility</Link>
                  </nav>
                  <ThemeToggle />
                  <MobileMenu />
                </div>
              </div>
            </div>
          </header>
          <ToastProvider />
        </HideOnEmbed>

        <main className="flex-1">{children}</main>

        <HideOnEmbed>
          {/* Footer */}
          <footer className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Calc<span className="text-indigo-600">Hub</span></span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Free online calculators. No signup, no limits, beautiful results.
                  </p>
                </div>

                {/* Financial */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Financial</h4>
                  <nav className="flex flex-col gap-2">
                    {CALCULATOR_LIST.filter(c => c.category === "financial").slice(0, 6).map(c => (
                      <Link key={c.slug} href={`/calculator/${c.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">{c.name}</Link>
                    ))}
                  </nav>
                </div>

                {/* Math & Health */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Math & Health</h4>
                  <nav className="flex flex-col gap-2">
                    {CALCULATOR_LIST.filter(c => c.category === "math" || c.category === "health").map(c => (
                      <Link key={c.slug} href={`/calculator/${c.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">{c.name}</Link>
                    ))}
                  </nav>
                </div>

                {/* Utility */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Utility</h4>
                  <nav className="flex flex-col gap-2">
                    {CALCULATOR_LIST.filter(c => c.category === "utility").map(c => (
                      <Link key={c.slug} href={`/calculator/${c.slug}`} className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors">{c.name}</Link>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <Link href="/about" className="hover:text-indigo-600 transition-colors">About</Link>
                  <span className="text-gray-300">·</span>
                  <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy</Link>
                  <span className="text-gray-300">·</span>
                  <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms</Link>
                </nav>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} CalcHub. All rights reserved.</p>
                  <p className="text-xs text-gray-400">Free calculators for everyone, everywhere.</p>
                </div>
              </div>
            </div>
          </footer>
          <CookieConsent />
          <ServiceWorkerRegister />
        </HideOnEmbed>
      </body>
    </html>
  );
}
