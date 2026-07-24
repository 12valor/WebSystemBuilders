"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "@/features/inquiries/actions";

const initialState: InquiryState = { status: "idle" };

export function InquiryForm({
  variant,
  configured,
}: {
  variant: "contact" | "quote";
  configured: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] p-6 sm:p-8" role="status">
        <span className="grid size-11 place-items-center rounded-xl border border-emerald-400/20 text-sm font-semibold text-emerald-300" aria-hidden="true">01</span>
        <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">Inquiry received</h2>
        <p className="mt-3 max-w-xl leading-7 text-secondary">{state.message}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/systems" className="inline-flex min-h-11 items-center justify-center rounded-[9px] bg-foreground px-5 text-sm font-semibold text-background">Browse systems</Link>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-[9px] border border-white/15 px-5 text-sm font-semibold">Return home</Link>
        </div>
      </div>
    );
  }

  const disabled = !configured || pending;
  const errors = state.fieldErrors;

  return (
    <form action={formAction} className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-8" noValidate>
      <input type="hidden" name="inquiryType" value={variant} />
      <input type="hidden" name="sourcePath" value={variant === "quote" ? "/request-a-quote" : "/contact"} />
      <div className="absolute left-[-10000px] top-auto size-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${variant}-website`}>Website</label>
        <input id={`${variant}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" value={state.values?.name} error={errors?.name?.[0]} disabled={disabled} />
        <Field label="Email address" name="email" type="email" autoComplete="email" value={state.values?.email} error={errors?.email?.[0]} disabled={disabled} />
        <SelectField label="I am contacting as" name="audience" value={state.values?.audience} error={errors?.audience?.[0]} disabled={disabled} options={[["", "Choose one"], ["student", "Student"], ["business", "Business owner"], ["general", "General inquiry"]]} />
        <Field label="School or business (optional)" name="organization" autoComplete="organization" value={state.values?.organization} error={errors?.organization?.[0]} disabled={disabled} />
      </div>

      {variant === "quote" && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <SelectField label="Type of work" name="projectType" value={state.values?.projectType} error={errors?.projectType?.[0]} disabled={disabled} options={[["", "Choose one"], ["custom-system", "New custom system"], ["ready-made-customization", "Ready-made system customization"], ["student-technical-support", "Student technical support"], ["other", "Other defined work"]]} />
          <Field label="Target timeline (optional)" name="timeline" placeholder="Example: Needed for review in October" value={state.values?.timeline} error={errors?.timeline?.[0]} disabled={disabled} />
        </div>
      )}

      <div className="mt-5">
        <Field label={variant === "quote" ? "Project name or subject" : "Subject"} name="subject" value={state.values?.subject} error={errors?.subject?.[0]} disabled={disabled} />
      </div>

      {variant === "quote" && (
        <TextAreaField label="Users, workflow, and essential requirements" name="requirements" rows={7} value={state.values?.requirements} error={errors?.requirements?.[0]} disabled={disabled} hint="Describe who will use the system, the main steps, required records or reports, and any environment constraints." />
      )}

      <TextAreaField label={variant === "quote" ? "Desired outcome and additional context" : "How can we help?"} name="message" rows={6} value={state.values?.message} error={errors?.message?.[0]} disabled={disabled} hint="Do not include passwords, payment data, government identifiers, or confidential records." />

      <label className="mt-6 flex items-start gap-3 text-sm leading-6 text-secondary">
        <input name="consent" type="checkbox" defaultChecked={state.values?.consent === "on"} disabled={disabled} className="mt-1 size-4 accent-blue-500" aria-invalid={Boolean(errors?.consent?.[0])} />
        <span>I agree that the submitted information may be used to evaluate and respond to this inquiry. See the <Link href="/legal/privacy" className="font-semibold text-foreground underline underline-offset-4">pre-launch privacy notice</Link>.</span>
      </label>
      {errors?.consent?.[0] && <p className="mt-2 text-xs font-medium text-red-300">{errors.consent[0]}</p>}

      {state.message && (
        <p className={`mt-5 rounded-lg border p-3 text-sm leading-6 ${state.status === "unavailable" ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-100" : "border-red-300/20 bg-red-300/[0.06] text-red-100"}`} role="alert">{state.message}</p>
      )}

      {!configured && !state.message && (
        <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-300/[0.06] p-3 text-sm leading-6 text-amber-100" role="status">Secure inquiry storage is not connected in this environment. The form is visible for review, but it cannot send or store information yet.</p>
      )}

      <button type="submit" disabled={disabled} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[10px] bg-foreground px-6 font-semibold text-background transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted">
        {pending ? "Sending securely..." : variant === "quote" ? "Submit project requirements" : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({ label, name, error, value, disabled, type = "text", ...props }: { label: string; name: string; error?: string; value?: string; disabled: boolean; type?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "defaultValue" | "disabled" | "type">) {
  const id = `${name}-field`;
  return <label htmlFor={id} className="block text-sm font-semibold"><span>{label}</span><input {...props} id={id} name={name} type={type} defaultValue={value} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-2 min-h-12 w-full rounded-[10px] border border-white/15 bg-background px-4 text-sm font-normal placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60" />{error && <span id={`${id}-error`} className="mt-2 block text-xs font-medium text-red-300">{error}</span>}</label>;
}

function SelectField({ label, name, options, error, value, disabled }: { label: string; name: string; options: Array<[string, string]>; error?: string; value?: string; disabled: boolean }) {
  const id = `${name}-field`;
  return <label htmlFor={id} className="block text-sm font-semibold"><span>{label}</span><select id={id} name={name} defaultValue={value ?? ""} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className="mt-2 min-h-12 w-full rounded-[10px] border border-white/15 bg-background px-4 text-sm font-normal focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60">{options.map(([optionValue, optionLabel]) => <option key={optionValue || "empty"} value={optionValue}>{optionLabel}</option>)}</select>{error && <span id={`${id}-error`} className="mt-2 block text-xs font-medium text-red-300">{error}</span>}</label>;
}

function TextAreaField({ label, name, hint, error, value, disabled, rows }: { label: string; name: string; hint: string; error?: string; value?: string; disabled: boolean; rows: number }) {
  const id = `${name}-field`;
  return <label htmlFor={id} className="mt-5 block text-sm font-semibold"><span>{label}</span><span id={`${id}-hint`} className="mt-1 block text-xs font-normal leading-5 text-muted">{hint}</span><textarea id={id} name={name} rows={rows} defaultValue={value} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`} className="mt-2 w-full resize-y rounded-[10px] border border-white/15 bg-background px-4 py-3 text-sm font-normal leading-6 placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60" />{error && <span id={`${id}-error`} className="mt-2 block text-xs font-medium text-red-300">{error}</span>}</label>;
}
