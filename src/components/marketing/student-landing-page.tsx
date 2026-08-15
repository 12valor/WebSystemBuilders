"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export function StudentLandingPage() {
  return (
    <div className="bg-white font-sans min-h-screen text-slate-900 selection:bg-purple-500 selection:text-white">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main-content">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/30 to-slate-50/80 border-b border-slate-200/80 py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 border border-purple-200/80 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-purple-700">
                <span className="size-2 rounded-full bg-purple-600 animate-pulse" />
                For Students & Academic Developers
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

            {/* Right Abstract Vector Graphic Cluster */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-purple-600/10 via-indigo-600/10 to-blue-600/10 p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between overflow-hidden">
                <div className="absolute -top-12 -right-12 size-48 rounded-full bg-purple-500/10 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-blue-500/10 blur-2xl" />

                {/* Floating Graduation Cap Icon Card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="self-start rounded-2xl bg-white p-4 shadow-lg border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="size-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Academic Scope</span>
                    <span className="block text-[0.68rem] text-slate-500">Ethical Technical Mentoring</span>
                  </div>
                </motion.div>

                {/* Center Floating Code Window */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="mx-auto w-full rounded-2xl bg-slate-900 p-4 text-white shadow-2xl border border-slate-800 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <span className="size-2.5 rounded-full bg-red-500" />
                    <span className="size-2.5 rounded-full bg-amber-500" />
                    <span className="size-2.5 rounded-full bg-emerald-500" />
                    <span className="ml-2 text-[0.65rem] text-slate-400">capstone_core.ts</span>
                  </div>
                  <div className="text-purple-400 font-semibold">interface SystemRequirements &#123;</div>
                  <div className="pl-4 text-slate-300">approvedScope: boolean;</div>
                  <div className="pl-4 text-slate-300">verifiedDatabase: PostgreSQL;</div>
                  <div className="pl-4 text-blue-400">cleanCodebase: true;</div>
                  <div className="text-purple-400 font-semibold">&#125;</div>
                </motion.div>

                {/* Database Cylinder Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="self-end rounded-2xl bg-white p-4 shadow-lg border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="size-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Database & APIs</span>
                    <span className="block text-[0.68rem] text-slate-500">Fully Documented Schema</span>
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
                {/* Card 01 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
                >
                  <span className="absolute right-4 top-4 text-6xl font-black text-slate-200/60 select-none pointer-events-none font-mono">
                    01
                  </span>

                  <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                      System Development
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600">
                      Build custom software around reviewed functional requirements, approved thesis specifications, and an agreed technical scope.
                    </p>
                  </div>
                </motion.div>

                {/* Card 02 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
                >
                  <span className="absolute right-4 top-4 text-6xl font-black text-slate-200/60 select-none pointer-events-none font-mono">
                    02
                  </span>

                  <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      Templates & Foundations
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600">
                      Use a ready-made system as a starting foundation when its features, database model, and license match your project needs.
                    </p>
                  </div>
                </motion.div>

                {/* Card 03 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between"
                >
                  <span className="absolute right-4 top-4 text-6xl font-black text-slate-200/60 select-none pointer-events-none font-mono">
                    03
                  </span>

                  <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      Debugging & Deployment
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600">
                      Identify implementation errors, resolve build bugs, prepare database hosting, and assist with final presentation deployment.
                    </p>
                  </div>
                </motion.div>

                {/* Card 04 */}
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-7 shadow-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
                >
                  <span className="absolute right-4 top-4 text-6xl font-black text-slate-200/60 select-none pointer-events-none font-mono">
                    04
                  </span>

                  <div className="relative z-10 space-y-4">
                    <div className="size-12 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                      <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Documentation Guidance
                    </h3>

                    <p className="text-xs leading-relaxed text-slate-600">
                      Receive expert technical guidance for explaining system architecture, entity relationships, setup guides, and project limitations.
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
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-indigo-50/70 border border-indigo-100/90 p-8 sm:p-10 lg:p-12 shadow-sm space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-700">
                    Ethical Boundary & Policy
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">Academic Integrity Standard</h3>
                </div>
              </div>

              {/* Headline with left border accent */}
              <div className="border-l-4 border-indigo-600 pl-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                  Technical help should support your learning, not misrepresent it.
                </h2>
              </div>

              <div className="grid gap-4 text-xs sm:text-sm leading-relaxed text-slate-700 max-w-3xl">
                <p>
                  WebSystemBuilders provides software development, debugging, deployment assistance, documentation guidance, and technical mentoring.
                </p>
                <p>
                  Every student remains responsible for following school policies, understanding the submitted work, and presenting authorship honestly. No service guarantees grades or bypasses academic requirements.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
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
      </main>

      <SiteFooter />
    </div>
  );
}
