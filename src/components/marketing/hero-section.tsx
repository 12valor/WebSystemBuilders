"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingSoftwareMockup } from "@/components/marketing/floating-software-mockup";
import { ArrowRight, ShieldCheck, Zap, Star, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-20 md:pb-28 bg-[#FAFAFC]">
      {/* Quiet background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none -z-10" />

      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Eyebrow Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-slate-800 border border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.05),0_1px_1px_rgba(255,255,255,0.8)_inset] text-xs font-semibold backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Ready-made systems and custom development</span>
          </div>
        </motion.div>

        {/* Hero Headline & Supporting Description */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-[76px] xl:text-[84px] font-extrabold tracking-[-0.035em] text-[#0F172A] leading-[1.04]"
          >
            Handcrafted Software Systems for{" "}
            <span className="text-[#2563EB]">
              Students & Businesses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-[720px] mx-auto"
          >
            Compare administrator-published systems for POS, inventory, warehouse, and approved academic use, or request clearly scoped custom development.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              href="/systems"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-full bg-[#2563EB] shadow-[0_10px_25px_-8px_rgba(37,99,235,0.32)] hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              <span>Explore Ready Systems</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/request-a-quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#0F172A] rounded-full bg-white/90 border border-[#E5E7EB] shadow-[0_4px_14px_rgba(15,23,42,0.04)] hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Request Custom Development</span>
            </Link>
          </motion.div>

          {/* Trust Badges Pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-2.5 rounded-full bg-white/80 border border-[#E5E7EB] shadow-[0_4px_16px_rgba(15,23,42,0.03)] text-xs font-semibold text-[#64748B] backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Full Source Code Included</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>30 Days Defect Support</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#2563EB] fill-[#2563EB] shrink-0" />
              <span>Verified Commercial License</span>
            </div>
          </motion.div>
        </div>

        {/* Product Showcase & Floating Cards */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
          className="mt-6 md:mt-10"
        >
          <FloatingSoftwareMockup />
        </motion.div>
      </div>
    </section>
  );
}
