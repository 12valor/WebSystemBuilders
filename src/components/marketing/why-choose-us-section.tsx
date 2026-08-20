"use client";

import { FolderCode, FileCheck, ShieldCheck, Check } from "lucide-react";

const benefits = [
  {
    icon: FolderCode,
    title: "Complete source package",
    description:
      "Receive the full codebase, database schemas, and setup documentation listed on the product page.",
    points: [
      "Unminified frontend and backend code",
      "Database schemas and SQL migrations",
      "Setup guide and environment configuration",
    ],
  },
  {
    icon: FileCheck,
    title: "Clear license terms",
    description:
      "Know the exact permitted use, modification rights, and deployment terms before committing.",
    points: [
      "Perpetual commercial or academic use rights",
      "Full authorization to modify and deploy",
      "No recurring seat or subscription fees",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Verified delivery and support",
    description:
      "Payment is validated before secure delivery, with direct technical assistance included.",
    points: [
      "Secure download access via your account",
      "30 days of setup and bug fix support",
      "Idempotent payment capture verification",
    ],
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
          <h2
            id="knowledge-receive-heading"
            className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.1]"
          >
            Know exactly what you receive.
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600">
            Every system page clearly explains what is included, how it can be used, and what support you receive before purchasing.
          </p>
        </div>

        {/* 3 Clean Benefit Cards */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <article
                key={index}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div>
                  <div
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                  >
                    <Icon className="size-5.5 stroke-[1.75]" />
                  </div>

                  <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {benefit.description}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                    {benefit.points.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs font-medium text-slate-700"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-blue-600" aria-hidden="true" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
