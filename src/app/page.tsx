import { CategorySection, TrustStrip } from "@/components/marketing/category-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { AudienceSection, EngagementModelsSection, FinalCallToAction, ProcessSection } from "@/components/marketing/home-sections";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getPublicCatalogData } from "@/features/catalog/repository";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getPublicCatalogData();

  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <CategorySection catalog={catalog} />
        <EngagementModelsSection />
        <AudienceSection />
        <ProcessSection />
        <FinalCallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
