"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Boxes,
  Stethoscope,
  GraduationCap,
  Users,
  Code2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function FloatingSoftwareMockup() {
  return (
    <div className="relative w-full max-w-[1360px] mx-auto py-2 sm:py-6 px-2 sm:px-4 select-none">
      {/* Centerpiece Hero Product Mockup (mockup.svg) - UNCONSTRAINED FULL SIZE */}
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

      {/* ABSOLUTE OVERLAY SATELLITE CARDS (Desktop lg+ - Arranged like AurallQ reference showcase) */}
      <div className="hidden lg:block absolute inset-0 z-30 pointer-events-none">
        {/* --- LEFT SIDE CARDS --- */}

        {/* 1. Top Left: POS & Sales System */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.1 },
            x: { duration: 0.6, delay: 0.1 },
            y: { repeat: Infinity, duration: 5.2, ease: "easeInOut" },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute -top-[10%] left-[0%] xl:left-[-16px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100/90 shadow-xs">
              <ShoppingCart className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">POS & Sales System</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Streamline sales, invoices, and transactions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2. Upper Mid-Left: Inventory & Warehouse */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.2 },
            x: { duration: 0.6, delay: 0.2 },
            y: { repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.3 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute top-[18%] left-[-20px] xl:left-[-40px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100/90 shadow-xs">
              <Boxes className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Inventory & Warehouse</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Track stock, manage suppliers, and warehouses.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3. Lower Mid-Left: Academic Management */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 },
            x: { duration: 0.6, delay: 0.3 },
            y: { repeat: Infinity, duration: 5.6, ease: "easeInOut", delay: 0.5 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute top-[50%] left-[-24px] xl:left-[-48px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100/90 shadow-xs">
              <GraduationCap className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Academic Management</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Complete solution for schools and universities.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4. Bottom Left: Custom Development */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4 },
            x: { duration: 0.6, delay: 0.4 },
            y: { repeat: Infinity, duration: 5.8, ease: "easeInOut", delay: 0.7 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute bottom-[2%] left-[-8px] xl:left-[-20px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100/90 shadow-xs">
              <Code2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Custom Development</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Tailored systems built for your needs.
              </p>
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT SIDE CARDS --- */}

        {/* 5. Top Right: Clinic & Healthcare */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.15 },
            x: { duration: 0.6, delay: 0.15 },
            y: { repeat: Infinity, duration: 5.4, ease: "easeInOut", delay: 0.2 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute -top-[10%] right-[0%] xl:right-[-16px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-rose-100/90 shadow-xs">
              <Stethoscope className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Clinic & Healthcare</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Manage patients, appointments, and records.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 6. Upper Mid-Right: Payroll & HR */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.25 },
            x: { duration: 0.6, delay: 0.25 },
            y: { repeat: Infinity, duration: 6.1, ease: "easeInOut", delay: 0.4 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute top-[18%] right-[-20px] xl:right-[-40px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 border border-amber-100/90 shadow-xs">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Payroll & HR</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Employee management, payroll, and attendance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 7. Lower Mid-Right: Student Information System */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.35 },
            x: { duration: 0.6, delay: 0.35 },
            y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.6 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute top-[50%] right-[-24px] xl:right-[-48px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0 border border-teal-100/90 shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Student Information System</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Organize student data and records easily.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 8. Bottom Right: Capstone & Defense Ready */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0, y: [0, -7, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: 0.45 },
            x: { duration: 0.6, delay: 0.45 },
            y: { repeat: Infinity, duration: 5.9, ease: "easeInOut", delay: 0.8 },
          }}
          whileHover={{ y: -4, scale: 1.02 }}
          className="absolute bottom-[2%] right-[-8px] xl:right-[-20px] w-[230px] xl:w-[250px] rounded-[18px] bg-white/95 p-3.5 border border-slate-200/90 shadow-[0_15px_35px_-10px_rgba(15,23,42,0.1),0_1px_2px_rgba(255,255,255,0.9)_inset] backdrop-blur-md transition-all duration-300 pointer-events-auto"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100/90 shadow-xs">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 tracking-tight">Capstone & Defense Ready</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Full source code, docs & SQL included.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile & Tablet Responsive Feature Cards Grid (< lg screens) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:hidden"
      >
        {/* Card 1 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 border border-blue-100">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">POS & Sales System</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Streamline sales, invoices, and transactions.</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0 border border-emerald-100">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Inventory & Warehouse</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Track stock, manage suppliers, and warehouses.</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#E11D48] flex items-center justify-center shrink-0 border border-rose-100">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Clinic & Healthcare</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Manage patients, appointments, and records.</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0 border border-amber-100">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Payroll & HR</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Employee management, payroll, and attendance.</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-100">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Academic Management</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Complete solution for schools and universities.</p>
          </div>
        </div>

        {/* Card 6 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0D9488] flex items-center justify-center shrink-0 border border-teal-100">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Student Information</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Organize student data and records easily.</p>
          </div>
        </div>

        {/* Card 7 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#0284C7] flex items-center justify-center shrink-0 border border-sky-100">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Custom Development</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Tailored systems built for your needs.</p>
          </div>
        </div>

        {/* Card 8 */}
        <div className="rounded-[16px] bg-white/95 p-3.5 border border-slate-200/90 shadow-sm backdrop-blur-md flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Capstone & Defense Ready</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Full source code, docs & SQL included.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


