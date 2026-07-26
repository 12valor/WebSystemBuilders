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
  Command,
  Option,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  return (
    <div className="relative w-full max-w-6xl mx-auto py-6 sm:py-10 md:py-14 px-2 sm:px-6 select-none">
      {/* Dynamic Soft Ambient Lighting Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1000px] h-[380px] sm:h-[460px] pointer-events-none -z-10">
        {/* Subtle Blue Glow Underneath Chassis */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#2563EB]/10 rounded-full blur-[140px]" />
        {/* Subtle Purple Ambient Light */}
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[140px]" />
        {/* Soft Ground Contact Shadow Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] h-10 bg-slate-950/25 rounded-full blur-xl" />
      </div>

      {/* Main Showcase Stage */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Static Front-Facing MacBook Pro Mockup (75-85% Hero Width Focal Point) */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full max-w-[840px] md:max-w-[940px] xl:max-w-[1020px]"
        >
          {/* ================= FRONT-FACING MACBOOK PRO DISPLAY LID ================= */}
          <div className="relative rounded-t-[20px] sm:rounded-t-[26px] bg-[#0c0c0e] p-2 sm:p-3 border-t border-x border-slate-700/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)_inset] overflow-hidden">
            {/* Top Display Bezel Notch with Camera */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-3.5 sm:h-4 bg-[#0c0c0e] rounded-b-xl z-30 flex items-center justify-center gap-2 border-b border-x border-slate-800/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#161619] border border-slate-700/80 inline-block" />
              <span className="w-1 h-1 rounded-full bg-[#092b1a] border border-emerald-900/80 inline-block" />
            </div>

            {/* Screen Inner Bezel & Display Viewport */}
            <div className="relative w-full aspect-[16/10] rounded-t-[14px] sm:rounded-t-[18px] overflow-hidden bg-black border border-slate-900 shadow-inner">
              <Image
                src="/images/dashboard-hero-light.png"
                alt="WebSystemBuilders Full Dashboard Application Showcase"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1020px"
                className="object-cover object-top"
              />

              {/* Realistic Glass Surface Reflection Line */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06] pointer-events-none" />
              {/* Gloss Sheen Diagonal Glint */}
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* ================= MACBOOK PRO ALUMINUM HINGE ================= */}
          <div className="relative w-[85%] mx-auto h-2 sm:h-2.5 bg-gradient-to-b from-[#0a0a0c] via-[#18181a] to-[#242426] border-t border-slate-800 shadow-inner z-20" />

          {/* ================= MACBOOK PRO LOWER CHASSIS & KEYBOARD ================= */}
          <div className="relative rounded-b-[22px] sm:rounded-b-[30px] bg-gradient-to-b from-[#242426] via-[#1a1a1d] to-[#121214] p-3 sm:p-5 border-b border-x border-slate-700/70 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.35),0_15px_40px_-10px_rgba(37,99,235,0.18),0_1px_1px_rgba(255,255,255,0.15)_inset]">
            {/* Top Chassis Bevel Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />

            {/* Main Recessed Keyboard Well & Speaker Grilles */}
            <div className="flex items-stretch gap-2 sm:gap-4 max-w-[94%] mx-auto">
              {/* Left Speaker Grille */}
              <div className="hidden sm:block w-3 sm:w-4 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:3px_3px] opacity-60 rounded-md my-1" />

              {/* Recessed Keyboard Bed */}
              <div className="flex-1 bg-[#09090b] p-2 sm:p-3 rounded-xl border border-slate-800/90 shadow-[0_2px_8px_rgba(0,0,0,0.8)_inset]">
                {/* Function Key Row */}
                <div className="grid grid-cols-14 gap-1 mb-1 sm:mb-1.5 text-[8px] sm:text-[9px] text-slate-400 font-mono text-center">
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5 shadow-2xs font-semibold">esc</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F1</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F2</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F3</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F4</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F5</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F6</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F7</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F8</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F9</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F10</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F11</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/5">F12</span>
                  <span className="bg-[#18181b] rounded py-0.5 border border-white/10 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#111] border border-slate-700" />
                  </span>
                </div>

                {/* Number Row */}
                <div className="grid grid-cols-14 gap-1 mb-1 sm:mb-1.5 text-[8px] sm:text-[10px] text-slate-300 font-mono text-center">
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">~</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">1</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">2</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">3</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">4</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">5</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">6</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">7</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">8</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">9</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">0</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">-</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">+</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 text-[7px] sm:text-[8px]">delete</span>
                </div>

                {/* QWERTY Row 1 */}
                <div className="grid grid-cols-14 gap-1 mb-1 sm:mb-1.5 text-[8px] sm:text-[10px] text-slate-300 font-mono text-center">
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 text-[7px] sm:text-[8px]">tab</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">Q</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">W</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">E</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">R</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">T</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">Y</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">U</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">I</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">O</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">P</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">[</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">]</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">\</span>
                </div>

                {/* QWERTY Row 2 */}
                <div className="grid grid-cols-14 gap-1 mb-1 sm:mb-1.5 text-[8px] sm:text-[10px] text-slate-300 font-mono text-center">
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 text-[7px] sm:text-[8px]">caps</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">A</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">S</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">D</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">F</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">G</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">H</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">J</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">K</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">L</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">;</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 font-semibold">&apos;</span>
                  <span className="col-span-2 bg-[#18181b] rounded py-1 border border-white/5 text-[7px] sm:text-[8px] font-semibold">return</span>
                </div>

                {/* Bottom Modifier Row */}
                <div className="grid grid-cols-12 gap-1 text-[7px] sm:text-[9px] text-slate-400 font-mono text-center items-center">
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">fn</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5">ctrl</span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 flex items-center justify-center gap-0.5">
                    <Option className="w-2.5 h-2.5" />
                  </span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 flex items-center justify-center gap-0.5">
                    <Command className="w-2.5 h-2.5" />
                  </span>
                  <span className="col-span-4 bg-[#18181b] rounded py-1 border border-white/10 text-slate-500 shadow-2xs">
                    Spacebar
                  </span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 flex items-center justify-center gap-0.5">
                    <Command className="w-2.5 h-2.5" />
                  </span>
                  <span className="bg-[#18181b] rounded py-1 border border-white/5 flex items-center justify-center gap-0.5">
                    <Option className="w-2.5 h-2.5" />
                  </span>
                  <span className="col-span-2 bg-[#18181b] rounded py-1 border border-white/5 text-[7px] sm:text-[8px]">◀ ▲ ▶</span>
                </div>
              </div>

              {/* Right Speaker Grille */}
              <div className="hidden sm:block w-3 sm:w-4 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:3px_3px] opacity-60 rounded-md my-1" />
            </div>

            {/* Trackpad & Palm Rests Section */}
            <div className="relative mt-2.5 sm:mt-4 flex flex-col items-center">
              {/* Force Touch Trackpad */}
              <div className="w-36 sm:w-56 md:w-64 h-14 sm:h-20 bg-[#161618] rounded-xl border border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.6)_inset] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              </div>

              {/* Front Lip Thumb Notch */}
              <div className="w-16 sm:w-24 h-1.5 bg-[#09090b] rounded-b-md border-t border-slate-700/80 mt-1 shadow-inner" />
            </div>
          </div>
        </motion.div>

        {/* Floating Satellite Feature Cards — Desktop Wrapped (lg+) */}
        {/* Satellite 1: POS & Sales (Top Left) */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="hidden lg:block absolute z-30 top-2 -left-10 xl:-left-16 w-[250px] xl:w-[270px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
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

        {/* Satellite 2: Inventory Sync (Bottom Left) */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="hidden lg:block absolute z-30 bottom-16 -left-12 xl:-left-20 w-[260px] xl:w-[280px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
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

        {/* Satellite 3: Clinic & Healthcare (Top Right) */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="hidden lg:block absolute z-30 top-2 -right-10 xl:-right-16 w-[250px] xl:w-[270px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
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

        {/* Satellite 4: Academic Capstone Systems (Bottom Right) */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="hidden lg:block absolute z-30 bottom-16 -right-12 xl:-right-20 w-[260px] xl:w-[280px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300"
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
