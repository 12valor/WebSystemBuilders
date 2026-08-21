"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ShoppingCart, Boxes, Code2, GraduationCap } from "lucide-react";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Subtle scroll-driven differential depth
  const mockupScrollY = useTransform(scrollYProgress, [0, 1], [12, -32]);
  const cardsScrollY = useTransform(scrollYProgress, [0, 1], [18, -44]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-[1180px] select-none px-2 pb-0 pt-3 sm:px-4 sm:pt-4"
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
        <div className="mx-auto w-full max-w-[960px] drop-shadow-[0_22px_42px_rgba(15,23,42,0.1)] xl:max-w-[1040px]">
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

      {/* ABSOLUTE OVERLAY FLOATING CARDS WITH CURLY CONNECTOR LINES (Desktop lg+ Only) */}
      <motion.div
        style={reduceMotion ? undefined : { y: cardsScrollY }}
        className="hidden lg:block absolute inset-0 z-30 pointer-events-none will-change-transform"
      >
        {/* ================= CARD 1: TOP LEFT (POS & Sales) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16, x: -8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.55,
          }}
          className="pointer-events-auto absolute left-[1%] top-[6%] w-[210px] -rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:left-[-8px] xl:w-[224px]"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <ShoppingCart className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">POS &amp; Sales System</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Streamline sales, invoices, and transactions.
          </p>
        </motion.div>

        {/* Curly Connector Line 1 (Top Left) */}
        <motion.svg
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.60,
          }}
          className="absolute top-[18%] left-[17%] xl:left-[16%] w-24 h-16 pointer-events-none"
          viewBox="0 0 100 60"
          fill="none"
        >
          <path d="M 10 10 Q 50 40 90 50" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="50" r="3" fill="#94A3B8" />
        </motion.svg>

        {/* ================= CARD 2: BOTTOM LEFT (Inventory & Warehouse) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16, x: -8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.65,
          }}
          className="pointer-events-auto absolute bottom-[16%] left-0 w-[210px] rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:left-[-8px] xl:w-[224px]"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <Boxes className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Inventory &amp; Warehouse</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Track stock, manage suppliers, and warehouses.
          </p>
        </motion.div>

        {/* Curly Connector Line 2 (Bottom Left) */}
        <motion.svg
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.68,
          }}
          className="absolute bottom-[24%] left-[16%] xl:left-[15%] w-24 h-16 pointer-events-none"
          viewBox="0 0 100 60"
          fill="none"
        >
          <path d="M 10 50 Q 50 10 90 20" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="20" r="3" fill="#94A3B8" />
        </motion.svg>

        {/* ================= CARD 3: TOP RIGHT (Custom Development) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16, x: 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.58,
          }}
          className="pointer-events-auto absolute right-[1%] top-[6%] w-[210px] rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:right-[-8px] xl:w-[224px]"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <Code2 className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Custom Development</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Requirements-reviewed software for a defined workflow.
          </p>
        </motion.div>

        {/* ================= CARD 4: BOTTOM RIGHT (Academic & Capstone) ================= */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16, x: 8 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.68,
          }}
          className="pointer-events-auto absolute bottom-[16%] right-0 w-[210px] -rotate-2 rounded-[20px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_36px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:rotate-0 motion-reduce:transform-none motion-reduce:transition-none xl:right-[-8px] xl:w-[224px]"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Academic &amp; Capstone</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Ethical technical foundations with disclosed scope.
          </p>
        </motion.div>

        {/* Curly Connector Line 4 (Bottom Right) */}
        <motion.svg
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.72,
          }}
          className="absolute bottom-[24%] right-[16%] xl:right-[15%] w-24 h-16 pointer-events-none"
          viewBox="0 0 100 60"
          fill="none"
        >
          <path d="M 90 50 Q 50 10 10 20" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="10" cy="20" r="3" fill="#94A3B8" />
        </motion.svg>
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
        className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 lg:hidden"
      >
        {/* Card 1 */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs backdrop-blur-md sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#2563EB]">
            <ShoppingCart className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900">POS &amp; Sales System</h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Streamline sales, invoices, and transactions.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs backdrop-blur-md sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#2563EB]">
            <Boxes className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900">Inventory &amp; Warehouse</h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Track stock, manage suppliers, and warehouses.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs backdrop-blur-md sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#2563EB]">
            <Code2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900">Custom Development</h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Requirements-reviewed software for a defined workflow.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xs backdrop-blur-md sm:p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#2563EB]">
            <GraduationCap className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900">Academic &amp; Capstone</h4>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">Ethical technical foundations with disclosed scope.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
