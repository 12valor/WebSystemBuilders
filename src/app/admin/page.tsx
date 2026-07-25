import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminDashboardData } from "@/features/admin/repository";

export const metadata: Metadata = { title: "Admin overview", robots: { index: false, follow: false } };

export default async function AdminOverviewPage() {
  const data = await getAdminDashboardData();
  return <AdminShell active="Overview"><AdminOverview data={data} /></AdminShell>;
}
