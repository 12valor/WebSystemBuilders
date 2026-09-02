"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  Lock,
  Mail,
  PackageCheck,
  ShieldCheck,
  Tag,
  X,
} from "lucide-react";
import { PayPalLogo } from "@/components/checkout/payment-icons";

type PayPalApproveData = { orderId?: string };
type PayPalSdkErrorDetails = {
  name?: string;
  message?: string;
  code?: string;
  isRecoverable?: boolean;
};
type PayPalOrderReference = { orderId: string };
type PayPalSession = {
  start: (
    options: { presentationMode: "auto" },
    orderPromise: Promise<PayPalOrderReference>
  ) => Promise<void>;
};
type PayPalInstance = {
  findEligibleMethods: (options: {
    currencyCode: "PHP";
  }) => Promise<{ isEligible: (method: string) => boolean }>;
  createPayPalOneTimePaymentSession: (callbacks: {
    onApprove: (data: PayPalApproveData) => Promise<void>;
    onCancel: () => Promise<void>;
    onError: (error?: unknown) => void;
  }) => PayPalSession;
};

declare global {
  interface Window {
    paypal?: {
      createInstance: (options: {
        clientToken: string;
        components: string[];
        pageType: "checkout";
      }) => Promise<PayPalInstance>;
    };
  }
}

type Props = {
  systemId: string;
  systemTitle: string;
  priceFormatted: string;
  buyerEmail: string;
  sdkUrl: string;
};

