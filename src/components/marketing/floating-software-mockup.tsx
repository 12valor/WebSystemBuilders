"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  ShoppingBag,
  Boxes,
  Stethoscope,
  Cloud,
  FileCheck,
  TrendingUp,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Database,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

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
          x: x * 25,
          y: y * 25,
          rotationY: x * 8,
          rotationX: -y * 8,
          duration: 1.2,
          ease: "power2.out",
        });
      }
      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          x: -x * 35,
          y: -y * 35,
          duration: 1.5,
          ease: "power2.out",
        });
      }
      if (card3Ref.current) {
        gsap.to(card3Ref.current, {
          x: x * 40,
          y: -y * 30,
          duration: 1.8,
          ease: "power2.out",
        });
      }
      if (card4Ref.current) {
        gsap.to(card4Ref.current, {
          x: -x * 20,
          y: y * 40,
          duration: 1.4,
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
      className="relative w-full max-w-5xl mx-auto h-[480px] md:h-[580px] flex items-center justify-center perspective-[1200px]"
    >
      {/* Central Ambient Glow */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/10 blur-[90px] pointer-events-none" />

      {/* Main Mac Window (POS & Sales Management) */}
      <div
        ref={card1Ref}
        className="absolute z-20 w-[90%] max-w-[620px] rounded-[24px] bg-slate-900 text-white p-5 md:p-6 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4)] border border-slate-700/60 backdrop-blur-2xl"
      >
        {/* Mac Window Chrome */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
            <span className="ml-3 text-xs font-mono text-slate-400">
              WebSystemBuilders POS Suite v4.2
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Live
          </div>
        </div>

        {/* Dashboard Content Mockup */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Today Sales</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white">₱148,250</div>
            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <span>+18.4%</span> vs yesterday
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Active Orders</span>
              <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white">42 Queue</div>
            <div className="text-[10px] text-blue-400 font-medium flex items-center gap-1 mt-1">
              <span>Fast Sync</span> Instant
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 flex items-center justify-between mb-1">
              <span>Stock Status</span>
              <Boxes className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white">99.4%</div>
            <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1 mt-1">
              <span>Optimal</span> 1,240 items
            </div>
          </div>
        </div>

        {/* Live Transaction Mini Bar */}
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40 text-blue-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Terminal #02 Processed</div>
              <div className="text-[10px] text-slate-400">Invoice #POS-2026-9812 • Retail Checkout</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-emerald-400">₱4,500.00</div>
            <div className="text-[10px] text-slate-400">Paid • PayMongo GCash</div>
          </div>
        </div>
      </div>

      {/* Floating Card 2 (Warehouse & Inventory - Top Right) */}
      <div
        ref={card2Ref}
        className="absolute z-30 -top-4 right-2 md:right-12 w-64 rounded-2xl bg-white p-4 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.15)] border border-slate-200/80 hidden sm:block"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Inventory System</div>
            <div className="text-[10px] text-slate-500">Multi-warehouse Sync</div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full w-[78%]" />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-slate-600">
            <span>Capacity</span>
            <span className="text-indigo-600 font-bold">78% Utilized</span>
          </div>
        </div>
      </div>

      {/* Floating Card 3 (Clinic Management / Health - Bottom Left) */}
      <div
        ref={card3Ref}
        className="absolute z-30 -bottom-2 left-2 md:left-8 w-72 rounded-2xl bg-white p-4 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.15)] border border-slate-200/80 hidden sm:block"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Clinic Portal</div>
              <div className="text-[10px] text-slate-500">Patient Appointments</div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
            Active
          </span>
        </div>
        <div className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 flex items-center gap-2 border border-slate-100">
          <Activity className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span className="truncate">Next: Dr. Santos Consultation (10:30 AM)</span>
        </div>
      </div>

      {/* Floating Badge (Capstone & Thesis Ready - Top Left) */}
      <div
        ref={card4Ref}
        className="absolute z-30 top-12 left-4 md:left-16 rounded-full bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-800 hidden sm:flex"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
        <ShieldCheck className="w-4 h-4 text-blue-600" />
        <span>Capstone & Thesis Ready Systems</span>
      </div>
    </div>
  );
}
