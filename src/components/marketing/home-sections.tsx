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
    illustration: "catalog",
  },
  {
    number: "02",
    label: "Review",
    title: "Check the fit",
    description: "Compare a ready-made package or share your workflow when the work needs a custom solution.",
    icon: ClipboardCheck,
    cardClassName: "bg-blue-50",
    accentClassName: "text-blue-500",
    iconClassName: "bg-blue-600 text-white",
    illustration: "review",
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
    illustration: "proceed",
  },
] as const;

type IllustrationVariant = (typeof steps)[number]["illustration"];

function StepIllustration({ variant }: { variant: IllustrationVariant }) {
  if (variant === "catalog") {
    return (
      <svg aria-hidden="true" viewBox="0 0 420 240" className="size-full" fill="none">
        <rect x="34" y="24" width="352" height="192" rx="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="6" />
        <path d="M34 72H386" stroke="#0F172A" strokeWidth="6" />
        <circle cx="58" cy="48" r="6" fill="#2563EB" />
        <circle cx="78" cy="48" r="6" fill="#93C5FD" />
        <rect x="226" y="39" width="132" height="20" rx="10" fill="#EFF6FF" />
        <circle cx="342" cy="49" r="6" stroke="#2563EB" strokeWidth="3" />
        <path d="M346 54L352 60" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
        <rect x="58" y="94" width="84" height="88" rx="12" fill="#DBEAFE" />
        <rect x="168" y="94" width="84" height="88" rx="12" fill="#DBEAFE" />
        <rect x="278" y="94" width="84" height="88" rx="12" fill="#E2E8F0" />
        <path d="M76 118H124M76 136H112M186 118H234M186 136H220M296 118H344M296 136H330" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        <rect x="76" y="155" width="30" height="8" rx="4" fill="#2563EB" />
        <rect x="186" y="155" width="30" height="8" rx="4" fill="#2563EB" />
        <rect x="296" y="155" width="30" height="8" rx="4" fill="#475569" />
      </svg>
    );
  }

  if (variant === "review") {
    return (
      <svg aria-hidden="true" viewBox="0 0 420 240" className="size-full" fill="none">
        <rect x="84" y="22" width="252" height="196" rx="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="6" />
        <rect x="108" y="46" width="92" height="12" rx="6" fill="#2563EB" />
        <rect x="108" y="70" width="154" height="8" rx="4" fill="#BFDBFE" />
        <rect x="110" y="101" width="24" height="24" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="4" />
        <path d="M116 113L121 118L129 108" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M151 108H294M151 121H244" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        <rect x="110" y="145" width="24" height="24" rx="6" fill="#DBEAFE" stroke="#2563EB" strokeWidth="4" />
        <path d="M116 157L121 162L129 152" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M151 152H280M151 165H226" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="326" cy="178" r="36" fill="#2563EB" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M313 178L322 187L340 167" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 420 240" className="size-full" fill="none">
      <path d="M62 116H132" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" />
      <path d="M116 98L136 116L116 134" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="142" y="64" width="154" height="124" rx="18" fill="#FFFFFF" stroke="#0F172A" strokeWidth="6" />
      <path d="M142 98H296" stroke="#0F172A" strokeWidth="6" />
      <rect x="166" y="119" width="70" height="10" rx="5" fill="#CBD5E1" />
      <rect x="166" y="143" width="104" height="10" rx="5" fill="#E2E8F0" />
      <path d="M332 62C311 72 299 76 299 76V118C299 149 316 169 332 178C348 169 365 149 365 118V76C365 76 353 72 332 62Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" />
      <path d="M317 117L328 128L349 104" stroke="#60A5FA" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="92" cy="116" r="12" fill="#DBEAFE" stroke="#2563EB" strokeWidth="5" />
      <path d="M174 82H216" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

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
                    <StepIllustration variant={step.illustration} />
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
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-700 px-7 text-sm font-semibold text-white shadow-[0_10px_25px_-8px_rgba(37,99,235,0.45)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none sm:w-auto"
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
