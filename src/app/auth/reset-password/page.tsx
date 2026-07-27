"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput } from "@/components/auth/password-input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2500);
      }
    } catch {
      setError("Could not update password.");
    } finally {
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
            Create new password
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Set a strong new password with at least 8 characters
          </p>
        </div>

        <div className="bg-[#111214] py-8 px-6 sm:px-9 border border-white/10 rounded-2xl shadow-xl">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto grid size-12 place-items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400 text-xl font-bold">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-slate-100">Password updated!</h2>
              <p className="text-xs text-slate-400">Redirecting you to sign in...</p>
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

              <PasswordInput
                id="password"
                label="New password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />

              <PasswordInput
                id="confirmPassword"
                label="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                error={!passwordsMatch ? "Passwords do not match" : undefined}
              />

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
                    <span>Updating...</span>
                  </>
                ) : (
                  "Reset password"
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </AuthShell>
  );
}