export function PayPalCheckout(props: Props) {
  const router = useRouter();
  const [accepted, setAccepted] = useState({
    terms: false,
    license: false,
    refund: false,
    delivery: false,
  });
  const [paypalInstance, setPayPalInstance] = useState<PayPalInstance | null>(
    null
  );
  const [eligible, setEligible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Promo code state
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const agreementsAccepted = Object.values(accepted).every(Boolean);
  const ready = agreementsAccepted && eligible && !pending;

  const initialize = useCallback(async () => {
    try {
      const response = await fetch("/api/payments/paypal/client-token", {
        method: "POST",
        cache: "no-store",
      });
      const token = (await response.json()) as {
        clientToken?: unknown;
        error?: unknown;
      };
      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "verified_account_required"
            : "token_unavailable"
        );
      }
      if (typeof token.clientToken !== "string" || !window.paypal)
        throw new Error("sdk_unavailable");
      const instance = await window.paypal.createInstance({
        clientToken: token.clientToken,
        components: ["paypal-payments"],
        pageType: "checkout",
      });
      const methods = await instance.findEligibleMethods({
        currencyCode: "PHP",
      });
      if (!methods.isEligible("paypal")) {
        setEligible(false);
        setError(
          "PayPal Checkout is not eligible for this browser or location."
        );
        return;
      }
      setPayPalInstance(instance);
      setEligible(true);
    } catch (initializationError) {
      console.error(
        "[paypal-checkout] SDK initialization failed",
        getPayPalSdkErrorDetails(initializationError)
      );
      setEligible(false);
      setError(
        initializationError instanceof Error &&
          initializationError.message === "verified_account_required"
          ? "Please verify your account before using PayPal Checkout."
          : "PayPal Checkout could not initialize. Please refresh and try again."
      );
    }
  }, []);

  async function createOrder() {
    const response = await fetch("/api/payments/paypal/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemId: props.systemId }),
    });
    const payload = (await response.json()) as {
      providerOrderId?: unknown;
      error?: unknown;
    };
    if (!response.ok) {
      console.error("[paypal-checkout] Order creation failed", {
        status: response.status,
        error:
          typeof payload.error === "string"
            ? payload.error
            : "unknown_error",
      });
      if (payload.error === "product_unavailable")
        throw new Error("product_unavailable");
      if (payload.error === "paypal_unavailable")
        throw new Error("paypal_unavailable");
      throw new Error("checkout_unavailable");
    }
    if (typeof payload.providerOrderId !== "string")
      throw new Error("checkout_unavailable");
    return payload.providerOrderId;
  }

  async function startPayment() {
    if (!ready || !paypalInstance) return;
    setPending(true);
    setError(null);
    let providerOrderId: string | null = null;
    const orderPromise = createOrder().then((orderId) => {
      providerOrderId = orderId;
      return { orderId };
    });
    try {
      const paymentSession =
        paypalInstance.createPayPalOneTimePaymentSession({
          onApprove: async (data) => {
            const orderId =
              data.orderId ?? providerOrderId ?? (await orderPromise).orderId;
            const capture = await fetch(
              `/api/payments/paypal/orders/${encodeURIComponent(
                orderId
              )}/capture`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              }
            );
            const payload = (await capture.json()) as {
              status?: unknown;
              orderNumber?: unknown;
            };
            if (
              !capture.ok ||
              typeof payload.status !== "string" ||
              typeof payload.orderNumber !== "string"
            ) {
              throw new Error("capture_failed");
            }
            router.push(
              `/account/orders/${payload.orderNumber}?checkout=${
                payload.status === "COMPLETED"
                  ? "paypal-success"
                  : "processing"
              }`
            );
            router.refresh();
          },
          onCancel: async () => {
            const orderId =
              providerOrderId ??
              (await orderPromise.catch(() => null))?.orderId;
            if (orderId) {
              await fetch(
                `/api/payments/paypal/orders/${encodeURIComponent(
                  orderId
                )}/cancel`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reason: "popup_closed" }),
                }
              );
            }
            setPending(false);
            setError("PayPal Checkout was closed. No payment was recorded.");
          },
          onError: (sdkError) => {
            console.error(
              "[paypal-checkout] PayPal SDK session error",
              getPayPalSdkErrorDetails(sdkError)
            );
            setPending(false);
            setError("PayPal Checkout could not be opened. Please try again.");
          },
        });
      await paymentSession.start({ presentationMode: "auto" }, orderPromise);
    } catch (paymentError) {
      console.error("[paypal-checkout] Checkout start failed", {
        presentationMode: "auto",
        ...getPayPalSdkErrorDetails(paymentError),
      });
      setPending(false);
      if (
        paymentError instanceof Error &&
        paymentError.message === "product_unavailable"
      ) {
        setError(
          "This system is not currently available for checkout. Please contact support."
        );
      } else if (
        paymentError instanceof Error &&
        paymentError.message === "paypal_unavailable"
      ) {
        setError("PayPal could not create the order. Please try again shortly.");
      } else {
        setError(
          "PayPal Checkout could not open. Check that popups are allowed, then try again."
        );
      }
    }
  }

  function confirmPayment() {
    setReviewOpen(false);
    void startPayment();
  }

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoMessage("Coupon code is not applicable to fixed-tier software packages.");
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 text-slate-900 shadow-lg sm:p-8">
      <Script
        src={props.sdkUrl}
        strategy="afterInteractive"
        onReady={() => {
          void initialize();
        }}
        onError={() => setError("PayPal could not load.")}
      />

      <div className="flex items-start justify-between gap-5 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Secure payment
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
            Complete your purchase with PayPal
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Review the purchase terms, then confirm the final details before PayPal opens.
          </p>
        </div>
        <div className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <PayPalLogo className="h-5 w-auto" />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-950">
        <div className="flex items-center gap-2 font-semibold">
          <ShieldCheck className="size-4 shrink-0 text-blue-700" />
          <span>PayPal-hosted authorization</span>
        </div>
        <p className="mt-1.5 leading-6 text-blue-900/80">
          You will approve <strong>{props.priceFormatted}</strong> for{" "}
          <strong>{props.systemTitle}</strong> in PayPal&apos;s secure checkout.
          Payment confirmation and private delivery are recorded separately.
        </p>
      </div>

      <fieldset className="mt-7 space-y-3">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          Required agreements
        </legend>
        <Acknowledgement
          checked={accepted.terms}
          onChange={(value) =>
            setAccepted((state) => ({ ...state, terms: value }))
          }
        >
          I agree to the{" "}
          <Link href="/legal/terms" className="font-semibold text-slate-900 underline hover:text-blue-700">
            terms of service
          </Link>
          .
        </Acknowledgement>
        <Acknowledgement
          checked={accepted.license}
          onChange={(value) =>
            setAccepted((state) => ({ ...state, license: value }))
          }
        >
          I understand the published software license applies to this purchase.
        </Acknowledgement>
        <Acknowledgement
          checked={accepted.refund}
          onChange={(value) =>
            setAccepted((state) => ({ ...state, refund: value }))
          }
        >
          I reviewed the{" "}
          <Link href="/legal/refunds" className="font-semibold text-slate-900 underline hover:text-blue-700">
            refund policy
          </Link>
          .
        </Acknowledgement>
        <Acknowledgement
          checked={accepted.delivery}
          onChange={(value) =>
            setAccepted((state) => ({ ...state, delivery: value }))
          }
        >
          I understand verified payment and private file delivery are separate steps.
        </Acknowledgement>
      </fieldset>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-950"
        >
          <p className="text-sm font-semibold">PayPal Checkout needs attention</p>
          <p className="mt-1 text-xs font-medium leading-5 text-red-800">{error}</p>
          <p className="mt-2 text-[11px] leading-5 text-red-700">
            Your browser console includes a safe PayPal diagnostic entry for this attempt.
          </p>
        </div>
      )}

      {!eligible && !error && (
        <p aria-live="polite" className="mt-6 text-xs font-medium text-slate-500">
          Initializing PayPal secure checkout…
        </p>
      )}

      <div aria-busy={pending} className="mt-7">
        {createElement("paypal-button", {
          type: "pay",
          disabled: !ready,
          onClick: () => setReviewOpen(true),
          class: `block min-h-13 w-full ${
            ready ? "cursor-pointer" : "pointer-events-none opacity-50"
          }`,
        })}
        {!agreementsAccepted && (
          <p className="mt-2 text-center text-xs leading-5 text-slate-500">
            Accept all required agreements to continue.
          </p>
        )}
        {pending && (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700"
          >
            <span className="size-2 animate-pulse rounded-full bg-blue-600 motion-reduce:animate-none" />
            Opening secure PayPal checkout…
          </div>
        )}
      </div>

      <div className="mt-7 border-t border-slate-100 pt-5">
        {!showPromoInput ? (
          <button
            type="button"
            onClick={() => setShowPromoInput(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition cursor-pointer"
          >
            <Tag className="size-3.5" />
            <span>Have a promo code?</span>
          </button>
        ) : (
          <form onSubmit={handleApplyPromo} className="space-y-2 text-xs">
            <label className="block font-semibold text-slate-700">
              Promo or Discount Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  setPromoMessage(null);
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className="text-[11px] text-amber-700 font-medium">
                {promoMessage}
              </p>
            )}
          </form>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-emerald-700" />
          <span>Payment details stay with PayPal</span>
        </span>
        <span>Charge currency: PHP</span>
      </div>

      <ReviewAndPayDialog
        open={reviewOpen}
        systemTitle={props.systemTitle}
        priceFormatted={props.priceFormatted}
        buyerEmail={props.buyerEmail}
        onClose={() => setReviewOpen(false)}
        onConfirm={confirmPayment}
      />
    </div>
  );
}

