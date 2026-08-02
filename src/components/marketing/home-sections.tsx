import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, LayoutGrid, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "Explore",
    title: "See what is ready",
    description: "Browse published systems with their scope, price, requirements, and included files clearly listed.",
    icon: LayoutGrid,
    cardClassName: "bg-blue-50",
    accentClassName: "text-blue-500",
    iconClassName: "bg-blue-600 text-white",
    imageClassName: "origin-left scale-[1.5] object-cover",
  },
  {
    number: "02",
    label: "Review",
    title: "Check the fit",
    description: "Compare a ready-made package or share your workflow when the work needs a custom solution.",
    icon: ClipboardCheck,
    cardClassName: "bg-violet-50",
    accentClassName: "text-violet-500",
    iconClassName: "bg-violet-600 text-white",
    imageClassName: "origin-center scale-[1.5] object-cover",
  },
  {
    number: "03",
    label: "Proceed",
    title: "Move forward clearly",
    description: "Checkout or approve a custom scope only after the inclusions, responsibilities, and next steps are understood.",
    icon: ShieldCheck,
    cardClassName: "bg-slate-100",
    accentClassName: "text-slate-700",
    iconClassName: "bg-slate-900 text-white",
    imageClassName: "origin-right scale-[1.5] object-cover",
  },
] as const;

export function FinalCallToAction() {
  return (
    <section id="contact" className="border-t border-slate-200 bg-[#FAFAFC] py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">A clearer way to begin</p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0F172A] sm:text-5xl lg:text-6xl">
            Getting the right system should feel straightforward.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            No vague promises or confusing handoffs. Just a clear path from the first look to the right next step.
          </p>
        </div>

        <ol aria-label="Three steps to begin" className="mt-12 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <li key={step.number} className="h-full">
                <article className={["flex h-full flex-col overflow-hidden rounded-[22px]", step.cardClassName].join(" ")}>
                  <div className="flex items-start justify-between px-6 pb-4 pt-5 sm:px-7 sm:pt-6">
                    <div>
                      <p className={["text-[clamp(4.5rem,8vw,7rem)] font-light leading-none tracking-[-0.08em]", step.accentClassName].join(" ")}>
                        {step.number}
                      </p>
                      <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">{step.label}</p>
                    </div>
                    <span className={["flex size-11 items-center justify-center rounded-xl shadow-sm", step.iconClassName].join(" ")}>
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="relative mx-3 h-48 overflow-hidden rounded-[18px] border border-white/70 bg-white sm:h-56">
                    <Image
                      src="/images/dashboard-hero-light.png"
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className={step.imageClassName}
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-slate-950/[0.05]" aria-hidden="true" />
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-7 pt-6 sm:px-7">
                    <h3 className="text-xl font-extrabold tracking-[-0.03em] text-slate-950 sm:text-2xl">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/systems"
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-7 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(37,99,235,0.45)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none sm:w-auto"
          >
            Browse systems
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/request-a-quote"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:w-auto"
          >
            Request a custom build
          </Link>
        </div>
      </div>
    </section>
  );
}
