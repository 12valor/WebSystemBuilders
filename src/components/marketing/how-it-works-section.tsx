"use client";

import React from "react";
import { AppIconBadge } from "@/components/ui/app-icon-badge";
import {
  Search,
  Eye,
  CreditCard,
  Code,
  Download,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Browse Systems",
    desc: "Explore ready-made software packages or custom options for students and businesses.",
    icon: Search,
    color: "blue",
  },
  {
    num: "02",
    title: "Review Details",
    desc: "Inspect live system demos, database schemas, tech stack, and inclusions.",
    icon: Eye,
    color: "indigo",
  },
  {
    num: "03",
    title: "Secure Checkout",
    desc: "Pay securely via PayMongo (GCash, Maya, Cards) with transparent minor-unit pricing.",
    icon: CreditCard,
    color: "emerald",
  },
  {
    num: "04",
    title: "Instant Fulfillment",
    desc: "Verified webhook automatically generates your private signed download entitlement.",
    icon: Download,
    color: "amber",
  },
  {
    num: "05",
    title: "Setup & Mentoring",
    desc: "Extract source code, run migrations, and receive setup guidance for installation.",
    icon: Code,
    color: "purple",
  },
  {
    num: "06",
    title: "30-Day Support",
    desc: "Full support coverage for installation and reproducible defect fixes.",
    icon: ShieldCheck,
    color: "rose",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-[#FAFAFC] py-20 sm:py-28 relative overflow-hidden border-b border-[#E5E7EB]">
      <div className="mx-auto w-[min(calc(100%-32px),1280px)] md:w-[min(calc(100%-64px),1280px)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold uppercase tracking-wider border border-blue-100 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seamless Fulfillment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] tracking-[-0.02em]">
            How system purchasing & delivery works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B] font-normal leading-relaxed max-w-[700px] mx-auto">
            From exploration to encrypted file delivery and 30-day post-purchase support.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="rounded-[18px] bg-white p-6 flex flex-col justify-between h-full border border-[#E5E7EB] shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Step {step.num}
                  </span>
                  <AppIconBadge icon={step.icon} color={step.color as any} size="sm" />
                </div>

                <h3 className="text-base font-bold text-[#0F172A] mt-2">{step.title}</h3>
                <p className="mt-2 text-xs text-[#64748B] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                <span>Phase {idx + 1}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

