"use client";

import { useState } from "react";
import Link from "next/link";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalOrder } from "@/features/customer/repository";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Download,
  FileCode,
  FileText,
  HelpCircle,
  Mail,
  Paperclip,
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
  const [showDetails, setShowDetails] = useState(false);
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
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <User className="size-4 text-slate-500" />
          <span>Go to My Account</span>
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

      {/* Main Container: Split 2-Column UI */}
      <div className="rounded-[32px] border border-slate-200/90 bg-white p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(15,23,42,0.04)] print:border-none print:shadow-none print:p-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          {/* LEFT COLUMN: The Official Invoice Sheet (cols 1-7) */}
          <div className="space-y-8 lg:col-span-7">
            {/* Header: Company Info + PAID Rubber Stamp */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                {/* Brand Icon & Name */}
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-xs">
                    <span className="font-mono text-base tracking-tighter">WSB</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                      WebSystemBuilders
                    </h2>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 font-medium space-y-0.5 leading-relaxed">
                  <p className="font-bold text-slate-700">WebSystemBuilders Inc.</p>
                  <p>support@websystembuilders.com</p>
                  <p>websystembuilders.com</p>
                </div>
              </div>

              {/* Tilted PAID Rubber Stamp Badge */}
              <div className="select-none pt-1">
                {isPaid ? (
                  <div className="inline-flex items-center justify-center rounded-xl border-[3px] border-emerald-500 bg-emerald-50/40 px-4 py-1.5 text-2xl sm:text-3xl font-black uppercase tracking-widest text-emerald-600 rotate-[9deg] shadow-xs">
                    PAID
                  </div>
                ) : isPending ? (
                  <div className="inline-flex items-center justify-center rounded-xl border-[3px] border-amber-500 bg-amber-50/40 px-3 py-1.5 text-xl sm:text-2xl font-black uppercase tracking-wider text-amber-600 rotate-[8deg] shadow-xs">
                    PENDING
                  </div>
                ) : (
                  <div className="inline-flex items-center justify-center rounded-xl border-[3px] border-slate-400 bg-slate-50 px-3 py-1.5 text-xl font-black uppercase tracking-wider text-slate-500 rotate-[8deg]">
                    UNPAID
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Rows: To / Issued On / Fulfillment */}
            <div className="border-t border-slate-100 pt-6 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-400 font-medium">To</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[280px]">
                  {userEmail ?? "Verified Customer"}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-400 font-medium">Issued On</span>
                <span className="font-bold text-slate-900">{formattedDate}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-400 font-medium">License & Access</span>
                <span className="font-bold text-slate-900">Perpetual Source License</span>
              </div>
            </div>

            {/* Invoice Heading */}
            <div className="space-y-1 pt-2">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Invoice for {formattedTotal}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-slate-500">
                <span>Invoice {order.order_number}</span>
                <span>•</span>
                <span>PO #{order.provider_order_id ?? "WSB-ORDER"}</span>
              </div>
            </div>

            {/* Thank You Note */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Thank you for choosing our ready-made systems. Please review this invoice carefully and contact our support team at{" "}
              <a
                href="mailto:support@websystembuilders.com"
                className="font-medium text-blue-600 hover:underline"
              >
                support@websystembuilders.com
              </a>{" "}
              for any questions or technical guidance.
            </p>

            {/* "See Details 📎 1" Toggle */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
              >
                {showDetails ? (
                  <ChevronUp className="size-3.5 text-slate-500" />
                ) : (
                  <ChevronDown className="size-3.5 text-slate-500" />
                )}
                <span>{showDetails ? "Hide Details" : "See Details"}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <Paperclip className="size-3" />
                  <span>1</span>
                </span>
              </button>

              {/* Expandable Itemized Details Drawer */}
              {showDetails && (
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5 space-y-4 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        v{order.purchased_version}
                      </span>
                      <h4 className="mt-1 text-sm font-bold text-slate-900">{order.product_name}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Production source package, complete database schema, and technical docs.
                      </p>
                    </div>
                    <span className="font-extrabold text-sm text-slate-900">{formattedTotal}</span>
                  </div>

                  <div className="space-y-1.5 text-slate-600 text-[11px]">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-slate-800">{formattedTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform & Automated Processing</span>
                      <span className="font-semibold text-emerald-600">₱0.00 (Included)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes / VAT</span>
                      <span className="font-semibold text-slate-600">₱0.00 (Zero-rated)</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs text-slate-900">
                      <span>Total</span>
                      <span>{formattedTotal}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stepped Timeline & Payment Transaction Cards */}
            <div className="space-y-4 pt-2">
              {/* Card 1: Verified Payment Card (Green border) */}
              <div className="relative flex items-start gap-4">
                {/* Timeline check indicator on the left */}
                <div className="flex size-7 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 shrink-0 mt-3.5 shadow-2xs">
                  <Check className="size-4 stroke-[3]" />
                </div>

                {/* The Payment Box */}
                <div className="flex-1 rounded-2xl border-2 border-emerald-500/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900">
                        {formattedTotal}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">• {formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                      <span className="inline-block h-3.5 w-1 rounded-full bg-emerald-500" />
                      <span>Paid</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        PayPal
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono truncate max-w-[140px] sm:max-w-[200px]">
                        ID: {order.provider_payment_id ?? order.provider_order_id ?? "Verified"}
                      </span>
                      {order.provider_payment_id && (
                        <button
                          type="button"
                          onClick={() => copyToClipboard(order.provider_payment_id!, "capture-id")}
                          className="text-slate-400 hover:text-slate-700 transition cursor-pointer print:hidden"
                          title="Copy ID"
                        >
                          {copiedKey === "capture-id" ? (
                            <Check className="size-3 text-emerald-600" />
                          ) : (
                            <Copy className="size-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-slate-600 font-semibold text-[11px]">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1 hover:text-slate-900 hover:underline cursor-pointer"
                      >
                        <Download className="size-3 text-slate-400" />
                        <span>Receipt</span>
                      </button>

                      <span>•</span>

                      <Link
                        href="/account/support"
                        className="inline-flex items-center gap-1 hover:text-slate-900 hover:underline"
                      >
                        <Mail className="size-3 text-slate-400" />
                        <span>Email / Support</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Deliverable Access Status */}
              <div className="relative flex items-start gap-4">
                <div className="flex size-7 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-500 shrink-0 mt-3 font-mono text-xs font-bold">
                  {canDownload ? "✓" : "2"}
                </div>

                <div
                  className={`flex-1 rounded-2xl border p-4 sm:p-5 shadow-2xs space-y-2 ${
                    canDownload
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCode className="size-4 text-blue-600" />
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {canDownload ? "Digital Deliverable Ready" : "Deliverable Package (.ZIP)"}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold flex items-center gap-1.5 ${
                        canDownload ? "text-emerald-700" : "text-sky-700"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-1 rounded-full ${
                          canDownload ? "bg-emerald-500" : "bg-sky-500"
                        }`}
                      />
                      <span>{canDownload ? "Ready for Download" : "Preparing Package"}</span>
                    </span>
                  </div>

                  {canDownload ? (
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
                      <p className="text-[11px] text-emerald-900 font-medium">
                        Generate fresh 1-hour secure link to download your package.
                      </p>
                      <form action={openPortalDownload.bind(null, order.order_id)}>
                        <button
                          type="submit"
                          className="blue-button inline-flex min-h-9 items-center gap-1.5 bg-[#2563EB] px-4 text-xs font-semibold text-white shadow-xs cursor-pointer"
                        >
                          <Download className="size-3.5" />
                          <span>Download Software</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      Your payment is confirmed. An administrator is preparing your private source package.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Successful Card & Actions (cols 8-12) */}
          <div className="flex flex-col items-center justify-center lg:col-span-5 lg:border-l lg:border-slate-100 lg:pl-10 space-y-6">
            {/* Payment Successful Badge */}
            <div className="w-full max-w-sm text-center space-y-4">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/90 shadow-2xs">
                <Check className="size-7 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-extrabold text-slate-900">Payment Successful</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Receipt was registered to <span className="text-slate-800 font-semibold">{userEmail}</span>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer w-full sm:w-auto"
                >
                  <Printer className="size-3.5 text-slate-500" />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>

            {/* Mini Summary Receipt Snippet (Matching the reference preview card) */}
            <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900">{formattedTotal}</span>
                  <span className="text-slate-400 font-medium">• {formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <span className="inline-block h-3.5 w-1 rounded-full bg-emerald-500" />
                  <span>Paid</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-medium">
                  <span className="font-mono font-bold text-slate-700">PayPal</span> Verified
                </span>

                <div className="flex items-center gap-2 font-semibold">
                  {canDownload ? (
                    <form action={openPortalDownload.bind(null, order.order_id)}>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                      >
                        <Download className="size-3" />
                        <span>Download</span>
                      </button>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <Download className="size-3 text-slate-400" />
                      <span>Receipt</span>
                    </button>
                  )}

                  <span>•</span>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Printer className="size-3 text-slate-400" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Customer Security Note */}
            <div className="w-full max-w-sm rounded-xl bg-slate-50 p-3.5 border border-slate-200/70 text-center text-[11px] text-slate-500 font-medium">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 font-semibold mb-0.5">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                <span>Verified PayPal Transaction</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Order SNAPSHOT: {order.order_number}
              </p>
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
