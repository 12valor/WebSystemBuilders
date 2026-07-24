import type { Metadata } from "next";
import Link from "next/link";
import { PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Approved WebSystemBuilders project work and case studies.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Portfolio"
        title="Project evidence will be published only when it is real and approved."
        description="This page will contain verified project work, outcomes, system media, and case-study context. No placeholder clients or fabricated results are shown."
        primary={{ label: "Browse published systems", href: "/systems" }}
        secondary={{ label: "About WebSystemBuilders", href: "/about" }}
      />
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-white/15 bg-surface-subtle px-6 py-14 text-center sm:px-12 sm:py-20">
          <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">0</span>
          <h2 className="mt-6 text-3xl font-semibold tracking-[-0.045em]">No case studies have been published yet.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-secondary">Portfolio entries will appear only after the project information, media permissions, and claims have been reviewed.</p>
          <Link href="/systems" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">View systems catalog</Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
