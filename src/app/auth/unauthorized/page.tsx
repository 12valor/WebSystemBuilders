import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { signOut } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "Access unavailable",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <AuthShell>
      <div id="main-content" className="mx-auto max-w-lg w-full py-12 text-center">
        <div className="bg-white p-8 sm:p-10 border border-slate-200/90 rounded-2xl shadow-sm">
          <span className="mx-auto grid size-12 place-items-center rounded-xl border border-amber-300 bg-amber-50 text-sm font-bold text-amber-800" aria-hidden="true">
            403
          </span>
          <h1 className="mt-6 text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-slate-900">
            This account does not have administrator access.
          </h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
            Signing in proves identity, but administrator access also requires an administrator role granted by a super administrator.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/account"
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-slate-900 px-5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
            >
              Open customer account
            </Link>
            <form action={signOut} className="w-full sm:w-auto">
              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-[10px] border border-slate-200 bg-white px-5 text-xs sm:text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-all"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
