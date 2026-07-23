"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  catalogAudiences,
  catalogCategories,
  catalogPricingModes,
  type CatalogAudience,
} from "@/features/catalog/catalog-options";

export function CatalogExplorer() {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<CatalogAudience>("All audiences");
  const [category, setCategory] = useState("All categories");
  const [pricing, setPricing] = useState<(typeof catalogPricingModes)[number]>("All pricing");

  const visibleCategories = useMemo(() => {
    const search = query.trim().toLowerCase();
    return catalogCategories.filter((item) => {
      const audienceMatch = audience === "All audiences" || item.audience.includes(audience);
      const categoryMatch = category === "All categories" || item.name === category;
      const searchMatch = !search || (item.name + " " + item.description).toLowerCase().includes(search);
      return audienceMatch && categoryMatch && searchMatch;
    });
  }, [audience, category, query]);

  const hasFilters = Boolean(query) || audience !== "All audiences" || category !== "All categories" || pricing !== "All pricing";

  function clearFilters() {
    setQuery("");
    setAudience("All audiences");
    setCategory("All categories");
    setPricing("All pricing");
  }

  return (
    <section aria-labelledby="catalog-results-title" className="pb-20 sm:pb-24 lg:pb-32">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="rounded-2xl border border-white/10 bg-surface-subtle p-4 sm:p-6">
          <label htmlFor="system-search" className="mb-2 block text-xs font-semibold text-secondary">Search systems</label>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
            <input
              id="system-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by system name, category, or workflow"
              className="min-h-12 w-full rounded-[10px] border border-white/15 bg-background px-4 text-sm placeholder:text-muted focus:border-brand focus:outline-none"
            />
            <select aria-label="Sort systems" className="min-h-12 rounded-[10px] border border-white/15 bg-background px-4 text-sm text-secondary focus:border-brand focus:outline-none">
              <option>Newest</option>
              <option>Name: A to Z</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-12">
          <aside aria-label="Catalog filters" className="h-fit rounded-2xl border border-white/10 bg-surface p-5 lg:sticky lg:top-24">
            <FilterGroup label="Audience">
              {catalogAudiences.map((item) => <FilterButton key={item} active={audience === item} onClick={() => setAudience(item)}>{item}</FilterButton>)}
            </FilterGroup>
            <FilterGroup label="Category">
              {["All categories", ...catalogCategories.map((item) => item.name)].map((item) => <FilterButton key={item} active={category === item} onClick={() => setCategory(item)}>{item}</FilterButton>)}
            </FilterGroup>
            <FilterGroup label="Pricing" last>
              {catalogPricingModes.map((item) => <FilterButton key={item} active={pricing === item} onClick={() => setPricing(item)}>{item}</FilterButton>)}
            </FilterGroup>
          </aside>

          <div>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Published catalog</p>
                <h2 id="catalog-results-title" className="mt-2 text-2xl font-semibold tracking-[-0.035em]">0 systems available</h2>
              </div>
              {hasFilters && <button type="button" onClick={clearFilters} className="min-h-11 self-start rounded-[9px] border border-white/15 px-4 text-sm font-semibold text-secondary hover:text-foreground sm:self-auto">Clear filters</button>}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {visibleCategories.map((item) => (
                <button type="button" key={item.name} onClick={() => setCategory(item.name)} className="min-h-36 rounded-xl border border-white/10 bg-surface p-5 text-left transition-colors hover:border-white/20 hover:bg-surface-raised">
                  <span className="text-xs uppercase tracking-[0.08em] text-muted">{item.audience}</span>
                  <strong className="mt-5 block text-lg tracking-[-0.025em]">{item.name}</strong>
                  <span className="mt-2 block text-sm leading-6 text-secondary">{item.description}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-surface-subtle px-6 py-12 text-center sm:px-10 sm:py-16" aria-live="polite">
              <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-lg text-brand-hover" aria-hidden="true">0</span>
              <h3 className="mx-auto mt-6 max-w-lg text-2xl font-semibold tracking-[-0.035em]">No systems have been published yet.</h3>
              <p className="mx-auto mt-3 max-w-xl text-secondary">Ready-made systems will appear here only after the administrator adds complete product details, files, pricing, and publication status.</p>
              <div className="mt-7 grid justify-center gap-3 sm:flex">
                <Link href="/#contact" className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">Request a custom system</Link>
                <Link href="/systems/preview" className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/15 px-6 font-semibold">View detail layout preview</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return <fieldset className={last ? "" : "mb-6 border-b border-white/10 pb-6"}><legend className="mb-3 text-xs font-semibold">{label}</legend><div className="grid gap-1">{children}</div></fieldset>;
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-10 rounded-lg px-3 text-left text-sm transition-colors ${active ? "bg-white/[0.07] font-medium" : "text-secondary hover:bg-white/[0.035] hover:text-foreground"}`}>{children}</button>;
}
