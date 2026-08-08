import { updateSupportStatus } from "@/features/customer/admin-support-actions";
import type { AdminSupportData } from "@/features/customer/admin-support";

export function AdminSupport({ data, result }: { data: AdminSupportData; result?: string }) {
  return (
    <main id="main-content" className="px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-slate-200/80 pb-7">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Customer operations</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Order support</h1>
          <p className="mt-2 max-w-2xl leading-6 text-slate-600 font-medium">Review private customer messages and maintain a durable request status. Never copy credentials or delivery tokens into notes.</p>
        </div>

        {result && (
          <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 shadow-2xs">
            {result === "updated" ? "Support status updated." : "Support status could not be updated."}
          </p>
        )}

        {data.status !== "ready" ? (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600 font-medium shadow-xs">
            {data.status === "unconfigured" ? "Connect Supabase and apply the Phase 8 migration to review support." : "Support records could not be verified."}
          </div>
        ) : data.requests.length === 0 ? (
          <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600 font-medium shadow-xs">
            No customer support requests exist.
          </div>
        ) : (
          <div className="mt-7 grid gap-4">
            {data.requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{request.order.order_number} · {request.order.customer_email}</p>
                    <h2 className="mt-2 text-lg font-bold text-slate-900">{request.subject}</h2>
                  </div>
                  <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold capitalize text-slate-700">{request.status.replace("_", " ")}</span>
                </div>
                <p className="mt-5 whitespace-pre-wrap border-y border-slate-100 py-5 text-sm leading-7 text-slate-700 font-normal">{request.message}</p>
                <form action={updateSupportStatus.bind(null, request.id)} className="mt-4 flex flex-wrap items-end gap-3">
                  <label className="grid gap-2 text-xs font-bold text-slate-700">
                    <span>Status</span>
                    <select name="status" defaultValue={request.status} className="min-h-10 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all">
                      <option value="open">Open</option>
                      <option value="in_progress">In progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </label>
                  <button className="min-h-10 rounded-xl bg-[#2563EB] px-4 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors">Save status</button>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
