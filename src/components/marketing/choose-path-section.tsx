"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, Building2, ArrowRight, Check } from "lucide-react";

export function ChoosePathSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative border-y border-slate-200/80 bg-[#FAFAFC] py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Section Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-7 max-w-2xl sm:mb-8 md:mb-10 will-change-transform"
        >
          <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15]">
            Choose the system that fits your goal.
          </h2>
          <p className="mt-2.5 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
            Explore ready-made systems or request a solution designed around your academic or business needs.
          </p>
        </motion.div>

        {/* Audience Cards Grid */}
        <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 md:grid-cols-2">
          {/* Card 1: Student Systems */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
              delay: reduceMotion ? 0 : 0.1,
            }}
            className="group flex h-full flex-col justify-between rounded-2xl border border-blue-200/70 bg-[#F4F8FF] p-5 sm:p-8 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none will-change-transform"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <GraduationCap className="size-5.5 stroke-[1.75]" aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-heading text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                Systems for school projects
              </h3>
              <p className="mt-2 text-xs sm:text-base leading-relaxed text-slate-600">
                Get a clean, documented system you can understand, present, and continue improving.
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-blue-200/60 pt-4 sm:mt-6 sm:space-y-3 sm:pt-5">
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Capstone-ready full-stack systems</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Complete setup and documentation guide</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Direct help with setup and debugging</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/for-students"
                className="group/btn inline-flex min-h-[48px] h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-blue-700 motion-reduce:transition-none"
              >
                <span>Browse Student Systems</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2: Business Systems */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
              delay: reduceMotion ? 0 : 0.22,
            }}
            className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-8 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none will-change-transform"
          >
            <div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                <Building2 className="size-5.5 stroke-[1.75]" aria-hidden="true" />
              </div>

              <h3 className="mt-4 font-heading text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                Software for everyday operations
              </h3>
              <p className="mt-2 text-xs sm:text-base leading-relaxed text-slate-600">
                Choose ready-to-use tools for sales, inventory, warehouse, or clinic workflows.
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 sm:mt-6 sm:space-y-3 sm:pt-5">
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Practical systems for common business needs</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Clean setup for daily operations</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 font-medium">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <Check className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                  </span>
                  <span>Defect support and customization options</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/for-business"
                className="group/btn inline-flex min-h-[48px] h-12 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white shadow-xs transition-colors duration-200 hover:bg-slate-800 motion-reduce:transition-none"
              >
                <span>Browse Business Systems</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
