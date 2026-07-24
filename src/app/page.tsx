import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { CategorySection, TrustStrip } from "@/components/marketing/category-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { AudienceSection, EngagementModelsSection, FinalCallToAction, ProcessSection } from "@/components/marketing/home-sections";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogCurrencySnapshot } from "@/features/catalog/currency-server";
import { getPublicCatalogData } from "@/features/catalog/repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const catalog = await getPublicCatalogData();
  const currency = await getCatalogCurrencySnapshot(
    catalog.systems.some((system) => system.pricingType !== "quotation" && system.priceMinor !== null),
  );
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WebSystemBuilders",
    url: "https://websystembuilders.com",
    description: "Ready-made software systems and custom development for students and business owners.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <CatalogCurrencyProvider snapshot={currency}>
          <CategorySection catalog={catalog} />
        </CatalogCurrencyProvider>
        <EngagementModelsSection />
        <AudienceSection />
        <ProcessSection />
        <FinalCallToAction />
      </main>
      <SiteFooter />
    </>
  );
}