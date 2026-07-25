import type { PublicTestimonial } from "@/features/content/testimonial-types";

export function TestimonialsSection({ items }: { items: PublicTestimonial[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="customer-evidence-title" className="border-y border-white/10 px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Customer evidence</p>
          <div><h2 id="customer-evidence-title" className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">What verified customers shared.</h2><p className="mt-4 max-w-2xl leading-7 text-secondary">Every testimonial is published only after its source and permission are recorded by an administrator.</p></div>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-2">
          {items.map((item) => <article key={item.id} className="flex min-h-72 flex-col bg-surface p-7 sm:p-9">
            <blockquote className="text-xl leading-9 tracking-[-0.02em] sm:text-2xl">“{item.quote}”</blockquote>
            <div className="mt-auto border-t border-white/10 pt-6"><p className="font-semibold">{item.attributionName}</p><p className="mt-1 text-sm text-secondary">{[item.attributionRole, item.attributionOrganization].filter(Boolean).join(" · ") || item.relationshipContext}</p>{(item.attributionRole || item.attributionOrganization) && <p className="mt-2 text-xs text-muted">{item.relationshipContext}</p>}</div>
          </article>)}
        </div>
      </div>
    </section>
  );
}
