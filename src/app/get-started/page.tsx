"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
          <Link href="/">
            <BrandLogo priority className="h-auto w-48" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/sign-in"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/get-started"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Role Selection Onboarding */}
      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto">
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
            What would you like to do?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base leading-7 text-slate-600"
          >
            Select how you want to start. Don&apos;t worry—you can easily buy or sell anytime with a single account.
          </motion.p>
        </div>

        {/* Cards Container */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {/* Buyer Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 transition hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl border border-blue-100">
                🛒
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                Buy Systems
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Browse premium web systems, templates, source codes, capstone projects, and digital products created by verified developers.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/auth/sign-up?role=buyer"
                className="inline-flex w-full min-h-12 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md transition group-hover:bg-blue-600"
              >
                Continue as Buyer →
              </Link>
            </div>
          </motion.div>

          {/* Seller Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4 }}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 transition hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl border border-emerald-100">
                💻
              </div>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                Sell Systems
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Publish your own web systems, manage digital products, earn money, and grow your developer portfolio with buyers worldwide.
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/auth/sign-up?role=seller"
                className="inline-flex w-full min-h-12 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white shadow-md transition group-hover:bg-blue-600"
              >
                Continue as Seller →
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </main>
    </div>
  );
}
