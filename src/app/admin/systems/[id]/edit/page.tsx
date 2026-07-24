import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminSystemEditor } from "@/components/admin/admin-system-editor";
import { getAdminSystemEditorData } from "@/features/catalog/admin-repository";

export const metadata: Metadata = {
  title: "Edit system",
  robots: { index: false, follow: false },
};

export default async function EditAdminSystemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; saved?: string; published?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const data = await getAdminSystemEditorData(id);

  if (data.status === "not_found") notFound();

  if (data.status !== "ready" || !data.system) {
    return (
      <AdminShell>
        <main id="admin-content" className="grid min-h-[60vh] place-items-center px-5 py-16 text-center">
          <div className="max-w-xl">
            <span className="mx-auto grid size-12 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/[0.06] text-xs font-semibold text-amber-200" aria-hidden="true">SET</span>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.05em]">The system editor is unavailable.</h1>
            <p className="mt-4 leading-7 text-secondary">
              {data.status === "unconfigured"
                ? "Connect Supabase and apply the catalog migrations before loading persistent system records."
                : "The system record could not be verified, so no partial editor data is shown."}
            </p>
          </div>
        </main>
      </AdminShell>
    );
  }

  const success = query.published === "1"
    ? "published"
    : query.created === "1"
      ? "created"
      : query.saved === "1"
        ? "saved"
        : null;

  return (
    <AdminShell>
      <AdminSystemEditor
        categories={data.categories}
        dataStatus="ready"
        system={data.system}
        success={success}
      />
    </AdminShell>
  );
}
