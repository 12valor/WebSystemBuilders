"use client";

import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight, Sparkles, Code2, ShieldCheck, Zap, Lock, FileCheck } from "lucide-react";

export function FinalCallToAction() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="relative overflow-hidden rounded-[36px] border border-blue-400/30 bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 p-8 sm:p-14 lg:p-18 shadow-[0_30px_70px_-15px_rgba(37,99,235,0.4)] text-white">
          {/* Ambient Lighting & Grid Glow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-blue-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 size-80 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-md border border-white/20">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Get Started Today</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08]">
                Ready to deploy your next software system?
              </h2>

              <p className="text-base sm:text-lg text-blue-100 font-medium leading-relaxed max-w-xl">
                Explore our catalog of production-ready software packages or request a custom-built technical solution tailored for your school or business.
              </p>

              {/* Inclusions Badges */}
              <div className="pt-2 flex flex-wrap gap-3 text-xs font-bold text-blue-100">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Full Commercial Source ZIP</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-xs">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>30 Days Setup & Defect Support</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shadow-xs">
                  <Lock className="w-4 h-4 text-blue-300" />
                  <span>Encrypted PayMongo Checkout</span>
                </div>
              </div>
            </div>

            {/* Right Card & Action Buttons Container */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-center">
              {/* Mini Glass Card Blueprint Preview */}
              <div className="rounded-2xl bg-slate-900/80 backdrop-blur-xl p-5 border border-white/20 shadow-2xl text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
                  <span className="font-mono text-slate-300 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    WebSystemBuilders Delivery Blueprint
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold text-[10px] border border-emerald-500/30">
                    Instant Access
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link href="/systems" className="flex-1">
                  <MagneticButton size="lg" variant="white" className="w-full">
                    <span>Browse Systems</span>
                    <ArrowRight className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                  </MagneticButton>
                </Link>
                <Link href="/request-a-quote" className="flex-1">
                  <MagneticButton size="lg" variant="glass" className="w-full">
                    <Code2 className="w-4.5 h-4.5 text-blue-200 shrink-0" />
                    <span>Request Custom Quote</span>
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}