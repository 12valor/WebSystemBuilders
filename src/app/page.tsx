import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { CategorySection, TrustStrip } from "@/components/marketing/category-section";
import { ChoosePathSection } from "@/components/marketing/choose-path-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { FinalCallToAction } from "@/components/marketing/home-sections";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us-section";
import { getCatalogCurrencySnapshot } from "@/features/catalog/currency-server";
import { getPublicCatalogData } from "@/features/catalog/repository";
import { getPublicTestimonials } from "@/features/content/testimonial-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [catalog, testimonials] = await Promise.all([
    getPublicCatalogData(),
    getPublicTestimonials(),
  ]);
  
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
    <div className="min-h-screen bg-white text-[#111827] antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-24 bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content">
        {/* Section 1: Hero Section */}
        <HeroSection />

        {/* Trust Bar */}
        <TrustStrip />

        {/* Section 2: Choose Your Path (Who are you?) */}
        <ChoosePathSection />

        {/* Section 3 & 4: Featured Systems + Browse Categories */}
        <CatalogCurrencyProvider snapshot={currency}>
          <CategorySection catalog={catalog} />
        </CatalogCurrencyProvider>

        {/* Section 5: Why Choose WebSystemBuilders */}
        <WhyChooseUsSection />

        {/* Section 6: How It Works */}
        <HowItWorksSection />

        {/* Section 7: Testimonials */}
        <TestimonialsSection items={testimonials} />

        {/* Section 8: Final CTA */}
        <FinalCallToAction />
      </main>

      <SiteFooter />
    </div>
  );
}
