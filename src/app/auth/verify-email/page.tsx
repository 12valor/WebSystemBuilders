"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/brand-logo";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 sm:px-8 font-sans text-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <BrandLogo priority className="h-auto w-44 mx-auto" />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-8 shadow-xl shadow-slate-200/50 border border-slate-200 rounded-2xl text-center">
          {/* Large Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border-4 border-emerald-50"
          >
            <svg className="size-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
            Verify Your Email
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We&apos;ve sent a verification link to <span className="font-semibold text-slate-900">{email}</span>. Please check your inbox and click the link to activate your account.
          </p>

          {resent && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              A new verification link has been sent to your email.
            </div>
          )}

          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${email}`}
              className="inline-flex w-full min-h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              Open Email App
            </a>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading || resent}
              className="inline-flex w-full min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              {loading ? "Resending..." : resent ? "Link Sent ✓" : "Resend Email"}
            </button>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <Link href="/onboarding" className="text-xs font-semibold text-blue-600 hover:underline">
              Already verified? Continue to Onboarding →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
