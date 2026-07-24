import Link from "next/link";
import { PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";

export type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export function PolicyPage({
  title,
  description,
  sections,
}: {
  title: string;
  description: string;
  sections: PolicySection[];
}) {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="Pre-launch policy summary"
        title={title}
        description={description}
        primary={{ label: "Review common questions", href: "/faq" }}
        secondary={{ label: "Contact WebSystemBuilders", href: "/contact" }}
      />
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid w-[min(calc(100%-40px),1040px)] gap-10 md:w-[min(calc(100%-64px),1040px)] lg:grid-cols-[240px_1fr] lg:gap-16">
          <aside className="h-fit rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-5 text-sm leading-6 text-amber-100 lg:sticky lg:top-28">
            <strong className="block text-foreground">Legal review pending</strong>
            <p className="mt-2">This page records approved product direction for development and review. It is not final production legal text and must not be treated as waiving mandatory rights.</p>
          </aside>
          <div className="border-t border-white/15">
            {sections.map((section, index) => (
              <section key={section.title} className="border-b border-white/10 py-8">
                <div className="grid grid-cols-[38px_1fr] gap-4 sm:grid-cols-[54px_1fr]">
                  <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em]">{section.title}</h2>
                    {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 leading-7 text-secondary">{paragraph}</p>)}
                    {section.items && <ul className="mt-5 grid gap-3 text-secondary">{section.items.map((item) => <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-1.5 before:bg-brand-hover">{item}</li>)}</ul>}
                  </div>
                </div>
              </section>
            ))}
            <p className="mt-8 text-sm leading-6 text-muted">Questions about this summary can be sent through the <Link href="/contact" className="font-semibold text-foreground underline underline-offset-4">contact form</Link>.</p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
