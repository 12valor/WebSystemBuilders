import Link from "next/link";
import type { SiteContentBlock } from "@/features/content/site-content-types";

export function HomepageFeatureSection({ feature }: { feature: SiteContentBlock | null }) {
  if (!feature || !feature.eyebrow || !feature.body) return null;
  return (
    <section aria-labelledby="homepage-feature-title" className="px-5 py-16 sm:px-8 sm:py-20 xl:px-12">
      <div className="mx-auto grid max-w-[1280px] gap-10 rounded-2xl border border-white/15 bg-surface p-7 sm:p-10 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-end lg:gap-12 lg:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-hover">{feature.eyebrow}</p>
        <div><h2 id="homepage-feature-title" className="max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.05em]">{feature.title}</h2><p className="mt-4 max-w-2xl leading-7 text-secondary">{feature.body}</p></div>
        {feature.actionLabel && feature.actionHref && <Link href={feature.actionHref} className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">{feature.actionLabel}</Link>}
      </div>
    </section>
  );
}
