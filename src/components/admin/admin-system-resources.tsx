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
  makeVersionCurrent,
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
const inputClass = "min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 transition-all";
const buttonClass = "inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-900 hover:bg-slate-50 shadow-2xs disabled:cursor-not-allowed disabled:text-slate-400 transition-all";

const allowedZipMimes = [
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "application/x-zip",
  "multipart/x-zip",
  "application/zip-compressed",
];

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

  const currentVersion = resources.versions.find((v) => v.isCurrent) ?? resources.versions[0];
  const defaultVersionId = currentVersion?.id ?? "";

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
    const versionId = String(data.get("versionId") ?? "").trim();

    if (!versionId) {
      setUploadState({ status: "error", message: "Select a target version for this file." });
      return;
    }

    if (!(file instanceof File) || file.size === 0) {
      setUploadState({ status: "error", message: "Select a ZIP archive." });
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setUploadState({ status: "error", message: "Upload a valid .zip archive." });
      return;
    }

    let contentType = file.type ? file.type.split(";")[0].trim().toLowerCase() : "";
    if (!contentType || !allowedZipMimes.includes(contentType)) {
      contentType = "application/zip";
    }

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
    <section id="resources" aria-labelledby="resources-title" className="border-t border-slate-200/80 px-5 py-12 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Product resources</p>
          <h2 id="resources-title" className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Features, media, and delivery</h2>
          <p className="mt-3 leading-7 text-slate-600 font-medium">These records are private administration data until the system passes publication checks. Uploaded bytes remain in private Storage buckets.</p>
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
                  <button type="button" disabled={removing} onClick={() => runRemoval(`Remove feature "${feature.label}"?`, () => removeFeature(systemId, feature.id))} className="text-xs font-semibold text-red-600 hover:text-red-700">Remove</button>
                </ResourceRow>
              ))}
            </ResourceList>
          </ResourcePanel>

          <ResourcePanel number="02" title="Media" description="Upload a real screenshot or attach an HTTPS demo or video link.">
            <form onSubmit={uploadImage} className="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
              <FieldLabel label="Product image">
                <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-800" />
              </FieldLabel>
              <FieldLabel label="Image description">
                <input name="imageAlt" placeholder="Describe what the screenshot shows" className={inputClass} />
              </FieldLabel>
              <button type="submit" disabled={uploading !== null} className={buttonClass}>{uploading === "media" ? "Uploading..." : "Upload image"}</button>
            </form>

            <form action={mediaAction} className="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
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
                  <button type="button" disabled={removing} onClick={() => runRemoval("Remove this media item?", () => removeMedia(systemId, media.id))} className="text-xs font-semibold text-red-600 hover:text-red-700">Remove</button>
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
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700"><input name="makeCurrent" type="checkbox" defaultChecked className="size-4 accent-blue-600" />Make this the current version</label>
              <button type="submit" disabled={versionPending} className={buttonClass}>{versionPending ? "Creating..." : "Create version"}</button>
              <StatusNotice state={versionState} compact />
            </form>

            <form onSubmit={uploadDeliverable} className="grid gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
              <FieldLabel label="Target version">
                <select
                  name="versionId"
                  defaultValue={defaultVersionId}
                  key={`version-select-${resources.versions.length}-${defaultVersionId}`}
                  disabled={resources.versions.length === 0}
                  className={inputClass}
                >
                  <option value="">{resources.versions.length ? "Select version" : "Create a version first"}</option>
                  {resources.versions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.versionLabel}{version.isCurrent ? " (current)" : ""}
                    </option>
                  ))}
                </select>
              </FieldLabel>
              <FieldLabel label="Private ZIP file">
                <input name="deliverable" type="file" accept=".zip,application/zip,application/x-zip-compressed" className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-800" />
              </FieldLabel>
              <button type="submit" disabled={uploading !== null || resources.versions.length === 0} className={buttonClass}>{uploading === "deliverable" ? "Uploading..." : "Upload private ZIP"}</button>
            </form>

            <div className="grid gap-3">
              {resources.versions.length === 0 ? <EmptyResource copy="No versions added yet." /> : resources.versions.map((version) => (
                <article key={version.id} className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-sm font-bold text-slate-900">{version.versionLabel}</h3><p className="mt-1 text-xs text-slate-500 font-medium">{version.isCurrent ? "Current version" : "Previous version"}</p></div>
                    <div className="flex items-center gap-3">
                      {!version.isCurrent && (
                        <button
                          type="button"
                          disabled={removing}
                          onClick={() =>
                            runRemoval(
                              `Set version ${version.versionLabel} as current release?`,
                              () => makeVersionCurrent(systemId, version.id),
                            )
                          }
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Set as current
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={removing}
                        onClick={() =>
                          runRemoval(
                            `Remove version ${version.versionLabel}?`,
                            () => removeVersion(systemId, version.id),
                          )
                        }
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {version.releaseNotes && <p className="mt-3 text-xs leading-5 text-slate-600 font-medium">{version.releaseNotes}</p>}
                  <div className="mt-3 grid gap-2">
                    {version.files.length === 0 ? <p className="text-xs text-slate-400 font-medium">No deliverable attached.</p> : version.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-2xs">
                        <div className="min-w-0"><p className="truncate text-xs font-bold text-slate-900">{file.originalFilename}</p><p className="mt-0.5 text-[0.68rem] text-slate-500 font-medium">{formatBytes(file.byteSize)}</p></div>
                        <button type="button" disabled={removing} onClick={() => runRemoval(`Remove file "${file.originalFilename}"?`, () => removeDeliverable(systemId, file.id))} className="text-xs font-semibold text-red-600 hover:text-red-700">Remove</button>
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
  return <article className="grid content-start gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"><div className="border-b border-slate-100 pb-4"><span className="text-xs text-slate-400 font-bold">{number}</span><h3 className="mt-3 text-xl font-bold tracking-tight text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500 font-medium">{description}</p></div>{children}</article>;
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-xs font-bold text-slate-700"><span>{label}</span>{children}</label>;
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs font-semibold text-red-600">{message}</p> : null;
}

function ResourceList({ empty, children }: { empty: string; children: React.ReactNode[] }) {
  return <div className="grid gap-2">{children.length > 0 ? children : <EmptyResource copy={empty} />}</div>;
}

function ResourceRow({ title, meta, children }: { title: string; meta: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">{title}</p><p className="mt-1 text-[0.68rem] capitalize text-slate-500 font-medium">{meta}</p></div>{children}</div>;
}

function EmptyResource({ copy }: { copy: string }) {
  return <p className="rounded-xl border border-dashed border-slate-300 px-3 py-5 text-center text-xs text-slate-500 font-medium">{copy}</p>;
}

function StatusNotice({ state, compact = false }: { state: ResourceActionState; compact?: boolean }) {
  if (!state.message || state.status === "idle") return null;
  const success = state.status === "success";
  return <p role={success ? "status" : "alert"} className={`${compact ? "text-xs font-semibold" : "mt-5 rounded-2xl border px-4 py-3 text-sm font-medium shadow-2xs"} ${success ? "text-emerald-900" : "text-red-900"} ${!compact && (success ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}`}>{state.message}</p>;
}

function formatBytes(value: number | null) {
  if (value === null) return "Size unavailable";
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
