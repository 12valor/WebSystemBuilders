import type { CatalogSystemRecord } from "@/features/catalog/types";

type PriceSource = Pick<
  CatalogSystemRecord,
  | "pricingType"
  | "priceMinor"
  | "regularPriceMinor"
  | "salePriceMinor"
  | "saleActive"
  | "currency"
>;

export type CatalogPricePresentation = {
  current: string;
  regular: string | null;
  isSale: boolean;
};

export function getCatalogPricePresentation(system: PriceSource): CatalogPricePresentation {
  if (system.pricingType === "quotation" || system.priceMinor === null) {
    return { current: "Request a quote", regular: null, isSale: false };
  }

  const hasSale =
    system.saleActive &&
    system.salePriceMinor !== null &&
    system.regularPriceMinor !== null &&
    system.salePriceMinor < system.regularPriceMinor;
  const amount = hasSale && system.salePriceMinor !== null ? system.salePriceMinor : system.priceMinor;
  const formatted = formatCatalogMoney(amount, system.currency);

  return {
    current: system.pricingType === "starting" ? `From ${formatted}` : formatted,
    regular: hasSale && system.regularPriceMinor !== null ? formatCatalogMoney(system.regularPriceMinor, system.currency) : null,
    isSale: hasSale,
  };
}

export function getEffectiveCatalogPrice(system: PriceSource): number | null {
  if (system.pricingType === "quotation" || system.priceMinor === null) return null;
  const presentation = getCatalogPricePresentation(system);
  if (presentation.isSale && system.salePriceMinor !== null) return system.salePriceMinor;
  return system.priceMinor;
}

function formatCatalogMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}
