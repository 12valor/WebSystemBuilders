import type { Metadata } from "next";
import { CatalogCurrencyProvider } from "@/components/catalog/catalog-currency-provider";
import { CategorySection, TrustStrip } from "@/components/marketing/category-section";
import { ChoosePathSection } from "@/components/marketing/choose-path-section";
import { HeroSection } from "@/components/marketing/hero-section";
import { FinalCallToAction } from "@/components/marketing/home-sections";
import {
  FounderIdentitySection,
  HomepageFaqPreview,
  PublishedWorkPreview,
  PurchaseTransparencySection,
} from "@/components/marketing/homepage-trust-sections";
import { HowItWorksSection } from "@/components/marketing/how-it-works-section";
import {
  BusinessWorkflowPlayground,
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
import { getPublicPortfolioData } from "@/features/content/portfolio-repository";
import { getPublicTestimonials } from "@/features/content/testimonial-repository";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [catalog, testimonials, portfolio, questions, companyProfile] = await Promise.all([
    getPublicCatalogData(),
    getPublicTestimonials(),
    getPublicPortfolioData(),
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
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 antialiased font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <SiteHeader />
      <WelcomeDashboardModal />

      <main id="main-content">
        <HeroSection />
        <TrustStrip />
        <ChoosePathSection />

        <CatalogCurrencyProvider snapshot={currency}>
          <CategorySection catalog={catalog} />
        </CatalogCurrencyProvider>

        <BusinessWorkflowPlayground />
        <PublishedWorkPreview data={portfolio} />
        <PurchaseTransparencySection />
        <HowItWorksSection />
        <ProjectWorkspacePlayground />
        <WhyChooseUsSection />
        <TestimonialsSection items={testimonials} />
        <HomepageFaqPreview items={questions} />
        <FounderIdentitySection profile={companyProfile} />
        <FinalCallToAction />
      </main>

      <SiteFooter />
    </div>
  );
}
