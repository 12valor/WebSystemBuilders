import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { CategorySection, TrustStrip } from "@/components/marketing/category-section";
import { ChoosePathSection } from "@/components/marketing/choose-path-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { FinalCallToAction } from "@/components/marketing/home-sections";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import { InteractiveProductShowcase } from "@/components/marketing/interactive-product-showcase";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us-section";
import { getCatalogCurrencySnapshot } from "@/features/catalog/currency-server";
import { getPublicCatalogData } from "@/features/catalog/repository";
import { getPublicTestimonials } from "@/features/content/testimonial-repository";

export const revalidate = 3600;

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
    description: "Handcrafted software systems and custom development for students and business owners.",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <SiteHeader />

      <main id="main-content">
        {/* Section 1: Hero Section */}
        <HeroSection />

        {/* Trust Bar */}
        <TrustStrip />

        {/* Section 2: Choose Your Path (Audience Split Showcase) */}
        <ChoosePathSection />

        {/* Section 3: Featured Systems + Browse Categories */}
        <CatalogCurrencyProvider snapshot={currency}>
          <CategorySection catalog={catalog} />
        </CatalogCurrencyProvider>

        {/* Section 4: Interactive Live System Simulation */}
        <InteractiveProductShowcase />

        {/* Section 5: Step-by-Step Delivery Timeline */}
        <HowItWorksSection />

        {/* Section 6: Asymmetric Bento Grid */}
        <WhyChooseUsSection />

        {/* Section 7: Floating Glass Testimonials */}
        <TestimonialsSection items={testimonials} />

        {/* Section 8: High Impact Gradient CTA */}
        <FinalCallToAction />
      </main>

      <SiteFooter />
    </div>
  );
}
