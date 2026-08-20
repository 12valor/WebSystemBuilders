import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogCurrencySnapshot } from "@/features/catalog/currency-server";
import { getPublicCatalogData } from "@/features/catalog/repository";

export const metadata: Metadata = {
  title: "Systems Catalog | WebSystemBuilders",
  description: "Browse ready-made systems for students and business owners, or request a custom software system.",
  alternates: { canonical: "/systems" },
};

export const revalidate = 3600;

export default async function SystemsPage({ searchParams }: { searchParams: Promise<{ audience?: string; category?: string }> }) {
  const [catalog, query] = await Promise.all([getPublicCatalogData(), searchParams]);
  const currency = await getCatalogCurrencySnapshot(
    catalog.systems.some((system) => system.pricingType !== "quotation" && system.priceMinor !== null),
  );
  const initialAudience = query.audience === "students" || query.audience === "business" ? query.audience : undefined;
  const initialCategory = query.category && catalog.categories.some((category) => category.slug === query.category) ? query.category : undefined;

  return (
    <div className="bg-slate-50 font-sans min-h-screen text-slate-900">
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0 rounded-lg">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find a system built for the work.
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600 max-w-2xl">
                Explore ready-made software systems, capstones, POS solutions, and templates. Filter by audience, category, or pricing mode.
              </p>
            </div>
          </div>
        </section>

        <CatalogCurrencyProvider snapshot={currency}>
          <CatalogExplorer catalog={catalog} initialAudience={initialAudience} initialCategory={initialCategory} />
        </CatalogCurrencyProvider>
      </main>
      <SiteFooter />
    </div>
  );
}
