"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Boxes, Code2, GraduationCap, ArrowUpRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle scroll-driven differential depth
  const mockupScrollY = useTransform(scrollYProgress, [0, 1], [10, -28]);
  const cardsScrollY = useTransform(scrollYProgress, [0, 1], [16, -40]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[1240px] select-none px-2 pb-0 pt-3 sm:px-4 sm:pt-4"
    >
      {/* Centerpiece Hero Product Showcase (mockup.svg) */}
      <motion.div
        style={reduceMotion ? undefined : { y: mockupScrollY }}
        initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.45,
        }}
        className="relative z-10 mx-auto flex w-full items-center justify-center will-change-transform"
      >
        <div className="mx-auto w-full max-w-[960px] drop-shadow-[0_24px_48px_rgba(15,23,42,0.12)] xl:max-w-[1040px]">
          <Image
            src="/mockup.svg"
            alt="WebSystemBuilders Software Platform Showcase"
            width={1350}
            height={1080}
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1040px"
            className="w-full h-auto object-contain block mx-auto"
          />
        </div>
      </motion.div>

      {/* ABSOLUTE OVERLAY FLOATING CARDS (Desktop lg+ Only) */}
      <motion.div
        style={reduceMotion ? undefined : { y: cardsScrollY }}
        className="hidden lg:block absolute inset-0 z-30 pointer-events-none will-change-transform"
      >
        {/* ================= CARD 1: TOP LEFT (POS & Sales) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 24,
            delay: 0.55,
          }}
          className="pointer-events-auto group absolute left-[0.5%] top-[5%] w-[240px] -rotate-2 rounded-[22px] border border-slate-200/90 bg-white/95 p-4 shadow-[0_20px_42px_-14px_rgba(15,23,42,0.14),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_24px_50px_-12px_rgba(37,99,235,0.18)] xl:left-[-12px] xl:w-[252px]"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-blue-200/80 bg-blue-50 text-[#2563EB] shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              <ShoppingCart className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/80">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Invoicing
            </span>
          </div>

          <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug flex items-center justify-between">
            <span>POS &amp; Sales System</span>
            <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
            Streamline terminal checkout, automated invoices, and transaction logs.
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>Ready-made</span>
            <span className="font-mono text-slate-600 font-semibold">PostgreSQL</span>
          </div>
        </motion.div>

        {/* ================= CARD 2: BOTTOM LEFT (Inventory & Warehouse) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 24,
            delay: 0.65,
          }}
          className="pointer-events-auto group absolute bottom-[15%] left-0 w-[240px] rotate-2 rounded-[22px] border border-slate-200/90 bg-white/95 p-4 shadow-[0_20px_42px_-14px_rgba(15,23,42,0.14),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_24px_50px_-12px_rgba(16,185,129,0.18)] xl:left-[-12px] xl:w-[252px]"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-600 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <Boxes className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200/80">
              <Zap className="size-2.5 text-blue-600" />
              Stock Sync
            </span>
          </div>

          <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug flex items-center justify-between">
            <span>Inventory &amp; Warehouse</span>
            <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
            Track stock levels across locations, supplier manifests, and auto-reorder triggers.
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>Multi-facility</span>
            <span className="font-mono text-emerald-600 font-semibold">Realtime</span>
          </div>
        </motion.div>

        {/* ================= CARD 3: TOP RIGHT (Custom Development) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 24,
            delay: 0.58,
          }}
          className="pointer-events-auto group absolute right-[0.5%] top-[5%] w-[240px] rotate-2 rounded-[22px] border border-slate-200/90 bg-white/95 p-4 shadow-[0_20px_42px_-14px_rgba(15,23,42,0.14),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_24px_50px_-12px_rgba(99,102,241,0.18)] xl:right-[-12px] xl:w-[252px]"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-indigo-200/80 bg-indigo-50 text-indigo-600 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
              <Code2 className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-200/80">
              <CheckCircle2 className="size-2.5 text-indigo-600" />
              Reviewed Scope
            </span>
          </div>

          <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug flex items-center justify-between">
            <span>Custom Development</span>
            <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
            Tailored full-stack architecture built specifically for your business workflow.
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>Full Ownership</span>
            <span className="font-mono text-indigo-600 font-semibold">Source Code</span>
          </div>
        </motion.div>

        {/* ================= CARD 4: BOTTOM RIGHT (Academic & Capstone) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 340,
            damping: 24,
            delay: 0.68,
          }}
          className="pointer-events-auto group absolute bottom-[15%] right-0 w-[240px] -rotate-2 rounded-[22px] border border-slate-200/90 bg-white/95 p-4 shadow-[0_20px_42px_-14px_rgba(15,23,42,0.14),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_24px_50px_-12px_rgba(245,158,11,0.18)] xl:right-[-12px] xl:w-[252px]"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex size-10 items-center justify-center rounded-xl border border-amber-200/80 bg-amber-50 text-amber-700 shadow-2xs group-hover:bg-amber-600 group-hover:text-white transition-colors duration-200">
              <GraduationCap className="size-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200/80">
              <ShieldCheck className="size-2.5 text-amber-700" />
              Disclosed Scope
            </span>
          </div>

          <h4 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug flex items-center justify-between">
            <span>Academic &amp; Capstone</span>
            <ArrowUpRight className="size-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
            Ethical software foundations, complete ERD architectures, and verified prototypes.
          </p>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-400">
            <span>Documentation</span>
            <span className="font-mono text-amber-700 font-semibold">Included</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile & Tablet Responsive Feature Cards Grid (< lg screens) */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.50,
        }}
        className="mt-6 grid grid-cols-1 gap-3.5 sm:mt-8 sm:grid-cols-2 lg:hidden"
      >
        {/* Card 1 */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xs backdrop-blur-md">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#2563EB]">
            <ShoppingCart className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-slate-900">POS &amp; Sales System</h4>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Live</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Streamline sales, invoices, and transactions.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xs backdrop-blur-md">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
            <Boxes className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-slate-900">Inventory &amp; Warehouse</h4>
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Sync</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Track stock, manage suppliers, and warehouses.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xs backdrop-blur-md">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600">
            <Code2 className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-slate-900">Custom Development</h4>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">Source Code</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Requirements-reviewed software for a defined workflow.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex items-start gap-3.5 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xs backdrop-blur-md">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
            <GraduationCap className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <h4 className="text-xs font-bold text-slate-900">Academic &amp; Capstone</h4>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Disclosed</span>
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Ethical technical foundations with disclosed scope.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
