"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AdminSystemLifecycle } from "@/components/admin/admin-system-lifecycle";
import { AdminSystemResources } from "@/components/admin/admin-system-resources";
import type {
  AdminCategoryRecord,
  AdminCatalogData,
  AdminEditableSystem,
  AdminSystemResources as AdminSystemResourcesData,
} from "@/features/catalog/admin-types";
import {
  createSystemDraft,
  updateSystem,
  type SystemEditorState,
} from "@/features/catalog/actions";
import { createClient } from "@/lib/supabase/client";

const inputClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 transition-all";
const textareaClass = `${inputClass} min-h-28 resize-y py-3 leading-6`;
const initialState: SystemEditorState = { status: "idle" };

type EditorSuccess = "created" | "saved" | "published" | "duplicated" | "unpublished" | "archived" | null;

export function AdminSystemEditor({
  categories,
  dataStatus,
  system = null,
  resources = null,
  success = null,
}: {
  categories: AdminCategoryRecord[];
  dataStatus: AdminCatalogData["status"];
  system?: AdminEditableSystem | null;
  resources?: AdminSystemResourcesData | null;
  success?: EditorSuccess;
}) {
  const isEditing = system !== null;
  const action = isEditing
    ? updateSystem.bind(null, system.id)
    : createSystemDraft;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [qrUrl, setQrUrl] = useState(system?.paymentQrUrl ?? "");
  const [qrUploading, setQrUploading] = useState(false);
  const canSave = dataStatus === "ready" && categories.length > 0 && !pending;
  const statusLabel = system ? capitalize(system.status) : "Draft";

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "png";
      const filePath = `qr-codes/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { data, error } = await supabase.storage.from("payment-qrs").upload(filePath, file);

      if (error) {
        alert(`QR Upload failed: ${error.message}`);
        setQrUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage.from("payment-qrs").getPublicUrl(filePath);
      setQrUrl(publicUrlData.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`QR Upload error: ${msg}`);
    } finally {
      setQrUploading(false);
    }
  };

  return (
    <main id="admin-content">
      <div className="sticky top-16 z-10 border-b border-slate-200/80 bg-white/95 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/systems" aria-label="Back to systems" className="grid size-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">&larr;</Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{isEditing ? system.title : "New system"}</h1>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[0.68rem] font-bold text-amber-800">{statusLabel}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {isEditing
                  ? "Save content changes or run the complete publication gate."
                  : dataStatus === "ready"
                    ? "Create the private base record before adding media, versions, and files."
                    : "Database connection required before saving."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <button form="system-editor-form" type="submit" name="intent" value="save" disabled={!canSave} className="min-h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs disabled:cursor-not-allowed disabled:text-slate-400 transition-all">
              {pending ? "Saving..." : isEditing ? "Save changes" : "Save draft"}
            </button>
            {system?.status === "published" ? (
              <Link href={`/systems/${system.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors">View live</Link>
            ) : (
              <button type="button" disabled className="min-h-10 cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-400">Preview</button>
            )}
            <button form="system-editor-form" type="submit" name="intent" value="publish" disabled={!canSave || !isEditing} className="min-h-10 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
              {pending ? "Checking..." : system?.status === "published" ? "Republish" : system?.status === "archived" ? "Restore and publish" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,760px)_minmax(240px,1fr)] lg:px-10 lg:py-10">
        <nav aria-label="System editor sections" className="hidden h-fit rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs lg:sticky lg:top-36 lg:grid">
          {[["Basic information", "basic"], ["Pricing", "pricing"], ["Package boundaries", "package"], ["Payment QR & Instructions", "scan-to-pay"], ["Technical and SEO", "technical"], ["Publication", "next"], ...(isEditing ? [["Resources", "resources"]] : [])].map(([label, id]) => <a key={id} href={`#${id}`} className="min-h-10 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">{label}</a>)}
        </nav>

        <form id="system-editor-form" action={formAction} className="grid gap-6" aria-label={isEditing ? "Edit system" : "Create system draft"} noValidate>
          {success && <SuccessNotice type={success} />}
          {state.message && (
            <div role="alert" className={`rounded-2xl border p-4 text-sm leading-6 font-medium shadow-2xs ${state.status === "unavailable" ? "border-amber-200 bg-amber-50 text-amber-900" : "border-red-200 bg-red-50 text-red-900"}`}>
              <p>{state.message}</p>
              {state.publicationIssues && (
                <ul className="mt-3 grid gap-1.5 pl-5">
                  {state.publicationIssues.map((issue) => <li key={issue} className="list-disc">{issue}</li>)}
                </ul>
              )}
            </div>
          )}

          <EditorSection id="basic" number="01" title="Basic information" description="Define the private record and how it will be organized.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field name="title" label="System name" placeholder="Required" defaultValue={system?.title} error={firstError(state, "title")} required />
              <Field name="slug" label="URL slug" placeholder="lowercase-system-name" defaultValue={system?.slug} error={firstError(state, "slug")} required />
              <SelectField name="audience" label="Audience" defaultValue={system?.audience} error={firstError(state, "audience")} options={[
                { value: "", label: "Select audience" },
                { value: "students", label: "Students" },
                { value: "business", label: "Business" },
                { value: "both", label: "Both" },
              ]} />
              <SelectField name="categoryId" label="Category" defaultValue={system?.categoryId ?? undefined} error={firstError(state, "categoryId")} disabled={categories.length === 0} options={[
                { value: "", label: categories.length ? "Select category" : "No database categories available" },
                ...categories.map((category) => ({ value: category.id, label: category.name })),
              ]} />
              <SelectField name="productType" label="Product type" defaultValue={system?.productType} error={firstError(state, "productType")} options={[
                { value: "", label: "Select product type" },
                { value: "ready_made", label: "Ready-made system" },
                { value: "customizable_template", label: "Customizable template" },
                { value: "custom_service", label: "Custom development" },
              ]} />
              <Field name="status" label="Current status" value={statusLabel} readOnly />
            </div>
            <TextAreaField name="summary" label="Short description" defaultValue={system?.summary} hint="Used on catalog cards after publication. Enter 10 to 320 characters." error={firstError(state, "summary")} required />
            <TextAreaField name="description" label="Full description" defaultValue={system?.description} hint="Explain intended users, outcomes, limitations, and workflow." />
          </EditorSection>

          <EditorSection id="pricing" number="02" title="Pricing and manual sale" description="PHP amounts are converted to integer centavos on the server.">
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField name="pricingType" label="Pricing mode" defaultValue={system?.pricingType} error={firstError(state, "pricingType")} options={[
                { value: "", label: "Select pricing mode" },
                { value: "fixed", label: "Fixed price" },
                { value: "starting", label: "Starting price" },
                { value: "quotation", label: "Request a quote" },
              ]} />
              <Field name="currency" label="Base currency" value="PHP - Philippine peso" readOnly />
              <Field name="regularPrice" label="Regular price" inputMode="decimal" placeholder="Example: 12500.00" defaultValue={formatMinorUnits(system?.regularPriceMinor)} error={firstError(state, "regularPrice")} />
              <Field name="salePrice" label="Sale price" inputMode="decimal" placeholder="Optional" defaultValue={formatMinorUnits(system?.salePriceMinor)} error={firstError(state, "salePrice")} />
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-600 font-medium"><input name="saleActive" type="checkbox" defaultChecked={system?.saleActive} className="mt-1 size-4 accent-blue-600" /><span><strong className="block text-slate-900 font-bold">Activate sale price manually</strong><span className="mt-1 block leading-6">A valid sale amount lower than the regular price is required.</span></span></label>
          </EditorSection>

          <EditorSection id="package" number="03" title="Package and policy boundaries" description="Save the customer-facing boundaries that must be reviewed before publication.">
            <div className="grid gap-5 sm:grid-cols-2"><TextAreaField name="inclusions" label="Package inclusions" defaultValue={system?.inclusions} /><TextAreaField name="exclusions" label="Package exclusions" defaultValue={system?.exclusions} /></div>
            <TextAreaField name="requirements" label="System requirements" defaultValue={system?.requirements} />
            <TextAreaField name="licenseSummary" label="Customer-facing license summary" defaultValue={system?.licenseSummary} />
            <TextAreaField name="supportSummary" label="Support summary" defaultValue={system?.supportSummary} />
          </EditorSection>

          <EditorSection id="scan-to-pay" number="04" title="Payment QR Code & Instructions" description="Upload custom GCash/QRPh payment QR image and edit specific payment instructions for this system.">
            <div className="grid gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700">Upload Payment QR Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrUpload}
                  className="mt-2 block w-full text-xs text-slate-500 font-medium file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 transition-all"
                />
                {qrUploading && <p className="mt-2 text-xs font-semibold text-amber-700">Uploading QR image...</p>}
                <input type="hidden" name="paymentQrUrl" value={qrUrl} />
              </div>

              {qrUrl && (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  {/* eslint-disable-next-html-element-suppression */}
                  <img src={qrUrl} alt="Current Payment QR" className="size-20 rounded-xl object-contain bg-white p-1.5 shadow-2xs" />
                  <div>
                    <span className="text-xs font-bold text-emerald-700">✓ QR Image Set</span>
                    <p className="mt-1 text-xs text-slate-500 font-medium truncate max-w-md">{qrUrl}</p>
                    <button type="button" onClick={() => setQrUrl("")} className="mt-2 text-xs font-semibold text-red-600 underline">Remove QR</button>
                  </div>
                </div>
              )}

              <TextAreaField
                name="paymentInstructions"
                label="Custom Payment Instructions"
                defaultValue={system?.paymentInstructions}
                hint="Default: Please scan the QR code using GCash or any QRPH-supported banking app. After payment, upload your proof of payment together with the transaction reference number. Your order will be verified within 24 hours."
              />
            </div>
          </EditorSection>

          <EditorSection id="technical" number="05" title="Technical, delivery, and search details" description="Keep product facts structured so the public page and search metadata stay accurate.">
            <TextAreaField name="technologyStack" label="Technology stack" defaultValue={system?.technologyStack.join("\n")} hint="Add one technology per line or separate entries with commas. At least one is required before publication." error={firstError(state, "technologyStack")} />
            <TextAreaField name="deliverySummary" label="Delivery summary" defaultValue={system?.deliverySummary} hint="Explain when and how the buyer receives access. Do not promise delivery before verified payment." error={firstError(state, "deliverySummary")} />
            <TextAreaField name="demoInstructions" label="Demo instructions" defaultValue={system?.demoInstructions} hint="Optional access steps or safe test credentials shown only when a demo link is published." error={firstError(state, "demoInstructions")} />
            <Field name="seoTitle" label="SEO title" maxLength={70} defaultValue={system?.seoTitle ?? ""} placeholder="Optional custom search title" error={firstError(state, "seoTitle")} />
            <TextAreaField name="seoDescription" label="SEO description" defaultValue={system?.seoDescription} hint="Optional search description, up to 180 characters. The product summary remains the fallback." error={firstError(state, "seoDescription")} />
          </EditorSection>

          <EditorSection id="next" number="06" title="Publication readiness" description="Publishing is separate from saving and fails closed when required product evidence is missing.">
            <div className="grid gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/60 sm:grid-cols-2 shadow-xs">
              {["Complete product and policy copy", "Add customer-facing features", "Upload and order real product media", "Create a current product version", "Attach a private delivery file when sold", "Run the server publication check"].map((item, index) => <div key={item} className="bg-white p-4 text-sm text-slate-600 font-medium"><span className="mr-3 text-xs text-slate-400 font-bold">{String(index + 1).padStart(2, "0")}</span>{item}</div>)}
            </div>
          </EditorSection>
        </form>

        <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:sticky lg:top-36">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Publication gate</p>
          <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-900">Private until complete</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 font-medium">Saving verifies administrator access, category compatibility, slug uniqueness, and authoritative price values.</p>
          <ul className="mt-5 grid gap-3 text-sm text-slate-600 font-medium">
            {["Full description and package boundaries", "Technology stack and delivery summary", "License and support summaries", "At least one feature and media item", "Current private deliverable for sold products"].map((item) => <li key={item} className="grid grid-cols-[18px_1fr] gap-2"><span className="text-emerald-600 font-bold" aria-hidden="true">+</span><span>{item}</span></li>)}
          </ul>
          <p className="mt-6 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500 font-medium">{isEditing ? "Publishing changes the public catalog only after every server-side check passes." : "Create the private draft first. Publication is available only from the saved system editor."}</p>
          {system && <AdminSystemLifecycle systemId={system.id} status={system.status} />}
        </aside>
      </div>
      {system && resources && <AdminSystemResources systemId={system.id} resources={resources} />}
    </main>
  );
}

