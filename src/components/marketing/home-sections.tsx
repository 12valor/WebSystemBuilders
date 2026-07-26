"use client";

import Link from "next/link";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowRight, Sparkles, Code2, ShieldCheck, Zap } from "lucide-react";

export function FinalCallToAction() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-28 relative overflow-hidden">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="relative overflow-hidden rounded-[32px] border border-blue-500/20 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-8 sm:p-14 lg:p-20 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.35)] text-white">
          {/* Subtle Ambient Lighting Effects */}
          <div className="pointer-events-none absolute -right-20 -top-20 size-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 size-80 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/20 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Get Started Today</span>
              </div>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Ready to deploy your next software system?
              </h2>
              <p className="mt-4 text-base sm:text-lg text-blue-100 font-medium leading-relaxed">
                Explore our catalog of production-ready systems or request a custom-built technical solution tailored for your school or business.
              </p>

              {/* Inclusions */}
              <div className="mt-8 flex flex-wrap gap-4 text-xs font-bold text-blue-100">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Full Commercial Source ZIP
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <Zap className="w-4 h-4 text-amber-300" />
                  30 Days Setup & Defect Support
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center shrink-0">
              <Link href="/systems">
                <MagneticButton size="lg" variant="primary" className="bg-white text-blue-700 hover:bg-slate-100 border-none shadow-xl">
                  <span>Browse Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </Link>
              <Link href="/request-a-quote">
                <MagneticButton size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <Code2 className="w-4 h-4" />
                  <span>Request Custom Quote</span>
                </MagneticButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}