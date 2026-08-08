"use client";

import { useActionState } from "react";
import { createSupportRequest, type CustomerSupportState } from "@/features/customer/actions";

const initialState: CustomerSupportState = { status: "idle" };

export function SupportForm({
  orders,
  appearance = "default",
}: {
  orders: { id: string; label: string }[];
  appearance?: "default" | "dashboard";
}) {
  const [state, action, pending] = useActionState(createSupportRequest, initialState);
  const dashboard = appearance === "dashboard";
  const fieldClass = dashboard
    ? "min-h-12 rounded-lg border border-white/10 bg-[#0D0E10] px-4 text-sm font-normal text-[#F5F5F7] outline-none placeholder:text-[#71717A] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/15"
    : "min-h-12 rounded-[10px] border border-slate-200 bg-white px-4 text-xs font-normal text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10";
  const labelClass = dashboard
    ? "grid gap-2 text-xs font-semibold text-[#A1A1AA]"
    : "grid gap-2 text-xs font-semibold text-slate-700";

  return (
    <form
      action={action}
      className={
        dashboard
          ? "mt-5 grid gap-5 rounded-xl border border-white/10 bg-[#111214] p-5 sm:p-6"
          : "mt-6 grid gap-5 rounded-[24px] border border-white/90 bg-white/90 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-7"
      }
      noValidate
    >
      {state.message && (
        <p
          role="status"
          className={`rounded-lg border p-4 text-sm font-medium ${
            state.status === "success"
              ? dashboard
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                : "border-emerald-300 bg-emerald-50 text-emerald-800"
              : dashboard
                ? "border-red-400/25 bg-red-400/10 text-red-200"
                : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      )}

      <label className={labelClass}>
        <span>Related order</span>
        <select
          name="orderId"
          defaultValue={state.values?.orderId ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.orderId?.[0])}
          className={`${fieldClass} ${dashboard ? "[&>option]:bg-[#111214]" : ""}`}
        >
          <option value="">Select an order</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.label}
            </option>
          ))}
        </select>
        {state.fieldErrors?.orderId?.[0] && (
          <span className={dashboard ? "text-xs font-medium text-red-300" : "text-xs font-medium text-red-600"}>
            {state.fieldErrors.orderId[0]}
          </span>
        )}
      </label>

      <label className={labelClass}>
        <span>Subject</span>
        <input
          name="subject"
          defaultValue={state.values?.subject}
          placeholder="Brief description of the issue"
          aria-invalid={Boolean(state.fieldErrors?.subject?.[0])}
          className={fieldClass}
        />
        {state.fieldErrors?.subject?.[0] && (
          <span className={dashboard ? "text-xs font-medium text-red-300" : "text-xs font-medium text-red-600"}>
            {state.fieldErrors.subject[0]}
          </span>
        )}
      </label>

      <label className={labelClass}>
        <span>Describe the issue</span>
        <textarea
          name="message"
          defaultValue={state.values?.message}
          rows={5}
          placeholder="Include any relevant details or questions about your purchase"
          aria-invalid={Boolean(state.fieldErrors?.message?.[0])}
          className={`${fieldClass} min-h-32 py-3 leading-6`}
        />
        {state.fieldErrors?.message?.[0] && (
          <span className={dashboard ? "text-xs font-medium text-red-300" : "text-xs font-medium text-red-600"}>
            {state.fieldErrors.message[0]}
          </span>
        )}
      </label>

      <p className={dashboard ? "text-xs leading-5 text-[#85858F]" : "text-[11px] text-slate-400"}>
        Security note: Do not include passwords, API keys, database credentials, or secret tokens.
      </p>

      <button
        type="submit"
        disabled={pending || orders.length === 0}
        className={
          dashboard
            ? "inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#3B82F6] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:bg-[#27282C] disabled:text-[#71717A] sm:w-auto"
            : "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#2563EB] hover:bg-blue-700 px-6 text-xs font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        }
      >
        {pending ? "Submitting request..." : orders.length === 0 ? "No eligible order" : "Submit support request"}
      </button>
    </form>
  );
}
