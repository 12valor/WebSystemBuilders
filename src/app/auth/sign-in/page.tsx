import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { isSiteUrlConfigured } from "@/lib/env/site";
import { getSafeNextPath } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Secure email access to WebSystemBuilders orders, downloads, and support.",
  robots: { index: false, follow: false },
};

const callbackMessages: Record<string, string> = {
  callback: "The sign-in link could not be verified. Request a new link and try again.",
  configuration: "Secure account access is not configured in this environment.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);
  const callbackMessage = params.error ? callbackMessages[params.error] : undefined;

  return (
    <AuthShell>
      <main className="mx-auto grid w-[min(calc(100%-40px),1120px)] gap-10 py-12 md:w-[min(calc(100%-64px),1120px)] md:py-20 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start lg:gap-20">
        <section className="pt-2 lg:sticky lg:top-12">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-hover">Customer and administrator access</p>
          <h1 className="mt-5 max-w-2xl text-[clamp(2.7rem,6vw,5rem)] font-semibold leading-[0.97] tracking-[-0.065em]">One verified email. Your account stays private.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-secondary sm:text-lg sm:leading-8">Receive a secure link to access eligible orders, protected downloads, support, or an authorized administrator workspace.</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <AccessRule number="01" title="Verify email">The link confirms control of the submitted address.</AccessRule>
            <AccessRule number="02" title="Check access">Server authorization determines what the account may open.</AccessRule>
            <AccessRule number="03" title="Protect records">Customers see only records associated with their identity.</AccessRule>
          </div>
          <p className="mt-6 text-xs leading-5 text-muted">Need a system first? <Link href="/systems" className="font-semibold text-secondary underline decoration-white/30 underline-offset-4 hover:text-foreground">Browse the catalog</Link>.</p>
        </section>

        <section aria-labelledby="sign-in-form-title">
          <div className="mb-5">
            <h2 id="sign-in-form-title" className="text-xl font-semibold tracking-[-0.03em]">Sign in securely</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">Enter your checkout or administrator email.</p>
          </div>
          {callbackMessage && <p className="mb-4 rounded-lg border border-red-300/20 bg-red-300/[0.06] p-3 text-sm leading-6 text-red-100" role="alert">{callbackMessage}</p>}
          <SignInForm
            nextPath={nextPath}
            configured={isSupabasePubliclyConfigured() && isSiteUrlConfigured()}
          />
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted">
            <Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/legal/delivery" className="hover:text-foreground">Delivery</Link>
          </div>
        </section>
      </main>
    </AuthShell>
  );
}

function AccessRule({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <article className="bg-surface p-5"><p className="text-xs font-semibold text-brand-hover">{number}</p><h2 className="mt-4 text-sm font-semibold">{title}</h2><p className="mt-2 text-xs leading-5 text-secondary">{children}</p></article>;
}
