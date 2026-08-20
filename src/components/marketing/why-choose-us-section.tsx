"use client";

import {
  FolderCode,
  FileCheck,
  ShieldCheck,
  FileCode,
  Database,
  BookOpen,
  Scale,
  Headphones,
  Download,
  Check,
} from "lucide-react";

interface DeliverableItem {
  id: string;
  number: string;
  tag: string;
  title: string;
  summary: string;
  icon: typeof FolderCode;
  specs: {
    icon: typeof FileCode;
    label: string;
  }[];
  footerLabel: string;
  footerValue: string;
}

const deliverables: readonly DeliverableItem[] = [
  {
    id: "source-package",
    number: "01",
    tag: "SOURCE ARCHIVE",
    title: "Complete source package",
    summary: "Receive the production codebase, database schemas, and setup documentation listed on the product page.",
    icon: FolderCode,
    specs: [
      { icon: FileCode, label: "Full unminified frontend & backend code" },
      { icon: Database, label: "Database schemas & SQL migrations" },
      { icon: BookOpen, label: "README setup guide & environment config" },
    ],
    footerLabel: "Format",
    footerValue: "Full repository ZIP",
  },
  {
    id: "license-terms",
    number: "02",
    tag: "COMMERCIAL & ACADEMIC",
    title: "Clear license terms",
    summary: "Know the exact permitted use, modification rights, and deployment terms before committing.",
    icon: FileCheck,
    specs: [
      { icon: Scale, label: "Perpetual commercial or academic use rights" },
      { icon: Check, label: "Full authorization to modify and deploy" },
      { icon: Check, label: "Zero recurring seat or license subscription fees" },
    ],
    footerLabel: "Ownership",
    footerValue: "Perpetual license",
  },
  {
    id: "delivery-support",
    number: "03",
    tag: "VERIFIED CAPTURE",
    title: "Verified delivery & support",
    summary: "Payment is captured and validated before secure delivery, with direct technical assistance included.",
    icon: ShieldCheck,
    specs: [
      { icon: Download, label: "Secure expiring download link via account" },
      { icon: Headphones, label: "30 days of technical setup & bug assistance" },
      { icon: ShieldCheck, label: "Idempotent payment capture verification" },
    ],
    footerLabel: "Assurance",
    footerValue: "30-day support window",
  },
] as const;

export function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="knowledge-receive-heading"
      className="border-b border-slate-200/80 bg-[#FAFAFC] py-16 sm:py-20 lg:py-24 font-sans text-slate-900"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Section Header */}
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            WHAT EVERY PURCHASE MAKES CLEAR
          </p>
          <h2
            id="knowledge-receive-heading"
            className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[40px] leading-[1.12]"
          >
            Know exactly what you receive.
          </h2>
          <p className="mt-3 text-base sm:text-lg leading-relaxed text-slate-600">
            Every system page documents the exact file tree, license boundaries, and included technical support before you check out.
          </p>
        </div>

        {/* 3 Deliverable Spec Cards Grid */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {deliverables.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div>
                  {/* Card Header: Tag & Icon */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue-600">
                      {item.number} / {item.tag}
                    </span>
                    <div
                      aria-hidden="true"
                      className="flex size-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50/80 text-blue-600 transition-colors duration-200 group-hover:bg-blue-600 group-hover:text-white"
                    >
                      <Icon className="size-5 stroke-[1.75]" />
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {item.summary}
                  </p>

                  {/* Deliverable Specifications Box */}
                  <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                    <ul className="space-y-2.5">
                      {item.specs.map((spec, specIdx) => {
                        const SpecIcon = spec.icon;
                        return (
                          <li
                            key={specIdx}
                            className="flex items-start gap-2.5 text-xs font-medium text-slate-700"
                          >
                            <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                              <SpecIcon className="size-2.5 stroke-[2.5]" aria-hidden="true" />
                            </span>
                            <span className="leading-snug">{spec.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Card Footer: Metadata pill */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{item.footerLabel}</span>
                  <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.footerValue}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
