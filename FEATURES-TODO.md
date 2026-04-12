# CalcHub — Features To Build Before Deploy

> Read /Users/atulverma/Desktop/Personal-Projects/SESSION-HANDOFF.md for full project context.
> Project: /Users/atulverma/Desktop/Personal-Projects/calculator-hub
> After completing ALL features below, the reviewer session will verify everything.

---

## FEATURE 1: Shareable URL (encode inputs as URL params)

**What:** When user changes any calculator input, the URL updates with query params. Anyone opening that URL sees the exact same calculation.

**Example:** `calchub.org/calculator/emi?amount=2500000&rate=8.5&tenure=20&tenureType=years&currency=INR`

**How to build:**
1. In each calculator component, use `useSearchParams()` from `next/navigation` to read initial values from URL
2. Use `useRouter()` to update URL params when inputs change (use `router.replace` with `shallow: true` to avoid page reload)
3. Add a "Share" button next to each calculator that copies the current URL to clipboard with toast notification "Link copied!"
4. On page load, if URL has params, use those values instead of defaults (still fall back to currency auto-detect if no params)

**Apply to all 15 calculators.** Each calculator has different input fields — map the correct params for each:

| Calculator | URL params to encode |
|---|---|
| EMI | amount, rate, tenure, tenureType, currency |
| SIP | monthly, rate, years, currency |
| Compound Interest | principal, rate, years, compounding, currency |
| GST/Tax | amount, taxRate, mode, currency |
| Percentage | num1, pct1, num2a, num2b, num3a, num3b |
| BMI | weight, height, weightUnit |
| Age | dob |
| Mortgage | price, down, rate, years, currency |
| Salary | amount, inputType, hoursPerWeek, currency |
| Discount | price, discount, currency |
| Tip | bill, tipPct, people, currency |
| Fuel | distance, efficiency, fuelPrice, currency |
| Income Tax | income, regime |
| Currency | amount, from, to |
| Retirement | currentAge, retireAge, currentSavings, monthlySaving, returnRate, currency |

**Share button UI:** Small button below the result card:
```tsx
<button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied! Share it with anyone."); }}>
  🔗 Share this calculation
</button>
```

Style it like the other buttons in the app — rounded, subtle, with a link icon.

**Important:** Use `router.replace` NOT `router.push` — don't create browser history entries for every slider drag. Debounce the URL update by 500ms so it doesn't fire on every keystroke.

---

## FEATURE 2: Calculation History (localStorage)

**What:** Every time a user completes a calculation (changes any value), save it to localStorage. Show a "History" section below the calculator showing past calculations with timestamps.

**How to build:**

1. Create `src/lib/calculationHistory.ts`:
```typescript
interface HistoryEntry {
  id: string;
  calculator: string; // slug
  inputs: Record<string, string | number>;
  result: string; // formatted result string
  timestamp: string; // ISO date
}

const STORAGE_KEY = "calchub_history";
const MAX_ENTRIES = 50;

function getHistory(): HistoryEntry[]
function addToHistory(entry: Omit<HistoryEntry, "id" | "timestamp">): void
function clearHistory(): void
function clearCalculatorHistory(calculator: string): void
```

2. Create `src/components/CalculationHistory.tsx`:
- Shows last 5 entries for the current calculator
- Each entry shows: result summary + timestamp + "Load" button
- "Load" button fills the calculator with those saved values
- "Clear history" link at bottom
- Collapsible section (closed by default, "View history (5)" toggle)

3. In each calculator, after the result is computed, call `addToHistory()` with the current inputs and formatted result. Debounce by 2 seconds so it doesn't save on every keystroke.

4. Render `<CalculationHistory>` below the calculator, above educational content.

**Don't save on every keystroke.** Use a debounced effect — only save when user hasn't changed values for 2 seconds.

---

## FEATURE 3: Dynamic Plain English Explanation

**What:** A colored card between the result and the educational content that explains the calculation in plain English with smart insights. Changes live as user adjusts values.

**Examples:**

EMI: "You're borrowing ₹25,00,000 and will pay back ₹52,07,520 over 20 years. That means ₹27,07,520 goes to the bank as interest — more than the loan itself! Tip: reducing your tenure to 15 years would save you ₹10,40,000 in interest."

