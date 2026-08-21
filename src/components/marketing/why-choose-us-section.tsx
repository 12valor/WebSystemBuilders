"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="knowledge-receive-heading"
      className="border-b border-slate-200/80 bg-[#FAFAFC] py-12 font-sans text-slate-900 sm:py-16 lg:py-24"
    >
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Section Header */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl will-change-transform"
        >
          <h2
            id="knowledge-receive-heading"
            className="font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl leading-[1.15]"
          >
            Know exactly what you receive.
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600 sm:mt-3.5 sm:text-base md:text-lg">
            Every system page clearly explains what is included, how it can be used, and what support you receive before purchasing.
          </p>
        </motion.div>

        {/* 3 Clean Benefit Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-3 lg:mt-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.article
                key={benefit.title}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: reduceMotion ? 0 : index * 0.1,
                }}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none sm:p-7 will-change-transform"
              >
                <div>
                  <div
                    aria-hidden="true"
                    className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                  >
                    <Icon className="size-5.5 stroke-[1.75]" />
                  </div>

                  <h3 className="mt-4 font-heading text-lg font-bold tracking-tight text-slate-900 sm:mt-5 sm:text-xl">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {benefit.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 sm:mt-5 sm:pt-5">
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
