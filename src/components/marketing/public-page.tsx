import Link from "next/link";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">Skip to content</a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}

export function PublicPageHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="border-b border-white/10 py-16 sm:py-20 lg:py-28">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-10 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.5fr)] lg:items-end lg:gap-20 xl:w-[min(calc(100%-96px),1280px)]">
        <div>
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h1 className="max-w-5xl text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.96] tracking-[-0.065em]">{title}</h1>
        </div>
        <div>
          <p className="text-lg leading-8 text-secondary">{description}</p>
          <div className="mt-7 grid gap-3 sm:flex lg:grid">
            <Link href={primary.href} className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">{primary.label}</Link>
            {secondary && <Link href={secondary.href} className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/15 px-6 font-semibold">{secondary.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function EditorialSection({
  eyebrow,
  title,
  introduction,
  items,
  tone = "default",
}: {
  eyebrow: string;
  title: string;
  introduction?: string;
  items: Array<{ title: string; description: string }>;
  tone?: "default" | "subtle";
}) {
  return (
    <section className={`${tone === "subtle" ? "border-y border-white/10 bg-surface-subtle" : ""} py-20 sm:py-24 lg:py-28`}>
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.75fr)_minmax(500px,1.25fr)] lg:gap-20">
          <div>
            <SectionEyebrow>{eyebrow}</SectionEyebrow>
            <h2 className="max-w-2xl text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{title}</h2>
            {introduction && <p className="mt-6 max-w-xl leading-7 text-secondary">{introduction}</p>}
          </div>
          <div className="border-t border-white/15">
            {items.map((item, index) => (
              <article key={item.title} className="grid grid-cols-[36px_1fr] gap-4 border-b border-white/10 py-7 sm:grid-cols-[54px_1fr]">
                <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
                <div><h3 className="text-xl font-semibold tracking-[-0.03em]">{item.title}</h3><p className="mt-3 leading-7 text-secondary">{item.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatementSection({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string[];
}) {
  return (
    <section className="py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid w-[min(calc(100%-40px),1080px)] gap-10 md:w-[min(calc(100%-64px),1080px)] lg:grid-cols-[260px_1fr] lg:gap-20">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <div><h2 className="text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{title}</h2><div className="mt-8 grid gap-5 text-lg leading-8 text-secondary">{copy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
      </div>
    </section>
  );
}

export function PublicCallToAction({
  title,
  description,
  primary,
  secondary,
}: {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-24 lg:pb-32 xl:px-12">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start gap-8 rounded-2xl border border-white/15 bg-surface p-6 sm:p-10 lg:flex-row lg:items-end lg:justify-between lg:p-14">
        <div><h2 className="max-w-3xl text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.055em]">{title}</h2><p className="mt-4 max-w-2xl leading-7 text-secondary">{description}</p></div>
        <div className="grid w-full shrink-0 gap-3 sm:flex lg:w-auto">
          <Link href={primary.href} className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background">{primary.label}</Link>
          {secondary && <Link href={secondary.href} className="inline-flex min-h-12 items-center justify-center rounded-[10px] border border-white/15 px-6 font-semibold">{secondary.label}</Link>}
        </div>
      </div>
    </section>
  );
}
