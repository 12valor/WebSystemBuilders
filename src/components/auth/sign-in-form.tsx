"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestSignInLink,
  type SignInState,
} from "@/features/auth/actions";

const initialSignInState: SignInState = { status: "idle" };

export function SignInForm({ nextPath, configured }: { nextPath: string; configured: boolean }) {
  const [state, formAction, pending] = useActionState(requestSignInLink, initialSignInState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8" role="status">
        <span className="grid size-11 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] text-sm font-semibold text-emerald-300" aria-hidden="true">01</span>
        <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">Check your email</h2>
        <p className="mt-3 text-sm leading-6 text-secondary">{state.message}</p>
        <p className="mt-4 break-all rounded-lg border border-white/10 bg-background px-4 py-3 text-sm font-semibold text-foreground">{state.email}</p>
        <p className="mt-4 text-xs leading-5 text-muted">Open the newest link on the same device. The callback will verify the session before continuing.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 text-sm font-semibold hover:bg-white/[0.04]">Return home</Link>
      </div>
    );
  }

  const emailError = state.fieldErrors?.email?.[0];

  return (
    <form action={formAction} className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8" noValidate>
      <input type="hidden" name="next" value={nextPath} />
      <div>
        <label htmlFor="sign-in-email" className="text-sm font-semibold text-foreground">Email address</label>
        <p id="sign-in-email-hint" className="mt-2 text-xs leading-5 text-muted">Use the same address entered during checkout to access linked orders.</p>
        <input
          id="sign-in-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={state.email}
          aria-describedby={`sign-in-email-hint${emailError ? " sign-in-email-error" : ""}`}
          aria-invalid={Boolean(emailError)}
          disabled={!configured || pending}
          placeholder="you@example.com"
          className="mt-3 min-h-12 w-full rounded-[10px] border border-white/15 bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />
        {emailError && <p id="sign-in-email-error" className="mt-2 text-xs font-medium text-red-300">{emailError}</p>}
      </div>

      {state.message && (
        <p className={`mt-5 rounded-lg border p-3 text-sm leading-6 ${state.status === "unavailable" ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-100" : "border-red-300/20 bg-red-300/[0.06] text-red-100"}`} role="alert">
          {state.message}
        </p>
      )}

      {!configured && !state.message && (
        <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3 text-sm leading-6 text-amber-100" role="status">Secure account access is not connected yet. No email can be sent from this environment.</p>
      )}

      <button type="submit" disabled={!configured || pending} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted">
        {pending ? "Sending secure link..." : "Email me a secure sign-in link"}
      </button>
      <p className="mt-4 text-center text-xs leading-5 text-muted">No password is requested. Sign-in links are handled by the configured authentication provider.</p>
    </form>
  );
}
