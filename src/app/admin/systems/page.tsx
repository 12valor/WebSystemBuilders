import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSystemsList } from "@/components/admin/admin-systems-list";
import { getAdminCatalogData } from "@/features/catalog/admin-repository";

export const metadata: Metadata = { title: "Admin systems", robots: { index: false, follow: false } };

export default async function AdminSystemsPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const [data, params] = await Promise.all([getAdminCatalogData(), searchParams]);
  return <AdminShell><AdminSystemsList data={data} created={params.created === "1"} /></AdminShell>;
}
