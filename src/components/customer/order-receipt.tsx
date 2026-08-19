"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalOrder } from "@/features/customer/repository";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileCheck2,
  HelpCircle,
  Lock,
  Printer,
  Receipt,
  ShieldCheck,
  ExternalLink,
  Sparkles,
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

  const isPaid = order.payment_status === "paid" || ["verified", "completed", "paid"].includes(order.order_status);
  const canDownload = isPaid && order.delivery_available;
  const isPending = ["pending_verification", "pending", "processing"].includes(order.payment_status ?? order.order_status);
  const isJustSuccess = checkout === "paypal-success";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Screen-Only Controls Toolbar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to All Purchases</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <Printer className="size-3.5 text-slate-500" />
            <span>Print Receipt</span>
          </button>

          <Link
            href="/account/support"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <HelpCircle className="size-3.5 text-slate-500" />
            <span>Get Support</span>
          </Link>
        </div>
      </div>

      {/* Official Receipt Card */}
      <div
        id="order-receipt"
        className="relative rounded-3xl border border-slate-200/90 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.06)] overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Top Decorative Blue Accent Header */}
        <div className="h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

        <div className="p-6 sm:p-9 space-y-7">
          {/* Receipt Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-xs">
                  <span className="font-mono text-sm tracking-tighter">WSB</span>
                </div>
                <div>
                  <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                    WebSystemBuilders
                  </h1>
                  <span className="text-[11px] font-medium text-slate-500">Official Purchase Invoice & Receipt</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col sm:items-end items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isPaid ? "PAYMENT VERIFIED" : isPending ? "PENDING VERIFICATION" : "ORDER RECORD"}</span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 font-semibold">
                NO. {order.order_number}
              </span>
            </div>
          </div>

          {/* Celebratory Banner on Checkout Success */}
          {isJustSuccess && isPaid && (
            <div className="flex items-start gap-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 sm:p-5 text-sm print:hidden">
              <div className="size-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <Sparkles className="size-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-950">Payment Successful & Authenticated!</p>
                <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                  Your PayPal payment of {formatMoney(order.total_minor, order.currency)} has been verified automatically. Below is your official receipt and order summary.
                </p>
              </div>
            </div>
          )}

          {/* Receipt Info Grid (Customer & Order Metadata) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
            <div>
              <span className="block font-semibold uppercase tracking-wider text-[10px] text-slate-400">Order Date</span>
              <span className="mt-1 block font-bold text-slate-800">{formatDate(order.created_at)}</span>
            </div>
            <div>
              <span className="block font-semibold uppercase tracking-wider text-[10px] text-slate-400">Billed To</span>
              <span className="mt-1 block font-bold text-slate-800 truncate" title={userEmail ?? "Customer"}>
                {userEmail ?? "Customer"}
              </span>
            </div>
            <div>
              <span className="block font-semibold uppercase tracking-wider text-[10px] text-slate-400">Payment Gateway</span>
              <span className="mt-1 block font-bold text-slate-800">{providerLabel(order.payment_provider)}</span>
            </div>
            <div>
              <span className="block font-semibold uppercase tracking-wider text-[10px] text-slate-400">Order Status</span>
              <span className="mt-1 block font-bold capitalize text-emerald-700">{order.payment_status ?? order.order_status}</span>
            </div>
          </div>

          {/* Perforated Receipt Divider Cutout Effect */}
          <div className="relative my-2">
            <div className="border-t-2 border-dashed border-slate-200" />
            <div className="absolute -left-9 sm:-left-12 -top-3.5 size-7 rounded-full bg-[#FAFAFC] border border-slate-200/90 print:hidden" />
            <div className="absolute -right-9 sm:-right-12 -top-3.5 size-7 rounded-full bg-[#FAFAFC] border border-slate-200/90 print:hidden" />
          </div>

          {/* Itemized Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1">
              <span>Item & Specification</span>
              <div className="flex items-center gap-8">
                <span className="hidden sm:inline">Qty</span>
                <span>Amount</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-slate-900">{order.product_name}</h3>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70">
                    v{order.purchased_version}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Full Production Source Code, Database Schemas & Digital Documentation
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium pt-1">
                  <FileCheck2 className="size-3.5 text-emerald-600" />
                  <span>Single System Developer License • Perpetual Private Deliverable</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end sm:gap-8 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 text-sm">
                <span className="sm:hidden text-xs text-slate-500 font-medium">Quantity: 1</span>
                <span className="hidden sm:inline font-mono font-semibold text-slate-600">1</span>
                <span className="font-extrabold text-base text-slate-900">
                  {formatMoney(order.total_minor, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Financial Totals Breakdown */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span className="font-semibold text-slate-800">{formatMoney(order.total_minor, order.currency)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Platform & Automated Processing</span>
              <span className="font-semibold text-emerald-600">₱0.00 (Included)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Value-Added Tax (VAT)</span>
              <span className="font-semibold text-slate-500">₱0.00 (Zero-rated digital delivery)</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between text-sm">
              <div>
                <span className="font-extrabold text-slate-900 text-base">Total Amount Paid</span>
                <span className="block text-[11px] text-slate-500 font-medium">Billed and confirmed via PayPal</span>
              </div>
              <div className="text-right">
                <span className="font-black text-2xl text-blue-600 tracking-tight">
                  {formatMoney(order.total_minor, order.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction & Provider Verification Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Receipt className="size-4 text-slate-400" />
                <span className="font-bold uppercase tracking-wider text-[11px] text-slate-600">
                  Transaction Authentication Details
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Verified Server Capture</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <span className="text-slate-500 font-semibold block text-[11px]">PayPal Order ID</span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono text-xs font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/80 break-all">
                    {order.provider_order_id ?? "Pending"}
                  </code>
                  {order.provider_order_id && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.provider_order_id!, "paypal-order-id")}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer print:hidden"
                      title="Copy PayPal Order ID"
                    >
                      {copiedKey === "paypal-order-id" ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-semibold block text-[11px]">Capture / Transaction ID</span>
                <div className="flex items-center gap-1.5">
                  <code className="font-mono text-xs font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/80 break-all">
                    {order.provider_payment_id ?? "Pending"}
                  </code>
                  {order.provider_payment_id && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(order.provider_payment_id!, "provider-payment-id")}
                      className="p-1 text-slate-400 hover:text-slate-700 transition cursor-pointer print:hidden"
                      title="Copy Transaction ID"
                    >
                      {copiedKey === "provider-payment-id" ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment & Download Action Section */}
          {canDownload ? (
            <div className="rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/90 p-5 sm:p-6 space-y-4 shadow-sm print:hidden">
              <div className="flex items-start gap-3.5">
                <div className="size-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Download className="size-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-extrabold text-emerald-950 text-base">Your Software Package is Ready</h3>
                  <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                    Payment is confirmed. Generate an encrypted 1-hour secure link to download the complete source code package (.ZIP).
                  </p>
                </div>
              </div>

              <form action={openPortalDownload.bind(null, order.order_id)}>
                <button
                  type="submit"
                  className="blue-button w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-2.5 bg-[#2563EB] px-6 text-sm font-bold text-white shadow-md cursor-pointer"
                >
                  <Download className="size-4" />
                  <span>Download Deliverable (.ZIP)</span>
                </button>
              </form>
            </div>
          ) : isPaid ? (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-5 flex items-start gap-3.5 text-xs text-sky-900">
              <Clock className="size-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sky-950 text-sm">Delivery Status: Awaiting Administrator Preparation</p>
                <p className="leading-relaxed">
                  Your payment has been successfully recorded. An administrator is preparing the private download repository package. You will find your download in the <strong>System Downloads</strong> tab once ready.
                </p>
              </div>
            </div>
          ) : null}

          {/* Receipt Footer / Official Terms */}
          <div className="pt-6 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs font-bold text-slate-700">Thank you for choosing WebSystemBuilders!</p>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
              This electronic receipt confirms your verified purchase and perpetual license. For support, warranty, or implementation inquiries, contact support or visit your customer portal.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="size-3 text-slate-400" />
                <span>Encrypted Record</span>
              </span>
              <span>•</span>
              <span>websystembuilders.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}

function providerLabel(provider: string | null) {
  if (provider === "paypal") return "PayPal Checkout";
  if (provider === "manual") return "Legacy Manual";
  if (provider === "paymongo") return "PayMongo";
  return "Direct";
}
