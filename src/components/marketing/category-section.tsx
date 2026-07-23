import Link from "next/link";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { homepageCategories } from "@/features/catalog/homepage-categories";

const standards = ["Admin-managed catalog", "Transparent inclusions", "Protected delivery", "30-day included support"];

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

export function CategorySection() {
  return (
    <section id="systems" className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="mb-10 grid items-end gap-8 lg:mb-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.55fr)] lg:gap-20">
          <div><SectionEyebrow>Explore by category</SectionEyebrow><h2 className="text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Find the right starting point.</h2></div>
          <p className="max-w-md text-secondary">Systems are selected, prepared, priced, and published through the WebSystemBuilders admin catalog.</p>
        </div>
        <div className="grid border-l border-t border-white/15 md:grid-cols-2 xl:grid-cols-3">
          {homepageCategories.map((category) => <CategoryCard key={category.name} category={category} />)}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: (typeof homepageCategories)[number] }) {
  const light = category.emphasis === "light";
  const brand = category.emphasis === "brand";
  return (
    <Link href={category.href} className={`group flex min-h-[290px] flex-col justify-between border-b border-r p-6 transition-colors sm:min-h-[330px] sm:p-7 ${light ? "border-black/15 bg-[#f1f1f0] text-[#0b0c0e] hover:bg-white" : brand ? "border-white/15 bg-blue-600/[0.08] hover:bg-blue-600/[0.13]" : "border-white/15 bg-surface-subtle hover:bg-surface"}`}>
      <span className={`text-xs uppercase tracking-[0.08em] ${light ? "text-[#6a6b70]" : "text-muted"}`}>{category.index} / {category.audience}</span>
      <div>
        <h3 className="mb-3 text-2xl font-semibold tracking-[-0.035em]">{category.name}</h3>
        <p className={`text-[0.92rem] ${light ? "text-[#5e6065]" : "text-secondary"}`}>{category.description}</p>
      </div>
      <span className={`flex items-center justify-between text-xs font-medium ${light ? "text-[#2f3135]" : "text-secondary"}`}>
        {brand ? "Start a request" : "Explore category"}<b className="text-base font-normal transition-transform group-hover:translate-x-1" aria-hidden="true">{brand ? "→" : "↗"}</b>
      </span>
    </Link>
  );
}