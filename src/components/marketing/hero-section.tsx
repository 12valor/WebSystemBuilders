"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { FloatingSoftwareMockup } from "@/components/marketing/floating-software-mockup";
import { ArrowRight, Sparkles, ShieldCheck, Code2, Zap, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-16 pb-20 md:pb-28 bg-gradient-to-b from-white via-slate-50/60 to-white">
      {/* Background Soft Radial Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-blue-500/12 via-indigo-500/6 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500/8 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/8 blur-[100px] pointer-events-none -z-10" />

      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Top Eyebrow Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white shadow-lg border border-slate-800 text-xs font-bold tracking-wide">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Marketplace for Production & Capstone Ready Software</span>
          </div>
        </motion.div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]"
          >
            Handcrafted Software Systems for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Students & Businesses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto"
          >
            Explore ready-to-deploy POS, Inventory, Warehouse, and Academic Capstone systems. 
            Full source code included with commercial non-exclusive licensing and fast delivery.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/systems">
              <MagneticButton size="lg" variant="primary" className="w-full sm:w-auto">
                <span>Explore Ready Systems</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </MagneticButton>
            </Link>
            <Link href="/request-a-quote">
              <MagneticButton size="lg" variant="outline" className="w-full sm:w-auto">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Request Custom Development</span>
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Anchored Trust Pill Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xs text-xs font-bold text-slate-700"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Source Code Package Included</span>
            </div>
            <div className="hidden sm:block text-slate-300">•</div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 shrink-0" />
              <span>30 Days Defect Support</span>
            </div>
            <div className="hidden sm:block text-slate-300">•</div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-blue-600 fill-blue-600 shrink-0" />
              <span>Verified Commercial Licensing</span>
            </div>
          </motion.div>
        </div>

        {/* Studio Stage Illuminated Software Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="mt-4"
        >
          <FloatingSoftwareMockup />
        </motion.div>
      </div>
    </section>
  );
}