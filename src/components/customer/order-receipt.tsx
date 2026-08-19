"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalOrder } from "@/features/customer/repository";
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Download,
  HelpCircle,
  Mail,
  Printer,
  ShieldCheck,
  User,
} from "lucide-react";

export function OrderReceipt({
  order,
  userEmail,
  checkout,
}: {
  order: CustomerPortalOrder;
  userEmail: string | null;
  checkout?: string;
}) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPaid =
    order.payment_status === "paid" ||
    ["verified", "completed", "paid"].includes(order.order_status);
  const canDownload = isPaid && Boolean(order.delivery_available);
  const isPending = ["pending_verification", "pending", "processing"].includes(
    order.payment_status ?? order.order_status
  );

  const formattedTotal = formatMoney(order.total_minor, order.currency);
  const formattedDate = formatDate(order.created_at);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to My Account</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="size-3.5 text-slate-500" />
            <span>Print Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Dark Split Canvas (Matching the reference UI) */}
      <div className="rounded-[36px] bg-[#0f1015] p-6 sm:p-10 lg:p-12 shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-slate-800/80">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
          {/* LEFT COLUMN: Floating Dark Card & Action Buttons */}
          <div className="space-y-6 lg:col-span-5 print:hidden">
            {/* The Dark Floating Summary Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1d1e26] to-[#14151b] border border-white/[0.12] p-6 sm:p-8 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6">
              {/* Top Hairline Sheen */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              {/* Amount & Timestamp */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                  Total Amount Paid
                </span>
                <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {formattedTotal}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pt-0.5">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span>{isPaid ? `Paid on ${formattedDate}` : `Due on ${formattedDate}`}</span>
                </div>
              </div>

              {/* Structured Key-Value Ledger List */}
              <div className="divide-y divide-white/[0.08] border-t border-white/[0.1] text-xs">
                {/* To */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">To</span>
                  <span className="font-semibold text-white truncate max-w-[200px] text-right" title={userEmail ?? "Customer"}>
                    {userEmail ?? "Customer"}
                  </span>
                </div>

                {/* From */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">From</span>
                  <span className="font-semibold text-white">WebSystemBuilders</span>
                </div>

                {/* Order ID */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Order ID</span>
                  <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.1] px-2.5 py-1 rounded-lg font-mono text-[11px] text-slate-200">
                    <span className="truncate max-w-[130px] sm:max-w-[160px]">{order.order_number}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.order_number, "order-id")}
                      className="text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copiedKey === "order-id" ? (
                        <Check className="size-3 text-emerald-400" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>{isPaid ? "Paid & Reconciled" : "Pending"}</span>
                  </span>
                </div>
              </div>

              {/* Inset Fulfillment Note Callout */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-4 text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Fulfillment Status
                </div>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {canDownload
                    ? "Payment confirmed via PayPal. Your software deliverable package is ready for download."
                    : isPaid
                      ? "Payment confirmed. Private package is awaiting administrator preparation."
                      : "Please complete your payment to unlock the deliverable."}
                </p>
              </div>
            </div>

            {/* Primary Action Button (The Large White Pill Button) */}
            <div className="space-y-3">
              {canDownload ? (
                <form action={openPortalDownload.bind(null, order.order_id)}>
                  <button
                    type="submit"
                    className="w-full min-h-14 rounded-full bg-white text-slate-950 font-extrabold text-sm sm:text-base hover:bg-slate-100 active:scale-[0.99] transition shadow-lg flex items-center justify-center gap-2.5 cursor-pointer"
                  >
                    <Download className="size-5 text-slate-950" />
                    <span>Download Software ({formattedTotal})</span>
                  </button>
                </form>
              ) : isPaid ? (
                <div className="w-full min-h-14 rounded-full bg-white/95 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg text-center px-4">
                  <Clock className="size-4 text-slate-950 shrink-0" />
                  <span>Delivery Awaiting Admin Preparation</span>
                </div>
              ) : (
                <Link
                  href={`/checkout/${order.product_slug}`}
                  className="w-full min-h-14 rounded-full bg-white text-slate-950 font-extrabold text-sm sm:text-base hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Pay {formattedTotal}</span>
                </Link>
              )}

              {/* Secondary Actions */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <Printer className="size-3.5 text-slate-400" />
                  <span>Print Invoice</span>
                </button>

                <Link
                  href="/account/support"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition"
                >
                  <HelpCircle className="size-3.5 text-slate-400" />
                  <span>Support</span>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Pure White Paper Invoice Sheet */}
          <div className="rounded-[28px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl lg:col-span-7 space-y-8 min-h-[580px] print:p-0 print:shadow-none print:rounded-none">
            {/* Header: Geometric Logo & Brand Title */}
            <div className="flex items-center gap-3.5">
              <BrandLogo priority className="size-11" />
              <div className="leading-tight">
                <h2 className="font-extrabold text-lg tracking-wider text-slate-950 uppercase">
                  WEBSYSTEMBUILDERS
                </h2>
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  STUDIOS & MARKETPLACE
                </span>
              </div>
            </div>

            {/* Merchant Details & Bill To Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed border-t border-slate-100 pt-6">
              {/* Merchant / From */}
              <div className="space-y-1 text-slate-600">
                <p className="font-bold text-slate-900">WebSystemBuilders Inc.</p>
                <p>Digital Software Systems & Source Delivery</p>
                <p>support@websystembuilders.com</p>
                <p>websystembuilders.com</p>
              </div>

              {/* Bill To / Customer */}
              <div className="space-y-1">
                <span className="block font-bold uppercase tracking-wider text-[10px] text-slate-400">
                  Bill To:
                </span>
                <p className="font-bold text-slate-900 text-sm truncate" title={userEmail ?? "Customer"}>
                  {userEmail ?? "Verified Customer"}
                </p>
                <p className="font-mono text-slate-500 text-[11px]">Invoice #{order.order_number}</p>
                <p className="text-slate-500">{formattedDate}</p>
              </div>
            </div>

            {/* Itemized Table (Items & Rate) */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
                <span>Items</span>
                <span>Rate</span>
              </div>

              {/* Line Item Row */}
              <div className="flex items-start justify-between gap-4 py-2 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 text-sm">{order.product_name}</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Version {order.purchased_version} • Complete Source Code, Database Architecture & Documentation
                  </p>
                </div>
                <div className="font-mono font-bold text-slate-900 text-sm text-right shrink-0">
                  {formattedTotal}
                </div>
              </div>
            </div>

            {/* Subtotal, Tax & Grand Total Breakdown */}
            <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-800">{formattedTotal}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span className="font-mono font-semibold text-slate-500">₱0.00</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">Grand Total</span>
                <span className="font-mono font-black text-xl sm:text-2xl text-slate-950">
                  {formattedTotal}
                </span>
              </div>
            </div>

            {/* Terms & Payment Method (Bottom of White Sheet) */}
            <div className="border-t border-slate-100 pt-6 space-y-2 text-xs text-slate-600">
              <span className="block font-bold text-slate-900">Terms</span>
              <p className="leading-relaxed">
                Payment Method: Payments should be made via PayPal Checkout to our verified merchant gateway.
              </p>
              <div className="font-mono text-[11px] text-slate-500 space-y-1 pt-1.5">
                <div className="flex items-center gap-1.5">
                  <span>PayPal Order ID:</span>
                  <span className="font-bold text-slate-700">{order.provider_order_id ?? "Verified"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Capture ID:</span>
                  <span className="font-bold text-slate-700">{order.provider_payment_id ?? "Reconciled"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span>Payment Status:</span>
                  <span>Paid & Reconciled (Completed)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
  }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}
