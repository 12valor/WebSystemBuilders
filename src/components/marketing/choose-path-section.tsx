import Link from "next/link";
import { GraduationCap, Building2, ArrowRight, Check } from "lucide-react";

export function ChoosePathSection() {
  return (
    <section className="relative border-y border-[#E5E7EB] bg-[#FAFAFC] py-14 sm:py-16 md:py-20">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Compact, Left-Aligned Section Header */}
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#2563EB]">
            FOR STUDENTS &amp; BUSINESSES
          </p>
          <h2 className="mt-2 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.035em] text-[#0F172A]">
            Choose the system that fits your goal.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#64748B] font-normal leading-relaxed">
            Explore ready-made systems or request a solution designed around your academic or business needs.
          </p>
        </div>

        {/* Audience Cards Grid */}
        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6">
          {/* Card 1: Student Systems */}
          <div className="group flex h-full flex-col justify-between rounded-[20px] border border-[#DBEAFE] bg-[#F4F8FF] p-6 shadow-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_14px_30px_-22px_rgba(37,99,235,0.28)] motion-reduce:transform-none motion-reduce:transition-none sm:p-7">
            <div>
              {/* Header row: Audience Label & Icon */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#2563EB]">
                  STUDENTS
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl border border-blue-200/70 bg-blue-100/80 text-[#2563EB] transition-colors duration-200 group-hover:bg-blue-200/80 motion-reduce:transition-none">
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
              <ul className="mt-5 space-y-2.5">
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
            <div className="mt-7 pt-1">
              <Link
                href="/for-students"
                className="group/btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(37,99,235,0.5)] transition-colors duration-200 hover:bg-blue-700 motion-reduce:transition-none"
              >
                <span>Browse Student Systems</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Card 2: Business Systems */}
          <div className="group flex h-full flex-col justify-between rounded-[20px] border border-[#D7DEE8] bg-white p-6 shadow-none transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[#B8C3D1] hover:shadow-[0_14px_30px_-22px_rgba(15,23,42,0.25)] motion-reduce:transform-none motion-reduce:transition-none sm:p-7">
            <div>
              {/* Header row: Audience Label & Icon */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700">
                  BUSINESSES
                </span>
                <div className="flex size-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-slate-800 transition-colors duration-200 group-hover:bg-slate-200 motion-reduce:transition-none">
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
              <ul className="mt-5 space-y-2.5">
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
            <div className="mt-7 pt-1">
              <Link
                href="/for-business"
                className="group/btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-slate-800 motion-reduce:transition-none"
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
