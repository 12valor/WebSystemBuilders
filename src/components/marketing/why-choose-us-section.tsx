"use client";

import Link from "next/link";
import { useState } from "react";
  import { ArrowRight, Code2, CreditCard, Database, ShieldCheck } from "lucide-react";

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

function ProofIllustration({ variant }: { variant: ProofTopicId }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 760 560" className="size-full" fill="none">
      <rect width="760" height="560" rx="42" fill="#EEE9FF" />
      <circle cx="626" cy="102" r="112" fill="#DDD6FE" />
      <circle cx="108" cy="470" r="144" fill="#C7D2FE" />

      {variant === "source" && (
        <g>
          <rect x="70" y="94" width="430" height="310" rx="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
          <path d="M70 154H500" stroke="#0F172A" strokeWidth="7" />
          <circle cx="102" cy="124" r="8" fill="#2563EB" />
          <circle cx="128" cy="124" r="8" fill="#A78BFA" />
          <path d="M132 232L96 266L132 300M252 232L288 266L252 300M211 206L172 326" stroke="#2563EB" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M336 215H448M336 252H420M336 289H458M336 326H404" stroke="#7C3AED" strokeWidth="12" strokeLinecap="round" />
          <path d="M473 326H560" stroke="#4F46E5" strokeWidth="9" strokeLinecap="round" strokeDasharray="10 13" />
          <path d="M544 307L566 326L544 345" stroke="#4F46E5" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(530 280)">
            <path d="M0 52L84 9L168 52L84 95L0 52Z" fill="#EDE9FE" stroke="#0F172A" strokeWidth="7" strokeLinejoin="round" />
            <path d="M0 52V139L84 182V95L0 52ZM168 52V139L84 182V95L168 52Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" strokeLinejoin="round" />
            <path d="M65 42L104 62" stroke="#7C3AED" strokeWidth="10" strokeLinecap="round" />
          </g>
        </g>
      )}

      {variant === "payment" && (
        <g>
          <rect x="74" y="104" width="252" height="340" rx="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
          <rect x="108" y="142" width="112" height="14" rx="7" fill="#2563EB" />
          <path d="M108 196H288M108 232H252M108 268H274" stroke="#CBD5E1" strokeWidth="11" strokeLinecap="round" />
          <rect x="108" y="318" width="184" height="78" rx="18" fill="#ECFDF5" stroke="#10B981" strokeWidth="5" />
          <path d="M139 357L155 373L184 340" stroke="#10B981" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M344 274H425" stroke="#4F46E5" strokeWidth="9" strokeLinecap="round" strokeDasharray="10 13" />
          <path d="M409 255L431 274L409 293" stroke="#4F46E5" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="450" y="126" width="238" height="170" rx="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
          <rect x="480" y="160" width="178" height="28" rx="10" fill="#DBEAFE" />
          <path d="M486 238H554M580 238H650" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" />
          <path d="M582 306C550 321 532 326 532 326V390C532 435 558 463 582 476C606 463 632 435 632 390V326C632 326 614 321 582 306Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="8" strokeLinejoin="round" />
          <path d="M558 389L575 406L608 369" stroke="#60A5FA" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}

      {variant === "support" && (
        <g>
          <rect x="70" y="120" width="452" height="300" rx="30" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
          <path d="M70 178H522" stroke="#0F172A" strokeWidth="7" />
          <circle cx="104" cy="149" r="8" fill="#FB7185" />
          <circle cx="131" cy="149" r="8" fill="#FDA4AF" />
          <circle cx="294" cy="292" r="74" fill="#FFE4E6" />
          <path d="M255 310L321 244M270 238L328 296" stroke="#E11D48" strokeWidth="18" strokeLinecap="round" />
          <rect x="102" y="210" width="102" height="18" rx="9" fill="#CBD5E1" />
          <rect x="102" y="248" width="78" height="14" rx="7" fill="#E2E8F0" />
          <rect x="102" y="282" width="92" height="14" rx="7" fill="#E2E8F0" />
          <g transform="translate(490 76)">
            <rect width="186" height="170" rx="28" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
            <path d="M0 54H186" stroke="#0F172A" strokeWidth="7" />
            <path d="M42 0V34M144 0V34" stroke="#2563EB" strokeWidth="12" strokeLinecap="round" />
            <text x="93" y="124" textAnchor="middle" fill="#E11D48" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="58" fontWeight="800">30</text>
          </g>
          <g transform="translate(510 342)">
            <rect width="176" height="100" rx="24" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
            <path d="M42 100L22 122V98" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" strokeLinejoin="round" />
            <path d="M34 36H142M34 66H112" stroke="#7C3AED" strokeWidth="10" strokeLinecap="round" />
          </g>
        </g>
      )}

      {variant === "details" && (
        <g>
          <rect x="74" y="76" width="330" height="396" rx="30" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
          <rect x="112" y="118" width="126" height="16" rx="8" fill="#7C3AED" />
          <rect x="112" y="156" width="214" height="11" rx="5.5" fill="#DDD6FE" />
          <rect x="112" y="214" width="28" height="28" rx="7" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="5" />
          <path d="M119 228L126 235L138 220" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M164 221H340M164 240H292" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
          <rect x="112" y="286" width="28" height="28" rx="7" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="5" />
          <path d="M119 300L126 307L138 292" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M164 293H322M164 312H278" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
          <rect x="112" y="358" width="28" height="28" rx="7" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="5" />
          <path d="M119 372L126 379L138 364" stroke="#7C3AED" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M164 365H306M164 384H252" stroke="#0F172A" strokeWidth="8" strokeLinecap="round" />
          <g transform="translate(454 132)">
            <ellipse cx="112" cy="36" rx="112" ry="36" fill="#C7D2FE" stroke="#0F172A" strokeWidth="7" />
            <path d="M0 36V246C0 266 50 282 112 282C174 282 224 266 224 246V36" fill="#FFFFFF" stroke="#0F172A" strokeWidth="7" />
            <path d="M0 106C0 126 50 142 112 142C174 142 224 126 224 106M0 176C0 196 50 212 112 212C174 212 224 196 224 176" stroke="#0F172A" strokeWidth="7" />
            <ellipse cx="112" cy="36" rx="66" ry="16" fill="#7C3AED" />
          </g>
        </g>
      )}
    </svg>
  );
}

