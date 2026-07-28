"use client";

import { useActionState } from "react";
import { manageAdminAccess, type AdminAccessActionState } from "@/features/admin/settings-actions";
import type { AdminAccessData, AdminAccessRecord, IntegrationHealthItem } from "@/features/admin/settings-types";

const initialState: AdminAccessActionState = { status: "idle" };
const inputClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all";
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs disabled:cursor-not-allowed disabled:text-slate-400 transition-all";

export function AdminSettingsWorkspace({ access, health, result }: { access: AdminAccessData; health: IntegrationHealthItem[]; result?: "access-granted" | "access-revoked" }) {
  return (
    <main id="main-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1280px]">
        {result && (
          <p role="status" className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 shadow-2xs">
            {result === "access-granted" ? "Administrator access was granted or updated." : "Administrator access was revoked."}
          </p>
        )}
        <div className="border-b border-slate-200/80 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Super administrator</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Access and integration health</h1>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600 font-medium">Manage administrator roles and review configuration presence without exposing secrets. A configured indicator is not a live provider verification.</p>
        </div>
        <IntegrationHealth items={health} />
        <AccessManagement data={access} />
      </div>
    </main>
  );
}

function IntegrationHealth({ items }: { items: IntegrationHealthItem[] }) {
  return (
    <section aria-labelledby="integration-health-title" className="mt-8">
      <div className="flex items-end justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Read-only</p>
          <h2 id="integration-health-title" className="mt-2 text-2xl font-bold text-slate-900">Integration configuration</h2>
        </div>
        <p className="text-xs text-slate-500 font-medium">Secret values are never displayed.</p>
      </div>
      <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 md:grid-cols-2 xl:grid-cols-3 shadow-xs">
        {items.map((item) => (
          <article key={item.id} className="bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-bold text-slate-900">{item.label}</h3>
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${item.status === "configured" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                {item.status === "configured" ? "Configured" : "Not configured"}
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500 font-medium">{item.detail}</p>
            <p className="mt-3 text-[11px] text-slate-400 font-medium">Live verification: pending</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AccessManagement({ data }: { data: AdminAccessData }) {
  return (
    <section aria-labelledby="admin-access-title" className="mt-12 border-t border-slate-200/80 pt-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Restricted operation</p>
        <h2 id="admin-access-title" className="mt-2 text-2xl font-bold text-slate-900">Administrator access</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 font-medium">Accounts must already exist through secure sign-in. The final super administrator and your own protected role cannot be removed.</p>
      </div>
      {data.status === "ready" ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <GrantAccessForm />
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            {data.records.length ? (
              <div className="divide-y divide-slate-100">
                {data.records.map((record) => (
                  <AccessRow key={record.userId} record={record} isCurrent={record.userId === data.currentUserId} />
                ))}
              </div>
            ) : (
              <p className="p-8 text-sm text-slate-500 font-medium">No administrator access records were returned.</p>
            )}
          </div>
        </div>
      ) : (
        <Unavailable status={data.status} />
      )}
    </section>
  );
}

function GrantAccessForm() {
  const [state, action, pending] = useActionState(manageAdminAccess, initialState);
  return (
    <form action={action} className="self-start rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <h3 className="font-bold text-slate-900">Grant or change access</h3>
      <p className="mt-2 text-xs leading-5 text-slate-500 font-medium">Use the exact email of an existing verified account.</p>
      <label className="mt-5 grid gap-2 text-xs font-bold text-slate-700">
        <span>Account email</span>
        <input name="email" type="email" className={inputClass} />
      </label>
      <label className="mt-4 grid gap-2 text-xs font-bold text-slate-700">
        <span>Role</span>
        <select name="role" defaultValue="admin" className={inputClass}>
          <option value="admin">Administrator</option>
          <option value="super_admin">Super administrator</option>
        </select>
      </label>
      <button name="action" value="grant" disabled={pending} className="mt-5 w-full inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
        {pending ? "Saving..." : "Grant or update access"}
      </button>
      <ActionNotice state={state} />
    </form>
  );
}

function AccessRow({ record, isCurrent }: { record: AdminAccessRecord; isCurrent: boolean }) {
  const [state, action, pending] = useActionState(manageAdminAccess, initialState);
  return (
    <div className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900">{record.displayName || record.email}</p>
          <p className="mt-1 truncate text-xs text-slate-500 font-medium">{record.email}{isCurrent ? " · current account" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold capitalize text-slate-600">{record.role.replace("_", " ")}</span>
          {!isCurrent && (
            <form action={action}>
              <input type="hidden" name="email" value={record.email} />
              <input type="hidden" name="role" value={record.role} />
              <button name="action" value="revoke" disabled={pending} className="min-h-9 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors">
                {pending ? "Revoking..." : "Revoke"}
              </button>
            </form>
          )}
        </div>
      </div>
      <ActionNotice state={state} />
    </div>
  );
}

function ActionNotice({ state }: { state: AdminAccessActionState }) { return state.status !== "idle" && state.message ? <p role="alert" className="mt-4 text-xs leading-5 font-semibold text-red-600">{state.message}</p> : null; }
function Unavailable({ status }: { status: AdminAccessData["status"] }) { return <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-2xs"><p className="font-bold">{status === "unconfigured" ? "Supabase is not connected." : "Administrator access could not be loaded."}</p><p className="mt-2 leading-6 text-amber-800 font-medium">{status === "unconfigured" ? "Connect the project, apply migrations, and bootstrap the first super administrator through a trusted server-side process." : "No partial access list is shown. Verify the database and role-management migration."}</p></div>; }