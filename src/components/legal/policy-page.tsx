import Link from "next/link";
import { 
  ShieldCheck, 
  FileText, 
  Scale, 
  Truck, 
  RotateCcw, 
  ArrowRight, 
  Mail, 
  ExternalLink 
} from "lucide-react";
import { PublicPageShell } from "@/components/marketing/public-page";
import { 
  PolicyTableOfContents, 
  MobilePolicyMenu, 
  PrintButton 
} from "@/components/legal/policy-table-of-contents";

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
  callout?: {
    title: string;
    text: string;
  };
};

const legalTabs = [
  { label: "Privacy Policy", href: "/legal/privacy", icon: ShieldCheck },
  { label: "Terms & Conditions", href: "/legal/terms", icon: Scale },
  { label: "Software License", href: "/legal/license", icon: FileText },
  { label: "Digital Delivery", href: "/legal/delivery", icon: Truck },
  { label: "Refunds & Remedies", href: "/legal/refunds", icon: RotateCcw },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function PolicyPage({
  eyebrow = "Legal Documentation",
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
          title: "Legal Policy Record",
          text: "This document establishes the commercial, licensing, and operational terms governing WebSystemBuilders systems and custom development.",
        }
      : sideNote;

  return (
    <PublicPageShell>
      {/* ================= HERO HEADER ================= */}
      <section className="border-b border-slate-200/80 bg-white pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14">
        <div className="mx-auto w-[min(calc(100%-32px),1180px)] md:w-[min(calc(100%-64px),1180px)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700">
              <ShieldCheck className="size-3.5" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12]">
              {title}
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {description}
            </p>

            {/* Document Metadata Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono font-medium text-slate-700">
                Effective: 7 August 2026
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700">
                Jurisdiction: Republic of the Philippines
              </span>
              <PrintButton />
            </div>
          </div>

          {/* ================= LEGAL HUB TABS ================= */}
          <div className="mt-10 border-t border-slate-100 pt-6 print:hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none sm:gap-2">
              {legalTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className="inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition"
                  >
                    <Icon className="size-3.5 text-slate-400" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ================= MOBILE JUMP TO SECTION ACCORDION ================= */}
      <MobilePolicyMenu sections={sections} />

      {/* ================= MAIN CONTENT AREA ================= */}
      <section className="bg-[#FAFAFC] py-12 sm:py-16 lg:py-20 font-sans">
        <div className="mx-auto grid w-[min(calc(100%-32px),1180px)] gap-10 md:w-[min(calc(100%-64px),1180px)] lg:grid-cols-[280px_1fr] lg:gap-14 xl:gap-16">
          
          {/* ================= DESKTOP STICKY SIDEBAR ================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              
              {/* Table of Contents */}
              <PolicyTableOfContents sections={sections} />

              {/* Data Controller / Operator Info Card */}
              {effectiveSideNote && (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 text-xs shadow-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <ShieldCheck className="size-4 text-blue-600" />
                    <span>{effectiveSideNote.title}</span>
                  </div>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {effectiveSideNote.text}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-slate-500">
                    <Mail className="size-3.5 text-slate-400" />
                    <a
                      href="mailto:evangelista.agdiaz@gmail.com"
                      className="font-medium text-blue-600 hover:underline truncate"
                    >
                      evangelista.agdiaz@gmail.com
                    </a>
                  </div>
                </div>
              )}

            </div>
          </aside>

          {/* ================= POLICY DOCUMENT BODY ================= */}
          <div className="min-w-0 max-w-3xl">
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-xs space-y-12">
              {sections.map((section, index) => {
                const slug = slugify(section.title);
                return (
                  <article
                    key={section.title}
                    id={slug}
                    className="scroll-mt-28 border-b border-slate-100 pb-10 last:border-b-0 last:pb-0"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-3.5">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-mono text-xs font-bold text-blue-700 border border-blue-100/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl leading-snug">
                          {section.title}
                        </h2>

                        {/* Optional Section Callout */}
                        {section.callout && (
                          <div className="mt-3.5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs">
                            <strong className="block font-bold text-blue-900">{section.callout.title}</strong>
                            <p className="mt-1 leading-relaxed text-blue-800">{section.callout.text}</p>
                          </div>
                        )}

                        {/* Section Paragraphs */}
                        {section.paragraphs?.map((paragraph, pIdx) => (
                          <p key={pIdx} className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-700">
                            {paragraph}
                          </p>
                        ))}

                        {/* Section Bullet Items */}
                        {section.items && (
                          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-700">
                            {section.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2.5">
                                <span className="mt-1.5 size-1.5 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Subsections */}
                        {section.subsections?.map((sub, sIdx) => (
                          <div key={sIdx} className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
                            {sub.title && (
                              <h3 className="font-heading text-sm font-bold text-slate-900 tracking-tight">
                                {sub.title}
                              </h3>
                            )}
                            {sub.paragraphs?.map((sp, spIdx) => (
                              <p key={spIdx} className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                                {sp}
                              </p>
                            ))}
                            {sub.items && (
                              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700">
                                {sub.items.map((si, siIdx) => (
                                  <li key={siIdx} className="flex items-start gap-2">
                                    <span className="mt-1.5 size-1.5 rounded-full bg-slate-400 shrink-0" aria-hidden="true" />
                                    <span className="leading-relaxed">{si}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ================= BOTTOM QUESTIONS CARD ================= */}
            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs print:hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    QUESTIONS OR COMPLIANCE
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-slate-900">
                    Need clarification on legal terms or licensing?
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Contact the operator for assistance with licensing, data privacy, or custom project terms.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href="/contact"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    <span>Contact Operator</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>
    </PublicPageShell>
  );
}
