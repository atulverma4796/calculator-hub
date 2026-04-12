export interface DynamicExample {
  setup: string;
  calculation: string;
  result: string;
}

export interface CalculatorEducation {
  howItWorks: string;
  formula: string;
  formulaExplained: string;
  example: DynamicExample; // default example, can be overridden by calculator
  tips: string[];
  faqs: { q: string; a: string }[];
}

export const CALCULATOR_CONTENT: Record<string, CalculatorEducation> = {
  emi: {
    howItWorks: "EMI (Equated Monthly Installment) is the fixed amount you pay to a bank every month until the loan is fully repaid. It includes both principal repayment and interest. In the early years, a larger portion goes toward interest. Over time, more of your EMI goes toward paying off the principal.",
    formula: "EMI = P x r x (1+r)^n / ((1+r)^n - 1)",
    formulaExplained: "P = loan principal amount, r = monthly interest rate (annual rate / 12 / 100), n = total number of monthly installments (years x 12).",
    example: {
      setup: "You take a home loan of 300,000 at 8.5% interest for 20 years.",
      calculation: "The bank splits your loan into 240 equal monthly payments. Each payment covers principal plus interest on the remaining balance. In the first few years, most of your EMI goes toward interest. Later, more goes toward paying off the loan.",
      result: "You'll pay about 2,604 per month. Over 20 years, you'll pay a total of 624,960 — meaning 324,960 is pure interest. That's why even a small rate reduction (say 8% instead of 8.5%) saves you thousands over the loan life.",
    },
    tips: [
      "A longer tenure reduces your EMI but increases total interest paid significantly",
      "Even a 0.5% lower interest rate saves thousands over the loan tenure — always negotiate with your bank",
      "Making prepayments or paying extra EMIs reduces your total interest and loan duration",
      "Keep your EMI below 40% of your monthly income to maintain financial health",
      "Compare home loan, car loan, and personal loan EMIs before deciding — interest rates vary widely",
    ],
    faqs: [
      { q: "What is a good EMI to salary ratio?", a: "Financial experts recommend keeping your total EMI payments below 40-50% of your monthly take-home salary. This leaves enough room for other expenses and savings." },
      { q: "Does EMI include interest?", a: "Yes. Every EMI has two components — principal repayment and interest. In the early months, the interest component is higher. Over time, the principal component increases and interest decreases." },
      { q: "What happens if I miss an EMI payment?", a: "Missing an EMI attracts a late payment fee (usually 1-2% of the EMI), negatively impacts your credit score, and the unpaid amount accrues additional interest. Contact your bank immediately if you anticipate difficulty." },
      { q: "Can I reduce my EMI?", a: "Yes — you can request a tenure extension (lowers EMI but increases total interest), make a lump-sum prepayment (reduces principal), or refinance to a lower interest rate with another bank." },
      { q: "Is flat rate or reducing rate EMI better?", a: "Reducing rate (diminishing balance) is always better for borrowers. With flat rate, interest is charged on the full principal throughout. With reducing rate, interest is charged only on the outstanding balance, which decreases with each EMI." },
    ],
  },

  sip: {
    howItWorks: "SIP (Systematic Investment Plan) is a method of investing a fixed amount in mutual funds at regular intervals, usually monthly. It leverages dollar cost averaging — you buy more units when prices are low and fewer when prices are high, averaging out the cost over time.",
    formula: "FV = P x ((1+r)^n - 1) / r x (1+r)",
    formulaExplained: "FV = future value of investment, P = monthly SIP amount, r = monthly return rate (expected annual return / 12 / 100), n = total number of monthly installments.",
    example: {
      setup: "You invest 500 every month in a mutual fund for 10 years. The fund gives an average 10% annual return.",
      calculation: "You put in 500 x 12 x 10 = 60,000 total from your pocket. But your money doesn't just sit there — it earns returns, and those returns earn more returns. This is compounding working for you every single month.",
      result: "After 10 years, your 60,000 investment grows to about 103,000. You earned 43,000 in returns — a 72% gain. Extend to 20 years with the same monthly amount and it grows to over 380,000. That's the power of starting early.",
    },
    tips: [
      "Start early — the power of compounding grows exponentially over longer periods",
      "Increase your SIP amount annually (step-up SIP) to accelerate wealth creation",
      "Don't stop investing during market downturns — that's when you buy more units at lower prices",
      "Historical equity returns average 10-12% annually over 10+ year periods in most major markets",
      "SIP in index funds (S&P 500, global indices) is the simplest strategy for beginners",
    ],
    faqs: [
      { q: "What is the minimum amount for SIP?", a: "Most mutual funds allow SIPs starting from a small monthly amount. The minimum varies by fund and country, but many start from as low as 50-500 per month." },
      { q: "Is SIP better than a savings account?", a: "Historically, equity SIPs have delivered 10-12% annual returns over 10+ years, while savings accounts offer 2-5%. However, SIPs carry market risk while savings have guaranteed returns. SIP is better for long-term wealth creation." },
      { q: "Can I withdraw from SIP anytime?", a: "Yes, you can redeem your SIP investments anytime (for open-ended funds). However, equity funds may have a short-term exit load (typically 1% if redeemed within 1 year)." },
      { q: "Is SIP safe?", a: "SIP is a method of investing, not an investment itself. The safety depends on what you invest in — bond funds are safer, equity funds carry market risk but offer higher returns over time." },
    ],
  },

  "compound-interest": {
    howItWorks: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest (calculated only on the principal), compound interest grows exponentially because you earn 'interest on interest'. The more frequently interest compounds, the more you earn.",
    formula: "A = P(1 + r/n)^(nt)",
    formulaExplained: "A = final amount, P = principal (initial investment), r = annual interest rate (as decimal), n = number of times interest compounds per year (1=annually, 4=quarterly, 12=monthly, 365=daily), t = number of years.",
    example: {
      setup: "You invest 10,000 at 8% interest, compounded monthly, for 10 years.",
      calculation: "Every month, interest is calculated on your total balance — not just the original 10,000. In month 1, you earn interest on 10,000. In month 2, you earn interest on 10,000 + month 1's interest. This snowball effect is compounding.",
      result: "After 10 years, your 10,000 becomes 22,196. You earned 12,196 in interest — your money more than doubled. With simple interest, you would have only 18,000. That extra 4,196 is the power of compound interest.",
    },
    tips: [
      "The Rule of 72: divide 72 by the interest rate to estimate how many years it takes to double your money (72/8 = 9 years)",
      "Monthly compounding earns more than annual — always choose higher compounding frequency when given the option",
      "Starting with a smaller amount early beats starting with a larger amount later due to compounding",
      "Compound interest works against you on loans — pay off high-interest debt as fast as possible",
    ],
    faqs: [
      { q: "What is the difference between simple and compound interest?", a: "Simple interest is calculated only on the principal amount. Compound interest is calculated on both the principal and previously earned interest. Over time, compound interest grows significantly faster." },
      { q: "How often should interest compound?", a: "The more frequently interest compounds, the more you earn. Daily > Monthly > Quarterly > Annually. For savings, look for accounts with daily or monthly compounding." },
      { q: "What is the Rule of 72?", a: "The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by the annual interest rate. At 8%, your money doubles in approximately 72/8 = 9 years." },
    ],
  },

  gst: {
    howItWorks: "Sales tax, VAT (Value Added Tax), and GST (Goods and Services Tax) are different names for indirect taxes applied to goods and services worldwide. When you add tax, it's calculated on the base price. When you remove tax, the calculator extracts the tax from a tax-inclusive amount. The tax system adapts to your country — GST in India/Australia, VAT in Europe/UK, Sales Tax in the US.",
    formula: "Add Tax: Total = Amount x (1 + Rate/100)\nRemove Tax: Original = Amount x 100 / (100 + Rate)",
    formulaExplained: "Tax Amount = Base Amount x Rate / 100. In India, GST splits into CGST (Central) and SGST (State) for intra-state transactions. Most other countries have a single tax rate.",
    example: {
      setup: "You're buying a product priced at 1,000 before tax. The tax rate is 10%.",
      calculation: "The seller adds 10% tax on top: 1,000 x 10% = 100 in tax. You pay 1,100 total.",
      result: "You pay 1,100 total — 1,000 for the product and 100 in tax. If the sticker price already shows 1,100 (tax-inclusive), use 'Remove Tax' mode to find the pre-tax price was 1,000.",
    },
    tips: [
      "Tax rates vary by country: US sales tax 5-10%, UK VAT 20%, EU VAT 19-21%, India GST 5-28%, Australia GST 10%, Canada GST/HST 5-15%",
      "When removing tax from a price, don't just subtract the percentage — use the reverse formula: Original = Price x 100 / (100 + rate)",
      "Business owners should track tax-inclusive and tax-exclusive amounts separately for accounting",
      "Some items are tax-exempt or zero-rated in most countries — typically basic food, healthcare, and education",
    ],
    faqs: [
      { q: "What is the difference between GST, VAT, and Sales Tax?", a: "They're all consumption taxes but structured differently. VAT (Europe, UK) and GST (India, Australia, Canada) are collected at every stage of production with input tax credits. US Sales Tax is collected only at the final point of sale. The math for the end consumer is the same." },
      { q: "How do I remove tax from a price?", a: "If a price includes tax, use: Original Price = Total Price x 100 / (100 + tax rate). For example, if the price is 1,200 including 20% VAT: Original = 1,200 x 100/120 = 1,000." },
      { q: "Why do tax rates vary?", a: "Governments set tax rates based on revenue needs and policy goals. Essential goods often have lower rates or exemptions. Luxury and non-essential items typically have higher rates." },
    ],
  },

  percentage: {
    howItWorks: "Percentage calculations are used everywhere — from shopping discounts to exam scores to financial returns. This calculator handles three common percentage problems: finding what X% of a number is, finding what percentage one number is of another, and calculating the percentage change between two values.",
    formula: "X% of Y = Y x X / 100\nX is what % of Y = (X/Y) x 100\n% Change = ((New - Old) / Old) x 100",
    formulaExplained: "Percentage means 'per hundred'. 15% = 15 per 100 = 0.15 as a decimal. Percentage change can be positive (increase) or negative (decrease).",
    example: {
      setup: "Three everyday percentage problems you can solve instantly:",
      calculation: "1) 'What is 15% tip on a 200 bill?' → 200 x 15% = 30. 2) 'I scored 50 out of 200 on a test. What's my percentage?' → 50/200 = 25%. 3) 'My rent went from 1,000 to 1,200. How much increase?' → (1200-1000)/1000 = 20% increase.",
      result: "15% of 200 = 30. 50 is 25% of 200. Rent increased by 20%. Use the calculator above to solve any percentage problem instantly.",
    },
    tips: [
      "Quick trick: to find 10% of any number, just move the decimal point one place left. 10% of 450 = 45",
      "To find 5%, find 10% and halve it. To find 15%, find 10% + 5%",
      "Percentage increase and decrease are NOT symmetric — a 50% increase followed by a 50% decrease does NOT return to the original (100 → 150 → 75)",
    ],
    faqs: [
      { q: "How do I calculate percentage in my head?", a: "Break it down: 10% = move decimal left. 5% = half of 10%. 1% = move decimal left twice. 25% = divide by 4. Example: 15% of 80 = 10%(8) + 5%(4) = 12." },
      { q: "What is percentage change?", a: "Percentage change measures how much a value has increased or decreased relative to the original. Formula: ((New - Old) / Old) x 100. A positive result = increase, negative = decrease." },
    ],
  },

  bmi: {
    howItWorks: "BMI (Body Mass Index) is a simple screening tool that estimates body fat based on your height and weight. While it doesn't measure body fat directly, it's widely used by healthcare professionals as a quick indicator of whether a person is underweight, normal weight, overweight, or obese. BMI applies to adults of all genders.",
    formula: "BMI = Weight (kg) / Height (m)^2",
    formulaExplained: "Weight should be in kilograms and height in meters. If using pounds and inches: BMI = (Weight in lbs x 703) / (Height in inches)^2. The result is a unitless number.",
    example: {
      setup: "You weigh 70 kg and your height is 170 cm (5 feet 7 inches).",
      calculation: "The calculator divides your weight by the square of your height in meters: 70 / (1.70 x 1.70) = 70 / 2.89 = 24.2",
      result: "Your BMI is 24.2 — you're in the 'Normal weight' range (18.5 to 24.9). A healthy weight for your height is between 53 kg and 72 kg. You're right where you should be!",
    },
    tips: [
      "BMI is a screening tool, not a diagnosis — athletes may have high BMI due to muscle mass, not fat",
      "Underweight: BMI < 18.5. Normal: 18.5-24.9. Overweight: 25-29.9. Obese: 30+",
      "BMI doesn't account for muscle vs fat, bone density, age, gender, or where fat is stored",
      "Waist circumference is a better indicator of health risk — men >102 cm (40 in), women >88 cm (35 in) indicates higher risk",
      "BMI thresholds may differ by ethnicity — consult your healthcare provider for personalized guidance",
    ],
    faqs: [
      { q: "What is a healthy BMI?", a: "A BMI between 18.5 and 24.9 is considered normal weight. However, 'healthy' depends on many factors including age, muscle mass, and overall fitness. BMI is a starting point, not a complete health assessment." },
      { q: "Is BMI accurate for athletes?", a: "No. BMI can overestimate body fat in athletes and muscular people because it doesn't distinguish between muscle and fat. A bodybuilder with low body fat might have an 'overweight' BMI due to muscle mass." },
      { q: "Does BMI differ by age?", a: "For adults 20+, BMI categories are the same regardless of age. For children and teens, BMI is interpreted differently using age-and-sex-specific percentiles." },
    ],
  },

  age: {
    howItWorks: "The age calculator computes your exact age in years, months, and days from your date of birth. It also shows your age in total months, weeks, days, and hours, plus how many days until your next birthday. The calculation handles month-length variations and leap years correctly.",
    formula: "Age = Current Date - Date of Birth (adjusted for month/day boundaries)",
    formulaExplained: "Years = difference in years, reduced by 1 if the birthday hasn't occurred yet this year. Months and days are adjusted for calendar month lengths.",
    example: {
      setup: "Your birthday is June 15, 1995.",
      calculation: "From June 1995 to today, the calculator counts every year, month, and day precisely — handling different month lengths (28, 30, 31 days) and leap years automatically.",
      result: "You are about 30 years, 9 months, and 27 days old. That's over 11,000 days or 270,000+ hours you've been alive! Your next birthday is coming up soon.",
    },
    tips: [
      "Your age in days is a fun number to share on social media milestones (10,000 days old is about 27 years)",
      "Some countries calculate age differently — in Korea, you're 1 at birth and gain a year every January 1st",
      "Legal age requirements vary by country: voting (18 in most), driving (16-18), drinking (18-21)",
    ],
    faqs: [
      { q: "How is age calculated exactly?", a: "Age is calculated by subtracting the birth date from the current date. If this month's date hasn't reached the birth day yet, the months are reduced by 1 and days are adjusted using the previous month's length." },
      { q: "Does the calculator handle leap years?", a: "Yes. The calculator uses JavaScript's Date object which correctly handles leap years. For people born on February 29, the next birthday shows as March 1 in non-leap years." },
    ],
  },

  mortgage: {
    howItWorks: "A mortgage calculator estimates your monthly home loan payment based on the property price, down payment, interest rate, and loan term. It uses the same EMI formula as a loan calculator, applied to the amount after subtracting your down payment. The results include total interest paid over the loan life and a visual breakdown.",
    formula: "Monthly Payment = L x r x (1+r)^n / ((1+r)^n - 1)\nwhere L = Price - Down Payment",
    formulaExplained: "L = loan principal (home price minus down payment), r = monthly interest rate (annual rate / 12 / 100), n = total months (years x 12).",
    example: {
      setup: "You want to buy a house worth 300,000. You put down 60,000 (20%) and borrow the remaining 240,000 at 6.5% interest for 30 years.",
      calculation: "The bank spreads your 240,000 loan over 360 monthly payments (30 years x 12). Each payment includes part of the loan amount plus interest on the remaining balance. Early on, most of your payment is interest. Over time, more goes toward the actual loan.",
      result: "Your monthly payment is about 1,517. Over 30 years, you'll pay 546,120 total — meaning 306,120 is interest alone. That's more than the original loan! A 15-year mortgage would save over 150,000 in interest, but your monthly payment would be higher.",
    },
    tips: [
      "A 20% down payment often helps you avoid extra insurance costs (e.g., PMI in the US) — check your country's lending rules",
      "A 15-year mortgage has higher monthly payments but saves tens of thousands in total interest vs 30-year",
      "Every extra payment goes directly to principal — even one extra payment per year can save years off your mortgage",
      "Compare rates from at least 3-5 lenders — even 0.25% difference saves thousands over the loan life",
      "Factor in property taxes, insurance, and other fees — your actual monthly cost is higher than the mortgage payment alone",
    ],
    faqs: [
      { q: "How much house can I afford?", a: "A common guideline is your monthly housing cost (mortgage + taxes + insurance) should be under 25-30% of your gross monthly income. Check your country's lending guidelines for specific rules." },
      { q: "Is it better to put more down?", a: "A larger down payment reduces your loan amount, monthly payment, and total interest. However, don't drain your emergency fund for a larger down payment — balance is key." },
      { q: "Should I choose a shorter or longer term?", a: "Longer terms (25-30 years) mean lower monthly payments but much more total interest. Shorter terms (10-15 years) mean higher monthly payments but far less total interest. Choose based on your budget and goals." },
    ],
  },

  salary: {
    howItWorks: "The salary calculator converts between different pay periods — hourly, daily, weekly, monthly, and annual — so you can compare job offers, calculate your hourly rate from a salary, or understand your annual earnings from an hourly wage. It assumes standard working hours and weeks.",
    formula: "Annual = Hourly x Hours/Week x 52\nMonthly = Annual / 12\nWeekly = Annual / 52\nDaily = Annual / 260\nHourly = Annual / (Hours/Week x 52)",
    formulaExplained: "52 weeks per year, 260 working days (52 x 5), 12 months. Hours per week is customizable (default 40).",
    example: {
      setup: "You earn 50,000 per year and work 40 hours per week.",
      calculation: "There are 52 weeks in a year, so you work 40 x 52 = 2,080 hours total. Dividing your annual salary by total hours gives your hourly rate.",
      result: "You make about 24.04 per hour, 192 per day, 962 per week, and 4,167 per month. If a freelance client offers you 30/hour, that's equivalent to a 62,400 salary — but remember, freelancers need to cover their own taxes and benefits.",
    },
    tips: [
      "When comparing job offers, convert everything to the same period (annual) for fair comparison",
      "Don't forget to factor in benefits — health insurance, retirement contributions, and paid time off have real value",
      "Overtime is typically 1.5x your hourly rate — knowing your hourly rate helps calculate overtime pay",
      "Freelancers should charge 1.5-2x an equivalent employee rate to cover taxes, insurance, and unpaid time off",
    ],
    faqs: [
      { q: "How many working hours are in a year?", a: "A standard work year has 2,080 hours (40 hours/week x 52 weeks). After accounting for holidays and vacation, the actual number is typically 1,920-2,000 hours." },
      { q: "How do I calculate my hourly rate from salary?", a: "Divide your annual salary by 2,080 (for 40-hour weeks). For example, 50,000 / 2,080 = about 24.04 per hour." },
    ],
  },

  discount: {
    howItWorks: "The discount calculator shows you exactly how much you save and what you pay after a percentage discount. Whether it's a store sale, coupon code, or bulk discount, enter the original price and discount percentage to see the savings and final price instantly.",
    formula: "Savings = Original Price x Discount% / 100\nFinal Price = Original Price - Savings",
    formulaExplained: "A 30% discount on a 100 item means you save 30 and pay 70.",
    example: {
      setup: "You find a jacket originally priced at 150, now on sale for 25% off.",
      calculation: "25% of 150 = 37.50 in savings. You pay the remaining 150 - 37.50.",
      result: "You save 37.50 and pay 112.50. Pro tip: if there's an additional 10% coupon, it applies to 112.50 (not the original 150), giving you another 11.25 off — final price 101.25.",
    },
    tips: [
      "Two successive discounts are NOT additive — 20% off then 10% off is NOT 30% off, it's 28% off",
      "Compare 'percentage off' vs 'fixed amount off' — 20 off 60 (33% off) is better than 25% off 60 (15 off)",
      "Many stores inflate original prices before 'sales' — check price history before assuming you're getting a deal",
    ],
    faqs: [
      { q: "How do I calculate discount percentage?", a: "Discount % = (Savings / Original Price) x 100. If something dropped from 80 to 60: (20/80) x 100 = 25% discount." },
      { q: "Are double discounts calculated together?", a: "No. Two 20% discounts equal 36% off, not 40%. First discount: 100 → 80. Second discount: 80 → 64. Total discount from 100 to 64 = 36%." },
    ],
  },

  tip: {
    howItWorks: "The tip calculator helps you quickly figure out how much to tip at restaurants and how to split the total bill among friends. Enter your bill amount, choose a tip percentage, and specify how many people are splitting — it calculates the tip, total, and per-person amounts instantly.",
    formula: "Tip = Bill x Tip% / 100\nTotal = Bill + Tip\nPer Person = Total / Number of People",
    formulaExplained: "Tipping customs vary worldwide. US: 15-20%. UK/Europe: 10-15%. Japan: tipping is not customary. Always check local norms.",
    example: {
      setup: "You and 2 friends had dinner. The bill is 85. You want to leave an 18% tip.",
      calculation: "18% tip on 85 = 15.30. Total bill with tip = 100.30. Split 3 ways = 33.43 per person.",
      result: "Each person pays 33.43, which includes 5.10 tip each. If the service was exceptional, bump it to 20% — that's only 0.57 more per person but makes a big difference to the server.",
    },
    tips: [
      "Tipping norms vary: US 15-20%, UK 10-15%, Japan/Korea 0% (tipping can be seen as rude). Always check local customs when traveling",
      "Tip on the pre-tax amount, not the total including tax",
      "For large groups (6+), many restaurants add an automatic 18% gratuity — check your bill before adding more",
      "For takeout/delivery, 10-15% is appropriate in countries where tipping is customary",
    ],
    faqs: [
      { q: "How much should I tip?", a: "It depends on where you are. US: 15% minimum, 18-20% for good service. UK/Europe: 10-15%. Many Asian countries: tipping is not customary. Check local culture when traveling." },
      { q: "Should I tip on tax?", a: "Technically, you should tip on the pre-tax subtotal. However, most people tip on the total (including tax) for simplicity — the difference is small." },
    ],
  },

  fuel: {
    howItWorks: "The fuel cost calculator estimates how much fuel you need and how much it will cost for a trip. Enter the distance, your vehicle's fuel efficiency (in km/L or MPG), and the current fuel price — it instantly shows the fuel needed, total cost, and cost per kilometer or mile.",
    formula: "Fuel Needed = Distance / Fuel Efficiency\nTotal Cost = Fuel Needed x Fuel Price\nCost per km = Total Cost / Distance",
    formulaExplained: "Works for both metric (km, liters, km/L) and imperial (miles, gallons, MPG) units. The unit system adapts to your detected currency.",
    example: {
      setup: "You're planning a road trip of 500 km. Your car does 15 km per liter, and fuel costs 1.80 per liter.",
      calculation: "Your car needs 500 / 15 = 33.3 liters to cover the distance. At 1.80 per liter, that's 33.3 x 1.80.",
      result: "The trip will cost you about 60 in fuel — that's about 0.12 per kilometer. Sharing the ride with 2 friends? Split 3 ways = 20 each.",
    },
    tips: [
      "Highway driving is typically 15-30% more fuel-efficient than city driving",
      "Keeping tires properly inflated improves fuel efficiency by 3-5%",
      "Driving at moderate speeds (90-100 km/h or 55-65 mph) is the most fuel-efficient for most cars",
      "AC uses 5-10% more fuel. At low speeds, open windows are more efficient. Above 60 km/h (40 mph), AC is more efficient (less drag)",
    ],
    faqs: [
      { q: "What is good fuel efficiency?", a: "City cars: 15-20 km/L (35-47 MPG). Sedans: 12-18 km/L (28-42 MPG). SUVs: 8-14 km/L (19-33 MPG). Electric vehicles: 6-8 km per kWh equivalent." },
      { q: "How to improve fuel efficiency?", a: "Maintain proper tire pressure, remove unnecessary weight, avoid aggressive acceleration, use cruise control on highways, service your vehicle regularly, and plan routes to minimize stop-and-go driving." },
    ],
  },

  "income-tax": {
    howItWorks: "The income tax calculator estimates your tax liability based on your annual income and your country's tax regime. Taxes are calculated using progressive brackets — you pay a higher rate only on the portion of income that falls in each bracket, not on your entire income. This calculator supports India (new regime), US (federal), and UK (PAYE).",
    formula: "Tax = Sum of (Taxable amount in each bracket x bracket rate)\nEffective rate = Total tax / Total income x 100",
    formulaExplained: "Progressive taxation means only the income WITHIN each bracket is taxed at that rate. If a 20% bracket starts at 50,000, you pay 20% only on income above 50,000 — not on your entire income.",
    example: {
      setup: "You earn 55,000 per year under the US Federal tax regime.",
      calculation: "Your tax is calculated in brackets: 0-11,600 at 10% = 1,160. 11,600-47,150 at 12% = 4,266. 47,150-55,000 at 22% = 1,727.",
      result: "Total tax = 7,153. Your effective tax rate is 13% — much lower than your highest bracket of 22%. After tax, you take home 47,847. Progressive brackets mean everyone pays the same rate on their first dollars of income.",
    },
    tips: [
      "Your effective tax rate is always lower than your highest bracket rate — many people confuse the two",
      "US: Federal tax is just one part — you may also owe state tax (0-13%), Social Security (6.2%), and Medicare (1.45%)",
      "UK: Personal Allowance (tax-free threshold) is £12,570. The basic rate of 20% starts above this",
      "India: Compare New vs Old regime — New has lower rates, Old allows more deductions. Calculate both and compare",
      "Many countries offer tax-saving investments or deductions — check your local tax authority's website for options",
    ],
    faqs: [
      { q: "What is the difference between tax bracket and effective rate?", a: "Your tax bracket is the highest rate applied to your top income. Effective rate is your actual average rate (total tax / total income). They're often very different due to progressive brackets." },
      { q: "How do US federal taxes work?", a: "The US uses progressive brackets. In 2026, rates range from 10% to 37%. Only the income within each bracket is taxed at that rate. Standard deduction reduces your taxable income before brackets apply." },
      { q: "How does UK income tax work?", a: "UK tax has a Personal Allowance (£12,570 tax-free), then 20% basic rate, 40% higher rate above £50,270, and 45% additional rate above £125,140." },
    ],
  },

  currency: {
    howItWorks: "The currency converter uses live exchange rates from the European Central Bank (ECB) to convert between 30+ world currencies. Rates are fetched in real-time when you load the page. The ECB publishes official reference rates daily, used by banks and financial institutions worldwide.",
    formula: "Converted = Amount / From Rate x To Rate\n(both rates relative to USD base)",
    formulaExplained: "All rates are relative to USD (base currency). To convert between any two currencies: first convert to USD (divide by source rate), then to the target currency (multiply by target rate).",
    example: {
      setup: "You need to convert 1,000 between two currencies.",
      calculation: "Using the ECB mid-market rate, the calculator converts your amount via the USD base rate. Your bank will offer a slightly different rate (usually 1-3% worse) because they add their markup.",
      result: "The rate shown is the official ECB mid-market rate — the true exchange rate before any bank markup. For large transfers, services like Wise offer rates much closer to this than traditional banks.",
    },
    tips: [
      "Exchange rates fluctuate constantly — the rate you see here is the mid-market rate, not what banks offer (they add 1-3% markup)",
      "For large transfers, use services like Wise or Remitly instead of banks — they offer rates closer to mid-market",
      "Avoid exchanging currency at airports — they offer the worst rates (5-10% markup)",
      "ECB rates are published daily at 4pm CET and reflect the average across major banks",
    ],
    faqs: [
      { q: "How accurate are these exchange rates?", a: "The rates come from the European Central Bank (ECB), the most trusted source for exchange rates globally. They're updated daily. For real-time trading rates, use a forex platform." },
      { q: "Why is the bank rate different?", a: "Banks add a markup (spread) of 1-3% on top of the mid-market rate. The rate shown here is the mid-market rate — the true exchange rate before any markup." },
      { q: "What is the best time to convert currency?", a: "Exchange rates fluctuate based on market conditions. There's no guaranteed 'best time', but mid-week (Tue-Thu) tends to have slightly better rates than weekends when markets have less liquidity." },
    ],
  },

  retirement: {
    howItWorks: "The retirement calculator projects how much your savings will grow by the time you retire. It combines two components: the growth of your existing savings (compounded annually) and the growth of regular monthly contributions (compounded monthly via SIP formula). The result shows your estimated retirement corpus.",
    formula: "Corpus = Existing Savings x (1+r)^years +\nMonthly Saving x ((1+r/12)^months - 1) / (r/12) x (1+r/12)",
    formulaExplained: "The first part compounds your current savings annually. The second part calculates the future value of your monthly contributions (same SIP formula). The total is your projected retirement fund.",
    example: {
      setup: "You're 30 years old and want to retire at 65. You have 50,000 saved and can invest 500 per month, expecting 8% annual returns.",
      calculation: "Two things grow simultaneously: 1) Your existing 50,000 compounds for 35 years. 2) Your 500/month contributions compound monthly. Both streams combine into your retirement corpus.",
      result: "By age 65, you'll have approximately 1,120,000. You only invested about 260,000 from your pocket — the remaining 860,000 came from returns. That's over 4x your money. Starting 5 years earlier would add hundreds of thousands more.",
    },
    tips: [
      "Start early — investing 300/month from age 25 beats investing 900/month from age 35 due to compounding",
      "Increase your monthly saving by 5-10% every year (step-up) to keep pace with salary growth and inflation",
      "Factor in inflation — your corpus needs to be much larger than you think. Money loses purchasing power over time (typically 2-5% per year)",
      "The 4% Rule: you can generally withdraw 4% of your corpus per year in retirement without running out. A 1,000,000 corpus supports about 40,000/year in withdrawals",
      "Diversify across stocks, bonds, real estate, and other assets — don't keep all retirement savings in one place",
    ],
    faqs: [
      { q: "How much do I need to retire?", a: "A common rule: you need 25-30x your annual expenses at retirement. If you spend 40,000/year, you need about 1,000,000-1,200,000. Adjust for your country's cost of living and healthcare costs." },
      { q: "What return rate should I assume?", a: "Conservative: 5-6% (bond-heavy). Moderate: 7-9% (balanced). Aggressive: 10-12% (equity-heavy). For planning, use a moderate rate to be realistic. Historical stock market returns average 7-10% after inflation." },
      { q: "Can I retire early?", a: "Yes, but you need a larger corpus because it must last longer. For early retirement at 45 (instead of 65), you need roughly 1.5-2x what you'd need at 65, because your money needs to last 20+ more years." },
    ],
  },

  // ── NEW Financial Calculators ─────────────────────

  "loan-eligibility": {
    howItWorks: "The loan eligibility calculator estimates the maximum loan amount you can qualify for based on your income, existing debts, and the bank's affordability criteria. Banks typically allow EMIs up to 40-50% of your net monthly income minus existing obligations.",
    formula: "Max EMI = (Monthly Income - Existing EMIs) × 0.5\nMax Loan = EMI × ((1+r)^n - 1) / (r × (1+r)^n)",
    formulaExplained: "The bank first calculates how much EMI you can afford (50% of income minus existing EMIs). Then it reverse-calculates the maximum principal that EMI can service at the given interest rate and tenure.",
    example: { setup: "You earn 8,000/month with 500 in existing EMIs. You want a 20-year loan at 8.5%.", calculation: "Max EMI = (8,000 - 500) × 0.5 = 3,750. Using the reverse EMI formula at 8.5% for 20 years, this EMI can service a principal of about 430,000.", result: "You can afford a loan of approximately 430,000. With a 20% down payment, you could buy a property worth about 537,000." },
    tips: [
      "Banks typically cap total EMIs at 40-50% of your monthly take-home pay",
      "Reducing existing debts (credit cards, car loans) directly increases your loan eligibility",
      "A longer tenure increases eligibility but also means more total interest paid",
      "Joint applications (with spouse) combine incomes and significantly boost eligibility",
      "A higher credit score (750+) can get you better rates, which means higher loan eligibility for the same EMI",
    ],
    faqs: [
      { q: "What factors affect loan eligibility?", a: "Key factors: monthly income, existing debts/EMIs, credit score, age, employment type (salaried vs self-employed), loan tenure, and interest rate. Banks also consider job stability and employer reputation." },
      { q: "Does loan eligibility include down payment?", a: "No. Loan eligibility shows the maximum loan amount the bank will lend. The property you can buy = loan amount + your down payment. Banks typically require 10-20% down payment." },
      { q: "How can I increase my loan eligibility?", a: "Pay off existing debts, increase income, opt for a longer tenure, add a co-applicant, improve your credit score, or choose a lower interest rate (compare banks)." },
    ],
  },

  "savings-goal": {
    howItWorks: "The savings goal calculator helps you figure out either how long it will take to reach a savings target, or how much you need to save monthly to reach it by a specific date. It factors in your current savings, monthly contributions, and expected investment returns.",
    formula: "FV = PV × (1+r)^n + PMT × ((1+r)^n - 1) / r\nSolve for n (time) or PMT (monthly saving)",
    formulaExplained: "FV = future value (your goal), PV = present value (current savings), PMT = monthly contribution, r = monthly return rate, n = number of months.",
    example: { setup: "You want to save 50,000 in 5 years. You have 5,000 saved and expect 7% annual returns.", calculation: "Your current 5,000 will grow to about 7,013 in 5 years. You need the remaining 42,987 from monthly contributions. With 7% returns and compounding, you need to save about 605 per month.", result: "Save 605/month to reach your 50,000 goal in 5 years. You'll contribute 36,300 from your pocket — the rest comes from investment returns." },
    tips: [
      "Start as early as possible — even small amounts benefit enormously from compound growth",
      "Automate your savings — set up automatic transfers on payday so you save before you spend",
      "Increase your monthly saving by 10% each year to accelerate toward your goal",
      "Keep your goal savings in a separate account to avoid temptation to spend it",
    ],
    faqs: [
      { q: "What return rate should I assume?", a: "For savings accounts: 2-5%. For conservative investments (bonds): 5-7%. For equity/index funds: 8-12%. Use a conservative estimate to avoid falling short of your goal." },
      { q: "Should I invest or just save?", a: "For goals under 2 years: save in a high-yield savings account (safe, liquid). For 2-5 years: mix of bonds and equity. For 5+ years: primarily equity/index funds for higher returns." },
    ],
  },

  "investment": {
    howItWorks: "The investment calculator shows how your money grows over time with an initial investment, regular monthly additions, and compound returns. It demonstrates the power of compounding — earning returns on your returns.",
    formula: "FV = PV × (1+r)^n + PMT × ((1+r)^n - 1) / r × (1+r)",
    formulaExplained: "FV = future value, PV = initial investment, PMT = monthly addition, r = monthly return rate (annual / 12 / 100), n = total months.",
    example: { setup: "You invest 10,000 initially and add 500/month for 20 years at 10% annual return.", calculation: "Your initial 10,000 grows through compounding while your monthly 500 additions also earn returns. Over 20 years, compound growth accelerates dramatically in the later years.", result: "Your portfolio grows to about 445,000. You invested 130,000 total (10,000 + 500×240). Your returns: 315,000 — a 3.4x growth multiplier. Over 70% of your final amount comes from investment returns, not your contributions." },
    tips: [
      "The earlier you start, the more compound growth works in your favor — time is the biggest factor",
      "Increasing monthly contributions by even a small amount has a massive long-term impact",
      "Don't try to time the market — consistent monthly investing (dollar-cost averaging) smooths out volatility",
      "Reinvest dividends and returns to maximize compounding",
    ],
    faqs: [
      { q: "What is compound interest?", a: "Compound interest means earning interest on your interest. If you invest 1,000 at 10%, you earn 100 in year 1. In year 2, you earn 10% on 1,100 (= 110), not just the original 1,000. This snowball effect accelerates over time." },
      { q: "Is 10% return realistic?", a: "The S&P 500 has historically returned about 10% annually (7% after inflation) over 30+ year periods. Individual years vary wildly (-37% to +52%), but long-term averages are consistent. Past performance doesn't guarantee future results." },
    ],
  },

  "inflation": {
    howItWorks: "The inflation calculator shows how rising prices erode the value of your money over time. It calculates both what things will cost in the future and what your current money will actually be able to buy.",
    formula: "Future Cost = Present Cost × (1 + inflation)^years\nPurchasing Power = Present Amount / (1 + inflation)^years",
    formulaExplained: "inflation = annual inflation rate as decimal, years = number of years into the future.",
    example: { setup: "You have 100,000 today and inflation averages 5% per year for 20 years.", calculation: "Each year, prices rise by 5%. After 20 years, the cumulative effect means prices have more than doubled.", result: "What costs 100,000 today will cost 265,330 in 20 years. Your 100,000 will only buy what 37,689 can buy today — a 62% loss in purchasing power. This is why keeping money in a zero-interest savings account is actually losing money." },
    tips: [
      "Inflation is the silent wealth killer — even 3% inflation halves your purchasing power in 24 years",
      "Your investments must beat inflation to actually grow in real terms — a 5% return with 3% inflation is only 2% real growth",
      "Essential goods (healthcare, education, housing) often inflate faster than the general rate",
      "Real assets (stocks, real estate) tend to keep pace with or outpace inflation over the long term",
    ],
    faqs: [
      { q: "What is a normal inflation rate?", a: "Most developed economies target 2-3% annual inflation. Emerging economies often see 4-8%. Hyperinflation (50%+/month) is rare but devastating. Central banks use interest rates to control inflation." },
      { q: "How does inflation affect my savings?", a: "If your savings earn 2% but inflation is 5%, your money loses 3% of its real value each year. After 10 years, your purchasing power drops by about 26%. Always compare savings rates to inflation." },
    ],
  },

  "cagr": {
    howItWorks: "CAGR (Compound Annual Growth Rate) tells you the steady annual rate at which something grew from its beginning value to its ending value. It smooths out the ups and downs to give you one consistent percentage.",
    formula: "CAGR = (Ending Value / Beginning Value)^(1/years) - 1",
    formulaExplained: "Ending Value = final amount, Beginning Value = starting amount, years = total time period. The result is expressed as a percentage.",
    example: { setup: "You invested 10,000 five years ago and it's now worth 18,000.", calculation: "CAGR = (18,000 / 10,000)^(1/5) - 1 = (1.8)^0.2 - 1 = 0.1247 = 12.47%", result: "Your investment grew at 12.47% CAGR — equivalent to a steady 12.47% annual return each year. The total return was 80% (8,000 profit), which is a 1.8x growth multiplier." },
    tips: [
      "CAGR is the best way to compare investments with different time periods — it normalizes everything to annual growth",
      "A CAGR above 15% over 5+ years is exceptional for equity investments",
      "CAGR hides volatility — an investment could have dropped 50% one year and recovered, but CAGR only shows the smoothed average",
      "Compare CAGR to benchmark indices (S&P 500 ~10%, Nifty 50 ~12%) to evaluate performance",
    ],
    faqs: [
      { q: "What is a good CAGR?", a: "Depends on the context. For equity investments: 12-15% is good, 15-20% is excellent. For revenue growth: 20%+ is strong for startups, 5-10% is good for mature businesses. For GDP growth: 3-5% is healthy for developing countries." },
      { q: "How is CAGR different from average return?", a: "Average return is arithmetic: (10% + 20% + -5%) / 3 = 8.3%. CAGR is geometric: it accounts for compounding. If you start with 100, go to 110 (+10%), then 132 (+20%), then 125.4 (-5%), your CAGR is 7.8%. CAGR is more accurate for investment comparison." },
    ],
  },

  "break-even": {
    howItWorks: "The break-even calculator tells you exactly how many units you need to sell to cover all your costs. Below the break-even point, you're losing money. Above it, every additional sale is profit.",
    formula: "Break-Even Quantity = Fixed Costs / (Selling Price - Variable Cost per Unit)\nBreak-Even Revenue = Break-Even Quantity × Selling Price",
    formulaExplained: "Fixed Costs = costs that don't change (rent, salaries, insurance). Variable Cost per Unit = costs per item (materials, shipping). Selling Price = price you charge per unit. (Selling Price - Variable Cost) = Contribution Margin.",
    example: { setup: "Your fixed costs are 10,000/month. Each product costs 15 to make and you sell it for 40.", calculation: "Contribution margin = 40 - 15 = 25 per unit. Break-even = 10,000 / 25 = 400 units.", result: "You need to sell 400 units per month (about 13 per day) to break even. That's 16,000 in revenue. Every unit after 400 earns you 25 in pure profit." },
    tips: [
      "Lowering fixed costs or increasing selling price are the fastest ways to reach break-even sooner",
      "Track your contribution margin (price minus variable cost) — it tells you how much each sale contributes to covering fixed costs",
      "If your break-even point seems too high, consider whether your pricing is too low or costs too high",
      "Seasonal businesses should calculate break-even on an annual basis, not monthly",
    ],
    faqs: [
      { q: "What are fixed costs vs variable costs?", a: "Fixed costs stay the same regardless of sales: rent, salaries, insurance, software subscriptions. Variable costs change with each unit: raw materials, packaging, shipping, sales commissions. Some costs are mixed — electricity is partially fixed, partially variable." },
      { q: "Why is break-even analysis important?", a: "It tells you the minimum sales needed to survive. It helps with pricing decisions, evaluating new products, and understanding how changes in cost or price affect profitability. Every business plan should include a break-even analysis." },
    ],
  },

  "profit-margin": {
    howItWorks: "The profit margin calculator shows you the percentage of revenue that becomes profit after costs. It helps you understand pricing, compare products, and evaluate business efficiency.",
    formula: "Profit = Revenue - Cost\nProfit Margin (%) = (Profit / Revenue) × 100\nMarkup (%) = (Profit / Cost) × 100",
    formulaExplained: "Revenue = what you sell for, Cost = what it costs you, Profit = what you keep. Margin is profit as % of revenue; Markup is profit as % of cost. They're related but different numbers.",
    example: { setup: "You buy a product for 60 and sell it for 100.", calculation: "Profit = 100 - 60 = 40. Margin = 40/100 = 40%. Markup = 40/60 = 66.7%.", result: "Your profit margin is 40% (for every dollar of revenue, you keep 40 cents). Your markup is 66.7% (you charge 66.7% more than your cost). Margin and markup are different ways of expressing the same profit." },
    tips: [
      "Profit margin and markup are NOT the same — a 50% markup equals only a 33.3% profit margin",
      "Healthy margins vary by industry: software 70-90%, retail 25-50%, food service 5-15%, manufacturing 10-25%",
      "Focus on margin, not just revenue — a business doing 1M at 5% margin makes less than one doing 500K at 20% margin",
      "Calculate margin per product to identify which products are most and least profitable",
    ],
    faqs: [
      { q: "What is a good profit margin?", a: "It depends on the industry. SaaS/software: 60-80% gross margin is common. Retail: 25-50%. Restaurants: 3-9% net margin. Professional services: 15-30%. Above your industry average is 'good.' Below means there's room to optimize." },
      { q: "What is the difference between margin and markup?", a: "Margin = profit as % of selling price. Markup = profit as % of cost. Example: buy for 60, sell for 100. Margin = 40% (40/100). Markup = 66.7% (40/60). Margin is always lower than markup for the same transaction." },
    ],
  },

  // ── NEW Health Calculators ────────────────────────

  "calorie": {
    howItWorks: "The calorie calculator estimates your Total Daily Energy Expenditure (TDEE) — the total number of calories you burn in a day. It first calculates your Basal Metabolic Rate (BMR, calories burned at rest) and then multiplies by an activity factor.",
    formula: "Male BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5\nFemale BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161\nTDEE = BMR × Activity Multiplier",
    formulaExplained: "Uses the Mifflin-St Jeor equation (most accurate for modern populations). Activity multipliers: Sedentary (1.2), Light (1.375), Moderate (1.55), Active (1.725), Very Active (1.9).",
    example: { setup: "A 30-year-old male, 75kg, 175cm, moderately active.", calculation: "BMR = 10 × 75 + 6.25 × 175 - 5 × 30 + 5 = 750 + 1093.75 - 150 + 5 = 1698.75 cal/day. TDEE = 1698.75 × 1.55 = 2633 cal/day.", result: "You burn approximately 2,633 calories per day. To lose 0.5kg/week, eat about 2,133 calories (deficit of 500/day). To gain 0.5kg/week, eat about 3,133 calories." },
    tips: [
      "A 500 calorie daily deficit leads to about 0.5kg (1lb) of weight loss per week — don't cut more drastically",
      "TDEE varies daily — this is an estimate. Track your weight over 2-3 weeks to calibrate your actual needs",
      "Protein should make up 25-35% of your calories to preserve muscle during weight loss",
      "Exercise calories are often overestimated by fitness trackers — be conservative when eating back exercise calories",
    ],
    faqs: [
      { q: "What is the difference between BMR and TDEE?", a: "BMR (Basal Metabolic Rate) is what you burn doing absolutely nothing — just breathing, pumping blood, and keeping organs running. TDEE adds all your daily activities on top of BMR: walking, working, exercising. TDEE is what you actually burn in a day." },
      { q: "How accurate is this calculator?", a: "The Mifflin-St Jeor equation is within 10% accuracy for most people. Individual variations exist due to genetics, muscle mass, hormones, and metabolic adaptation. Use this as a starting point and adjust based on real results over 2-3 weeks." },
      { q: "Should I eat my BMR or TDEE to lose weight?", a: "Never eat below your BMR — that's the minimum your body needs to function. For weight loss, eat between BMR and TDEE. A deficit of 500 calories below TDEE is the standard recommendation for sustainable weight loss." },
    ],
  },

  "pregnancy": {
    howItWorks: "The pregnancy calculator uses Naegele's Rule to estimate your due date: add 280 days (40 weeks) to the first day of your last menstrual period (LMP). It also calculates your current pregnancy week, trimester, and upcoming milestones.",
    formula: "Due Date = Last Menstrual Period + 280 days\nCurrent Week = (Today - LMP) / 7\nConception Date ≈ LMP + 14 days",
    formulaExplained: "Naegele's Rule assumes a 28-day cycle with ovulation on day 14. Individual cycles vary, so the due date is an estimate — only 4% of babies arrive on their exact due date.",
    example: { setup: "Your last period started on January 15, 2026.", calculation: "Due date = January 15 + 280 days = October 22, 2026. Conception likely occurred around January 29, 2026 (LMP + 14 days).", result: "Your estimated due date is October 22, 2026. If today is April 12, you're in week 12 — the end of the first trimester. Your baby's major organs have formed and the risk of miscarriage drops significantly." },
    tips: [
      "Only 4% of babies are born on their exact due date — the due date is an estimate within a 2-week window",
      "First trimester (weeks 1-12): major organ development, highest miscarriage risk",
      "Second trimester (weeks 13-26): often called the 'golden period' — energy returns, nausea subsides",
      "Full term is 37-42 weeks — babies born in this range are considered healthy timing",
    ],
    faqs: [
      { q: "How accurate is the due date calculation?", a: "Naegele's Rule gives a reasonable estimate, but only 4% of babies arrive on the exact date. About 80% are born within 2 weeks of the due date (38-42 weeks). Ultrasound dating in the first trimester is more accurate than LMP-based calculation." },
      { q: "What if my cycle isn't 28 days?", a: "If your cycle is longer (e.g., 35 days), your ovulation likely occurred later, so your actual due date may be a few days later than calculated. Your doctor will adjust based on early ultrasound measurements." },
    ],
  },

  "body-fat": {
    howItWorks: "The body fat calculator uses the US Navy method to estimate body fat percentage from simple body measurements — no expensive equipment needed. It uses your height, neck, waist, and hip (for women) circumferences.",
    formula: "Male: BF% = 86.010 × log10(waist - neck) - 70.041 × log10(height) + 36.76\nFemale: BF% = 163.205 × log10(waist + hip - neck) - 97.684 × log10(height) - 78.387",
    formulaExplained: "All measurements in centimeters (or inches for the imperial version). The US Navy method correlates well with hydrostatic weighing (the gold standard) within 1-3% accuracy for most people.",
    example: { setup: "A male with height 175cm, neck 38cm, and waist 85cm.", calculation: "BF% = 86.010 × log10(85 - 38) - 70.041 × log10(175) + 36.76 = 86.010 × 1.672 - 70.041 × 2.243 + 36.76", result: "Body fat is approximately 18.2% — categorized as 'Fitness' range. Fat mass: about 13.7kg. Lean mass: about 61.3kg. This is within the healthy range for adult males (14-24%)." },
    tips: [
      "Measure at the same time each day (morning, before eating) for consistency",
      "Healthy body fat ranges: Men 14-24%, Women 21-31%. Athletes are typically lower",
      "BMI doesn't distinguish between muscle and fat — body fat percentage is a better health indicator",
      "Waist circumference alone is a strong predictor of health risks: over 40 inches (men) or 35 inches (women) increases risk",
    ],
    faqs: [
      { q: "How accurate is the US Navy method?", a: "Within 1-3% of hydrostatic weighing (underwater weighing) for most people. It's less accurate for very lean athletes or obese individuals. DEXA scans are the gold standard but cost $50-150 per scan." },
      { q: "What is a healthy body fat percentage?", a: "Men: Essential fat 2-5%, Athletes 6-13%, Fitness 14-17%, Average 18-24%, Obese 25%+. Women: Essential 10-13%, Athletes 14-20%, Fitness 21-24%, Average 25-31%, Obese 32%+." },
    ],
  },

  "water-intake": {
    howItWorks: "The water intake calculator estimates your daily hydration needs based on body weight, activity level, climate, and exercise duration. The base recommendation is about 33ml per kg of body weight, adjusted for lifestyle factors.",
    formula: "Base Intake = Weight(kg) × 0.033 liters\nAdjusted = Base × Activity Factor × Climate Factor + Exercise Bonus",
    formulaExplained: "Activity multiplier: Sedentary (1.0), Moderate (1.2), Active (1.3), Very Active (1.4). Climate: Temperate (1.0), Hot/Humid (1.1), Cold (1.05). Exercise bonus: 350ml per 30 minutes of exercise.",
    example: { setup: "A 70kg person who exercises for 60 minutes daily in a hot climate.", calculation: "Base = 70 × 0.033 = 2.31L. Activity factor (active): × 1.3 = 3.0L. Climate (hot): × 1.1 = 3.3L. Exercise bonus: 60min × 350ml/30min = 700ml.", result: "You should drink approximately 4.0 liters (about 16 glasses) of water per day. This includes water from food (about 20% of intake comes from food for most people)." },
    tips: [
      "Drink water before you feel thirsty — by the time you're thirsty, you're already mildly dehydrated",
      "Urine color is the best hydration indicator: pale yellow = well hydrated, dark yellow = drink more",
      "Coffee and tea count toward your water intake — the diuretic effect is mild",
      "Increase intake in hot weather, at high altitude, during illness, and during pregnancy/breastfeeding",
    ],
    faqs: [
      { q: "Is 8 glasses a day really enough?", a: "The '8 glasses' rule (about 2 liters) is a rough guideline that works for sedentary, average-weight adults in temperate climates. Larger, more active, or warm-climate individuals need significantly more. This calculator gives a personalized estimate." },
      { q: "Can I drink too much water?", a: "Yes, though it's rare. Hyponatremia (water intoxication) occurs when you drink so much that blood sodium levels drop dangerously. This mainly affects endurance athletes who drink excessively during events. For most people, your kidneys can handle 0.8-1 liter per hour." },
    ],
  },

  "heart-rate": {
    howItWorks: "The heart rate zone calculator determines your maximum heart rate and 5 training zones. Each zone represents a different exercise intensity level, targeting different fitness goals from fat burning to peak performance.",
    formula: "Max Heart Rate = 220 - Age\nKarvonen Zone = ((Max HR - Resting HR) × Intensity%) + Resting HR",
    formulaExplained: "The simple formula (220 - age) estimates max HR. The Karvonen formula (used when you provide resting HR) gives more personalized zones based on your heart rate reserve (max minus resting).",
    example: { setup: "A 30-year-old with a resting heart rate of 65 bpm.", calculation: "Max HR = 220 - 30 = 190 bpm. Heart rate reserve = 190 - 65 = 125 bpm. Fat burn zone (60-70%): 65 + (125 × 0.6) to 65 + (125 × 0.7) = 140-152 bpm.", result: "Your max HR is 190 bpm. Fat burn zone: 140-152 bpm. Cardio zone: 152-165 bpm. Peak zone: 171-190 bpm. For general fitness, aim for the cardio zone during workouts." },
    tips: [
      "Zone 2 (fat burn, 60-70% max HR) is where your body primarily uses fat for fuel — great for long, steady-state cardio",
      "Zone 3-4 (cardio/threshold) improves cardiovascular fitness and endurance most effectively",
      "If you know your resting HR, enter it for more accurate personalized zones (Karvonen method)",
      "Morning resting heart rate is a good fitness indicator — lower is generally better (athletes: 40-60 bpm)",
    ],
    faqs: [
      { q: "What is the fat burning zone?", a: "The fat burning zone is 60-70% of your max heart rate. At this intensity, a higher percentage of calories come from fat. However, higher-intensity exercise burns more TOTAL calories per minute. Both approaches work for weight loss — consistency matters more than zone." },
      { q: "How do I measure resting heart rate?", a: "Measure first thing in the morning, before getting out of bed. Count your pulse for 60 seconds (or 30 seconds × 2). Do this for 3 consecutive mornings and average the results. Most fitness trackers also track resting HR automatically." },
    ],
  },

  // ── NEW Math/Utility Calculators ──────────────────

  "scientific": {
    howItWorks: "A full scientific calculator with standard arithmetic, trigonometric functions, logarithms, powers, roots, and memory operations. It supports both degree and radian modes for trigonometric calculations.",
    formula: "Supports: +, -, ×, ÷, sin, cos, tan, log, ln, √, x², xʸ, π, e, %, 1/x",
    formulaExplained: "Standard mathematical operations following PEMDAS order. Trigonometric functions can operate in degrees (DEG) or radians (RAD). Logarithms use base 10 (log) and natural base e (ln).",
    example: { setup: "Calculate sin(45°) + log(100).", calculation: "sin(45°) = 0.7071 (in DEG mode). log(100) = 2. Sum = 2.7071.", result: "The answer is 2.7071. The scientific calculator handles complex expressions with proper order of operations, parentheses, and function nesting." },
    tips: [
      "Use keyboard keys for quick input: numbers, +, -, *, /, Enter (=), Escape (clear), Backspace (delete)",
      "Toggle DEG/RAD mode for trigonometric functions — most everyday calculations use degrees",
      "Use parentheses to control order of operations: 2 × (3 + 4) = 14, not 2 × 3 + 4 = 10",
      "Memory functions (M+, M-, MR, MC) let you store intermediate results for multi-step calculations",
    ],
    faqs: [
      { q: "What is the difference between DEG and RAD?", a: "Degrees divide a circle into 360 parts. Radians use the ratio of arc length to radius — a full circle is 2π radians. Most everyday math uses degrees (90° is a right angle). Physics and advanced math often use radians (π/2 is a right angle)." },
      { q: "What is the natural logarithm (ln)?", a: "The natural logarithm (ln) uses base e (≈ 2.718). It's the inverse of the exponential function e^x. It appears everywhere in science, finance (continuous compounding), and statistics. Regular log uses base 10." },
    ],
  },

  "date": {
    howItWorks: "The date calculator performs three types of date math: finding the number of days between two dates, adding or subtracting days/weeks/months/years from a date, and finding the day number within a year.",
    formula: "Days Between = |Date2 - Date1|\nAdd Days: New Date = Date + N days/weeks/months/years\nDay of Year = days elapsed since January 1",
    formulaExplained: "Date arithmetic accounts for varying month lengths (28-31 days) and leap years (366 days). When adding months, if the target month doesn't have the same day (e.g., Jan 31 + 1 month), it rolls to the last valid day.",
    example: { setup: "How many days between January 15, 2026 and December 25, 2026?", calculation: "Counting from January 15 to December 25, accounting for each month's length: 16(Jan) + 28(Feb) + 31(Mar) + 30(Apr) + 31(May) + 30(Jun) + 31(Jul) + 31(Aug) + 30(Sep) + 31(Oct) + 30(Nov) + 25(Dec)", result: "There are 344 days between these dates — that's 49 weeks and 1 day, or about 11 months and 10 days." },
    tips: [
      "Remember: months have different lengths — 30 days (Apr, Jun, Sep, Nov), 31 days (Jan, Mar, May, Jul, Aug, Oct, Dec), 28/29 days (Feb)",
      "Leap years occur every 4 years, except century years (unless divisible by 400) — 2024 was a leap year, 2100 won't be",
      "Use the 'Add/Subtract' mode to calculate deadlines, due dates, or expiration dates",
    ],
    faqs: [
      { q: "How do I know if a year is a leap year?", a: "A year is a leap year if: (1) it's divisible by 4, AND (2) if it's a century year, it must also be divisible by 400. So 2024 is a leap year, 2100 is NOT, but 2000 was." },
      { q: "Does this account for time zones?", a: "This calculator works with dates only (not times), so time zones don't affect the calculation. The day count is the same regardless of your time zone." },
    ],
  },

  "timezone": {
    howItWorks: "The time zone converter translates a specific time from one time zone to another, accounting for the UTC offset difference between them. It also shows whether the conversion crosses midnight (changing the date).",
    formula: "Target Time = Source Time + (Target UTC Offset - Source UTC Offset)",
    formulaExplained: "Each time zone has a UTC offset (e.g., EST = UTC-5, IST = UTC+5:30). The difference between offsets determines the time shift. If the result exceeds 24:00 or goes below 00:00, the date changes.",
    example: { setup: "Convert 3:00 PM EST (New York) to IST (India).", calculation: "EST = UTC-5, IST = UTC+5:30. Difference = 5:30 - (-5) = 10:30 hours. 3:00 PM + 10:30 = 1:30 AM (+1 day).", result: "When it's 3:00 PM in New York, it's 1:30 AM the next day in India. The time difference is 10 hours and 30 minutes." },
    tips: [
      "Remember that some time zones have 30 or 45 minute offsets (India +5:30, Nepal +5:45, Iran +3:30)",
      "Daylight Saving Time shifts clocks by 1 hour — this calculator uses standard offsets, so check if DST is active",
      "Use the world clock view at the top to quickly see current times in major cities",
      "When scheduling international meetings, find overlapping business hours (typically 2-4 hours of overlap)",
    ],
    faqs: [
      { q: "What is UTC?", a: "UTC (Coordinated Universal Time) is the world's time standard. All time zones are defined as offsets from UTC. For example, EST = UTC-5 (5 hours behind UTC), JST = UTC+9 (9 hours ahead). UTC itself doesn't observe daylight saving." },
      { q: "Does this account for Daylight Saving Time?", a: "This calculator uses standard UTC offsets. During DST periods (typically March-November in Northern Hemisphere), some time zones shift by 1 hour. Check if DST is currently active in your region for the most accurate conversion." },
    ],
  },

  "gpa": {
    howItWorks: "The GPA calculator computes your Grade Point Average by weighting each course's grade points by its credit hours. A higher-credit course has more impact on your GPA than a lower-credit one.",
    formula: "GPA = Σ(Grade Points × Credits) / Σ(Credits)",
    formulaExplained: "Grade Points: A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0.0. Credits = credit hours for each course. The sum of (grade points × credits) divided by total credits gives the weighted GPA.",
    example: { setup: "Semester with: Math (4 credits, A), English (3 credits, B+), Science (4 credits, A-), History (3 credits, B).", calculation: "Math: 4.0 × 4 = 16.0. English: 3.3 × 3 = 9.9. Science: 3.7 × 4 = 14.8. History: 3.0 × 3 = 9.0. Total: 49.7 / 14 credits.", result: "Your semester GPA is 3.55 — that's between an A- and B+ average. On a 14-credit load, this is a strong academic performance." },
    tips: [
      "Higher-credit courses affect your GPA more — prioritize performing well in 4-5 credit courses",
      "A single F (0.0) in a 4-credit course can drop your GPA by 0.3-0.5 points — it's very hard to recover from",
      "Many graduate programs require a minimum 3.0 GPA; competitive programs want 3.5+",
      "If your university uses a different scale (e.g., 10-point or percentage), convert to the 4.0 scale for comparison",
    ],
    faqs: [
      { q: "What is a good GPA?", a: "3.5-4.0 is excellent (Dean's List at most universities). 3.0-3.5 is good. 2.5-3.0 is average. Below 2.0 may trigger academic probation. For competitive jobs/grad school, aim for 3.5+." },
      { q: "How is cumulative GPA different from semester GPA?", a: "Semester GPA covers one semester's courses. Cumulative GPA covers ALL semesters combined, weighted by credits. Your cumulative GPA is what appears on your transcript and what employers/grad schools look at." },
    ],
  },

  "unit-converter": {
    howItWorks: "The unit converter translates values between different measurement units across 8 categories: length, weight, temperature, speed, area, volume, digital storage, and time. It uses standard conversion factors recognized internationally.",
    formula: "Target Value = Source Value × Conversion Factor\n(Temperature uses linear conversion: °F = °C × 9/5 + 32)",
    formulaExplained: "Each unit has a base factor relative to the SI standard unit in its category. Multiply by the source factor, divide by the target factor. Temperature is the exception — it uses a linear formula instead of a simple ratio.",
    example: { setup: "Convert 5 miles to kilometers.", calculation: "1 mile = 1.60934 kilometers. 5 miles × 1.60934 = 8.04672 km.", result: "5 miles = 8.047 kilometers. The converter works bidirectionally — typing in either field updates the other instantly." },
    tips: [
      "Quick mental conversions: 1 mile ≈ 1.6 km, 1 kg ≈ 2.2 lbs, 1 inch = 2.54 cm exactly",
      "Temperature: 0°C = 32°F = 273.15K. Room temp: 20°C = 68°F. Body temp: 37°C = 98.6°F",
      "Digital storage: 1 GB = 1,024 MB (binary) or 1,000 MB (decimal). This converter uses binary (1024-based) as used by operating systems",
      "Use the swap button to quickly reverse the conversion direction",
    ],
    faqs: [
      { q: "Why are there two types of gallons?", a: "US gallon = 3.785 liters. Imperial (UK) gallon = 4.546 liters. The UK gallon is about 20% larger. This matters for fuel economy comparisons: UK MPG figures are always higher than US MPG for the same car." },
      { q: "What is the difference between metric ton and imperial ton?", a: "Metric ton (tonne) = 1,000 kg = 2,204.6 lbs. Imperial (long) ton = 2,240 lbs = 1,016 kg. US (short) ton = 2,000 lbs = 907.2 kg. The metric ton is the international standard." },
    ],
  },
};
