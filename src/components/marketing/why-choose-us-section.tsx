"use client";

import React from "react";
import { TactileCard } from "@/components/ui/tactile-card";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import {
  ShieldCheck,
  Code2,
  Lock,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  Sparkles,
  Database,
  Terminal,
} from "lucide-react";

export function WhyChooseUsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-slate-200/80">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The WebSystemBuilders Difference</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Built for total technical confidence
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Every system is developed with modular architecture, strict authorization security, and full commercial source rights.
          </p>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: Large Span (Col 8) - Full Source Code & Commercial License */}
          <TactileCard bg="slate" className="md:col-span-8 p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <AppIconBadge icon={Code2} color="blue" size="lg" />
                <span className="text-xs font-extrabold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200">
                  Full Ownership Rights
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                100% Commercial Source Code Included
              </h3>
              <p className="mt-4 text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-xl">
                You receive the complete, uncompiled source code package. Deploy, customize, modify, and redistribute with a broad perpetual commercial license.
              </p>
            </div>

            {/* Code Snippet Box */}
            <div className="mt-8 bg-slate-900 rounded-2xl p-4 text-xs font-mono text-slate-300 border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-emerald-400 font-bold flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  npm run dev
                </span>
                <span className="text-[10px] text-slate-500">Next.js App Router + Supabase RLS</span>
              </div>
              <p className="text-slate-400">✓ Commercial non-exclusive license attached</p>
              <p className="text-slate-400">✓ Signed expiring ZIP delivery enabled</p>
            </div>
          </TactileCard>

          {/* Bento Card 2: Small Span (Col 4) - Verified Checkout */}
          <TactileCard bg="white" className="md:col-span-4 p-8 flex flex-col justify-between">
            <div>
              <AppIconBadge icon={Lock} color="emerald" size="lg" className="mb-6" />
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Encrypted & Verified Checkout
              </h3>
              <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                PayMongo integration verifying payment webhooks server-side before issuing fulfillment tokens.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>GCash • Maya • Cards</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </TactileCard>

          {/* Bento Card 3: Small Span (Col 4) - 30 Days Support */}
          <TactileCard bg="white" className="md:col-span-4 p-8 flex flex-col justify-between">
            <div>
              <AppIconBadge icon={ShieldCheck} color="rose" size="lg" className="mb-6" />
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                30 Days Defect Support
              </h3>
              <p className="mt-3 text-sm text-slate-600 font-medium leading-relaxed">
                Direct post-purchase assistance for installation setup and reproducible code defect repairs.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600">
              <span>2 Business Days SLA</span>
              <Award className="w-4 h-4" />
            </div>
          </TactileCard>

          {/* Bento Card 4: Medium Span (Col 8) - Database & Security Foundations */}
          <TactileCard bg="white" className="md:col-span-8 p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <AppIconBadge icon={Database} color="indigo" size="lg" />
                <span className="text-xs font-extrabold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Supabase PostgreSQL
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Production Database Schemas & Row Level Security
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                All ready-made systems ship with structured SQL migration files, explicit foreign keys, indexes, and battle-tested RLS policies to keep customer data isolated.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-center">
              <div>
                <div className="text-xl font-extrabold text-slate-900">UTC</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Timestamps</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-indigo-600">Minor Units</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Authoritative Money</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-emerald-600">Idempotent</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Fulfillment</div>
              </div>
            </div>
          </TactileCard>
        </div>
      </div>
    </section>
  );
}
