import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UnifiedDashboardClient } from "@/components/dashboard/unified-dashboard-client";
import { getCustomerPortalData } from "@/features/customer/repository";
import { getCurrentIdentity } from "@/lib/auth/current-user";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Customer Workspace",
  description: "Unified customer portal for ready-made systems, ZIP downloads, support, and account management.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const configured = isSupabasePubliclyConfigured();
  const identity = configured ? await getCurrentIdentity() : null;

  // If user is not signed in when auth is configured, redirect to sign-in page
  if (configured && !identity) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  const [portalData, params] = await Promise.all([
    configured && identity ? getCustomerPortalData() : Promise.resolve({ status: "ready" as const, orders: [], supportRequests: [] }),
    searchParams,
  ]);

  return (
    <UnifiedDashboardClient
      initialEmail={identity?.email ?? null}
      portalData={portalData}
      resultParam={params.result}
    />
  );
}
