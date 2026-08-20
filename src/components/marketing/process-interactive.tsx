"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  Lock, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  CheckCircle2
} from "lucide-react";
import { DiscoveryDiagram, CustomSprintDiagram } from "./process-diagrams";

interface StepItem {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
}

const READY_MADE_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Discover & Filter",
    subtitle: "Explore database-driven ready-made systems",
    description: "Browse published systems by audience (students vs business owners), technical stack (Next.js, Supabase, Tailwind), and pricing models.",
    details: ["Real system specifications & live previews", "Explicit scope boundaries & excluded features", "Clear license models and target use cases"],
  },
  {
    number: "02",
    title: "Evaluate Requirements",
    subtitle: "Inspect inclusions, versioning & prerequisites",
    description: "Review exact system dependencies, setup complexity, database schemas, and documentation inclusions before placing an order.",
    details: ["Full technology prerequisites disclosure", "Version history and upgrade policy", "Database schema and API setup guides included"],
  },
  {
    number: "03",
    title: "Authoritative Order & Pay",
    subtitle: "Server-calculated price & hosted checkout handoff",
    description: "The backend creates a pending order with authoritative pricing in integer PHP minor units before opening PayPal Checkout.",
    details: ["Authoritative price calculated on server", "Pending order created in PostgreSQL", "Hosted PCI-compliant checkout handoff"],
  },
  {
    number: "04",
    title: "Verified Delivery",
    subtitle: "Webhook verification & 1-hour expiring signed access",
    description: "Delivery is unlocked only after a cryptographically signed payment webhook passes server validation. Download files remain in private storage accessed via expiring tokens.",
    details: ["Webhook HMAC signature verification", "Private Supabase Storage vault isolation", "1-Hour expiring, revocable download tokens"],
  },
];

const CUSTOM_DEV_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Describe Requirements",
    subtitle: "Submit project scope, constraints & reference material",
    description: "Outline the intended users, workflows, required integrations, and timeframe. We review student academic requests against strict ethical standards.",
    details: ["Structured quote request form", "Ethical academic boundaries verification", "Technical feasibility preliminary assessment"],
  },
  {
    number: "02",
    title: "Technical Feasibility Review",
    subtitle: "Clarify dependencies, responsibilities & architecture",
    description: "We analyze technical constraints, third-party API dependencies, database design requirements, and risk factors before committing.",
    details: ["Architecture & database schema planning", "Dependency & third-party service audit", "Risk assessment and boundary definition"],
  },
  {
    number: "03",
    title: "Agree Milestone Proposal",
    subtitle: "Confirm scope, price, deliverables & delivery dates",
    description: "Receive a transparent proposal with fixed scope, clear milestone pricing, documented deliverables, and explicit exclusions before work starts.",
    details: ["Fixed-scope contract & transparent pricing", "Milestones with clear acceptance criteria", "Explicit inclusion and exclusion list"],
  },
  {
    number: "04",
    title: "Build, Review & Handoff",
    subtitle: "Modular development sprint & verified handoff",
    description: "We build against the agreed specification with progressive updates, clean code standards, comprehensive documentation, and direct code access.",
    details: ["Next.js / TypeScript clean architecture", "Complete source code & schema handoff", "Setup guide and initial post-delivery support"],
  },
];

