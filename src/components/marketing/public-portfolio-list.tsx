import Link from "next/link";
import type { PublicPortfolioData } from "@/features/content/portfolio-types";

export function PublicPortfolioList({ data }: { data: PublicPortfolioData }) {
  if (data.items.length === 0) return <PortfolioEmptyState status={data.status} />;

  return (
    <section aria-labelledby="portfolio-work-title" className="px-5 py-20 sm:px-8 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-5 border-b border-white/10 pb-8 lg:grid-cols-[220px_1fr]">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Published work</p>
          <div><h2 id="portfolio-work-title" className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Reviewed projects and case studies.</h2><p className="mt-4 max-w-2xl leading-7 text-secondary">Each entry is published from the administrator workspace after its scope, public claims, and links are reviewed.</p></div>
        </div>

        <div className="divide-y divide-white/10 border-b border-white/10">
          {data.items.map((item, index) => (
            <article key={item.id} className="grid gap-6 py-10 lg:grid-cols-[160px_minmax(0,1fr)_260px] lg:gap-12 lg:py-14">
              <div>
                <p className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</p>
                <div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-secondary">{audienceLabel(item.audience)}</span>{item.isFeatured && <span className="rounded-full border border-blue-300/20 px-2.5 py-1 text-[11px] font-semibold text-brand-hover">Featured</span>}</div>
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">{item.title}</h3>
                <p className="mt-4 text-lg leading-8 text-secondary">{item.summary}</p>
                <p className="mt-5 whitespace-pre-line leading-7 text-secondary">{item.description}</p>
                {item.outcome && <div className="mt-7 border-l-2 border-blue-400/60 pl-5"><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Verified outcome</p><p className="mt-2 leading-7 text-foreground">{item.outcome}</p></div>}
              </div>
              <div className="lg:border-l lg:border-white/10 lg:pl-8">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Technology</p>
                {item.technologyStack.length > 0 ? <ul className="mt-4 flex flex-wrap gap-2">{item.technologyStack.map((technology) => <li key={technology} className="rounded-lg border border-white/10 bg-surface px-3 py-2 text-xs text-secondary">{technology}</li>)}</ul> : <p className="mt-3 text-sm text-muted">No public technology list.</p>}
                {item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 text-sm font-semibold hover:bg-white/[0.04]">Open approved project link <span className="ml-2" aria-hidden="true">↗</span></a>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioEmptyState({ status }: { status: PublicPortfolioData["status"] }) {
  const unavailable = status === "unconfigured";
  const failed = status === "error";
  const title = unavailable ? "Portfolio publishing is not connected yet." : failed ? "Portfolio entries are temporarily unavailable." : "No case studies have been published yet.";
  const copy = unavailable ? "Project evidence will appear after the secure content database is connected and an administrator publishes approved work." : failed ? "No partial or unverified project data is displayed while the content source cannot be confirmed." : "Portfolio entries will appear only after the project information, permissions, and public claims have been reviewed.";
  return <section className="px-5 py-20 sm:px-8 sm:py-24 lg:py-32"><div className="mx-auto max-w-4xl rounded-2xl border border-dashed border-white/15 bg-surface-subtle px-6 py-14 text-center sm:px-12 sm:py-20"><span className="mx-auto grid size-12 place-items-center rounded-xl border border-white/10 bg-surface text-sm font-semibold text-brand-hover" aria-hidden="true">{failed ? "!" : "0"}</span><h2 className="mt-6 text-3xl font-semibold tracking-[-0.045em]">{title}</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-secondary">{copy}</p><Link href="/systems" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">View systems catalog</Link></div></section>;
}

function audienceLabel(audience: PublicPortfolioData["items"][number]["audience"]) {
  if (audience === "students") return "Students";
  if (audience === "business") return "Business";
  return "Students and business";
}
