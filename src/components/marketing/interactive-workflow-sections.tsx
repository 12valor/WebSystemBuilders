"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  FileText,
  ShieldCheck,
  Layers,
  MessageSquare,
  BarChart2,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { PreSaleChatModal } from "@/components/marketing/pre-sale-chat-modal";

export function BusinessWorkflowPlayground() {
  return null;
}

export function ProjectWorkspacePlayground() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <section
      aria-labelledby="project-workspace-title"
      className="relative border-y border-slate-200/80 bg-[#FAFBFC] py-20 lg:py-24 font-sans text-slate-900 overflow-hidden"
    >
      <PreSaleChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.27fr_1fr] gap-12 lg:gap-16 items-center">
          
          {/* ================= LEFT-SIDE PROJECT WORKSPACE ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-2 lg:order-1 rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xs"
          >
            {/* WORKSPACE HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <BrandLogo className="size-6" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Inventory Management System
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      In development
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    3 of 5 stages completed
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 bg-slate-100/80 px-2 py-1 rounded">
                EXAMPLE PROJECT
              </span>
            </div>

            {/* WORKSPACE BODY (2 INTERNAL COLUMNS) */}
            <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
              
              {/* LEFT INTERNAL COLUMN: MILESTONE TIMELINE */}
              <div className="relative pl-1">
                {/* Vertical Connector Line */}
                <motion.div
                  variants={lineVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-slate-200 origin-top"
                />

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-4 relative z-10"
                >
                  {/* Milestone 1 */}
                  <motion.div variants={itemVariants} className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-white border border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <CheckCircle2 className="size-4 text-emerald-600 stroke-[2.25]" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">1. Requirements</p>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/70 mt-0.5">
                        Completed
                      </span>
                    </div>
                  </motion.div>

                  {/* Milestone 2 */}
                  <motion.div variants={itemVariants} className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-white border border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <CheckCircle2 className="size-4 text-emerald-600 stroke-[2.25]" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">2. Project plan</p>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100/70 mt-0.5">
                        Completed
                      </span>
                    </div>
                  </motion.div>

                  {/* Milestone 3 */}
                  <motion.div variants={itemVariants} className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-white border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <AlertCircle className="size-4 text-amber-600 stroke-[2.25]" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">3. Prototype</p>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100/70 mt-0.5">
                        Ready for review
                      </span>
                    </div>
                  </motion.div>

                  {/* Milestone 4 */}
                  <motion.div variants={itemVariants} className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-white border border-blue-500/40 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Loader2 className="size-4 text-blue-600 animate-spin" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">4. Development</p>
                      </div>
                      <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100/70 mt-0.5">
                        In progress
                      </span>
                    </div>
                  </motion.div>

                  {/* Milestone 5 */}
                  <motion.div variants={itemVariants} className="flex items-start gap-3">
                    <div className="size-7 rounded-full bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center shrink-0">
                      <Clock className="size-3.5 text-slate-400 stroke-[2]" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-medium text-slate-600">5. Final handoff</p>
                      </div>
                      <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60 mt-0.5">
                        Upcoming
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* RIGHT INTERNAL COLUMN: BLUEPRINT WIREFRAME PREVIEW */}
              <div className="hidden sm:block rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 relative overflow-hidden">
                {/* Blueprint grid background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(#94a3b8 0.75px, transparent 0.75px)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <div className="h-2.5 w-20 bg-slate-300 rounded" />
                    <div className="h-2.5 w-10 bg-slate-200 rounded" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-white border border-slate-200/80 p-2 space-y-1.5">
                      <div className="h-2 w-12 bg-slate-200 rounded" />
                      <div className="h-4 w-16 bg-blue-500/20 rounded" />
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200/80 p-2 space-y-1.5">
                      <div className="h-2 w-10 bg-slate-200 rounded" />
                      <div className="h-4 w-14 bg-emerald-500/20 rounded" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200/80 p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-2 w-16 bg-slate-300 rounded" />
                      <BarChart2 className="size-3 text-slate-300" />
                    </div>
                    <div className="flex items-end gap-1.5 h-10 pt-2 border-b border-slate-100">
                      <div className="w-1/4 h-[40%] bg-blue-200 rounded-t" />
                      <div className="w-1/4 h-[70%] bg-blue-500 rounded-t" />
                      <div className="w-1/4 h-[50%] bg-blue-300 rounded-t" />
                      <div className="w-1/4 h-[90%] bg-blue-600 rounded-t" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* WORKSPACE FOOTER */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-3.5 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900 shrink-0">Latest update:</span>
                <span className="text-slate-600 truncate">
                  The inventory module is ready for review.
                </span>
              </div>
              <a
                href="#process"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-0.5 shrink-0"
              >
                View deliverable →
              </a>
            </div>
          </motion.div>

          {/* ================= RIGHT-SIDE CONTENT ================= */}
          <div className="order-1 lg:order-2">
            {/* Plain Eyebrow */}
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
              PROJECT SUPPORT
            </span>

            {/* Headline with restrained SVG underline */}
            <h2
              id="project-workspace-title"
              className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12]"
            >
              Know{" "}
              <span className="relative inline-block whitespace-nowrap">
                exactly where
                <svg
                  className="absolute left-0 -bottom-1.5 w-full h-2.5 text-blue-600 overflow-visible"
                  viewBox="0 0 100 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9C25 4 65 3 98 8"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              your project stands.
            </h2>

            {/* Controlled Paragraph */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Follow every requirement, milestone, and revision in one organized view—from planning to final handoff.
            </p>

            {/* PROCESS BENEFITS (3 EDITORIAL ROWS) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 space-y-4"
            >
              {/* Row 01 */}
              <motion.div variants={itemVariants} className="pb-4 border-b border-slate-200/70 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-blue-600 pt-0.5">01</span>
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <ShieldCheck className="size-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Agreed scope</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                    Everyone stays aligned on what’s included and what’s not.
                  </p>
                </div>
              </motion.div>

              {/* Row 02 */}
              <motion.div variants={itemVariants} className="pb-4 border-b border-slate-200/70 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-blue-600 pt-0.5">02</span>
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <Layers className="size-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Visible milestones</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                    Track progress at each stage and know what comes next.
                  </p>
                </div>
              </motion.div>

              {/* Row 03 */}
              <motion.div variants={itemVariants} className="pb-4 border-b border-slate-200/70 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-blue-600 pt-0.5">03</span>
                <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                  <MessageSquare className="size-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Organized feedback</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                    Keep revision notes connected to the correct deliverable.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* CTA & DIRECT DEVELOPER LINK */}
            <div className="mt-8 pt-2 space-y-4">
              <div className="flex sm:inline-flex">
                <Link
                  href="/for-students"
                  className="pushable w-full sm:w-auto"
                >
                  <span className="shadow" />
                  <span className="edge" />
                  <span className="front">
                    <span>See how project support works</span>
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Questions before starting?{" "}
                <button
                  type="button"
                  onClick={() => setIsChatOpen(true)}
                  className="text-slate-900 font-semibold underline underline-offset-4 hover:text-blue-600 transition-colors"
                >
                  Talk directly with the developer.
                </button>
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}