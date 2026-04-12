# CalcHub — Post-Launch Roadmap

> Only build these AFTER deploying and seeing GA4 data. Prioritize based on actual traffic, not guessing.

---

## WEEK 1-2 (Immediately after deploy)

### Monitor & Optimize
- [ ] Set up GA4 and track which calculators get traffic
- [ ] Submit sitemap to Google Search Console
- [ ] Request indexing for top 30 pages manually
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Apply for Google AdSense once 500+ visits

### Quick Wins
- [ ] Add more variants for calculators that get traffic (5-10 per week)
- [ ] Fix any bugs users report via feedback form
- [ ] Post on Product Hunt, Dev.to, Hacker News, Quora

---

## WEEK 3-4 (Based on GA4 data)

### More Calculators (add based on search demand)
- [ ] Calorie Deficit Calculator (weight loss focused)
- [ ] Macro Calculator (protein/carbs/fat split)
- [ ] Paycheck Calculator (US state-specific withholding)
- [ ] Property Tax Calculator
- [ ] Auto Insurance Calculator
- [ ] Simple Interest Calculator
- [ ] Rule of 72 Calculator
- [ ] Debt Payoff Calculator (snowball vs avalanche)
- [ ] Net Worth Calculator
- [ ] ROI Calculator

### More Variant Pages
- [ ] Add variants for Discount: bulk-discount, wholesale, double-discount
- [ ] Add variants for Tip: bar, delivery, salon, tour-guide
- [ ] Add variants for Scientific: algebra, physics, trigonometry
- [ ] Add variants for Unit Converter: liters-gallons, sqm-sqft, mph-kmh
- [ ] Target "calculator + year" queries: "income tax calculator 2026-27"

---

## MONTH 2-3 (Growth features)

### Multi-Language (massive untapped market)
- [ ] Spanish (500M+ speakers, huge search volume for "calculadora")
- [ ] Portuguese (260M+ speakers, Brazil is a massive market)
- [ ] Hindi (600M+ speakers, India traffic)
- [ ] French (280M+ speakers)
- [ ] Arabic (400M+ speakers, Gulf countries)
- Start with: translated page titles, meta descriptions, and UI labels (not full content)

### Reverse Calculator Mode
- [ ] Wire ReverseMode component into EMI ("I can afford $2K/month, max loan?")
- [ ] Wire into Mortgage ("I can afford $1,500/month, max house price?")
- [ ] Wire into SIP ("I want $1M in 20 years, how much monthly?")
- [ ] Wire into Retirement ("I want $2M at 65, how much to save?")
- [ ] Wire into Savings Goal (already has dual mode — enhance it)

### SpeakResultButton (Voice narration)
- [ ] Wire into EMI, SIP, Mortgage, Retirement (top 4 financial calculators)
- [ ] Great for accessibility — visually impaired users
- [ ] Differentiator: zero competitors have this

### Blog/Guide Content (SEO multiplier)
- [ ] "How to Calculate EMI — Formula, Example, Tips" (link to EMI calculator)
- [ ] "SIP vs FD: Which Is Better in 2026?" (link to SIP + Compound Interest)
- [ ] "How to Reduce Your Home Loan Interest" (link to Mortgage + EMI)
- [ ] "15-Year vs 30-Year Mortgage: Complete Guide" (link to Mortgage variants)
- [ ] "FIRE Movement: Complete Guide to Early Retirement" (link to FIRE variant)
- [ ] "How Many Calories Do You Really Need?" (link to Calorie calculator)
- [ ] Each guide = 1,000-2,000 words + links to calculators = SEO boost

---

## MONTH 4-6 (Scale & monetize)

### Crowd Benchmarking ("How do you compare?")
- [ ] Collect anonymized calculation data (opt-in via cookie consent)
- [ ] Show: "Your BMI is better than 62% of users in your age group"
- [ ] Show: "Your savings rate is higher than 45% of users"
- [ ] Builds engagement and trust

### Location-Specific Tax Pages (programmatic SEO at scale)
- [ ] US state income tax: /calculator/income-tax/california, /texas, /new-york (50 pages)
- [ ] India old vs new regime comparison: /calculator/income-tax/india-old-vs-new
- [ ] UK National Insurance: /calculator/income-tax/uk-national-insurance
- [ ] Adds 50-100+ pages targeting geo-specific searches

### Life Simulator (chain calculators together)
- [ ] "I'm 25, want to buy a house at 30, retire at 60"
- [ ] System runs EMI + savings + retirement calculators as one connected flow
- [ ] Shows how decisions cascade (buying a more expensive house delays retirement)
- [ ] Viral potential — people share their "life plan"

### Embeddable Widget Marketing
- [ ] Reach out to finance bloggers: "Embed our free calculator on your site"
- [ ] Each embed = free backlink = SEO boost
- [ ] Create a "For Publishers" page with widget showcase
- [ ] Consider a WordPress plugin wrapper

### User Accounts (optional, if traffic justifies)
- [ ] Google sign-in (minimal friction)
- [ ] Cloud sync calculation history across devices
- [ ] Saved calculator configurations
- [ ] Email monthly summary of saved calculations
- [ ] ONLY build if users request it — don't add friction unnecessarily

---

## FEATURES READY BUT NOT YET WIRED IN

These components are built and ready, just need to be integrated into calculators:

| Component | File | What it does | Wire into |
|---|---|---|---|
| SpeakResultButton | src/components/SpeakResultButton.tsx | Reads results aloud | All calculators (next to result card) |
| ReverseMode | src/components/ReverseMode.tsx | Forward/goal mode toggle | EMI, Mortgage, SIP, Retirement, Savings Goal |
| NumberInput | src/components/NumberInput.tsx | Mobile numeric keyboard + prefix/suffix | Gradually replace raw input fields |
| CSV Export | src/lib/generateCSV.ts | Export to CSV/Excel | Add csvData prop to calculators with tables (EMI, Mortgage amortization) |

---

## SEO TASKS (ongoing)

- [ ] Add 5-10 new variant pages per week based on Search Console queries
- [ ] Monitor "Queries" in Search Console — if people search "X calculator" and you don't have it, build it
- [ ] Update "Last updated" dates quarterly (freshness signal)
- [ ] Update tax calculators annually for new tax years
- [ ] Build backlinks through embeddable widgets, blog content, and Quora answers
- [ ] Target featured snippets: add FAQ schema to every page (already done)

---

## REVENUE MILESTONES

| Month | Target | Action |
|---|---|---|
| Month 1 | 500+ visits | Apply for AdSense |
| Month 2 | 2,000+ visits | First AdSense revenue (~$10-50) |
| Month 3 | 5,000+ visits | Optimize ad placement, add more pages |
| Month 6 | 20,000+ visits | $100-500/month revenue |
| Month 12 | 100,000+ visits | $500-2,000/month revenue |

Finance AdSense CPC: $5-50/click. Even 10 clicks/day = $50-500/day potential.

---

*Created: April 12, 2026*
*Deploy first, optimize later. Every day not live = wasted SEO time.*
