import "server-only";
import { cookies, headers } from "next/headers";
import {
  catalogCurrencies,
  getSuggestedCatalogCurrency,
  normalizeCatalogCurrency,
  parseFrankfurterRates,
  type CatalogCurrencySnapshot,
} from "@/features/catalog/currency";

const currencyCookieName = "wsb_currency";
const rateCacheSeconds = 21_600;
const quoteCurrencies = catalogCurrencies
  .map((currency) => currency.code)
  .filter((currency) => currency !== "PHP")
  .join(",");
const ratesUrl = `https://api.frankfurter.dev/v2/rates?base=PHP&quotes=${quoteCurrencies}`;

export async function getCatalogCurrencySnapshot(
  enabled = true,
): Promise<CatalogCurrencySnapshot> {
  const [cookieStore, requestHeaders] = await Promise.all([cookies(), headers()]);
  const countryCode =
    requestHeaders.get("x-vercel-ip-country") ??
    requestHeaders.get("cf-ipcountry");
  const suggestedCurrency = getSuggestedCatalogCurrency(countryCode);
  const requestedCurrency =
    normalizeCatalogCurrency(cookieStore.get(currencyCookieName)?.value) ??
    suggestedCurrency;

  if (!enabled) return fallbackSnapshot(suggestedCurrency);

  const rateData = await loadCatalogRates();
  if (!rateData) return fallbackSnapshot(suggestedCurrency);

  const selectedCurrency = rateData.rates[requestedCurrency]
    ? requestedCurrency
    : rateData.rates[suggestedCurrency]
      ? suggestedCurrency
      : "PHP";

  return {
    status: "ready",
    baseCurrency: "PHP",
    selectedCurrency,
    suggestedCurrency,
    rates: rateData.rates,
    rateDate: rateData.rateDate,
    source: "Frankfurter",
  };
}

async function loadCatalogRates() {
  try {
    const response = await fetch(ratesUrl, {
      headers: { accept: "application/json" },
      next: { revalidate: rateCacheSeconds },
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return null;
    return parseFrankfurterRates(await response.json());
  } catch {
    return null;
  }
}

function fallbackSnapshot(
  suggestedCurrency: CatalogCurrencySnapshot["suggestedCurrency"],
): CatalogCurrencySnapshot {
  return {
    status: "unavailable",
    baseCurrency: "PHP",
    selectedCurrency: "PHP",
    suggestedCurrency,
    rates: { PHP: 1 },
    rateDate: null,
    source: null,
  };
}
