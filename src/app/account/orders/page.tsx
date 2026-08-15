import type { Metadata } from "next";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerOrdersList } from "@/components/customer/customer-orders-list";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "My Purchases",
  description: "Track payment and fulfillment status and access delivered systems.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  if (!identity) {
    return <AccountPreview authState={!configured ? "unconfigured" : "signed_out"} />;
  }

  const data = await getCustomerPortalData();

  return (
    <CustomerPortalShell userEmail={identity.email}>
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.03em]">Purchase History</h2>
        <p className="mt-1 text-sm text-secondary">
          Payment verification and fulfillment are tracked separately. Verified payments await administrator-prepared private delivery.
        </p>
        <div className="mt-6">
          <CustomerOrdersList orders={data.orders} />
        </div>
      </div>
    </CustomerPortalShell>
  );
}
