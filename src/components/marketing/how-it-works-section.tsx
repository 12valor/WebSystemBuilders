"use client";

import React from "react";
import { TactileCard } from "@/components/ui/tactile-card";
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
    <section className="bg-slate-50/60 py-20 sm:py-28 relative overflow-hidden border-b border-slate-200/80">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seamless Fulfillment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How system purchasing & delivery works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            From exploration to encrypted file delivery and 30-day post-purchase support.
          </p>
        </div>

        {/* Timeline Grid with Step Indicators */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 relative">
          {steps.map((step, idx) => (
            <TactileCard key={step.num} bg="white" className="p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                    Step {step.num}
                  </span>
                  <AppIconBadge icon={step.icon} color={step.color as any} size="sm" />
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-2">{step.title}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>Phase {idx + 1}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            </TactileCard>
          ))}
        </div>
      </div>
    </section>
  );
}
