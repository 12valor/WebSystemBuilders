import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSystemEditor } from "@/components/admin/admin-system-editor";

export const metadata: Metadata = { title: "New system editor preview", robots: { index: false, follow: false } };

export default function NewAdminSystemPage() {
  return <AdminShell><AdminSystemEditor /></AdminShell>;
}
