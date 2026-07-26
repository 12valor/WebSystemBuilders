import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { openPortalDownload } from "@/features/customer/actions";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Order Details",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
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

  const canDownload = ["verified", "completed", "paid"].includes(order.order_status) && order.delivery_available;

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
          <StatusBadge status={order.order_status} />
        </div>

        {/* Verification Status Alert */}
        {order.order_status === "pending_verification" && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-sm text-amber-100">
            <span className="font-semibold">Verification Pending:</span> Your GCash/QRPh reference number and proof of payment are currently being reviewed by an administrator. Once verified (usually within 24 hours), your download link will unlock below.
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
              <dt className="text-muted">Payment Method</dt>
              <dd className="font-semibold text-white mt-1">Scan to Pay (GCash / QRPh)</dd>
            </div>
            <div>
              <dt className="text-muted">Submission Date</dt>
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
    : ["pending_verification", "pending"].includes(status)
      ? "border-amber-400/30 text-amber-100 bg-amber-400/10"
      : "border-red-400/30 text-red-200 bg-red-400/10";
  const label = status === "pending_verification" ? "Pending Verification" : status;
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${tone}`}>{label}</span>;
}

function formatMoney(value: number, currency: string) { return new Intl.NumberFormat("en-PH", { style: "currency", currency }).format(value / 100); }
function formatDate(value: string) { return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value)); }
