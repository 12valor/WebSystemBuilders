"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Code2, CreditCard, Database, ShieldCheck } from "lucide-react";

const proofTopics = [
  {
    id: "source",
    eyebrow: "Source package",
    badge: "Non-exclusive commercial license",
    title: "Source code with clear commercial permissions.",
    description: "Ready-made systems include their delivered source package with broad, perpetual permissions to use, copy, modify, deploy, resell, and redistribute, subject to the stated license and third-party terms.",
    href: "/legal/license",
    linkLabel: "Review license summary",
    icon: Code2,
    accent: "blue",
    facts: [
      ["Delivered source package", "The purchased version's source files and supplied documentation."],
      ["Commercial use and redistribution", "Use, modify, deploy, resell, and redistribute as permitted."],
      ["Original ownership retained", "WebSystemBuilders may continue selling and licensing the same system."],
    ],
  },
  {
    id: "payment",
    eyebrow: "Payment review",
    badge: "Payment review required",
    title: "Payment verified before delivery.",
    description: "GCash or QRPh proof is matched to the recorded order before protected access is granted. A screenshot or transaction reference does not confirm payment by itself.",
    href: "/legal/delivery",
    linkLabel: "Review delivery policy",
    icon: CreditCard,
    accent: "emerald",
    facts: [
      ["Recorded order", "The selected product and authoritative PHP amount are recorded first."],
      ["Proof matched manually", "Payment details are checked against the correct pending order."],
      ["Delivery stays protected", "Access becomes eligible only after administrator verification."],
    ],
  },
  {
    id: "support",
    eyebrow: "Included support",
    badge: "Coverage starts at fulfillment",
    title: "30-day installation and defect support.",
    description: "Support begins at fulfillment. First human response is targeted within two Philippine business days during the stated support window.",
    href: "/faq",
    linkLabel: "Read support answers",
    icon: ShieldCheck,
    accent: "rose",
    facts: [
      ["Installation guidance", "Help covers the documented setup path for the delivered version."],
      ["Reproducible defects", "Reported issues are reviewed against the declared core features."],
      ["Defined support window", "Coverage lasts 30 days from fulfillment, subject to the listing."],
    ],
  },
  {
    id: "details",
    eyebrow: "Product details",
    badge: "Disclosed per system",
    title: "Requirements disclosed before checkout.",
    description: "Published listings identify the technology stack, database, migrations, security boundaries, and deployment responsibilities for that specific system.",
    href: "/systems",
    linkLabel: "Browse published systems",
    icon: Database,
    accent: "indigo",
    facts: [
      ["Technology stack", "Framework, database, and important dependencies are identified."],
      ["Setup requirements", "Environment, migration, and deployment needs are stated in advance."],
      ["Responsibility boundaries", "Inclusions, exclusions, and customer responsibilities remain visible."],
    ],
  },
] as const;

