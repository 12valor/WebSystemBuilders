import Link from "next/link";
import {
  ArrowRight,
  Check,
  Code2,
  CreditCard,
  Database,
  ShieldCheck,
} from "lucide-react";

const supportingProofs = [
  {
    eyebrow: "Payment review",
    title: "Payment verified before delivery",
    description:
      "GCash or QRPh proof is matched to the recorded order before protected access is granted.",
    href: "/legal/delivery",
    linkLabel: "Review delivery policy",
    icon: CreditCard,
    accent: "emerald",
  },
  {
    eyebrow: "Included support",
    title: "30-day installation and defect support",
    description:
      "Support begins at fulfillment. First human response is targeted within two Philippine business days.",
    href: "/faq",
    linkLabel: "Read support answers",
    icon: ShieldCheck,
    accent: "rose",
  },
  {
    eyebrow: "Product details",
    title: "Requirements disclosed per system",
    description:
      "Listings identify the stack, database, migrations, security boundaries, and deployment responsibilities.",
    href: "/systems",
    linkLabel: "Browse published systems",
    icon: Database,
    accent: "indigo",
  },
] as const;

const accentStyles = {
  emerald: {
    icon: "border-emerald-200 bg-emerald-50 text-emerald-700",
    eyebrow: "text-emerald-700",
  },
  rose: {
    icon: "border-rose-200 bg-rose-50 text-rose-700",
    eyebrow: "text-rose-700",
  },
  indigo: {
    icon: "border-indigo-200 bg-indigo-50 text-indigo-700",
    eyebrow: "text-indigo-700",
  },
} as const;

export function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="confidence-title"
      className="border-b border-slate-200 bg-[#FAFAFC] py-20 font-sans text-slate-950 sm:py-24 lg:py-28"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid gap-6 border-b border-slate-200 pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">
              What every purchase makes clear
            </p>
            <h2
              id="confidence-title"
              className="mt-4 max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-6xl"
            >
              Know exactly what you receive.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end lg:text-lg">
            Published system pages identify the package, commercial license,
            technical requirements, support coverage, and verified delivery
            path before purchase.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
          <article className="flex flex-col rounded-3xl border border-slate-800 bg-slate-950 p-7 text-white shadow-[0_24px_55px_-38px_rgba(15,23,42,0.7)] sm:p-9 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] text-blue-300">
                <Code2 className="size-6" aria-hidden="true" />
              </span>
              <span className="rounded-full border border-blue-300/25 bg-blue-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-blue-200">
                Non-exclusive commercial license
              </span>
            </div>

            <div className="mt-10 max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-300">
                Source package
              </p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Source code with clear commercial permissions.
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Ready-made systems include their delivered source package with
                broad, perpetual permissions to use, copy, modify, deploy,
                resell, and redistribute, subject to the stated license and
                third-party terms.
              </p>
            </div>

            <ul className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              <li className="flex items-start gap-3 bg-slate-950 p-4 sm:block sm:p-5">
                <Check className="mt-0.5 size-4 shrink-0 text-blue-300 sm:mt-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white sm:mt-5">
                    Delivered source package
                  </p>
                  <p className="mt-1 text-xs leading-6 text-slate-400 sm:mt-2">
                    The purchased version&apos;s source files and supplied
                    documentation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-slate-950 p-4 sm:block sm:p-5">
                <Check className="mt-0.5 size-4 shrink-0 text-blue-300 sm:mt-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white sm:mt-5">
                    Commercial use and redistribution
                  </p>
                  <p className="mt-1 text-xs leading-6 text-slate-400 sm:mt-2">
                    Use, modify, deploy, resell, and redistribute as permitted.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 bg-slate-950 p-4 sm:block sm:p-5">
                <Check className="mt-0.5 size-4 shrink-0 text-blue-300 sm:mt-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-bold text-white sm:mt-5">
                    Original ownership retained
                  </p>
                  <p className="mt-1 text-xs leading-6 text-slate-400 sm:mt-2">
                    WebSystemBuilders may continue selling and licensing the
                    same system.
                  </p>
                </div>
              </li>
            </ul>

            <Link
              href="/legal/license"
              className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-bold text-white transition-colors hover:border-blue-300/50 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 motion-reduce:transition-none"
            >
              Review license summary
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {supportingProofs.map((proof) => {
              const Icon = proof.icon;
              const styles = accentStyles[proof.accent];

              return (
                <article
                  key={proof.title}
                  className="group grid h-full grid-cols-[auto_minmax(0,1fr)] items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.35)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_20px_45px_-32px_rgba(15,23,42,0.4)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl border ${styles.icon}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-[11px] font-extrabold uppercase tracking-[0.12em] ${styles.eyebrow}`}
                    >
                      {proof.eyebrow}
                    </p>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-[-0.03em] text-slate-950">
                      {proof.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {proof.description}
                    </p>
                    <Link
                      href={proof.href}
                      className="mt-4 inline-flex min-h-9 w-fit items-center gap-2 border-b border-slate-300 text-xs font-bold text-slate-700 transition-colors hover:border-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 motion-reduce:transition-none"
                    >
                      {proof.linkLabel}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
