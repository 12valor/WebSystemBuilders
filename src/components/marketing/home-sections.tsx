import Link from "next/link";
import { ArrowRight } from "lucide-react";

const startingPoints = [
  {
    number: "01",
    title: "Ready-made systems",
    description: "Compare published packages, requirements, pricing, and included files.",
    action: "Browse catalog",
    href: "/systems",
  },
  {
    number: "02",
    title: "Custom development",
    description: "Define the workflow, users, and constraints before scope and pricing are agreed.",
    action: "Request a quote",
    href: "/request-a-quote",
  },
] as const;

export function FinalCallToAction() {
  return (
    <section id="contact" className="bg-[#FAFAFC] py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0F172A] px-7 py-10 text-white shadow-[0_28px_70px_-32px_rgba(15,23,42,0.55)] sm:px-12 sm:py-14 lg:px-16 lg:py-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(124,58,237,0.22),transparent_34%),radial-gradient(circle_at_8%_95%,rgba(37,99,235,0.2),transparent_36%)]"
            aria-hidden="true"
          />

          <div className="relative grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-200">
                <span className="size-2 rounded-full bg-blue-400" aria-hidden="true" />
                Start your build
              </p>

              <h2 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Build the system that fits what comes next.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Start with a production-ready package or bring us a workflow that needs its own technical solution.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/systems"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(37,99,235,0.6)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] motion-reduce:transform-none"
                >
                  Browse systems
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/request-a-quote"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-6 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                >
                  Request a custom build
                </Link>
              </div>
            </div>

            <div className="border-y border-white/15">
              {startingPoints.map((path, index) => (
                <Link
                  key={path.number}
                  href={path.href}
                  className={[
                    "group grid grid-cols-[auto_1fr_auto] gap-4 py-6 transition-colors hover:text-blue-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300",
                    "sm:gap-5 sm:py-7",
                    index > 0 ? "border-t border-white/15" : "",
                  ].join(" ")}
                >
                  <span className="pt-1 text-xs font-bold tracking-[0.14em] text-blue-300">{path.number}</span>
                  <span>
                    <span className="block text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{path.title}</span>
                    <span className="mt-2 block max-w-md text-sm leading-6 text-slate-400">{path.description}</span>
                    <span className="mt-4 block text-sm font-semibold text-white">{path.action}</span>
                  </span>
                  <ArrowRight className="mt-1 size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="relative mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-xs font-semibold text-slate-400 sm:mt-14">
            <span>Source package included</span>
            <span>30-day setup and defect support</span>
            <span>Payment reviewed before delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}
