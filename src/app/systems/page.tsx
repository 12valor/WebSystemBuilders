import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { CatalogExplorer } from "@/components/catalog/catalog-explorer";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogCurrencySnapshot } from "@/features/catalog/currency-server";
import { getPublicCatalogData } from "@/features/catalog/repository";

export const metadata: Metadata = {
  title: "Systems catalog",
  description: "Browse ready-made systems for students and business owners, or request a custom software system.",
  alternates: { canonical: "/systems" },
};

export const dynamic = "force-dynamic";

export default async function SystemsPage({ searchParams }: { searchParams: Promise<{ audience?: string; category?: string }> }) {
  const [catalog, query] = await Promise.all([getPublicCatalogData(), searchParams]);
  const currency = await getCatalogCurrencySnapshot(
    catalog.systems.some((system) => system.pricingType !== "quotation" && system.priceMinor !== null),
  );
  const initialAudience = query.audience === "students" || query.audience === "business" ? query.audience : undefined;
  const initialCategory = query.category && catalog.categories.some((category) => category.slug === query.category) ? query.category : undefined;

  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <section className="py-16 sm:py-20 lg:py-28">
          <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] items-end gap-10 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.5fr)] lg:gap-20 xl:w-[min(calc(100%-96px),1280px)]">
            <div><SectionEyebrow>Systems catalog</SectionEyebrow><h1 className="max-w-4xl text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.96] tracking-[-0.065em]">Find a system built for the work.</h1></div>
            <p className="max-w-md text-lg leading-8 text-secondary">Browse administrator-published software by audience, category, and pricing mode. Every listing will show its exact inclusions before purchase.</p>
          </div>
        </section>
        <CatalogCurrencyProvider snapshot={currency}>
          <CatalogExplorer catalog={catalog} initialAudience={initialAudience} initialCategory={initialCategory} />
        </CatalogCurrencyProvider>
      </main>
      <SiteFooter />
    </>
  );
}
