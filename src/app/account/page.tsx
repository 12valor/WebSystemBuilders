import type { Metadata } from "next";
import { AccountPreview } from "@/components/customer/account-preview";
import { CustomerAccount } from "@/components/customer/customer-account";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Customer account",
  description: "Private customer orders, downloads, version context, receipts, and support.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  if (identity) {
    const [data, params] = await Promise.all([getCustomerPortalData(), searchParams]);
    return <CustomerAccount email={identity.email} data={data} result={params.result} />;
  }

  return (
    <AccountPreview
      authState={!configured ? "unconfigured" : "signed_out"}
    />
  );
}
