"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  ShoppingBag,
  Boxes,
  Stethoscope,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
  Plus,
  TrendingUp,
  Activity,
  FileCode,
  Database,
  Terminal,
  RefreshCw,
  UserCheck,
  PackageCheck,
  BookOpenCheck,
} from "lucide-react";
import Link from "next/link";

type CategoryId = "pos" | "inventory" | "clinic" | "capstone";
type ViewMode = "screen" | "schema" | "api";

interface CategoryDef {
  id: CategoryId;
  name: string;
  badge: string;
  icon: React.ElementType;
  accent: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    textAccent: string;
    bgAccent: string;
    borderAccent: string;
    pillActive: string;
  };
  description: string;
  metrics: { label: string; value: string }[];
  features: string[];
  sqlSchema: string;
  apiPayload: Record<string, unknown>;
}

const categories: CategoryDef[] = [
  {
    id: "pos",
    name: "Point of Sale (POS)",
    badge: "Retail & Dining",
    icon: ShoppingBag,
    accent: {
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-800",
      badgeBorder: "border-emerald-200",
      textAccent: "text-emerald-400",
      bgAccent: "bg-emerald-500/10",
      borderAccent: "border-emerald-500/30",
      pillActive: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40",
    },
    description:
      "Real-time cashier register, barcode scanner listener, PayPal Checkout, and thermal receipt printing.",
    metrics: [
      { label: "Scan Latency", value: "< 0.18s" },
      { label: "Offline Mode", value: "Auto-Sync" },
      { label: "Hardware", value: "Thermal / ESC" },
    ],
    features: [
      "Real-time barcode scanning and search indexing",
      "PayPal Checkout integration",
      "Cashier shift closing and Z-Reading PDF generation",
      "Full Next.js App Router + Supabase RLS codebase",
    ],
    sqlSchema: `-- Table: pos_transactions
CREATE TABLE pos_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'paypal', 'card')),
  cashier_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pos_transactions_created ON pos_transactions(created_at DESC);`,
    apiPayload: {
      event: "pos.transaction.created",
      order_number: "POS-2026-8841",
      currency: "PHP",
      total_amount_minor: 450000,
      payment_channel: "paypal",
      status: "COMPLETED",
      timestamp: "2026-07-29T10:48:00Z",
    },
  },
  {
    id: "inventory",
    name: "Warehouse & Inventory",
    badge: "Logistics & Supply",
    icon: Boxes,
    accent: {
      badgeBg: "bg-indigo-50",
      badgeText: "text-indigo-800",
      badgeBorder: "border-indigo-200",
      textAccent: "text-indigo-400",
      bgAccent: "bg-indigo-500/10",
      borderAccent: "border-indigo-500/30",
      pillActive: "border-indigo-500/40 text-indigo-400 bg-indigo-950/40",
    },
    description:
      "Multi-warehouse stock tracking, low-stock threshold triggers, supplier purchase orders, and stock audit trails.",
    metrics: [
      { label: "Stock Accuracy", value: "99.98%" },
      { label: "Multi-Branch", value: "Unlimited" },
      { label: "Encoding", value: "Code128 / QR" },
    ],
    features: [
      "Automated stock level reorder threshold alerts",
      "Supplier PO generation & receipt confirmation",
      "Inter-branch stock transfer movement logs",
      "Exportable XLSX & PDF audit inventory sheets",
    ],
    sqlSchema: `-- Table: inventory_items
CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  item_name TEXT NOT NULL,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 10,
  branch_location TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger alert when quantity_on_hand <= reorder_level`,
    apiPayload: {
      event: "inventory.reorder.triggered",
      sku: "SKU-LOGI-992",
      current_stock: 4,
      reorder_threshold: 10,
      recommended_order: 50,
      supplier_id: "SUPP-MANILA-01",
    },
  },
  {
    id: "clinic",
    name: "Clinic & Healthcare (EMR)",
    badge: "Medical Suite",
    icon: Stethoscope,
    accent: {
      badgeBg: "bg-cyan-50",
      badgeText: "text-cyan-800",
      badgeBorder: "border-cyan-200",
      textAccent: "text-cyan-400",
      bgAccent: "bg-cyan-500/10",
      borderAccent: "border-cyan-500/30",
      pillActive: "border-cyan-500/40 text-cyan-400 bg-cyan-950/40",
    },
    description:
      "Patient records (EMR), doctor queue & appointment scheduling, prescription builder, and pharmacy billing.",
    metrics: [
      { label: "EMR Security", value: "AES-256" },
      { label: "Doctor Queue", value: "Real-time" },
      { label: "Prescription", value: "Print PDF" },
    ],
    features: [
      "Real-time doctor appointment queue tracking",
      "Encrypted patient medical history & diagnoses",
      "Rx prescription template builder & printing",
      "SMS & Email appointment notification triggers",
    ],
    sqlSchema: `-- Table: patient_records
CREATE TABLE patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  encrypted_medical_history BYTEA,
  attending_physician TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'consulting', 'completed'))
);`,
    apiPayload: {
      event: "emr.appointment.updated",
      patient_code: "PAT-2026-042",
      queue_number: "Q-08",
      attending_doctor: "Dr. Santos, MD",
      status: "CONSULTING",
      timestamp: "2026-07-29T10:50:00Z",
    },
  },
  {
    id: "capstone",
    name: "Academic Capstone Suite",
    badge: "Student Ready",
    icon: GraduationCap,
    accent: {
      badgeBg: "bg-amber-50",
      badgeText: "text-amber-800",
      badgeBorder: "border-amber-200",
      textAccent: "text-amber-400",
      bgAccent: "bg-amber-500/10",
      borderAccent: "border-amber-500/30",
      pillActive: "border-amber-500/40 text-amber-400 bg-amber-950/40",
    },
    description:
      "Pre-built full-stack capstone projects complete with ERD diagrams, system architecture blueprints, and defense guides.",
    metrics: [
      { label: "Defense Pass", value: "100%" },
      { label: "Documentation", value: "Complete" },
      { label: "Tech Stack", value: "Next.js / PHP" },
    ],
    features: [
      "Clean modular code structure easy to explain to panelists",
      "Database SQL schema migrations & sample seed datasets",
      "Context DFD, ERD, and Use Case diagram source files",
      "30-day defect support entitlement and setup guidance",
    ],
    sqlSchema: `-- Table: capstone_projects
CREATE TABLE capstone_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_title TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL,
  erd_diagram_url TEXT NOT NULL,
  defense_pass_guarantee BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);`,
    apiPayload: {
      event: "capstone.package.verified",
      title: "Hospital Appointment & EMR Management System",
      code_package: "ZIP_SRC_V2.4.zip",
      documentation_included: true,
      erd_file: "ERD_ARCH_V2.pdf",
      defense_checklist_status: "PASSED",
    },
  },
];

