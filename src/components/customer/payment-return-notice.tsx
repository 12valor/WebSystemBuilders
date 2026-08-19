"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export function PaymentReturnNotice({
  checkout,
  paymentStatus,
  productSlug,
}: {
  checkout: string | undefined;
  paymentStatus: string | null;
  productSlug: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (checkout !== "processing" || !["pending", "processing"].includes(paymentStatus ?? "")) return;
    let refreshes = 0;
    const timer = window.setInterval(() => {
      refreshes += 1;
      router.refresh();
      if (refreshes >= 8) window.clearInterval(timer);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [checkout, paymentStatus, router]);

  if (checkout === "paypal-cancelled") {
    return (
      <div className="flex items-start gap-3.5 rounded-2xl border border-amber-200 bg-amber-50/90 p-5 text-sm shadow-2xs">
        <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">Payment was not completed</p>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            No payment was recorded. You can return to checkout whenever you are ready.
          </p>
          <div className="pt-2">
            <Link
              href={`/checkout/${productSlug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 underline underline-offset-4 hover:text-amber-950"
            >
              Retry secure payment →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!checkout || !["paypal-success", "processing"].includes(checkout)) return null;

  if (paymentStatus === "paid") {
    return (
      <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 text-sm shadow-2xs">
        <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-emerald-950">Payment confirmed via PayPal</p>
          <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
            Your PayPal payment was verified automatically. Delivery is awaiting administrator preparation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div role="status" className="flex items-start gap-3.5 rounded-2xl border border-sky-200 bg-sky-50/90 p-5 text-sm shadow-2xs">
      <RefreshCw className="size-5 text-sky-600 shrink-0 mt-0.5 animate-spin" />
      <div className="space-y-1">
        <p className="font-bold text-sky-950">Payment verification is pending</p>
        <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
          This page will refresh briefly while capture or the signed PayPal webhook is reconciled. Browser navigation never marks an order paid.
        </p>
      </div>
    </div>
  );
}
