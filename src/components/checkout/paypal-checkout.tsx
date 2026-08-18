"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createElement, useCallback, useState } from "react";

type PayPalApproveData = { orderId?: string };
type PayPalSession = { start: (options: { presentationMode: "auto" }, orderPromise: Promise<string>) => Promise<void> };
type PayPalInstance = {
  findEligibleMethods: (options: { currencyCode: "PHP" }) => Promise<{ isEligible: (method: string) => boolean }>;
  createPayPalOneTimePaymentSession: (callbacks: {
    onApprove: (data: PayPalApproveData) => Promise<void>;
    onCancel: () => Promise<void>;
    onError: () => void;
  }) => PayPalSession;
};

declare global {
  interface Window {
    paypal?: { createInstance: (options: { clientToken: string; components: string[]; pageType: "checkout" }) => Promise<PayPalInstance> };
  }
}

type Props = {
  systemId: string;
  systemTitle: string;
  priceFormatted: string;
  sdkUrl: string;
};

export function PayPalCheckout(props: Props) {
  const router = useRouter();
  const [accepted, setAccepted] = useState({ terms: false, license: false, refund: false, delivery: false });
  const [paypalInstance, setPayPalInstance] = useState<PayPalInstance | null>(null);
  const [eligible, setEligible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ready = Object.values(accepted).every(Boolean) && eligible && !pending;

  const initialize = useCallback(async () => {
    try {
      const response = await fetch("/api/payments/paypal/client-token", { method: "POST", cache: "no-store" });
      const token = (await response.json()) as { clientToken?: unknown; error?: unknown };
      if (!response.ok) {
        throw new Error(response.status === 401 ? "verified_account_required" : "token_unavailable");
      }
      if (typeof token.clientToken !== "string" || !window.paypal) throw new Error("sdk_unavailable");
      const instance = await window.paypal.createInstance({
        clientToken: token.clientToken,
        components: ["paypal-payments"],
        pageType: "checkout",
      });
      const methods = await instance.findEligibleMethods({ currencyCode: "PHP" });
      if (!methods.isEligible("paypal")) {
        setEligible(false);
        setError("PayPal Checkout is not eligible for this browser or location.");
        return;
      }
      setPayPalInstance(instance);
      setEligible(true);
    } catch (initializationError) {
      setEligible(false);
      setError(
        initializationError instanceof Error && initializationError.message === "verified_account_required"
          ? "Please verify your account before using PayPal Checkout."
          : "PayPal Checkout could not initialize. Please refresh and try again.",
      );
    }
  }, []);

  async function createOrder() {
    const response = await fetch("/api/payments/paypal/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemId: props.systemId }),
    });
    const payload = (await response.json()) as { providerOrderId?: unknown; error?: unknown };
    if (!response.ok) {
      if (payload.error === "product_unavailable") throw new Error("product_unavailable");
      if (payload.error === "paypal_unavailable") throw new Error("paypal_unavailable");
      throw new Error("checkout_unavailable");
    }
    if (typeof payload.providerOrderId !== "string") throw new Error("checkout_unavailable");
    return payload.providerOrderId;
  }

  async function startPayment() {
    if (!ready || !paypalInstance) return;
    setPending(true);
    setError(null);
    let providerOrderId: string | null = null;
    const orderPromise = createOrder().then((orderId) => {
      providerOrderId = orderId;
      return orderId;
    });
    try {
      const paymentSession = paypalInstance.createPayPalOneTimePaymentSession({
        onApprove: async (data) => {
          const orderId = data.orderId ?? providerOrderId ?? await orderPromise;
          const capture = await fetch(`/api/payments/paypal/orders/${encodeURIComponent(orderId)}/capture`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          const payload = (await capture.json()) as { status?: unknown; orderNumber?: unknown };
          if (!capture.ok || typeof payload.status !== "string" || typeof payload.orderNumber !== "string") {
            throw new Error("capture_failed");
          }
          router.push(`/account/orders/${payload.orderNumber}?checkout=${payload.status === "COMPLETED" ? "paypal-success" : "processing"}`);
          router.refresh();
        },
        onCancel: async () => {
          const orderId = providerOrderId ?? await orderPromise.catch(() => null);
          if (orderId) {
            await fetch(`/api/payments/paypal/orders/${encodeURIComponent(orderId)}/cancel`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reason: "popup_closed" }),
            });
          }
          setPending(false);
          setError("PayPal Checkout was closed. No payment was recorded.");
        },
        onError: () => {
          setPending(false);
          setError("PayPal Checkout could not be opened. Please try again.");
        },
      });
      await paymentSession.start({ presentationMode: "auto" }, orderPromise);
    } catch (paymentError) {
      setPending(false);
      if (paymentError instanceof Error && paymentError.message === "product_unavailable") {
        setError("This system is not currently available for checkout. Please contact support.");
      } else if (paymentError instanceof Error && paymentError.message === "paypal_unavailable") {
        setError("PayPal could not create the order. Please try again shortly.");
      } else {
        setError("PayPal Checkout could not open. Check that popups are allowed, then try again.");
      }
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
      <Script src={props.sdkUrl} strategy="afterInteractive" onReady={() => { void initialize(); }} onError={() => setError("PayPal could not load.")} />
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Automatically verified</p>
      <h2 className="mt-3 text-2xl font-semibold">Pay securely with PayPal</h2>
      <p className="mt-3 text-sm leading-6 text-secondary">
        Pay {props.priceFormatted} for {props.systemTitle}. PayPal confirms payment automatically; file delivery remains administrator-prepared.
      </p>
      <fieldset className="mt-6 space-y-3">
        <legend className="text-sm font-semibold">Confirm before continuing</legend>
        <Acknowledgement checked={accepted.terms} onChange={(value) => setAccepted((state) => ({ ...state, terms: value }))}>
          I agree to the <Link href="/legal/terms" className="underline">terms of service</Link>.
        </Acknowledgement>
        <Acknowledgement checked={accepted.license} onChange={(value) => setAccepted((state) => ({ ...state, license: value }))}>
          I understand the published license applies to this purchase.
        </Acknowledgement>
        <Acknowledgement checked={accepted.refund} onChange={(value) => setAccepted((state) => ({ ...state, refund: value }))}>
          I reviewed the <Link href="/legal/refunds" className="underline">refund policy</Link>.
        </Acknowledgement>
        <Acknowledgement checked={accepted.delivery} onChange={(value) => setAccepted((state) => ({ ...state, delivery: value }))}>
          I understand verified payment and administrator-prepared delivery are separate steps.
        </Acknowledgement>
      </fieldset>
      {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}
      {!eligible && !error && <p className="mt-5 text-sm text-secondary">Checking PayPal availability…</p>}
      <div className="mt-6" aria-busy={pending}>
        {createElement("paypal-button", {
          type: "pay",
          disabled: !ready,
          onClick: startPayment,
          class: `block min-h-12 w-full ${ready ? "cursor-pointer" : "pointer-events-none opacity-50"}`,
        })}
      </div>
    </div>
  );
}

function Acknowledgement({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: React.ReactNode }) {
  return <label className="flex items-start gap-3 text-sm leading-6 text-secondary"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 size-4" /><span>{children}</span></label>;
}
