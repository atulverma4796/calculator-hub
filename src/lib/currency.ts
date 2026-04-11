export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  // Default amounts for calculators (localized to make sense in each currency)
  defaultLoan: number;
  defaultSIP: number;
  defaultSalary: number;
  defaultPrice: number;
  defaultBill: number;
  defaultFuelPrice: number;
  fuelUnit: "kmpl" | "mpg";
  distanceUnit: "km" | "miles";
}

const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  // ─── Americas ───
  USD: {
    code: "USD", symbol: "$", name: "US Dollar", locale: "en-US",
    defaultLoan: 300000, defaultSIP: 500, defaultSalary: 55000, defaultPrice: 100,
    defaultBill: 50, defaultFuelPrice: 3.5, fuelUnit: "mpg", distanceUnit: "miles",
  },
  CAD: {
    code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA",
    defaultLoan: 400000, defaultSIP: 500, defaultSalary: 55000, defaultPrice: 120,
    defaultBill: 55, defaultFuelPrice: 1.7, fuelUnit: "kmpl", distanceUnit: "km",
  },
  BRL: {
    code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR",
    defaultLoan: 300000, defaultSIP: 500, defaultSalary: 36000, defaultPrice: 200,
    defaultBill: 100, defaultFuelPrice: 6, fuelUnit: "kmpl", distanceUnit: "km",
  },
  MXN: {
    code: "MXN", symbol: "MX$", name: "Mexican Peso", locale: "es-MX",
    defaultLoan: 2000000, defaultSIP: 3000, defaultSalary: 240000, defaultPrice: 1000,
    defaultBill: 500, defaultFuelPrice: 23, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── Europe ───
  GBP: {
    code: "GBP", symbol: "\u00A3", name: "British Pound", locale: "en-GB",
    defaultLoan: 250000, defaultSIP: 400, defaultSalary: 35000, defaultPrice: 80,
    defaultBill: 40, defaultFuelPrice: 1.5, fuelUnit: "mpg", distanceUnit: "miles",
  },
  EUR: {
    code: "EUR", symbol: "\u20AC", name: "Euro", locale: "en-DE",
    defaultLoan: 250000, defaultSIP: 400, defaultSalary: 40000, defaultPrice: 100,
    defaultBill: 45, defaultFuelPrice: 1.8, fuelUnit: "kmpl", distanceUnit: "km",
  },
  CHF: {
    code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH",
    defaultLoan: 500000, defaultSIP: 500, defaultSalary: 80000, defaultPrice: 100,
    defaultBill: 60, defaultFuelPrice: 1.9, fuelUnit: "kmpl", distanceUnit: "km",
  },
  PLN: {
    code: "PLN", symbol: "z\u0142", name: "Polish Zloty", locale: "pl-PL",
    defaultLoan: 400000, defaultSIP: 1000, defaultSalary: 72000, defaultPrice: 200,
    defaultBill: 100, defaultFuelPrice: 6.5, fuelUnit: "kmpl", distanceUnit: "km",
  },
  SEK: {
    code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE",
    defaultLoan: 3000000, defaultSIP: 3000, defaultSalary: 420000, defaultPrice: 500,
    defaultBill: 300, defaultFuelPrice: 18, fuelUnit: "kmpl", distanceUnit: "km",
  },
  NOK: {
    code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO",
    defaultLoan: 3500000, defaultSIP: 3000, defaultSalary: 500000, defaultPrice: 500,
    defaultBill: 400, defaultFuelPrice: 20, fuelUnit: "kmpl", distanceUnit: "km",
  },
  TRY: {
    code: "TRY", symbol: "\u20BA", name: "Turkish Lira", locale: "tr-TR",
    defaultLoan: 3000000, defaultSIP: 5000, defaultSalary: 300000, defaultPrice: 1000,
    defaultBill: 500, defaultFuelPrice: 42, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── South Asia ───
  INR: {
    code: "INR", symbol: "\u20B9", name: "Indian Rupee", locale: "en-IN",
    defaultLoan: 2500000, defaultSIP: 5000, defaultSalary: 600000, defaultPrice: 1000,
    defaultBill: 500, defaultFuelPrice: 100, fuelUnit: "kmpl", distanceUnit: "km",
  },
  PKR: {
    code: "PKR", symbol: "Rs", name: "Pakistani Rupee", locale: "en-PK",
    defaultLoan: 5000000, defaultSIP: 10000, defaultSalary: 600000, defaultPrice: 2000,
    defaultBill: 1000, defaultFuelPrice: 270, fuelUnit: "kmpl", distanceUnit: "km",
  },
  BDT: {
    code: "BDT", symbol: "\u09F3", name: "Bangladeshi Taka", locale: "bn-BD",
    defaultLoan: 3000000, defaultSIP: 5000, defaultSalary: 360000, defaultPrice: 2000,
    defaultBill: 500, defaultFuelPrice: 130, fuelUnit: "kmpl", distanceUnit: "km",
  },
  LKR: {
    code: "LKR", symbol: "Rs", name: "Sri Lankan Rupee", locale: "si-LK",
    defaultLoan: 5000000, defaultSIP: 10000, defaultSalary: 600000, defaultPrice: 5000,
    defaultBill: 2000, defaultFuelPrice: 370, fuelUnit: "kmpl", distanceUnit: "km",
  },
  NPR: {
    code: "NPR", symbol: "\u0930\u0942", name: "Nepali Rupee", locale: "ne-NP",
    defaultLoan: 3000000, defaultSIP: 5000, defaultSalary: 480000, defaultPrice: 2000,
    defaultBill: 500, defaultFuelPrice: 190, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── Southeast Asia ───
  SGD: {
    code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG",
    defaultLoan: 500000, defaultSIP: 500, defaultSalary: 60000, defaultPrice: 100,
    defaultBill: 50, defaultFuelPrice: 2.8, fuelUnit: "kmpl", distanceUnit: "km",
  },
  MYR: {
    code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY",
    defaultLoan: 400000, defaultSIP: 500, defaultSalary: 48000, defaultPrice: 200,
    defaultBill: 50, defaultFuelPrice: 2.1, fuelUnit: "kmpl", distanceUnit: "km",
  },
  THB: {
    code: "THB", symbol: "\u0E3F", name: "Thai Baht", locale: "th-TH",
    defaultLoan: 3000000, defaultSIP: 5000, defaultSalary: 360000, defaultPrice: 1000,
    defaultBill: 300, defaultFuelPrice: 40, fuelUnit: "kmpl", distanceUnit: "km",
  },
  IDR: {
    code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID",
    defaultLoan: 500000000, defaultSIP: 1000000, defaultSalary: 72000000, defaultPrice: 500000,
    defaultBill: 100000, defaultFuelPrice: 13000, fuelUnit: "kmpl", distanceUnit: "km",
  },
  PHP: {
    code: "PHP", symbol: "\u20B1", name: "Philippine Peso", locale: "en-PH",
    defaultLoan: 3000000, defaultSIP: 5000, defaultSalary: 360000, defaultPrice: 2000,
    defaultBill: 500, defaultFuelPrice: 65, fuelUnit: "kmpl", distanceUnit: "km",
  },
  VND: {
    code: "VND", symbol: "\u20AB", name: "Vietnamese Dong", locale: "vi-VN",
    defaultLoan: 2000000000, defaultSIP: 3000000, defaultSalary: 180000000, defaultPrice: 1000000,
    defaultBill: 200000, defaultFuelPrice: 25000, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── East Asia ───
  JPY: {
    code: "JPY", symbol: "\u00A5", name: "Japanese Yen", locale: "ja-JP",
    defaultLoan: 30000000, defaultSIP: 50000, defaultSalary: 5000000, defaultPrice: 10000,
    defaultBill: 5000, defaultFuelPrice: 170, fuelUnit: "kmpl", distanceUnit: "km",
  },
  KRW: {
    code: "KRW", symbol: "\u20A9", name: "South Korean Won", locale: "ko-KR",
    defaultLoan: 300000000, defaultSIP: 500000, defaultSalary: 40000000, defaultPrice: 100000,
    defaultBill: 30000, defaultFuelPrice: 1700, fuelUnit: "kmpl", distanceUnit: "km",
  },
  CNY: {
    code: "CNY", symbol: "\u00A5", name: "Chinese Yuan", locale: "zh-CN",
    defaultLoan: 1000000, defaultSIP: 3000, defaultSalary: 120000, defaultPrice: 500,
    defaultBill: 100, defaultFuelPrice: 8, fuelUnit: "kmpl", distanceUnit: "km",
  },
  HKD: {
    code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "en-HK",
    defaultLoan: 5000000, defaultSIP: 5000, defaultSalary: 360000, defaultPrice: 500,
    defaultBill: 200, defaultFuelPrice: 20, fuelUnit: "kmpl", distanceUnit: "km",
  },
  TWD: {
    code: "TWD", symbol: "NT$", name: "Taiwan Dollar", locale: "zh-TW",
    defaultLoan: 10000000, defaultSIP: 10000, defaultSalary: 600000, defaultPrice: 3000,
    defaultBill: 500, defaultFuelPrice: 30, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── Middle East (Gulf) ───
  AED: {
    code: "AED", symbol: "AED", name: "UAE Dirham", locale: "en-AE",
    defaultLoan: 1000000, defaultSIP: 2000, defaultSalary: 180000, defaultPrice: 500,
    defaultBill: 200, defaultFuelPrice: 3.2, fuelUnit: "kmpl", distanceUnit: "km",
  },
  SAR: {
    code: "SAR", symbol: "SAR", name: "Saudi Riyal", locale: "en-SA",
    defaultLoan: 800000, defaultSIP: 1500, defaultSalary: 150000, defaultPrice: 400,
    defaultBill: 150, defaultFuelPrice: 2.2, fuelUnit: "kmpl", distanceUnit: "km",
  },
  QAR: {
    code: "QAR", symbol: "QR", name: "Qatari Riyal", locale: "en-QA",
    defaultLoan: 1000000, defaultSIP: 2000, defaultSalary: 240000, defaultPrice: 500,
    defaultBill: 200, defaultFuelPrice: 1.8, fuelUnit: "kmpl", distanceUnit: "km",
  },
  KWD: {
    code: "KWD", symbol: "KD", name: "Kuwaiti Dinar", locale: "en-KW",
    defaultLoan: 80000, defaultSIP: 200, defaultSalary: 18000, defaultPrice: 50,
    defaultBill: 15, defaultFuelPrice: 0.1, fuelUnit: "kmpl", distanceUnit: "km",
  },
  BHD: {
    code: "BHD", symbol: "BD", name: "Bahraini Dinar", locale: "en-BH",
    defaultLoan: 100000, defaultSIP: 200, defaultSalary: 14000, defaultPrice: 50,
    defaultBill: 15, defaultFuelPrice: 0.16, fuelUnit: "kmpl", distanceUnit: "km",
  },
  OMR: {
    code: "OMR", symbol: "OMR", name: "Omani Rial", locale: "en-OM",
    defaultLoan: 100000, defaultSIP: 200, defaultSalary: 12000, defaultPrice: 50,
    defaultBill: 15, defaultFuelPrice: 0.2, fuelUnit: "kmpl", distanceUnit: "km",
  },
  EGP: {
    code: "EGP", symbol: "E\u00A3", name: "Egyptian Pound", locale: "ar-EG",
    defaultLoan: 2000000, defaultSIP: 5000, defaultSalary: 240000, defaultPrice: 2000,
    defaultBill: 500, defaultFuelPrice: 12.5, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── Oceania ───
  AUD: {
    code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU",
    defaultLoan: 500000, defaultSIP: 500, defaultSalary: 65000, defaultPrice: 120,
    defaultBill: 60, defaultFuelPrice: 2.0, fuelUnit: "kmpl", distanceUnit: "km",
  },
  NZD: {
    code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ",
    defaultLoan: 500000, defaultSIP: 500, defaultSalary: 55000, defaultPrice: 120,
    defaultBill: 50, defaultFuelPrice: 2.8, fuelUnit: "kmpl", distanceUnit: "km",
  },

  // ─── Africa ───
  ZAR: {
    code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA",
    defaultLoan: 1500000, defaultSIP: 2000, defaultSalary: 300000, defaultPrice: 1000,
    defaultBill: 300, defaultFuelPrice: 23, fuelUnit: "kmpl", distanceUnit: "km",
  },
  NGN: {
    code: "NGN", symbol: "\u20A6", name: "Nigerian Naira", locale: "en-NG",
    defaultLoan: 20000000, defaultSIP: 50000, defaultSalary: 3600000, defaultPrice: 20000,
    defaultBill: 5000, defaultFuelPrice: 700, fuelUnit: "kmpl", distanceUnit: "km",
  },
  KES: {
    code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "en-KE",
    defaultLoan: 5000000, defaultSIP: 10000, defaultSalary: 600000, defaultPrice: 5000,
    defaultBill: 1000, defaultFuelPrice: 200, fuelUnit: "kmpl", distanceUnit: "km",
  },
};

const TIMEZONE_TO_CURRENCY: Record<string, string> = {
  // Americas
  "America/New_York": "USD", "America/Chicago": "USD", "America/Denver": "USD",
  "America/Los_Angeles": "USD", "America/Phoenix": "USD", "America/Anchorage": "USD",
  "Pacific/Honolulu": "USD",
  "America/Toronto": "CAD", "America/Vancouver": "CAD", "America/Edmonton": "CAD",
  "America/Winnipeg": "CAD", "America/Halifax": "CAD",
  "America/Sao_Paulo": "BRL", "America/Bahia": "BRL", "America/Fortaleza": "BRL",
  "America/Mexico_City": "MXN", "America/Cancun": "MXN", "America/Monterrey": "MXN",

  // Europe
  "Europe/London": "GBP",
  "Europe/Paris": "EUR", "Europe/Berlin": "EUR", "Europe/Madrid": "EUR",
  "Europe/Rome": "EUR", "Europe/Amsterdam": "EUR", "Europe/Brussels": "EUR",
  "Europe/Vienna": "EUR", "Europe/Dublin": "EUR", "Europe/Lisbon": "EUR",
  "Europe/Helsinki": "EUR", "Europe/Athens": "EUR",
  "Europe/Zurich": "CHF",
  "Europe/Warsaw": "PLN",
  "Europe/Stockholm": "SEK",
  "Europe/Oslo": "NOK",
  "Europe/Istanbul": "TRY",

  // South Asia
  "Asia/Kolkata": "INR", "Asia/Calcutta": "INR",
  "Asia/Karachi": "PKR",
  "Asia/Dhaka": "BDT",
  "Asia/Colombo": "LKR",
  "Asia/Kathmandu": "NPR",

  // Southeast Asia
  "Asia/Singapore": "SGD",
  "Asia/Kuala_Lumpur": "MYR",
  "Asia/Bangkok": "THB",
  "Asia/Jakarta": "IDR",
  "Asia/Manila": "PHP",
  "Asia/Ho_Chi_Minh": "VND",

  // East Asia
  "Asia/Tokyo": "JPY",
  "Asia/Seoul": "KRW",
  "Asia/Shanghai": "CNY", "Asia/Chongqing": "CNY",
  "Asia/Hong_Kong": "HKD",
  "Asia/Taipei": "TWD",

  // Middle East
  "Asia/Dubai": "AED",
  "Asia/Riyadh": "SAR",
  "Asia/Qatar": "QAR", "Asia/Doha": "QAR",
  "Asia/Kuwait": "KWD",
  "Asia/Bahrain": "BHD",
  "Asia/Muscat": "OMR",
  "Africa/Cairo": "EGP",

  // Oceania
  "Australia/Sydney": "AUD", "Australia/Melbourne": "AUD",
  "Australia/Brisbane": "AUD", "Australia/Perth": "AUD",
  "Pacific/Auckland": "NZD",

  // Africa
  "Africa/Johannesburg": "ZAR",
  "Africa/Lagos": "NGN",
  "Africa/Nairobi": "KES",
};

export function detectCurrency(): CurrencyConfig {
  if (typeof window === "undefined") return CURRENCY_MAP.USD;
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const code = TIMEZONE_TO_CURRENCY[tz];
    if (code && CURRENCY_MAP[code]) return CURRENCY_MAP[code];
  } catch {}
  return CURRENCY_MAP.USD;
}

export function getCurrencyConfig(code: string): CurrencyConfig {
  return CURRENCY_MAP[code] ?? CURRENCY_MAP.USD;
}

export function formatAmount(amount: number, config: CurrencyConfig): string {
  try {
    // Use maximumFractionDigits: 0 for large amounts, 2 for small amounts
    const fractionDigits = Math.abs(amount) < 10 ? 2 : 0;
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${config.symbol}${amount.toLocaleString()}`;
  }
}

export const ALL_CURRENCIES = Object.values(CURRENCY_MAP);
export const CURRENCY_CODES = Object.keys(CURRENCY_MAP);
