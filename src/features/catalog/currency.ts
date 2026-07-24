export const catalogCurrencies = [
  { code: "PHP", label: "Philippine peso" },
  { code: "USD", label: "US dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British pound" },
  { code: "AUD", label: "Australian dollar" },
  { code: "CAD", label: "Canadian dollar" },
  { code: "SGD", label: "Singapore dollar" },
  { code: "JPY", label: "Japanese yen" },
  { code: "KRW", label: "South Korean won" },
  { code: "MYR", label: "Malaysian ringgit" },
  { code: "IDR", label: "Indonesian rupiah" },
  { code: "THB", label: "Thai baht" },
  { code: "VND", label: "Vietnamese dong" },
  { code: "HKD", label: "Hong Kong dollar" },
  { code: "NZD", label: "New Zealand dollar" },
  { code: "AED", label: "UAE dirham" },
  { code: "SAR", label: "Saudi riyal" },
  { code: "INR", label: "Indian rupee" },
  { code: "CHF", label: "Swiss franc" },
  { code: "CNY", label: "Chinese yuan" },
  { code: "TWD", label: "New Taiwan dollar" },
  { code: "BDT", label: "Bangladeshi taka" },
  { code: "PKR", label: "Pakistani rupee" },
  { code: "NPR", label: "Nepalese rupee" },
  { code: "LKR", label: "Sri Lankan rupee" },
  { code: "ZAR", label: "South African rand" },
  { code: "BRL", label: "Brazilian real" },
  { code: "MXN", label: "Mexican peso" },
  { code: "TRY", label: "Turkish lira" },
] as const;

export type CatalogCurrencyCode = (typeof catalogCurrencies)[number]["code"];

export type CatalogCurrencySnapshot = {
  status: "ready" | "unavailable";
  baseCurrency: "PHP";
  selectedCurrency: CatalogCurrencyCode;
  suggestedCurrency: CatalogCurrencyCode;
  rates: Partial<Record<CatalogCurrencyCode, number>>;
  rateDate: string | null;
  source: "Frankfurter" | null;
};

const currencyCodes = new Set<string>(catalogCurrencies.map((currency) => currency.code));
const euroCountries = new Set([
  "AT", "BE", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
]);

const countryCurrencies: Record<string, CatalogCurrencyCode> = {
  AE: "AED", AU: "AUD", BD: "BDT", BR: "BRL", CA: "CAD", CH: "CHF",
  CN: "CNY", GB: "GBP", HK: "HKD", ID: "IDR", IN: "INR", JP: "JPY",
  KR: "KRW", LK: "LKR", LI: "CHF", MX: "MXN", MY: "MYR", NP: "NPR",
  NZ: "NZD", PH: "PHP", PK: "PKR", SA: "SAR", SG: "SGD", TH: "THB",
  TR: "TRY", TW: "TWD", US: "USD", VN: "VND", ZA: "ZAR",
};

export function normalizeCatalogCurrency(value: string | null | undefined): CatalogCurrencyCode | null {
  const normalized = value?.trim().toUpperCase();
  return normalized && currencyCodes.has(normalized) ? normalized as CatalogCurrencyCode : null;
}

export function getSuggestedCatalogCurrency(countryCode: string | null | undefined): CatalogCurrencyCode {
  const country = countryCode?.trim().toUpperCase();
  if (!country) return "PHP";
  if (euroCountries.has(country)) return "EUR";
  return countryCurrencies[country] ?? "PHP";
}

export function parseFrankfurterRates(input: unknown): Pick<CatalogCurrencySnapshot, "rates" | "rateDate"> | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const rates: Partial<Record<CatalogCurrencyCode, number>> = { PHP: 1 };
  let rateDate: string | null = null;

  for (const row of input) {
    if (!isRecord(row)) return null;
    const quote = normalizeCatalogCurrency(typeof row.quote === "string" ? row.quote : null);
    if (
      row.base !== "PHP" ||
      !quote ||
      typeof row.rate !== "number" ||
      !Number.isFinite(row.rate) ||
      row.rate <= 0 ||
      typeof row.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(row.date)
    ) {
      return null;
    }
    rates[quote] = row.rate;
    if (rateDate === null || row.date > rateDate) rateDate = row.date;
  }

  return { rates, rateDate };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
