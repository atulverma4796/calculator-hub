import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CalcHub privacy policy. Your data never leaves your browser. No tracking, no cookies for calculation data.",
  alternates: { canonical: "https://calculatorhub.org/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Your Data Stays in Your Browser</h2>
          <p>
            CalcHub is a 100% client-side application. All calculations happen entirely in your web browser.
            No calculation data, inputs, or results are ever sent to our servers or any third party.
            We do not store, collect, or process any of your financial, health, or personal calculation data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">What We Collect</h2>
          <p>We use the following third-party services that may collect anonymous usage data:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>Google Analytics (GA4):</strong> Anonymous page views, session duration, device type, and approximate location (country level). No personally identifiable information is collected.</li>
            <li><strong>Google AdSense:</strong> May use cookies to serve relevant ads. You can opt out of personalized ads at <a href="https://adssettings.google.com" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Currency Detection</h2>
          <p>
            CalcHub detects your local currency using your browser&apos;s timezone setting (e.g., Asia/Kolkata → INR).
            This detection happens entirely in your browser using JavaScript. No location data is sent to any server.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Currency Converter Rates</h2>
          <p>
            The Currency Converter fetches live exchange rates from the European Central Bank via the <a href="https://frankfurter.dev" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Frankfurter API</a>.
            This request is made from your browser directly to the API. CalcHub does not proxy or log these requests.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">No Accounts or Signup</h2>
          <p>
            CalcHub does not require any signup, login, or account creation. We do not collect email addresses,
            names, phone numbers, or any personal information. There is no user database.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Cookies</h2>
          <p>
            CalcHub itself does not set any cookies. However, Google Analytics and Google AdSense may set cookies
            for analytics and advertising purposes. You can manage cookie preferences in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">Contact</h2>
          <p>
            If you have questions about this privacy policy, use our{" "}
            <Link href="/#feedback" className="text-indigo-600 hover:underline">feedback form</Link>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">&larr; Back to Calculators</Link>
      </div>
    </div>
  );
}
