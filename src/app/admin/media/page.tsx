import type { Metadata } from "next";
import { AdminMediaWorkspace } from "@/components/admin/admin-media-workspace";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminMediaData } from "@/features/catalog/admin-media-repository";

export const metadata: Metadata = {
  title: "Admin media",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const data = await getAdminMediaData();
  return <AdminShell active="Media"><AdminMediaWorkspace data={data} /></AdminShell>;
}
