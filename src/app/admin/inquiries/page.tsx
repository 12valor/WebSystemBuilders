import type { Metadata } from "next";
import { AdminInquiries } from "@/components/admin/admin-inquiries";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminInquiriesData } from "@/features/inquiries/admin-repository";

export const metadata: Metadata = { title: "Admin inquiries", robots: { index: false, follow: false } };

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; result?: string }>;
}) {
  const params = await searchParams;
  const data = await getAdminInquiriesData(params.id);
  const result = ["updated", "unchanged"].includes(params.result ?? "")
    ? params.result
    : undefined;

  return (
    <AdminShell active="Inquiries">
      <AdminInquiries data={data} selectedId={params.id} result={result} />
    </AdminShell>
  );
}
