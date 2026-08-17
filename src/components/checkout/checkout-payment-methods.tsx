"use client";

import { useState } from "react";
import { PayPalCheckout } from "@/components/checkout/paypal-checkout";
import { ScanToPayCheckout } from "@/components/checkout/scan-to-pay-checkout";

type Props = {
  systemId: string;
  systemTitle: string;
  priceFormatted: string;
  userId: string;
  verifiedEmail: string;
  paypalSdkUrl: string | null;
  paymentQrUrl: string | null;
  paymentInstructions: string | null;
};

export function CheckoutPaymentMethods(props: Props) {
  const paypalAvailable = Boolean(props.paypalSdkUrl);
  const manualAvailable = Boolean(props.paymentQrUrl?.trim() && props.paymentInstructions?.trim());
  const [method, setMethod] = useState<"paypal" | "manual">(paypalAvailable ? "paypal" : "manual");

  return (
    <div>
      <fieldset className="mb-5 grid gap-3 sm:grid-cols-2">
        <legend className="mb-3 text-sm font-semibold">Payment method</legend>
        <Method checked={method === "paypal"} disabled={!paypalAvailable} onChange={() => setMethod("paypal")} title="PayPal" detail="Automatically verified" />
        <Method checked={method === "manual"} disabled={!manualAvailable} onChange={() => setMethod("manual")} title="GCash / QRPH" detail="Manual verification" />
      </fieldset>
      {method === "paypal" && props.paypalSdkUrl ? (
        <PayPalCheckout
          systemId={props.systemId}
          systemTitle={props.systemTitle}
          priceFormatted={props.priceFormatted}
          sdkUrl={props.paypalSdkUrl}
        />
      ) : null}
      {method === "manual" && manualAvailable ? (
        <ScanToPayCheckout
          systemId={props.systemId}
          systemTitle={props.systemTitle}
          priceFormatted={props.priceFormatted}
          paymentQrUrl={props.paymentQrUrl!}
          paymentInstructions={props.paymentInstructions!}
          userId={props.userId}
          verifiedEmail={props.verifiedEmail}
        />
      ) : null}
    </div>
  );
}

function Method(props: { checked: boolean; disabled: boolean; onChange: () => void; title: string; detail: string }) {
  return (
    <label className={`flex min-h-16 items-start gap-3 rounded-xl border p-4 ${props.checked ? "border-white/35 bg-white/[0.06]" : "border-white/10"} ${props.disabled ? "opacity-45" : "cursor-pointer"}`}>
      <input type="radio" name="paymentMethod" checked={props.checked} disabled={props.disabled} onChange={props.onChange} className="mt-1" />
      <span><span className="block text-sm font-semibold">{props.title}</span><span className="mt-1 block text-xs text-muted">{props.disabled ? "Not configured" : props.detail}</span></span>
    </label>
  );
}
