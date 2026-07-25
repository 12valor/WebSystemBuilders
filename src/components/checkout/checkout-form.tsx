"use client";

import Link from "next/link";
import { useActionState } from "react";
import { startCheckout, type CheckoutState } from "@/features/orders/checkout-actions";

const initialState: CheckoutState = { status: "idle" };

export function CheckoutForm({ systemSlug }: { systemSlug: string }) {
  const [state, action, pending] = useActionState(startCheckout, initialState);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="systemSlug" value={systemSlug} />
      {state.message && <div role="alert" className={`rounded-xl border p-4 text-sm leading-6 ${state.status === "unavailable" ? "border-amber-400/30 bg-amber-400/[0.06] text-amber-100" : "border-red-400/30 bg-red-400/[0.06] text-red-100"}`}>{state.message}</div>}
      <Field label="Full name" name="customerName" type="text" autoComplete="name" defaultValue={state.values?.customerName} error={state.fieldErrors?.customerName?.[0]} />
      <Field label="Email for receipt and delivery" name="customerEmail" type="email" autoComplete="email" defaultValue={state.values?.customerEmail} error={state.fieldErrors?.customerEmail?.[0]} />
      <fieldset className="grid gap-3 border-t border-white/10 pt-5">
        <legend className="mb-3 text-sm font-semibold">Required review</legend>
        <Acknowledgement name="termsAccepted" error={state.fieldErrors?.termsAccepted?.[0]}>I accept the <Link href="/legal/terms" target="_blank" className="underline underline-offset-4">terms of sale</Link>.</Acknowledgement>
        <Acknowledgement name="licenseAccepted" error={state.fieldErrors?.licenseAccepted?.[0]}>I reviewed the <Link href="/legal/license" target="_blank" className="underline underline-offset-4">software license</Link>, product requirements, and included files.</Acknowledgement>
        <Acknowledgement name="refundAccepted" error={state.fieldErrors?.refundAccepted?.[0]}>I reviewed the <Link href="/legal/refunds" target="_blank" className="underline underline-offset-4">digital-product refund policy</Link> and its mandatory exceptions.</Acknowledgement>
        <Acknowledgement name="deliveryAccepted" error={state.fieldErrors?.deliveryAccepted?.[0]}>I reviewed the <Link href="/legal/delivery" target="_blank" className="underline underline-offset-4">private delivery process</Link>.</Acknowledgement>
      </fieldset>
      <button type="submit" disabled={pending} className="mt-1 inline-flex min-h-12 items-center justify-center rounded-[10px] bg-foreground px-5 text-sm font-semibold text-background disabled:cursor-wait disabled:bg-white/15 disabled:text-muted">
        {pending ? "Opening secure payment..." : "Continue to PayMongo"}
      </button>
      <p className="text-xs leading-5 text-muted">A pending order is created before PayMongo opens. Payment is confirmed only by a verified provider notification.</p>
    </form>
  );
}

function Field({ label, name, error, ...input }: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const errorId = `${name}-error`;
  return <label className="grid gap-2 text-sm font-semibold">{label}<input {...input} name={name} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="min-h-12 rounded-[10px] border border-white/15 bg-background px-4 font-normal outline-none focus:border-brand-hover" />{error && <span id={errorId} className="text-xs font-normal text-red-300">{error}</span>}</label>;
}

function Acknowledgement({ name, error, children }: { name: string; error?: string; children: React.ReactNode }) {
  return <label className="grid grid-cols-[20px_1fr] gap-x-3 text-sm leading-6 text-secondary"><input type="checkbox" name={name} className="mt-1 size-4 accent-blue-500" /><span>{children}</span>{error && <span className="col-start-2 text-xs text-red-300">{error}</span>}</label>;
}