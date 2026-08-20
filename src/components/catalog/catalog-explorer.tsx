"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 space-y-3.5">
          {/* Tier 1: Search + Dropdown Controls */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <input
                id="system-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search systems, categories, or tech stack..."
                className="w-full min-h-11 rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-9 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none transition shadow-2xs"
              />
              <svg
                className="absolute left-3.5 top-3.5 size-4 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search query"
                  className="absolute right-3 top-3 size-5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs transition cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Pricing filter"
                value={pricing}
                onChange={(e) => setPricing(e.target.value as (typeof catalogPricingModes)[number])}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 focus:border-slate-900 focus:outline-none transition cursor-pointer"
              >
                {catalogPricingModes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                aria-label="Sort order"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortMode)}
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-slate-300 focus:border-slate-900 focus:outline-none transition cursor-pointer"
              >
                <option value="Newest">Newest</option>
                <option value="Name: A to Z">Name: A to Z</option>
                <option value="Price: low to high">Price: low to high</option>
                <option value="Price: high to low">Price: high to low</option>
              </select>

              {hasPricedSystems && <CatalogCurrencyControl />}
            </div>
          </div>

          {/* Tier 2: Segmented Audience Switch + Scrollable Category Ribbon */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {/* Segmented Audience Dock */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80 gap-1 shrink-0">
              {catalogAudiences.map((item) => {
                const active = audience === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAudience(item)}
                    className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                      active
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <span className="h-5 w-px bg-slate-200 shrink-0" />

            {/* Category Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none min-w-0 flex-1 py-0.5">
              <button
                type="button"
                onClick={() => setCategory("all")}
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition border cursor-pointer ${
                  category === "all"
                    ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
                    className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition border cursor-pointer ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="shrink-0 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition ml-auto flex items-center gap-1 cursor-pointer"
              >
                Clear all
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
  const primaryMedia = system.coverImageUrl || system.media?.find((m) => m.mediaType === "image")?.url || system.media?.[0]?.url;
  const isStarting = system.pricingType === "starting";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      {/* 1. Product Preview Area: Light neutral container with device/browser preview frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50/80 p-4 sm:p-5 flex items-center justify-center border-b border-slate-100">
        {primaryMedia ? (
          <div className="relative size-full flex items-center justify-center">
            <div className="size-full overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-xs flex flex-col">
              {/* Minimal browser window header */}
              <div className="flex h-5 items-center gap-1 border-b border-slate-100 bg-slate-50/90 px-2.5 shrink-0">
                <div className="size-1.5 rounded-full bg-slate-300" />
                <div className="size-1.5 rounded-full bg-slate-300" />
                <div className="size-1.5 rounded-full bg-slate-300" />
              </div>
              {/* Screenshot preview */}
              <div className="relative flex-1 overflow-hidden bg-slate-50/40 flex items-center justify-center p-1">
                {/* eslint-disable-next-html-element-suppression */}
                <img
                  src={primaryMedia}
                  alt={system.title}
                  className="size-full object-contain transition-transform duration-200 group-hover:scale-[1.015]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="size-full overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-xs flex flex-col">
            <div className="flex h-5 items-center gap-1 border-b border-slate-100 bg-slate-50/90 px-2.5 shrink-0">
              <div className="size-1.5 rounded-full bg-slate-300" />
              <div className="size-1.5 rounded-full bg-slate-300" />
              <div className="size-1.5 rounded-full bg-slate-300" />
            </div>
            <div className="relative flex-1 overflow-hidden bg-slate-50/40">
              <CatalogCardIllustration categorySlug={system.category?.slug} title={system.title} />
            </div>
          </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {/* Category: Small, uppercase, blue, medium weight */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
          {system.category?.name ?? "Custom System Development"}
        </span>

        {/* Product Title: Strong dark navy / near-black font */}
        <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
          <Link href={`/systems/${system.slug}`} className="focus:outline-none">
            {system.title}
          </Link>
        </h3>

        {/* Short Description: Muted slate, 2-3 lines with line clamp */}
        <p className="mt-2.5 line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-normal">
          {system.summary}
        </p>

        {/* Feature Chips: Full Source ZIP & 30-Day Support with small blue outline icons and subtle borders */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50/60 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <CheckCircle2 className="size-3.5 text-blue-600 shrink-0" />
            <span>Full Source ZIP</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/80 bg-slate-50/60 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            <ShieldCheck className="size-3.5 text-blue-600 shrink-0" />
            <span>30-Day Support</span>
          </div>
        </div>

        {/* 3. Divider & Purchase Area */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
          <div className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {isStarting ? "Starting Price" : "Price"}
            </span>
            <div className="mt-0.5 text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              <LocalizedCatalogPrice system={system} />
            </div>
          </div>

          <Link
            href={`/systems/${system.slug}`}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-blue-600 px-4.5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:bg-blue-700 hover:shadow-[0_6px_22px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>View System</span>
            <ExternalLink className="size-3.5 text-blue-100 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </Link>
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
      <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 border border-blue-100">
        <svg className="size-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
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
            className="blue-button bg-blue-600 px-5 py-3 text-xs font-bold text-white"
          >
            Clear Active Filters
          </button>
        ) : (
          <Link
            href="/request-a-quote"
            className="blue-button bg-blue-600 px-5 py-3 text-xs font-bold text-white"
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
