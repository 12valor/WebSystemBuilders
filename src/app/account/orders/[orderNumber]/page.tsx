import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { PaymentReturnNotice } from "@/components/customer/payment-return-notice";
import { openPortalDownload } from "@/features/customer/actions";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params, searchParams }: { params: Promise<{ orderNumber: string }>; searchParams: Promise<{ checkout?: string }> }) {
  const { orderNumber } = await params;
  const { checkout } = await searchParams;
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  if (!identity) {
    return <AccountPreview authState={!configured ? "unconfigured" : "signed_out"} />;
  }

  const data = await getCustomerPortalData();
  const order = data.orders.find((item) => item.order_number === orderNumber);

  if (!order) {
    notFound();
  }

  const canDownload = order.payment_status === "paid" && order.delivery_available;

  return (
    <CustomerPortalShell userEmail={identity.email}>
      <div className="max-w-3xl space-y-6">
        <Link href="/account/orders" className="inline-flex text-xs font-semibold text-brand-hover hover:underline">
          ← Back to All Purchases
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs text-muted font-semibold">{order.order_number}</span>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{order.product_name}</h2>
          </div>
          <StatusBadge status={order.payment_status ?? order.order_status} />
        </div>

        <PaymentReturnNotice checkout={checkout} paymentStatus={order.payment_status} productSlug={order.product_slug} />

        {/* Verification Status Alert */}
        {order.payment_provider === "manual" && order.payment_status === "pending" && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100">
            <span className="font-semibold">Manual verification pending:</span> Your GCash / QRPH reference and private proof are available for administrator review.
          </div>
        )}

        {order.payment_status === "paid" && !order.delivery_available && (
          <div className="rounded-2xl border border-sky-400/30 bg-sky-400/10 p-5 text-sm text-sky-100">
            <span className="font-semibold">Payment confirmed.</span> Your private delivery is awaiting administrator preparation.
          </div>
        )}

        {canDownload && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <h3 className="text-lg font-semibold text-white">✓ Deliverable Ready</h3>
            <p className="mt-2 text-xs leading-5 text-emerald-200">
              Your payment has been verified. You can generate a fresh 1-hour secure link to download the source code package.
            </p>
            <form action={openPortalDownload.bind(null, order.order_id)} className="mt-4">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
              >
                ⬇ Download Software Package
              </button>
            </form>
          </div>
        )}

        {/* Order Details Card */}
        <div className="rounded-2xl border border-white/10 bg-surface p-6 space-y-4 text-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Purchase Summary</h3>
          <dl className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
            <div>
              <dt className="text-muted">Purchased Version</dt>
              <dd className="font-semibold text-white mt-1">v{order.purchased_version}</dd>
            </div>
            <div>
              <dt className="text-muted">Amount Paid</dt>
              <dd className="font-semibold text-white mt-1">{formatMoney(order.total_minor, order.currency)}</dd>
            </div>
            <div>
              <dt className="text-muted">Payment Provider</dt>
              <dd className="font-semibold text-white mt-1">{providerLabel(order.payment_provider)}</dd>
            </div>
            {order.payment_provider === "paypal" && (
              <>
                <div>
                  <dt className="text-muted">PayPal Order ID</dt>
                  <dd className="mt-1 break-all font-mono font-semibold text-white">{order.provider_order_id ?? "Pending"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Capture / Transaction ID</dt>
                  <dd className="mt-1 break-all font-mono font-semibold text-white">{order.provider_payment_id ?? "Pending"}</dd>
                </div>
              </>
            )}
            <div>
              <dt className="text-muted">Payment Status</dt>
              <dd className="font-semibold text-white mt-1 capitalize">{order.payment_status ?? "unknown"}</dd>
            </div>
            <div>
              <dt className="text-muted">Fulfillment Status</dt>
              <dd className="font-semibold text-white mt-1 capitalize">{order.fulfillment_status ?? "Awaiting delivery"}</dd>
            </div>
            <div>
              <dt className="text-muted">Order Date</dt>
              <dd className="font-semibold text-white mt-1">{formatDate(order.created_at)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </CustomerPortalShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone = ["verified", "completed", "paid"].includes(status)
    ? "border-emerald-400/30 text-emerald-200 bg-emerald-400/10"
    : ["pending_verification", "pending", "processing"].includes(status)
      ? "border-amber-400/30 text-amber-100 bg-amber-400/10"
      : "border-red-400/30 text-red-200 bg-red-400/10";
  const label = status === "pending_verification" ? "Pending Verification" : status;
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${tone}`}>{label}</span>;
}

function formatMoney(value: number, currency: string) { return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value)); }
function providerLabel(provider: string | null) {
  if (provider === "paypal") return "PayPal — Automatically Verified";
  if (provider === "manual") return "GCash / QRPH — Manual Verification";
  if (provider === "paymongo") return "PayMongo (historical)";
  return "Unrecorded";
}
