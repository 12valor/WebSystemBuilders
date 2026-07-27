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
        <div className="bg-[#0c0e12] p-8 sm:p-10 shadow-2xl border border-slate-800/90 rounded-2xl">
          <span className="mx-auto grid size-12 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm font-bold text-amber-300" aria-hidden="true">
            403
          </span>
          <h1 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight text-white">
            This account does not have administrator access.
          </h1>
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-400">
            Signing in proves identity, but administrator access also requires an administrator role granted by a super administrator.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/account"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all"
            >
              Open Customer Account
            </Link>
            <form action={signOut} className="w-full sm:w-auto">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900 px-5 text-xs sm:text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthShell>
  );
}
