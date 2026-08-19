import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerPortalShell } from "@/components/customer/customer-portal-shell";
import { OrderReceipt } from "@/components/customer/order-receipt";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Order Receipt & Confirmation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ checkout?: string }>;
}) {
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

  return (
    <CustomerPortalShell userEmail={identity.email}>
      <OrderReceipt order={order} userEmail={identity.email} checkout={checkout} />
    </CustomerPortalShell>
  );
}
