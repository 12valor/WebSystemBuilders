import type { CatalogSystemRecord } from "@/features/catalog/types";

export type CatalogPriceSource = Pick<
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

export type LocalizedCatalogPricePresentation = CatalogPricePresentation & {
  estimated: boolean;
  baseCurrent: string;
  baseRegular: string | null;
  displayCurrency: string;
};

export function getCatalogPricePresentation(system: CatalogPriceSource): CatalogPricePresentation {
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

export function getEffectiveCatalogPrice(system: CatalogPriceSource): number | null {
  if (system.pricingType === "quotation" || system.priceMinor === null) return null;
  const presentation = getCatalogPricePresentation(system);
  if (presentation.isSale && system.salePriceMinor !== null) return system.salePriceMinor;
  return system.priceMinor;
}

export function getLocalizedCatalogPricePresentation(
  system: CatalogPriceSource,
  conversion: { currency: string; rate: number },
): LocalizedCatalogPricePresentation {
  const base = getCatalogPricePresentation(system);
  if (
    system.pricingType === "quotation" ||
    system.priceMinor === null ||
    conversion.currency === system.currency ||
    !Number.isFinite(conversion.rate) ||
    conversion.rate <= 0
  ) {
    return {
      ...base,
      estimated: false,
      baseCurrent: base.current,
      baseRegular: base.regular,
      displayCurrency: system.currency,
    };
  }

  const hasSale = base.isSale && system.salePriceMinor !== null;
  const currentMinor = hasSale && system.salePriceMinor !== null
    ? system.salePriceMinor
    : system.priceMinor;
  const current = formatConvertedCatalogMoney(currentMinor, conversion.currency, conversion.rate);
  const regular = hasSale && system.regularPriceMinor !== null
    ? formatConvertedCatalogMoney(system.regularPriceMinor, conversion.currency, conversion.rate)
    : null;

  return {
    current: "≈ " + (system.pricingType === "starting" ? "From " : "") + current,
    regular: regular ? "≈ " + regular : null,
    isSale: base.isSale,
    estimated: true,
    baseCurrent: base.current,
    baseRegular: base.regular,
    displayCurrency: conversion.currency,
  };
}

function formatCatalogMoney(amountMinor: number, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

function formatConvertedCatalogMoney(amountMinor: number, currency: string, rate: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
  }).format((amountMinor / 100) * rate);
}
