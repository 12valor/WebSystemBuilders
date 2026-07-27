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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-[#111214] py-10 px-8 border border-white/10 rounded-2xl shadow-xl text-center">
        {/* Animated Checkmark */}
        <div className="mx-auto grid size-14 place-items-center rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
          <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="mt-6 text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-slate-100">
          Verify your email
        </h1>
        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">
          We&apos;ve sent a verification link to <span className="font-semibold text-slate-200">{email}</span>. Check your inbox and click the link to activate your account.
        </p>

        {resent && (
          <div className="mt-4 rounded-[8px] border border-emerald-500/20 bg-emerald-950/30 p-3 text-xs font-medium text-emerald-300">
            A new verification link has been sent to your email address.
          </div>
        )}

        <div className="mt-8 space-y-3">
          <a
            href={`mailto:${email}`}
            className="inline-flex w-full min-h-12 items-center justify-center rounded-[10px] bg-white px-5 text-sm font-semibold text-[#08090A] hover:bg-slate-200 transition-colors"
          >
            Open email app
          </a>

          <button
            type="button"
            onClick={handleResend}
            disabled={loading || resent}
            className="inline-flex w-full min-h-12 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.03] px-5 text-xs font-semibold text-slate-300 hover:bg-white/[0.08] hover:border-white/25 transition-all disabled:opacity-50"
          >
            {loading ? "Resending..." : resent ? "Link sent ✓" : "Resend verification email"}
          </button>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <Link href="/onboarding" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline">
            Already verified? Continue to onboarding &rarr;
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
