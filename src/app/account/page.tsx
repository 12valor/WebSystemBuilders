import type { Metadata } from "next";
import { AccountPreview } from "@/components/customer/account-preview";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Customer account preview",
  description: "Customer account direction for orders, downloads, and support.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  return (
    <AccountPreview
      authState={!configured ? "unconfigured" : identity ? "signed_in" : "signed_out"}
      customerEmail={identity?.email ?? undefined}
    />
  );
}
