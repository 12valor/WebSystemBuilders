import type { Metadata } from "next";
import { AdminCategories } from "@/components/admin/admin-categories";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminCategoriesData } from "@/features/admin/repository";

export const metadata: Metadata = { title: "Admin categories", robots: { index: false, follow: false } };

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  const [data, params] = await Promise.all([getAdminCategoriesData(), searchParams]);
  const result = ["created", "updated", "archived"].includes(params.result ?? "") ? params.result : undefined;
  return <AdminShell active="Categories"><AdminCategories data={data} result={result} /></AdminShell>;
}
