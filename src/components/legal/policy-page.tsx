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
      {/* ================= ON-SCREEN HERO HEADER (Hidden on Print) ================= */}
      <section className="border-b border-slate-200/80 bg-white pt-12 pb-10 sm:pt-16 sm:pb-12 lg:pt-16 lg:pb-14 print:hidden">
        <div className="mx-auto w-[min(calc(100%-32px),1180px)] md:w-[min(calc(100%-64px),1180px)]">
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12]">
              {title}
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {description}
            </p>

            {/* Document Metadata Badges & Print Action */}
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
          <div className="mt-10 border-t border-slate-100 pt-6">
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
      <section className="bg-[#FAFAFC] py-12 sm:py-16 lg:py-20 font-sans print:bg-white print:py-0 print:px-0 print:m-0 print:w-full">
        <div className="mx-auto grid w-[min(calc(100%-32px),1180px)] gap-10 md:w-[min(calc(100%-64px),1180px)] lg:grid-cols-[280px_1fr] lg:gap-14 xl:gap-16 print:block print:w-full print:max-w-none print:p-0 print:m-0">
          
          {/* ================= DESKTOP STICKY SIDEBAR (Hidden on Print) ================= */}
          <aside className="hidden lg:block print:hidden">
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
          <div className="min-w-0 max-w-3xl print:max-w-none print:w-full print:p-0 print:m-0">
            
            {/* ================= DEDICATED PRINT-ONLY FORMAL DOCUMENT HEADER ================= */}
            <div className="hidden print:block mb-8 pb-5 border-b-2 border-black">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-black">
                <span className="font-bold text-sm">WebSystemBuilders</span>
                <span>Republic of the Philippines</span>
              </div>
              <h1 className="mt-3 font-heading text-2xl font-bold tracking-tight text-black">
                {title}
              </h1>
              <div className="mt-1.5 flex items-center gap-4 text-[11px] font-mono text-black">
                <span>Last Updated: 7 August 2026</span>
                <span>•</span>
                <span>Official Legal Policy</span>
              </div>
              <p className="mt-2.5 text-xs text-black leading-relaxed italic border-l-2 border-black pl-3 py-0.5">
                {description}
              </p>
            </div>

            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-xs space-y-12 print:border-none print:shadow-none print:p-0 print:m-0 print:space-y-6 print:w-full">
              {sections.map((section, index) => {
                const slug = slugify(section.title);
                return (
                  <article
                    key={section.title}
                    id={slug}
                    className="scroll-mt-28 border-b border-slate-100 pb-10 last:border-b-0 last:pb-0 print:border-none print:pb-4 print:mb-4 print:break-inside-avoid"
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-3.5 print:gap-2">
                      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 font-mono text-xs font-bold text-blue-700 border border-blue-100/80 print:bg-transparent print:border-none print:text-black print:p-0 print:size-auto print:font-bold print:text-sm print:mr-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl leading-snug print:text-base print:font-bold print:text-black print:break-after-avoid">
                          {section.title}
                        </h2>

                        {/* Optional Section Callout */}
                        {section.callout && (
                          <div className="mt-3.5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs print:border-l-2 print:border-black print:border-t-0 print:border-r-0 print:border-b-0 print:rounded-none print:bg-transparent print:p-2 print:my-2 print:text-black">
                            <strong className="block font-bold text-blue-900 print:text-black">{section.callout.title}</strong>
                            <p className="mt-1 leading-relaxed text-blue-800 print:text-black">{section.callout.text}</p>
                          </div>
                        )}

                        {/* Section Paragraphs */}
                        {section.paragraphs?.map((paragraph, pIdx) => (
                          <p key={pIdx} className="mt-3.5 text-xs sm:text-sm leading-relaxed text-slate-700 print:text-xs print:text-black print:leading-relaxed print:mt-1.5">
                            {paragraph}
                          </p>
                        ))}

                        {/* Section Bullet Items */}
                        {section.items && (
                          <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-700 print:text-xs print:text-black print:space-y-1 print:mt-2">
                            {section.items.map((item, iIdx) => (
                              <li key={iIdx} className="flex items-start gap-2.5 print:gap-2">
                                <span className="mt-1.5 size-1.5 rounded-full bg-blue-600 shrink-0 print:bg-black print:size-1 print:mt-1.5" aria-hidden="true" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Subsections */}
                        {section.subsections?.map((sub, sIdx) => (
                          <div key={sIdx} className="mt-6 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 print:border-none print:bg-transparent print:p-0 print:mt-3 print:space-y-1">
                            {sub.title && (
                              <h3 className="font-heading text-sm font-bold text-slate-900 tracking-tight print:text-xs print:font-bold print:text-black print:break-after-avoid">
                                {sub.title}
                              </h3>
                            )}
                            {sub.paragraphs?.map((sp, spIdx) => (
                              <p key={spIdx} className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 print:text-xs print:text-black print:mt-1 print:leading-relaxed">
                                {sp}
                              </p>
                            ))}
                            {sub.items && (
                              <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-700 print:text-xs print:text-black print:space-y-0.5 print:mt-1">
                                {sub.items.map((si, siIdx) => (
                                  <li key={siIdx} className="flex items-start gap-2 print:gap-1.5">
                                    <span className="mt-1.5 size-1.5 rounded-full bg-slate-400 shrink-0 print:bg-black print:size-1 print:mt-1.5" aria-hidden="true" />
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

            {/* ================= PRINT-ONLY DOCUMENT FOOTER ================= */}
            <div className="hidden print:block mt-8 pt-4 border-t border-black text-[10px] text-black">
              <div className="flex items-center justify-between font-mono">
                <span>WebSystemBuilders — Operator: AG Evangelista</span>
                <span>evangelista.agdiaz@gmail.com</span>
              </div>
            </div>

            {/* ================= BOTTOM QUESTIONS CARD (Hidden on Print) ================= */}
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
