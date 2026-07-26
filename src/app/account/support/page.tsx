import type { Metadata } from "next";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { SupportForm } from "@/components/customer/support-form";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Customer Support",
  description: "Request technical support or guidance for your purchased systems.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  if (!identity) {
    return <AccountPreview authState={!configured ? "unconfigured" : "signed_out"} />;
  }

  const data = await getCustomerPortalData();

  return (
    <CustomerPortalShell userEmail={identity.email}>
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold tracking-[-0.03em]">Order Support & Technical Assistance</h2>
        <p className="mt-1 text-sm text-secondary">
          Submit technical guidance requests for verified systems linked to your account.
        </p>

        {data.supportRequests.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface">
            <div className="border-b border-white/10 p-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
              Recent Support Tickets
            </div>
            {data.supportRequests.map((request) => (
              <div
                key={request.id}
                className="flex flex-col gap-2 border-t border-white/10 p-4 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-sm">{request.subject}</p>
                  <p className="mt-1 text-xs text-muted">Updated {formatDate(request.updated_at)}</p>
                </div>
                <span className="w-fit rounded-full border border-white/15 px-3 py-1 text-xs font-semibold capitalize">
                  {request.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
          <SupportForm
            orders={data.orders.map((order) => ({
              id: order.order_id,
              label: `${order.order_number} - ${order.product_name}`,
            }))}
          />
        </div>
      </div>
    </CustomerPortalShell>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value));
}
