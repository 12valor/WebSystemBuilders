"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/">
            <BrandLogo priority className="size-12" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Account Creation Entry */}
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24 text-center my-auto">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-600 border border-blue-200/60 mb-4"
        >
          Welcome to WebSystemBuilders
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
        >
          Explore & purchase ready-made web systems
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base leading-7 text-slate-600 max-w-xl mx-auto"
        >
          Create an account to browse ready-to-deploy software systems, request custom development, track purchases, and instantly access digital deliverables.
        </motion.p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/sign-up"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-8 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
          >
            Create Your Account &rarr;
          </Link>
          <Link
            href="/systems"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Browse Systems Catalog
          </Link>
        </div>

        <div className="mt-12 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        WebSystemBuilders • Operational Software Marketplace
      </footer>
    </div>
  );
}
