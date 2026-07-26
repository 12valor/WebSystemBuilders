import type { Metadata } from "next";
import { PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";
import { PublicPortfolioList } from "@/components/marketing/public-portfolio-list";
import { getPublicPortfolioData } from "@/features/content/portfolio-repository";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Approved WebSystemBuilders project work and case studies.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const portfolio = await getPublicPortfolioData();
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Portfolio"
        title="Project evidence will be published only when it is real and approved."
        description="This page will contain verified project work, outcomes, system media, and case-study context. No placeholder clients or fabricated results are shown."
        primary={{ label: "Browse published systems", href: "/systems" }}
        secondary={{ label: "About WebSystemBuilders", href: "/about" }}
      />
      <PublicPortfolioList data={portfolio} />
    </PublicPageShell>
  );
}
