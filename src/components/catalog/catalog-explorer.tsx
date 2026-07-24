"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { catalogAudiences, catalogPricingModes, type CatalogAudience } from "@/features/catalog/catalog-options";
import type { CatalogData, CatalogPricingType, CatalogSystemRecord } from "@/features/catalog/types";

type SortMode = "Newest" | "Name: A to Z" | "Price: low to high" | "Price: high to low";

export function CatalogExplorer({
  catalog,
  initialAudience,
  initialCategory,
}: {
  catalog: CatalogData;
  initialAudience?: "students" | "business";
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [audience, setAudience] = useState<CatalogAudience>(
    initialAudience === "students" ? "Students" : initialAudience === "business" ? "Business" : "All audiences",
  );
  const [category, setCategory] = useState(initialCategory ?? "all");
  const [pricing, setPricing] = useState<(typeof catalogPricingModes)[number]>("All pricing");
  const [sort, setSort] = useState<SortMode>("Newest");

  const visibleCategories = useMemo(() => {
    return catalog.categories.filter((item) => {
      const audienceMatch =
        audience === "All audiences" ||
        item.audience === "both" ||
        item.audience === audience.toLowerCase();
      return audienceMatch;
    });
  }, [audience, catalog.categories]);

  const visibleSystems = useMemo(() => {
    const search = query.trim().toLowerCase();
    const pricingValue = pricingToValue(pricing);

    return catalog.systems
      .filter((system) => {
        const audienceMatch =
          audience === "All audiences" ||
          system.audience === "both" ||
          system.audience === audience.toLowerCase();
        const categoryMatch = category === "all" || system.category?.slug === category;
        const pricingMatch = !pricingValue || system.pricingType === pricingValue;
        const searchText = [
          system.title,
          system.summary,
          system.category?.name ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return audienceMatch && categoryMatch && pricingMatch && (!search || searchText.includes(search));
      })
      .sort((left, right) => compareSystems(left, right, sort));
  }, [audience, catalog.systems, category, pricing, query, sort]);

  const hasFilters =
    Boolean(query) ||
    audience !== "All audiences" ||
    category !== "all" ||
    pricing !== "All pricing";

  function clearFilters() {
    setQuery("");
    setAudience("All audiences");
    setCategory("all");
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
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)} aria-label="Sort systems" className="min-h-12 rounded-[10px] border border-white/15 bg-background px-4 text-sm text-secondary focus:border-brand focus:outline-none">
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
              <FilterButton active={category === "all"} onClick={() => setCategory("all")}>All categories</FilterButton>
              {visibleCategories.map((item) => <FilterButton key={item.id} active={category === item.slug} onClick={() => setCategory(item.slug)}>{item.name}</FilterButton>)}
            </FilterGroup>
            <FilterGroup label="Pricing" last>
              {catalogPricingModes.map((item) => <FilterButton key={item} active={pricing === item} onClick={() => setPricing(item)}>{item}</FilterButton>)}
            </FilterGroup>
          </aside>

          <div>
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Published catalog</p>
                <h2 id="catalog-results-title" className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{visibleSystems.length} {visibleSystems.length === 1 ? "system" : "systems"} available</h2>
              </div>
              {hasFilters && <button type="button" onClick={clearFilters} className="min-h-11 self-start rounded-[9px] border border-white/15 px-4 text-sm font-semibold text-secondary hover:text-foreground sm:self-auto">Clear filters</button>}
            </div>

            {catalog.status === "ready" && visibleCategories.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {visibleCategories.map((item) => (
                  <button type="button" key={item.id} onClick={() => setCategory(item.slug)} className="min-h-32 rounded-xl border border-white/10 bg-surface p-5 text-left transition-colors hover:border-white/20 hover:bg-surface-raised">
                    <span className="text-xs uppercase tracking-[0.08em] text-muted">{audienceLabel(item.audience)}</span>
                    <strong className="mt-4 block text-lg tracking-[-0.025em]">{item.name}</strong>
                    {item.description && <span className="mt-2 block text-sm leading-6 text-secondary">{item.description}</span>}
                  </button>
                ))}
              </div>
            )}

            {visibleSystems.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleSystems.map((system) => <SystemCard key={system.id} system={system} />)}
              </div>
            ) : (
              <CatalogEmptyState status={catalog.status} filtered={hasFilters} onClear={clearFilters} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemCard({ system }: { system: CatalogSystemRecord }) {
  return (
    <article className="flex min-h-80 flex-col rounded-xl border border-white/10 bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-[0.08em] text-muted">
        <span>{audienceLabel(system.audience)}</span>
        {system.featured && <span className="text-brand-hover">Featured</span>}
      </div>
      <p className="mt-6 text-xs text-muted">{system.category?.name ?? "Uncategorized"}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">{system.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-secondary">{system.summary}</p>
      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="text-lg font-semibold tabular-nums">{formatSystemPrice(system)}</p>
        <Link href={`/systems/${system.slug}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[9px] border border-white/15 px-4 text-sm font-semibold hover:bg-white/[0.04]">View system</Link>
      </div>
    </article>
  );
}

function CatalogEmptyState({ status, filtered, onClear }: { status: CatalogData["status"]; filtered: boolean; onClear: () => void }) {
  const content =
    status === "unconfigured"
      ? {
          marker: "SET",
          title: "The live catalog is not connected yet.",
          copy: "Administrator-managed categories and systems will load here after the Supabase project and migration are configured.",
        }
      : status === "error"
        ? {
            marker: "!",
            title: "The catalog could not be loaded.",
            copy: "No unverified or partial product data is being shown. Please try again after the database connection is checked.",
          }
        : filtered
          ? {
              marker: "0",
              title: "No systems match these filters.",
              copy: "Clear the filters or choose another audience, category, or pricing mode.",
            }
          : {
              marker: "0",
              title: "No systems have been published yet.",
              copy: "Systems appear only after an administrator completes the product record and publishes it.",
            };

  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-surface-subtle px-6 py-12 text-center sm:px-10 sm:py-16" aria-live="polite">
      <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">{content.marker}</span>
      <h3 className="mx-auto mt-6 max-w-lg text-2xl font-semibold tracking-[-0.035em]">{content.title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-secondary">{content.copy}</p>
      <div className="mt-7 grid justify-center gap-3 sm:flex">
        {filtered ? (
          <button type="button" onClick={onClear} className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">Clear filters</button>
        ) : (
          <Link href="/#contact" className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">Request a custom system</Link>
        )}
        <Link href="/systems/preview" className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/15 px-6 font-semibold">View detail layout preview</Link>
      </div>
    </div>
  );
}

function pricingToValue(pricing: (typeof catalogPricingModes)[number]): CatalogPricingType | null {
  if (pricing === "Fixed price") return "fixed";
  if (pricing === "Starting price") return "starting";
  if (pricing === "Request a quote") return "quotation";
  return null;
}

function audienceLabel(audience: CatalogSystemRecord["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Students + Business";
}

function effectivePrice(system: CatalogSystemRecord) {
  if (system.saleActive && system.salePriceMinor !== null) return system.salePriceMinor;
  return system.priceMinor;
}

function compareSystems(left: CatalogSystemRecord, right: CatalogSystemRecord, sort: SortMode) {
  if (sort === "Name: A to Z") return left.title.localeCompare(right.title);
  if (sort === "Price: low to high") return (effectivePrice(left) ?? Number.MAX_SAFE_INTEGER) - (effectivePrice(right) ?? Number.MAX_SAFE_INTEGER);
  if (sort === "Price: high to low") return (effectivePrice(right) ?? -1) - (effectivePrice(left) ?? -1);
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function formatSystemPrice(system: CatalogSystemRecord) {
  if (system.pricingType === "quotation" || system.priceMinor === null) return "Request a quote";
  const amount = effectivePrice(system) ?? system.priceMinor;
  const formatted = new Intl.NumberFormat("en-PH", { style: "currency", currency: system.currency, maximumFractionDigits: 2 }).format(amount / 100);
  return system.pricingType === "starting" ? `From ${formatted}` : formatted;
}

function FilterGroup({ label, children, last = false }: { label: string; children: React.ReactNode; last?: boolean }) {
  return <fieldset className={last ? "" : "mb-6 border-b border-white/10 pb-6"}><legend className="mb-3 text-xs font-semibold">{label}</legend><div className="grid gap-1">{children}</div></fieldset>;
}

function FilterButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-10 rounded-lg px-3 text-left text-sm transition-colors ${active ? "bg-white/[0.07] font-medium" : "text-secondary hover:bg-white/[0.035] hover:text-foreground"}`}>{children}</button>;
}
