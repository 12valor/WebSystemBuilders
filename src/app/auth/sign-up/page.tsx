"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("You must agree to the Terms and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch {
      setError("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  const passwordsMatch = confirmPassword.length > 0 ? password === confirmPassword : true;

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
            Create your account
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Get started with WebSystemBuilders to access ready-made systems and custom builds
          </p>
        </div>

        <div className="bg-[#111214] py-8 px-6 sm:px-9 border border-white/10 rounded-2xl shadow-xl">
          <SocialAuthButtons redirectToNext="/onboarding" onError={(err) => setError(err)} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
              <label htmlFor="fullName" className="block text-xs font-semibold tracking-wide text-slate-300">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="block w-full min-h-12 rounded-[10px] border border-white/15 bg-[#08090A] px-4 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:border-white/40 focus:bg-[#08090A] focus:outline-none focus:ring-1 focus:ring-white/20"
              />
            </div>

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

            <PasswordInput
              id="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />

            <div>
              <PasswordInput
                id="confirmPassword"
                label="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                error={!passwordsMatch ? "Passwords do not match" : undefined}
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 size-4 rounded border-white/20 bg-[#08090A] text-white focus:ring-white/20"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                I agree to the{" "}
                <Link href="/legal/terms" className="font-medium text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy" className="font-medium text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">
                  Privacy Policy
                </Link>
              </label>
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
                  <span>Creating account...</span>
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthShell>
  );
}