function ReviewAndPayDialog({
  open,
  systemTitle,
  priceFormatted,
  buyerEmail,
  onClose,
  onConfirm,
}: {
  open: boolean;
  systemTitle: string;
  priceFormatted: string;
  buyerEmail: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="paypal-review-title"
      aria-describedby="paypal-review-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#111214] p-0 text-white shadow-2xl backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
    >
      <div className="border-b border-white/10 px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-300">
              Final review
            </p>
            <h2 id="paypal-review-title" className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Review and pay
            </h2>
            <p id="paypal-review-description" className="mt-2 text-sm leading-6 text-slate-400">
              Confirm these details before the secure PayPal window opens.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close payment review"
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-xs text-slate-400">System</p>
              <p className="mt-1 text-sm font-semibold leading-5 text-white">{systemTitle}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xs text-slate-400">Total</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-white">{priceFormatted}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <ReviewRow icon={Mail} label="Buyer email" value={buyerEmail} />
          <ReviewRow icon={Check} label="Agreements" value="All required policies reviewed" />
          <ReviewRow icon={PackageCheck} label="Delivery" value="Prepared separately after verified payment" />
        </div>

        <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.07] p-4 text-xs leading-5 text-amber-100">
          Confirming opens PayPal to authorize the payment. It does not mark the order paid or make files available until the server verifies the transaction.
        </div>
      </div>

      <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-white/10 bg-[#111214] px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-lg border border-white/15 px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
        >
          <Lock className="size-4" />
          Continue to PayPal
        </button>
      </div>
    </dialog>
  );
}

function ReviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Check;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-blue-300">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-0.5 break-words font-medium leading-5 text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function Acknowledgement({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-600 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span>{children}</span>
    </label>
  );
}

function getPayPalSdkErrorDetails(error: unknown): PayPalSdkErrorDetails {
  if (!error || (typeof error !== "object" && typeof error !== "string"))
    return {};
  if (typeof error === "string") return { message: error };

  const candidate = error as Record<string, unknown>;
  const details: PayPalSdkErrorDetails = {};
  if (typeof candidate.name === "string") details.name = candidate.name;
  if (typeof candidate.message === "string") details.message = candidate.message;
  if (typeof candidate.code === "string") details.code = candidate.code;
  if (typeof candidate.isRecoverable === "boolean")
    details.isRecoverable = candidate.isRecoverable;
  return details;
}