function SuccessNotice({ type }: { type: Exclude<EditorSuccess, null> }) {
  const copy = type === "created"
    ? "The private system draft was created."
    : type === "duplicated"
      ? "The private duplicate was created. Review its slug, media, versions, and delivery files before publishing."
      : type === "unpublished"
        ? "The system was removed from the public catalog and changed to Unlisted."
        : type === "archived"
          ? "The system was archived without deleting its content or resources."
          : type === "published"
            ? "The system passed the readiness checks and is now published."
            : "The system changes were saved.";
  return <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900 shadow-2xs" role="status">{copy}</p>;
}

function firstError(state: SystemEditorState, field: string) {
  return state.fieldErrors?.[field]?.[0];
}

function formatMinorUnits(value: number | null | undefined) {
  if (value === null || value === undefined) return "";
  return (value / 100).toFixed(2);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function EditorSection({ id, number, title, description, children }: { id: string; number: string; title: string; description: string; children: React.ReactNode }) {
  return <section id={id} className="scroll-mt-36 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-xs"><div className="mb-6 grid grid-cols-[28px_1fr] gap-3 border-b border-slate-100 pb-5"><span className="text-xs text-slate-400 font-bold">{number}</span><div><h2 className="text-xl font-bold tracking-tight text-slate-900">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-500 font-medium">{description}</p></div></div><div className="grid gap-5">{children}</div></section>;
}

function Field({ name, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string }) {
  const errorId = error ? `${name}-error` : undefined;
  return <label htmlFor={name} className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><input id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={errorId} className={inputClass} {...props} />{error && <span id={errorId} className="font-semibold text-red-600">{error}</span>}</label>;
}

function SelectField({ name, label, options, error, disabled = false, defaultValue }: { name: string; label: string; options: Array<{ value: string; label: string }>; error?: string; disabled?: boolean; defaultValue?: string }) {
  const errorId = error ? `${name}-error` : undefined;
  return <label htmlFor={name} className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><select id={name} name={name} defaultValue={defaultValue ?? ""} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={errorId} className={inputClass}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error && <span id={errorId} className="font-semibold text-red-600">{error}</span>}</label>;
}

function TextAreaField({ name, label, hint, error, required = false, defaultValue }: { name: string; label: string; hint?: string; error?: string; required?: boolean; defaultValue?: string | null }) {
  const descriptionIds = [hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <label htmlFor={name} className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span><textarea id={name} name={name} required={required} defaultValue={defaultValue ?? ""} aria-invalid={Boolean(error)} aria-describedby={descriptionIds} className={textareaClass} />{hint && <span id={`${name}-hint`} className="font-normal leading-5 text-slate-500">{hint}</span>}{error && <span id={`${name}-error`} className="font-semibold text-red-600">{error}</span>}</label>;
}
