"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Boxes,
  Stethoscope,
  GraduationCap,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  return (
    <div className="relative w-full max-w-7xl mx-auto py-4 sm:py-8 md:py-12 px-3 sm:px-6 select-none">
      {/* Dynamic Ambient Lighting Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1100px] h-[400px] sm:h-[480px] pointer-events-none -z-10">
        {/* Soft Ambient Blue Glow */}
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] bg-[#2563EB]/10 rounded-full blur-[140px]" />
        {/* Soft Ambient Purple Glow */}
        <div className="absolute bottom-10 right-1/4 w-[420px] h-[420px] bg-[#7C3AED]/10 rounded-full blur-[140px]" />
        {/* Soft Ground Contact Shadow */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[88%] h-10 bg-slate-950/40 rounded-full blur-xl" />
      </div>

      {/* 3-Column Layout for Desktop (lg+): Left Cards | Laptop Mockup | Right Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] xl:grid-cols-[270px_1fr_270px] gap-6 xl:gap-8 items-center">
        {/* LEFT COLUMN: Floating Satellite Cards (Desktop lg+) */}
        <div className="hidden lg:flex flex-col gap-6 justify-center z-30">
          {/* Satellite 1: POS & Sales */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.2 },
              x: { duration: 0.6, delay: 0.2 },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.03 }}
            className="w-full rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100/90 shadow-xs">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 tracking-tight">POS & Retail Sales</h4>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#059669] text-[9px] font-bold border border-emerald-100">v4.2</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Instant thermal receipting & daily sales analytics.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-[#059669]">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" /> Verified Commercial System
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </motion.div>

          {/* Satellite 2: Inventory & Stocks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.3 },
              x: { duration: 0.6, delay: 0.3 },
              y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 },
            }}
            whileHover={{ scale: 1.03 }}
            className="w-full rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100/90 shadow-xs">
                <Boxes className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">Inventory & Stocks</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Barcode scanning & multi-store sync.
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                <span>Stock Precision</span>
                <span className="text-[#2563EB]">99.9% Sync</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden p-0.5 border border-slate-200/50">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full w-[96%]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* CENTER COLUMN: Premium Clean MacBook Pro Render */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full flex flex-col items-center justify-center mx-auto"
        >
          {/* ================= LAPTOP SCREEN LID (Primary Visual Focus) ================= */}
          <div className="relative w-full rounded-t-[18px] sm:rounded-t-[22px] bg-[#161618] p-2 sm:p-2.5 border-t border-x border-slate-700/50 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden">
            {/* Top Display Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-3 sm:h-3.5 bg-[#0a0a0c] rounded-b-lg z-30 flex items-center justify-center gap-1.5 border-b border-x border-slate-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18181b] border border-slate-700/80 inline-block" />
              <span className="w-1 h-1 rounded-full bg-[#092b1a] border border-emerald-900/80 inline-block" />
            </div>

            {/* Screen Viewport (Crisp Dashboard Display) */}
            <div className="relative w-full aspect-[16/10] rounded-t-[12px] sm:rounded-t-[14px] overflow-hidden bg-black border border-slate-900 shadow-inner">
              <Image
                src="/images/dashboard-hero-light.png"
                alt="WebSystemBuilders Full Dashboard Application Showcase"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
                className="object-cover object-top"
              />

              {/* Glass Surface Reflection Sheen */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06] pointer-events-none" />
            </div>
          </div>

          {/* ================= LAPTOP CENTER HINGE ================= */}
          <div className="relative w-[82%] mx-auto h-1.5 sm:h-2 bg-gradient-to-b from-[#0a0a0c] via-[#161619] to-[#1e1e22] border-t border-slate-800/80 rounded-b-sm z-20" />

          {/* ================= FORESHORTENED LAPTOP LOWER DECK (Secondary Visual Texture) ================= */}
          <div className="relative w-full rounded-b-[18px] sm:rounded-b-[24px] bg-gradient-to-b from-[#242427] via-[#1a1a1d] to-[#121214] p-2.5 sm:p-4 border-b border-x border-slate-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5),0_15px_35px_-10px_rgba(37,99,235,0.12)]">
            {/* Metallic Top Edge Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

            {/* Compact Speaker & Soft Legend-Free Keyboard Deck */}
            <div className="flex items-stretch gap-2.5 max-w-[94%] mx-auto">
              {/* Left Speaker Grille */}
              <div className="hidden sm:block w-3 bg-[radial-gradient(#252528_1px,transparent_1px)] [background-size:3px_3px] opacity-40 rounded my-0.5" />

              {/* Understated Recessed Keyboard Bed (Blank Keycaps, Soft Low Contrast Texture) */}
              <div className="flex-1 bg-[#09090b] p-1.5 sm:p-2 rounded-lg border border-slate-800/80 shadow-[0_2px_5px_rgba(0,0,0,0.9)_inset] opacity-80 backdrop-blur-[0.5px]">
                {/* Row 1: Function Keycaps (14 blank keys) */}
                <div className="grid grid-cols-14 gap-0.5 sm:gap-1 mb-0.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={`fn-${i}`} className="bg-[#151518] rounded-[2px] h-1.5 sm:h-2 border border-white/[0.03]" />
                  ))}
                </div>

                {/* Row 2: Number Row Keycaps (13 standard keys + 1 backspace key) */}
                <div className="grid grid-cols-14 gap-0.5 sm:gap-1 mb-0.5">
                  {Array.from({ length: 13 }).map((_, i) => (
                    <div key={`r2-${i}`} className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  ))}
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                </div>

                {/* Row 3: QWERTY Row Keycaps (14 blank keys) */}
                <div className="grid grid-cols-14 gap-0.5 sm:gap-1 mb-0.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={`r3-${i}`} className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  ))}
                </div>

                {/* Row 4: ASDF Row Keycaps (14 blank keys) */}
                <div className="grid grid-cols-14 gap-0.5 sm:gap-1 mb-0.5">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <div key={`r4-${i}`} className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  ))}
                </div>

                {/* Row 5: Bottom Modifier & Spacebar Row Keycaps */}
                <div className="grid grid-cols-12 gap-0.5 sm:gap-1 items-center">
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  {/* Clean Blank Spacebar Keycap */}
                  <div className="col-span-4 bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.04]" />
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  <div className="bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                  <div className="col-span-2 bg-[#151518] rounded-[2px] h-2 sm:h-3 border border-white/[0.03]" />
                </div>
              </div>

              {/* Right Speaker Grille */}
              <div className="hidden sm:block w-3 bg-[radial-gradient(#252528_1px,transparent_1px)] [background-size:3px_3px] opacity-40 rounded my-0.5" />
            </div>

            {/* Minimal Reflective Trackpad & Front Opening Lip Notch */}
            <div className="relative mt-2 sm:mt-3 flex flex-col items-center">
              {/* Centered Minimal Trackpad */}
              <div className="w-32 sm:w-48 md:w-56 h-8 sm:h-12 bg-gradient-to-b from-[#18181c] via-[#141417] to-[#101012] rounded-lg border border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.6)_inset] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
              </div>

              {/* Front Lip Thumb Opening Notch */}
              <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-[#08080a] rounded-b-md border-t border-slate-700/60 shadow-inner mt-1 sm:mt-1.5 mx-auto" />
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Floating Satellite Cards (Desktop lg+) */}
        <div className="hidden lg:flex flex-col gap-6 justify-center z-30">
          {/* Satellite 3: Clinic & Healthcare */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.25 },
              x: { duration: 0.6, delay: 0.25 },
              y: { repeat: Infinity, duration: 5.4, ease: "easeInOut", delay: 0.2 },
            }}
            whileHover={{ scale: 1.03 }}
            className="w-full rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100/90 shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">Clinic & Medical EMR</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Patient records & appointments queue.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1 text-slate-600 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" /> HIPAA Compliant
              </span>
              <span className="px-2 py-0.5 bg-indigo-50 text-[#4F46E5] font-bold rounded-full text-[9px] border border-indigo-100">
                Active EMR
              </span>
            </div>
          </motion.div>

          {/* Satellite 4: Capstone & Academic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.35 },
              x: { duration: 0.6, delay: 0.35 },
              y: { repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 0.6 },
            }}
            whileHover={{ scale: 1.03 }}
            className="w-full rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/90 shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">Capstone & Defense Systems</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Complete source code & database schemas.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600">
              <span className="flex items-center gap-1 text-amber-600">
                <Sparkles className="w-3.5 h-3.5" /> Full Source Included
              </span>
              <span className="text-slate-400 font-normal">Docs + SQL</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile & Tablet Responsive Feature Cards Grid (< lg screens) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden"
      >
        {/* Card 1 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">POS & Retail Sales</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Receipting & daily sales analytics ready for deployment.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Inventory & Stocks</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Barcode scanning & multi-store automated stock sync.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Clinic & Healthcare</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Patient EMR records & appointment queue workflows.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Capstone & Academic</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Defense-ready packages with source code, docs & SQL.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
