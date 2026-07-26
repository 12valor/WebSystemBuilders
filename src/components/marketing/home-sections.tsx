import Link from "next/link";
import { SectionEyebrow } from "@/components/marketing/section-eyebrow";

export function EngagementModelsSection() {
  return (
    <section id="custom" className="border-y border-white/10 bg-surface-subtle py-20 sm:py-24 lg:py-32">
      <div className="mx-auto grid w-[min(calc(100%-40px),1280px)] gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[minmax(0,.8fr)_minmax(520px,1.2fr)] lg:gap-16 xl:w-[min(calc(100%-96px),1280px)] xl:gap-24">
        <div className="max-w-2xl">
          <SectionEyebrow>Two ways to work with us</SectionEyebrow>
          <h2 className="text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Start ready-made.<br />Or build around you.</h2>
          <p className="mt-7 max-w-lg text-secondary">Choose the route that matches your timeline, requirements, and level of customization.</p>
        </div>
        <div className="border-t border-white/15">
          <ModelRow index="01" title="Ready-made systems" href="/systems" action="Browse categories">
            Review the features, requirements, license, support, and delivery details before purchasing the source package.
          </ModelRow>
          <ModelRow index="02" title="Custom development" href="/services/custom-development" action="Request a quotation">
            Tell us what the system needs to do. Requirements are reviewed before scope, price, and delivery expectations are agreed.
          </ModelRow>
        </div>
      </div>
    </section>
  );
}

function ModelRow({ index, title, href, action, children }: { index: string; title: string; href: string; action: string; children: React.ReactNode }) {
  return (
    <article className="grid grid-cols-[38px_1fr] gap-4 border-b border-white/10 py-8 sm:grid-cols-[58px_1fr] sm:gap-5">
      <span className="text-xs text-muted">{index}</span>
      <div><h3 className="mb-3 text-2xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mb-5 max-w-2xl text-secondary">{children}</p><Link href={href} className="text-sm font-semibold text-brand-hover">{action} →</Link></div>
    </article>
  );
}

const audienceContent = [
  {
    id: "students",
    label: "For students",
    title: "Build the technical side of your academic project with clarity.",
    items: ["Capstone and thesis-related systems", "Templates and technical development", "Debugging, deployment, and documentation guidance", "Ethical support that respects school policies"],
    action: "Explore student systems",
    href: "/for-students",
  },
  {
    id: "businesses",
    label: "For business owners",
    title: "Choose a system that supports the way your business operates.",
    items: ["Point-of-sale and inventory workflows", "Warehouse and management systems", "Source code with a commercial license", "Custom development when ready-made is not enough"],
    action: "Explore business systems",
    href: "/for-business",
    accent: true,
  },
];

export function AudienceSection() {
  return (
    <section id="audiences" className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"><SectionEyebrow centered>Built around the work</SectionEyebrow><h2 className="text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">Different goals. One clear process.</h2></div>
        <div className="grid gap-4 lg:grid-cols-2">
          {audienceContent.map((audience, index) => (
            <article key={audience.id} id={audience.id} className={`flex min-h-[460px] flex-col rounded-2xl border p-6 sm:p-10 ${audience.accent ? "border-blue-400/20 bg-[#0b1b36]" : "border-white/15 bg-surface"}`}>
              <div className="flex justify-between text-xs uppercase tracking-[0.1em] text-muted"><span>{audience.label}</span><b className="font-medium">{String(index + 1).padStart(2, "0")}</b></div>
              <h3 className="mb-8 mt-12 max-w-xl text-[clamp(1.65rem,3vw,2rem)] font-semibold leading-[1.16] tracking-[-0.045em] sm:mt-16">{audience.title}</h3>
              <ul className="mb-9 grid gap-3 text-secondary">{audience.items.map((item) => <li key={item} className="relative pl-5 before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-1.5 before:bg-brand-hover">{item}</li>)}</ul>
              <Link href={audience.href} className="mt-auto text-sm font-semibold">{audience.action} →</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  ["Discover", "Browse by audience and category, then review the complete system details."],
  ["Evaluate", "Check features, inclusions, requirements, license, support, and delivery terms."],
  ["Purchase or request", "Continue to secure hosted payment or submit requirements for a custom quotation."],
  ["Receive and access", "Paid orders receive protected delivery access and remain available in the customer portal."],
];

export function ProcessSection() {
  return (
    <section id="process" className="border-t border-white/10 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="mb-10 grid items-end gap-8 lg:mb-14 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.55fr)] lg:gap-20">
          <div><SectionEyebrow>How it works</SectionEyebrow><h2 className="max-w-4xl text-[clamp(2.35rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.055em]">A direct path from evaluation to delivery.</h2></div>
          <p className="max-w-md text-secondary">Every ready-made purchase is recorded before hosted payment and fulfilled only after verified payment confirmation.</p>
        </div>
        <ol className="grid border-t border-white/15 sm:grid-cols-2 xl:grid-cols-4">
          {processSteps.map(([title, detail], index) => (
            <li key={title} className="border-b border-white/10 py-7 sm:min-h-[260px] sm:border-r sm:px-6 xl:border-b-0 xl:last:border-r-0">
              <span className="text-xs text-muted">{String(index + 1).padStart(2, "0")}</span><h3 className="mb-3 mt-10 text-lg font-semibold sm:mt-20">{title}</h3><p className="text-sm text-secondary">{detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function FinalCallToAction() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="relative overflow-hidden rounded-[24px] border border-blue-200/80 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 sm:p-12 lg:p-16 shadow-xl text-white">
          {/* Subtle Graphic Accents */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 size-64 rounded-full bg-blue-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="inline-block rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-xs">
                Get Started Today
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to build your next software system?
              </h2>
              <p className="mt-3 max-w-xl text-base text-blue-100 sm:text-lg">
                Explore our catalog of production-ready systems or request a custom-built technical solution tailored for your organization.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center shrink-0">
              <Link
                href="/systems"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-7 text-base font-semibold text-[#2563EB] shadow-md transition-all hover:bg-slate-50 hover:shadow-lg"
              >
                Browse Systems
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/request-a-quote"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}