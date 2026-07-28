"use client";

import React from "react";

interface DiagramProps {
  activeStep?: number;
  className?: string;
}

/**
 * Technical Blueprint SVG Diagram: Ready-Made Catalog & Evaluation Flow
 */
export function DiscoveryDiagram({ activeStep = 0, className = "" }: DiagramProps) {
  return (
    <div className={`relative rounded-xl border border-white/10 bg-surface-subtle p-6 overflow-hidden ${className}`}>
      {/* Background blueprint grid styling */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "16px 16px"
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Node 1: Catalog Database */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 0 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-accent font-mono text-xs font-bold border border-white/10">
            DB
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">System Catalog</span>
          <span className="text-[11px] text-text-muted">Administrator Published</span>
        </div>

        {/* Arrow Connector */}
        <div className="hidden md:flex flex-col items-center">
          <svg className="w-8 h-4 text-white/30" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 8h24m0 0l-6-6m6 6l-6 6" />
          </svg>
          <span className="text-[10px] font-mono text-text-muted mt-1">SPEC</span>
        </div>

        {/* Node 2: Evaluation */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 1 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-accent font-mono text-xs font-bold border border-white/10">
            V1.0
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Inclusions & Scope</span>
          <span className="text-[11px] text-text-muted">Features & License</span>
        </div>

        {/* Arrow Connector */}
        <div className="hidden md:flex flex-col items-center">
          <svg className="w-8 h-4 text-white/30" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 8h24m0 0l-6-6m6 6l-6 6" />
          </svg>
          <span className="text-[10px] font-mono text-text-muted mt-1">ORDER</span>
        </div>

        {/* Node 3: Server Checkout */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 2 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-success font-mono text-xs font-bold border border-white/10">
            PHP
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Authoritative Amount</span>
          <span className="text-[11px] text-text-muted">Pending State Registered</span>
        </div>

        {/* Arrow Connector */}
        <div className="hidden md:flex flex-col items-center">
          <svg className="w-8 h-4 text-white/30" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 8h24m0 0l-6-6m6 6l-6 6" />
          </svg>
          <span className="text-[10px] font-mono text-text-muted mt-1">LOCK</span>
        </div>

        {/* Node 4: Delivery */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 3 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-accent font-mono text-xs font-bold border border-white/10">
            ZIP
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Expiring Access Link</span>
          <span className="text-[11px] text-text-muted">1-Hour Secure Token</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Technical Blueprint SVG Diagram: Custom Development Sprint Flow
 */
export function CustomSprintDiagram({ activeStep = 0, className = "" }: DiagramProps) {
  return (
    <div className={`relative rounded-xl border border-white/10 bg-surface-subtle p-6 overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
          backgroundSize: "16px 16px"
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        {/* Step 1: Brief */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 0 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-accent font-mono text-xs font-bold border border-white/10">
            01
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Requirements Brief</span>
          <span className="text-[11px] text-text-muted">Workflows & Goals</span>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <svg className="w-8 h-4 text-white/30" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 8h24m0 0l-6-6m6 6l-6 6" />
          </svg>
        </div>

        {/* Step 2: Feasibility */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 1 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-accent font-mono text-xs font-bold border border-white/10">
            02
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Feasibility Check</span>
          <span className="text-[11px] text-text-muted">Tech Stack & Boundaries</span>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <svg className="w-8 h-4 text-white/30" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 8h24m0 0l-6-6m6 6l-6 6" />
          </svg>
        </div>

        {/* Step 3: Proposal */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 2 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-accent font-mono text-xs font-bold border border-white/10">
            03
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Agreed Proposal</span>
          <span className="text-[11px] text-text-muted">Fixed Scope & Timeline</span>
        </div>

        <div className="hidden md:flex flex-col items-center">
          <svg className="w-8 h-4 text-white/30" viewBox="0 0 32 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M0 8h24m0 0l-6-6m6 6l-6 6" />
          </svg>
        </div>

        {/* Step 4: Sprint & Handoff */}
        <div className={`flex flex-1 flex-col items-center rounded-lg border p-4 transition-all duration-300 ${
          activeStep === 3 ? "border-accent bg-accent/10 shadow-lg shadow-accent/5" : "border-white/10 bg-surface"
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/5 text-success font-mono text-xs font-bold border border-white/10">
            04
          </div>
          <span className="mt-3 text-xs font-semibold text-text-primary">Sprint & Handoff</span>
          <span className="text-[11px] text-text-muted">Code Review & Access</span>
        </div>
      </div>
    </div>
  );
}
