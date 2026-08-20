"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export function StudentLandingContent() {
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
              Capstone & Thesis Development Support
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Technical support for the system you need to build.
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl">
              Explore ready-made software foundations or request tailored development support for a capstone, thesis-related, or approved academic software project.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/systems?audience=students"
                className="blue-button inline-flex min-h-12 items-center justify-center bg-blue-600 px-6 text-sm font-semibold text-white"
              >
                Browse Student Systems
              </Link>

              <Link
                href="/services/custom-development"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition group"
              >
                View custom development
                <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right Floating Capstone Readiness Stack */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-blue-600/10 via-slate-600/10 to-indigo-600/10 p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-12 -right-12 size-48 rounded-full bg-blue-500/10 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-indigo-500/10 blur-2xl" />

              {/* Floating Academic Scope Badge */}
              <motion.div
                className="self-start rounded-2xl bg-white p-4 shadow-lg border border-slate-200/80 flex items-center gap-3 w-4/5"
              >
                <div className="size-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="flex-1 truncate">
                  <span className="block text-xs font-bold text-slate-900 truncate">Academic Scope</span>
                  <span className="block text-[0.68rem] text-slate-500 truncate">Ethical Technical Mentoring</span>
                </div>
              </motion.div>

              {/* Center Capstone Defense Verification Hub */}
              <motion.div
                className="mx-auto w-full rounded-2xl bg-slate-900 p-4 text-white shadow-2xl border border-slate-800 space-y-2.5 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[0.68rem] uppercase text-slate-400 font-bold">capstone_project_spec</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-400 border border-emerald-500/30">
                    Defense Ready
                  </span>
                </div>

                <div className="space-y-1.5 text-[0.72rem]">
                  <div className="flex justify-between text-slate-300">
                    <span>Database Schema (PostgreSQL)</span>
                    <span className="text-emerald-400 font-semibold">12 Tables Verified</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full w-full" />
                  </div>
                  <div className="flex justify-between text-slate-400 text-[0.68rem] pt-0.5">
                    <span>REST APIs & Auth</span>
                    <span className="text-blue-400">Fully Documented</span>
                  </div>
                </div>
              </motion.div>

              {/* Database & Documentation Badge */}
              <motion.div
                className="self-end rounded-2xl bg-white p-4 shadow-lg border border-slate-200/80 flex items-center gap-3 w-4/5"
              >
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div className="flex-1 truncate">
                  <span className="block text-xs font-bold text-slate-900 truncate">Database & Architecture</span>
                  <span className="block text-[0.68rem] text-slate-500 truncate">ERD & Schema Guide Included</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STUDENT SERVICES SECTION (2x2 GRID) */}
      <section className="bg-slate-50/80 border-b border-slate-200/80 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            {/* Left Header */}
            <div className="space-y-4 lg:sticky lg:top-28 lg:h-fit">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">
                Student Services
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Support across the technical workflow.
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 max-w-md">
                The right service depends on your approved requirements, current progress, and the rules of your school or academic program.
              </p>
            </div>

            {/* Right 2x2 Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card 01: System Development */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">01</span>
                </div>

                {/* UI Mockup Snippet */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Full-Stack Project Scope</span>
                    <span className="text-blue-600">Custom Built</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-4/5" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5 text-[0.65rem] text-slate-500 font-mono">
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">Frontend</span>
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">API Routes</span>
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">Auth</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    System Development
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Build custom software around reviewed functional requirements, approved thesis specifications, and an agreed technical scope.
                  </p>
                </div>
              </motion.div>

              {/* Card 02: Templates & Foundations */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">02</span>
                </div>

                {/* UI Mockup Snippet */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Source & Schema Package</span>
                    <span className="text-indigo-600">Ready to Clone</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-3/4" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5 text-[0.65rem] text-slate-500 font-mono">
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">Full Source</span>
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">Migrations</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Templates & Foundations
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Use a ready-made system as a starting foundation when its features, database model, and license match your project needs.
                  </p>
                </div>
              </motion.div>

              {/* Card 03: Debugging & Deployment */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">03</span>
                </div>

                {/* UI Mockup Snippet */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Diagnostics & Port Setup</span>
                    <span className="text-amber-600 font-mono">0 Build Errors</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-full" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5 text-[0.65rem] text-slate-500 font-mono">
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">ENV Config</span>
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">Live Demo</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Debugging & Deployment
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Identify implementation errors, resolve build bugs, prepare database hosting, and assist with final presentation deployment.
                  </p>
                </div>
              </motion.div>

              {/* Card 04: Documentation Guidance */}
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-5"
              >
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">04</span>
                </div>

                {/* UI Mockup Snippet */}
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[0.68rem] font-bold text-slate-700">
                    <span>Architecture & ERD Specs</span>
                    <span className="text-emerald-600">Documented</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-5/6" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5 text-[0.65rem] text-slate-500 font-mono">
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">ERD Model</span>
                    <span className="bg-white border border-slate-200 px-1.5 py-0.5 rounded">Setup Guide</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Documentation Guidance
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-600">
                    Get clear technical guidance for explaining system architecture, entity relationships, setup guides, and project limitations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ETHICAL BOUNDARY SECTION */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-700">
                  Ethical Boundary & Policy
                </span>
                <h3 className="text-sm font-bold text-slate-900">Academic Integrity Standard</h3>
              </div>
            </div>

            {/* Main Headline */}
            <div className="border-l-4 border-blue-600 pl-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Technical help should support your learning, not misrepresent it.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                WebSystemBuilders provides software development, debugging, deployment assistance, documentation guidance, and technical mentoring under strict ethical standards.
              </p>
            </div>

            {/* 2-Column Comparison Matrix: Supported vs Prohibited */}
            <div className="grid gap-6 md:grid-cols-2 pt-2">
              {/* Left Column: What We Support */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm border-b border-emerald-200/80 pb-3">
                  <div className="size-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                    ✓
                  </div>
                  <span>What We Support (Ethical Guidance)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Complete system source code, database schemas, and migration files</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Step-by-step setup guides, architecture diagrams, and entity models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Bug fixing, environment configuration, and presentation deployment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Technical mentoring so you understand and can defend your own system</span>
                  </li>
                </ul>
              </div>

              {/* Right Column: What We Do Not Accept */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-200/80 pb-3">
                  <div className="size-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-mono font-bold">
                    ✕
                  </div>
                  <span>What We Do Not Accept (Strict Policy)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">✕</span>
                    <span>Ghostwriting thesis manuscripts, research papers, or written chapters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">✕</span>
                    <span>Taking live exams, quizzes, or graded individual assessments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">✕</span>
                    <span>Fabricating research findings, survey results, or falsified test data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">✕</span>
                    <span>Guaranteed grades or any service designed to bypass school evaluation</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Student Responsibility Notice */}
            <div className="pt-2 text-center text-xs font-semibold text-slate-500 border-t border-slate-200/80 flex items-center justify-center gap-2">
              <svg className="size-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Every student remains responsible for adhering to their school policies and presenting authorship honestly.</span>
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
                  Review Approved Requirements First
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Start with the approved requirements.
                </h2>

                <p className="text-sm leading-relaxed text-slate-300">
                  Review available student systems first. If none match, continue with custom development and prepare the functional requirements your school has approved.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/systems?audience=students"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 transition"
                >
                  Explore Student Systems
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
