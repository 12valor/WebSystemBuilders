"use client";

import React from "react";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import {
  ShieldCheck,
  Code2,
  Lock,
  Award,
  Sparkles,
  Database,
  Terminal,
} from "lucide-react";

export function WhyChooseUsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFC] relative overflow-hidden border-b border-[#E5E7EB]">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-blue-100 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The WebSystemBuilders Difference</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-[-0.02em]">
            Built for total technical confidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] font-normal leading-relaxed max-w-[700px] mx-auto">
            Published system pages disclose their architecture, requirements, commercial rights, support coverage, and delivery terms before purchase.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: Large Span (Col 8) - Full Source Code */}
          <div className="md:col-span-8 rounded-[20px] bg-white p-8 md:p-10 flex flex-col justify-between border border-[#E5E7EB] shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <AppIconBadge icon={Code2} color="blue" size="lg" />
                <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Full Ownership Rights
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Commercial Source Code Package
              </h3>
              <p className="mt-3 text-[#64748B] font-normal text-sm sm:text-base leading-relaxed max-w-xl">
                You receive the complete, uncompiled source code package. Deploy, customize, modify, and redistribute with a broad perpetual commercial license.
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="mt-8 bg-[#0F172A] rounded-xl p-4 text-xs font-mono text-slate-300 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-emerald-400 font-semibold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  npm run dev
                </span>
                <span className="text-[10px] text-slate-400">Next.js App Router + Supabase RLS</span>
              </div>
              <p className="text-slate-300">✓ Commercial non-exclusive license attached</p>
              <p className="text-slate-300">✓ Delivery terms listed per product</p>
            </div>
          </div>

          {/* Bento Card 2: Small Span (Col 4) - Verified Checkout */}
          <div className="md:col-span-4 rounded-[20px] bg-white p-8 flex flex-col justify-between border border-[#E5E7EB] shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300">
            <div>
              <AppIconBadge icon={Lock} color="emerald" size="lg" className="mb-6" />
              <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                Payment Reviewed Before Delivery
              </h3>
              <p className="mt-3 text-sm text-[#64748B] font-normal leading-relaxed">
                GCash or QRPh references and submitted proof are reviewed before an order becomes eligible for protected delivery.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#10B981]">
              <span>GCash · QRPh</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 3: Small Span (Col 4) - 30 Days Support */}
          <div className="md:col-span-4 rounded-[20px] bg-white p-8 flex flex-col justify-between border border-[#E5E7EB] shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300">
            <div>
              <AppIconBadge icon={ShieldCheck} color="rose" size="lg" className="mb-6" />
              <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                30 Days Defect Support
              </h3>
              <p className="mt-3 text-sm text-[#64748B] font-normal leading-relaxed">
                Direct post-purchase assistance for installation setup and reproducible code defect repairs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
              <span>First-response target</span>
              <Award className="w-4 h-4" />
            </div>
          </div>

          {/* Bento Card 4: Medium Span (Col 8) - Database & Security */}
          <div className="md:col-span-8 rounded-[20px] bg-white p-8 md:p-10 flex flex-col justify-between border border-[#E5E7EB] shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <AppIconBadge icon={Database} color="indigo" size="lg" />
                <span className="text-xs font-semibold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  Product-specific details
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                Disclosed Database and Security Requirements
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#64748B] font-normal leading-relaxed">
                Each published listing identifies its technology stack, database requirements, included migrations, security boundaries, and deployment responsibilities.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-center">
              <div>
                <div className="text-xl font-bold text-[#0F172A]">UTC</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Timestamps</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#4F46E5]">Minor Units</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Authoritative Money</div>
              </div>
              <div>
                <div className="text-xl font-bold text-[#10B981]">Idempotent</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Fulfillment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