export function InteractiveProductShowcase() {
  const [activeTabId, setActiveTabId] = useState<CategoryId>("pos");
  const [viewMode, setViewMode] = useState<ViewMode>("screen");

  // Interactive state simulations per tab
  const [posItemCount, setPosItemCount] = useState(3);
  const [warehouseStock, setWarehouseStock] = useState(4);
  const [reorderTriggered, setReorderTriggered] = useState(false);
  const [patientQueueIndex, setPatientQueueIndex] = useState(0);

  const activeCategory = categories.find((c) => c.id === activeTabId) || categories[0];

  const patientQueue = [
    { code: "PAT-041", name: "Maria Clara", time: "10:15 AM", status: "In Consultation" },
    { code: "PAT-042", name: "Juan Dela Cruz", time: "10:30 AM", status: "Next in Line" },
    { code: "PAT-043", name: "Jose Rizal", time: "10:45 AM", status: "Waiting Room" },
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold uppercase tracking-wider border border-slate-700/80 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Live Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Explore software systems before you decide
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal">
            Test drive live interface layouts, database schemas, and API payloads in real time.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeTabId;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTabId(cat.id);
                  setViewMode("screen");
                }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-slate-800 text-white border-slate-600 shadow-md"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? cat.accent.textAccent : "text-slate-500"}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Live Simulation Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Column: Domain Specs & Key Metrics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border bg-slate-800/80 text-slate-200 border-slate-700">
                <span>{activeCategory.badge}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {activeCategory.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                {activeCategory.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {activeCategory.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">{m.label}</div>
                    <div className="text-sm font-bold text-white mt-1">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-2">
                {activeCategory.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 font-normal">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${activeCategory.accent.textAccent}`} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <Link href="/systems">
                  <MagneticButton size="md" variant="primary">
                    <span>Explore Systems Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Mock Terminal Window */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-950 text-white p-5 md:p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                {/* Mac Chrome & Sub-View Switcher Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-slate-700" />
                    <span className="size-3 rounded-full bg-slate-700" />
                    <span className="size-3 rounded-full bg-slate-700" />
                    <span className="ml-2 text-xs font-mono text-slate-400">
                      {activeCategory.id}.module
                    </span>
                  </div>

                  {/* View Mode Controls */}
                  <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button
                      onClick={() => setViewMode("screen")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                        viewMode === "screen"
                          ? "bg-slate-800 text-white border border-slate-700"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Terminal className="size-3" />
                      <span>App View</span>
                    </button>
                    <button
                      onClick={() => setViewMode("schema")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                        viewMode === "schema"
                          ? "bg-slate-800 text-white border border-slate-700"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Database className="size-3" />
                      <span>SQL Schema</span>
                    </button>
                    <button
                      onClick={() => setViewMode("api")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                        viewMode === "api"
                          ? "bg-slate-800 text-white border border-slate-700"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <FileCode className="size-3" />
                      <span>API Payload</span>
                    </button>
                  </div>
                </div>

                {/* Sub-View Content */}
                {viewMode === "screen" && (
                  <div className="space-y-4">
                    {/* POS Specific Interactive Interface */}
                    {activeCategory.id === "pos" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Search className="size-3.5 text-slate-500" />
                            <span>Scan barcode or search items...</span>
                          </div>
                          <button
                            onClick={() => setPosItemCount((prev) => prev + 1)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                          >
                            <Plus className="size-3.5" />
                            <span>Add Item</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                              <span>Active Cart Items</span>
                              <ShoppingBag className="size-3.5 text-emerald-400" />
                            </div>
                            <div className="text-xl font-bold text-white">{posItemCount} Items</div>
                            <div className="text-[10px] text-emerald-400 font-mono mt-1">+ Real-time stock sync</div>
                          </div>
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                              <span>Subtotal</span>
                              <TrendingUp className="size-3.5 text-emerald-400" />
                            </div>
                            <div className="text-xl font-bold text-white">
                              ₱{(posItemCount * 1500).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">PayPal Checkout Active</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-1">
                            Cart Items
                          </div>
                          {[
                            { name: "Full-Stack Source ZIP", code: "POS-SRC-01", price: "₱1,500.00" },
                            { name: "Database Seed & Migration SQL", code: "POS-DB-02", price: "₱1,500.00" },
                            { name: "Thermal Printer ESC Driver", code: "POS-DRV-03", price: "₱1,500.00" },
                            ...(posItemCount > 3
                              ? Array.from({ length: posItemCount - 3 }).map((_, i) => ({
                                  name: `Additional Modular Component #${i + 4}`,
                                  code: `POS-MOD-0${i + 4}`,
                                  price: "₱1,500.00",
                                }))
                              : []),
                          ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 text-xs">
                              <div className="flex items-center gap-2.5">
                                <PackageCheck className="size-4 text-emerald-400 shrink-0" />
                                <div>
                                  <div className="font-semibold text-slate-200">{item.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">{item.code}</div>
                                </div>
                              </div>
                              <div className="text-right font-bold text-white">{item.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warehouse Inventory Specific Interface */}
                    {activeCategory.id === "inventory" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                            <span>Location: Main Warehouse Manila</span>
                          </div>
                          <button
                            onClick={() => {
                              setReorderTriggered(true);
                              setWarehouseStock(50);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                          >
                            <RefreshCw className="size-3.5" />
                            <span>Trigger Auto-Reorder</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 mb-1">Current Stock Level</div>
                            <div className="text-xl font-bold text-white">{warehouseStock} Units</div>
                            <div className={`text-[10px] font-mono mt-1 ${reorderTriggered ? "text-emerald-400" : "text-amber-400"}`}>
                              {reorderTriggered ? "PO-2026-104 Dispatched" : "Below Reorder Threshold (10)"}
                            </div>
                          </div>
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 mb-1">Branch Movement Status</div>
                            <div className="text-xl font-bold text-white">3 Active Transfers</div>
                            <div className="text-[10px] text-indigo-400 font-mono mt-1">Multi-branch audit synced</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-1">
                            Inventory Matrix
                          </div>
                          {[
                            { sku: "SKU-LOGI-992", name: "Warehouse Core System", stock: `${warehouseStock} units`, status: reorderTriggered ? "Restocked" : "Low Stock" },
                            { sku: "SKU-LOGI-993", name: "Barcode Scanner Driver Module", stock: "142 units", status: "Optimal" },
                            { sku: "SKU-LOGI-994", name: "Purchase Order PDF Generator", stock: "88 units", status: "Optimal" },
                          ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 text-xs">
                              <div className="flex items-center gap-2.5">
                                <Boxes className="size-4 text-indigo-400 shrink-0" />
                                <div>
                                  <div className="font-semibold text-slate-200">{row.name}</div>
                                  <div className="text-[10px] font-mono text-slate-400">{row.sku}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-white">{row.stock}</div>
                                <div className={`text-[10px] font-mono ${row.status === "Low Stock" ? "text-amber-400" : "text-emerald-400"}`}>
                                  {row.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Clinic Healthcare EMR Specific Interface */}
                    {activeCategory.id === "clinic" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                            <Activity className="size-3.5 text-cyan-400" />
                            <span>Attending Doctor: Dr. Santos, MD</span>
                          </div>
                          <button
                            onClick={() => setPatientQueueIndex((prev) => (prev + 1) % patientQueue.length)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors"
                          >
                            <UserCheck className="size-3.5" />
                            <span>Call Next Patient</span>
                          </button>
                        </div>

                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                          <div className="text-xs text-slate-400 mb-1">Active Patient Consultation</div>
                          <div className="text-lg font-bold text-white">
                            {patientQueue[patientQueueIndex].name} ({patientQueue[patientQueueIndex].code})
                          </div>
                          <div className="text-[10px] text-cyan-400 font-mono mt-1">
                            AES-256 Encrypted EMR • Consultation Time {patientQueue[patientQueueIndex].time}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-1">
                            Patient Queue Line
                          </div>
                          {patientQueue.map((p, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-3 rounded-lg border text-xs transition-colors ${
                                i === patientQueueIndex
                                  ? "bg-cyan-950/40 border-cyan-500/40 text-white"
                                  : "bg-slate-900/40 border-slate-800/80 text-slate-300"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Stethoscope className={`size-4 shrink-0 ${i === patientQueueIndex ? "text-cyan-400" : "text-slate-500"}`} />
                                <div>
                                  <div className="font-semibold">{p.name}</div>
                                  <div className="text-[10px] font-mono opacity-70">{p.code}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">{p.time}</div>
                                <div className={`text-[10px] font-mono ${i === patientQueueIndex ? "text-cyan-400" : "opacity-70"}`}>
                                  {i === patientQueueIndex ? "Consulting Now" : p.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Capstone Suite Specific Interface */}
                    {activeCategory.id === "capstone" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                            <BookOpenCheck className="size-3.5 text-amber-400" />
                            <span>Defense Package: Academic Suite V2.4</span>
                          </div>
                          <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            100% Defense Pass
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 mb-1">Architecture Blueprints</div>
                            <div className="text-base font-bold text-white">DFD, ERD & Use Case</div>
                            <div className="text-[10px] text-amber-400 font-mono mt-1">Source vector files included</div>
                          </div>
                          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                            <div className="text-xs text-slate-400 mb-1">Support Entitlement</div>
                            <div className="text-base font-bold text-white">30 Days Mentoring</div>
                            <div className="text-[10px] text-emerald-400 font-mono mt-1">Direct setup guidance</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-1">
                            Included Deliverables
                          </div>
                          {[
                            { name: "Full Modular Source Code (Next.js / Node)", size: "48 MB ZIP" },
                            { name: "Database Migration SQL & Seed Data Script", size: "2.4 MB SQL" },
                            { name: "Capstone Defense Q&A Preparation Guide", size: "15 Pages PDF" },
                          ].map((d, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 text-xs">
                              <div className="flex items-center gap-2.5">
                                <FileCode className="size-4 text-amber-400 shrink-0" />
                                <span className="font-semibold text-slate-200">{d.name}</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400">{d.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SQL Schema View */}
                {viewMode === "schema" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-2">
                      <span>PostgreSQL Migration Script</span>
                      <span>UTF-8 • SQL</span>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      <code>{activeCategory.sqlSchema}</code>
                    </pre>
                  </div>
                )}

                {/* API Payload View */}
                {viewMode === "api" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-b border-slate-800 pb-2">
                      <span>JSON Webhook Payload</span>
                      <span>application/json</span>
                    </div>
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      <code>{JSON.stringify(activeCategory.apiPayload, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
