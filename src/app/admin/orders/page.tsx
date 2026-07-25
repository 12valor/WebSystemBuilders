import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin/admin-orders";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminOrdersData } from "@/features/orders/admin-repository";

export const metadata: Metadata = { title: "Admin orders", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const [data, params] = await Promise.all([getAdminOrdersData(), searchParams]);
  return <AdminShell active="Orders"><AdminOrders data={data} result={params.result} /></AdminShell>;
}