import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSystemEditor } from "@/components/admin/admin-system-editor";
import { getAdminCatalogData } from "@/features/catalog/admin-repository";

export const metadata: Metadata = { title: "Create system draft", robots: { index: false, follow: false } };

export default async function NewAdminSystemPage() {
  const data = await getAdminCatalogData();
  return <AdminShell><AdminSystemEditor categories={data.categories} dataStatus={data.status} /></AdminShell>;
}
