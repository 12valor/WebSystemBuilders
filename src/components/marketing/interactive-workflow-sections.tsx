"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Minus,
  PackageCheck,
  Plus,
  ReceiptText,
  RefreshCw,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

type OperationsView = "checkout" | "inventory";
type CartState = Record<string, number>;

type DemoProduct = {
  id: string;
  name: string;
  detail: string;
  price: number;
};

type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
};

const demoProducts: DemoProduct[] = [
  { id: "beans", name: "Coffee beans", detail: "1 kg house blend", price: 320 },
  { id: "cups", name: "Paper cups", detail: "Pack of 50", price: 110 },
  { id: "labels", name: "Barcode labels", detail: "Thermal roll", price: 85 },
];

const initialInventory: InventoryItem[] = [
  { id: "coffee", name: "Coffee beans", sku: "CB-001", stock: 12, threshold: 5 },
  { id: "paper", name: "Paper cups", sku: "PC-050", stock: 8, threshold: 10 },
  { id: "syrup", name: "Vanilla syrup", sku: "VS-750", stock: 4, threshold: 6 },
];

function formatDemoMoney(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BusinessWorkflowPlayground() {
  return null;
}

function ProjectRoadmapIllustration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 760 560"
      className="size-full"
      fill="none"
    >
      <rect width="760" height="560" rx="42" fill="#EAF0F8" />
      <circle cx="632" cy="94" r="112" fill="#BFDBFE" />
      <circle cx="110" cy="468" r="144" fill="#BFDBFE" />

      <path
        d="M108 402C190 402 185 306 274 306C361 306 348 202 452 202C544 202 542 118 644 118"
        stroke="#FFFFFF"
        strokeWidth="24"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path
        d="M108 402C190 402 185 306 274 306C361 306 348 202 452 202C544 202 542 118 644 118"
        stroke="#2563EB"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray="10 12"
      />

      <g transform="translate(54 50)">
        <rect width="218" height="116" rx="22" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" />
        <rect x="24" y="25" width="54" height="64" rx="10" fill="#DBEAFE" />
        <path d="M39 43H63M39 56H63M39 69H55" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" />
        <text x="96" y="47" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="17" fontWeight="700">Project plan</text>
        <text x="96" y="74" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="13">Scope and milestones</text>
      </g>

      <g transform="translate(78 367)">
        <circle cx="30" cy="35" r="30" fill="#2563EB" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M19 35L27 43L43 27" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="72" width="176" height="70" rx="18" fill="#FFFFFF" />
        <text x="94" y="30" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="16" fontWeight="700">Requirements</text>
        <text x="94" y="52" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12">Confirmed</text>
      </g>

      <g transform="translate(244 271)">
        <circle cx="30" cy="35" r="30" fill="#2563EB" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M20 26H40V43H20Z" stroke="#FFFFFF" strokeWidth="4" strokeLinejoin="round" />
        <rect x="72" width="164" height="70" rx="18" fill="#FFFFFF" />
        <text x="94" y="30" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="16" fontWeight="700">Prototype</text>
        <text x="94" y="52" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12">Ready to review</text>
      </g>

      <g transform="translate(422 167)">
        <circle cx="30" cy="35" r="30" fill="#2563EB" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M17 35H43M30 22V48" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
        <rect x="72" width="150" height="70" rx="18" fill="#FFFFFF" />
        <text x="94" y="30" fill="#0F172A" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="16" fontWeight="700">Build</text>
        <text x="94" y="52" fill="#64748B" fontFamily="ui-sans-serif, system-ui, sans-serif" fontSize="12">In progress</text>
      </g>

      <g transform="translate(614 83)">
        <circle cx="30" cy="35" r="30" fill="#0F172A" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M19 35L27 43L43 27" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g transform="translate(482 374)">
        <rect width="224" height="116" rx="22" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" />
        <path d="M44 85L26 102V84" fill="#FFFFFF" stroke="#0F172A" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="38" cy="36" r="13" fill="#DBEAFE" />
        <path d="M62 31H180M62 50H148" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
        <rect x="24" y="69" width="138" height="9" rx="4.5" fill="#E2E8F0" />
        <circle cx="185" cy="76" r="18" fill="#10B981" />
        <path d="M176 76L182 82L194 69" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export function ProjectWorkspacePlayground() {
  return (
    <section
      aria-labelledby="project-workspace-title"
      className="relative overflow-hidden border-y border-slate-200 bg-[#F3F6FB] py-20 sm:py-28"
    >
      <div className="relative mx-auto grid w-[min(calc(100%-40px),1280px)] items-center gap-12 md:w-[min(calc(100%-64px),1280px)] lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-[#EAF0F8] p-3 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.22)] sm:p-5">
          <div className="aspect-[4/3] overflow-hidden rounded-[24px]">
            <ProjectRoadmapIllustration />
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            <ClipboardCheck className="size-3.5" />
            Structured project support
          </span>
          <h2 id="project-workspace-title" className="mt-5 text-3xl font-bold tracking-[-0.035em] text-[#0F172A] sm:text-4xl lg:text-5xl">
            Make project progress visible and reviewable.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700 sm:text-lg">
            See how requirements, milestones, deliverables, and review notes can stay organized throughout an ethical student-development engagement.
          </p>
          <div className="mt-7 space-y-3">
            <FeatureLine icon={LayoutDashboard} title="Clear milestones" copy="Show what is confirmed, what is being built, and what still needs review." />
            <FeatureLine icon={ClipboardCheck} title="Structured feedback" copy="Keep revision requests attached to the correct stage and deliverable." />
          </div>
          <Link
            href="/for-students"
            className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5"
          >
            Explore student support
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
function FeatureLine({ icon: Icon, title, copy }: { icon: typeof ShoppingCart; title: string; copy: string }) {
  return <div className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon className="size-4.5" /></span><div><p className="text-sm font-semibold text-slate-900">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{copy}</p></div></div>;
}

function PreviewTab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof ShoppingCart; label: string }) {
  return <button type="button" role="tab" aria-selected={active} onClick={onClick} className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-[11px] font-semibold transition ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"}`}><Icon className="size-3.5" />{label}</button>;
}

function MiniMetric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Boxes }) {
  return <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">{label}</span><Icon className="size-3.5 text-slate-500" /></div><p className="mt-2 text-lg font-bold text-white">{value}</p></div>;
}