SIP: "By investing just ₹5,000 per month, you'll build a wealth of ₹11.6 lakhs in 10 years. Your total investment is only ₹6 lakhs — the remaining ₹5.6 lakhs is pure profit from compounding."

BMI: "Your BMI is 24.2 — you're in the healthy range! You're 0.8 points away from overweight. Maintaining your current weight is ideal."

**How to build:**

1. Create `src/components/InsightCard.tsx`:
```tsx
interface InsightCardProps {
  icon: string;
  title: string;
  insight: string;
  tip?: string; // optional actionable tip
  color: "blue" | "green" | "amber" | "red"; // severity/mood
}
```

- Renders a gradient card with icon, title, insight text, and optional tip
- Color indicates mood: green = good, amber = caution, red = warning, blue = neutral

2. In each calculator, add an `<InsightCard>` BELOW the result card but ABOVE the amortization table / educational content. Generate the insight from the calculator's current state:

**EMI insights:**
- If totalInterest > amount: color="red", "You'll pay more in interest than the loan itself!"
- If EMI > 40% of a typical salary: color="amber", "This EMI might be high relative to income"
- Always show: how much reducing rate by 0.5% or tenure by 5 years would save

**SIP insights:**
- Show wealth multiplier: "Your money grew X times"
- If years >= 15: color="green", "Long-term SIP is the smartest wealth-building strategy"
- Compare: "If you started 5 years later, you'd have X less"

**BMI insights:**
- Normal: color="green", "You're in the healthy range!"
- Overweight: color="amber", "You're X kg above the healthy range"
- Obese: color="red", "Consider consulting a healthcare professional"
- Underweight: color="amber", "You're X kg below the healthy range"

**Tax insights:**
- Show effective rate vs bracket rate: "Your bracket is 30% but you effectively pay only 15%"
- If effective rate < 10%: color="green", "Your effective tax rate is very low"

**Retirement insights:**
- If corpus < 20x annual expenses: color="red", "You may need to save more"
- Show: "Starting 5 years earlier would give you X more"

**Currency insights:**
- If rate > 100: "1 unit of [from] is worth many units of [to]"
- Show direction: "The [from] is stronger/weaker than [to]"

3. Each calculator generates its own insight — NO generic logic. Each insight should be specific, actionable, and emotionally resonant.

---

## FEATURE 4: Dark Mode (proper implementation)

**What:** A toggle in the header that switches between light and dark themes. Must work across ALL pages and calculators.

**How to build (DO NOT use CSS variables approach — it failed before):**

1. Use Tailwind's `dark:` variant with class strategy.

2. Update `tailwind.config.ts` (or equivalent in v4):
```
darkMode: 'class'
```

3. Create `src/components/ThemeToggle.tsx`:
- Reads preference from localStorage (`calchub_theme`)
- Falls back to system preference (`prefers-color-scheme`)
- Adds/removes `dark` class on `<html>` element
- Sun icon (light) / Moon icon (dark)

4. Add ThemeToggle to layout.tsx header.

5. Go through EVERY component and add `dark:` variants for:
- Backgrounds: `bg-white dark:bg-gray-900`
- Text: `text-gray-900 dark:text-gray-100`
- Borders: `border-gray-200 dark:border-gray-700`
- Cards: `bg-white dark:bg-gray-800`
- Inputs: `bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600`
- Gradient result cards: keep as-is (they look good on both)

6. Test EVERY calculator page in both modes.

**Important:** The hero section, footer, header, all calculator cards, all input fields, all tables, all educational content — everything needs dark variants. Don't miss any element.

---

## FEATURE 5: Download Results as PDF

**What:** A "Download PDF" button on each calculator that generates a clean PDF of the current calculation results.

**How to build:**

