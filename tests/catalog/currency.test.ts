import { describe, expect, it } from "vitest";
import {
  getSuggestedCatalogCurrency,
  normalizeCatalogCurrency,
  parseFrankfurterRates,
} from "@/features/catalog/currency";

describe("catalog currency localization", () => {
  it("suggests a supported currency from coarse country codes", () => {
    expect(getSuggestedCatalogCurrency("PH")).toBe("PHP");
    expect(getSuggestedCatalogCurrency("US")).toBe("USD");
    expect(getSuggestedCatalogCurrency("DE")).toBe("EUR");
    expect(getSuggestedCatalogCurrency("sg")).toBe("SGD");
    expect(getSuggestedCatalogCurrency("XX")).toBe("PHP");
  });

  it("accepts only currencies exposed by the manual selector", () => {
    expect(normalizeCatalogCurrency(" usd ")).toBe("USD");
    expect(normalizeCatalogCurrency("ABC")).toBeNull();
    expect(normalizeCatalogCurrency(null)).toBeNull();
  });

  it("parses positive PHP exchange rates and retains their date", () => {
    expect(parseFrankfurterRates([
      { date: "2026-07-24", base: "PHP", quote: "USD", rate: 0.01618 },
      { date: "2026-07-24", base: "PHP", quote: "EUR", rate: 0.01374 },
    ])).toEqual({
      rates: { PHP: 1, USD: 0.01618, EUR: 0.01374 },
      rateDate: "2026-07-24",
    });
  });

  it("fails closed for malformed or unsupported rate rows", () => {
    expect(parseFrankfurterRates([])).toBeNull();
    expect(parseFrankfurterRates([
      { date: "2026-07-24", base: "USD", quote: "PHP", rate: 61.8 },
    ])).toBeNull();
    expect(parseFrankfurterRates([
      { date: "2026-07-24", base: "PHP", quote: "ABC", rate: 2 },
    ])).toBeNull();
  });
});
