"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Code2, ShieldCheck, Zap, Lock, FileCheck } from "lucide-react";

export function FinalCallToAction() {
  return (
    <section id="contact" className="bg-[#FAFAFC] py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="relative overflow-hidden rounded-[28px] border border-blue-400/20 bg-gradient-to-br from-[#1E40AF] via-[#1E1B4B] to-[#0F172A] p-8 sm:p-14 lg:p-16 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.25)] text-white">
          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 size-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Get Started Today</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white leading-[1.08]">
                Ready to deploy your next software system?
              </h2>

              <p className="text-base sm:text-lg text-blue-100 font-normal leading-relaxed max-w-xl">
                Explore our catalog of production-ready software packages or request a custom-built technical solution tailored for your school or business.
              </p>

              {/* Inclusions Badges */}
              <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold text-blue-100">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Full Commercial Source ZIP</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-xs">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>30 Days Setup & Defect Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 shadow-xs">
                  <Lock className="w-4 h-4 text-blue-300" />
                  <span>Payment Review Required</span>
                </div>
              </div>
            </div>

            {/* Right Card & Action Buttons Container */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
              {/* Mini Glass Card Blueprint Preview */}
              <div className="rounded-2xl bg-[#0F172A]/90 backdrop-blur-xl p-5 border border-white/15 shadow-2xl text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                  <span className="font-mono text-slate-300 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#10B981]" />
                    WebSystemBuilders Delivery Blueprint
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold text-[10px] border border-emerald-500/30">
                    Verified Delivery
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Source Package:</span>
                    <span className="font-semibold text-white">Full Source Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Commercial Rights:</span>
                    <span className="font-semibold text-white">Perpetual License</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="font-semibold text-white">Supabase PostgreSQL</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  href="/systems"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#0F172A] bg-white rounded-full shadow-md hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 group"
                >
                  <span>Browse Systems</span>
                  <ArrowRight className="w-4 h-4 text-[#2563EB] transition-transform duration-200 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/request-a-quote"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all duration-200"
                >
                  <Code2 className="w-4 h-4 text-blue-200" />
                  <span>Custom Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