1. Install jsPDF: `npm install jspdf` (don't add to initial bundle — lazy load it)

2. Create `src/lib/generateCalcPDF.ts`:
```typescript
interface CalcPDFData {
  calculatorName: string;
  inputs: { label: string; value: string }[];
  results: { label: string; value: string }[];
  insight?: string;
  generatedAt: string;
  url: string;
}

export async function generateCalcPDF(data: CalcPDFData): Promise<void> {
  const { default: jsPDF } = await import("jspdf"); // lazy load
  // ... generate PDF
}
```

3. PDF layout:
- Header: "CalcHub — [Calculator Name]" with date
- Inputs section: table of what user entered
- Results section: highlighted result values
- Insight text (if available)
- Footer: "Generated at calchub.org/calculator/[slug] — Free Online Calculators"
- Shareable URL at bottom

4. Add "📥 Download PDF" button next to the "🔗 Share" button below each calculator's result card.

5. **Lazy load jsPDF** — same pattern as InvoiceGen:
```tsx
const { generateCalcPDF } = await import("@/lib/generateCalcPDF");
```

---

## FEATURE 6: Keyboard Shortcuts

**What:** Power users can navigate calculators using keyboard.

**How to build:**

1. Create `src/hooks/useKeyboardShortcuts.ts`:
- `Tab` — move between input fields (already works natively)
- `Enter` — focus next input
- `Escape` — reset calculator to defaults
- `Ctrl+C` / `Cmd+C` when result is focused — copy result value
- `Ctrl+S` / `Cmd+S` — share (copy URL)
- `Ctrl+P` / `Cmd+P` — download PDF

2. Add keyboard shortcut hints as tooltips on buttons:
- Share button: "🔗 Share (Ctrl+S)"
- PDF button: "📥 PDF (Ctrl+P)"
- Reset button: "↺ Reset (Esc)"

3. Show a small "⌨️ Keyboard shortcuts" link that opens a modal listing all shortcuts.

---

## FEATURE 7: Reset Button

**What:** A "Reset" button that clears all inputs back to defaults (auto-detected currency defaults).

**How to build:**
1. Add a reset button in each calculator, next to the Share/PDF buttons
2. On click, reset all state values to their defaults (from currency config)
3. Clear the URL params
4. Style: subtle outline button with ↺ icon

---

## FEATURE 8: Mobile Swipe Between Calculators

**What:** On mobile, user can swipe left/right to navigate between calculators in the same category.

**How to build:**
1. Detect touch events (touchstart, touchmove, touchend)
2. If user swipes left → navigate to next calculator in same category
3. If user swipes right → navigate to previous calculator
4. Show dots/indicators at the bottom showing position in category
5. Only enable on mobile (screen width < 768px)

---

## FEATURE 9: "Compare" Mode (Side-by-Side)

**What:** User clicks "Compare" and gets a second instance of the same calculator next to the first one. They can enter different values in each and see results side by side.

**How to build:**
1. Add a "⚖️ Compare" toggle button
2. When active, render TWO instances of the calculator component side by side (50/50 on desktop, stacked on mobile)
3. Each instance has its own state
4. Show a comparison summary: "Scenario A vs Scenario B" with differences highlighted
5. Only implement for: EMI, SIP, Mortgage, Retirement (the ones where comparison makes most sense)

---

## BUILD ORDER (do in this exact sequence):

1. **Feature 7: Reset Button** — simplest, 15 min, good warmup
2. **Feature 1: Shareable URL** — highest impact for growth, 2-3 hours
3. **Feature 2: Calculation History** — makes users come back, 1-2 hours
4. **Feature 3: Dynamic Insights** — wow factor, 2-3 hours
5. **Feature 5: Download PDF** — professional output, 1-2 hours
6. **Feature 4: Dark Mode** — user request, 2-3 hours (careful, touch every component)
7. **Feature 6: Keyboard Shortcuts** — power users, 1 hour
8. **Feature 8: Mobile Swipe** — nice to have, 1 hour
9. **Feature 9: Compare Mode** — complex, 2-3 hours, only for EMI/SIP/Mortgage/Retirement

## RULES:
- Lazy load jsPDF (same pattern as InvoiceGen)
- Debounce URL updates and history saves (500ms for URL, 2s for history)
- All features must work with the existing currency auto-detection system
- Dark mode must be tested on EVERY page and EVERY calculator
- No feature should break the existing educational content or FAQ schemas
- Build and verify after EACH feature — don't batch

## AFTER ALL FEATURES ARE DONE:
- Run `npx next build` — must compile with zero errors
- Test on mobile (responsive)
- Test shareable URLs (open in incognito)
- Test dark mode on all 15 calculators
- Test PDF download
- Test calculation history persistence (close and reopen browser)
- Tell the reviewer session "all features done, please review"

---

*Created: April 11, 2026*
*Total estimated time: 15-20 hours*
*Priority: ALL features must be done BEFORE deploy*
