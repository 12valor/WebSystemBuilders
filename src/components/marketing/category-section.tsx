import Link from "next/link";
import { LocalizedCatalogPrice } from "@/components/catalog/localized-catalog-price";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import type {
  CatalogCategoryRecord,
  CatalogData,
  CatalogSystemRecord,
} from "@/features/catalog/types";

const standards = [
  "Administrator-managed catalog",
  "Transparent package boundaries",
  "Verified payment before delivery",
  "Private digital delivery",
];

export function TrustStrip() {
  return (
    <section aria-label="Service standards" className="border-y border-white/10 bg-surface-subtle">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] sm:grid-cols-2 md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)] xl:grid-cols-4">
        {standards.map((standard, index) => (
          <div key={standard} className="flex min-h-16 items-center gap-3 border-b border-white/10 py-4 last:border-b-0 sm:min-h-20 sm:border-r sm:px-6 sm:nth-[2]:border-r-0 sm:nth-[3]:border-b-0 xl:border-b-0 xl:nth-[2]:border-r xl:nth-[3]:border-r xl:first:pl-0 xl:last:border-r-0">
            <span className="text-[0.68rem] text-muted">{String(index + 1).padStart(2, "0")}</span>
            <strong className="text-xs font-medium text-secondary">{standard}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategorySection({ catalog }: { catalog: CatalogData }) {
  const featured = catalog.systems.filter((system) => system.featured);
  const systems = (featured.length > 0 ? featured : catalog.systems).slice(0, 3);

  return (
    <section id="systems" className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="mb-10 grid items-end gap-8 lg:mb-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.55fr)] lg:gap-20">
          <div>
            <SectionEyebrow>Administrator-published catalog</SectionEyebrow>
            <h2 className="text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Start with a real system.</h2>
          </div>
          <div>
            <p className="max-w-md text-secondary">Only completed systems published by an administrator appear here. Review exact pricing, inclusions, requirements, license, and support before continuing.</p>
            <Link href="/systems" className="mt-5 inline-flex text-sm font-semibold text-brand-hover">Browse the full catalog <span className="ml-2" aria-hidden="true">&rarr;</span></Link>
          </div>
        </div>

        {systems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {systems.map((system) => <FeaturedSystemCard key={system.id} system={system} />)}
          </div>
        ) : (
          <CatalogState status={catalog.status} />
        )}

        {catalog.status === "ready" && catalog.categories.length > 0 && (
          <div className="mt-14 border-t border-white/10 pt-10">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Browse by category</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Choose a practical starting point.</h3></div>
              <span className="text-sm text-muted">{catalog.categories.length} active {catalog.categories.length === 1 ? "category" : "categories"}</span>
            </div>
            <div className="grid border-l border-t border-white/15 md:grid-cols-2 xl:grid-cols-3">
              {catalog.categories.map((category, index) => <CategoryCard key={category.id} category={category} index={index} />)}
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-blue-400/20 bg-blue-600/[0.08] p-6 sm:flex-row sm:items-center sm:p-8">
          <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-hover">Need a different workflow?</p><h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">Start with custom development.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-secondary">Requirements are reviewed before scope, pricing, and delivery expectations are agreed.</p></div>
          <Link href="/services/custom-development" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[9px] bg-foreground px-5 text-sm font-semibold text-background">View custom development</Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedSystemCard({ system }: { system: CatalogSystemRecord }) {
  return (
    <article className="flex min-h-[330px] flex-col rounded-xl border border-white/10 bg-surface p-6">
      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.08em] text-muted">
        <span>{audienceLabel(system.audience)}</span>
        {system.featured && <span className="text-brand-hover">Featured</span>}
      </div>
      <p className="mt-10 text-xs text-muted">{system.category?.name ?? "Uncategorized"}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em]">{system.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-secondary">{system.summary}</p>
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5">
        <LocalizedCatalogPrice system={system} variant="featured" />
        <Link href={`/systems/${system.slug}`} className="text-sm font-semibold text-brand-hover">View system <span aria-hidden="true">&rarr;</span></Link>
      </div>
    </article>
  );
}

function CategoryCard({ category, index }: { category: CatalogCategoryRecord; index: number }) {
  const audience = category.audience === "students"
    ? "students"
    : category.audience === "business"
      ? "business"
      : undefined;
  const query = new URLSearchParams({ category: category.slug });
  if (audience) query.set("audience", audience);

  return (
    <Link href={`/systems?${query.toString()}`} className="group flex min-h-[250px] flex-col justify-between border-b border-r bg-surface-subtle p-6 transition-colors hover:bg-surface sm:min-h-[280px] sm:p-7">
      <span className="text-xs uppercase tracking-[0.08em] text-muted">{String(index + 1).padStart(2, "0")} / {audienceLabel(category.audience)}</span>
      <div><h4 className="mb-3 text-2xl font-semibold tracking-[-0.035em]">{category.name}</h4>{category.description && <p className="text-[0.92rem] leading-6 text-secondary">{category.description}</p>}</div>
      <span className="flex items-center justify-between text-xs font-medium text-secondary">Explore category <b className="text-base font-normal transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</b></span>
    </Link>
  );
}

function CatalogState({ status }: { status: CatalogData["status"] }) {
  const error = status === "error";
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-surface-subtle px-6 py-12 text-center sm:px-10 sm:py-16">
      <span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-xs font-semibold text-brand-hover" aria-hidden="true">{error ? "!" : status === "unconfigured" ? "SET" : "0"}</span>
      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.035em]">{error ? "Published systems could not be loaded." : status === "unconfigured" ? "The live catalog is not connected yet." : "No systems have been published yet."}</h3>
      <p className="mx-auto mt-3 max-w-2xl leading-7 text-secondary">{error ? "No partial or unverified listing data is being shown." : status === "unconfigured" ? "Administrator-managed systems will appear after the database is configured." : "A system appears here only after its content and delivery requirements pass the publication checks."}</p>
      <Link href="/systems" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 text-sm font-semibold">Open systems catalog</Link>
    </div>
  );
}

function audienceLabel(audience: CatalogSystemRecord["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Students + Business";
}
