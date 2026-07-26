"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingSoftwareMockup } from "@/components/marketing/floating-software-mockup";
import { ArrowRight, ShieldCheck, Zap, Star, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-20 md:pb-28 bg-[#FAFAFC]">
      {/* Background Soft Lighting Glows & Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none -z-10" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-400/15 via-indigo-400/10 to-transparent blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-20 left-1/4 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-32 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-slate-800 border border-slate-200/90 shadow-[0_2px_10px_rgba(15,23,42,0.04)] text-xs font-semibold backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Marketplace for Ready & Custom Software Systems</span>
          </div>
        </motion.div>

        {/* Hero Headline & Description */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-[76px] xl:text-[82px] font-extrabold tracking-[-0.03em] text-[#0F172A] leading-[1.05]"
          >
            Handcrafted Software Systems for{" "}
            <span className="bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] bg-clip-text text-transparent">
              Students & Businesses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-[720px] mx-auto"
          >
            Deploy ready-made POS, Inventory, Warehouse, Clinic, and Academic Capstone systems. 
            Includes full source code, commercial license, and fast fulfillment.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/systems"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              <span>Explore Ready Systems</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/request-a-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0F172A] rounded-full bg-white border border-[#E5E7EB] shadow-[0_4px_12px_rgba(15,23,42,0.03)] hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Request Custom Development</span>
            </Link>
          </motion.div>

          {/* Trust Badges Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-2.5 rounded-full bg-white/80 border border-[#E5E7EB] shadow-[0_2px_8px_rgba(15,23,42,0.03)] text-xs font-semibold text-[#64748B] backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>Full Source Code Included</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>30 Days Defect Support</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#4F46E5] fill-[#4F46E5] shrink-0" />
              <span>Verified Commercial License</span>
            </div>
          </motion.div>
        </div>

        {/* Studio Product Showcase & Satellite Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="mt-6 md:mt-10"
        >
          <FloatingSoftwareMockup />
        </motion.div>
      </div>
    </section>
  );
}