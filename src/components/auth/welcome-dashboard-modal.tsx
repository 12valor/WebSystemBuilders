"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

function WelcomeDashboardModalContent() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const welcomeParam = searchParams.get("welcome");
    const signedInParam = searchParams.get("signedIn");

    if (welcomeParam === "true" || signedInParam === "true") {
      setIsOpen(true);

      // Clean up the URL parameter without forcing a page reload
      const url = new URL(window.location.href);
      url.searchParams.delete("welcome");
      url.searchParams.delete("signedIn");
      window.history.replaceState({}, "", url.pathname + url.search);

      // Fetch user profile info
      async function loadUser() {
        try {
          const supabase = createClient();
          const { data } = await supabase.auth.getUser();
          if (data?.user?.email) {
            setUserEmail(data.user.email);
          }
        } catch {
          // ignore
        }
      }
      loadUser();
    }
  }, [searchParams]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6 bg-slate-950/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto overscroll-contain bg-white border border-slate-200/90 shadow-2xl rounded-2xl p-5 sm:p-9 text-center antialiased"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 transition-colors p-2 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:right-4 sm:top-4"
            aria-label="Close modal"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Badge Icon */}
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 mb-5">
            <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            Welcome back!
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600">
            {userEmail ? (
              <>
                Signed in as <span className="font-semibold text-slate-900">{userEmail}</span>. Your customer dashboard is ready.
              </>
            ) : (
              "You have successfully signed in. Your customer dashboard is ready."
            )}
          </p>

          <div className="mt-7 space-y-3">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-colors"
            >
              <span>See your dashboard here</span>
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <div className="flex items-center justify-center gap-4 pt-2 text-xs">
              <Link
                href="/systems"
                onClick={() => setIsOpen(false)}
                className="font-medium text-slate-600 hover:text-slate-900 transition-colors underline-offset-4 hover:underline"
              >
                Browse systems catalog
              </Link>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                Stay on homepage
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function WelcomeDashboardModal() {
  return (
    <Suspense fallback={null}>
      <WelcomeDashboardModalContent />
    </Suspense>
  );
}
