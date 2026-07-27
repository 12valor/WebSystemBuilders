"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "callback") {
        setError("Authentication callback failed. Please try signing in again.");
      } else if (errorParam === "configuration") {
        setError("Authentication is not configured on this environment.");
      } else {
        setError(errorParam);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-slate-900">
          Sign in to your account
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">
          Access your ready-made systems, orders, and custom builds
        </p>
      </div>

      <div className="bg-white py-8 px-6 sm:px-9 border border-slate-200/90 rounded-2xl shadow-sm">
        <SocialAuthButtons onError={(err) => setError(err)} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-slate-700">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="size-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20"
              />
              <span className="ml-2.5">Remember me</span>
            </label>
          </div>

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
                <span>Signing in...</span>
              </>
            ) : (
              "Sign in with email"
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/get-started" className="font-semibold text-slate-900 hover:underline underline-offset-4 transition-colors">
          Get started
        </Link>
      </p>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-center text-xs text-slate-500 py-12">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
