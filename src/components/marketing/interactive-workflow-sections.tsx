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
  FileCheck2,
  GitBranch,
  MessageSquare,
  Check,
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
            initial={false}
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
                  initial={false}
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-slate-200 origin-top"
                />

                <motion.div
                  variants={containerVariants}
                  initial={false}
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

              {/* RIGHT INTERNAL COLUMN: CONCRETE DELIVERABLE PREVIEW */}
              <div className="hidden sm:block rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="size-3.5 text-blue-600 shrink-0" />
                    <span className="font-mono text-xs font-bold text-slate-800 truncate">spec-inventory-sync.md</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    v0.3-beta
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="rounded-lg bg-white border border-slate-200/80 p-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">Deliverable Scope</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        Passed Review
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3 text-emerald-600 shrink-0" />
                        <span>Barcode scanning & live lookup</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3 text-emerald-600 shrink-0" />
                        <span>Multi-location stock sync</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="size-3 text-emerald-600 shrink-0" />
                        <span>Audit logs & printable reports</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white border border-slate-200/80 p-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Revisions tracked</span>
                      <span className="font-mono font-bold text-slate-800">2 approved</span>
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

            {/* Confident Headline without decorative doodles */}
            <h2
              id="project-workspace-title"
              className="mt-3 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.12]"
            >
              Know exactly where your project stands.
            </h2>

            {/* Controlled Paragraph */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              Follow every requirement, milestone, and revision in one organized view—from planning to final handoff.
            </p>

            {/* PROCESS BENEFITS (3 EDITORIAL ROWS) */}
            <motion.div
              variants={containerVariants}
              initial={false}
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-8 space-y-4"
            >
              {/* Row 01 */}
              <motion.div variants={itemVariants} className="group pb-4 border-b border-slate-200/70 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-600 pt-1 transition-colors">01</span>
                <div className="size-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/90 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                  <FileCheck2 className="size-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Agreed scope</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                    Everyone stays aligned on what’s included and what’s not.
                  </p>
                </div>
              </motion.div>

              {/* Row 02 */}
              <motion.div variants={itemVariants} className="group pb-4 border-b border-slate-200/70 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-600 pt-1 transition-colors">02</span>
                <div className="size-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/90 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                  <GitBranch className="size-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Visible milestones</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                    Track progress at each stage and know what comes next.
                  </p>
                </div>
              </motion.div>

              {/* Row 03 */}
              <motion.div variants={itemVariants} className="group pb-4 border-b border-slate-200/70 flex items-start gap-4">
                <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-600 pt-1 transition-colors">03</span>
                <div className="size-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/90 group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                  <MessageSquare className="size-4 stroke-[2]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Organized feedback</h4>
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
                  className="blue-button min-h-12 w-full gap-2 px-6 text-sm sm:w-auto"
                >
                  <span>See how project support works</span>
                  <ArrowRight className="size-4" />
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
