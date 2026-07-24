/* eslint-disable @next/next/no-img-element -- signed catalog media uses runtime Storage hosts */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getCatalogPricePresentation } from "@/features/catalog/pricing";
import { getPublicSystemBySlug } from "@/features/catalog/repository";
import type {
  CatalogSystemDetail,
  CatalogSystemMedia,
  CatalogSystemRecord,
} from "@/features/catalog/types";

export const dynamic = "force-dynamic";

const getSystem = cache(getPublicSystemBySlug);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSystem(slug);

  if (!result.system) {
    return {
      title: "System unavailable",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: result.system.seoTitle ?? result.system.title,
    description: result.system.seoDescription ?? result.system.summary,
    alternates: { canonical: `/systems/${result.system.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function SystemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getSystem(slug);

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
  const price = getCatalogPricePresentation(system);
  const sections = [
    ["Overview", system.description],
    ["Package inclusions", system.inclusions],
    ["Exclusions", system.exclusions],
    ["System requirements", system.requirements],
    ["Delivery", system.deliverySummary],
    ["Demo instructions", system.media.some((item) => item.mediaType === "demo") ? system.demoInstructions : null],
    ["License", system.licenseSummary],
    ["Support", system.supportSummary],
  ].filter((section): section is [string, string] => Boolean(section[1]));

  return (
    <main id="main-content">
      <div className="border-b border-white/10 py-7">
        <nav aria-label="Breadcrumb" className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-wrap gap-2 text-sm text-muted md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link href="/systems" className="hover:text-foreground">Systems</Link><span>/</span>
          <span className="text-secondary">{system.title}</span>
        </nav>
      </div>

      <section className="py-12 sm:py-16 lg:py-24">
        <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-10 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,1.08fr)_minmax(340px,.72fr)] lg:gap-14 xl:w-[min(calc(100%-96px),1280px)] xl:gap-20">
          <div>
            <ProductMedia media={system.media} title={system.title} />
            <div className="mt-10 flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-muted"><span>{audienceLabel(system.audience)}</span><span>/</span><span>{system.category?.name ?? "Uncategorized"}</span><span>/</span><span>{productTypeLabel(system.productType)}</span></div>
            <h1 className="mt-5 max-w-4xl text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.065em]">{system.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-secondary">{system.summary}</p>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-surface p-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Price</p>
              {price.isSale && <span className="rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-hover">Sale active</span>}
            </div>
            {price.regular && <p className="mt-4 text-sm text-muted line-through">{price.regular}</p>}
            <p className={`${price.regular ? "mt-1" : "mt-4"} text-3xl font-semibold tabular-nums tracking-[-0.04em]`}>{price.current}</p>
            <p className="mt-3 text-sm leading-6 text-secondary">Catalog prices use {system.currency}. The authoritative amount and charge currency must be confirmed before hosted payment.</p>

            {system.pricingType === "quotation" || system.productType === "custom_service" ? (
              <Link href="/request-a-quote" className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-foreground px-5 text-sm font-semibold text-background">Request a quotation</Link>
            ) : (
              <button type="button" disabled className="mt-6 inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-white/10 px-5 text-sm font-semibold text-muted">Checkout setup pending</button>
            )}
            {system.productType !== "custom_service" && <Link href="/request-a-quote" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">Request customization</Link>}

            <dl className="mt-7 grid gap-4 border-t border-white/10 pt-6 text-sm">
              <TrustRow term="Version" detail={system.currentVersion?.versionLabel ?? "Not disclosed"} />
              <TrustRow term="Updated" detail={formatDate(system.updatedAt)} />
              <TrustRow term="Delivery" detail={system.deliverySummary ?? (system.productType === "custom_service" ? "Defined in the accepted scope" : "Private access after verified payment")} />
              <TrustRow term="Support" detail="Product-specific coverage shown below" />
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface-subtle py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-[min(calc(100%-40px),1120px)] md:w-[min(calc(100%-64px),1120px)]">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-16">
            <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Published features</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">What the system includes.</h2></div>
            {system.features.length > 0 ? (
              <ul className="grid border-l border-t border-white/10 sm:grid-cols-2">
                {system.features.map((feature, index) => <li key={feature.id} className="min-h-32 border-b border-r border-white/10 p-5"><span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span><p className="mt-7 font-semibold leading-6">{feature.label}</p></li>)}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-white/15 p-6 text-secondary">No customer-facing features have been published for this system.</div>
            )}
          </div>
        </div>
      </section>

      {system.technologyStack.length > 0 && (
        <section className="border-b border-white/10 py-12 sm:py-14">
          <div className="mx-auto grid w-[min(calc(100%-40px),1120px)] gap-6 md:w-[min(calc(100%-64px),1120px)] lg:grid-cols-[260px_1fr] lg:items-start lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Technology stack</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">Built with disclosed tools.</h2>
            </div>
            <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
              {system.technologyStack.map((technology) => <li key={technology} className="rounded-full border border-white/15 bg-surface px-3 py-2 text-sm text-secondary">{technology}</li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 lg:py-24">
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

      {system.relatedSystems.length > 0 && <RelatedSystems systems={system.relatedSystems} />}
    </main>
  );
}

function ProductMedia({ media, title }: { media: CatalogSystemMedia[]; title: string }) {
  const images = media.filter((item) => item.mediaType === "image");
  const links = media.filter((item) => item.mediaType !== "image");

  return (
    <div>
      {images.length > 0 ? (
        <div className="grid gap-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-subtle">
            <img src={images[0].url} alt={images[0].altText} className="aspect-[4/3] w-full object-cover" />
          </div>
          {images.length > 1 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{images.slice(1).map((image) => <div key={image.id} className="overflow-hidden rounded-xl border border-white/10 bg-surface-subtle"><img src={image.url} alt={image.altText} loading="lazy" className="aspect-[4/3] w-full object-cover" /></div>)}</div>}
        </div>
      ) : (
        <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-white/15 bg-surface-subtle p-8 text-center"><div><span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 text-xs font-semibold text-brand-hover">MEDIA</span><p className="mt-5 font-semibold">No public screenshot is available.</p><p className="mt-2 text-sm text-secondary">Real product media appears only after administrator publication.</p></div></div>
      )}
      {links.length > 0 && <div className="mt-3 grid gap-3 sm:grid-cols-2">{links.map((item) => <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between rounded-[10px] border border-white/15 px-4 text-sm font-semibold hover:bg-white/[0.04]"><span>{item.mediaType === "demo" ? "Open live demo" : "Watch product video"}</span><span aria-hidden="true">↗</span></a>)}</div>}
      <p className="sr-only">Published media for {title}</p>
    </div>
  );
}

function RelatedSystems({ systems }: { systems: CatalogSystemRecord[] }) {
  return (
    <section className="border-t border-white/10 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Continue comparing</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Related published systems.</h2></div><Link href="/systems" className="text-sm font-semibold text-brand-hover">View full catalog →</Link></div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{systems.map((system) => { const price = getCatalogPricePresentation(system); return <article key={system.id} className="flex min-h-72 flex-col rounded-xl border border-white/10 bg-surface p-5"><p className="text-xs uppercase tracking-[0.08em] text-muted">{system.category?.name ?? audienceLabel(system.audience)}</p><h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{system.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-secondary">{system.summary}</p><div className="mt-auto border-t border-white/10 pt-5"><div className="flex items-baseline gap-2"><strong className="text-lg">{price.current}</strong>{price.regular && <span className="text-xs text-muted line-through">{price.regular}</span>}</div><Link href={`/systems/${system.slug}`} className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[9px] border border-white/15 text-sm font-semibold">View system</Link></div></article>; })}</div>
      </div>
    </section>
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

function TrustRow({ term, detail }: { term: string; detail: string }) {
  return <div className="grid grid-cols-[76px_1fr] gap-4"><dt className="font-semibold">{term}</dt><dd className="text-secondary">{detail}</dd></div>;
}

function audienceLabel(audience: CatalogSystemDetail["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Students + Business";
}

function productTypeLabel(productType: CatalogSystemDetail["productType"]) {
  if (productType === "ready_made") return "Ready-made system";
  if (productType === "customizable_template") return "Customizable template";
  return "Custom development";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}