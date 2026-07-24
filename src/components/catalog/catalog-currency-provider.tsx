"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from "react";
import {
  catalogCurrencies,
  type CatalogCurrencyCode,
  type CatalogCurrencySnapshot,
} from "@/features/catalog/currency";

type CatalogCurrencyContextValue = CatalogCurrencySnapshot & {
  setSelectedCurrency: (currency: CatalogCurrencyCode) => void;
};

const CatalogCurrencyContext = createContext<CatalogCurrencyContextValue | null>(null);

export function CatalogCurrencyProvider({
  snapshot,
  children,
}: {
  snapshot: CatalogCurrencySnapshot;
  children: React.ReactNode;
}) {
  const [selectedCurrency, setSelectedCurrencyState] = useState(snapshot.selectedCurrency);

  const setSelectedCurrency = useCallback((currency: CatalogCurrencyCode) => {
    if (!snapshot.rates[currency]) return;
    setSelectedCurrencyState(currency);
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `wsb_currency=${currency}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  }, [snapshot.rates]);

  const value = useMemo(() => ({
    ...snapshot,
    selectedCurrency,
    setSelectedCurrency,
  }), [selectedCurrency, setSelectedCurrency, snapshot]);

  return (
    <CatalogCurrencyContext.Provider value={value}>
      {children}
    </CatalogCurrencyContext.Provider>
  );
}

export function useCatalogCurrency() {
  const context = useContext(CatalogCurrencyContext);
  if (!context) throw new Error("Catalog currency controls require a provider.");
  return context;
}

export function CatalogCurrencyControl({ compact = false }: { compact?: boolean }) {
  const inputId = useId();
  const currency = useCatalogCurrency();
  const options = catalogCurrencies.filter((option) => currency.rates[option.code]);

  return (
    <label htmlFor={inputId} className="grid gap-2 text-xs font-semibold text-secondary">
      <span>Display currency</span>
      <select
        id={inputId}
        value={currency.selectedCurrency}
        onChange={(event) => currency.setSelectedCurrency(event.target.value as CatalogCurrencyCode)}
        className={`${compact ? "min-h-10" : "min-h-12"} rounded-[10px] border border-white/15 bg-background px-3 text-sm text-foreground focus:border-brand focus:outline-none`}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code} - {option.label}
          </option>
        ))}
      </select>
      {currency.status === "unavailable" && (
        <span className="font-normal leading-5 text-muted">Currency estimates are temporarily unavailable. PHP prices remain visible.</span>
      )}
    </label>
  );
}
