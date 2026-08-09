"use client";

import Link from "next/link";
import { GraduationCap, Building2, ArrowRight, Check } from "lucide-react";

export function ChoosePathSection() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#FAFAFC] relative border-y border-[#E5E7EB]">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Compact, Left-Aligned Section Header */}
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#2563EB]">
            FOR STUDENTS &amp; BUSINESSES
          </p>
          <h2 className="mt-2 font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] tracking-[-0.025em] leading-tight">
            Choose the system that fits your goal.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B] font-normal leading-relaxed">
            Explore ready-made systems or request a solution designed around your academic or business needs.
          </p>
        </div>

        {/* Audience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Card 1: Student Systems */}
          <div className="group flex flex-col justify-between rounded-[22px] bg-[#F4F8FF] p-6 sm:p-8 border border-[#DBEAFE] shadow-none hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.06)] hover:border-[#BFDBFE] hover:-translate-y-1 transition-all duration-200 motion-reduce:transform-none h-full">
            <div>
              {/* Header row: Audience Label & Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#2563EB]">
                  STUDENTS
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100/80 text-[#2563EB] group-hover:bg-blue-200/80 transition-colors duration-200">
                  <GraduationCap className="size-5 stroke-[1.75]" aria-hidden="true" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Systems for school projects
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] font-normal">
                Get a clean, documented system you can understand, present, and continue improving.
              </p>

              {/* 3 Benefits */}
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-[#0F172A] font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Capstone-ready full-stack systems</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#0F172A] font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Complete setup and documentation guide</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#0F172A] font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#2563EB]">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Direct help with setup and debugging</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-2">
              <Link
                href="/for-students"
                className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-full bg-[#2563EB] shadow-[0_10px_25px_-8px_rgba(37,99,235,0.32)] hover:bg-blue-700 active:translate-y-0 transition-all duration-200 group/btn"
              >
                <span>Browse Student Systems</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Card 2: Business Systems */}
          <div className="group flex flex-col justify-between rounded-[22px] bg-[#F3F8F8] p-6 sm:p-8 border border-[#E2E8F0] shadow-none hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.06)] hover:border-[#CBD5E1] hover:-translate-y-1 transition-all duration-200 motion-reduce:transform-none h-full">
            <div>
              {/* Header row: Audience Label & Icon */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">
                  BUSINESSES
                </span>
                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-200/80 text-slate-700 group-hover:bg-slate-300/80 transition-colors duration-200">
                  <Building2 className="size-5 stroke-[1.75]" aria-hidden="true" />
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                Software for everyday operations
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#64748B] font-normal">
                Choose ready-to-use tools for sales, inventory, warehouse, or clinic workflows.
              </p>

              {/* 3 Benefits */}
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-[#0F172A] font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-700">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Practical systems for common business needs</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#0F172A] font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-700">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Clean setup for daily operations</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[#0F172A] font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-slate-700">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Defect support and customization options</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <div className="mt-8 pt-2">
              <Link
                href="/for-business"
                className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-full bg-[#2563EB] shadow-[0_10px_25px_-8px_rgba(37,99,235,0.32)] hover:bg-blue-700 active:translate-y-0 transition-all duration-200 group/btn"
              >
                <span>Browse Business Systems</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
