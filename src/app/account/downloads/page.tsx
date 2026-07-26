import type { Metadata } from "next";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { openPortalDownload } from "@/features/customer/actions";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

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
        <h2 className="text-xl font-semibold tracking-[-0.03em]">Unlocked System Downloads</h2>
        <p className="mt-1 text-sm text-secondary">
          Click to generate a secure, 1-hour expiring download link for your verified software purchases.
        </p>

        {availableOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/15 p-8 text-center sm:p-12">
            <h3 className="font-semibold text-lg">No active downloads available</h3>
            <p className="mt-2 text-sm text-secondary max-w-md mx-auto">
              Deliverable links become available here as soon as your Scan to Pay reference is verified by an administrator.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {availableOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <span className="font-mono text-xs text-muted font-semibold">{order.order_number}</span>
                  <h3 className="mt-1 text-lg font-semibold">{order.product_name}</h3>
                  <p className="mt-1 text-xs text-secondary">
                    Version {order.purchased_version} • Verified Deliverable Access
                  </p>
                </div>
                <form action={openPortalDownload.bind(null, order.order_id)}>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                  >
                    ⬇ Generate 1-Hour Download Link
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
