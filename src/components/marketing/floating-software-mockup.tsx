"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShoppingCart,
  Boxes,
  Stethoscope,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Lock,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for smooth 3D mouse parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, natural physics decay
  const springConfig = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3.5, -3.5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);
  const frameX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const frameY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-6xl mx-auto py-6 sm:py-10 md:py-14 px-3 sm:px-6 perspective-[1400px] select-none"
    >
      {/* Dynamic Multi-Layer Ambient Lighting Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-[960px] h-[360px] sm:h-[480px] pointer-events-none -z-10">
        {/* Soft Blue Glow */}
        <div className="absolute top-0 left-1/4 w-[380px] h-[380px] bg-[#2563EB]/15 rounded-full blur-[140px] animate-pulse duration-[4000ms]" />
        {/* Soft Purple Glow */}
        <div className="absolute bottom-0 right-1/4 w-[380px] h-[380px] bg-[#7C3AED]/15 rounded-full blur-[140px] animate-pulse duration-[5000ms]" />
        {/* Center Contact Diffusion */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Main Showcase Stage */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Handcrafted Premium Browser Mockup Window */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            x: frameX,
            y: frameY,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full max-w-[840px] md:max-w-[920px] transition-shadow duration-300"
        >
          {/* Multi-Layered Shadow & Precision Glass Border Wrapper */}
          <div className="relative rounded-[20px] sm:rounded-[24px] bg-slate-900/90 p-1.5 sm:p-2.5 shadow-[0_30px_90px_-15px_rgba(15,23,42,0.22),0_20px_50px_-10px_rgba(37,99,235,0.18),0_0_0_1px_rgba(226,232,240,0.8)] border border-slate-200/90 backdrop-blur-md overflow-hidden bg-white/95">
            {/* Top Glass Sheen Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 z-30" />

            {/* Browser Header / Toolbar */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50/90 border-b border-slate-200/80 rounded-t-[16px] sm:rounded-t-[20px] gap-2">
              {/* macOS Traffic Lights Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="group relative flex items-center justify-center w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/60 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  <span className="w-1 h-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="group relative flex items-center justify-center w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/60 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  <span className="w-1 h-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="group relative flex items-center justify-center w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/60 shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                  <span className="w-1 h-1 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Subtle Navigation Buttons (Desktop) */}
                <div className="hidden sm:flex items-center gap-1 ml-2 text-slate-400">
                  <button type="button" aria-label="Go back" className="p-1 hover:text-slate-600 rounded transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" aria-label="Go forward" className="p-1 hover:text-slate-600 rounded transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" aria-label="Reload page" className="p-1 hover:text-slate-600 rounded transition-colors">
                    <RotateCw className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Realistic Omnibox / Search & Address Bar */}
              <div className="flex-1 max-w-xs sm:max-w-md mx-auto flex items-center justify-center gap-2 px-3 py-1 sm:py-1.5 bg-white rounded-full border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_1px_rgba(255,255,255,0.8)_inset] text-[11px] sm:text-xs text-slate-600 font-medium tracking-tight">
                <Lock className="w-3 h-3 text-[#10B981] shrink-0" />
                <span className="truncate select-none">
                  <span className="text-slate-400">https://</span>
                  <span className="text-slate-800 font-semibold">websystembuilders.com</span>
                  <span className="text-slate-500">/dashboard</span>
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200/60 uppercase">
                  SSL Encrypted
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200/80 text-[10px] sm:text-xs font-semibold shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                  </span>
                  <span className="hidden xs:inline">Production Ready</span>
                </div>
              </div>
            </div>

            {/* Dashboard Screenshot Frame Viewport */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.8] rounded-b-[14px] sm:rounded-b-[18px] overflow-hidden bg-slate-900 border border-slate-200/60 shadow-inner group">
              <Image
                src="/images/dashboard-hero-light.png"
                alt="WebSystemBuilders Full Featured Software Dashboard Showcase"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 920px"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.012]"
              />

              {/* Soft Surface Glare Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

              {/* Bottom Interactive Floating Hint Pill */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 text-white text-xs font-medium backdrop-blur-md shadow-lg border border-white/10">
                  <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  <span>Interactive System Preview</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Satellite Feature Cards — Desktop Positioned (lg+) */}
        {/* Satellite 1: POS & Sales (Top Left) */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: -20 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4 },
            x: { duration: 0.6, delay: 0.4 },
            y: { repeat: Infinity, duration: 5.2, ease: "easeInOut" },
          }}
          whileHover={{ scale: 1.04, y: -6, rotate: 0 }}
          className="hidden lg:block absolute z-30 -top-2 -left-8 xl:-left-16 w-[250px] xl:w-[270px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md rotate-[-2.5deg] transition-all duration-300"
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
              <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" /> Verified Production Build
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </motion.div>

        {/* Satellite 2: Inventory Sync (Bottom Left) */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: 20 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.5 },
            x: { duration: 0.6, delay: 0.5 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 },
          }}
          whileHover={{ scale: 1.04, y: -6, rotate: 0 }}
          className="hidden lg:block absolute z-30 bottom-4 -left-10 xl:-left-20 w-[260px] xl:w-[280px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md rotate-[2deg] transition-all duration-300"
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
          initial={{ opacity: 0, x: 30, y: -20 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.45 },
            x: { duration: 0.6, delay: 0.45 },
            y: { repeat: Infinity, duration: 5.6, ease: "easeInOut", delay: 0.2 },
          }}
          whileHover={{ scale: 1.04, y: -6, rotate: 0 }}
          className="hidden lg:block absolute z-30 -top-2 -right-8 xl:-right-16 w-[250px] xl:w-[270px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md rotate-[2.5deg] transition-all duration-300"
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
          initial={{ opacity: 0, x: 30, y: 20 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -11, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.55 },
            x: { duration: 0.6, delay: 0.55 },
            y: { repeat: Infinity, duration: 6.4, ease: "easeInOut", delay: 0.7 },
          }}
          whileHover={{ scale: 1.04, y: -6, rotate: 0 }}
          className="hidden lg:block absolute z-30 bottom-4 -right-10 xl:-right-20 w-[260px] xl:w-[280px] rounded-[20px] bg-white/90 p-4 border border-slate-200/90 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md rotate-[-2deg] transition-all duration-300"
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
