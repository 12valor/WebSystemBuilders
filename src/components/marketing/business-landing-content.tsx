"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function BusinessLandingContent() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="bg-white font-sans min-h-screen text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-slate-50/80 border-b border-slate-200/80 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left Content */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200/80 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-blue-700">
              <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
              For Business Owners & Operators
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Systems shaped around day-to-day operations.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
              Evaluate ready-made software systems for common workflows or request a custom system based on the exact way your business operates.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/systems?audience=business"
                className="blue-button inline-flex min-h-12 items-center justify-center bg-blue-600 px-6 text-sm font-semibold text-white"
              >
                Browse Business Systems
              </Link>

              <Link
                href="/services/custom-development"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition group"
              >
                Request custom development
                <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right Floating Layered Composite UI Stack */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-blue-600/10 via-slate-600/10 to-indigo-600/10 p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-12 -right-12 size-48 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-indigo-500/10 blur-2xl" />

              {/* POS Checkout Card Snippet */}
              <motion.div
                className="self-start rounded-2xl bg-white p-4 shadow-lg border border-slate-200/80 flex items-center gap-3 w-4/5"
              >
                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 truncate">
                  <span className="block text-xs font-bold text-slate-900 truncate">POS Checkout Terminal</span>
                  <span className="block text-[0.68rem] text-emerald-600 font-semibold truncate">₱1,450.00 • Paid via PayPal</span>
                </div>
              </motion.div>

              {/* Real-time Inventory Stock Badge */}
              <motion.div
                className="mx-auto w-full rounded-2xl bg-slate-900 p-4 text-white shadow-2xl border border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[0.68rem] font-mono font-bold uppercase text-slate-400">Inventory Dashboard</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-400 border border-emerald-500/30">
                    Live Stock Sync
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Barcode Reader</span>
                    <span className="font-mono text-blue-400">Scan Active</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full w-4/5" />
                  </div>
                  <div className="flex justify-between text-[0.65rem] text-slate-400 pt-0.5">
                    <span>Stock Level: 420 units</span>
                    <span>Reorder Point: 50 units</span>
                  </div>
                </div>
              </motion.div>

              {/* Sales Metrics Card */}
              <motion.div
                className="self-end rounded-2xl bg-white p-4 shadow-lg border border-slate-200/80 flex items-center gap-3 w-4/5"
              >
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1 truncate">
                  <span className="block text-xs font-bold text-slate-900 truncate">Daily Operations</span>
                  <span className="block text-[0.68rem] text-slate-500 truncate">99.8% System Uptime</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BUSINESS SYSTEMS SECTION (2x2 GRID) */}
      <section className="bg-slate-50/80 border-b border-slate-200/80 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left Header */}
            <div className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                Business Systems
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Choose a practical operational starting point.
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 max-w-md">
                Select a software system category designed specifically for commercial workflows, inventory control, and enterprise management.
              </p>
            </div>

            {/* Right 2x2 Product Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card 01: Point of Sale */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between space-y-5"
              >
                {/* Header Icon + Label */}
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">01</span>
                </div>

                {/* UI Mockup Snippet */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Retail Cashier Screen</span>
                    <span className="text-emerald-600">Active</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-3/4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Point of Sale (POS)
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                    Support fast transaction recording, cashier receipt printing, sales reports, and operational controls at the point of sale.
                  </p>
                </div>
              </motion.div>

              {/* Card 02: Inventory Management */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">02</span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Stock Movement Audit</span>
                    <span className="text-amber-600 font-mono">1,240 items</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-2/3" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Inventory Management
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                    Track item stock levels, product movements, low-stock warnings, and daily operational inventory records accurately.
                  </p>
                </div>
              </motion.div>

              {/* Card 03: Warehouse Management */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">03</span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Receiving & Storage Logs</span>
                    <span className="text-purple-600">In-Transit</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-5/6" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Warehouse Management
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                    Organize receiving shipments, bin storage locations, order fulfillment, and multi-location warehouse operations.
                  </p>
                </div>
              </motion.div>

              {/* Card 04: Other Management Systems */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">04</span>
                </div>

                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Custom Management ERP</span>
                    <span className="text-emerald-600">Configurable</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-full" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Custom Management Systems
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                    Review software solutions for payroll, attendance, booking, CRM, clinic management, and enterprise workflows.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* EVALUATION BEFORE PURCHASE TRUST SECTION */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-slate-50/90 border border-slate-200/90 p-8 sm:p-10 lg:p-12 shadow-sm space-y-8"
          >
            {/* Top Header */}
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-700">
                  Evaluation Before Purchase
                </span>
                <h3 className="text-sm font-bold text-slate-900">Package Transparency Guarantee</h3>
              </div>
            </div>

            {/* Main Headline */}
            <div className="border-l-4 border-blue-600 pl-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Know what the package does and does not include.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Published system pages explicitly separate features, database schemas, package inclusions, exclusions, license terms, and support boundaries so you can evaluate before purchasing.
              </p>
            </div>

            {/* 2-Column Scannable Inclusions vs Exclusions Grid */}
            <div className="grid gap-6 md:grid-cols-2 pt-2">
              {/* Left Column: Included */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200/80 pb-3">
                  <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span>What&apos;s Included in Published Packages</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Complete system source code & database migration files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Documented setup guide & environment requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Commercial software license (Single or Multi-site)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Standard bug fix support for declared core features</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: Not Included */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-200/80 pb-3">
                  <div className="size-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-mono font-bold">
                    -
                  </div>
                  <span>What&apos;s Not Included (Scoped Separately)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">-</span>
                    <span>Server deployment, cloud hosting, or domain setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">-</span>
                    <span>Initial business data migration & catalog import</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">-</span>
                    <span>Custom feature modifications beyond product specs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">-</span>
                    <span>On-site POS hardware installation (printers/scanners)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Trust Badge */}
            <div className="pt-2 text-center text-xs font-semibold text-slate-500 border-t border-slate-200/80 flex items-center justify-center gap-2">
              <svg className="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Every published system page shows exact inclusions before purchase.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800"
          >
            <div className="absolute -top-24 -right-24 size-96 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-blue-400">
                  <svg className="size-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Operational Matching
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Find the closest operational fit.
                </h2>

                <p className="text-sm leading-relaxed text-slate-300">
                  Browse administrator-published business systems, then request custom development if available workflows do not match your exact operational requirements.
                </p>

                <p className="text-xs font-medium text-slate-400 pt-1">
                  Not sure which system fits? Browse the catalog or request a free scope review.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/systems?audience=business"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 transition"
                >
                  Explore Business Systems
                </Link>

                <Link
                  href="/services/custom-development"
                  className="inline-flex items-center justify-center gap-1.5 px-4 text-sm font-semibold text-slate-300 hover:text-white transition group"
                >
                  Custom development
                  <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