export function ProcessPipelineSwitcher() {
  const [pipeline, setPipeline] = useState<"ready" | "custom">("ready");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = pipeline === "ready" ? READY_MADE_STEPS : CUSTOM_DEV_STEPS;
  const currentStep = steps[activeStepIndex] || steps[0];

  const handlePipelineChange = (nextPipeline: "ready" | "custom") => {
    setPipeline(nextPipeline);
    setActiveStepIndex(0);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Pipeline Mode Switcher Tabs */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-surface p-2 sm:flex-row">
        <div className="flex w-full sm:w-auto items-center gap-2">
          <button
            type="button"
            onClick={() => handlePipelineChange("ready")}
            className={`flex-1 sm:flex-initial rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pipeline === "ready"
                ? "bg-accent text-accent-contrast shadow-md"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            Ready-Made Systems Path
          </button>
          <button
            type="button"
            onClick={() => handlePipelineChange("custom")}
            className={`flex-1 sm:flex-initial rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pipeline === "custom"
                ? "bg-accent text-accent-contrast shadow-md"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            Custom Development Path
          </button>
        </div>

        <div className="hidden md:block px-3 text-xs font-mono text-text-muted">
          {pipeline === "ready" ? "Ready-made systems" : "Custom development"}
        </div>
      </div>

      {/* Blueprint SVG Diagram Banner */}
      {pipeline === "ready" ? (
        <DiscoveryDiagram activeStep={activeStepIndex} />
      ) : (
        <CustomSprintDiagram activeStep={activeStepIndex} />
      )}

      {/* Step Selector Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={step.number}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive
                  ? "border-accent bg-accent/[0.08] shadow-md shadow-accent/5"
                  : "border-white/10 bg-surface hover:border-white/20 hover:bg-surface-raised"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-xs font-bold ${isActive ? "text-accent" : "text-text-muted"}`}>
                  STAGE {step.number}
                </span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <div className="mt-4">
                <h3 className={`text-base font-semibold ${isActive ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}>
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Card */}
      <div className="rounded-xl border border-white/10 bg-surface p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3 md:max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-mono text-accent">
              <span>STEP {currentStep.number} DETAILS</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-text-primary">
              {currentStep.title}
            </h3>
            <p className="text-sm md:text-base leading-relaxed text-text-secondary">
              {currentStep.description}
            </p>
          </div>

          {/* Key Inclusions / Verification Points */}
          <div className="w-full rounded-lg border border-white/10 bg-surface-subtle p-5 md:w-80">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-muted">
              Key Checkpoints
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-text-secondary">
              {currentStep.details.map((detail, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-0.5 text-accent font-bold">✓</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Enhanced Security & Fulfillment Simulator Component
 */
export function SecurityFulfillmentSimulator() {
  const [simStep, setSimStep] = useState<1 | 2 | 3>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const triggerNextStep = (step: 1 | 2 | 3) => {
    setIsSimulating(true);
    setSimStep(step);
    setTimeout(() => setIsSimulating(false), 250);
  };

  const getPayloadText = () => {
    if (simStep === 1) {
      return JSON.stringify({
        order_id: "ord_9f83a001",
        status: "pending",
        currency: "PHP",
        amount_minor: 1490000,
        signature_verified: false,
        download_token: null
      }, null, 2);
    }
    if (simStep === 2) {
      return JSON.stringify({
        event_id: "evt_pk_88201",
        type: "payment.paid",
        signature_header: "t=1785203,v1=9a8d7c4391e...",
        hmac_verification: "VALID (MATCHES_SECRET)",
        order_status: "paid",
        fulfillment_status: "processing"
      }, null, 2);
    }
    return JSON.stringify({
      order_id: "ord_9f83a001",
      deliverable_file: "websystem_v1.0.0.zip",
      storage_bucket: "private_downloads",
      signed_url: "https://[supabase]/storage/v1/object/sign/...?token=exp_3600",
      expires_in_seconds: 3600,
      revocable: true
    }, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPayloadText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#0B0D10] p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Subtle background gradient glow behind header */}
      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Server-Side Verification Flow</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            Payment & Delivery Verification Flow
          </h3>
          <p className="mt-1.5 text-xs md:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            See how server-side PayPal capture and signed webhook reconciliation stay separate from administrator-issued private download links.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-mono text-zinc-400">
          <Lock className="h-3.5 w-3.5 text-emerald-400" />
          <span>Server-Side Isolation</span>
        </div>
      </div>

      {/* Interactive Step Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
        {/* Step 1 */}
        <button
          type="button"
          onClick={() => triggerNextStep(1)}
          className={`group relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            simStep === 1
              ? "border-accent bg-accent/15 text-white shadow-lg shadow-accent/10 border-t-2 border-t-accent"
              : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-mono text-xs font-bold ${simStep === 1 ? "text-accent" : "text-zinc-500"}`}>
              STEP 1
            </span>
            {simStep === 1 && (
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            )}
          </div>
          <span className="text-sm font-semibold text-white mt-2 block group-hover:text-accent transition-colors">
            Pending Order
          </span>
          <span className="text-xs text-zinc-400 block mt-0.5">
            Authoritative price registered
          </span>
        </button>

        {/* Step 2 */}
        <button
          type="button"
          onClick={() => triggerNextStep(2)}
          className={`group relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            simStep === 2
              ? "border-accent bg-accent/15 text-white shadow-lg shadow-accent/10 border-t-2 border-t-accent"
              : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-mono text-xs font-bold ${simStep === 2 ? "text-accent" : "text-zinc-500"}`}>
              STEP 2
            </span>
            {simStep === 2 && (
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            )}
          </div>
          <span className="text-sm font-semibold text-white mt-2 block group-hover:text-accent transition-colors">
            Webhook Signature
          </span>
          <span className="text-xs text-zinc-400 block mt-0.5">
            HMAC signature verified
          </span>
        </button>

        {/* Step 3 */}
        <button
          type="button"
          onClick={() => triggerNextStep(3)}
          className={`group relative rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            simStep === 3
              ? "border-accent bg-accent/15 text-white shadow-lg shadow-accent/10 border-t-2 border-t-accent"
              : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:bg-white/[0.05]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`font-mono text-xs font-bold ${simStep === 3 ? "text-accent" : "text-zinc-500"}`}>
              STEP 3
            </span>
            {simStep === 3 && (
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            )}
          </div>
          <span className="text-sm font-semibold text-white mt-2 block group-hover:text-accent transition-colors">
            Expiring Token Issued
          </span>
          <span className="text-xs text-zinc-400 block mt-0.5">
            1-Hour signed URL active
          </span>
        </button>
      </div>

      {/* Terminal / Code Inspector Box */}
      <div className="relative rounded-xl border border-white/15 bg-[#050608] shadow-2xl font-mono text-xs overflow-hidden">
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
            <div className="flex items-center gap-1.5 ml-3 text-zinc-400 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5 text-accent" />
              <span>server-fulfillment-verifier.ts</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Copy JSON Payload"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-zinc-400" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {isSimulating ? "VERIFYING..." : "VERIFIED_STATE"}
            </span>
          </div>
        </div>

        {/* Dynamic Code Content Panel */}
        <div className="p-5 overflow-x-auto min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={simStep}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {simStep === 1 && (
                <>
                  <div className="flex items-center gap-2 text-sky-400 font-medium">
                    <span>[INIT]</span>
                    <span>Order registration created by server checkout handler</span>
                  </div>
                  <div className="rounded-lg bg-black/60 p-4 border border-white/5 text-[11px] leading-relaxed">
                    <div><span className="text-zinc-500">01</span>  <span className="text-sky-300">&quot;order_id&quot;</span>: <span className="text-emerald-300">&quot;ord_9f83a001&quot;</span>,</div>
                    <div><span className="text-zinc-500">02</span>  <span className="text-sky-300">&quot;status&quot;</span>: <span className="text-amber-300">&quot;pending&quot;</span>,</div>
                    <div><span className="text-zinc-500">03</span>  <span className="text-sky-300">&quot;currency&quot;</span>: <span className="text-emerald-300">&quot;PHP&quot;</span>,</div>
                    <div><span className="text-zinc-500">04</span>  <span className="text-sky-300">&quot;amount_minor&quot;</span>: <span className="text-amber-300">1490000</span>, <span className="text-zinc-500">{"// ₱14,900.00 authoritative total"}</span></div>
                    <div><span className="text-zinc-500">05</span>  <span className="text-sky-300">&quot;signature_verified&quot;</span>: <span className="text-purple-400">false</span>,</div>
                    <div><span className="text-zinc-500">06</span>  <span className="text-sky-300">&quot;download_token&quot;</span>: <span className="text-zinc-500">null</span></div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-amber-200 text-xs">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Security Gate:</strong> Browser redirect return URL is untrusted and cannot unlock delivery. System waits for server-verified webhook payload.
                    </span>
                  </div>
                </>
              )}

              {simStep === 2 && (
                <>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <span>[WEBHOOK]</span>
                    <span>Received PAYMENT.CAPTURE.COMPLETED from PayPal</span>
                  </div>
                  <div className="rounded-lg bg-black/60 p-4 border border-white/5 text-[11px] leading-relaxed">
                    <div><span className="text-zinc-500">01</span>  <span className="text-sky-300">&quot;event_id&quot;</span>: <span className="text-emerald-300">&quot;evt_pk_88201&quot;</span>,</div>
                    <div><span className="text-zinc-500">02</span>  <span className="text-sky-300">&quot;type&quot;</span>: <span className="text-emerald-300">&quot;payment.paid&quot;</span>,</div>
                    <div><span className="text-zinc-500">03</span>  <span className="text-sky-300">&quot;signature_header&quot;</span>: <span className="text-emerald-300">&quot;t=1785203,v1=9a8d7c4391e...&quot;</span>,</div>
                    <div><span className="text-zinc-500">04</span>  <span className="text-sky-300">&quot;hmac_verification&quot;</span>: <span className="text-emerald-400 font-bold">&quot;VALID (MATCHES_SECRET)&quot;</span>,</div>
                    <div><span className="text-zinc-500">05</span>  <span className="text-sky-300">&quot;order_status&quot;</span>: <span className="text-emerald-300">&quot;paid&quot;</span>,</div>
                    <div><span className="text-zinc-500">06</span>  <span className="text-sky-300">&quot;fulfillment_status&quot;</span>: <span className="text-emerald-300">&quot;processing&quot;</span></div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-200 text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Signature Verified:</strong> HMAC key confirmed. Order idempotently updated to PAID. Fulfillment pipeline triggered once.
                    </span>
                  </div>
                </>
              )}

              {simStep === 3 && (
                <>
                  <div className="flex items-center gap-2 text-emerald-400 font-medium">
                    <span>[DELIVERY]</span>
                    <span>Signed download grant issued for customer account</span>
                  </div>
                  <div className="rounded-lg bg-black/60 p-4 border border-white/5 text-[11px] leading-relaxed">
                    <div><span className="text-zinc-500">01</span>  <span className="text-sky-300">&quot;order_id&quot;</span>: <span className="text-emerald-300">&quot;ord_9f83a001&quot;</span>,</div>
                    <div><span className="text-zinc-500">02</span>  <span className="text-sky-300">&quot;deliverable_file&quot;</span>: <span className="text-emerald-300">&quot;websystem_v1.0.0.zip&quot;</span>,</div>
                    <div><span className="text-zinc-500">03</span>  <span className="text-sky-300">&quot;storage_bucket&quot;</span>: <span className="text-emerald-300">&quot;private_downloads&quot;</span>,</div>
                    <div><span className="text-zinc-500">04</span>  <span className="text-sky-300">&quot;signed_url&quot;</span>: <span className="text-sky-300">&quot;https://[supabase]/storage/v1/object/sign/...?token=exp_3600&quot;</span>,</div>
                    <div><span className="text-zinc-500">05</span>  <span className="text-sky-300">&quot;expires_in_seconds&quot;</span>: <span className="text-amber-300">3600</span>,</div>
                    <div><span className="text-zinc-500">06</span>  <span className="text-sky-300">&quot;revocable&quot;</span>: <span className="text-purple-400">true</span></div>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3 text-blue-200 text-xs">
                    <Lock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <span>
                      <strong>Private Vault:</strong> Files remain safely isolated in private storage. Downloads use expiring 1-hour signed URL links.
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-zinc-400 relative z-10">
        <span className="text-zinc-400 text-center sm:text-left">
          Click any step above or use the trigger button to test each verification stage.
        </span>
        <button
          type="button"
          onClick={() => triggerNextStep(simStep === 3 ? 1 : ((simStep + 1) as 1 | 2 | 3))}
          className="flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/15 px-4 py-2.5 text-xs font-semibold text-white hover:bg-accent hover:text-accent-contrast transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shrink-0"
        >
          {simStep === 3 ? (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Restart Simulation</span>
            </>
          ) : (
            <>
              <span>Next Stage ({simStep + 1}/3)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
