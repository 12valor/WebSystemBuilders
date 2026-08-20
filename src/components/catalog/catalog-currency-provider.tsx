"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  catalogCurrencies,
  normalizeCatalogCurrency,
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

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )wsb_currency=([^;]*)/);
    const normalized = normalizeCatalogCurrency(match ? decodeURIComponent(match[1]) : null);
    if (normalized && snapshot.rates[normalized]) {
      setSelectedCurrencyState(normalized);
    }
  }, [snapshot.rates]);

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
    <div className="relative inline-flex items-center">
      <select
        id={inputId}
        aria-label="Display currency"
        value={currency.selectedCurrency}
        onChange={(event) => currency.setSelectedCurrency(event.target.value as CatalogCurrencyCode)}
        className={`${
          compact ? "min-h-10 text-xs" : "min-h-11 text-xs"
        } rounded-xl border border-slate-200 bg-white px-3.5 font-semibold text-slate-700 shadow-2xs hover:border-slate-300 focus:border-slate-900 focus:outline-none transition cursor-pointer`}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code} ({option.label})
          </option>
        ))}
      </select>
      {currency.status === "unavailable" && (
        <span className="sr-only">Currency estimates are temporarily unavailable. PHP prices remain visible.</span>
      )}
    </div>
  );
}
