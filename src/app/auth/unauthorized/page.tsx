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
      <main className="mx-auto grid min-h-[calc(100vh-75px)] w-[min(calc(100%-40px),720px)] place-items-center py-16 text-center md:w-[min(calc(100%-64px),720px)]">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/[0.06] text-sm font-semibold text-amber-200" aria-hidden="true">403</span>
          <h1 className="mt-6 text-[clamp(2.4rem,7vw,4.5rem)] font-semibold leading-none tracking-[-0.06em]">This account does not have administrator access.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-secondary">Signing in proves identity, but administrator access also requires a role granted by a super administrator.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/account" className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-foreground px-5 text-sm font-semibold text-background">Open customer account</Link>
            <form action={signOut}><button type="submit" className="inline-flex min-h-11 w-full items-center justify-center rounded-[9px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">Sign out</button></form>
          </div>
        </div>
      </main>
    </AuthShell>
  );
}
