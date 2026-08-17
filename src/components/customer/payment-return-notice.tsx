"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100">
        <p className="font-semibold">Payment was not completed.</p>
        <p className="mt-1 leading-6">No payment was recorded. You can start checkout again safely.</p>
        <Link href={`/checkout/${productSlug}`} className="mt-3 inline-flex font-semibold underline underline-offset-4">Retry secure payment</Link>
      </div>
    );
  }

  if (!checkout || !["paypal-success", "processing"].includes(checkout)) return null;
  if (paymentStatus === "paid") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-emerald-100">
        <p className="font-semibold">Payment confirmed.</p>
        <p className="mt-1 leading-6">Your PayPal payment was verified automatically. Delivery is awaiting administrator preparation.</p>
      </div>
    );
  }

  return (
    <div role="status" className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-5 text-sm text-sky-100">
      <p className="font-semibold">Payment verification is still pending.</p>
      <p className="mt-1 leading-6">This page will refresh briefly while capture or the signed PayPal webhook is reconciled. Browser navigation never marks an order paid.</p>
    </div>
  );
}
