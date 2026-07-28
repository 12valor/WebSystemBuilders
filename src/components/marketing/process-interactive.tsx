"use client";

import React, { useState } from "react";
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
    description: "The backend creates a pending order record with authoritative pricing in minor units (PHP centavos) before redirecting to hosted PayMongo payment.",
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
            className={`flex-1 sm:flex-initial rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
            className={`flex-1 sm:flex-initial rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              pipeline === "custom"
                ? "bg-accent text-accent-contrast shadow-md"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            Custom Development Path
          </button>
        </div>

        <div className="hidden md:block px-3 text-xs font-mono text-text-muted">
          {pipeline === "ready" ? "MODE: CATALOG_FULFILLMENT" : "MODE: CUSTOM_DEVELOPMENT_SPRINT"}
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
              className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
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
              Stage Assurances
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
 * Security & Fulfillment Simulator: Demonstrates server-side payment verification & signed link mechanics
 */
export function SecurityFulfillmentSimulator() {
  const [simStep, setSimStep] = useState<1 | 2 | 3>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const triggerNextStep = (step: 1 | 2 | 3) => {
    setIsSimulating(true);
    setSimStep(step);
    setTimeout(() => setIsSimulating(false), 300);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-surface p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono text-emerald-400 mb-2">
            <span>LIVE INTERACTIVE SIMULATION</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            Payment & Delivery Verification Flow
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            Experience how our server ensures zero fraud by requiring cryptographically signed payment webhooks before generating download tokens.
          </p>
        </div>
      </div>

      {/* Simulator Step Selector Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => triggerNextStep(1)}
          className={`rounded-lg border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            simStep === 1
              ? "border-accent bg-accent/10 text-text-primary"
              : "border-white/10 bg-surface-subtle text-text-muted hover:border-white/20"
          }`}
        >
          <span className="font-mono text-xs font-semibold block text-accent">STEP 1</span>
          <span className="text-xs font-semibold text-text-primary mt-1 block">Pending Order</span>
          <span className="text-[11px] text-text-muted block mt-0.5">Authoritative amount set</span>
        </button>

        <button
          type="button"
          onClick={() => triggerNextStep(2)}
          className={`rounded-lg border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            simStep === 2
              ? "border-accent bg-accent/10 text-text-primary"
              : "border-white/10 bg-surface-subtle text-text-muted hover:border-white/20"
          }`}
        >
          <span className="font-mono text-xs font-semibold block text-accent">STEP 2</span>
          <span className="text-xs font-semibold text-text-primary mt-1 block">Webhook Signature</span>
          <span className="text-[11px] text-text-muted block mt-0.5">HMAC signature checked</span>
        </button>

        <button
          type="button"
          onClick={() => triggerNextStep(3)}
          className={`rounded-lg border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            simStep === 3
              ? "border-accent bg-accent/10 text-text-primary"
              : "border-white/10 bg-surface-subtle text-text-muted hover:border-white/20"
          }`}
        >
          <span className="font-mono text-xs font-semibold block text-accent">STEP 3</span>
          <span className="text-xs font-semibold text-text-primary mt-1 block">Expiring Token Issued</span>
          <span className="text-[11px] text-text-muted block mt-0.5">1-Hour signed link active</span>
        </button>
      </div>

      {/* Terminal / Payload Inspector Display */}
      <div className="relative rounded-xl border border-white/10 bg-black/70 p-5 font-mono text-xs overflow-x-auto text-text-secondary">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-[11px] text-text-muted">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-text-muted">server-fulfillment-verifier.ts</span>
          </div>
          <span className="text-emerald-400">
            {isSimulating ? "VERIFYING..." : "VERIFIED_STATE"}
          </span>
        </div>

        {simStep === 1 && (
          <div className="space-y-2">
            <p className="text-blue-400">[INIT] Order registration initiated by client request</p>
            <pre className="text-text-muted text-[11px] leading-relaxed">
{`{
  "order_id": "ord_9f83a001",
  "status": "pending",
  "currency": "PHP",
  "amount_minor": 1490000, // ₱14,900.00
  "signature_verified": false,
  "download_token": null
}`}
            </pre>
            <p className="text-amber-300 text-[11px] mt-2">
              ⚠️ Browser payment return URL will NOT unlock delivery. Waiting for provider webhook event.
            </p>
          </div>
        )}

        {simStep === 2 && (
          <div className="space-y-2">
            <p className="text-emerald-400">[WEBHOOK] Received payment.paid webhook payload from PayMongo</p>
            <pre className="text-text-muted text-[11px] leading-relaxed">
{`{
  "event_id": "evt_pk_88201",
  "type": "payment.paid",
  "signature_header": "t=1785203,v1=9a8d7c...",
  "hmac_verification": "VALID (MATCHES_SECRET)",
  "order_status": "paid",
  "fulfillment_status": "processing"
}`}
            </pre>
            <p className="text-emerald-300 text-[11px] mt-2">
              ✓ Server confirmed HMAC signature. Order status updated to PAID. Idempotent fulfillment job triggered.
            </p>
          </div>
        )}

        {simStep === 3 && (
          <div className="space-y-2">
            <p className="text-emerald-400">[DELIVERY] Signed download grant issued for customer account</p>
            <pre className="text-text-muted text-[11px] leading-relaxed">
{`{
  "order_id": "ord_9f83a001",
  "deliverable_file": "websystem_v1.0.0.zip",
  "storage_bucket": "private_downloads",
  "signed_url": "https://[supabase]/storage/v1/object/sign/...?token=exp_3600",
  "expires_in_seconds": 3600,
  "revocable": true
}`}
            </pre>
            <p className="text-emerald-300 text-[11px] mt-2">
              🔒 File delivered through temporary 1-hour signed URL. Direct storage file paths remain completely private.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs text-text-muted">
        <span>Click the steps above to test each phase of the secure delivery process.</span>
        <button
          type="button"
          onClick={() => triggerNextStep(simStep === 3 ? 1 : ((simStep + 1) as 1 | 2 | 3))}
          className="rounded-md border border-white/10 bg-surface-raised px-4 py-2 text-text-primary hover:border-white/20 hover:bg-white/10 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {simStep === 3 ? "Restart Simulation" : "Next Stage →"}
        </button>
      </div>
    </div>
  );
}
