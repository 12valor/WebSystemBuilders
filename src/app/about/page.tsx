import type { Metadata } from "next";
import {
  EditorialSection,
  PublicCallToAction,
  PublicPageHero,
  PublicPageShell,
  StatementSection,
} from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "About WebSystemBuilders",
  description: "Learn how WebSystemBuilders approaches practical software systems for students and business owners.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="About WebSystemBuilders"
        title="One professional platform for finding or building a system."
        description="WebSystemBuilders helps students and business owners access ready-made software systems and request custom development through one professional platform."
        primary={{ label: "Explore systems", href: "/systems" }}
        secondary={{ label: "How the process works", href: "/process" }}
      />
      <StatementSection
        eyebrow="Purpose"
        title="Practical software with visible boundaries."
        copy={[
          "The platform is being built to make system evaluation clearer: who a product is for, what it includes, what it requires, how it is licensed, and what happens after payment.",
          "Ready-made products, custom development, and future hosted SaaS products remain distinct models so their pricing, delivery, and responsibilities are not confused.",
        ]}
      />
      <EditorialSection
        eyebrow="Working standards"
        title="Trust must come from real information."
        tone="subtle"
        items={[
          { title: "Administrator-controlled catalog", description: "Public systems come from reviewed database records rather than invented product cards." },
          { title: "Transparent scope", description: "Inclusions, exclusions, requirements, license, support, and delivery information are separated clearly." },
          { title: "Verified commerce", description: "A hosted payment return does not unlock files; verified server-side payment confirmation controls fulfillment." },
          { title: "Private delivery", description: "System files remain private and customer access is designed to be expiring and revocable." },
        ]}
      />
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid w-[min(calc(100%-40px),1080px)] gap-8 md:w-[min(calc(100%-64px),1080px)] lg:grid-cols-[260px_1fr] lg:gap-20">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Founder</p>
          <div className="border-t border-white/15 pt-8"><h2 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-none tracking-[-0.06em]">AG Evangelista</h2><p className="mt-4 text-lg text-brand-hover">Web Developer</p><p className="mt-8 max-w-2xl text-lg leading-8 text-secondary">AG Evangelista is the founder of WebSystemBuilders and a web developer focused on creating practical software solutions for students and business owners.</p></div>
        </div>
      </section>
      <PublicCallToAction
        title="Start with the system or workflow."
        description="Browse published products or review the custom-development process before deciding which path fits."
        primary={{ label: "Browse systems", href: "/systems" }}
        secondary={{ label: "Custom development", href: "/services/custom-development" }}
      />
    </PublicPageShell>
  );
}
