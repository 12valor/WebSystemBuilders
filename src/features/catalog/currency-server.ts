import "server-only";
import {
  catalogCurrencies,
  parseFrankfurterRates,
  type CatalogCurrencySnapshot,
} from "@/features/catalog/currency";

const rateCacheSeconds = 21_600;
const quoteCurrencies = catalogCurrencies
  .map((currency) => currency.code)
  .filter((currency) => currency !== "PHP")
  .join(",");
const ratesUrl = `https://api.frankfurter.dev/v2/rates?base=PHP&quotes=${quoteCurrencies}`;

export async function getCatalogCurrencySnapshot(
  enabled = true,
): Promise<CatalogCurrencySnapshot> {
  const suggestedCurrency = "PHP";

  if (!enabled) return fallbackSnapshot(suggestedCurrency);

  const rateData = await loadCatalogRates();
  if (!rateData) return fallbackSnapshot(suggestedCurrency);

  return {
    status: "ready",
    baseCurrency: "PHP",
    selectedCurrency: "PHP",
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
