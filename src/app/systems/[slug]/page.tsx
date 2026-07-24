import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getPublicSystemBySlug } from "@/features/catalog/repository";
import type { CatalogSystemDetail } from "@/features/catalog/types";

export const metadata: Metadata = {
  title: "System details",
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function SystemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getPublicSystemBySlug(slug);

  if (!result.system) {
    if (result.status === "ready") notFound();
    return (
      <>
        <SiteHeader />
        <UnavailableSystem status={result.status} />
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">Skip to content</a>
      <SiteHeader />
      <PublishedSystem system={result.system} />
      <SiteFooter />
    </>
  );
}

function PublishedSystem({ system }: { system: CatalogSystemDetail }) {
  const sections = [
    ["Overview", system.description],
    ["Package inclusions", system.inclusions],
    ["Exclusions", system.exclusions],
    ["System requirements", system.requirements],
    ["License", system.licenseSummary],
    ["Support", system.supportSummary],
  ].filter((section): section is [string, string] => Boolean(section[1]));

  return (
    <main id="main-content">
      <div className="border-b border-white/10 py-8">
        <nav aria-label="Breadcrumb" className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-wrap gap-2 text-sm text-muted md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link href="/systems" className="hover:text-foreground">Systems</Link><span>/</span>
          <span className="text-secondary">{system.title}</span>
        </nav>
      </div>

      <section className="py-14 sm:py-20 lg:py-24">
        <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 xl:w-[min(calc(100%-96px),1280px)]">
          <div>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-muted"><span>{audienceLabel(system.audience)}</span><span>/</span><span>{system.category?.name ?? "Uncategorized"}</span></div>
            <h1 className="mt-5 max-w-4xl text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.065em]">{system.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-secondary">{system.summary}</p>
          </div>
          <aside className="h-fit rounded-2xl border border-white/10 bg-surface p-6 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Price</p>
            <p className="mt-3 text-2xl font-semibold tabular-nums tracking-[-0.035em]">{formatSystemPrice(system)}</p>
            <p className="mt-2 text-sm leading-6 text-secondary">The final charge currency and authoritative amount will be confirmed before hosted payment.</p>
            <button type="button" disabled className="mt-6 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-white/10 px-5 text-sm font-semibold text-muted">Checkout setup pending</button>
            <Link href="/#contact" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">Request customization</Link>
          </aside>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface-subtle py-16 sm:py-20">
        <div className="mx-auto grid w-[min(calc(100%-40px),1000px)] gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:w-[min(calc(100%-64px),1000px)] md:grid-cols-2">
          {sections.length > 0 ? sections.map(([title, copy], index) => (
            <article key={title} className="min-h-56 bg-surface p-6 sm:p-8">
              <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="mt-8 text-xl font-semibold tracking-[-0.03em]">{title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-secondary">{copy}</p>
            </article>
          )) : (
            <div className="bg-surface p-8 md:col-span-2"><h2 className="text-xl font-semibold">Additional details are being prepared.</h2><p className="mt-3 text-secondary">The administrator has not published extended product information yet.</p></div>
          )}
        </div>
      </section>
    </main>
  );
}

function UnavailableSystem({ status }: { status: "unconfigured" | "error" }) {
  return (
    <main id="main-content" className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
      <div className="max-w-xl">
        <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">{status === "error" ? "!" : "SET"}</span>
        <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em]">System details are unavailable.</h1>
        <p className="mt-4 leading-7 text-secondary">{status === "error" ? "The catalog connection could not be verified, so no partial product data is shown." : "The live catalog will become available after the database is configured."}</p>
        <Link href="/systems" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 font-semibold">Return to systems</Link>
      </div>
    </main>
  );
}

function audienceLabel(audience: CatalogSystemDetail["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Students + Business";
}

function formatSystemPrice(system: CatalogSystemDetail) {
  if (system.pricingType === "quotation" || system.priceMinor === null) return "Request a quote";
  const amount = system.saleActive && system.salePriceMinor !== null ? system.salePriceMinor : system.priceMinor;
  const formatted = new Intl.NumberFormat("en-PH", { style: "currency", currency: system.currency, maximumFractionDigits: 2 }).format(amount / 100);
  return system.pricingType === "starting" ? `From ${formatted}` : formatted;
}
