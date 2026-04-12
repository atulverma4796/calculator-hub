/**
 * Programmatic SEO variants — same calculator, different landing page.
 * Each variant targets a specific search query with unique title, description,
 * defaults, and educational content overrides.
 */

export interface CalculatorVariant {
  slug: string; // parent calculator slug (e.g. "emi")
  variant: string; // variant slug (e.g. "home-loan")
  name: string; // full display name
  title: string; // SEO <title>
  description: string; // meta description
  keywords: string[];
  /** Override default input values for this variant */
  defaults?: Record<string, string | number>;
  /** Extra educational content shown above the standard content */
  intro: string; // 2-3 sentences explaining this specific use case
  tips: string[]; // variant-specific tips (shown BEFORE generic tips)
  faqs: { q: string; a: string }[]; // variant-specific FAQs (shown BEFORE generic FAQs)
}

export const CALCULATOR_VARIANTS: CalculatorVariant[] = [
  // ── EMI Variants ──────────────────────────────────
  {
    slug: "emi",
    variant: "home-loan",
    name: "Home Loan EMI Calculator",
    title: "Free Home Loan EMI Calculator — Monthly Payment & Interest Breakdown",
    description: "Calculate your home loan EMI instantly. See monthly payments, total interest, and amortization schedule for your housing loan. Free, no signup.",
    keywords: ["home loan EMI calculator", "housing loan calculator", "home loan monthly payment", "house loan EMI", "home mortgage EMI", "housing EMI calculator"],
    defaults: { amount: 300000, rate: 8.5, tenure: 20, tenureType: "years" },
    intro: "Buying a home is the biggest financial decision most people make. This calculator helps you estimate your monthly home loan EMI based on the loan amount, interest rate, and tenure. Most banks offer home loans for 15-30 years at rates between 6.5% and 10% depending on your country and credit score.",
    tips: [
      "Home loan interest rates are typically lower than personal or car loans — negotiate for the best rate",
      "A 20% down payment avoids Private Mortgage Insurance (PMI) in many countries",
      "Consider a 15-year tenure instead of 30 years — you pay significantly less interest overall",
    ],
    faqs: [
      { q: "What is a good interest rate for a home loan?", a: "Rates vary by country: India (8-9.5%), USA (6-7.5%), UK (4-6%), UAE (3.5-5%). Always compare rates from 3-4 banks before committing." },
      { q: "How much home loan can I afford?", a: "Banks typically approve loans where the EMI is 40-50% of your monthly income. Use this calculator to find the maximum loan amount you can comfortably repay." },
    ],
  },
  {
    slug: "emi",
    variant: "car-loan",
    name: "Car Loan EMI Calculator",
    title: "Free Car Loan EMI Calculator — Auto Loan Monthly Payment",
    description: "Calculate your car loan EMI with interest breakdown. Compare auto loan payments for different car prices, rates, and loan tenures. Free calculator.",
    keywords: ["car loan EMI calculator", "auto loan calculator", "car loan monthly payment", "vehicle loan EMI", "car finance calculator", "auto loan payment calculator"],
    defaults: { amount: 25000, rate: 9, tenure: 5, tenureType: "years" },
    intro: "Planning to buy a car? This calculator helps you estimate your monthly car loan EMI. Car loans typically have shorter tenures (3-7 years) and slightly higher interest rates than home loans. Enter the car price, down payment, and loan terms to see your exact monthly payment.",
    tips: [
      "Car loan tenures are shorter (3-7 years) than home loans — expect higher monthly EMIs",
      "A larger down payment (20-30%) significantly reduces your total interest cost",
      "New car loans have lower rates than used car loans — factor this into your decision",
    ],
    faqs: [
      { q: "What is the best car loan tenure?", a: "3-5 years is optimal. Shorter tenures mean higher EMIs but much less total interest. Avoid 7+ year car loans — you may owe more than the car is worth (negative equity)." },
      { q: "Should I buy a car with cash or take a loan?", a: "If you can invest the cash at a higher return than the loan rate, a loan makes sense. Otherwise, paying cash saves you the interest cost entirely." },
    ],
  },
  {
    slug: "emi",
    variant: "personal-loan",
    name: "Personal Loan EMI Calculator",
    title: "Free Personal Loan EMI Calculator — Unsecured Loan Payment",
    description: "Calculate personal loan EMI instantly. See monthly payments and total interest for unsecured loans. Compare different rates and tenures.",
    keywords: ["personal loan EMI calculator", "unsecured loan calculator", "personal loan payment", "personal loan interest", "instant loan EMI"],
    defaults: { amount: 10000, rate: 14, tenure: 3, tenureType: "years" },
    intro: "Personal loans are unsecured loans — no collateral required. This means higher interest rates (10-24%) but faster approval. Use this calculator to estimate your monthly EMI before applying for a personal loan.",
    tips: [
      "Personal loan rates are higher because they're unsecured — compare rates from multiple lenders",
      "Keep tenure under 5 years — long-tenure personal loans accumulate massive interest",
      "Check if your employer has a tie-up with banks for preferential personal loan rates",
    ],
    faqs: [
      { q: "What credit score do I need for a personal loan?", a: "Most banks require 650+ for approval. A score above 750 gets you the best rates. Check your credit score for free before applying." },
      { q: "Is personal loan interest tax deductible?", a: "In most countries, personal loan interest is NOT tax deductible (unlike home loans). Exception: if used for business purposes, it may qualify as a business expense." },
    ],
  },
  {
    slug: "emi",
    variant: "education-loan",
    name: "Education Loan EMI Calculator",
    title: "Free Education Loan EMI Calculator — Student Loan Payment",
    description: "Calculate education loan EMI for studying abroad or in your home country. See monthly payments, total cost, and repayment schedule.",
    keywords: ["education loan EMI calculator", "student loan calculator", "study loan EMI", "education loan repayment", "student loan payment calculator"],
    defaults: { amount: 50000, rate: 10, tenure: 10, tenureType: "years" },
    intro: "Education loans help fund college, university, or studying abroad. Most education loans offer a moratorium period (no EMI during study + 6-12 months after). This calculator helps you plan your repayment after the moratorium ends.",
    tips: [
      "Many education loans have a moratorium period — EMIs start 6-12 months after course completion",
      "Government education loan schemes often have subsidized interest rates — check eligibility",
      "Education loan interest is tax deductible in many countries (Section 80E in India, up to 8 years)",
    ],
    faqs: [
      { q: "When do I start repaying an education loan?", a: "Most banks offer a moratorium period: you don't pay EMI during your studies plus 6-12 months after graduation. Interest may still accrue during this period depending on the loan type." },
      { q: "Can parents take an education loan?", a: "Yes. In most countries, parents or guardians can be co-applicants or primary borrowers for education loans, often getting better terms if they have good credit." },
    ],
  },
  {
    slug: "emi",
    variant: "bike-loan",
    name: "Bike Loan EMI Calculator",
    title: "Free Bike Loan EMI Calculator — Two-Wheeler Loan Payment",
    description: "Calculate bike or two-wheeler loan EMI. See monthly payments for motorcycle, scooter, or electric bike financing.",
    keywords: ["bike loan EMI calculator", "two wheeler loan calculator", "motorcycle loan EMI", "scooter loan calculator", "bike finance EMI"],
    defaults: { amount: 3000, rate: 12, tenure: 3, tenureType: "years" },
    intro: "Financing a bike, scooter, or motorcycle? Two-wheeler loans typically have shorter tenures (1-5 years) and moderate interest rates (10-16%). Use this calculator to see exactly how much you'll pay each month.",
    tips: [
      "Two-wheeler loans are usually for 1-5 years — keep the tenure short to minimize interest",
      "Electric bikes/scooters may qualify for government subsidies or green vehicle loan discounts",
      "Compare dealer financing vs bank loans — dealer rates aren't always the best deal",
    ],
    faqs: [
      { q: "What is the minimum down payment for a bike loan?", a: "Most lenders require 10-20% down payment. Some offer zero down payment schemes but at higher interest rates. A higher down payment always means lower EMI." },
    ],
  },

  // ── SIP Variants ──────────────────────────────────
  {
    slug: "sip",
    variant: "mutual-fund",
    name: "Mutual Fund SIP Calculator",
    title: "Free Mutual Fund SIP Calculator — Investment Returns & Growth",
    description: "Calculate mutual fund SIP returns with compound growth. See how your monthly investment grows over 5, 10, 20 years. Free calculator with charts.",
    keywords: ["mutual fund SIP calculator", "SIP returns calculator", "mutual fund calculator", "SIP investment calculator", "mutual fund return calculator"],
    defaults: { monthly: 500, rate: 12, years: 10 },
    intro: "Mutual fund SIPs are the most popular way to invest for long-term wealth creation. By investing a fixed amount monthly, you benefit from rupee/dollar cost averaging and the power of compounding. Historical equity mutual fund returns average 10-14% annually over 10+ year periods.",
    tips: [
      "Equity mutual funds have historically delivered 10-14% annual returns over 10+ year periods",
      "Start with index funds (S&P 500, Nifty 50) if you're a beginner — lowest fees, market-matching returns",
      "Increase your SIP by 10% annually (step-up SIP) to dramatically boost your final corpus",
    ],
    faqs: [
      { q: "Which mutual fund is best for SIP?", a: "For beginners: index funds tracking S&P 500 or your country's major index. For moderate risk: large-cap or flexi-cap funds. For aggressive growth: mid-cap or small-cap funds. Always check the fund's 5-10 year track record." },
      { q: "Is SIP risk-free?", a: "No. SIPs invest in market-linked securities, so returns aren't guaranteed. However, SIP reduces risk through cost averaging — you buy more units when markets are down and fewer when they're up." },
    ],
  },
  {
    slug: "sip",
    variant: "elss-tax-saver",
    name: "ELSS Tax Saver SIP Calculator",
    title: "Free ELSS Tax Saving SIP Calculator — Section 80C Deduction",
    description: "Calculate ELSS (Equity Linked Savings Scheme) SIP returns with tax saving benefits. Shortest lock-in among Section 80C investments.",
    keywords: ["ELSS calculator", "tax saving SIP calculator", "ELSS SIP returns", "Section 80C calculator", "tax saver mutual fund calculator"],
    defaults: { monthly: 12500, rate: 14, years: 10 },
    intro: "ELSS (Equity Linked Savings Scheme) funds are tax-saving mutual funds with a 3-year lock-in period — the shortest among all Section 80C investments. You can claim up to 1,50,000 deduction per year under Section 80C while potentially earning 12-15% returns.",
    tips: [
      "ELSS has the shortest lock-in (3 years) compared to PPF (15 years) or FD (5 years)",
      "Maximum Section 80C deduction: 1,50,000 per year — a monthly SIP of 12,500 maximizes this",
      "ELSS returns are market-linked and historically beat PPF and tax-saving FD returns",
    ],
    faqs: [
      { q: "Is ELSS better than PPF for tax saving?", a: "ELSS has higher return potential (12-15% vs PPF's 7-8%) and shorter lock-in (3 years vs 15 years). However, PPF offers guaranteed returns with zero risk. Ideally, split your 80C investment between both." },
    ],
  },
  {
    slug: "sip",
    variant: "lumpsum",
    name: "Lumpsum Investment Calculator",
    title: "Free Lumpsum Investment Calculator — One-Time Investment Returns",
    description: "Calculate returns on a one-time lumpsum investment in mutual funds. See how your money grows with compound interest over time.",
    keywords: ["lumpsum calculator", "one time investment calculator", "lumpsum returns calculator", "lumpsum vs SIP", "lumpsum mutual fund calculator"],
    defaults: { monthly: 100000, rate: 12, years: 10 },
    intro: "A lumpsum investment is a one-time investment of a larger amount, unlike SIP which spreads it monthly. Lumpsum works best when you have surplus cash and believe markets are at reasonable levels. This calculator shows how your one-time investment grows over time.",
    tips: [
      "Lumpsum works best when markets are down or fairly valued — you benefit from the full recovery",
      "If unsure about timing, split your lumpsum into 3-6 monthly STP (Systematic Transfer Plan) installments",
      "Lumpsum beats SIP when markets go up consistently — SIP beats lumpsum in volatile markets",
    ],
    faqs: [
      { q: "Should I invest lumpsum or SIP?", a: "If markets are down and you have surplus cash: lumpsum. If you earn monthly and want disciplined investing: SIP. Most financial advisors recommend SIP for regular income earners and lumpsum for windfalls (bonus, inheritance)." },
    ],
  },

  // ── Mortgage Variants ─────────────────────────────
  {
    slug: "mortgage",
    variant: "30-year",
    name: "30-Year Mortgage Calculator",
    title: "Free 30-Year Mortgage Calculator — Monthly Payment & Amortization",
    description: "Calculate 30-year fixed mortgage payments. See monthly cost, total interest, and full amortization schedule for a 30-year home loan.",
    keywords: ["30 year mortgage calculator", "30 year fixed mortgage", "30 year home loan calculator", "30 year mortgage payment", "30 year mortgage rate"],
    defaults: { price: 400000, down: 20, rate: 6.8, years: 30 },
    intro: "A 30-year fixed-rate mortgage is the most popular home loan option — lower monthly payments spread over a longer period. While the monthly EMI is comfortable, you pay significantly more total interest compared to a 15-year mortgage.",
    tips: [
      "30-year mortgages have lower monthly payments but you pay 2-3x more total interest than a 15-year",
      "Even small extra payments each month ($100-200) can shave years off your mortgage",
      "Consider refinancing to a 15-year if rates drop significantly after you buy",
    ],
    faqs: [
      { q: "Is a 30-year mortgage worth it?", a: "It depends on your situation. The lower monthly payment gives you financial flexibility and lets you invest the difference. But you pay much more total interest. If you can afford the higher payment of a 15-year mortgage, that's usually the better financial move." },
      { q: "How much interest do I pay on a 30-year mortgage?", a: "On a $400,000 loan at 6.8%, you'd pay approximately $540,000 in total interest over 30 years — more than the original loan amount. A 15-year mortgage at the same rate costs roughly $230,000 in interest." },
    ],
  },
  {
    slug: "mortgage",
    variant: "15-year",
    name: "15-Year Mortgage Calculator",
    title: "Free 15-Year Mortgage Calculator — Save on Interest",
    description: "Calculate 15-year mortgage payments and see how much interest you save vs a 30-year loan. Full amortization schedule included.",
    keywords: ["15 year mortgage calculator", "15 year fixed mortgage", "15 year home loan", "15 year vs 30 year mortgage", "short term mortgage calculator"],
    defaults: { price: 400000, down: 20, rate: 6.2, years: 15 },
    intro: "A 15-year mortgage gets you debt-free in half the time and saves you tens of thousands in interest. The trade-off is higher monthly payments. This calculator helps you compare and decide if the higher EMI fits your budget.",
    tips: [
      "15-year mortgages typically have 0.5-1% lower interest rates than 30-year mortgages",
      "You'll save 50-60% in total interest compared to a 30-year mortgage",
      "Your monthly payment will be about 40-50% higher — make sure it fits within 35% of your income",
    ],
    faqs: [
      { q: "How much do I save with a 15-year vs 30-year mortgage?", a: "On a $400,000 loan: a 15-year at 6.2% costs ~$200,000 in total interest. A 30-year at 6.8% costs ~$540,000. That's $340,000 in savings — nearly the price of the house itself." },
    ],
  },
  {
    slug: "mortgage",
    variant: "first-time-buyer",
    name: "First-Time Home Buyer Calculator",
    title: "Free First-Time Home Buyer Calculator — How Much House Can I Afford?",
    description: "Calculate how much house you can afford as a first-time buyer. See mortgage payments based on your income, down payment, and current rates.",
    keywords: ["first time home buyer calculator", "how much house can I afford", "home affordability calculator", "first home buyer mortgage", "first time buyer calculator"],
    defaults: { price: 300000, down: 10, rate: 7, years: 30 },
    intro: "Buying your first home is exciting but overwhelming. This calculator helps you understand your monthly mortgage payment based on home price, down payment, and interest rate. As a first-time buyer, you may qualify for lower down payment programs (3-5% instead of 20%).",
    tips: [
      "First-time buyers often qualify for 3-5% down payment programs (FHA loans in the US)",
      "Budget for closing costs: typically 2-5% of the home price on top of the down payment",
      "The 28/36 rule: your mortgage shouldn't exceed 28% of gross income, total debt under 36%",
      "Get pre-approved before house hunting — it tells sellers you're a serious buyer",
    ],
    faqs: [
      { q: "How much down payment do I need as a first-time buyer?", a: "It varies by country and program. US: 3-3.5% (FHA), 0% (VA loans). UK: 5% minimum. Australia: 5-20%. India: 10-20%. Some programs offer first-time buyer assistance grants." },
      { q: "What is the 28/36 rule?", a: "A guideline that says your monthly mortgage payment shouldn't exceed 28% of your gross monthly income, and your total monthly debt payments (mortgage + car + credit cards) shouldn't exceed 36%." },
    ],
  },

  // ── Income Tax Variants ───────────────────────────
  {
    slug: "income-tax",
    variant: "india",
    name: "Income Tax Calculator India",
    title: "Free Income Tax Calculator India FY 2025-26 — New & Old Regime",
    description: "Calculate your income tax in India for FY 2025-26. Compare new regime vs old regime. See tax slabs, effective rate, and savings tips.",
    keywords: ["income tax calculator India", "income tax calculator India 2025-26", "new regime tax calculator", "old regime tax calculator", "income tax slab India", "tax calculator India FY 2025-26"],
    defaults: { income: 1200000, regime: "india-new" },
    intro: "India has two tax regimes — the New Regime (lower rates, fewer deductions) and the Old Regime (higher rates, many deductions). Since FY 2023-24, the New Regime is the default. This calculator helps you compare both and pick the one that saves you more tax.",
    tips: [
      "New Regime is better if you don't have many deductions (HRA, 80C, 80D)",
      "Old Regime is better if your deductions exceed 3-4 lakhs (home loan, HRA, insurance, NPS)",
      "Standard deduction of 75,000 is available in both regimes from FY 2024-25",
      "Income up to 12 lakhs is effectively tax-free under New Regime (with rebate) from FY 2025-26",
    ],
    faqs: [
      { q: "Which tax regime should I choose — new or old?", a: "If your total deductions (80C + 80D + HRA + home loan) exceed 3-4 lakhs, Old Regime saves more. If you have minimal deductions, New Regime's lower rates are better. Use this calculator to compare both." },
      { q: "Is income up to 12 lakh tax-free?", a: "Under the New Regime from FY 2025-26, income up to 12 lakhs is effectively tax-free due to the Section 87A rebate. This applies to taxable income after standard deduction." },
    ],
  },
  {
    slug: "income-tax",
    variant: "usa",
    name: "US Federal Income Tax Calculator",
    title: "Free US Federal Income Tax Calculator 2025 — Tax Brackets & Rates",
    description: "Calculate your US federal income tax for 2025. See your tax bracket, effective rate, and take-home pay after federal tax.",
    keywords: ["US income tax calculator", "federal tax calculator", "US tax bracket calculator", "2025 tax calculator USA", "federal income tax calculator", "US tax estimator"],
    defaults: { income: 85000, regime: "us" },
    intro: "The US federal income tax uses a progressive bracket system — you don't pay one flat rate on all income. Instead, different portions are taxed at different rates (10% to 37%). This calculator shows your exact tax, effective rate, and take-home pay.",
    tips: [
      "The US has 7 tax brackets: 10%, 12%, 22%, 24%, 32%, 35%, 37% — you only pay the higher rate on income ABOVE each threshold",
      "Your marginal rate (highest bracket) is NOT your effective rate — most people's effective rate is 15-22%",
      "Standard deduction for 2025: $15,000 (single), $30,000 (married filing jointly)",
      "This calculator shows federal tax only — state tax varies (0% in Texas/Florida, up to 13.3% in California)",
    ],
    faqs: [
      { q: "What is the difference between marginal and effective tax rate?", a: "Marginal rate is the rate on your last dollar of income (your highest bracket). Effective rate is your actual total tax divided by total income. For example, you might be in the 22% bracket but only pay 14% effectively." },
      { q: "Does this include state tax?", a: "No, this calculates federal tax only. State income tax varies: 0% (Texas, Florida, Nevada, Washington, Wyoming) up to 13.3% (California). Add your state tax to get the full picture." },
    ],
  },
  {
    slug: "income-tax",
    variant: "uk",
    name: "UK Income Tax Calculator",
    title: "Free UK Income Tax Calculator 2025/26 — PAYE Tax & National Insurance",
    description: "Calculate your UK income tax and National Insurance for 2025/26. See your PAYE deductions, effective rate, and take-home pay.",
    keywords: ["UK income tax calculator", "PAYE calculator", "UK tax calculator", "income tax calculator UK 2025", "National Insurance calculator", "UK take home pay calculator"],
    defaults: { income: 50000, regime: "uk" },
    intro: "UK income tax uses a progressive system with bands: Personal Allowance (0%), Basic Rate (20%), Higher Rate (40%), and Additional Rate (45%). National Insurance is charged on top. This calculator shows your combined tax and NI deductions.",
    tips: [
      "Personal Allowance: first £12,570 is tax-free (reduces for income over £100,000)",
      "National Insurance adds 8% on income between £12,570 and £50,270, then 2% above that",
      "Your effective rate includes both Income Tax and NI — it's higher than the headline bracket rate",
    ],
    faqs: [
      { q: "What is the UK personal allowance?", a: "£12,570 per year — this amount is completely tax-free. However, it reduces by £1 for every £2 earned over £100,000, meaning it reaches zero at £125,140." },
    ],
  },

  // ── Compound Interest Variants ────────────────────
  {
    slug: "compound-interest",
    variant: "monthly",
    name: "Monthly Compound Interest Calculator",
    title: "Free Monthly Compound Interest Calculator — Investment Growth",
    description: "Calculate compound interest with monthly compounding. See how your investment grows faster with monthly vs annual compounding.",
    keywords: ["monthly compound interest calculator", "compound interest monthly", "monthly compounding calculator", "compound interest calculator monthly"],
    defaults: { principal: 10000, rate: 10, years: 10, compounding: "monthly" },
    intro: "Monthly compounding means your interest is calculated and added to your principal every month, not just once a year. This means your interest earns interest faster — resulting in slightly higher returns than annual compounding.",
    tips: [
      "Monthly compounding earns 0.5-1% more than annual compounding over long periods",
      "Most savings accounts and mutual funds use daily or monthly compounding",
      "The more frequent the compounding, the faster your money grows — daily > monthly > quarterly > annual",
    ],
    faqs: [
      { q: "Is monthly compounding better than annual?", a: "Yes. Monthly compounding earns slightly more because interest is added to your principal 12 times a year instead of once. For example, $10,000 at 10% for 10 years: annual compounding = $25,937, monthly compounding = $27,070 — a $1,133 difference." },
    ],
  },
  {
    slug: "compound-interest",
    variant: "fd-calculator",
    name: "FD Interest Calculator",
    title: "Free Fixed Deposit Calculator — FD Interest & Maturity Amount",
    description: "Calculate fixed deposit maturity amount and interest earned. Compare FD returns across different tenures and interest rates.",
    keywords: ["FD calculator", "fixed deposit calculator", "FD interest calculator", "FD maturity calculator", "fixed deposit interest calculator", "bank FD calculator"],
    defaults: { principal: 100000, rate: 7, years: 5, compounding: "quarterly" },
    intro: "Fixed Deposits (FDs) are one of the safest investment options with guaranteed returns. Banks compound FD interest quarterly in most countries. This calculator shows your maturity amount and total interest earned for any FD tenure and rate.",
    tips: [
      "Senior citizens get 0.25-0.75% higher FD rates in most banks",
      "5-year tax-saving FDs qualify for Section 80C deduction in India (up to 1.5 lakh)",
      "Compare FD rates across banks — the difference can be 1-2% which matters over longer tenures",
      "FD interest is taxable income — factor in your tax bracket when comparing with other investments",
    ],
    faqs: [
      { q: "Are fixed deposits safe?", a: "FDs in banks are insured up to $250,000 (USA), £85,000 (UK), or 5 lakhs (India) by government deposit insurance. They're among the safest investments available." },
      { q: "Is FD interest taxable?", a: "Yes, in most countries. FD interest is added to your income and taxed at your income tax slab rate. Some countries have TDS (tax deducted at source) on FD interest above a threshold." },
    ],
  },

  // ── BMI Variants ──────────────────────────────────
  {
    slug: "bmi",
    variant: "metric",
    name: "BMI Calculator (Metric — kg/cm)",
    title: "Free BMI Calculator Metric — kg & cm | Body Mass Index",
    description: "Calculate your BMI using metric units (kilograms and centimeters). Instant result with health category and ideal weight range.",
    keywords: ["BMI calculator metric", "BMI calculator kg cm", "BMI calculator kg", "body mass index metric", "BMI calculator kilograms"],
    defaults: { weightUnit: "metric" },
    intro: "This BMI calculator uses the metric system — enter your weight in kilograms and height in centimeters. BMI is calculated as weight (kg) divided by height (m) squared. It's the standard measurement used by healthcare professionals worldwide.",
    tips: [
      "BMI ranges: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (30+)",
      "BMI doesn't distinguish between muscle and fat — athletes may have high BMI but low body fat",
      "For a more complete picture, combine BMI with waist circumference measurement",
    ],
    faqs: [
      { q: "What is a healthy BMI for adults?", a: "A BMI between 18.5 and 24.9 is considered healthy for adults. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is classified as obese by the WHO." },
    ],
  },
  {
    slug: "bmi",
    variant: "imperial",
    name: "BMI Calculator (Imperial — lbs/inches)",
    title: "Free BMI Calculator Imperial — Pounds & Inches | Body Mass Index",
    description: "Calculate your BMI using imperial units (pounds and inches). See your BMI category, healthy weight range, and health tips.",
    keywords: ["BMI calculator imperial", "BMI calculator lbs inches", "BMI calculator pounds", "body mass index imperial", "BMI calculator feet inches"],
    defaults: { weightUnit: "imperial" },
    intro: "This BMI calculator uses imperial units — enter your weight in pounds and height in feet/inches. The formula converts to metric internally: BMI = (weight in lbs × 703) / (height in inches)². Used primarily in the US and UK.",
    tips: [
      "The imperial BMI formula includes a conversion factor of 703 to convert from lbs/inches to the standard metric calculation",
      "Healthy weight range for someone 5'10\" tall: approximately 129-174 lbs (BMI 18.5-24.9)",
      "BMI categories are the same regardless of measurement system — only the input units differ",
    ],
    faqs: [
      { q: "How do I calculate BMI in pounds and inches?", a: "BMI = (weight in pounds × 703) / (height in inches)². For example, a person who weighs 150 lbs and is 5'8\" (68 inches): BMI = (150 × 703) / (68 × 68) = 22.8 — which is in the healthy range." },
    ],
  },

  // ── Salary Variants ───────────────────────────────
  {
    slug: "salary",
    variant: "hourly-to-annual",
    name: "Hourly to Annual Salary Calculator",
    title: "Free Hourly to Annual Salary Calculator — Convert Hourly Pay",
    description: "Convert hourly wage to annual salary. See your yearly, monthly, and weekly earnings from an hourly rate. Accounts for hours per week.",
    keywords: ["hourly to annual salary calculator", "hourly to yearly", "hourly wage to annual salary", "convert hourly to salary", "hourly rate to annual income"],
    defaults: { inputType: "hourly", amount: 25, hoursPerWeek: 40 },
    intro: "Want to know what your hourly rate translates to annually? This calculator converts your hourly wage to annual salary based on your hours per week. The standard assumption is 40 hours/week, 52 weeks/year, but you can adjust for part-time or overtime.",
    tips: [
      "Standard full-time: 40 hours/week × 52 weeks = 2,080 working hours per year",
      "If you get paid time off, your effective hourly rate is actually higher than your stated rate",
      "Freelancers should add 25-30% to their target salary to cover taxes and benefits they pay themselves",
    ],
    faqs: [
      { q: "How do I convert hourly wage to annual salary?", a: "Multiply your hourly rate × hours per week × 52 weeks. For example: $25/hour × 40 hours × 52 weeks = $52,000 annual salary." },
    ],
  },
  {
    slug: "salary",
    variant: "freelancer",
    name: "Freelancer Rate Calculator",
    title: "Free Freelancer Hourly Rate Calculator — What Should I Charge?",
    description: "Calculate your ideal freelancer hourly rate based on your target annual income. Accounts for taxes, benefits, and non-billable hours.",
    keywords: ["freelancer rate calculator", "freelance hourly rate calculator", "what should I charge freelance", "freelancer salary calculator", "consulting rate calculator"],
    defaults: { inputType: "annual", amount: 80000, hoursPerWeek: 30 },
    intro: "Freelancers can't just divide their target salary by working hours — you need to account for taxes (25-35%), health insurance, retirement, vacation time, and non-billable hours (admin, marketing, invoicing). This calculator helps you find the right hourly rate.",
    tips: [
      "Freelancers should charge 40-50% more than equivalent employees to cover taxes and benefits",
      "Assume only 60-70% of your working hours are billable — the rest is admin, marketing, invoicing",
      "Set a minimum project rate, not just hourly — small projects have disproportionate overhead",
      "Raise your rates by 10% every year — if no clients push back, you're undercharging",
    ],
    faqs: [
      { q: "What hourly rate should a freelancer charge?", a: "Take your target annual income, add 30% for taxes and benefits, divide by billable hours (typically 1,200-1,500/year, not 2,080). For a $80K target: ($80K + 30%) / 1,300 hours ≈ $80/hour." },
    ],
  },

  // ── Retirement Variants ───────────────────────────
  {
    slug: "retirement",
    variant: "401k",
    name: "401(k) Retirement Calculator",
    title: "Free 401(k) Calculator — Retirement Savings & Employer Match",
    description: "Calculate your 401(k) growth with employer match. See how your retirement savings compound over time with tax-deferred growth.",
    keywords: ["401k calculator", "401k retirement calculator", "401k growth calculator", "401k employer match calculator", "retirement 401k calculator"],
    defaults: { currentAge: 30, retireAge: 65, currentSavings: 50000, monthlySaving: 1500, returnRate: 8 },
    intro: "A 401(k) is the most powerful retirement savings tool in the US — your contributions are pre-tax, many employers match 3-6%, and your investments grow tax-deferred until withdrawal. This calculator shows how your 401(k) grows over time.",
    tips: [
      "Always contribute at least enough to get the full employer match — it's free money (3-6% typically)",
      "2025 contribution limit: $23,500 per year ($31,000 if over 50 — catch-up contributions)",
      "401(k) grows tax-deferred — you don't pay tax on gains until withdrawal in retirement",
      "Target saving 15% of your gross income (including employer match) for a comfortable retirement",
    ],
    faqs: [
      { q: "How much should I contribute to my 401(k)?", a: "At minimum: enough to get the full employer match (free money). Ideally: 15% of your gross income including employer match. Maximum: $23,500/year in 2025 ($31,000 if over 50)." },
      { q: "When can I withdraw from my 401(k)?", a: "Penalty-free withdrawals start at age 59½. Early withdrawals incur a 10% penalty plus income tax. Some exceptions exist (hardship, first home, disability)." },
    ],
  },
  {
    slug: "retirement",
    variant: "fire",
    name: "FIRE Calculator — Financial Independence Retire Early",
    title: "Free FIRE Calculator — When Can I Retire Early?",
    description: "Calculate your FIRE number and when you can retire early. See how savings rate, investment returns, and expenses determine your financial independence date.",
    keywords: ["FIRE calculator", "financial independence calculator", "retire early calculator", "FIRE number calculator", "when can I retire early", "financial independence retire early"],
    defaults: { currentAge: 28, retireAge: 45, currentSavings: 100000, monthlySaving: 3000, returnRate: 9 },
    intro: "FIRE (Financial Independence, Retire Early) is a movement focused on aggressive saving and investing to retire decades before 65. The core idea: save 50-70% of your income, invest in index funds, and retire when your portfolio reaches 25x your annual expenses (the 4% rule).",
    tips: [
      "The 4% rule: you need 25x your annual expenses saved to retire (e.g., $40K expenses = $1M needed)",
      "Increasing your savings rate from 20% to 50% can cut decades off your retirement timeline",
      "The biggest lever is reducing expenses, not increasing income — every dollar saved is a dollar you don't need to earn returns on",
      "Coast FIRE: save aggressively early, then let compound interest do the work while you take a lower-stress job",
    ],
    faqs: [
      { q: "What is the FIRE number?", a: "Your FIRE number = annual expenses × 25. If you spend $40,000/year, your FIRE number is $1,000,000. Once your investment portfolio reaches this amount, you can safely withdraw 4% annually to cover expenses indefinitely." },
      { q: "Is the 4% rule still valid?", a: "The 4% rule (Trinity Study) has held up historically for 30-year periods. For very early retirees (40+ year retirements), many FIRE practitioners use a more conservative 3.5% withdrawal rate or maintain flexible spending." },
    ],
  },
  {
    slug: "retirement",
    variant: "pension",
    name: "Pension Calculator",
    title: "Free Pension Calculator — Retirement Corpus & Monthly Income",
    description: "Calculate how much pension corpus you need and how much monthly income it will generate in retirement. Plan for a comfortable retired life.",
    keywords: ["pension calculator", "pension fund calculator", "retirement pension calculator", "pension income calculator", "retirement corpus calculator"],
    defaults: { currentAge: 35, retireAge: 60, currentSavings: 25000, monthlySaving: 800, returnRate: 8 },
    intro: "Planning for a pension means building a corpus large enough to fund 20-30 years of retired life. This calculator helps you estimate how much you need to save monthly to build your target retirement corpus based on your current age and retirement age.",
    tips: [
      "Plan for 25-30 years of retirement — people are living longer than previous generations",
      "Account for inflation: your expenses at 60 will be 2-3x what they are now",
      "Government pensions (Social Security, State Pension) typically cover only 30-40% of pre-retirement income",
      "NPS (National Pension System) in India offers tax benefits of up to 2 lakhs under 80CCD",
    ],
    faqs: [
      { q: "How much pension corpus do I need?", a: "A common rule: you need 20-25x your annual retirement expenses. If you expect to spend $30,000/year in retirement, you need $600,000-$750,000 saved. This assumes a 4-5% withdrawal rate." },
    ],
  },

  // ── Currency Variants ─────────────────────────────
  {
    slug: "currency",
    variant: "usd-to-inr",
    name: "USD to INR Converter",
    title: "Free USD to INR Converter — Live Dollar to Rupee Rate",
    description: "Convert US Dollars to Indian Rupees with live exchange rates from ECB. Free currency converter with real-time USD/INR rate.",
    keywords: ["USD to INR", "dollar to rupee", "USD to INR converter", "dollar to rupee today", "1 USD to INR", "US dollar to Indian rupee"],
    defaults: { amount: 1000, from: "USD", to: "INR" },
    intro: "Convert US Dollars (USD) to Indian Rupees (INR) using live exchange rates from the European Central Bank. The USD/INR rate fluctuates daily based on global market conditions, RBI policy, and trade balances. This converter always shows the latest available rate.",
    tips: [
      "USD/INR rate has historically ranged from 60-85 over the past decade, trending upward",
      "Banks and forex services charge 1-3% markup on the interbank rate — always compare before exchanging",
      "For large transfers, use specialized forex services (Wise, Remitly) instead of banks for better rates",
    ],
    faqs: [
      { q: "What is the current USD to INR rate?", a: "This converter shows the latest rate from the European Central Bank (ECB). Rates are updated daily on business days. The rate shown is the interbank mid-rate — your bank may charge a 1-3% markup." },
    ],
  },
  {
    slug: "currency",
    variant: "eur-to-usd",
    name: "EUR to USD Converter",
    title: "Free EUR to USD Converter — Live Euro to Dollar Rate",
    description: "Convert Euros to US Dollars with live exchange rates. Free EUR/USD converter with real-time European Central Bank rates.",
    keywords: ["EUR to USD", "euro to dollar", "EUR to USD converter", "euro to dollar today", "1 EUR to USD", "euro to US dollar"],
    defaults: { amount: 1000, from: "EUR", to: "USD" },
    intro: "Convert Euros (EUR) to US Dollars (USD) using live rates from the European Central Bank. EUR/USD is the most traded currency pair in the world, accounting for about 24% of global forex trading volume.",
    tips: [
      "EUR/USD is the most liquid currency pair — you'll get the tightest spreads for this conversion",
      "The ECB and Federal Reserve interest rate decisions are the biggest drivers of EUR/USD movement",
      "For travel, airport exchange counters have the worst rates — use ATMs or prepaid travel cards instead",
    ],
    faqs: [
      { q: "Is EUR stronger than USD?", a: "The EUR/USD rate fluctuates. As of recent years, they trade close to parity (1:1). Neither is inherently 'stronger' — the rate reflects relative economic conditions, interest rates, and trade balances." },
    ],
  },
  {
    slug: "currency",
    variant: "gbp-to-inr",
    name: "GBP to INR Converter",
    title: "Free GBP to INR Converter — Live Pound to Rupee Rate",
    description: "Convert British Pounds to Indian Rupees with live exchange rates. Free GBP/INR converter with real-time rates.",
    keywords: ["GBP to INR", "pound to rupee", "GBP to INR converter", "pound to rupee today", "1 GBP to INR", "British pound to Indian rupee"],
    defaults: { amount: 1000, from: "GBP", to: "INR" },
    intro: "Convert British Pounds Sterling (GBP) to Indian Rupees (INR) using live European Central Bank rates. This conversion is commonly used by students studying in the UK, NRIs sending money home, and businesses trading between India and the UK.",
    tips: [
      "GBP/INR rate is higher than USD/INR — the British Pound has historically been worth more than the Dollar",
      "For student remittances, compare Wise, Remitly, and bank transfer rates — differences can be significant on large amounts",
      "Set rate alerts to get notified when the rate hits your target — timing can save hundreds on large transfers",
    ],
    faqs: [
      { q: "What is the best way to send money from UK to India?", a: "Specialized services like Wise (formerly TransferWise) and Remitly typically offer better rates and lower fees than traditional banks. Compare the total received amount (after all fees and markup) rather than just the exchange rate." },
    ],
  },

  // ── GST/Tax Variants ──────────────────────────────
  {
    slug: "gst",
    variant: "18-percent",
    name: "18% GST Calculator",
    title: "Free 18% GST Calculator — Add or Remove 18% GST Online",
    description: "Calculate 18% GST on any amount. Add GST to a price or remove GST from a GST-inclusive amount. See CGST and SGST breakdown.",
    keywords: ["18% GST calculator", "18 percent GST calculator", "GST calculator 18%", "18% GST on services", "calculate 18% GST"],
    defaults: { amount: 10000, taxRate: 18 },
    intro: "18% GST is the most common rate applied to services in India — including IT services, restaurants, financial services, and most professional services. This calculator helps you quickly add or remove 18% GST from any amount.",
    tips: [
      "18% GST applies to most services: IT, restaurants (non-AC), financial services, telecom",
      "When removing GST: divide by 1.18, not subtract 18% — a common mistake",
      "For Indian businesses: 18% GST = 9% CGST + 9% SGST (intra-state) or 18% IGST (inter-state)",
    ],
    faqs: [
      { q: "How do I calculate 18% GST?", a: "To add 18% GST: multiply by 1.18. Example: ₹10,000 × 1.18 = ₹11,800. To remove 18% GST from an inclusive price: divide by 1.18. Example: ₹11,800 / 1.18 = ₹10,000." },
    ],
  },
  {
    slug: "gst",
    variant: "vat-calculator",
    name: "VAT Calculator",
    title: "Free VAT Calculator — Add or Remove VAT Online",
    description: "Calculate VAT (Value Added Tax) on any amount. Add VAT to a price or extract VAT from a VAT-inclusive amount. Works for any VAT rate.",
    keywords: ["VAT calculator", "VAT calculator online", "add VAT", "remove VAT", "VAT calculator UK", "value added tax calculator", "VAT calculator Europe"],
    defaults: { amount: 1000, taxRate: 20 },
    intro: "VAT (Value Added Tax) is charged in the UK, EU, and 160+ countries worldwide. Standard rates vary: UK 20%, Germany 19%, France 20%, Netherlands 21%. This calculator works for any VAT rate — just enter the rate for your country.",
    tips: [
      "UK VAT: Standard 20%, Reduced 5% (energy, child car seats), Zero 0% (food, books, children's clothing)",
      "EU VAT rates: Germany 19%, France 20%, Spain 21%, Netherlands 21%, Italy 22%",
      "When reverse-calculating: VAT-inclusive price ÷ (1 + VAT rate) = price before VAT",
    ],
    faqs: [
      { q: "What is the VAT rate in the UK?", a: "Standard VAT rate is 20%. Reduced rate is 5% (applied to home energy, child car seats). Zero rate (0%) applies to most food, books, newspapers, and children's clothing." },
      { q: "How is VAT different from sales tax?", a: "VAT is charged at every stage of production/distribution, with businesses reclaiming VAT on their inputs. Sales tax is charged only at the final point of sale to the consumer. The end result is similar for consumers, but the collection mechanism differs." },
    ],
  },

  // ── Discount Variants ─────────────────────────────
  {
    slug: "discount",
    variant: "sale",
    name: "Sale Price Calculator",
    title: "Free Sale Price Calculator — How Much Do I Save?",
    description: "Calculate the sale price after a percentage discount. See how much you save and the final price you pay. Works for any discount percentage.",
    keywords: ["sale price calculator", "sale calculator", "how much do I save", "discount sale calculator", "percent off calculator", "sale discount calculator"],
    defaults: { price: 100, discount: 30 },
    intro: "Shopping a sale? Enter the original price and discount percentage to see exactly how much you save and the final price you pay. Works for any store, any currency, any discount percentage.",
    tips: [
      "Double discounts stack multiplicatively, not additively: 20% off + 10% off = 28% off, not 30%",
      "Compare price-per-unit when items come in different sizes — the bigger size isn't always the better deal",
      "Set a price alert for items you want — many browser extensions track price drops automatically",
    ],
    faqs: [
      { q: "How do I calculate 30% off?", a: "Multiply the original price by 0.70 (which is 1 - 0.30). For example: $100 × 0.70 = $70 final price. You save $30." },
    ],
  },

  // ── Tip Variants ──────────────────────────────────
  {
    slug: "tip",
    variant: "restaurant",
    name: "Restaurant Tip Calculator",
    title: "Free Restaurant Tip Calculator — How Much to Tip at Dinner",
    description: "Calculate restaurant tip and split the bill between friends. See tip amounts for 15%, 18%, 20%, and custom percentages.",
    keywords: ["restaurant tip calculator", "dinner tip calculator", "how much to tip at restaurant", "tip calculator restaurant", "dining tip calculator"],
    defaults: { bill: 80, tipPct: 18, people: 2 },
    intro: "Dining out? This calculator helps you figure out the right tip and split the bill evenly. In the US, 15-20% is standard for table service. In other countries, tipping customs vary — from expected (US, Canada) to rare (Japan, South Korea).",
    tips: [
      "US tipping guide: 15% (adequate service), 18% (good service), 20%+ (excellent service)",
      "Tip on the pre-tax amount, not the total after tax — that's the standard practice",
      "In many European countries, service charge is included — check the bill before tipping extra",
      "For large groups (6+), many restaurants automatically add 18-20% gratuity",
    ],
    faqs: [
      { q: "How much should I tip at a restaurant?", a: "In the US: 15-20% of the pre-tax bill. In the UK: 10-12.5% (if service charge not included). In Australia: tipping is optional, 10% for exceptional service. In Japan: don't tip — it can be considered rude." },
    ],
  },

  // ── Fuel Variants ─────────────────────────────────
  {
    slug: "fuel",
    variant: "road-trip",
    name: "Road Trip Fuel Cost Calculator",
    title: "Free Road Trip Fuel Cost Calculator — Gas Cost for Your Trip",
    description: "Calculate how much fuel your road trip will cost. Enter distance, fuel efficiency, and gas price to see total trip fuel cost.",
    keywords: ["road trip fuel cost calculator", "road trip gas calculator", "trip fuel cost", "gas cost for road trip", "road trip cost calculator", "driving cost calculator"],
    defaults: { distance: 500, efficiency: 30, fuelPrice: 3.50 },
    intro: "Planning a road trip? Enter your total driving distance, your vehicle's fuel efficiency (MPG or km/L), and the current fuel price to calculate exactly how much you'll spend on gas. Great for budgeting road trips and comparing driving vs flying costs.",
    tips: [
      "Highway driving is 20-30% more fuel-efficient than city driving — plan your route accordingly",
      "Driving at 60 mph vs 75 mph can improve fuel efficiency by 15-20%",
      "Use apps like GasBuddy to find the cheapest gas stations along your route",
      "Compare driving cost vs flight cost for trips over 500 miles — flying is often cheaper for solo travelers",
    ],
    faqs: [
      { q: "How do I calculate fuel cost for a road trip?", a: "Total cost = (distance / fuel efficiency) × fuel price. For example: 500 miles / 30 MPG × $3.50/gallon = $58.33 in fuel for the trip." },
    ],
  },
  {
    slug: "fuel",
    variant: "daily-commute",
    name: "Daily Commute Fuel Cost Calculator",
    title: "Free Daily Commute Fuel Cost Calculator — Monthly Gas Budget",
    description: "Calculate your daily and monthly commute fuel cost. See how much you spend on gas driving to work and explore money-saving alternatives.",
    keywords: ["daily commute fuel cost", "commute cost calculator", "monthly gas cost calculator", "commute fuel cost", "driving to work cost", "monthly fuel budget"],
    defaults: { distance: 30, efficiency: 28, fuelPrice: 3.50 },
    intro: "How much does your daily commute cost in fuel? Enter your round-trip commute distance, your car's fuel efficiency, and fuel price. This calculator shows your daily, weekly, monthly, and annual commute fuel cost — often a surprising number.",
    tips: [
      "The average American commute is 32 miles round-trip — costing $100-150/month in fuel alone",
      "Carpooling with one person cuts your fuel cost in half — many apps match commuters",
      "Working from home 2 days/week saves 40% on commute fuel — worth negotiating with your employer",
      "Electric vehicles cut commute fuel cost by 60-70% — factor this into your next car purchase decision",
    ],
    faqs: [
      { q: "How much does the average commute cost per month?", a: "For a 30-mile round-trip commute in a car getting 28 MPG with gas at $3.50/gallon: about $82/month or $990/year. Add insurance, maintenance, and depreciation, and the true cost of commuting is $3,000-$6,000/year." },
    ],
  },

  // ── Percentage Variants ───────────────────────────
  {
    slug: "percentage",
    variant: "increase",
    name: "Percentage Increase Calculator",
    title: "Free Percentage Increase Calculator — Calculate % Change",
    description: "Calculate percentage increase between two numbers. See the exact percentage change and difference. Works for salary raises, price increases, and more.",
    keywords: ["percentage increase calculator", "percent increase calculator", "percentage change calculator", "calculate percentage increase", "percent change calculator"],
    defaults: {},
    intro: "Calculate the percentage increase from one value to another. Common uses: salary raises (how much did my pay go up?), price increases (how much more expensive is it?), growth rates (how fast is revenue growing?).",
    tips: [
      "Formula: ((New Value - Old Value) / Old Value) × 100 = Percentage Increase",
      "A 50% decrease requires a 100% increase to get back to the original — percentage changes aren't symmetrical",
      "Compounding matters: 10% increase per year for 7 years doubles your value (Rule of 72)",
    ],
    faqs: [
      { q: "How do I calculate percentage increase?", a: "Subtract the old value from the new value, divide by the old value, multiply by 100. Example: salary went from $50,000 to $55,000. Increase = ($55,000 - $50,000) / $50,000 × 100 = 10% raise." },
    ],
  },
  {
    slug: "percentage",
    variant: "decrease",
    name: "Percentage Decrease Calculator",
    title: "Free Percentage Decrease Calculator — Calculate % Drop",
    description: "Calculate percentage decrease between two numbers. See the exact percentage drop and difference. Works for discounts, losses, and declines.",
    keywords: ["percentage decrease calculator", "percent decrease calculator", "percentage drop calculator", "calculate percentage decrease", "how much percent did it decrease"],
    defaults: {},
    intro: "Calculate the percentage decrease from one value to another. Common uses: investment losses (how much did my portfolio drop?), price reductions (how much cheaper is it?), and decline rates.",
    tips: [
      "Formula: ((Old Value - New Value) / Old Value) × 100 = Percentage Decrease",
      "A 50% loss requires a 100% gain to recover — losses hurt more than equivalent gains help",
      "When comparing price drops, always calculate the percentage, not just the dollar amount",
    ],
    faqs: [
      { q: "How do I calculate percentage decrease?", a: "Subtract the new value from the old value, divide by the old value, multiply by 100. Example: price dropped from $200 to $150. Decrease = ($200 - $150) / $200 × 100 = 25% decrease." },
    ],
  },

  // ── Age Variants ──────────────────────────────────
  {
    slug: "age",
    variant: "birthday-countdown",
    name: "Birthday Countdown Calculator",
    title: "Free Birthday Countdown — How Many Days Until My Birthday?",
    description: "Calculate exactly how many days, hours, and minutes until your next birthday. See your age in days, weeks, months, and more.",
    keywords: ["birthday countdown", "days until birthday", "how many days until my birthday", "birthday countdown calculator", "next birthday countdown", "birthday timer"],
    defaults: {},
    intro: "Enter your date of birth and instantly see how many days until your next birthday, plus your exact age in days, weeks, months, and years. Share it with friends or set a reminder!",
    tips: [
      "There are approximately 365.25 days in a year (accounting for leap years)",
      "Your 10,000th day alive is a fun milestone — usually around age 27",
      "Some cultures celebrate the 1,000th day birthday as a special milestone for babies",
    ],
    faqs: [
      { q: "How many days until my birthday?", a: "Enter your date of birth above and the calculator will show you exactly how many days, hours, and minutes until your next birthday. It accounts for leap years automatically." },
    ],
  },
  {
    slug: "age",
    variant: "age-difference",
    name: "Age Difference Calculator",
    title: "Free Age Difference Calculator — Compare Two Dates of Birth",
    description: "Calculate the exact age difference between two people in years, months, and days. Great for couples, siblings, or friends.",
    keywords: ["age difference calculator", "age gap calculator", "difference between two dates", "age difference between two people", "age gap calculator online"],
    defaults: {},
    intro: "Calculate the exact age difference between two people by entering both dates of birth. See the gap in years, months, and days. Commonly used by couples, parents comparing children's ages, or just for fun.",
    tips: [
      "The average age gap between couples worldwide is 2-3 years",
      "Siblings born in the same calendar year but different months can have up to 11 months difference",
      "Age difference is calculated from the dates, accounting for different month lengths and leap years",
    ],
    faqs: [
      { q: "How do I calculate the age difference between two people?", a: "Enter both dates of birth above. The calculator will show the exact difference in years, months, and days. It accounts for varying month lengths and leap years." },
    ],
  },

  // ── Loan Eligibility Variants ─────────────────────
  {
    slug: "loan-eligibility",
    variant: "home-loan-eligibility",
    name: "Home Loan Eligibility Calculator",
    title: "Free Home Loan Eligibility Calculator — How Much Can You Borrow?",
    description: "Check how much home loan you can get based on your income, expenses, and credit score. Estimate your maximum mortgage amount instantly.",
    keywords: ["home loan eligibility calculator", "how much home loan can I get", "mortgage eligibility calculator", "home loan amount calculator", "maximum mortgage amount"],
    defaults: { loanType: "home", monthlyIncome: 6000, monthlyExpenses: 2000, interestRate: 7, tenure: 25 },
    intro: "Find out the maximum home loan amount you qualify for based on your monthly income, existing debts, and current interest rates. Banks typically allow a debt-to-income ratio of 40-50%, meaning your total EMIs should not exceed that threshold.",
    tips: [
      "Banks generally approve home loans where total EMIs (including existing debts) are under 40-50% of gross income",
      "A higher credit score (750+) can increase your eligible loan amount by 10-20%",
      "Adding a co-applicant's income can significantly boost your loan eligibility",
    ],
    faqs: [
      { q: "How much home loan can I get on my salary?", a: "As a rough rule, you can borrow up to 60x your monthly salary for a home loan. For example, with a $6,000 monthly salary, you may be eligible for up to $360,000 — though the exact amount depends on interest rates, existing debts, and your credit score." },
      { q: "Does credit score affect home loan eligibility?", a: "Yes, significantly. A score above 750 gets you the best rates and highest eligible amounts. Below 650, most banks will either reject the application or charge higher interest, reducing the amount you qualify for." },
    ],
  },
  {
    slug: "loan-eligibility",
    variant: "car-loan-eligibility",
    name: "Car Loan Eligibility Calculator",
    title: "Free Car Loan Eligibility Calculator — How Much Auto Loan Can You Get?",
    description: "Find out how much car loan you qualify for based on your income and expenses. Calculate your maximum auto loan amount and affordable car budget.",
    keywords: ["car loan eligibility calculator", "how much car loan can I get", "auto loan eligibility", "car loan amount calculator", "car affordability calculator"],
    defaults: { loanType: "car", monthlyIncome: 5000, monthlyExpenses: 1800, interestRate: 8, tenure: 5 },
    intro: "Determine the maximum car loan you qualify for based on your monthly income, expenses, and desired loan tenure. Car loans are typically shorter (3-7 years) with higher rates than home loans, which affects the maximum amount you can borrow.",
    tips: [
      "Financial advisors recommend spending no more than 15-20% of your monthly income on car payments",
      "Car loans are shorter than home loans — expect higher monthly payments for the same borrowed amount",
      "A larger down payment (20%+) improves your eligibility and reduces total interest paid",
    ],
    faqs: [
      { q: "How much car can I afford?", a: "A common guideline is the 20/4/10 rule: put 20% down, finance for no more than 4 years, and keep total vehicle costs (payment + insurance + fuel) under 10% of gross income." },
    ],
  },

  // ── Savings Goal Variants ─────────────────────────
  {
    slug: "savings-goal",
    variant: "emergency-fund",
    name: "Emergency Fund Calculator",
    title: "Free Emergency Fund Calculator — How Much Do You Need?",
    description: "Calculate how much emergency fund you need and how long it takes to build one. Plan for 3-6 months of expenses with a clear savings timeline.",
    keywords: ["emergency fund calculator", "how much emergency fund", "emergency savings calculator", "rainy day fund calculator", "emergency fund goal"],
    defaults: { goalAmount: 15000, currentSavings: 2000, monthlyContribution: 500, returnRate: 4 },
    intro: "An emergency fund is your financial safety net — money set aside to cover unexpected expenses like job loss, medical bills, or car repairs. Most experts recommend saving 3-6 months of living expenses in a readily accessible account.",
    tips: [
      "Start with a $1,000 mini emergency fund, then build up to 3-6 months of expenses",
      "Keep your emergency fund in a high-yield savings account — not invested in stocks",
      "If you have variable income (freelancer, contractor), aim for 6-12 months of expenses",
    ],
    faqs: [
      { q: "How much should I have in my emergency fund?", a: "The standard recommendation is 3-6 months of essential living expenses. If you earn $4,000/month and spend $2,500 on essentials, you need $7,500-$15,000. Freelancers and single-income households should aim for the higher end." },
      { q: "Where should I keep my emergency fund?", a: "In a high-yield savings account that's easily accessible but separate from your daily checking account. Avoid investing it in stocks — you need it to be stable and liquid." },
    ],
  },
  {
    slug: "savings-goal",
    variant: "house-down-payment",
    name: "House Down Payment Calculator",
    title: "Free House Down Payment Calculator — Save for Your First Home",
    description: "Calculate how long it takes to save for a house down payment. Set your home price, target percentage, and monthly savings to see your timeline.",
    keywords: ["house down payment calculator", "down payment savings calculator", "save for a house calculator", "home down payment calculator", "how long to save for a house"],
    defaults: { goalAmount: 60000, currentSavings: 10000, monthlyContribution: 1500, returnRate: 4.5 },
    intro: "Saving for a house down payment is one of the biggest financial goals for first-time buyers. Most lenders require 5-20% of the home price upfront. This calculator helps you figure out how much to save monthly and how long it will take to reach your goal.",
    tips: [
      "A 20% down payment avoids Private Mortgage Insurance (PMI) — saving you $100-300/month",
      "Consider a high-yield savings account or short-term CDs for your down payment fund",
      "First-time buyer programs in many countries offer reduced down payment requirements (3-5%)",
    ],
    faqs: [
      { q: "How much down payment do I need for a house?", a: "Conventional loans typically require 5-20%. FHA loans (US) allow as low as 3.5%. The more you put down, the lower your monthly payment and total interest cost. Aim for 20% to avoid PMI." },
    ],
  },
  {
    slug: "savings-goal",
    variant: "vacation-savings",
    name: "Vacation Savings Calculator",
    title: "Free Vacation Savings Calculator — Plan & Budget Your Dream Trip",
    description: "Calculate how much to save each month for your dream vacation. Set your travel budget and departure date to get a clear savings plan.",
    keywords: ["vacation savings calculator", "travel fund calculator", "trip savings calculator", "holiday budget calculator", "save for vacation calculator"],
    defaults: { goalAmount: 5000, currentSavings: 500, monthlyContribution: 400, returnRate: 3 },
    intro: "Planning a dream vacation? This calculator helps you figure out exactly how much to save each month to fund your trip. Enter your total travel budget and when you want to go, and see the monthly savings needed to get there without going into debt.",
    tips: [
      "Book flights 6-8 weeks in advance for domestic trips, 2-3 months for international — this is the sweet spot for prices",
      "Set up a dedicated vacation savings account with automatic transfers on payday",
      "Travel in shoulder season (just before or after peak) for 30-50% savings on flights and hotels",
    ],
    faqs: [
      { q: "How much should I budget for a vacation?", a: "A rough guide: $100-150/day per person for mid-range travel in Europe or North America, $50-80/day in Southeast Asia or Latin America. Include flights, accommodation, food, activities, and a 10-15% buffer for surprises." },
    ],
  },

  // ── Investment Variants ───────────────────────────
  {
    slug: "investment",
    variant: "stock-market",
    name: "Stock Market Return Calculator",
    title: "Free Stock Market Return Calculator — Estimate Investment Growth",
    description: "Calculate potential stock market returns on your investment. See how your money grows with lump sum and regular monthly investing.",
    keywords: ["stock market return calculator", "stock investment calculator", "stock market growth calculator", "equity return calculator", "stock market profit calculator"],
    defaults: { initialInvestment: 10000, monthlyInvestment: 500, returnRate: 10, years: 15 },
    intro: "The stock market has historically returned 8-12% annually over long periods (S&P 500 average: ~10%). This calculator helps you estimate how your investment grows with both a lump sum and regular monthly contributions through the power of compounding.",
    tips: [
      "The S&P 500 has averaged ~10% annual returns over the past century, but individual years vary widely (-37% to +52%)",
      "Dollar-cost averaging (investing fixed amounts monthly) reduces the risk of bad timing",
      "Historically, staying invested for 15+ years has never resulted in a loss in the S&P 500",
    ],
    faqs: [
      { q: "What is a realistic stock market return to expect?", a: "Historically, the S&P 500 has returned about 10% per year before inflation (7% after inflation). For conservative planning, use 7-8%. Individual stock returns vary wildly — diversified index funds are the safest way to capture market returns." },
      { q: "Is it better to invest a lump sum or monthly?", a: "Statistically, lump sum investing wins about 2/3 of the time because markets trend upward. However, dollar-cost averaging (monthly investing) reduces risk and is psychologically easier. If you receive regular income, monthly investing is the practical choice." },
    ],
  },
  {
    slug: "investment",
    variant: "index-fund",
    name: "Index Fund Calculator",
    title: "Free Index Fund Calculator — Passive Investing Returns",
    description: "Calculate index fund investment returns over time. See how passive investing in index funds grows your wealth with low fees and market returns.",
    keywords: ["index fund calculator", "index fund return calculator", "passive investing calculator", "S&P 500 calculator", "Vanguard index fund calculator", "ETF return calculator"],
    defaults: { initialInvestment: 5000, monthlyInvestment: 500, returnRate: 9, years: 20 },
    intro: "Index funds track a market index (like the S&P 500) with ultra-low fees (0.03-0.20%) and have outperformed 90% of actively managed funds over 15+ year periods. This calculator shows the power of consistent passive investing over time.",
    tips: [
      "Index funds charge 0.03-0.20% in fees vs 1-2% for active funds — this difference compounds to tens of thousands over decades",
      "Warren Buffett recommends index funds for most investors: 'A low-cost index fund is the most sensible equity investment for the great majority of investors'",
      "Broad market index funds (total market or S&P 500) provide instant diversification across hundreds of companies",
    ],
    faqs: [
      { q: "Which index fund should I invest in?", a: "For beginners, a total stock market index fund (like Vanguard VTI or Fidelity FSKAX) or an S&P 500 fund (VOO, SPY) are excellent choices. For international diversification, add a total international fund (VXUS). Keep it simple." },
    ],
  },
  {
    slug: "investment",
    variant: "recurring-deposit",
    name: "Recurring Deposit Calculator",
    title: "Free Recurring Deposit (RD) Calculator — Monthly Savings Returns",
    description: "Calculate recurring deposit maturity amount and interest earned. See how your monthly fixed deposits grow over time with guaranteed returns.",
    keywords: ["recurring deposit calculator", "RD calculator", "recurring deposit interest calculator", "RD maturity calculator", "monthly deposit calculator"],
    defaults: { initialInvestment: 0, monthlyInvestment: 200, returnRate: 6.5, years: 5 },
    intro: "A Recurring Deposit (RD) lets you invest a fixed amount every month at a guaranteed interest rate. It is a safe, low-risk option offered by banks worldwide. This calculator shows your maturity amount and total interest earned based on your monthly deposit and tenure.",
    tips: [
      "RDs offer guaranteed returns unlike stocks — ideal for short-term goals (1-5 years)",
      "Interest rates on RDs are usually slightly lower than fixed deposits of the same tenure",
      "Some banks offer flexible RDs where you can vary your monthly deposit amount",
    ],
    faqs: [
      { q: "Is a recurring deposit a good investment?", a: "RDs are good for risk-averse savers with short-term goals (1-5 years). The returns are guaranteed but typically lower than stocks or mutual funds. They are ideal for building an emergency fund or saving for a specific near-term goal." },
    ],
  },

  // ── Inflation Variants ────────────────────────────
  {
    slug: "inflation",
    variant: "cost-of-living",
    name: "Cost of Living Inflation Calculator",
    title: "Free Cost of Living Calculator — How Inflation Affects Your Expenses",
    description: "Calculate how inflation increases your cost of living over time. See what today's expenses will cost in 5, 10, or 20 years at different inflation rates.",
    keywords: ["cost of living calculator", "inflation cost calculator", "future cost of living", "inflation impact calculator", "cost of living increase calculator"],
    defaults: { currentAmount: 3000, inflationRate: 3.5, years: 10 },
    intro: "Inflation silently erodes your purchasing power every year. This calculator shows how your current monthly expenses will increase over time due to inflation. Understanding this helps you plan savings, investments, and retirement more accurately.",
    tips: [
      "At 3% inflation, prices double roughly every 24 years (Rule of 72: 72/3 = 24)",
      "Housing, healthcare, and education typically inflate faster than the general CPI rate",
      "Your investments need to earn MORE than the inflation rate to actually grow your purchasing power",
    ],
    faqs: [
      { q: "What is a good inflation rate to assume for planning?", a: "For long-term planning, 3-4% is a reasonable assumption for most developed economies. The US Federal Reserve targets 2%, but actual inflation has ranged from 1-9% in recent years. For healthcare and education costs, use 5-7%." },
      { q: "How does inflation affect my retirement savings?", a: "Significantly. If you need $3,000/month today and retire in 25 years at 3% inflation, you will need about $6,300/month for the same lifestyle. Always plan retirement in inflation-adjusted (real) terms." },
    ],
  },
  {
    slug: "inflation",
    variant: "salary-inflation",
    name: "Salary Inflation Calculator",
    title: "Free Salary Inflation Calculator — Is Your Raise Beating Inflation?",
    description: "Calculate whether your salary raise keeps up with inflation. See your real salary growth after accounting for rising prices.",
    keywords: ["salary inflation calculator", "real salary calculator", "salary vs inflation", "wage inflation calculator", "salary purchasing power calculator"],
    defaults: { currentAmount: 55000, inflationRate: 3.5, years: 5 },
    intro: "A 5% raise sounds great — but if inflation is 4%, your real raise is only about 1%. This calculator helps you understand whether your salary is actually growing in purchasing power terms, or if inflation is quietly eating your gains.",
    tips: [
      "If your raise percentage is less than inflation, you are effectively taking a pay cut in real terms",
      "Negotiate raises based on inflation PLUS merit — inflation adjustments merely maintain your purchasing power",
      "Job-hopping typically yields 10-20% salary bumps vs 3-5% for staying — factor this into career planning",
    ],
    faqs: [
      { q: "What salary raise should I expect each year?", a: "Average annual raises are 3-5% for most workers. Top performers may get 7-10%. If inflation is 3-4%, a 3% raise means your purchasing power is essentially flat. To truly get ahead, aim for raises above the inflation rate." },
    ],
  },

  // ── CAGR Variants ─────────────────────────────────
  {
    slug: "cagr",
    variant: "stock-return",
    name: "Stock Return CAGR Calculator",
    title: "Free Stock Return CAGR Calculator — Annualized Investment Return",
    description: "Calculate the CAGR (Compound Annual Growth Rate) of your stock investment. See the true annualized return of any investment over any time period.",
    keywords: ["stock CAGR calculator", "stock return calculator", "annualized stock return", "investment CAGR calculator", "stock growth rate calculator"],
    defaults: { beginningValue: 10000, endingValue: 28000, years: 7 },
    intro: "CAGR (Compound Annual Growth Rate) shows the true annualized return of your stock investment, smoothing out year-to-year volatility. If your stock went from $10,000 to $28,000 over 7 years, the CAGR tells you the equivalent steady annual return.",
    tips: [
      "CAGR is more meaningful than simple average return because it accounts for compounding",
      "The S&P 500 CAGR over the past 30 years has been approximately 10-11% per year",
      "Always compare CAGR against inflation (typically 2-4%) to understand real returns",
    ],
    faqs: [
      { q: "What is a good CAGR for stocks?", a: "A CAGR of 10-12% is excellent for a diversified stock portfolio (matching the S&P 500 historical average). Individual stocks vary widely — some achieve 20%+ CAGR while others lose money. A CAGR above 15% sustained over 10+ years is exceptional." },
    ],
  },
  {
    slug: "cagr",
    variant: "revenue-growth",
    name: "Revenue Growth CAGR Calculator",
    title: "Free Revenue Growth CAGR Calculator — Business Growth Rate",
    description: "Calculate the CAGR of your business revenue. Measure true annualized revenue growth to compare performance across years and companies.",
    keywords: ["revenue CAGR calculator", "revenue growth rate calculator", "business growth CAGR", "company growth rate calculator", "annual revenue growth calculator"],
    defaults: { beginningValue: 500000, endingValue: 1200000, years: 3 },
    intro: "Measure your company's true annualized revenue growth using CAGR. Unlike simple year-over-year comparisons, CAGR smooths out fluctuations and gives you a single growth rate that represents consistent performance over the entire period.",
    tips: [
      "Investors and analysts use revenue CAGR as a key metric to evaluate company growth potential",
      "SaaS companies with 20%+ revenue CAGR are typically considered high-growth",
      "Compare your revenue CAGR against your industry average to gauge relative performance",
    ],
    faqs: [
      { q: "What is a good revenue CAGR for a business?", a: "It depends on the industry and stage. Startups: 50-100%+ CAGR is common in early years. SMBs: 15-25% is strong growth. Large established companies: 5-10% CAGR is considered healthy. Always compare against your industry benchmark." },
    ],
  },
  {
    slug: "cagr",
    variant: "portfolio-growth",
    name: "Portfolio Growth CAGR Calculator",
    title: "Free Portfolio Growth CAGR Calculator — Track Your Investment Performance",
    description: "Calculate the CAGR of your investment portfolio. See how your overall portfolio has performed on an annualized basis across all assets.",
    keywords: ["portfolio CAGR calculator", "portfolio growth rate", "portfolio performance calculator", "investment portfolio return", "portfolio annualized return"],
    defaults: { beginningValue: 50000, endingValue: 95000, years: 5 },
    intro: "Track your investment portfolio's true performance with CAGR. Whether you hold stocks, bonds, real estate, or a mix, CAGR gives you one clean number showing your annualized return — making it easy to compare against benchmarks like the S&P 500.",
    tips: [
      "Compare your portfolio CAGR against a benchmark (e.g., S&P 500 at ~10%) to see if you are outperforming",
      "A balanced portfolio (60% stocks, 40% bonds) has historically delivered 7-8% CAGR",
      "Rebalancing your portfolio annually helps maintain your target risk level and can improve long-term CAGR",
    ],
    faqs: [
      { q: "How do I calculate my portfolio's CAGR?", a: "Use the beginning portfolio value, ending portfolio value, and the number of years. CAGR = (Ending Value / Beginning Value)^(1/Years) - 1. For example, $50,000 growing to $95,000 over 5 years = (95000/50000)^(1/5) - 1 = 13.7% CAGR." },
    ],
  },

  // ── Break-Even Variants ───────────────────────────
  {
    slug: "break-even",
    variant: "small-business",
    name: "Small Business Break-Even Calculator",
    title: "Free Small Business Break-Even Calculator — When Will You Be Profitable?",
    description: "Calculate the break-even point for your small business. See how many units or how much revenue you need to cover all fixed and variable costs.",
    keywords: ["small business break-even calculator", "break-even point calculator", "business profitability calculator", "when will my business break even", "break-even analysis tool"],
    defaults: { fixedCosts: 5000, pricePerUnit: 50, variableCostPerUnit: 20 },
    intro: "Every small business owner needs to know their break-even point — the exact number of sales where revenue covers all costs. This calculator helps you determine how many units you need to sell (or how much revenue you need to earn) to stop losing money and start making profit.",
    tips: [
      "Reduce your break-even point by lowering fixed costs (negotiate rent, go remote) or increasing your margin per unit",
      "Calculate break-even for each product line separately — some products may be dragging down profitability",
      "Review your break-even point quarterly as costs and prices change",
    ],
    faqs: [
      { q: "How do I calculate the break-even point?", a: "Break-even units = Fixed Costs / (Price per Unit - Variable Cost per Unit). For example: $5,000 fixed costs / ($50 price - $20 variable cost) = 167 units. You need to sell 167 units per month to break even." },
      { q: "What are fixed costs vs variable costs?", a: "Fixed costs stay the same regardless of sales (rent, salaries, insurance, software). Variable costs change with each sale (materials, shipping, transaction fees). Understanding this split is key to accurate break-even analysis." },
    ],
  },
  {
    slug: "break-even",
    variant: "startup",
    name: "Startup Break-Even Calculator",
    title: "Free Startup Break-Even Calculator — When Does Your Startup Turn Profitable?",
    description: "Calculate when your startup will break even and become profitable. Factor in burn rate, revenue growth, and initial investment to see your runway.",
    keywords: ["startup break-even calculator", "startup profitability calculator", "startup runway calculator", "startup burn rate calculator", "when will my startup be profitable"],
    defaults: { fixedCosts: 25000, pricePerUnit: 99, variableCostPerUnit: 15 },
    intro: "For startups, reaching break-even means you no longer need external funding to survive. This calculator helps you determine how many customers or how much monthly recurring revenue (MRR) you need to cover your burn rate and reach profitability.",
    tips: [
      "Most startups take 18-24 months to reach break-even — plan your runway accordingly",
      "SaaS startups should track months to break-even on customer acquisition cost (CAC payback period)",
      "Reaching break-even doesn't mean you should stop fundraising — growth often requires continued investment",
    ],
    faqs: [
      { q: "How long does it take a startup to break even?", a: "It varies enormously by industry. SaaS startups: typically 18-36 months. E-commerce: 12-24 months. Hardware startups: 2-4 years. The key metric is burn rate vs revenue growth — if revenue is growing faster than costs, you'll reach break-even." },
    ],
  },
  {
    slug: "break-even",
    variant: "ecommerce",
    name: "E-commerce Break-Even Calculator",
    title: "Free E-commerce Break-Even Calculator — Online Store Profitability",
    description: "Calculate the break-even point for your online store. Factor in product costs, shipping, platform fees, and advertising to find your profitability threshold.",
    keywords: ["ecommerce break-even calculator", "online store break-even", "ecommerce profitability calculator", "online business break-even", "Shopify break-even calculator"],
    defaults: { fixedCosts: 3000, pricePerUnit: 45, variableCostPerUnit: 22 },
    intro: "E-commerce businesses have unique cost structures — product costs, shipping, platform fees (Shopify, Amazon), payment processing, and advertising. This calculator helps you find exactly how many orders you need per month to cover all costs and start making profit.",
    tips: [
      "Include ALL variable costs per order: product cost + shipping + platform fees (2-15%) + payment processing (2.9%) + packaging",
      "Customer acquisition cost (CAC) from ads is often the largest variable cost — track it carefully",
      "Free shipping isn't free for you — factor it into your pricing or set a minimum order threshold",
    ],
    faqs: [
      { q: "What is a typical profit margin for e-commerce?", a: "Net profit margins for e-commerce typically range from 5-20%. Fashion/apparel: 4-13%. Beauty/cosmetics: 15-25%. Electronics: 2-5%. High margins come from private label products, low competition, and strong branding." },
    ],
  },

  // ── Profit Margin Variants ────────────────────────
  {
    slug: "profit-margin",
    variant: "retail",
    name: "Retail Profit Margin Calculator",
    title: "Free Retail Profit Margin Calculator — Store Markup & Margin",
    description: "Calculate retail profit margins and markups. See gross margin, net margin, and markup percentage for your retail products.",
    keywords: ["retail profit margin calculator", "retail markup calculator", "store profit margin", "retail margin calculator", "product margin calculator"],
    defaults: { revenue: 10000, costOfGoods: 6000, operatingExpenses: 2500 },
    intro: "Retail profit margins vary widely by product category — from 2-5% for groceries to 50-70% for jewelry. This calculator helps you determine your gross and net profit margins, and set the right markup to hit your profitability targets.",
    tips: [
      "Gross margin vs net margin: gross margin excludes overhead (rent, staff); net margin includes everything",
      "Markup and margin are NOT the same: a 50% markup equals a 33.3% margin",
      "Healthy retail gross margins: clothing 50-60%, electronics 15-25%, groceries 25-35%, jewelry 50-70%",
    ],
    faqs: [
      { q: "What is the difference between markup and margin?", a: "Markup is the percentage added to cost: (Price - Cost) / Cost × 100. Margin is the percentage of the selling price that is profit: (Price - Cost) / Price × 100. A product costing $60 sold for $100 has a 67% markup but a 40% margin." },
      { q: "What is a good profit margin for retail?", a: "Gross margins: 50%+ is strong for most retail. Net margins: 5-10% is typical for brick-and-mortar retail. Online retail can achieve higher net margins (10-20%) due to lower overhead." },
    ],
  },
  {
    slug: "profit-margin",
    variant: "ecommerce",
    name: "E-commerce Profit Margin Calculator",
    title: "Free E-commerce Profit Margin Calculator — Online Store Margins",
    description: "Calculate profit margins for your online store. Include product costs, shipping, platform fees, and advertising to see true profitability.",
    keywords: ["ecommerce profit margin calculator", "online store margin", "ecommerce margin calculator", "online business profit margin", "dropshipping margin calculator"],
    defaults: { revenue: 15000, costOfGoods: 7000, operatingExpenses: 5000 },
    intro: "E-commerce margins look different from traditional retail — you have lower rent costs but higher shipping, advertising, and platform fees. This calculator helps you calculate your true profit margin after accounting for all the costs unique to selling online.",
    tips: [
      "Don't forget platform fees: Amazon takes 8-15%, Shopify charges transaction fees, payment processors charge 2.9%",
      "Customer acquisition cost (CAC) through ads is often the margin killer — track return on ad spend (ROAS) closely",
      "Private label products typically offer 40-60% margins vs 10-30% for reselling branded products",
    ],
    faqs: [
      { q: "What is a good profit margin for e-commerce?", a: "Gross margins of 40-60% are healthy for e-commerce. After all expenses (shipping, ads, platform fees, returns), a net margin of 10-20% is considered good. Dropshipping margins are typically lower (15-30% gross) due to higher per-unit costs." },
    ],
  },
  {
    slug: "profit-margin",
    variant: "service-business",
    name: "Service Business Profit Margin Calculator",
    title: "Free Service Business Profit Margin Calculator — Consulting & Agency Margins",
    description: "Calculate profit margins for your service business. See margins for consulting, agencies, freelancing, and professional services.",
    keywords: ["service business profit margin", "consulting profit margin calculator", "agency profit margin", "professional services margin", "service business margin calculator"],
    defaults: { revenue: 20000, costOfGoods: 5000, operatingExpenses: 9000 },
    intro: "Service businesses (consulting, agencies, law firms, design studios) typically have higher margins than product businesses because there is no physical inventory. Your main costs are labor and overhead. This calculator helps you track and optimize your service margins.",
    tips: [
      "Service businesses should target 50-70% gross margins — your main cost is labor",
      "Net margins of 15-30% are typical for well-run service businesses",
      "Productize your services (fixed-price packages) to improve margins and scalability over hourly billing",
    ],
    faqs: [
      { q: "What is a good profit margin for a service business?", a: "Gross margins of 50-70% are standard (since you have no inventory costs). Net margins: solo consultants can achieve 40-60%, agencies typically 10-20%, law firms 30-50%. The key is managing labor costs and utilization rates." },
    ],
  },

  // ── Calorie Variants ──────────────────────────────
  {
    slug: "calorie",
    variant: "weight-loss",
    name: "Calorie Calculator for Weight Loss",
    title: "Free Calorie Calculator for Weight Loss — Daily Calorie Deficit",
    description: "Calculate how many calories you need to eat daily to lose weight. See your calorie deficit, projected weight loss timeline, and macro breakdown.",
    keywords: ["calorie calculator weight loss", "weight loss calorie calculator", "calorie deficit calculator", "how many calories to lose weight", "daily calories for weight loss"],
    defaults: { goal: "lose" },
    intro: "To lose weight, you need to eat fewer calories than you burn — creating a calorie deficit. A deficit of 500 calories per day leads to roughly 1 pound (0.45 kg) of fat loss per week. This calculator computes your exact daily calorie target based on your stats and activity level.",
    tips: [
      "A 500-calorie daily deficit leads to ~1 lb/week fat loss; a 1,000-calorie deficit leads to ~2 lbs/week (the safe maximum)",
      "Never go below 1,200 calories/day (women) or 1,500 calories/day (men) without medical supervision",
      "Protein intake of 0.7-1g per pound of body weight helps preserve muscle during a calorie deficit",
    ],
    faqs: [
      { q: "How many calories should I eat to lose weight?", a: "Calculate your TDEE (Total Daily Energy Expenditure) and subtract 500 for steady weight loss of ~1 lb/week. For example, if your TDEE is 2,200, eat 1,700 calories/day. Never go below 1,200 (women) or 1,500 (men) without medical guidance." },
      { q: "How fast can I safely lose weight?", a: "1-2 pounds (0.5-1 kg) per week is considered safe and sustainable. Faster weight loss often leads to muscle loss, nutritional deficiencies, and a higher chance of regaining the weight." },
    ],
  },
  {
    slug: "calorie",
    variant: "weight-gain",
    name: "Calorie Calculator for Weight Gain",
    title: "Free Calorie Calculator for Weight Gain — Muscle Building Calories",
    description: "Calculate how many calories you need to eat daily to gain weight and build muscle. See your calorie surplus and macro targets.",
    keywords: ["calorie calculator weight gain", "bulking calorie calculator", "muscle building calorie calculator", "how many calories to gain weight", "weight gain diet calculator"],
    defaults: { goal: "gain" },
    intro: "To gain weight — especially lean muscle — you need to eat more calories than you burn (a calorie surplus). A surplus of 300-500 calories per day combined with strength training promotes muscle growth while minimizing fat gain.",
    tips: [
      "A surplus of 300-500 calories/day is ideal for lean muscle gain (about 0.5-1 lb/week)",
      "Prioritize protein: aim for 1.0-1.2g per pound of body weight when building muscle",
      "Combine your calorie surplus with progressive resistance training for best results",
    ],
    faqs: [
      { q: "How many calories should I eat to gain muscle?", a: "Eat your TDEE + 300-500 calories/day. For example, if your TDEE is 2,400, eat 2,700-2,900 calories/day with at least 1g protein per pound of body weight. This promotes lean muscle growth of 0.5-1 lb per week." },
    ],
  },
  {
    slug: "calorie",
    variant: "maintenance",
    name: "Maintenance Calorie Calculator",
    title: "Free Maintenance Calorie Calculator — TDEE & Daily Calorie Needs",
    description: "Calculate your maintenance calories (TDEE) — the exact number of calories you need to maintain your current weight. Based on age, gender, height, weight, and activity.",
    keywords: ["maintenance calorie calculator", "TDEE calculator", "daily calorie needs calculator", "how many calories to maintain weight", "total daily energy expenditure"],
    defaults: { goal: "maintain" },
    intro: "Your maintenance calories (also called TDEE — Total Daily Energy Expenditure) is the number of calories you burn per day including all activity. Eating this amount keeps your weight stable. It is the starting point for any weight loss or gain plan.",
    tips: [
      "TDEE = BMR (base metabolism) × Activity Multiplier — your activity level has a huge impact",
      "Your TDEE changes as your weight, age, and activity level change — recalculate every few months",
      "Track your weight for 2-3 weeks at your calculated TDEE to verify accuracy, then adjust",
    ],
    faqs: [
      { q: "What is the difference between BMR and TDEE?", a: "BMR (Basal Metabolic Rate) is the calories you burn at complete rest — just keeping organs functioning. TDEE (Total Daily Energy Expenditure) includes BMR plus all physical activity, digestion, and daily movement. TDEE is typically 1.4-2.4x your BMR." },
    ],
  },

  // ── Pregnancy Variants ────────────────────────────
  {
    slug: "pregnancy",
    variant: "trimester-tracker",
    name: "Pregnancy Trimester Tracker",
    title: "Free Pregnancy Trimester Tracker — Week-by-Week Pregnancy Calendar",
    description: "Track your pregnancy week by week. See which trimester you are in, your due date, key milestones, and what to expect each week.",
    keywords: ["pregnancy trimester tracker", "pregnancy week tracker", "pregnancy calendar", "which trimester am I in", "pregnancy week by week", "pregnancy milestone tracker"],
    defaults: {},
    intro: "Track your pregnancy journey week by week across all three trimesters. Enter your last menstrual period (LMP) or due date to see exactly how far along you are, which trimester you are in, and what developmental milestones are happening right now.",
    tips: [
      "First trimester (weeks 1-12): organ formation; take folic acid, avoid alcohol and raw fish",
      "Second trimester (weeks 13-26): often called the 'honeymoon trimester' — energy returns and morning sickness fades",
      "Third trimester (weeks 27-40): baby gains most weight; start preparing your hospital bag by week 35",
    ],
    faqs: [
      { q: "How are pregnancy weeks counted?", a: "Pregnancy is counted from the first day of your last menstrual period (LMP), not from conception. So when you are '4 weeks pregnant,' the actual embryo is about 2 weeks old. Full term is 40 weeks (280 days) from LMP." },
      { q: "When does each trimester start?", a: "First trimester: weeks 1-12. Second trimester: weeks 13-26. Third trimester: weeks 27-40. Each trimester is roughly 13 weeks long." },
    ],
  },
  {
    slug: "pregnancy",
    variant: "conception-date",
    name: "Conception Date Calculator",
    title: "Free Conception Date Calculator — When Did I Conceive?",
    description: "Calculate your likely conception date based on your due date or last menstrual period. Estimate when fertilization occurred.",
    keywords: ["conception date calculator", "when did I conceive", "conception calculator", "date of conception calculator", "when was my baby conceived"],
    defaults: {},
    intro: "This calculator estimates when conception likely occurred based on your due date or last menstrual period. Conception typically happens during ovulation, about 14 days after the start of your last period — though the exact timing varies by individual cycle length.",
    tips: [
      "Conception typically occurs during ovulation, roughly 14 days after the first day of your last period (for a 28-day cycle)",
      "Sperm can survive up to 5 days in the reproductive tract, so conception could have occurred days before ovulation",
      "An early ultrasound (6-8 weeks) provides the most accurate dating if your cycle is irregular",
    ],
    faqs: [
      { q: "How accurate is a conception date calculator?", a: "It provides an estimate within a 5-7 day window. The exact date depends on when you ovulated and when fertilization occurred. Women with irregular cycles may have wider variability. Early ultrasound dating is more precise." },
    ],
  },

  // ── Body Fat Variants ─────────────────────────────
  {
    slug: "body-fat",
    variant: "men",
    name: "Body Fat Calculator for Men",
    title: "Free Body Fat Calculator for Men — Estimate Your Body Fat Percentage",
    description: "Calculate your body fat percentage using measurements. See your body fat category, lean mass, and fat mass based on the US Navy method.",
    keywords: ["body fat calculator men", "body fat percentage men", "male body fat calculator", "men body fat estimate", "body fat percentage calculator male"],
    defaults: { gender: "male" },
    intro: "Estimate your body fat percentage using simple body measurements. This calculator uses the US Navy method, which requires your height, waist, and neck circumference. For men, healthy body fat ranges from 10-20%, depending on age and fitness goals.",
    tips: [
      "Essential body fat for men is 2-5% — going below this is dangerous. Athletes: 6-13%, Fit: 14-17%, Average: 18-24%, Obese: 25%+",
      "Waist circumference above 40 inches (102 cm) significantly increases health risks regardless of overall weight",
      "Body fat percentage is a better health indicator than BMI — a muscular person can have a high BMI but low body fat",
    ],
    faqs: [
      { q: "What is a healthy body fat percentage for men?", a: "Athletes: 6-13%. Fitness enthusiasts: 14-17%. Healthy average: 18-24%. Above 25% is considered obese. These ranges shift slightly with age — a healthy 50-year-old may be in the 18-22% range." },
    ],
  },
  {
    slug: "body-fat",
    variant: "women",
    name: "Body Fat Calculator for Women",
    title: "Free Body Fat Calculator for Women — Estimate Your Body Fat Percentage",
    description: "Calculate your body fat percentage as a woman using simple measurements. See your body fat category, lean mass, and health recommendations.",
    keywords: ["body fat calculator women", "body fat percentage women", "female body fat calculator", "women body fat estimate", "body fat percentage calculator female"],
    defaults: { gender: "female" },
    intro: "Estimate your body fat percentage using the US Navy measurement method. Women naturally carry more essential fat than men (for reproductive health), so healthy ranges are higher. This calculator requires your height, waist, hip, and neck measurements.",
    tips: [
      "Essential body fat for women is 10-13% — going below is dangerous. Athletes: 14-20%, Fit: 21-24%, Average: 25-31%, Obese: 32%+",
      "Women naturally carry more body fat than men due to hormones and reproductive biology — comparing directly is misleading",
      "Hip-to-waist ratio is another important health metric — a ratio above 0.85 for women indicates higher health risk",
    ],
    faqs: [
      { q: "What is a healthy body fat percentage for women?", a: "Athletes: 14-20%. Fitness enthusiasts: 21-24%. Healthy average: 25-31%. Above 32% is considered obese. Women need more essential fat (10-13%) than men (2-5%) for hormonal and reproductive health." },
    ],
  },
  {
    slug: "body-fat",
    variant: "athletes",
    name: "Athlete Body Fat Calculator",
    title: "Free Athlete Body Fat Calculator — Sports Performance Body Composition",
    description: "Calculate body fat percentage for athletes and active people. See sport-specific body fat targets and performance recommendations.",
    keywords: ["athlete body fat calculator", "sports body fat calculator", "athlete body composition", "body fat for athletes", "athletic body fat percentage"],
    defaults: {},
    intro: "Athletes require different body fat levels depending on their sport. Endurance athletes, gymnasts, and sprinters tend to be leaner, while football linemen and sumo wrestlers carry more mass. This calculator estimates your body fat and shows how it compares to elite athletes in various sports.",
    tips: [
      "Optimal body fat varies by sport: marathon runners 5-10%, swimmers 8-15%, football players 10-25%",
      "Going too low on body fat impairs performance — underfueling leads to hormonal imbalances and injury risk",
      "DEXA scan is the gold standard for athlete body composition analysis — more accurate than skinfold or measurement methods",
    ],
    faqs: [
      { q: "What body fat percentage do elite athletes have?", a: "It varies by sport. Male sprinters: 6-8%. Male distance runners: 5-10%. Female gymnasts: 12-16%. Male football (soccer): 8-12%. Male swimmers: 8-12%. Female swimmers: 14-20%. Strength sports (powerlifting): 12-20%." },
    ],
  },

  // ── Water Intake Variants ─────────────────────────
  {
    slug: "water-intake",
    variant: "athletes",
    name: "Water Intake Calculator for Athletes",
    title: "Free Water Intake Calculator for Athletes — Sports Hydration Guide",
    description: "Calculate daily water intake for athletes and active people. See hydration needs based on exercise intensity, duration, and sweat rate.",
    keywords: ["water intake for athletes", "athlete hydration calculator", "sports hydration calculator", "how much water for exercise", "workout water intake"],
    defaults: { activityLevel: "very-active" },
    intro: "Athletes lose 0.5-2 liters of water per hour through sweat during intense exercise. Proper hydration directly affects performance — even 2% dehydration reduces endurance by 10-20%. This calculator estimates your daily water needs based on training intensity and duration.",
    tips: [
      "Drink 16-20 oz (500-600 ml) of water 2-3 hours before exercise, then 7-10 oz every 10-20 minutes during",
      "For workouts over 60 minutes, add electrolytes (sodium, potassium) — plain water isn't enough",
      "Monitor your urine color: pale yellow means well-hydrated, dark yellow means you need more water",
    ],
    faqs: [
      { q: "How much water should an athlete drink per day?", a: "Athletes typically need 3-5 liters (100-170 oz) per day depending on body size, climate, and training intensity. During heavy training, you may need up to 1 liter per hour of exercise on top of your baseline needs." },
    ],
  },
  {
    slug: "water-intake",
    variant: "hot-climate",
    name: "Water Intake Calculator for Hot Climates",
    title: "Free Water Intake Calculator for Hot Weather — Hydration in Heat",
    description: "Calculate how much water you need in hot weather. Adjust your hydration for temperature, humidity, and sun exposure to prevent dehydration.",
    keywords: ["water intake hot weather", "hydration in heat", "how much water in hot climate", "summer hydration calculator", "water intake hot climate"],
    defaults: { climate: "hot" },
    intro: "In hot climates, your body loses significantly more water through sweating — up to 1-2 liters per hour in extreme heat. Dehydration risk is much higher in summer or tropical climates. This calculator adjusts your daily water intake based on temperature and activity level.",
    tips: [
      "In temperatures above 90°F (32°C), increase your water intake by 50-100% compared to normal",
      "High humidity makes heat worse — your sweat doesn't evaporate efficiently, so you sweat more",
      "Early signs of dehydration: dark urine, headache, fatigue, dry mouth. Don't wait until you feel thirsty",
    ],
    faqs: [
      { q: "How much extra water do I need in hot weather?", a: "In hot weather (above 85°F/30°C), add 1-2 liters to your baseline water intake. If you are active outdoors in extreme heat, you may need 4-6 liters total per day. Always carry water and drink before you feel thirsty." },
    ],
  },
  {
    slug: "water-intake",
    variant: "pregnancy",
    name: "Water Intake Calculator for Pregnancy",
    title: "Free Water Intake Calculator for Pregnancy — Hydration During Pregnancy",
    description: "Calculate recommended water intake during pregnancy. Stay properly hydrated for your health and baby's development.",
    keywords: ["water intake pregnancy", "pregnancy hydration calculator", "how much water during pregnancy", "pregnant water intake", "hydration for pregnant women"],
    defaults: {},
    intro: "Proper hydration during pregnancy is crucial — water helps form the amniotic fluid, produces extra blood volume, carries nutrients to the baby, and reduces common issues like constipation and swelling. Pregnant women need about 25-30% more water than non-pregnant women.",
    tips: [
      "Aim for at least 10 cups (2.3 liters) of water daily during pregnancy — more if active or in hot weather",
      "Dehydration during pregnancy can trigger Braxton Hicks contractions and reduce amniotic fluid levels",
      "If plain water causes nausea, try adding lemon, cucumber, or drinking sparkling water",
    ],
    faqs: [
      { q: "How much water should I drink while pregnant?", a: "The general recommendation is 8-12 cups (2-3 liters) per day during pregnancy. During the third trimester and while breastfeeding, aim for the higher end. Signs you need more: dark urine, dry skin, headaches, or infrequent urination." },
    ],
  },

  // ── Heart Rate Variants ───────────────────────────
  {
    slug: "heart-rate",
    variant: "fat-burn",
    name: "Fat Burn Heart Rate Calculator",
    title: "Free Fat Burn Heart Rate Calculator — Optimal Zone for Fat Loss",
    description: "Calculate your fat-burning heart rate zone. See the exact heart rate range where your body burns the highest percentage of calories from fat.",
    keywords: ["fat burn heart rate calculator", "fat burning zone calculator", "optimal heart rate for fat loss", "fat burn zone", "heart rate for fat burning"],
    defaults: { zone: "fat-burn" },
    intro: "The fat-burning zone is typically 60-70% of your maximum heart rate. At this intensity, your body burns a higher percentage of calories from fat (vs carbohydrates). While higher-intensity exercise burns more total calories, the fat-burn zone is ideal for longer, sustainable workouts.",
    tips: [
      "Fat-burning zone: 60-70% of max heart rate. For a 30-year-old (max HR ~190), that is 114-133 bpm",
      "While the fat-burn zone burns more fat proportionally, higher intensity burns more total calories overall",
      "Walking briskly, easy cycling, and light jogging are typical fat-burn zone activities",
    ],
    faqs: [
      { q: "What is the best heart rate for fat burning?", a: "60-70% of your maximum heart rate. Max HR ≈ 220 - age. So for a 35-year-old: max HR = 185, fat-burn zone = 111-130 bpm. This zone uses fat as the primary fuel source, making it ideal for long, steady workouts." },
      { q: "Is the fat-burning zone better for weight loss?", a: "Not necessarily. While you burn a higher percentage of fat at lower intensity, higher-intensity exercise burns more total calories (and total fat) per hour. The best exercise for weight loss is whatever you can do consistently." },
    ],
  },
  {
    slug: "heart-rate",
    variant: "cardio-training",
    name: "Cardio Heart Rate Calculator",
    title: "Free Cardio Heart Rate Calculator — Aerobic Training Zone",
    description: "Calculate your optimal cardio heart rate zone for aerobic fitness. See the target heart rate range for improving cardiovascular endurance.",
    keywords: ["cardio heart rate calculator", "aerobic heart rate zone", "cardio training zone", "target heart rate cardio", "aerobic training heart rate"],
    defaults: { zone: "cardio" },
    intro: "The cardio (aerobic) zone is 70-85% of your maximum heart rate — the sweet spot for improving cardiovascular fitness, building endurance, and burning significant calories. This is the zone used for most running, cycling, and swimming training.",
    tips: [
      "Cardio zone: 70-85% of max heart rate. For a 30-year-old, that is 133-162 bpm",
      "The 'talk test' works well: in the cardio zone, you can speak in short sentences but not hold a full conversation",
      "Training in the aerobic zone 3-5 times per week for 30+ minutes significantly improves cardiovascular health",
    ],
    faqs: [
      { q: "What is the ideal heart rate for cardio training?", a: "70-85% of your maximum heart rate (220 - age). For a 40-year-old: max HR = 180, cardio zone = 126-153 bpm. This zone improves heart efficiency, increases VO2 max, and builds endurance." },
    ],
  },
  {
    slug: "heart-rate",
    variant: "hiit",
    name: "HIIT Heart Rate Calculator",
    title: "Free HIIT Heart Rate Calculator — High-Intensity Interval Training Zones",
    description: "Calculate your target heart rate for HIIT workouts. See work and recovery zones for maximum calorie burn and fitness gains.",
    keywords: ["HIIT heart rate calculator", "HIIT zone calculator", "high intensity heart rate", "HIIT target heart rate", "interval training heart rate"],
    defaults: { zone: "hiit" },
    intro: "HIIT (High-Intensity Interval Training) alternates between intense bursts at 85-95% of max heart rate and recovery periods at 60-70%. This calculator shows both your work and recovery heart rate targets for an effective HIIT session.",
    tips: [
      "HIIT work intervals: 85-95% of max HR. Recovery intervals: 60-70% of max HR",
      "A typical HIIT session lasts 15-30 minutes — shorter than steady-state cardio but often more effective for fat loss",
      "HIIT creates an 'afterburn effect' (EPOC) — you continue burning extra calories for 24-48 hours after the workout",
    ],
    faqs: [
      { q: "What heart rate should I target during HIIT?", a: "Work intervals: 85-95% of max heart rate (e.g., 162-181 bpm for a 30-year-old). Recovery intervals: 60-70% (114-133 bpm). You should feel breathless during work intervals and recover enough to speak during rest intervals." },
      { q: "How often should I do HIIT?", a: "2-3 times per week with at least 48 hours between sessions. HIIT is very demanding on the body — overdoing it leads to overtraining, injury, and burnout. Alternate with steady-state cardio and strength training." },
    ],
  },

  // ── Date Variants ─────────────────────────────────
  {
    slug: "date",
    variant: "days-until-christmas",
    name: "Days Until Christmas Calculator",
    title: "Free Days Until Christmas Calculator — Christmas Countdown",
    description: "See exactly how many days, hours, and minutes until Christmas. Get a live countdown to December 25th with a festive holiday countdown timer.",
    keywords: ["days until Christmas", "Christmas countdown", "how many days until Christmas", "Christmas countdown timer", "days to Christmas", "sleeps until Christmas"],
    defaults: { targetDate: "2026-12-25" },
    intro: "How many days until Christmas? This calculator shows you the exact countdown to December 25th in days, hours, minutes, and seconds. Perfect for building excitement and planning your holiday shopping, travel, and celebrations.",
    tips: [
      "Start holiday shopping early — most deals begin in November, but popular items sell out fast",
      "Book holiday travel at least 6-8 weeks in advance for the best prices on flights and hotels",
      "Christmas is celebrated on December 25 in most countries, but some Orthodox churches celebrate on January 7",
    ],
    faqs: [
      { q: "When is Christmas?", a: "Christmas Day is December 25th every year. It falls on a different day of the week each year. In many countries, December 24 (Christmas Eve) and December 26 (Boxing Day) are also holidays." },
    ],
  },
  {
    slug: "date",
    variant: "days-until-new-year",
    name: "Days Until New Year Calculator",
    title: "Free Days Until New Year Calculator — New Year Countdown",
    description: "See exactly how many days, hours, and minutes until New Year's Day. Live countdown timer to January 1st for your celebrations.",
    keywords: ["days until New Year", "New Year countdown", "how many days until New Year", "New Year countdown timer", "days to January 1", "New Year's Eve countdown"],
    defaults: { targetDate: "2027-01-01" },
    intro: "Count down the days, hours, and minutes until New Year's Day (January 1st). Whether you are planning a New Year's Eve party, setting resolutions, or booking travel, this countdown helps you know exactly how much time you have left.",
    tips: [
      "New Year's Eve is the most expensive night for restaurants and hotels — book well in advance",
      "Time zones mean New Year arrives at different times: Kiribati celebrates first, American Samoa last",
      "Only 8% of people actually achieve their New Year's resolutions — set specific, measurable goals for better odds",
    ],
    faqs: [
      { q: "When is New Year's Day?", a: "New Year's Day is January 1st on the Gregorian calendar used worldwide. Different cultures celebrate their new year on different dates — Chinese New Year (Jan/Feb), Persian Nowruz (March 20-21), Jewish Rosh Hashanah (Sept/Oct)." },
    ],
  },
  {
    slug: "date",
    variant: "business-days",
    name: "Business Days Calculator",
    title: "Free Business Days Calculator — Count Working Days Between Dates",
    description: "Calculate the number of business days (working days) between two dates. Excludes weekends and optionally holidays. Great for project planning.",
    keywords: ["business days calculator", "working days calculator", "count business days", "workdays between dates", "number of business days"],
    defaults: {},
    intro: "Calculate the number of business days (Monday-Friday) between any two dates. This is essential for project deadlines, delivery estimates, contract terms, and payroll calculations that specify 'business days' rather than calendar days.",
    tips: [
      "Business days typically exclude Saturdays and Sundays — but some countries use Friday-Saturday as the weekend",
      "Standard business year: approximately 252 trading days (365 - weekends - ~10 public holidays)",
      "When a contract says '10 business days,' that is actually 14 calendar days (2 full weeks)",
    ],
    faqs: [
      { q: "How many business days are in a year?", a: "Approximately 260 (52 weeks × 5 days), minus public holidays. In the US, there are about 250-252 working days per year. The UK has about 253, and most EU countries have 250-255." },
    ],
  },

  // ── Timezone Variants ─────────────────────────────
  {
    slug: "timezone",
    variant: "est-to-ist",
    name: "EST to IST Converter",
    title: "Free EST to IST Converter — Eastern Time to India Standard Time",
    description: "Convert Eastern Standard Time (EST) to India Standard Time (IST). See the current time in both zones and plan meetings across US-India time zones.",
    keywords: ["EST to IST", "Eastern Time to IST", "EST to IST converter", "New York to India time", "US to India time difference"],
    defaults: { fromZone: "EST", toZone: "IST" },
    intro: "Convert between Eastern Standard Time (EST/EDT, UTC-5/-4) and India Standard Time (IST, UTC+5:30). The time difference is 10.5 hours (EST to IST) or 9.5 hours during US daylight saving time. This is one of the most searched timezone conversions due to business ties between the US and India.",
    tips: [
      "IST is 10.5 hours ahead of EST (standard) and 9.5 hours ahead during EDT (daylight saving)",
      "Best overlap for US-India meetings: 8-10 AM EST = 6:30-8:30 PM IST",
      "The US switches to daylight saving time in March and back in November — India does not observe DST",
    ],
    faqs: [
      { q: "What is the time difference between EST and IST?", a: "IST is 10 hours and 30 minutes ahead of EST. When it's 9:00 AM in New York (EST), it's 7:30 PM in India (IST). During daylight saving (EDT, March-November), the difference is 9 hours and 30 minutes." },
    ],
  },
  {
    slug: "timezone",
    variant: "pst-to-gmt",
    name: "PST to GMT Converter",
    title: "Free PST to GMT Converter — Pacific Time to Greenwich Mean Time",
    description: "Convert Pacific Standard Time (PST) to Greenwich Mean Time (GMT/UTC). See the time difference between the US West Coast and the UK/UTC.",
    keywords: ["PST to GMT", "Pacific Time to GMT", "PST to GMT converter", "PST to UTC", "California to UK time", "Los Angeles to London time"],
    defaults: { fromZone: "PST", toZone: "GMT" },
    intro: "Convert between Pacific Standard Time (PST/PDT, UTC-8/-7) and Greenwich Mean Time (GMT/UTC). GMT is 8 hours ahead of PST. This conversion is essential for scheduling between the US West Coast and the UK, Europe, and Africa.",
    tips: [
      "GMT is 8 hours ahead of PST (standard) and 7 hours ahead during PDT (US daylight saving)",
      "The UK also shifts clocks (BST, UTC+1) from March to October — so the gap changes twice a year",
      "Best meeting times for PST-GMT overlap: 8-10 AM PST = 4-6 PM GMT",
    ],
    faqs: [
      { q: "What is the time difference between PST and GMT?", a: "GMT is 8 hours ahead of PST. When it's 9:00 AM in Los Angeles (PST), it's 5:00 PM in London (GMT). During PDT (March-November), the difference drops to 7 hours — but the UK also shifts to BST (UTC+1), making it 8 hours again for part of the year." },
    ],
  },
  {
    slug: "timezone",
    variant: "est-to-gmt",
    name: "EST to GMT Converter",
    title: "Free EST to GMT Converter — Eastern Time to Greenwich Mean Time",
    description: "Convert Eastern Standard Time (EST) to Greenwich Mean Time (GMT/UTC). Plan calls and meetings between the US East Coast and the UK or Europe.",
    keywords: ["EST to GMT", "Eastern Time to GMT", "EST to GMT converter", "EST to UTC", "New York to London time", "EST to UK time"],
    defaults: { fromZone: "EST", toZone: "GMT" },
    intro: "Convert between Eastern Standard Time (EST/EDT, UTC-5/-4) and Greenwich Mean Time (GMT/UTC). GMT is 5 hours ahead of EST. This is one of the most common timezone conversions for transatlantic business, travel, and communication.",
    tips: [
      "GMT is 5 hours ahead of EST. During EDT (March-November), the difference drops to 4 hours",
      "Both the US and UK shift clocks — but on different dates, creating a few weeks where the gap is unusual",
      "Best overlap for US-UK meetings: 9 AM-12 PM EST = 2-5 PM GMT",
    ],
    faqs: [
      { q: "What is the time difference between EST and GMT?", a: "GMT is 5 hours ahead of EST. When it's 10:00 AM in New York (EST), it's 3:00 PM in London (GMT). During daylight saving (EDT), the gap shrinks to 4 hours — but the UK also shifts to BST, restoring the 5-hour gap for most of the DST period." },
    ],
  },

  // ── GPA Variants ──────────────────────────────────
  {
    slug: "gpa",
    variant: "college",
    name: "College GPA Calculator",
    title: "Free College GPA Calculator — Calculate Your University GPA",
    description: "Calculate your college GPA on a 4.0 scale. Enter your courses, credits, and grades to see your semester and cumulative GPA instantly.",
    keywords: ["college GPA calculator", "university GPA calculator", "GPA calculator 4.0 scale", "college grade calculator", "semester GPA calculator"],
    defaults: { scale: "college" },
    intro: "Calculate your college or university GPA on the standard 4.0 scale. Enter each course with its credit hours and letter grade, and the calculator computes both your semester GPA and cumulative GPA. Essential for graduate school applications, scholarships, and Latin honors eligibility.",
    tips: [
      "The standard 4.0 scale: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0. Some schools use A+=4.3",
      "A GPA of 3.5+ is considered Dean's List at most universities. 3.7+ is often magna cum laude",
      "Courses with more credit hours have a bigger impact on your GPA — prioritize performance in 4-credit classes",
    ],
    faqs: [
      { q: "What is a good GPA in college?", a: "3.0 (B average) is generally considered good. 3.5+ is very good (often qualifies for Dean's List). 3.7+ is excellent. For graduate school: top programs expect 3.5+. For most jobs, 3.0+ is sufficient — work experience matters more." },
      { q: "How is college GPA calculated?", a: "Multiply each course's grade points by its credit hours, sum all results, then divide by total credit hours. Example: A (4.0) in a 3-credit course + B (3.0) in a 4-credit course = (12 + 12) / 7 = 3.43 GPA." },
    ],
  },
  {
    slug: "gpa",
    variant: "high-school",
    name: "High School GPA Calculator",
    title: "Free High School GPA Calculator — Calculate Your GPA for College",
    description: "Calculate your high school GPA on a 4.0 scale. Track your grades across all four years and see how your GPA impacts college admissions.",
    keywords: ["high school GPA calculator", "GPA calculator high school", "calculate high school GPA", "GPA for college admissions", "high school grade calculator"],
    defaults: { scale: "high-school" },
    intro: "Calculate your high school GPA to see where you stand for college admissions. Most high schools use a 4.0 unweighted scale, though many also offer a weighted scale (up to 5.0) that gives extra points for AP, IB, and honors classes.",
    tips: [
      "Unweighted GPA uses the standard 4.0 scale. Weighted GPA gives AP/IB classes an extra 1.0 (A in AP = 5.0)",
      "Most selective colleges look at BOTH weighted and unweighted GPA, plus the rigor of your course load",
      "Your GPA from sophomore and junior year matters most for college admissions — but don't slack senior year",
    ],
    faqs: [
      { q: "Do colleges look at weighted or unweighted GPA?", a: "Most colleges consider both, but they especially look at course rigor. A 3.7 unweighted GPA with 8 AP classes is typically viewed more favorably than a 4.0 with no advanced courses. Many colleges recalculate your GPA using their own system." },
    ],
  },
  {
    slug: "gpa",
    variant: "weighted-gpa",
    name: "Weighted GPA Calculator",
    title: "Free Weighted GPA Calculator — AP, IB & Honors Grade Calculator",
    description: "Calculate your weighted GPA including AP, IB, and honors classes. See how advanced courses boost your GPA on a 5.0 scale.",
    keywords: ["weighted GPA calculator", "AP GPA calculator", "IB GPA calculator", "honors GPA calculator", "weighted grade calculator", "5.0 GPA calculator"],
    defaults: { scale: "weighted" },
    intro: "A weighted GPA gives extra grade points for advanced courses: AP and IB classes add 1.0 (so an A = 5.0), and honors classes add 0.5 (A = 4.5). This calculator computes your weighted GPA on a 5.0 scale, rewarding you for taking challenging coursework.",
    tips: [
      "Weighted scale: Regular A=4.0, Honors A=4.5, AP/IB A=5.0. Some schools use different weightings",
      "Taking AP/IB courses even with slightly lower grades can result in a higher weighted GPA than all A's in regular classes",
      "A weighted GPA above 4.0 signals to colleges that you are taking rigorous courses — this matters for admissions",
    ],
    faqs: [
      { q: "How is weighted GPA different from unweighted?", a: "Unweighted GPA uses a 4.0 scale for all classes. Weighted GPA adds bonus points for advanced courses: typically +1.0 for AP/IB and +0.5 for honors. So an A in an AP class is worth 5.0 instead of 4.0. This rewards students who take harder courses." },
    ],
  },

  // ── Unit Converter Variants ───────────────────────
  {
    slug: "unit-converter",
    variant: "km-to-miles",
    name: "Kilometers to Miles Converter",
    title: "Free Kilometers to Miles Converter — km to mi Calculator",
    description: "Convert kilometers to miles instantly. See the exact conversion with formula. Works for any distance — running, driving, or travel planning.",
    keywords: ["km to miles", "kilometers to miles", "km to miles converter", "km to mi", "convert km to miles", "kilometers to miles calculator"],
    defaults: { fromUnit: "km", toUnit: "miles", value: 10 },
    intro: "Convert kilometers to miles quickly and accurately. 1 kilometer equals 0.621371 miles. This conversion is essential for international travelers, runners switching between metric and imperial race distances, and anyone comparing distances across countries.",
    tips: [
      "Quick shortcut: multiply km by 0.6 for a rough conversion (actual factor: 0.621371)",
      "Common running distances: 5K = 3.1 miles, 10K = 6.2 miles, half marathon (21.1K) = 13.1 miles, marathon (42.2K) = 26.2 miles",
      "Most of the world uses kilometers; the US, UK (partially), and a few other countries use miles",
    ],
    faqs: [
      { q: "How many miles is 1 kilometer?", a: "1 kilometer = 0.621371 miles. To convert km to miles, multiply by 0.621371. For example: 100 km = 62.14 miles. A quick approximation: km × 0.6 gives you a close-enough answer." },
    ],
  },
  {
    slug: "unit-converter",
    variant: "kg-to-lbs",
    name: "Kilograms to Pounds Converter",
    title: "Free Kilograms to Pounds Converter — kg to lbs Calculator",
    description: "Convert kilograms to pounds instantly. See the exact conversion with formula. Essential for weight, fitness, and international shipping.",
    keywords: ["kg to lbs", "kilograms to pounds", "kg to pounds converter", "kg to lbs converter", "convert kg to pounds", "kilograms to pounds calculator"],
    defaults: { fromUnit: "kg", toUnit: "lbs", value: 70 },
    intro: "Convert kilograms to pounds easily. 1 kilogram equals 2.20462 pounds. This is one of the most common unit conversions worldwide — used for body weight, luggage limits, shipping, cooking, and fitness tracking across metric and imperial countries.",
    tips: [
      "Quick shortcut: multiply kg by 2.2 for a fast approximation (actual factor: 2.20462)",
      "Airline luggage limits: most international flights allow 23 kg (50.7 lbs) per checked bag",
      "Gym plates: a 20 kg plate = 44 lbs, a 25 kg plate = 55 lbs — useful when traveling between metric and imperial gyms",
    ],
    faqs: [
      { q: "How many pounds is 1 kilogram?", a: "1 kilogram = 2.20462 pounds. To convert kg to lbs, multiply by 2.205. For example: 70 kg = 154.3 lbs. Quick trick: double the kg and add 10% — 70 × 2 = 140, plus 10% (14) = 154." },
    ],
  },
  {
    slug: "unit-converter",
    variant: "celsius-to-fahrenheit",
    name: "Celsius to Fahrenheit Converter",
    title: "Free Celsius to Fahrenheit Converter — Temperature Calculator",
    description: "Convert Celsius to Fahrenheit instantly. See the exact conversion with formula. Essential for weather, cooking, and travel temperature comparisons.",
    keywords: ["celsius to fahrenheit", "C to F converter", "celsius to fahrenheit converter", "temperature converter", "convert celsius to fahrenheit", "celsius to fahrenheit calculator"],
    defaults: { fromUnit: "celsius", toUnit: "fahrenheit", value: 25 },
    intro: "Convert Celsius to Fahrenheit with the formula: F = (C × 9/5) + 32. Most of the world uses Celsius for temperature, while the US uses Fahrenheit. This converter is essential for travel, cooking (oven temperatures), and understanding weather forecasts.",
    tips: [
      "Key reference points: 0°C = 32°F (freezing), 100°C = 212°F (boiling), 37°C = 98.6°F (body temp)",
      "Cooking conversion: 180°C = 356°F, 200°C = 392°F, 220°C = 428°F — common oven temperatures",
      "Quick approximation: double °C, subtract 10%, add 32. Example: 25°C → 50 - 5 + 32 = 77°F (actual: 77°F)",
    ],
    faqs: [
      { q: "How do I convert Celsius to Fahrenheit?", a: "Multiply the Celsius temperature by 9/5 (or 1.8), then add 32. Formula: °F = (°C × 1.8) + 32. Example: 25°C = (25 × 1.8) + 32 = 77°F." },
      { q: "What is room temperature in Celsius and Fahrenheit?", a: "Room temperature is generally considered 20-22°C (68-72°F). Comfortable indoor temperature ranges from 18-24°C (64-75°F) depending on personal preference and season." },
    ],
  },
];

// Quick lookup helpers
export const VARIANTS_BY_CALCULATOR: Record<string, CalculatorVariant[]> = {};
for (const v of CALCULATOR_VARIANTS) {
  if (!VARIANTS_BY_CALCULATOR[v.slug]) VARIANTS_BY_CALCULATOR[v.slug] = [];
  VARIANTS_BY_CALCULATOR[v.slug].push(v);
}

export function getVariant(slug: string, variant: string): CalculatorVariant | undefined {
  return CALCULATOR_VARIANTS.find((v) => v.slug === slug && v.variant === variant);
}

export const VARIANT_LIST = CALCULATOR_VARIANTS;
