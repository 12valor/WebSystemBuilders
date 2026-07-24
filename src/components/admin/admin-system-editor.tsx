"use client";

import Link from "next/link";
import { useActionState } from "react";
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

const inputClass = "min-h-11 w-full rounded-lg border border-white/15 bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";
const textareaClass = `${inputClass} min-h-28 resize-y py-3 leading-6`;
const initialState: SystemEditorState = { status: "idle" };

type EditorSuccess = "created" | "saved" | "published" | null;

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
  const canSave = dataStatus === "ready" && categories.length > 0 && !pending;
  const statusLabel = system ? capitalize(system.status) : "Draft";

  return (
    <main id="admin-content">
      <div className="sticky top-16 z-10 border-b border-white/10 bg-[#090a0b]/95 px-5 py-4 backdrop-blur-md sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/systems" aria-label="Back to systems" className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 text-secondary hover:text-foreground">&larr;</Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold tracking-[-0.03em]">{isEditing ? system.title : "New system"}</h1>
                <span className="rounded-full border border-amber-400/20 bg-amber-400/[0.08] px-2 py-0.5 text-[0.68rem] font-semibold text-amber-300">{statusLabel}</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {isEditing
                  ? "Save content changes or run the complete publication gate."
                  : dataStatus === "ready"
                    ? "Create the private base record before adding media, versions, and files."
                    : "Database connection required before saving."}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex">
            <button form="system-editor-form" type="submit" name="intent" value="save" disabled={!canSave} className="min-h-10 rounded-lg border border-white/15 px-4 text-xs font-semibold text-foreground hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:text-muted">
              {pending ? "Saving..." : isEditing ? "Save changes" : "Save draft"}
            </button>
            {system?.status === "published" ? (
              <Link href={`/systems/${system.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/15 px-4 text-xs font-semibold text-foreground hover:bg-white/[0.04]">View live</Link>
            ) : (
              <button type="button" disabled className="min-h-10 cursor-not-allowed rounded-lg border border-white/10 px-4 text-xs font-semibold text-muted">Preview</button>
            )}
            <button form="system-editor-form" type="submit" name="intent" value="publish" disabled={!canSave || !isEditing} className="min-h-10 rounded-lg bg-foreground px-4 text-xs font-semibold text-background disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-muted">
              {pending ? "Checking..." : system?.status === "published" ? "Republish" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,760px)_minmax(240px,1fr)] lg:px-10 lg:py-10">
        <nav aria-label="System editor sections" className="hidden h-fit rounded-xl border border-white/10 bg-surface p-2 lg:sticky lg:top-36 lg:grid">
          {[["Basic information", "basic"], ["Pricing", "pricing"], ["Package boundaries", "package"], ["Technical and SEO", "technical"], ["Publication", "next"], ...(isEditing ? [["Resources", "resources"]] : [])].map(([label, id]) => <a key={id} href={`#${id}`} className="min-h-10 rounded-lg px-3 py-2.5 text-sm text-secondary hover:bg-white/[0.04] hover:text-foreground">{label}</a>)}
        </nav>

        <form id="system-editor-form" action={formAction} className="grid gap-6" aria-label={isEditing ? "Edit system" : "Create system draft"} noValidate>
          {success && <SuccessNotice type={success} />}
          {state.message && (
            <div role="alert" className={`rounded-xl border p-4 text-sm leading-6 ${state.status === "unavailable" ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-100" : "border-red-300/20 bg-red-300/[0.06] text-red-100"}`}>
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
            <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-background p-4 text-sm text-secondary"><input name="saleActive" type="checkbox" defaultChecked={system?.saleActive} className="mt-1 size-4 accent-blue-500" /><span><strong className="block text-foreground">Activate sale price manually</strong><span className="mt-1 block leading-6">A valid sale amount lower than the regular price is required.</span></span></label>
          </EditorSection>

          <EditorSection id="package" number="03" title="Package and policy boundaries" description="Save the customer-facing boundaries that must be reviewed before publication.">
            <div className="grid gap-5 sm:grid-cols-2"><TextAreaField name="inclusions" label="Package inclusions" defaultValue={system?.inclusions} /><TextAreaField name="exclusions" label="Package exclusions" defaultValue={system?.exclusions} /></div>
            <TextAreaField name="requirements" label="System requirements" defaultValue={system?.requirements} />
            <TextAreaField name="licenseSummary" label="Customer-facing license summary" defaultValue={system?.licenseSummary} />
            <TextAreaField name="supportSummary" label="Support summary" defaultValue={system?.supportSummary} />
          </EditorSection>

          <EditorSection id="technical" number="04" title="Technical, delivery, and search details" description="Keep product facts structured so the public page and search metadata stay accurate.">
            <TextAreaField name="technologyStack" label="Technology stack" defaultValue={system?.technologyStack.join("\n")} hint="Add one technology per line or separate entries with commas. At least one is required before publication." error={firstError(state, "technologyStack")} />
            <TextAreaField name="deliverySummary" label="Delivery summary" defaultValue={system?.deliverySummary} hint="Explain when and how the buyer receives access. Do not promise delivery before verified payment." error={firstError(state, "deliverySummary")} />
            <TextAreaField name="demoInstructions" label="Demo instructions" defaultValue={system?.demoInstructions} hint="Optional access steps or safe test credentials shown only when a demo link is published." error={firstError(state, "demoInstructions")} />
            <Field name="seoTitle" label="SEO title" maxLength={70} defaultValue={system?.seoTitle ?? ""} placeholder="Optional custom search title" error={firstError(state, "seoTitle")} />
            <TextAreaField name="seoDescription" label="SEO description" defaultValue={system?.seoDescription} hint="Optional search description, up to 180 characters. The product summary remains the fallback." error={firstError(state, "seoDescription")} />
          </EditorSection>

          <EditorSection id="next" number="05" title="Publication readiness" description="Publishing is separate from saving and fails closed when required product evidence is missing.">
            <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
              {["Complete product and policy copy", "Add customer-facing features", "Upload and order real product media", "Create a current product version", "Attach a private delivery file when sold", "Run the server publication check"].map((item, index) => <div key={item} className="bg-background p-4 text-sm text-secondary"><span className="mr-3 text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>{item}</div>)}
            </div>
          </EditorSection>
        </form>

        <aside className="h-fit rounded-xl border border-white/10 bg-surface p-5 lg:sticky lg:top-36">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Publication gate</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.025em]">Private until complete</h2>
          <p className="mt-2 text-sm leading-6 text-secondary">Saving verifies administrator access, category compatibility, slug uniqueness, and authoritative price values.</p>
          <ul className="mt-5 grid gap-3 text-sm text-secondary">
            {["Full description and package boundaries", "Technology stack and delivery summary", "License and support summaries", "At least one feature and media item", "Current private deliverable for sold products"].map((item) => <li key={item} className="grid grid-cols-[18px_1fr] gap-2"><span className="text-emerald-300" aria-hidden="true">+</span><span>{item}</span></li>)}
          </ul>
          <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-5 text-muted">{isEditing ? "Publishing changes the public catalog only after every server-side check passes." : "Create the private draft first. Publication is available only from the saved system editor."}</p>
        </aside>
      </div>
      {system && resources && <AdminSystemResources systemId={system.id} resources={resources} />}
    </main>
  );
}

function SuccessNotice({ type }: { type: Exclude<EditorSuccess, null> }) {
  const copy = type === "created"
    ? "The private system draft was created."
    : type === "published"
      ? "The system passed the readiness checks and is now published."
      : "The system changes were saved.";
  return <p className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-sm text-emerald-100" role="status">{copy}</p>;
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
  return <section id={id} className="scroll-mt-36 rounded-xl border border-white/10 bg-surface-subtle p-5 sm:p-7"><div className="mb-6 grid grid-cols-[28px_1fr] gap-3 border-b border-white/10 pb-5"><span className="text-xs text-muted">{number}</span><div><h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2><p className="mt-1 text-sm leading-6 text-secondary">{description}</p></div></div><div className="grid gap-5">{children}</div></section>;
}

function Field({ name, label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { name: string; label: string; error?: string }) {
  const errorId = error ? `${name}-error` : undefined;
  return <label htmlFor={name} className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><input id={name} name={name} aria-invalid={Boolean(error)} aria-describedby={errorId} className={inputClass} {...props} />{error && <span id={errorId} className="font-medium text-red-300">{error}</span>}</label>;
}

function SelectField({ name, label, options, error, disabled = false, defaultValue }: { name: string; label: string; options: Array<{ value: string; label: string }>; error?: string; disabled?: boolean; defaultValue?: string }) {
  const errorId = error ? `${name}-error` : undefined;
  return <label htmlFor={name} className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><select id={name} name={name} defaultValue={defaultValue ?? ""} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={errorId} className={inputClass}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>{error && <span id={errorId} className="font-medium text-red-300">{error}</span>}</label>;
}

function TextAreaField({ name, label, hint, error, required = false, defaultValue }: { name: string; label: string; hint?: string; error?: string; required?: boolean; defaultValue?: string | null }) {
  const descriptionIds = [hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  return <label htmlFor={name} className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><textarea id={name} name={name} required={required} defaultValue={defaultValue ?? ""} aria-invalid={Boolean(error)} aria-describedby={descriptionIds} className={textareaClass} />{hint && <span id={`${name}-hint`} className="font-normal leading-5 text-muted">{hint}</span>}{error && <span id={`${name}-error`} className="font-medium text-red-300">{error}</span>}</label>;
}
