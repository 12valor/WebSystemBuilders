import Link from "next/link";
import { PublicPageHero, PublicPageShell } from "@/components/marketing/public-page";

export type PolicySubSection = {
  title?: string;
  paragraphs?: string[];
  items?: string[];
};

export type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  subsections?: PolicySubSection[];
};

export function PolicyPage({
  eyebrow = "Pre-launch policy summary",
  title,
  description,
  sideNote,
  sections,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  sideNote?: { title: string; text: string } | null;
  sections: PolicySection[];
}) {
  const effectiveSideNote =
    sideNote === undefined
      ? {
          title: "Legal review pending",
          text: "This page records approved product direction for development and review. It is not final production legal text and must not be treated as waiving mandatory rights.",
        }
      : sideNote;

  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        primary={{ label: "Review common questions", href: "/faq" }}
        secondary={{ label: "Contact WebSystemBuilders", href: "/contact" }}
      />
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid w-[min(calc(100%-40px),1040px)] gap-10 md:w-[min(calc(100%-64px),1040px)] lg:grid-cols-[240px_1fr] lg:gap-16">
          {effectiveSideNote && (
            <aside className="h-fit rounded-xl border border-amber-500/30 bg-amber-50 p-5 text-sm leading-6 lg:sticky lg:top-28">
              <strong className="block text-base font-semibold text-amber-950">{effectiveSideNote.title}</strong>
              <p className="mt-2 leading-relaxed text-amber-900">{effectiveSideNote.text}</p>
            </aside>
          )}
          <div className={`border-t border-border ${!effectiveSideNote ? "lg:col-span-2" : ""}`}>
            {sections.map((section, index) => (
              <section key={section.title} className="border-b border-border py-8">
                <div className="grid grid-cols-[38px_1fr] gap-4 sm:grid-cols-[54px_1fr]">
                  <span className="text-xs font-mono text-muted">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-[-0.035em] text-foreground">{section.title}</h2>
                    {section.paragraphs?.map((paragraph, pIdx) => (
                      <p key={pIdx} className="mt-4 leading-7 text-secondary">
                        {paragraph}
                      </p>
                    ))}
                    {section.items && (
                      <ul className="mt-5 grid gap-3 text-secondary">
                        {section.items.map((item, iIdx) => (
                          <li key={iIdx} className="relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-1.5 before:bg-brand">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.subsections?.map((sub, sIdx) => (
                      <div key={sIdx} className="mt-6 pt-4 border-t border-border/60">
                        {sub.title && <h3 className="text-lg font-medium text-foreground tracking-tight">{sub.title}</h3>}
                        {sub.paragraphs?.map((sp, spIdx) => (
                          <p key={spIdx} className="mt-2 leading-7 text-secondary">
                            {sp}
                          </p>
                        ))}
                        {sub.items && (
                          <ul className="mt-3 grid gap-2 text-secondary">
                            {sub.items.map((si, siIdx) => (
                              <li key={siIdx} className="relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-1.5 before:bg-brand">
                                {si}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ))}
            <p className="mt-8 text-sm leading-6 text-muted">
              Questions about these legal policies can be sent through the{" "}
              <Link href="/contact" className="font-semibold text-foreground underline underline-offset-4">
                contact form
              </Link>{" "}
              or emailed to{" "}
              <a href="mailto:evangelista.agdiaz@gmail.com" className="font-semibold text-foreground underline underline-offset-4">
                evangelista.agdiaz@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}

