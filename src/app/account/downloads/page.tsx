import type { Metadata } from "next";
import Link from "next/link";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { openPortalDownload } from "@/features/customer/actions";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { Download, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "System Downloads",
  description: "Access verified system deliverable ZIP files.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  if (!identity) {
    return <AccountPreview authState={!configured ? "unconfigured" : "signed_out"} />;
  }

  const data = await getCustomerPortalData();
  const availableOrders = data.orders.filter((order) => order.delivery_available);

  return (
    <CustomerPortalShell userEmail={identity.email}>
      <div>
        <h2 className="text-xl font-bold tracking-[-0.03em] text-slate-900">Unlocked System Downloads</h2>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          Click to generate a secure, 1-hour expiring download link for your verified software purchases.
        </p>

        {availableOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200/80 bg-white p-8 text-center sm:p-12 shadow-2xs">
            <h3 className="font-bold text-lg text-slate-900">No active downloads available</h3>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto font-medium leading-relaxed">
              Deliverable links appear after payment is confirmed and an administrator prepares the private delivery.
            </p>
            <div className="mt-6">
              <Link
                href="/systems"
                className="blue-button inline-flex min-h-11 items-center bg-[#2563EB] px-5 text-sm font-semibold text-white"
              >
                Browse Systems Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {availableOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 sm:flex-row sm:items-center sm:justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">{order.order_number}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[0.7rem] font-semibold text-emerald-700">
                      <PackageCheck className="size-3" />
                      <span>Ready</span>
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-slate-900 tracking-[-0.03em]">{order.product_name}</h3>
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    Version {order.purchased_version} • Verified Deliverable Access
                  </p>
                </div>
                <form action={openPortalDownload.bind(null, order.order_id)}>
                  <button
                    type="submit"
                    className="blue-button inline-flex min-h-11 items-center gap-2 bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-md"
                  >
                    <Download className="size-4" />
                    <span>Download Deliverable</span>
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerPortalShell>
  );
}
