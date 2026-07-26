"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CatalogCardIllustration } from "@/components/catalog/catalog-card-illustration";
import { CatalogCurrencyControl } from "@/components/catalog/catalog-currency-provider";
import { LocalizedCatalogPrice } from "@/components/catalog/localized-catalog-price";
import { catalogAudiences, catalogPricingModes, type CatalogAudience } from "@/features/catalog/catalog-options";
import { getEffectiveCatalogPrice } from "@/features/catalog/pricing";
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

  const hasPricedSystems = catalog.systems.some(
    (system) => system.pricingType !== "quotation" && system.priceMinor !== null,
  );

  function clearFilters() {
    setQuery("");
    setAudience("All audiences");
    setCategory("all");
    setPricing("All pricing");
  }

  return (
    <section aria-labelledby="catalog-results-title" className="pb-24 lg:pb-32 font-sans text-slate-900">
      {/* Sticky Horizontal Filter Bar */}
      <div className="sticky top-16 z-30 border-y border-slate-200/80 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 space-y-3">
          {/* Row 1: Search + Dropdowns */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <input
                id="system-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search systems, categories, or tech stack..."
                className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
              <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={pricing}
                onChange={(e) => setPricing(e.target.value as (typeof catalogPricingModes)[number])}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                {catalogPricingModes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none"
              >
                <option>Newest</option>
                <option>Name: A to Z</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
              </select>

              {hasPricedSystems && <CatalogCurrencyControl />}
            </div>
          </div>

          {/* Row 2: Scrollable Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 pr-1 shrink-0">Filter:</span>

            {/* Audience Chips */}
            {catalogAudiences.map((item) => {
              const active = audience === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAudience(item)}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}

            <span className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

            {/* Category Chips */}
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
                category === "all"
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              All Categories
            </button>

            {visibleCategories.map((item) => {
              const active = category === item.slug;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.slug)}
                  className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition border ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition ml-auto"
              >
                ✕ Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 mt-10">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div>
            <h2 id="catalog-results-title" className="text-xl font-bold tracking-tight text-slate-900">
              {visibleSystems.length} {visibleSystems.length === 1 ? "System" : "Systems"} Available
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore ready-to-deploy web systems and capstone templates.</p>
          </div>
        </div>

        {visibleSystems.length > 0 ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleSystems.map((system) => (
              <SystemCard key={system.id} system={system} />
            ))}
          </div>
        ) : (
          <CatalogEmptyState status={catalog.status} filtered={hasFilters} onClear={clearFilters} />
        )}
      </div>
    </section>
  );
}

function SystemCard({ system }: { system: CatalogSystemRecord }) {
  const primaryMedia = system.coverImageUrl || system.media?.[0]?.url;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10">
      {/* 16:10 Aspect Ratio Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        {primaryMedia ? (
          /* eslint-disable-next-html-element-suppression */
          <img
            src={primaryMedia}
            alt={system.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="size-full transition-transform duration-300 group-hover:scale-105">
            <CatalogCardIllustration categorySlug={system.category?.slug} title={system.title} />
          </div>
        )}

        {/* Audience Pill Overlay */}
        <div className="absolute left-3 top-3">
          <AudienceBadge audience={system.audience} />
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-6">
        <span className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
          {system.category?.name ?? "Web System"}
        </span>

        <h3 className="mt-1.5 text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          <Link href={`/systems/${system.slug}`} className="focus:outline-none">
            <span className="absolute inset-0 z-10" aria-hidden="true" />
            {system.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {system.summary}
        </p>

        {/* Footer Metadata & Pricing */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[0.65rem] font-semibold text-slate-400 uppercase">Price</span>
            <div className="font-bold text-slate-900 text-sm">
              <LocalizedCatalogPrice system={system} />
            </div>
          </div>

          <span className="inline-flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
            View Details →
          </span>
        </div>
      </div>
    </article>
  );
}

function AudienceBadge({ audience }: { audience: CatalogSystemRecord["audience"] }) {
  if (audience === "students") {
    return <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[0.68rem] font-bold text-purple-700 border border-purple-200/80 shadow-xs">Students</span>;
  }
  if (audience === "business") {
    return <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[0.68rem] font-bold text-blue-700 border border-blue-200/80 shadow-xs">Business</span>;
  }
  return <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-bold text-emerald-700 border border-emerald-200/80 shadow-xs">Students + Business</span>;
}

function CatalogEmptyState({
  filtered,
  onClear,
}: {
  status: CatalogData["status"];
  filtered: boolean;
  onClear: () => void;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-xs">
      <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 text-3xl border border-blue-100">
        📦
      </div>
      <h3 className="mt-6 text-2xl font-extrabold text-slate-900">
        New systems are on the way
      </h3>
      <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        {filtered
          ? "No systems match your active filter criteria. Try clearing filters or searching for another system."
          : "Request a custom software build tailored specifically to your thesis, business, or project requirements."}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {filtered ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            Clear Active Filters
          </button>
        ) : (
          <Link
            href="/request-a-quote"
            className="rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            Request a Custom System
          </Link>
        )}
        <Link
          href="/systems/preview"
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
        >
          View Detail Layout Preview
        </Link>
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

function compareSystems(left: CatalogSystemRecord, right: CatalogSystemRecord, sort: SortMode) {
  if (sort === "Name: A to Z") return left.title.localeCompare(right.title);
  if (sort === "Price: low to high") return (getEffectiveCatalogPrice(left) ?? Number.MAX_SAFE_INTEGER) - (getEffectiveCatalogPrice(right) ?? Number.MAX_SAFE_INTEGER);
  if (sort === "Price: high to low") return (getEffectiveCatalogPrice(right) ?? -1) - (getEffectiveCatalogPrice(left) ?? -1);
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}
