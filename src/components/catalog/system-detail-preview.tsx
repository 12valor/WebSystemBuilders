import Link from "next/link";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";

const details = [
  ["Overview and outcomes", "The description explains the operational problem, intended users, and practical outcomes without unsupported claims."],
  ["Features and inclusions", "Administrators list the exact modules, source files, documentation, and other materials included with the selected version."],
  ["Requirements", "Hosting, device, runtime, database, and installation requirements appear before payment."],
  ["License and support", "The commercial source license, 30-day support coverage, customization boundaries, and update policy remain visible."],
];

export function SystemDetailPreview() {
  return (
    <>
      <div className="border-b border-white/10 py-8">
        <nav aria-label="Breadcrumb" className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-wrap gap-2 text-sm text-muted md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
          <Link href="/" className="hover:text-foreground">Home</Link><span>/</span>
          <Link href="/systems" className="hover:text-foreground">Systems</Link><span>/</span>
          <span className="text-secondary">Detail layout preview</span>
        </nav>
      </div>

      <main id="main-content">
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-10 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,1.18fr)_minmax(360px,.82fr)] lg:items-start lg:gap-14 xl:w-[min(calc(100%-96px),1280px)] xl:gap-20">
            <ProductMediaPreview />
            <div className="lg:sticky lg:top-28">
              <p className="mb-5 inline-flex min-h-8 items-center rounded-full border border-blue-400/20 bg-blue-500/[0.08] px-3 text-xs font-semibold text-brand-hover">Phase 1 design preview</p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.08em] text-muted"><span>Audience set by admin</span><span>/</span><span>Category set by admin</span></div>
              <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.06em]">System listing title</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-secondary">This demonstrates how an administrator-published system will be evaluated. It is not a product listing and cannot be purchased.</p>
              <div className="mt-9 border-y border-white/10 py-6">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Price</span>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.035em]">Set by administrator</p>
                <p className="mt-2 text-sm text-secondary">Localized estimates and the PHP settlement amount will appear here.</p>
              </div>
              <button type="button" disabled className="mt-6 inline-flex min-h-13 w-full cursor-not-allowed items-center justify-center rounded-[10px] bg-white/10 px-6 font-semibold text-muted">Purchase unavailable in preview</button>
              <Link href="/checkout/preview" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-white/15 px-6 text-sm font-semibold text-secondary hover:text-foreground">Review checkout layout</Link>
              <dl className="mt-7 grid gap-4 text-sm">
                <TrustRow term="Delivery" detail="Protected access after verified payment" />
                <TrustRow term="License" detail="Commercial source license summary" />
                <TrustRow term="Support" detail="30 days included with the purchased version" />
                <TrustRow term="Refunds" detail="Policy summary shown before checkout" />
              </dl>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-surface-subtle py-20 sm:py-24">
          <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
            <SectionEyebrow>Product information structure</SectionEyebrow>
            <h2 className="max-w-4xl text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Everything a customer needs before deciding.</h2>
            <div className="mt-12 grid border-l border-t border-white/10 md:grid-cols-2">
              {details.map(([title, copy], index) => (
                <article key={title} className="min-h-64 border-b border-r border-white/10 p-6 sm:p-8">
                  <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="mt-12 text-xl font-semibold tracking-[-0.03em]">{title}</h3>
                  <p className="mt-3 max-w-lg leading-7 text-secondary">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto flex w-[min(calc(100%-40px),1280px)] flex-col gap-8 rounded-2xl border border-white/10 bg-surface p-6 sm:p-10 md:w-[min(calc(100%-64px),1280px)] lg:flex-row lg:items-end lg:justify-between xl:w-[min(calc(100%-96px),1280px)]">
            <div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Catalog status</p><h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.045em]">Products appear only when the administrator publishes them.</h2></div>
            <Link href="/systems" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">Return to systems</Link>
          </div>
        </section>
      </main>
    </>
  );
}

function TrustRow({ term, detail }: { term: string; detail: string }) {
  return <div className="grid grid-cols-[88px_1fr] gap-4"><dt className="font-semibold">{term}</dt><dd className="text-secondary">{detail}</dd></div>;
}

function ProductMediaPreview() {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d0f]">
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 text-xs text-muted"><span>Product screenshot area</span><span>01 / 04</span></div>
        <div className="aspect-[4/3] p-4 sm:p-7">
          <div className="grid h-full grid-cols-[72px_1fr] overflow-hidden rounded-xl border border-white/10 bg-background sm:grid-cols-[112px_1fr]">
            <div className="border-r border-white/10 p-3"><div className="h-7 w-7 rounded-md bg-blue-500/20" /><div className="mt-8 grid gap-3">{[72,54,66,45].map((w) => <span key={w} className="h-1.5 rounded-full bg-white/10" style={{ width: `${w}%` }} />)}</div></div>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between"><div><div className="h-2 w-16 rounded-full bg-white/20" /><div className="mt-2 h-1.5 w-24 rounded-full bg-white/10" /></div><div className="h-8 w-20 rounded-md bg-white/10" /></div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">{[1,2,3].map((item) => <div key={item} className={`min-h-20 rounded-lg border border-white/10 p-3 ${item === 1 ? "bg-blue-500/[0.08]" : "bg-surface"}`}><div className="h-1.5 w-10 rounded-full bg-white/10" /><div className="mt-6 h-3 w-14 rounded-full bg-white/20" /></div>)}</div>
              <div className="mt-3 min-h-36 rounded-lg border border-white/10 bg-surface p-4"><div className="h-2 w-20 rounded-full bg-white/20" /><div className="mt-6 grid gap-3">{[88,74,94,62].map((w) => <div key={w} className="flex items-center gap-3"><span className="size-5 rounded bg-white/[0.06]" /><span className="h-1.5 rounded-full bg-white/10" style={{ width: `${w}%` }} /></div>)}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3" aria-label="Product media thumbnails">{[1,2,3,4].map((item) => <button type="button" key={item} aria-label={`Show product media ${item}`} className={`aspect-[4/3] rounded-lg border bg-surface ${item === 1 ? "border-brand" : "border-white/10"}`} />)}</div>
    </div>
  );
}
