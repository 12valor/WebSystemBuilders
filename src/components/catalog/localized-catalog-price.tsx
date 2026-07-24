"use client";

import { CatalogCurrencyControl, useCatalogCurrency } from "@/components/catalog/catalog-currency-provider";
import {
  getLocalizedCatalogPricePresentation,
} from "@/features/catalog/pricing";
import type { CatalogSystemRecord } from "@/features/catalog/types";

export function LocalizedCatalogPrice({
  system,
  variant = "catalog",
}: {
  system: CatalogSystemRecord;
  variant?: "catalog" | "featured" | "related";
}) {
  const currency = useCatalogCurrency();
  const price = getLocalizedCatalogPricePresentation(system, {
    currency: currency.selectedCurrency,
    rate: currency.rates[currency.selectedCurrency] ?? 1,
  });
  const mainClass = variant === "catalog" ? "text-lg" : variant === "related" ? "text-lg" : "text-base";

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-2">
        <p className={`${mainClass} font-semibold tabular-nums`}>{price.current}</p>
        {price.regular && <span className="text-xs text-muted line-through">{price.regular}</span>}
        {price.isSale && variant === "catalog" && <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-hover">Sale</span>}
      </div>
      {price.estimated && (
        <p className="mt-1 text-[0.68rem] leading-5 text-muted">
          {currency.selectedCurrency} estimate · {price.baseCurrent} PHP base
        </p>
      )}
    </div>
  );
}

export function SystemPriceSummary({ system }: { system: CatalogSystemRecord }) {
  const currency = useCatalogCurrency();
  const price = getLocalizedCatalogPricePresentation(system, {
    currency: currency.selectedCurrency,
    rate: currency.rates[currency.selectedCurrency] ?? 1,
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Price</p>
        {price.isSale && <span className="rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-hover">Sale active</span>}
      </div>
      {price.regular && <p className="mt-4 text-sm text-muted line-through">{price.regular}</p>}
      <p className={`${price.regular ? "mt-1" : "mt-4"} text-3xl font-semibold tabular-nums tracking-[-0.04em]`}>{price.current}</p>
      <p className="mt-3 text-sm leading-6 text-secondary">
        {price.estimated
          ? `${currency.selectedCurrency} estimate from the ${currency.source ?? "cached"} rate${currency.rateDate ? ` dated ${currency.rateDate}` : ""}. ${price.baseCurrent} is the authoritative PHP catalog price.`
          : "PHP is the authoritative catalog and default checkout currency."}
      </p>
      {system.pricingType !== "quotation" && <div className="mt-5"><CatalogCurrencyControl compact /></div>}
    </>
  );
}
