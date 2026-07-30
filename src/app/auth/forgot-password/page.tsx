"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/auth-shell";
import { TurnstileCaptcha, type TurnstileCaptchaRef } from "@/components/auth/turnstile-captcha";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<TurnstileCaptchaRef>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const effectiveCaptchaToken = captchaToken || (process.env.NODE_ENV !== "production" ? "DEV_PASS_TOKEN" : null);

    if (!effectiveCaptchaToken) {
      setError("Please complete the security verification.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        ...(effectiveCaptchaToken !== "DEV_PASS_TOKEN" ? { captchaToken: effectiveCaptchaToken } : {}),
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        turnstileRef.current?.reset();
        setCaptchaToken(null);
      } else {
        setSent(true);
      }
    } catch {
      setError("Could not send password reset email.");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-slate-900">
            Reset your password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Enter your email and we&apos;ll send you a secure password reset link
          </p>
        </div>

        <div className="bg-white py-8 px-6 sm:px-9 border border-slate-200/90 rounded-2xl shadow-sm">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="mx-auto grid size-12 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Check your inbox</h2>
              <p className="text-xs leading-relaxed text-slate-600">
                We sent a password reset link to <span className="font-semibold text-slate-900">{email}</span>.
              </p>
              <Link
                href="/auth/sign-in"
                className="mt-4 inline-flex w-full min-h-12 items-center justify-center rounded-[10px] bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
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
                    className="rounded-[8px] border border-red-200 bg-red-50/80 p-3.5 text-xs leading-relaxed text-red-700 font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="block w-full min-h-12 rounded-[10px] border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900/10"
                />
              </div>

              <TurnstileCaptcha
                ref={turnstileRef}
                onVerify={(token) => {
                  setCaptchaToken(token);
                  if (error && error.includes("security")) {
                    setError(null);
                  }
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={(err) => setError(err || "CAPTCHA verification failed.")}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-12 rounded-[10px] bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="size-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
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

        <p className="mt-6 text-center text-xs text-slate-600">
          Remember your password?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-slate-900 hover:underline underline-offset-4 transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
