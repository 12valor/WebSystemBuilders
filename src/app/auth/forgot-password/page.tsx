"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/auth-shell";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError("Could not send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-slate-100">
            Reset your password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Enter your email and we&apos;ll send you a secure password reset link
          </p>
        </div>

        <div className="bg-[#111214] py-8 px-6 sm:px-9 border border-white/10 rounded-2xl shadow-xl">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto grid size-12 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-slate-200">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-100">Check your inbox</h2>
              <p className="text-xs leading-relaxed text-slate-400">
                We sent a password reset link to <span className="font-semibold text-slate-200">{email}</span>.
              </p>
              <Link
                href="/auth/sign-in"
                className="mt-4 inline-flex w-full min-h-12 items-center justify-center rounded-[10px] bg-white px-5 text-sm font-semibold text-[#08090A] hover:bg-slate-200 transition-colors"
              >
                Return to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-[8px] border border-red-500/20 bg-red-950/30 p-3.5 text-xs leading-relaxed text-red-300"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-slate-300">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full min-h-12 rounded-[10px] border border-white/15 bg-[#08090A] px-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-white/40 focus:bg-[#08090A] focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-12 rounded-[10px] bg-white px-5 text-sm font-semibold text-[#08090A] hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="size-4 animate-spin text-[#08090A]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Sending link...</span>
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Remember your password?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
