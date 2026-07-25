import type { Metadata } from "next";
import { AdminContentWorkspace } from "@/components/admin/admin-content-workspace";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminFaqData } from "@/features/content/faq-repository";

export const metadata: Metadata = {
  title: "Admin content",
  robots: { index: false, follow: false },
};

const results = ["created", "updated", "published", "archived"] as const;

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const [data, params] = await Promise.all([getAdminFaqData(), searchParams]);
  const result = results.find((item) => item === params.result);
  return <AdminShell active="Content"><AdminContentWorkspace data={data} result={result} /></AdminShell>;
}
