"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
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
  const cardTLRef = useRef<HTMLDivElement>(null);
  const cardBLRef = useRef<HTMLDivElement>(null);
  const cardTRRef = useRef<HTMLDivElement>(null);
  const cardBRRef = useRef<HTMLDivElement>(null);

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
          x: x * 10,
          y: y * 10,
          rotationY: x * 3,
          rotationX: -y * 3,
          duration: 1.2,
          ease: "power2.out",
        });
      }
      if (cardTLRef.current) {
        gsap.to(cardTLRef.current, {
          x: -x * 20,
          y: -y * 15,
          duration: 1.4,
          ease: "power2.out",
        });
      }
      if (cardBLRef.current) {
        gsap.to(cardBLRef.current, {
          x: -x * 18,
          y: y * 20,
          duration: 1.5,
          ease: "power2.out",
        });
      }
      if (cardTRRef.current) {
        gsap.to(cardTRRef.current, {
          x: x * 22,
          y: -y * 18,
          duration: 1.4,
          ease: "power2.out",
        });
      }
      if (cardBRRef.current) {
        gsap.to(cardBRRef.current, {
          x: x * 20,
          y: y * 22,
          duration: 1.6,
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[400px] bg-gradient-to-r from-blue-400/20 via-indigo-400/15 to-emerald-400/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Container Stage */}
      <div className="relative flex items-center justify-center">
        {/* Sleek Laptop Showcase Frame */}
        <div
          ref={laptopRef}
          className="relative z-20 w-full max-w-[760px] md:max-w-[820px] transition-transform duration-300"
        >
          {/* Laptop Screen Bezel (Light Theme) */}
          <div className="relative rounded-[22px] sm:rounded-[26px] bg-white p-2.5 sm:p-4 shadow-[0_25px_70px_-15px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.08)] border border-[#E5E7EB]">
            {/* Top Window Control Notch Bar */}
            <div className="flex items-center justify-between pb-2.5 px-2 border-b border-slate-200/80 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90 inline-block" />
                <span className="ml-3 text-[11px] font-medium text-slate-600 hidden sm:inline">
                  websystembuilders.com/dashboard/analytics
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] bg-emerald-50 text-[#10B981] px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Live System Demo</span>
              </div>
            </div>

            {/* Dashboard Display Screen */}
            <div className="relative w-full aspect-[16/10] rounded-lg sm:rounded-xl overflow-hidden bg-white border border-[#E5E7EB] shadow-inner">
              <Image
                src="/images/dashboard-hero-light.png"
                alt="WebSystemBuilders Software System Dashboard Preview"
                fill
                sizes="(max-width: 1200px) 100vw, 820px"
                className="object-cover object-top transition-transform duration-700 hover:scale-[1.01]"
                priority
              />
            </div>
          </div>

          {/* Laptop Base Stand */}
          <div className="relative mx-auto -mt-0.5 h-3.5 sm:h-4 w-[105%] -left-[2.5%] rounded-b-xl bg-gradient-to-b from-[#e2e8f0] via-[#cbd5e1] to-[#94a3b8] shadow-[0_20px_40px_rgba(15,23,42,0.1)] border-t border-slate-300/80 flex justify-center">
            <div className="w-16 sm:w-24 h-1 bg-slate-400/50 rounded-b-md" />
          </div>
        </div>

        {/* Floating Satellite Card 1: POS & Sales (Top Left) */}
        <div
          ref={cardTLRef}
          className="absolute z-30 -top-4 -left-4 sm:top-2 sm:-left-8 md:top-4 md:-left-12 w-[220px] sm:w-[250px] rounded-[20px] bg-white p-4 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)] border border-[#E5E7EB] hover:-translate-y-1 transition-all duration-300 hidden lg:block"
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
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-[#10B981]">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Ready to Deploy
            </span>
            <span className="text-slate-400 font-normal">v4.2</span>
          </div>
        </div>

        {/* Floating Satellite Card 2: Inventory Sync (Bottom Left) */}
        <div
          ref={cardBLRef}
          className="absolute z-30 bottom-2 -left-6 sm:bottom-6 sm:-left-10 md:bottom-8 md:-left-14 w-[230px] sm:w-[260px] rounded-[20px] bg-white p-4 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)] border border-[#E5E7EB] hover:-translate-y-1 transition-all duration-300 hidden lg:block"
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
        </div>

        {/* Floating Satellite Card 3: Clinic & Healthcare (Top Right) */}
        <div
          ref={cardTRRef}
          className="absolute z-30 -top-4 -right-4 sm:top-2 sm:-right-8 md:top-4 md:-right-12 w-[220px] sm:w-[250px] rounded-[20px] bg-white p-4 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)] border border-[#E5E7EB] hover:-translate-y-1 transition-all duration-300 hidden lg:block"
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
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-medium text-slate-500">
            <span>HIPAA Compliant UI</span>
            <span className="px-2 py-0.5 bg-indigo-50 text-[#4F46E5] font-bold rounded-full text-[9px] border border-indigo-100">
              Active EMR
            </span>
          </div>
        </div>

        {/* Floating Satellite Card 4: Academic Capstone Systems (Bottom Right) */}
        <div
          ref={cardBRRef}
          className="absolute z-30 bottom-2 -right-6 sm:bottom-6 sm:-right-10 md:bottom-8 md:-right-14 w-[240px] sm:w-[270px] rounded-[20px] bg-white p-4 shadow-[0_15px_35px_-5px_rgba(15,23,42,0.12),0_0_0_1px_rgba(15,23,42,0.06)] border border-[#E5E7EB] hover:-translate-y-1 transition-all duration-300 hidden lg:block"
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
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-amber-600">
              <Sparkles className="w-3 h-3" /> Full Source Included
            </span>
            <span className="text-slate-400 font-normal">Docs + SQL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
