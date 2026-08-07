"use client";

import { FileCheck, FolderCode, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: FolderCode,
    title: "Complete source package",
    description: "Receive the system files and documentation listed on the product page.",
  },
  {
    icon: FileCheck,
    title: "Clear license terms",
    description: "Understand the permitted use, modification, and distribution before you buy.",
  },
  {
    icon: ShieldCheck,
    title: "Verified delivery and support",
    description: "Payment is reviewed before secure delivery, with the stated support included.",
  },
] as const;

export function WhyChooseUsSection() {
  return (
    <section
      aria-labelledby="knowledge-receive-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24 font-sans text-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Intro Header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
            WHAT EVERY PURCHASE MAKES CLEAR
          </p>

          <h2
            id="knowledge-receive-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-[40px] leading-tight"
          >
            Know exactly what you receive.
          </h2>

          <p className="mt-3.5 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl mx-auto">
            Every system page clearly explains what is included, how it can be used, and what support you receive before purchasing.
          </p>
        </div>

        {/* Benefits Container */}
        <div className="mt-12 sm:mt-14 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-10 lg:p-12 shadow-none">
          <div className="grid grid-cols-1 divide-y divide-slate-200/80 md:grid-cols-3 md:divide-y-0 md:divide-x">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-start text-left py-7 first:pt-0 last:pb-0 md:items-center md:text-center md:py-0 md:px-6 lg:px-8"
                >
                  <div
                    aria-hidden="true"
                    className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EBF3FF] text-blue-600 md:mx-auto"
                  >
                    <Icon className="size-7 stroke-[1.75]" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-600 max-w-xs md:mx-auto">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
