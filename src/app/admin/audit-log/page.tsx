import type { Metadata } from "next";
import { AdminAuditLog } from "@/components/admin/admin-audit-log";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminAuditLogData } from "@/features/admin/repository";

export const metadata: Metadata = { title: "Admin audit log", robots: { index: false, follow: false } };

export default async function AdminAuditLogPage() {
  const data = await getAdminAuditLogData();
  return <AdminShell active="Audit log"><AdminAuditLog data={data} /></AdminShell>;
}
