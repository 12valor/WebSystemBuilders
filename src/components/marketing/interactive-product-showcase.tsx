"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TactileCard } from "@/components/ui/tactile-card";
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
  ShieldCheck,
  TrendingUp,
  Activity,
  CreditCard,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

const demoTabs = [
  {
    id: "pos",
    name: "Point of Sale (POS)",
    badge: "Retail & Dining",
    icon: ShoppingBag,
    color: "blue",
    description: "Real-time cashiering, inventory deduction, GCash / Maya payment options, and instant receipt printing.",
    metrics: [
      { label: "Scan Speed", value: "< 0.2s" },
      { label: "Offline Mode", value: "Auto-sync" },
      { label: "Hardware", value: "Thermal Printers" },
    ],
    features: [
      "Real-time product search & barcode scanning",
      "Integrated PayMongo GCash & Card checkout",
      "Daily sales & cashier closing reports",
      "Full PHP + Supabase source code",
    ],
  },
  {
    id: "inventory",
    name: "Warehouse & Inventory",
    badge: "Logistics",
    icon: Boxes,
    color: "emerald",
    description: "Multi-branch stock tracking, low-stock threshold alerts, purchase order management, and stock movement audit logs.",
    metrics: [
      { label: "Stock Accuracy", value: "99.9%" },
      { label: "Multi-branch", value: "Unlimited" },
      { label: "Barcode", value: "Code128 / QR" },
    ],
    features: [
      "Automated stock level reorder alerts",
      "Supplier management & purchase orders",
      "Stock transfer history between warehouses",
      "Exportable PDF & Excel inventory reports",
    ],
  },
  {
    id: "clinic",
    name: "Clinic & Healthcare",
    badge: "Medical Management",
    icon: Stethoscope,
    color: "rose",
    description: "Patient registration, appointment scheduling, electronic medical records (EMR), and pharmacy prescription tracking.",
    metrics: [
      { label: "EMR Encryption", value: "AES-256" },
      { label: "Doctor Portal", value: "Dedicated" },
      { label: "Prescription", value: "Print Ready" },
    ],
    features: [
      "Doctor schedule & queue management",
      "Patient medical history & file attachments",
      "Medicine stock & pharmacy billing",
      "Automated SMS appointment reminders",
    ],
  },
  {
    id: "capstone",
    name: "Academic Capstone Suite",
    badge: "Student Ready",
    icon: GraduationCap,
    color: "indigo",
    description: "Pre-built full-stack web applications with complete ERD diagrams, system architecture blueprints, and defense guides.",
    metrics: [
      { label: "Defense Pass Rate", value: "100%" },
      { label: "Documentation", value: "Included" },
      { label: "Tech Stack", value: "React / Node / PHP" },
    ],
    features: [
      "Clean modular code structure easy to explain",
      "Database migration scripts & sample seed data",
      "DFD, ERD, and use case diagram references",
      "30 days technical mentoring & setup support",
    ],
  },
];

export function InteractiveProductShowcase() {
  const [activeTabId, setActiveTabId] = useState("pos");
  const activeTab = demoTabs.find((tab) => tab.id === activeTabId) || demoTabs[0];

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden border-b border-slate-200/80">
      <div className="mx-auto w-[min(calc(100%-40px),1280px)] md:w-[min(calc(100%-64px),1280px)] xl:w-[min(calc(100%-96px),1280px)]">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore live system workflows
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium">
            Test drive how our software systems operate before making a purchase decision.
          </p>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {demoTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabId(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg scale-105"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Live Interactive Simulation Window */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                <span>{activeTab.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {activeTab.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {activeTab.description}
              </p>

              {/* Key Metric Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {activeTab.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-400">{m.label}</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Features checklist */}
              <div className="space-y-2.5 pt-2">
                {activeTab.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link href="/systems">
                  <MagneticButton size="md" variant="primary">
                    <span>Explore Systems Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </Link>
              </div>
            </div>

            {/* Right Interactive UI Simulation Screen */}
            <div className="lg:col-span-7">
              <div className="rounded-[24px] bg-slate-900 text-white p-5 md:p-6 shadow-2xl border border-slate-800">
                {/* Mac Header Chrome */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-xs font-mono text-slate-400">
                      {activeTab.name} • Live Preview Module
                    </span>
                  </div>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    100% Functional Code
                  </span>
                </div>

                {/* Simulation Screen Content */}
                <div className="space-y-4">
                  {/* Top Bar Mock */}
                  <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span>Search items or scan barcode...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-600 px-2.5 py-1 rounded-lg font-bold">
                        + New Order
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Widgets */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Active Session</span>
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-lg font-extrabold text-white">₱84,900.00</div>
                      <div className="text-[10px] text-emerald-400 mt-1">Verified local currency</div>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Database Status</span>
                        <Activity className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <div className="text-lg font-extrabold text-white">Supabase Connected</div>
                      <div className="text-[10px] text-blue-400 mt-1">Row Level Security Active</div>
                    </div>
                  </div>

                  {/* List Items Mock */}
                  <div className="space-y-2 pt-1">
                    {[
                      { name: "Main System Source ZIP Package", code: "SRC-2026-V1", price: "PHP 4,500.00", status: "Ready" },
                      { name: "Database Schema & Migration SQL", code: "SQL-SUPA-01", price: "Included", status: "Verified" },
                      { name: "30-Day Defect Support Entitlement", code: "SUP-30D", price: "Included", status: "Active" },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-lg border border-slate-700/40 text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileCheck className="w-4 h-4 text-blue-400 shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-200">{row.name}</div>
                            <div className="text-[10px] text-slate-400">{row.code}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-white">{row.price}</div>
                          <div className="text-[10px] text-emerald-400">{row.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
