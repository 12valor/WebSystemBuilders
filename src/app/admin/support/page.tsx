import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSupport } from "@/components/admin/admin-support";
import { getAdminSupportData } from "@/features/customer/admin-support";

export const metadata: Metadata = { title: "Admin support", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSupportPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const [data, params] = await Promise.all([getAdminSupportData(), searchParams]);
  return <AdminShell active="Support"><AdminSupport data={data} result={params.result} /></AdminShell>;
}
