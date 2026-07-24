import { describe, expect, it } from "vitest";
import {
  getCatalogPricePresentation,
  getEffectiveCatalogPrice,
  getLocalizedCatalogPricePresentation,
} from "@/features/catalog/pricing";

const fixedPrice = {
  pricingType: "fixed" as const,
  priceMinor: 125000,
  regularPriceMinor: 125000,
  salePriceMinor: null,
  saleActive: false,
  currency: "PHP",
};

describe("catalog price presentation", () => {
  it("formats the authoritative fixed price", () => {
    expect(getCatalogPricePresentation(fixedPrice)).toEqual({
      current: "₱1,250.00",
      regular: null,
      isSale: false,
    });
  });

  it("shows an active valid sale against the regular price", () => {
    const sale = { ...fixedPrice, saleActive: true, salePriceMinor: 99000 };

    expect(getCatalogPricePresentation(sale)).toEqual({
      current: "₱990.00",
      regular: "₱1,250.00",
      isSale: true,
    });
    expect(getEffectiveCatalogPrice(sale)).toBe(99000);
  });

  it("ignores inactive or invalid sale values", () => {
    expect(getCatalogPricePresentation({ ...fixedPrice, salePriceMinor: 90000 })).toEqual({
      current: "₱1,250.00",
      regular: null,
      isSale: false,
    });
    expect(getCatalogPricePresentation({ ...fixedPrice, saleActive: true, salePriceMinor: 130000 }).isSale).toBe(false);
  });

  it("labels starting and quotation pricing", () => {
    expect(getCatalogPricePresentation({ ...fixedPrice, pricingType: "starting" }).current).toBe("From ₱1,250.00");
    expect(getCatalogPricePresentation({ ...fixedPrice, pricingType: "quotation", priceMinor: null })).toEqual({
      current: "Request a quote",
      regular: null,
      isSale: false,
    });
  });
  it("marks converted prices as estimates while retaining the PHP base", () => {
    const localized = getLocalizedCatalogPricePresentation(fixedPrice, {
      currency: "USD",
      rate: 0.02,
    });

    expect(localized.current).toContain("≈");
    expect(localized.current).toContain("$25.00");
    expect(localized.baseCurrent).toBe("₱1,250.00");
    expect(localized.displayCurrency).toBe("USD");
    expect(localized.estimated).toBe(true);
  });

  it("keeps quotation and invalid conversions on their authoritative display", () => {
    expect(getLocalizedCatalogPricePresentation(
      { ...fixedPrice, pricingType: "quotation", priceMinor: null },
      { currency: "USD", rate: 0.02 },
    ).estimated).toBe(false);
    expect(getLocalizedCatalogPricePresentation(
      fixedPrice,
      { currency: "USD", rate: 0 },
    ).displayCurrency).toBe("PHP");
  });
});