const accentStyles = {
  blue: {
    icon: "border-blue-300/25 bg-blue-300/10 text-blue-300",
    eyebrow: "text-blue-300",
    selectorIcon: "border-blue-200 bg-blue-50 text-blue-700",
  },
  emerald: {
    icon: "border-emerald-300/25 bg-emerald-300/10 text-emerald-300",
    eyebrow: "text-emerald-300",
    selectorIcon: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  rose: {
    icon: "border-rose-300/25 bg-rose-300/10 text-rose-300",
    eyebrow: "text-rose-300",
    selectorIcon: "border-rose-200 bg-rose-50 text-rose-700",
  },
  indigo: {
    icon: "border-indigo-300/25 bg-indigo-300/10 text-indigo-300",
    eyebrow: "text-indigo-300",
    selectorIcon: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
} as const;

type ProofTopicId = (typeof proofTopics)[number]["id"];

export function WhyChooseUsSection() {
  const [activeTopicId, setActiveTopicId] = useState<ProofTopicId>("source");
  const activeTopic = proofTopics.find((topic) => topic.id === activeTopicId) ?? proofTopics[0];
  const ActiveIcon = activeTopic.icon;
  const activeStyles = accentStyles[activeTopic.accent];

  return (
    <section aria-labelledby="confidence-title" className="border-b border-slate-200 bg-[#FAFAFC] py-20 font-sans text-slate-950 sm:py-24 lg:py-28">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid gap-6 border-b border-slate-200 pb-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-700">What every purchase makes clear</p>
            <h2 id="confidence-title" className="mt-4 max-w-xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-6xl">Know exactly what you receive.</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600 lg:justify-self-end lg:text-lg">Published system pages identify the package, commercial license, technical requirements, support coverage, and verified delivery path before purchase.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
          <article id="purchase-proof-panel" aria-live="polite" className="flex min-h-[600px] flex-col rounded-3xl border border-slate-800 bg-slate-950 p-7 text-white shadow-[0_24px_55px_-38px_rgba(15,23,42,0.7)] sm:p-9 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className={["flex size-12 items-center justify-center rounded-2xl border", activeStyles.icon].join(" ")}><ActiveIcon className="size-6" aria-hidden="true" /></span>
              <span className={["rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]", activeStyles.icon].join(" ")}>{activeTopic.badge}</span>
            </div>

            <div className="mt-10 max-w-3xl">
              <p className={["text-xs font-extrabold uppercase tracking-[0.14em]", activeStyles.eyebrow].join(" ")}>{activeTopic.eyebrow}</p>
              <h3 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">{activeTopic.title}</h3>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{activeTopic.description}</p>
            </div>

            <ul className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {activeTopic.facts.map(([title, description]) => (
                <li key={title} className="flex items-start gap-3 bg-slate-950 p-4 sm:block sm:p-5">
                  <Check className={["mt-0.5 size-4 shrink-0 sm:mt-0", activeStyles.eyebrow].join(" ")} aria-hidden="true" />
                  <div><p className="text-sm font-bold text-white sm:mt-5">{title}</p><p className="mt-1 text-xs leading-6 text-slate-400 sm:mt-2">{description}</p></div>
                </li>
              ))}
            </ul>

            <Link href={activeTopic.href} className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-bold text-white transition-colors hover:border-blue-300/50 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950 motion-reduce:transition-none">
              {activeTopic.linkLabel}<ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </article>

          <div aria-label="Purchase detail topics" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {proofTopics.map((topic) => {
              const Icon = topic.icon;
              const styles = accentStyles[topic.accent];
              const isActive = topic.id === activeTopicId;

              return (
                <button
                  key={topic.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="purchase-proof-panel"
                  onClick={() => setActiveTopicId(topic.id)}
                  className={[
                    "group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border p-5 text-left",
                    "transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none",
                    isActive
                      ? "border-slate-900 bg-slate-950 text-white shadow-[0_18px_45px_-30px_rgba(15,23,42,0.7)]"
                      : "border-slate-200 bg-white text-slate-950 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.35)] hover:-translate-y-0.5 hover:border-slate-300",
                  ].join(" ")}
                >
                  <span className={["flex size-10 items-center justify-center rounded-xl border", isActive ? "border-white/15 bg-white/10 text-blue-200" : styles.selectorIcon].join(" ")}><Icon className="size-5" aria-hidden="true" /></span>
                  <span className="min-w-0">
                    <span className={["block text-[11px] font-extrabold uppercase tracking-[0.12em]", isActive ? "text-blue-200" : "text-slate-500"].join(" ")}>{topic.eyebrow}</span>
                    <span className={["mt-1.5 block text-base font-semibold leading-snug tracking-[-0.025em]", isActive ? "text-white" : "text-slate-950"].join(" ")}>{topic.title}</span>
                  </span>
                  <ArrowRight className={["size-4 transition-transform group-hover:translate-x-0.5", isActive ? "text-blue-200" : "text-slate-400"].join(" ")} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
