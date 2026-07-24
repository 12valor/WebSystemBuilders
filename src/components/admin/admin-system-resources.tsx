"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminSystemResources } from "@/features/catalog/admin-types";
import {
  addExternalMedia,
  addFeature,
  addVersion,
  confirmDeliverableUpload,
  confirmMediaUpload,
  prepareDeliverableUpload,
  prepareMediaUpload,
  removeDeliverable,
  removeFeature,
  removeMedia,
  removeVersion,
  type ResourceActionState,
} from "@/features/catalog/resource-actions";
import { createClient } from "@/lib/supabase/client";

const initialState: ResourceActionState = { status: "idle" };
const inputClass = "min-h-10 w-full rounded-lg border border-white/15 bg-background px-3 text-sm text-foreground placeholder:text-muted focus:border-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";
const buttonClass = "inline-flex min-h-10 items-center justify-center rounded-lg border border-white/15 px-4 text-xs font-semibold text-foreground hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:text-muted";

export function AdminSystemResources({
  systemId,
  resources,
}: {
  systemId: string;
  resources: AdminSystemResources;
}) {
  const router = useRouter();
  const [featureState, featureAction, featurePending] = useActionState(
    addFeature.bind(null, systemId),
    initialState,
  );
  const [mediaState, mediaAction, mediaPending] = useActionState(
    addExternalMedia.bind(null, systemId),
    initialState,
  );
  const [versionState, versionAction, versionPending] = useActionState(
    addVersion.bind(null, systemId),
    initialState,
  );
  const [uploadState, setUploadState] = useState<ResourceActionState>(initialState);
  const [removalState, setRemovalState] = useState<ResourceActionState>(initialState);
  const [uploading, setUploading] = useState<"media" | "deliverable" | null>(null);
  const [removing, startRemoval] = useTransition();

  function runRemoval(
    message: string,
    action: () => Promise<ResourceActionState>,
  ) {
    if (!window.confirm(message)) return;
    startRemoval(async () => {
      const result = await action();
      setRemovalState(result);
      router.refresh();
    });
  }

  async function uploadImage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("image");
    const altText = String(data.get("imageAlt") ?? "");

    if (!(file instanceof File) || file.size === 0) {
      setUploadState({ status: "error", message: "Select a product image." });
      return;
    }

    setUploading("media");
    setUploadState({ status: "idle" });

    const prepared = await prepareMediaUpload(systemId, {
      fileName: file.name,
      fileSize: file.size,
      contentType: file.type,
      altText,
    });
    if (prepared.status !== "ready") {
      setUploadState(prepared);
      setUploading(null);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.storage
      .from(prepared.bucket)
      .uploadToSignedUrl(prepared.storagePath, prepared.token, file, {
        contentType: prepared.expectedContentType,
        cacheControl: "3600",
      });

    if (error) {
      setUploadState({ status: "error", message: "The image upload did not complete." });
      setUploading(null);
      return;
    }

    const result = await confirmMediaUpload(systemId, {
      storagePath: prepared.storagePath,
      originalFileName: prepared.originalFileName,
      expectedSize: prepared.expectedSize,
      expectedContentType: prepared.expectedContentType,
      altText: prepared.altText,
    });

    setUploadState(result);
    setUploading(null);
    if (result.status === "success") {
      form.reset();
      router.refresh();
    }
  }

  async function uploadDeliverable(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = data.get("deliverable");
    const versionId = String(data.get("versionId") ?? "");

    if (!(file instanceof File) || file.size === 0) {
      setUploadState({ status: "error", message: "Select a ZIP archive." });
      return;
    }

    const contentType = file.type || "application/zip";
    setUploading("deliverable");
    setUploadState({ status: "idle" });

    const prepared = await prepareDeliverableUpload(systemId, {
      versionId,
      fileName: file.name,
      fileSize: file.size,
      contentType,
    });
    if (prepared.status !== "ready") {
      setUploadState(prepared);
      setUploading(null);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.storage
      .from(prepared.bucket)
      .uploadToSignedUrl(prepared.storagePath, prepared.token, file, {
        contentType: prepared.expectedContentType,
      });

    if (error) {
      setUploadState({ status: "error", message: "The private ZIP upload did not complete." });
      setUploading(null);
      return;
    }

    const result = await confirmDeliverableUpload(systemId, {
      storagePath: prepared.storagePath,
      originalFileName: prepared.originalFileName,
      expectedSize: prepared.expectedSize,
      expectedContentType: prepared.expectedContentType,
      versionId: prepared.versionId,
    });

    setUploadState(result);
    setUploading(null);
    if (result.status === "success") {
      form.reset();
      router.refresh();
    }
  }

  return (
    <section id="resources" aria-labelledby="resources-title" className="border-t border-white/10 px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Product resources</p>
          <h2 id="resources-title" className="mt-3 text-3xl font-semibold tracking-[-0.045em]">Features, media, and delivery</h2>
          <p className="mt-3 leading-7 text-secondary">These records are private administration data until the system passes publication checks. Uploaded bytes remain in private Storage buckets.</p>
        </div>

        <StatusNotice state={removalState} />
        <StatusNotice state={uploadState} />

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <ResourcePanel number="01" title="Features" description="Add the customer-facing capabilities used by the publication gate.">
            <form action={featureAction} className="grid gap-3">
              <FieldLabel label="Feature">
                <input name="label" placeholder="Example: Low-stock alerts" className={inputClass} aria-invalid={Boolean(featureState.fieldErrors?.label)} />
              </FieldLabel>
              <FieldError message={featureState.fieldErrors?.label?.[0]} />
              <button type="submit" disabled={featurePending} className={buttonClass}>{featurePending ? "Adding..." : "Add feature"}</button>
              <StatusNotice state={featureState} compact />
            </form>
            <ResourceList empty="No features added yet.">
              {resources.features.map((feature) => (
                <ResourceRow key={feature.id} title={feature.label} meta={`Order ${feature.sortOrder + 1}`}>
                  <button type="button" disabled={removing} onClick={() => runRemoval(`Remove feature "${feature.label}"?`, () => removeFeature(systemId, feature.id))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove</button>
                </ResourceRow>
              ))}
            </ResourceList>
          </ResourcePanel>

          <ResourcePanel number="02" title="Media" description="Upload a real screenshot or attach an HTTPS demo or video link.">
            <form onSubmit={uploadImage} className="grid gap-3 rounded-lg border border-white/10 bg-background p-4">
              <FieldLabel label="Product image">
                <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-xs text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground" />
              </FieldLabel>
              <FieldLabel label="Image description">
                <input name="imageAlt" placeholder="Describe what the screenshot shows" className={inputClass} />
              </FieldLabel>
              <button type="submit" disabled={uploading !== null} className={buttonClass}>{uploading === "media" ? "Uploading..." : "Upload image"}</button>
            </form>

            <form action={mediaAction} className="grid gap-3 rounded-lg border border-white/10 bg-background p-4">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <FieldLabel label="Link type">
                  <select name="mediaType" defaultValue="demo" className={inputClass}><option value="demo">Demo</option><option value="video">Video</option></select>
                </FieldLabel>
                <FieldLabel label="HTTPS URL">
                  <input name="externalUrl" type="url" placeholder="https://" className={inputClass} />
                </FieldLabel>
              </div>
              <FieldLabel label="Accessible description">
                <input name="altText" placeholder="Describe the linked media" className={inputClass} />
              </FieldLabel>
              <button type="submit" disabled={mediaPending} className={buttonClass}>{mediaPending ? "Adding..." : "Add media link"}</button>
              <StatusNotice state={mediaState} compact />
            </form>

            <ResourceList empty="No media added yet.">
              {resources.media.map((media) => (
                <ResourceRow key={media.id} title={media.altText ?? "Untitled media"} meta={media.storagePath ? "Private image" : media.mediaType}>
                  <button type="button" disabled={removing} onClick={() => runRemoval("Remove this media item?", () => removeMedia(systemId, media.id))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove</button>
                </ResourceRow>
              ))}
            </ResourceList>
          </ResourcePanel>

          <ResourcePanel number="03" title="Versions and files" description="Create releases and attach ZIP archives directly to private Storage.">
            <form action={versionAction} className="grid gap-3">
              <FieldLabel label="Version label">
                <input name="versionLabel" placeholder="Example: 1.0.0" className={inputClass} />
              </FieldLabel>
              <FieldError message={versionState.fieldErrors?.versionLabel?.[0]} />
              <FieldLabel label="Release notes">
                <textarea name="releaseNotes" rows={3} className={`${inputClass} py-3`} />
              </FieldLabel>
              <label className="flex items-center gap-2 text-xs text-secondary"><input name="makeCurrent" type="checkbox" defaultChecked className="size-4 accent-blue-500" />Make this the current version</label>
              <button type="submit" disabled={versionPending} className={buttonClass}>{versionPending ? "Creating..." : "Create version"}</button>
              <StatusNotice state={versionState} compact />
            </form>

            <form onSubmit={uploadDeliverable} className="grid gap-3 rounded-lg border border-white/10 bg-background p-4">
              <FieldLabel label="Target version">
                <select name="versionId" defaultValue="" disabled={resources.versions.length === 0} className={inputClass}>
                  <option value="">{resources.versions.length ? "Select version" : "Create a version first"}</option>
                  {resources.versions.map((version) => <option key={version.id} value={version.id}>{version.versionLabel}{version.isCurrent ? " (current)" : ""}</option>)}
                </select>
              </FieldLabel>
              <FieldLabel label="Private ZIP file">
                <input name="deliverable" type="file" accept=".zip,application/zip,application/x-zip-compressed" className="block w-full text-xs text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground" />
              </FieldLabel>
              <button type="submit" disabled={uploading !== null || resources.versions.length === 0} className={buttonClass}>{uploading === "deliverable" ? "Uploading..." : "Upload private ZIP"}</button>
            </form>

            <div className="grid gap-3">
              {resources.versions.length === 0 ? <EmptyResource copy="No versions added yet." /> : resources.versions.map((version) => (
                <article key={version.id} className="rounded-lg border border-white/10 bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-sm font-semibold">{version.versionLabel}</h3><p className="mt-1 text-xs text-muted">{version.isCurrent ? "Current version" : "Previous version"}</p></div>
                    <button type="button" disabled={removing} onClick={() => runRemoval(`Remove version ${version.versionLabel}?`, () => removeVersion(systemId, version.id))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove</button>
                  </div>
                  {version.releaseNotes && <p className="mt-3 text-xs leading-5 text-secondary">{version.releaseNotes}</p>}
                  <div className="mt-3 grid gap-2">
                    {version.files.length === 0 ? <p className="text-xs text-muted">No deliverable attached.</p> : version.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between gap-3 rounded-md border border-white/10 px-3 py-2">
                        <div className="min-w-0"><p className="truncate text-xs font-semibold">{file.originalFilename}</p><p className="mt-0.5 text-[0.68rem] text-muted">{formatBytes(file.byteSize)}</p></div>
                        <button type="button" disabled={removing} onClick={() => runRemoval(`Remove file "${file.originalFilename}"?`, () => removeDeliverable(systemId, file.id))} className="text-xs font-semibold text-red-300 hover:text-red-200">Remove</button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </ResourcePanel>
        </div>
      </div>
    </section>
  );
}

function ResourcePanel({ number, title, description, children }: { number: string; title: string; description: string; children: React.ReactNode }) {
  return <article className="grid content-start gap-5 rounded-xl border border-white/10 bg-surface-subtle p-5"><div className="border-b border-white/10 pb-4"><span className="text-xs text-muted">{number}</span><h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">{title}</h3><p className="mt-2 text-sm leading-6 text-secondary">{description}</p></div>{children}</article>;
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-semibold text-secondary"><span>{label}</span>{children}</label>;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs font-medium text-red-300">{message}</p> : null;
}

function ResourceList({ empty, children }: { empty: string; children: React.ReactNode[] }) {
  return <div className="grid gap-2">{children.length > 0 ? children : <EmptyResource copy={empty} />}</div>;
}

function ResourceRow({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-background px-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p><p className="mt-1 text-[0.68rem] capitalize text-muted">{meta}</p></div>{children}</div>;
}

function EmptyResource({ copy }: { copy: string }) {
  return <p className="rounded-lg border border-dashed border-white/10 px-3 py-5 text-center text-xs text-muted">{copy}</p>;
}

function StatusNotice({ state, compact = false }: { state: ResourceActionState; compact?: boolean }) {
  if (!state.message || state.status === "idle") return null;
  const success = state.status === "success";
  return <p role={success ? "status" : "alert"} className={`${compact ? "text-xs" : "mt-5 rounded-lg border px-4 py-3 text-sm"} ${success ? "text-emerald-200" : "text-red-200"} ${!compact && (success ? "border-emerald-300/20 bg-emerald-300/[0.06]" : "border-red-300/20 bg-red-300/[0.06]")}`}>{state.message}</p>;
}

function formatBytes(value: number | null) {
  if (value === null) return "Size unavailable";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
