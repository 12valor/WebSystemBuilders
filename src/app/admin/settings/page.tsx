import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSettingsWorkspace } from "@/components/admin/admin-settings-workspace";
import { AdminShell } from "@/components/admin/admin-shell";
import { getIntegrationHealth } from "@/features/admin/integration-health";
import { getAdminAccessData } from "@/features/admin/settings-repository";
import type { AdminAccessData } from "@/features/admin/settings-types";
import { AuthorizationError } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";

export const metadata: Metadata = { title: "Admin settings", robots: { index: false, follow: false } };
const results = ["access-granted", "access-revoked"] as const;

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const params = await searchParams;
  let access: AdminAccessData = { status: "unconfigured", currentUserId: null, records: [] };
  if (isSupabasePubliclyConfigured()) {
    try { access = await getAdminAccessData(); }
    catch (error) {
      if (error instanceof AuthorizationError) redirect(error.code === "unauthenticated" ? "/auth/sign-in?next=/admin/settings" : "/auth/unauthorized");
      throw error;
    }
  }
  return <AdminShell active="Settings"><AdminSettingsWorkspace access={access} health={getIntegrationHealth()} result={results.find((item) => item === params.result)} /></AdminShell>;
}