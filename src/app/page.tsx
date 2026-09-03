import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { AnimatedFeaturesSection } from "@/components/marketing/animated-features-section";
import { CategorySection, TrustStrip } from "@/components/marketing/category-section";
import { ChoosePathSection } from "@/components/marketing/choose-path-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { FinalCallToAction } from "@/components/marketing/home-sections";
import {
  FounderIdentitySection,
  HomepageFaqPreview,
  PurchaseTransparencySection,
} from "@/components/marketing/homepage-trust-sections";
import {
  ProjectWorkspacePlayground,
} from "@/components/marketing/interactive-workflow-sections";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { WhyChooseUsSection } from "@/components/marketing/why-choose-us-section";
import { WelcomeDashboardModal } from "@/components/auth/welcome-dashboard-modal";
import { getCatalogCurrencySnapshot } from "@/features/catalog/currency-server";
import { getPublicCatalogData } from "@/features/catalog/repository";
import { getPublicCompanyProfile } from "@/features/content/company-profile-repository";
import { getPublicFaqItems } from "@/features/content/faq-repository";
import { getPublicTestimonials } from "@/features/content/testimonial-repository";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [catalog, testimonials, questions, companyProfile] = await Promise.all([
    getPublicCatalogData(),
    getPublicTestimonials(),
    getPublicFaqItems(),
    getPublicCompanyProfile(),
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
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 antialiased font-sans overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <SiteHeader />
      <WelcomeDashboardModal />

      <div className="relative isolate">
        {/* Technical Grid Overlay (Top) Background from absolute top of the page */}
        <div
          className="pointer-events-none absolute inset-0 z-0 h-full w-full bg-white"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(229,231,235,0.7) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(229,231,235,0.7) 1px, transparent 1px),
              radial-gradient(circle 600px at 50% 0%, rgba(59,130,246,0.12), transparent)
            `,
            backgroundSize: "48px 48px, 48px 48px, 100% 100%",
          }}
        >
          {/* Soft bottom blend to transition smoothly into #FAFAFC */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FAFAFC] to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10">
          <HeroSection />
        </div>
      </div>

      <main id="main-content" className="overflow-x-clip">
        <TrustStrip />
        <AnimatedFeaturesSection />
        <ChoosePathSection />

        <CatalogCurrencyProvider snapshot={currency}>
          <CategorySection catalog={catalog} />
        </CatalogCurrencyProvider>

        <WhyChooseUsSection />

        <PurchaseTransparencySection />
        <ProjectWorkspacePlayground />
        <TestimonialsSection items={testimonials} />
        <HomepageFaqPreview items={questions} />
        <FounderIdentitySection profile={companyProfile} />
        <FinalCallToAction />
      </main>

      <SiteFooter />
    </div>
  );
}
