"use client";

import Link from "next/link";
import { TactileCard } from "@/components/ui/tactile-card";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle2,
  Code,
  Sparkles,
  BookOpen,
  Boxes,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function ChoosePathSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50/70 relative overflow-hidden border-y border-slate-200/60">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tailored Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Designed specifically for your objective
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Whether you need an academic capstone technical foundation or a production-ready enterprise management system.
          </p>
        </div>

        {/* Asymmetric Audience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: For Students */}
          <TactileCard bg="white" className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <AppIconBadge icon={GraduationCap} color="blue" size="lg" />
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Ethical Technical Support
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                For College & High School Students
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Get robust capstone and thesis system templates, clean source code, complete documentation guidance, and mentoring to ace your defense.
              </p>

              {/* Feature Points */}
              <div className="mt-8 space-y-3.5">
                {[
                  "Capstone & thesis ready full-stack web systems",
                  "Complete database schemas & step-by-step setup guides",
                  "Technical mentoring, debugging & deployment aid",
                  "Clean modular codebase designed for defense presentation",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Explore student categories & templates
              </span>
              <Link href="/for-students">
                <MagneticButton size="md" variant="primary">
                  <span>Browse Student Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </Link>
            </div>
          </TactileCard>

          {/* Card 2: For Business Owners */}
          <TactileCard bg="white" className="p-8 md:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <AppIconBadge icon={Building2} color="indigo" size="lg" />
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Production Ready Systems
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                For Small & Medium Businesses
              </h3>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Deploy high-performance Point-of-Sale, Inventory Management, Warehouse tracking, and Clinic operations systems built to scale.
              </p>

              {/* Feature Points */}
              <div className="mt-8 space-y-3.5">
                {[
                  "Ready-to-use Point-of-Sale (POS) & Inventory control",
                  "Warehouse management & barcode tracking workflows",
                  "Perpetual commercial non-exclusive source code license",
                  "30 days defect support & full customization assistance",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Explore business management software
              </span>
              <Link href="/for-business">
                <MagneticButton size="md" variant="indigo">
                  <span>Browse Business Systems</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </Link>
            </div>
          </TactileCard>
        </div>
      </div>
    </section>
  );
}
