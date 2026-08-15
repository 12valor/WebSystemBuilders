"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type PaymongoCheckoutProps = {
  systemId: string;
  systemSlug: string;
  systemTitle: string;
  priceFormatted: string;
};

export function PaymongoCheckout({ systemId, systemSlug, systemTitle, priceFormatted }: PaymongoCheckoutProps) {
  const router = useRouter();
  const [accepted, setAccepted] = useState({ terms: false, license: false, refund: false, delivery: false });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ready = Object.values(accepted).every(Boolean) && !pending;

  async function continueToPayment() {
    if (!ready) return;
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/paymongo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemId }),
      });

      if (response.status === 401) {
        router.push(`/auth/sign-in?next=${encodeURIComponent(`/checkout/${systemSlug}`)}`);
        return;
      }

      const payload = (await response.json()) as { checkoutUrl?: unknown };
      if (!response.ok || typeof payload.checkoutUrl !== "string") throw new Error("checkout_unavailable");

      const checkoutUrl = new URL(payload.checkoutUrl);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.paymongo.com") {
        throw new Error("untrusted_checkout_url");
      }
      window.location.assign(checkoutUrl.toString());
    } catch {
      setError("We couldn't start the payment. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Secure payment</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.035em]">Continue with PayMongo</h2>
      <p className="mt-3 text-sm leading-6 text-secondary">
        Pay {priceFormatted} for {systemTitle} through PayMongo&apos;s hosted checkout. Available methods are limited to those enabled by the merchant.
      </p>

      <div className="mt-5 rounded-xl border border-sky-400/20 bg-sky-400/10 p-4 text-xs leading-5 text-sky-100">
        PayMongo is configured for test mode only. No live payment should be made from this checkout.
      </div>

      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-semibold">Confirm before continuing</legend>
        <Acknowledgement checked={accepted.terms} onChange={(checked) => setAccepted((value) => ({ ...value, terms: checked }))}>
          I agree to the <Link href="/legal/terms" className="underline underline-offset-2">terms of service</Link>.
        </Acknowledgement>
        <Acknowledgement checked={accepted.license} onChange={(checked) => setAccepted((value) => ({ ...value, license: checked }))}>
          I understand the published license applies to this purchase.
        </Acknowledgement>
        <Acknowledgement checked={accepted.refund} onChange={(checked) => setAccepted((value) => ({ ...value, refund: checked }))}>
          I reviewed the <Link href="/legal/refunds" className="underline underline-offset-2">refund policy</Link>.
        </Acknowledgement>
        <Acknowledgement checked={accepted.delivery} onChange={(checked) => setAccepted((value) => ({ ...value, delivery: checked }))}>
          I understand delivery begins only after verified payment and administrator preparation.
        </Acknowledgement>
      </fieldset>

      {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}

      <button
        type="button"
        disabled={!ready}
        aria-busy={pending}
        onClick={continueToPayment}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Preparing secure checkout…" : "Continue to secure payment"}
      </button>
    </div>
  );
}

function Acknowledgement({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 shrink-0 accent-white"
      />
      <span>{children}</span>
    </label>
  );
}