export function WhyChooseUsSection() {
  const [activeTopicId, setActiveTopicId] = useState<ProofTopicId>("source");
  const activeTopic = proofTopics.find((topic) => topic.id === activeTopicId) ?? proofTopics[0];

  return (
    <section aria-labelledby="confidence-title" className="relative overflow-hidden border-y border-violet-200/70 bg-[#F5F2FF] py-20 font-sans text-slate-950 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="absolute right-0 top-0 size-64 rounded-full border-[56px] border-indigo-200/45" />
      <div className="relative mx-auto grid w-[min(calc(100%-32px),1280px)] items-center gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
        <div className="overflow-hidden rounded-[32px] border border-violet-200 bg-[#EEE9FF] p-3 shadow-[0_28px_70px_-36px_rgba(76,29,149,0.28)] sm:p-5">
          <div key={activeTopic.id} className="aspect-[4/3] overflow-hidden rounded-[24px] animate-in fade-in-0 zoom-in-95 duration-200 motion-reduce:animate-none">
            <ProofIllustration variant={activeTopic.id} />
          </div>
        </div>

        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">
            What every purchase makes clear
          </p>
          <h2 id="confidence-title" className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">
            Know exactly what you receive.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            Published system pages identify the package, commercial license, technical requirements, support coverage, and verified delivery path before purchase.
          </p>

          <div aria-label="Purchase detail topics" className="mt-6 flex flex-wrap gap-2">
            {proofTopics.map((topic) => {
              const Icon = topic.icon;
              const isActive = topic.id === activeTopicId;

              return (
                <button
                  key={topic.id}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls="purchase-proof-details"
                  onClick={() => setActiveTopicId(topic.id)}
                  className={[
                    "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-xs font-bold transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-indigo-200 bg-white/75 text-slate-700 hover:border-indigo-300 hover:bg-white",
                  ].join(" ")}
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                  {topic.eyebrow}
                </button>
              );
            })}
          </div>

          <div id="purchase-proof-details" aria-live="polite" className="mt-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-700">{activeTopic.eyebrow}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-3xl">{activeTopic.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{activeTopic.description}</p>
            <div className="mt-5 space-y-3">
              {activeTopic.facts.slice(0, 2).map(([title, description], index) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-white/85 p-4 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.4)]">
                  <span className={["grid size-10 shrink-0 place-items-center rounded-xl border text-sm font-bold", accentStyles[activeTopic.accent].selectorIcon].join(" ")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href={activeTopic.href} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transform-none">
              {activeTopic.linkLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
