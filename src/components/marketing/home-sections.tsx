import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const startingPoints = [
  {
    number: "01",
    label: "Published systems",
    title: "Start with something ready.",
    description:
      "Compare the package, requirements, price, and included files before checkout.",
    action: "Browse systems",
    href: "/systems",
    className: "bg-[#0B1224] text-white",
    mutedClassName: "text-slate-300",
    lineClassName: "border-white/20",
  },
  {
    number: "02",
    label: "Custom development",
    title: "Build around the work.",
    description:
      "Bring the workflow, users, and constraints. Scope and pricing are agreed before work begins.",
    action: "Outline your project",
    href: "/request-a-quote",
    className: "bg-[#1769FF] text-white",
    mutedClassName: "text-blue-100",
    lineClassName: "border-white/25",
  },
] as const;

export function FinalCallToAction() {
  return (
    <section id="contact" className="bg-[#F5F5F1] py-20 sm:py-28">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="border-t border-slate-950 pt-6 sm:pt-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(180px,0.35fr)_1fr] lg:gap-16">
            <div className="flex items-start gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              <span className="mt-1.5 size-2 bg-[#1769FF]" aria-hidden="true" />
              Start here
            </div>

            <div>
              <h2 className="max-w-4xl text-[clamp(3rem,7vw,6.4rem)] font-semibold leading-[0.88] tracking-[-0.07em] text-[#0B1224]">
                Ready to build
                <span className="block text-[#1769FF]">what comes next?</span>
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                Choose a production-ready package or start a custom build. Either way, the boundaries are clear before you commit.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:ml-[calc(35%+2.5rem)] lg:mt-16">
            {startingPoints.map((path) => (
              <Link
                key={path.number}
                href={path.href}
                className={[
                  "group flex min-h-[330px] flex-col justify-between p-7 transition-transform duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1769FF]",
                  "motion-safe:hover:-translate-y-1 sm:p-9",
                  path.className,
                ].join(" ")}
              >
                <div className={["flex items-center justify-between border-b pb-5", path.lineClassName].join(" ")}>
                  <span className="text-sm font-semibold tracking-[0.12em]">{path.number}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">{path.label}</span>
                </div>

                <div className="pt-14">
                  <h3 className="max-w-sm text-[clamp(2rem,3vw,3.25rem)] font-semibold leading-[0.96] tracking-[-0.055em]">
                    {path.title}
                  </h3>
                  <p className={["mt-5 max-w-md text-sm leading-6 sm:text-base sm:leading-7", path.mutedClassName].join(" ")}>
                    {path.description}
                  </p>
                  <span className="mt-8 flex items-center justify-between border-t border-current/25 pt-5 text-sm font-semibold">
                    {path.action}
                    <ArrowUpRight
                      className="size-5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid border-y border-slate-300 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 sm:grid-cols-3 lg:ml-[calc(35%+2.5rem)]">
            <p className="py-4 sm:pr-5">Source package included</p>
            <p className="border-t border-slate-300 py-4 sm:border-l sm:border-t-0 sm:px-5">30-day setup and defect support</p>
            <p className="border-t border-slate-300 py-4 sm:border-l sm:border-t-0 sm:pl-5">Payment reviewed before delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
}
