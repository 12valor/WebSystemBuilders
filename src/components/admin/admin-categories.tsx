"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory, updateCategory, type CategoryEditorState } from "@/features/admin/category-actions";
import type { AdminCategoriesData, AdminManagedCategory } from "@/features/admin/types";

const initialState: CategoryEditorState = { status: "idle" };

export function AdminCategories({ data, result }: { data: AdminCategoriesData; result?: string }) {
  const activeCount = data.categories.filter((category) => category.isActive).length;
  const archivedCount = data.categories.length - activeCount;

  return (
    <main id="admin-content" className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1440px]">
        {result && <ResultBanner result={result} />}
        <div className="border-b border-white/10 pb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Catalog structure</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Categories</h1>
          <p className="mt-2 max-w-2xl text-secondary">Control the audience paths and ordering used by the public catalog. Existing records are archived, never deleted.</p>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
          <CreateCategoryPanel enabled={data.status === "ready"} />

          <section aria-labelledby="category-records-title">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="category-records-title" className="text-lg font-semibold">Category records</h2>
                <p className="mt-1 text-sm text-secondary">{activeCount} active · {archivedCount} archived</p>
              </div>
              <p className="text-xs text-muted">Lower sort numbers appear first.</p>
            </div>

            {data.status !== "ready" ? (
              <CategoryDataState status={data.status} />
            ) : data.categories.length > 0 ? (
              <div className="grid gap-4">
                {data.categories.map((category) => <CategoryEditor key={category.id} category={category} />)}
              </div>
            ) : (
              <div className="grid min-h-64 place-items-center rounded-xl border border-white/10 bg-surface-subtle p-8 text-center"><div><h3 className="font-semibold">No categories have been added.</h3><p className="mt-2 text-sm text-secondary">Use the form to create the first administrator-managed category.</p></div></div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function CreateCategoryPanel({ enabled }: { enabled: boolean }) {
  const [state, action] = useActionState(createCategory, initialState);
  return (
    <section aria-labelledby="new-category-title" className="self-start rounded-xl border border-white/10 bg-surface p-5 xl:sticky xl:top-24">
      <h2 id="new-category-title" className="text-lg font-semibold">Create category</h2>
      <p className="mt-1 text-sm leading-6 text-secondary">Add a private catalog category before assigning systems to it.</p>
      <form action={action} className="mt-5 grid gap-4">
        <TextField label="Name" name="name" placeholder="Inventory Management" error={state.fieldErrors?.name} disabled={!enabled} />
        <TextField label="URL slug" name="slug" placeholder="inventory-management" error={state.fieldErrors?.slug} disabled={!enabled} />
        <AudienceField error={state.fieldErrors?.audience} disabled={!enabled} />
        <TextAreaField label="Description" name="description" error={state.fieldErrors?.description} disabled={!enabled} />
        <TextField label="Sort order" name="sortOrder" type="number" defaultValue="0" error={state.fieldErrors?.sortOrder} disabled={!enabled} />
        <FormMessage state={state} />
        <SubmitButton label="Create category" disabled={!enabled} />
      </form>
      {!enabled && <p className="mt-4 text-xs leading-5 text-amber-200">Connect Supabase and apply the migrations before creating persistent categories.</p>}
    </section>
  );
}

function CategoryEditor({ category }: { category: AdminManagedCategory }) {
  const action = updateCategory.bind(null, category.id);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <article className={`rounded-xl border border-white/10 bg-surface-subtle ${category.isActive ? "" : "opacity-75"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{category.name}</h3>
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${category.isActive ? "border-emerald-300/20 text-emerald-200" : "border-white/10 text-muted"}`}>{category.isActive ? "Active" : "Archived"}</span>
          </div>
          <p className="mt-1 text-xs text-muted">{category.linkedSystemCount} linked {category.linkedSystemCount === 1 ? "system" : "systems"} · Updated {formatDate(category.updatedAt)}</p>
        </div>
        <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] capitalize text-secondary">{category.audience}</span>
      </div>
      <form action={formAction} className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-[1fr_1fr_160px_120px]">
        <TextField label="Name" name="name" defaultValue={category.name} error={state.fieldErrors?.name} />
        <TextField label="URL slug" name="slug" defaultValue={category.slug} error={state.fieldErrors?.slug} />
        <AudienceField defaultValue={category.audience} error={state.fieldErrors?.audience} />
        <TextField label="Sort order" name="sortOrder" type="number" defaultValue={String(category.sortOrder)} error={state.fieldErrors?.sortOrder} />
        <div className="md:col-span-2 xl:col-span-4">
          <TextAreaField label="Description" name="description" defaultValue={category.description ?? ""} error={state.fieldErrors?.description} />
        </div>
        <label className="flex min-h-11 items-center gap-3 md:col-span-2 xl:col-span-3">
          <input name="isActive" type="checkbox" defaultChecked={category.isActive} className="size-4 accent-blue-500" />
          <span><span className="block text-sm font-semibold">Active in catalog</span><span className="block text-xs text-muted">Archiving is blocked while non-archived systems still use this category.</span></span>
        </label>
        <div className="xl:self-end"><SubmitButton label="Save changes" /></div>
        <div className="md:col-span-2 xl:col-span-4"><FormMessage state={state} /></div>
      </form>
    </article>
  );
}

function TextField({ label, name, error, type = "text", ...props }: { label: string; name: string; error?: string[]; type?: string; placeholder?: string; defaultValue?: string; disabled?: boolean }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><input {...props} name={name} type={type} min={type === "number" ? 0 : undefined} className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal text-foreground placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" /><FieldError errors={error} /></label>;
}

function TextAreaField({ label, name, error, ...props }: { label: string; name: string; error?: string[]; defaultValue?: string; disabled?: boolean }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span><textarea {...props} name={name} rows={3} className="rounded-lg border border-white/15 bg-background px-3 py-2.5 text-sm font-normal leading-6 text-foreground focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" /><FieldError errors={error} /></label>;
}

function AudienceField({ defaultValue = "both", error, disabled }: { defaultValue?: string; error?: string[]; disabled?: boolean }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>Audience</span><select name="audience" defaultValue={defaultValue} disabled={disabled} className="min-h-10 rounded-lg border border-white/15 bg-background px-3 text-sm font-normal text-foreground focus:border-brand focus:outline-none disabled:opacity-50"><option value="students">Students</option><option value="business">Business</option><option value="both">Both</option></select><FieldError errors={error} /></label>;
}

function FieldError({ errors }: { errors?: string[] }) {
  return errors?.[0] ? <span className="font-normal text-red-300">{errors[0]}</span> : null;
}

function FormMessage({ state }: { state: CategoryEditorState }) {
  return state.message ? <p className={`text-sm leading-6 ${state.status === "unavailable" ? "text-amber-200" : "text-red-300"}`} role="alert">{state.message}</p> : null;
}

function SubmitButton({ label, disabled = false }: { label: string; disabled?: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={disabled || pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-[9px] bg-foreground px-4 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50">{pending ? "Saving..." : label}</button>;
}

function CategoryDataState({ status }: { status: AdminCategoriesData["status"] }) {
  const unconfigured = status === "unconfigured";
  return <div className="grid min-h-64 place-items-center rounded-xl border border-white/10 bg-surface-subtle p-8 text-center"><div className="max-w-md"><h3 className="font-semibold">{unconfigured ? "The database is not connected." : "Category records could not be loaded."}</h3><p className="mt-2 text-sm leading-6 text-secondary">{unconfigured ? "Connect Supabase and apply the migrations to manage persistent categories." : "No partial records are shown. Verify the database connection and applied migrations."}</p></div></div>;
}

function ResultBanner({ result }: { result: string }) {
  const message = result === "created" ? "The category was created." : result === "archived" ? "The category was archived without deleting its history." : "The category was updated.";
  return <p className="mb-6 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-4 text-sm text-emerald-100" role="status">{message}</p>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" }).format(new Date(value));
}
