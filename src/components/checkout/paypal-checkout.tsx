"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { createElement, useCallback, useState } from "react";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Building2,
  Smartphone,
  Info,
} from "lucide-react";

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
  sdkUrl: string;
};

type PaymentTab = "paypal" | "card" | "ewallet" | "invoice";

export function PayPalCheckout(props: Props) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<PaymentTab>("paypal");
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

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  // Promo code state
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const ready = Object.values(accepted).every(Boolean) && eligible && !pending;

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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoMessage("Coupon code is not applicable to fixed-tier software packages.");
  };

  return (
    <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-slate-200/90 text-slate-900 space-y-8">
      <Script
        src={props.sdkUrl}
        strategy="afterInteractive"
        onReady={() => {
          void initialize();
        }}
        onError={() => setError("PayPal could not load.")}
      />

      {/* 1. Payment Method Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Select Payment Method
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Option: PayPal */}
          <button
            type="button"
            onClick={() => setSelectedTab("paypal")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              selectedTab === "paypal"
                ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span className="font-extrabold text-blue-700 text-sm tracking-tight">
              PayPal
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5">
              Instant
            </span>
          </button>

          {/* Option: Card */}
          <button
            type="button"
            onClick={() => setSelectedTab("card")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              selectedTab === "card"
                ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="size-4 text-slate-700" />
            <span className="text-[10px] text-slate-600 font-semibold mt-1">
              Debit / Credit
            </span>
          </button>

          {/* Option: GCash / Maya */}
          <button
            type="button"
            onClick={() => setSelectedTab("ewallet")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              selectedTab === "ewallet"
                ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Smartphone className="size-4 text-slate-700" />
            <span className="text-[10px] text-slate-600 font-semibold mt-1">
              GCash / Maya
            </span>
          </button>

          {/* Option: Bank / Invoice */}
          <button
            type="button"
            onClick={() => setSelectedTab("invoice")}
            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
              selectedTab === "invoice"
                ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-2 ring-blue-600/20 shadow-xs"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Building2 className="size-4 text-slate-700" />
            <span className="text-[10px] text-slate-600 font-semibold mt-1">
              Bank Invoice
            </span>
          </button>
        </div>
      </div>

      {/* 2. Dynamic Payment Form / Actions */}
      {selectedTab === "paypal" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4.5 text-xs text-blue-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <ShieldCheck className="size-4 text-blue-700 shrink-0" />
              <span>Verified PayPal Merchant Gateway</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              Click the button below to authorize payment of{" "}
              <strong className="text-blue-950">{props.priceFormatted}</strong> for{" "}
              <strong>{props.systemTitle}</strong>. Your license and private package delivery will be logged instantly.
            </p>
          </div>

          {/* Agreements fieldset */}
          <fieldset className="space-y-3 pt-2">
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
              Required Agreements
            </legend>
            <Acknowledgement
              checked={accepted.terms}
              onChange={(value) =>
                setAccepted((state) => ({ ...state, terms: value }))
              }
            >
              I agree to the{" "}
              <Link href="/legal/terms" className="underline font-semibold text-slate-900 hover:text-blue-600">
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
              <Link href="/legal/refunds" className="underline font-semibold text-slate-900 hover:text-blue-600">
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
              className="rounded-2xl border-2 border-red-300/70 bg-red-950/80 p-4.5 text-red-50 shadow-[0_0_0_1px_rgba(248,113,113,0.12)]"
            >
              <p className="text-sm font-bold">PayPal Checkout needs attention</p>
              <p className="mt-1 text-xs font-medium leading-relaxed text-red-100">{error}</p>
              <p className="mt-2 text-[11px] leading-5 text-red-200/90">
                Your browser console now includes a safe PayPal diagnostic entry for this attempt.
              </p>
            </div>
          )}

          {!eligible && !error && (
            <p className="text-xs text-slate-500 font-medium">
              Initializing PayPal security bridge…
            </p>
          )}

          {/* Official PayPal Button */}
          <div aria-busy={pending} className="pt-2">
            {createElement("paypal-button", {
              type: "pay",
              disabled: !ready,
              onClick: startPayment,
              class: `block min-h-13 w-full rounded-full ${
                ready
                  ? "cursor-pointer"
                  : "pointer-events-none opacity-50"
              }`,
            })}
          </div>
        </div>
      )}

      {selectedTab === "card" && (
        <div className="space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Credit or Debit Card Payment
            </h3>
            <p className="text-xs text-slate-500">
              Direct card processing via PayPal Enterprise Hosted Fields.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Card Number
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  CVC / CVV
                </label>
                <input
                  type="text"
                  placeholder="3 digits"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Info className="size-3.5 text-amber-700" />
              <span>Card Processing Notice</span>
            </div>
            <p className="leading-relaxed">
              Direct card billing uses PayPal's encrypted payment frame. You can also select the PayPal option to pay with any credit card without needing a PayPal account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSelectedTab("paypal")}
            className="w-full min-h-12 rounded-full bg-slate-950 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="size-4" />
            <span>Continue with PayPal Card Gateway ({props.priceFormatted})</span>
          </button>
        </div>
      )}

      {selectedTab === "ewallet" && (
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              GCash / Maya e-Wallets
            </h3>
            <p className="text-slate-500">
              Philippine local e-wallet direct checkout.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-2.5 text-slate-700">
            <p className="font-semibold text-slate-900">
              Direct Local Payment Option
            </p>
            <p className="leading-relaxed">
              If you prefer paying via GCash, Maya, or direct local bank QR code instead of PayPal, please request an instant quotation via our support desk. We will generate a verified order record for your account.
            </p>
            <div className="pt-2">
              <Link
                href="/account/support"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 font-bold text-slate-900 shadow-2xs hover:bg-slate-50"
              >
                <span>Request Local Wallet Billing →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "invoice" && (
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">
              Official Corporate / Institutional Invoice
            </h3>
            <p className="text-slate-500">
              Wire transfer & BIR-compliant invoice receipt.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-2.5 text-slate-700">
            <p className="font-semibold text-slate-900">
              Institutional Purchase Order
            </p>
            <p className="leading-relaxed">
              For schools, colleges, and registered enterprises requiring a formal purchase order or official bank invoice before disbursement, our team provides custom quotation invoices.
            </p>
            <div className="pt-2">
              <Link
                href="/inquiries"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 font-bold text-slate-900 shadow-2xs hover:bg-slate-50"
              >
                <span>Submit Enterprise Quotation Request →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Promo Code Toggle & Input */}
      <div className="border-t border-slate-100 pt-5">
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

      {/* 4. Security & Trust Guarantee */}
      <div className="border-t border-slate-100 pt-5 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Lock className="size-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted Payment</span>
        </span>
        <span>Guaranteed Safe Checkout</span>
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
