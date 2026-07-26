"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  Boxes,
  Stethoscope,
  ShieldCheck,
  Activity,
  Sparkles,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) / width;
      const y = (clientY - (top + height / 2)) / height;

      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          x: x * 15,
          y: y * 15,
          rotationY: x * 4,
          rotationX: -y * 4,
          duration: 1.2,
          ease: "power2.out",
        });
      }
      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          x: -x * 25,
          y: -y * 25,
          duration: 1.4,
          ease: "power2.out",
        });
      }
      if (card3Ref.current) {
        gsap.to(card3Ref.current, {
          x: x * 25,
          y: -y * 20,
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
      className="relative w-full max-w-5xl mx-auto rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-8 md:p-10 shadow-[0_30px_90px_-20px_rgba(15,23,42,0.35)] overflow-hidden perspective-[1200px]"
    >
      {/* Subtle Studio Grid Overlay & Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-blue-500/25 via-indigo-500/15 to-transparent blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center">
        {/* Main Mac Application Window Frame */}
        <div
          ref={card1Ref}
          className="relative z-20 w-full max-w-[840px] rounded-[24px] bg-slate-900 text-white p-3 sm:p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-700/80 backdrop-blur-2xl overflow-hidden"
        >
          {/* Mac Header Window Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="ml-3 text-xs font-mono text-slate-400 hidden sm:inline">
                WebSystemBuilders Enterprise POS & Inventory Suite v4.2
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live System</span>
            </div>
          </div>

          {/* Generated High Resolution Software Dashboard Screenshot */}
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
            <Image
              src="/images/dashboard-hero.png"
              alt="WebSystemBuilders Software System Dashboard"
              fill
              sizes="(max-width: 1200px) 100vw, 840px"
              className="object-cover object-top hover:scale-[1.01] transition-transform duration-500"
              priority
            />
          </div>
        </div>

        {/* Floating Satellite Card 1 (Inventory System - Top Right) */}
        <div
          ref={card2Ref}
          className="absolute z-30 top-4 right-2 md:right-6 w-60 rounded-2xl bg-slate-900/90 text-white p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-xl hidden lg:block"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">Inventory Sync</div>
              <div className="text-[10px] text-slate-400">Multi-warehouse Ready</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full w-[85%]" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Sync Speed</span>
              <span className="text-indigo-400">Instant</span>
            </div>
          </div>
        </div>

        {/* Floating Satellite Card 2 (Clinic & Healthcare - Bottom Left) */}
        <div
          ref={card3Ref}
          className="absolute z-30 bottom-4 left-2 md:left-6 w-64 rounded-2xl bg-slate-900/90 text-white p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-xl hidden lg:block"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Clinic & Health</div>
                <div className="text-[10px] text-slate-400">Patient Appointments</div>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              EMR Active
            </span>
          </div>
          <div className="text-[10px] text-slate-300 bg-slate-800/60 rounded-lg p-2 flex items-center gap-2 border border-slate-700/40">
            <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Schedule: Dr. Santos (10:30 AM)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
