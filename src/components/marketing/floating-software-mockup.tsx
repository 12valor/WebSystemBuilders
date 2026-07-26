"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Boxes, Stethoscope, GraduationCap } from "lucide-react";

export function FloatingSoftwareMockup() {
  return (
    <div className="relative w-full max-w-[1280px] mx-auto py-4 sm:py-8 px-2 sm:px-4 select-none">
      {/* Background Soft Mint & Violet Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-10 left-1/12 w-[450px] h-[450px] bg-emerald-400/12 rounded-full blur-[140px]" />
        <div className="absolute -top-10 right-1/12 w-[450px] h-[450px] bg-indigo-400/12 rounded-full blur-[140px]" />
      </div>

      {/* Centerpiece Hero Product Showcase (mockup.svg) - UNCONSTRAINED FULL SIZE */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex items-center justify-center mx-auto"
      >
        <div className="w-full max-w-[1100px] xl:max-w-[1180px] mx-auto filter drop-shadow-[0_25px_50px_rgba(15,23,42,0.12)]">
          <Image
            src="/mockup.svg"
            alt="WebSystemBuilders Software Platform Showcase"
            width={1350}
            height={1080}
            priority
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 90vw, 1180px"
            className="w-full h-auto object-contain block mx-auto"
          />
        </div>
      </motion.div>

      {/* ABSOLUTE OVERLAY FLOATING CARDS WITH CURLY CONNECTOR LINES (Desktop lg+ Only) */}
      <div className="hidden lg:block absolute inset-0 z-30 pointer-events-none">
        {/* ================= CARD 1: TOP LEFT (POS & Sales) ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30, rotate: -4 }}
          animate={{ opacity: 1, x: 0, rotate: -4, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.15 },
            x: { duration: 0.6, delay: 0.15 },
            y: { repeat: Infinity, duration: 5.2, ease: "easeInOut" },
          }}
          whileHover={{ y: -6, scale: 1.03, rotate: -2 }}
          className="absolute top-[6%] left-[1%] xl:left-[-12px] w-[220px] xl:w-[240px] rounded-[22px] bg-white/95 p-4 border border-slate-200/80 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center border border-emerald-100/80 shadow-xs mb-3">
            <ShoppingCart className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">POS & Sales System</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Streamline sales, invoices, and transactions.
          </p>
        </motion.div>

        {/* Curly Connector Line 1 (Top Left) */}
        <svg className="absolute top-[18%] left-[17%] xl:left-[16%] w-24 h-16 pointer-events-none" viewBox="0 0 100 60" fill="none">
          <path d="M 10 10 Q 50 40 90 50" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="50" r="3" fill="#94A3B8" />
        </svg>

        {/* ================= CARD 2: BOTTOM LEFT (Inventory & Warehouse) ================= */}
        <motion.div
          initial={{ opacity: 0, x: -30, rotate: 3 }}
          animate={{ opacity: 1, x: 0, rotate: 3, y: [0, -7, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.25 },
            x: { duration: 0.6, delay: 0.25 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.3 },
          }}
          whileHover={{ y: -6, scale: 1.03, rotate: 1 }}
          className="absolute bottom-[16%] left-[0%] xl:left-[-16px] w-[220px] xl:w-[240px] rounded-[22px] bg-white/95 p-4 border border-slate-200/80 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100/80 shadow-xs mb-3">
            <Boxes className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Inventory & Warehouse</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Track stock, manage suppliers, and warehouses.
          </p>
        </motion.div>

        {/* Curly Connector Line 2 (Bottom Left) */}
        <svg className="absolute bottom-[24%] left-[16%] xl:left-[15%] w-24 h-16 pointer-events-none" viewBox="0 0 100 60" fill="none">
          <path d="M 10 50 Q 50 10 90 20" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="90" cy="20" r="3" fill="#94A3B8" />
        </svg>

        {/* ================= CARD 3: TOP RIGHT (Clinic & Healthcare) ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: 4, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.2 },
            x: { duration: 0.6, delay: 0.2 },
            y: { repeat: Infinity, duration: 5.4, ease: "easeInOut", delay: 0.2 },
          }}
          whileHover={{ y: -6, scale: 1.03, rotate: 2 }}
          className="absolute top-[6%] right-[1%] xl:right-[-12px] w-[220px] xl:w-[240px] rounded-[22px] bg-white/95 p-4 border border-slate-200/80 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center border border-purple-100/80 shadow-xs mb-3">
            <Stethoscope className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Clinic & Healthcare</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Manage patients, appointments, and EMR records.
          </p>
        </motion.div>

        {/* ================= CARD 4: BOTTOM RIGHT (Academic & Capstone) ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: -3, y: [0, -7, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 },
            x: { duration: 0.6, delay: 0.3 },
            y: { repeat: Infinity, duration: 6.2, ease: "easeInOut", delay: 0.5 },
          }}
          whileHover={{ y: -6, scale: 1.03, rotate: -1 }}
          className="absolute bottom-[16%] right-[0%] xl:right-[-16px] w-[220px] xl:w-[240px] rounded-[22px] bg-white/95 p-4 border border-slate-200/80 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center border border-amber-100/80 shadow-xs mb-3">
            <GraduationCap className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-snug">Academic & Capstone</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed max-w-[170px]">
            Defense-ready systems with source code & SQL.
          </p>
        </motion.div>

        {/* Curly Connector Line 4 (Bottom Right) */}
        <svg className="absolute bottom-[24%] right-[16%] xl:right-[15%] w-24 h-16 pointer-events-none" viewBox="0 0 100 60" fill="none">
          <path d="M 90 50 Q 50 10 10 20" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="10" cy="20" r="3" fill="#94A3B8" />
        </svg>
      </div>

      {/* Mobile & Tablet Responsive Feature Cards Grid (< lg screens) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-3.5"
      >
        {/* Card 1 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">POS & Sales System</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Streamline sales, invoices, and transactions.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Inventory & Warehouse</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Track stock, manage suppliers, and warehouses.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Clinic & Healthcare</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Manage patients, appointments, and EMR records.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-[18px] bg-white/95 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 border border-amber-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Academic & Capstone</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Defense-ready systems with source code & SQL.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


