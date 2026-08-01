"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SupportForm } from "@/components/customer/support-form";
import { openPortalDownload } from "@/features/customer/actions";
import type { CustomerPortalData } from "@/features/customer/repository";
import {
  ShoppingBag,
  Download,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Clock,
  ArrowUpRight,
  LogOut,
  FileCode,
} from "lucide-react";

export function CustomerAccount({
  email,
  data,
  result,
}: {
  email: string | null;
  data: CustomerPortalData;
  result?: string;
}) {
  const verifiedOrders = data.orders.filter((order) =>
    ["verified", "completed", "paid"].includes(order.order_status)
  );
  const available = data.orders.filter((order) => order.delivery_available).length;
  const openSupport = data.supportRequests.filter((request) =>
    ["open", "in_progress"].includes(request.status)
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white flex flex-col">
      {/* Header Navigation */}
      <header className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex min-h-[74px] w-[min(calc(100%-40px),1240px)] items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="WebSystemBuilders home" className="transition-opacity hover:opacity-80">
              <BrandLogo priority className="size-12" />
            </Link>
            <span className="hidden h-5 w-px bg-slate-200 sm:block" />
            <span className="hidden text-xs font-semibold uppercase tracking-wider text-slate-500 sm:block">
              Customer Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-1.5 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="truncate max-w-44">{email ?? "Verified Customer"}</span>
            </div>
            <Link
              href="/auth/sign-out"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="size-3.5" />
              <span>Sign out</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main id="main-content" className="flex-1 mx-auto w-[min(calc(100%-40px),1180px)] py-10 sm:py-14 space-y-12">
        {/* Overview Section & Greeting */}
        <section id="overview" className="border-b border-slate-200/80 pb-10">
          <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Verified Customer Portal</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-[-0.04em] text-slate-900">
            Your purchases & downloads.
          </h1>

          <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
            Signed in as <strong className="font-semibold text-slate-900">{email ?? "a verified customer"}</strong>. All ready-made system orders matching your email address are verified and claimed automatically.
          </p>

          {/* Alert Banners */}
          {result === "download-unavailable" && (
            <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs font-medium text-red-700">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <span>Deliverable access could not be generated. Please ensure your GCash/QRPh payment has been verified.</span>
            </div>
          )}
          {data.status === "error" && (
            <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-xs font-medium text-amber-800">
              <AlertCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Customer records could not be verified. No partial order data is shown.</span>
            </div>
          )}

          {/* Summary Stat Cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Verified Purchases</span>
                <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                  <ShoppingBag className="size-4.5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{verifiedOrders.length}</p>
              <p className="mt-1 text-[11px] text-slate-400 font-medium">Active software licenses</p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Available Downloads</span>
                <div className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <Download className="size-4.5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{available}</p>
              <p className="mt-1 text-[11px] text-slate-400 font-medium">Secure ZIP deliverables</p>
            </div>

            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Open Support Tickets</span>
                <div className="grid size-9 place-items-center rounded-xl bg-slate-100 text-slate-700">
                  <HelpCircle className="size-4.5" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{openSupport}</p>
              <p className="mt-1 text-[11px] text-slate-400 font-medium">Active support requests</p>
            </div>
          </div>
        </section>

        {/* Orders & Verification Section */}
        <section id="orders" className="border-b border-slate-200/80 pb-10 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Purchase History</span>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Orders & Verification</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Track GCash/QRPh Scan to Pay verification status and download unlocked deliverables.
            </p>
          </div>

          {data.orders.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/90 bg-white p-12 text-center shadow-xs">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-slate-100 text-slate-500 mb-4">
                <ShoppingBag className="size-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No claimed orders yet</h3>
              <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Purchases made using <span className="font-semibold text-slate-800">{email}</span> during checkout will automatically appear here once verified.
              </p>
              <Link
                href="/systems"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                <span>Browse Ready-Made Systems</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-5">
              {data.orders.map((order) => (
                <div key={order.order_id} className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {order.order_number}
                      </span>
                      <h3 className="mt-1.5 text-xl font-semibold text-slate-900">{order.product_name}</h3>
                      <p className="mt-1 text-xs text-slate-500">Purchased version {order.purchased_version}</p>
                    </div>
                    <StatusBadge status={order.order_status} />
                  </div>

                  <div className="grid gap-4 border-t border-slate-100 pt-5 text-xs sm:grid-cols-3">
                    <div>
                      <span className="block font-medium text-slate-400">Total Amount</span>
                      <span className="mt-1 block font-semibold text-slate-900 text-sm">
                        {formatMoney(order.total_minor, order.currency)}
                      </span>
                    </div>
                    <div>
                      <span className="block font-medium text-slate-400">Payment Method</span>
                      <span className="mt-1 block font-semibold text-slate-900">GCash / QRPh Scan to Pay</span>
                    </div>
                    <div>
                      <span className="block font-medium text-slate-400">File Delivery</span>
                      <span className="mt-1 block font-semibold text-slate-900">
                        {order.delivery_available
                          ? "Unlocked ✓"
                          : order.order_status === "pending_verification"
                          ? "Awaiting Verification"
                          : "Locked"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      href={`/systems/${order.product_slug}`}
                      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[10px] border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span>View System Details</span>
                      <ExternalLink className="size-3.5 text-slate-400" />
                    </Link>

                    {order.delivery_available && (
                      <form action={openPortalDownload.bind(null, order.order_id)}>
                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          <Download className="size-3.5" />
                          <span>Generate Fresh 1-Hour Download Link</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Protected Delivery Policy Card */}
        <section id="downloads" className="border-b border-slate-200/80 pb-10 space-y-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="grid size-10 place-items-center rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                <Lock className="size-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900">Protected Download Security Policy</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  For your security, direct deliverable access links expire after 1 hour. Whenever you need to download your system source code or documentation ZIP, return to this portal to generate a fresh secure link.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Support Section */}
        <section id="support" className="space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Technical Assistance</span>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Order Support & Help</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Submit a support ticket for any verified purchase owned by this account.
            </p>
          </div>

          {data.supportRequests.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
              {data.supportRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-2 border-t border-slate-100 p-4 sm:p-5 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{request.subject}</p>
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="size-3 text-slate-400" />
                      <span>Updated {formatDate(request.updated_at)}</span>
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                    {request.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}

          <SupportForm
            orders={data.orders.map((order) => ({
              id: order.order_id,
              label: `${order.order_number} - ${order.product_name}`,
            }))}
          />
        </section>
      </main>
    </div>
  );
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(
    new Date(value)
  );
}

function StatusBadge({ status }: { status: string }) {
  const isVerified = ["verified", "completed", "paid"].includes(status);
  const isPending = ["pending_verification", "pending"].includes(status);

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
        <CheckCircle2 className="size-3.5 text-emerald-600" />
        <span>Verified & Unlocked</span>
      </span>
    );
  }

  if (isPending) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
        <Clock className="size-3.5 text-amber-600" />
        <span>Pending Verification</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
      <AlertCircle className="size-3.5 text-red-600" />
      <span className="capitalize">{status}</span>
    </span>
  );
}