"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { AuthShell } from "@/components/auth/auth-shell";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email || email === "your email") return;
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.resend({
        type: "signup",
        email,
      });
      setResent(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-[#0c0e12] py-10 px-8 shadow-2xl border border-slate-800/90 rounded-2xl text-center">
        {/* Large Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border-4 border-emerald-500/20"
        >
          <svg className="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-white">
          Verify Your Email
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">
          We&apos;ve sent a verification link to <span className="font-semibold text-slate-200">{email}</span>. Please check your inbox and click the link to activate your account.
        </p>

        {resent && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">
            A new verification link has been sent to your email.
          </div>
        )}

        <div className="mt-8 space-y-3">
          <a
            href={`mailto:${email}`}
            className="inline-flex w-full min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all"
          >
            Open Email App
          </a>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || resent}
            className="inline-flex w-full min-h-11 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            {loading ? "Resending..." : resent ? "Link Sent ✓" : "Resend Email"}
          </button>
        </div>

        <div className="mt-8 border-t border-slate-800/80 pt-6">
          <Link href="/onboarding" className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Already verified? Continue to Onboarding →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell>
      <Suspense fallback={<div className="text-center text-xs text-slate-500 py-12">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthShell>
  );
}
