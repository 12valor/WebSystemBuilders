"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ShoppingCart,
  Boxes,
  Stethoscope,
  GraduationCap,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const laptopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) / width;
      const y = (clientY - (top + height / 2)) / height;

      if (laptopRef.current) {
        gsap.to(laptopRef.current, {
          x: x * 12,
          y: y * 12,
          rotationY: x * 4,
          rotationX: -y * 4,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-6xl mx-auto py-8 sm:py-12 md:py-16 px-2 sm:px-4 perspective-[1200px]"
    >
      {/* Background Soft Lighting Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[950px] h-[450px] bg-gradient-to-r from-blue-400/20 via-indigo-400/15 to-purple-400/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Container Stage */}
      <div className="relative flex items-center justify-center">
        {/* Sleek Layered MacBook Device Mockup Frame */}
        <div
          ref={laptopRef}
          className="relative z-20 w-full max-w-[760px] md:max-w-[830px] transition-transform duration-300"
        >
          {/* Outer Glass Highlight Line & Layered Shadow Bezel */}
          <div className="relative rounded-[26px] sm:rounded-[30px] bg-gradient-to-b from-white via-[#FAFAFC] to-[#F1F5F9] p-2.5 sm:p-4 shadow-[0_50px_120px_-20px_rgba(37,99,235,0.18),0_25px_60px_-15px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.08)] border border-slate-200/90 overflow-hidden">
            {/* Top Glass Sheen Highlight Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            {/* Top Window Notch Control Bar */}
            <div className="flex items-center justify-between pb-2.5 px-2 border-b border-slate-200/80 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
                <span className="ml-3 text-[11px] font-medium text-slate-600 hidden sm:inline">
                  websystembuilders.com/dashboard/analytics
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] bg-emerald-50 text-[#10B981] px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live System Demo</span>
              </div>
            </div>

            {/* Dashboard Display Screen Container */}
            <div className="relative w-full aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden bg-white border border-[#E5E7EB] shadow-inner">
              <Image
                src="/images/dashboard-hero-light.png"
                alt="WebSystemBuilders Software System Dashboard Preview"
                fill
                sizes="(max-width: 1200px) 100vw, 830px"
                className="object-cover object-top transition-transform duration-700 hover:scale-[1.01]"
                priority
              />
            </div>
          </div>

          {/* Laptop Aluminum Base Hinge Stand */}
          <div className="relative mx-auto -mt-0.5 h-3.5 sm:h-4 w-[105%] -left-[2.5%] rounded-b-2xl bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] shadow-[0_20px_40px_rgba(15,23,42,0.12)] border-t border-slate-300/80 flex justify-center">
            <div className="w-16 sm:w-24 h-1 bg-slate-400/50 rounded-b-md" />
          </div>
        </div>

        {/* Floating Satellite Card 1: POS & Sales (Top Left) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          whileHover={{ y: -6, scale: 1.03, rotate: 0 }}
          className="absolute z-30 -top-4 -left-4 sm:top-2 sm:-left-8 md:top-4 md:-left-12 w-[220px] sm:w-[250px] rounded-[22px] bg-white/80 p-4 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.8)_inset] rotate-[-2deg] transition-all duration-300 hidden lg:block"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-100 shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">POS & Sales System</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                Instant receipting & daily sales reports.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[10px] font-semibold text-[#10B981]">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Ready to Deploy
            </span>
            <span className="text-slate-400 font-normal">v4.2</span>
          </div>
        </motion.div>

        {/* Floating Satellite Card 2: Inventory Sync (Bottom Left) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
          whileHover={{ y: -6, scale: 1.03, rotate: 0 }}
          className="absolute z-30 bottom-2 -left-6 sm:bottom-6 sm:-left-10 md:bottom-8 md:-left-14 w-[230px] sm:w-[260px] rounded-[22px] bg-white/80 p-4 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.8)_inset] rotate-[2deg] transition-all duration-300 hidden lg:block"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100 shadow-xs">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">Inventory & Warehouse</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                Multi-location stock & barcode sync.
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] font-semibold text-slate-500">
              <span>Stock Accuracy</span>
              <span className="text-[#2563EB]">99.9%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-[#2563EB] h-full rounded-full w-[94%]" />
            </div>
          </div>
        </motion.div>

        {/* Floating Satellite Card 3: Clinic & Healthcare (Top Right) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.2 }}
          whileHover={{ y: -6, scale: 1.03, rotate: 0 }}
          className="absolute z-30 -top-4 -right-4 sm:top-2 sm:-right-8 md:top-4 md:-right-12 w-[220px] sm:w-[250px] rounded-[22px] bg-white/80 p-4 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.8)_inset] rotate-[2deg] transition-all duration-300 hidden lg:block"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100 shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">Clinic & Healthcare</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                Patient EMR & queue management.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[10px] font-medium text-slate-500">
            <span>HIPAA Compliant UI</span>
            <span className="px-2 py-0.5 bg-indigo-50 text-[#4F46E5] font-bold rounded-full text-[9px] border border-indigo-100">
              Active EMR
            </span>
          </div>
        </motion.div>

        {/* Floating Satellite Card 4: Academic Capstone Systems (Bottom Right) */}
        <motion.div
          animate={{ y: [0, -11, 0] }}
          transition={{ repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 0.7 }}
          whileHover={{ y: -6, scale: 1.03, rotate: 0 }}
          className="absolute z-30 bottom-2 -right-6 sm:bottom-6 sm:-right-10 md:bottom-8 md:-right-14 w-[240px] sm:w-[270px] rounded-[22px] bg-white/80 p-4 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.08),0_1px_2px_rgba(255,255,255,0.8)_inset] rotate-[-2deg] transition-all duration-300 hidden lg:block"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] tracking-tight">Capstone & Academic</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">
                Defense-ready full stack packages.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex items-center justify-between text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-amber-600">
              <Sparkles className="w-3 h-3" /> Full Source Included
            </span>
            <span className="text-slate-400 font-normal">Docs + SQL</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

