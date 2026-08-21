"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, MessageSquare, ShieldCheck, Clock } from "lucide-react";
import { PreSaleChatModal } from "@/components/marketing/pre-sale-chat-modal";

export function FinalCallToAction() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="cta-title"
      className="border-t border-slate-200/80 bg-[#FAFAFC] py-8 sm:py-10 lg:py-12"
    >
      <PreSaleChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr] items-stretch">
          
          {/* ================= LEFT CARD: MAIN SYSTEM DISCOVERY ================= */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col justify-center overflow-hidden rounded-[20px] border border-slate-800/90 bg-[#090C15] p-5 text-white shadow-md sm:rounded-[24px] sm:p-7 lg:p-8 will-change-transform"
          >
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.18fr_0.82fr] items-center gap-5 sm:gap-6">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-blue-400">
                  READY SYSTEMS &amp; CUSTOM BUILDS
                </span>
                <h2
                  id="cta-title"
                  className="mt-1.5 font-heading text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl leading-tight"
                >
                  Buy tested systems or build to your spec.
                </h2>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-300 sm:text-sm">
                  Download full source code with database schemas, or commission custom development with agreed milestones and transparent deliverable tracking.
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col gap-2.5 sm:mt-5 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href="/systems"
                    className="inline-flex min-h-[40px] h-10 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-xs font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none sm:w-auto sm:text-sm"
                  >
                    <span>Browse Systems</span>
                    <ArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
                  </Link>

                  <Link
                    href="/request-a-quote"
                    className="inline-flex min-h-[40px] h-10 w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-5 text-xs font-semibold text-slate-200 shadow-xs transition-colors duration-150 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 motion-reduce:transition-none sm:w-auto sm:text-sm"
                  >
                    <span>Request Custom Build</span>
                  </Link>
                </div>
              </div>

              {/* Seamless Phone Mockup Preview */}
              <div className="relative mx-auto w-full max-w-[280px] md:max-w-none flex items-center justify-center">
                <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl max-h-[210px] sm:max-h-[230px] flex items-center justify-center group">
                  <Image
                    src="/images/cta-phone-mockup.jpg"
                    alt="WebSystemBuilders mobile system dashboard preview"
                    width={800}
                    height={600}
                    priority
                    className="w-full h-full max-h-[210px] sm:max-h-[230px] object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none"
                  />
                  {/* Subtle inner ambient ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ================= RIGHT CARD: DIRECT DEVELOPER CONSULTATION ================= */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.12 }}
            className="relative flex flex-col justify-between rounded-[20px] border border-slate-200/90 bg-white p-5 shadow-xs sm:rounded-[24px] sm:p-6 lg:p-7 will-change-transform"
          >
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-500">
                PRE-SALE QUESTIONS
              </span>
              <h3 className="mt-1.5 font-heading text-base font-bold tracking-tight text-slate-900 sm:text-lg lg:text-xl leading-snug">
                Ask the developer directly.
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                Confirm database architecture, license terms, or custom capstone requirements before placing an order.
              </p>

              {/* Inclusions / Highlights */}
              <div className="mt-3.5 space-y-2 border-y border-slate-100 py-3 text-xs font-medium text-slate-600 sm:mt-4 sm:space-y-2.5 sm:py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 items-center justify-center rounded-md border border-slate-200/80 bg-slate-50 text-slate-700 shrink-0">
                    <MessageSquare className="size-3.5" aria-hidden="true" />
                  </div>
                  <span>Direct technical answers from the engineer</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 items-center justify-center rounded-md border border-slate-200/80 bg-slate-50 text-slate-700 shrink-0">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                  </div>
                  <span>Architecture, schema, and license clarification</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex size-6 items-center justify-center rounded-md border border-slate-200/80 bg-slate-50 text-slate-700 shrink-0">
                    <Clock className="size-3.5" aria-hidden="true" />
                  </div>
                  <span>Direct reply to your email within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2 sm:mt-5">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="inline-flex min-h-[40px] h-10 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-xs font-semibold text-white shadow-xs transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 motion-reduce:transition-none sm:text-sm"
              >
                <span>Ask a Question</span>
                <ArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
              </button>

              <p className="text-center text-xs text-slate-500">
                Need a full project quote?{" "}
                <Link
                  href="/request-a-quote"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Request a quote
                </Link>
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
