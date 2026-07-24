"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  catalogResourceIdSchema,
  confirmUploadSchema,
  deliverableUploadRequestSchema,
  externalMediaInputSchema,
  featureInputSchema,
  mediaUploadRequestSchema,
  versionInputSchema,
} from "@/features/catalog/resource-schemas";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const MEDIA_BUCKET = "system-media";
const DELIVERABLE_BUCKET = "system-deliverables";
const mediaMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const deliverableMimeTypes = new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
]);

export type ResourceActionState = {
  status: "idle" | "success" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export type UploadPreparation =
  | {
      status: "ready";
      bucket: typeof MEDIA_BUCKET | typeof DELIVERABLE_BUCKET;
      storagePath: string;
      token: string;
      originalFileName: string;
      expectedSize: number;
      expectedContentType: string;
      altText?: string;
      versionId?: string;
    }
  | {
      status: "error" | "unavailable";
      message: string;
    };

type CatalogContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  admin: Awaited<ReturnType<typeof requireAdmin>>;
  system: {
    id: string;
    slug: string;
    status: "draft" | "published" | "unlisted" | "archived";
    product_type: "ready_made" | "customizable_template" | "custom_service";
  };
};

export async function addFeature(
  systemId: string,
  _previousState: ResourceActionState,
  formData: FormData,
): Promise<ResourceActionState> {
  const input = featureInputSchema.safeParse({ label: formData.get("label") });
  if (!input.success) return validationState(input.error);

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const nextSort = await getNextSortOrder(context.data.supabase, "system_features", systemId);
  if (nextSort === null) return errorState("The feature order could not be prepared.");

  const { error } = await context.data.supabase.from("system_features").insert({
    system_id: systemId,
    label: input.data.label,
    sort_order: nextSort,
  });

  if (error) return errorState("The feature could not be added.");

  revalidateResources(context.data);
  return successState("Feature added.");
}

export async function removeFeature(
  systemId: string,
  featureId: string,
): Promise<ResourceActionState> {
  if (!catalogResourceIdSchema.safeParse(featureId).success) {
    return errorState("The feature identifier is invalid.");
  }

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const { count, error: countError } = await context.data.supabase
    .from("system_features")
    .select("id", { count: "exact", head: true })
    .eq("system_id", systemId);

  if (countError) return errorState("The feature list could not be verified.");
  if (context.data.system.status === "published" && (count ?? 0) <= 1) {
    return errorState("A published system must keep at least one feature.");
  }

  const { error } = await context.data.supabase
    .from("system_features")
    .delete()
    .eq("id", featureId)
    .eq("system_id", systemId);

  if (error) return errorState("The feature could not be removed.");

  revalidateResources(context.data);
  return successState("Feature removed.");
}

export async function addExternalMedia(
  systemId: string,
  _previousState: ResourceActionState,
  formData: FormData,
): Promise<ResourceActionState> {
  const input = externalMediaInputSchema.safeParse({
    mediaType: formData.get("mediaType"),
    externalUrl: formData.get("externalUrl"),
    altText: formData.get("altText"),
  });
  if (!input.success) return validationState(input.error);

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const nextSort = await getNextSortOrder(context.data.supabase, "system_media", systemId);
  if (nextSort === null) return errorState("The media order could not be prepared.");

  const { error } = await context.data.supabase.from("system_media").insert({
    system_id: systemId,
    media_type: input.data.mediaType,
    storage_path: null,
    external_url: input.data.externalUrl,
    alt_text: input.data.altText,
    sort_order: nextSort,
  });

  if (error) return errorState("The external media link could not be added.");

  revalidateResources(context.data);
  return successState("Media link added.");
}

export async function prepareMediaUpload(
  systemId: string,
  request: unknown,
): Promise<UploadPreparation> {
  const input = mediaUploadRequestSchema.safeParse(request);
  if (!input.success) return uploadValidationFailure(input.error);

  const context = await getCatalogContext(systemId);
  if (!context.ok) return uploadContextFailure(context.state);

  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }[input.data.contentType];
  const storagePath = `${systemId}/media/${crypto.randomUUID()}.${extension}`;
  const { data, error } = await context.data.supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (error || !data) {
    return { status: "error", message: "A private image upload could not be prepared." };
  }

  return {
    status: "ready",
    bucket: MEDIA_BUCKET,
    storagePath,
    token: data.token,
    originalFileName: input.data.fileName,
    expectedSize: input.data.fileSize,
    expectedContentType: input.data.contentType,
    altText: input.data.altText,
  };
}

export async function confirmMediaUpload(
  systemId: string,
  request: unknown,
): Promise<ResourceActionState> {
  const input = confirmUploadSchema.safeParse(request);
  if (!input.success || !input.data.altText) {
    return errorState("The uploaded image metadata is invalid.");
  }

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  if (!isOwnedPath(input.data.storagePath, `${systemId}/media/`)) {
    return errorState("The uploaded image path is invalid.");
  }

  const verified = await verifyStoredObject(
    context.data.supabase,
    MEDIA_BUCKET,
    input.data.storagePath,
    input.data.expectedSize,
    mediaMimeTypes,
  );
  if (!verified.ok) {
    await removeStoredObject(context.data.supabase, MEDIA_BUCKET, input.data.storagePath);
    return errorState(verified.message);
  }

  const nextSort = await getNextSortOrder(context.data.supabase, "system_media", systemId);
  if (nextSort === null) {
    await removeStoredObject(context.data.supabase, MEDIA_BUCKET, input.data.storagePath);
    return errorState("The media order could not be prepared.");
  }

  const { error } = await context.data.supabase.from("system_media").insert({
    system_id: systemId,
    media_type: "image",
    storage_path: input.data.storagePath,
    external_url: null,
    alt_text: input.data.altText,
    sort_order: nextSort,
  });

  if (error) {
    await removeStoredObject(context.data.supabase, MEDIA_BUCKET, input.data.storagePath);
    return errorState("The image metadata could not be saved.");
  }

  revalidateResources(context.data);
  return successState("Product image uploaded.");
}

export async function removeMedia(
  systemId: string,
  mediaId: string,
): Promise<ResourceActionState> {
  if (!catalogResourceIdSchema.safeParse(mediaId).success) {
    return errorState("The media identifier is invalid.");
  }

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const [mediaResult, countResult] = await Promise.all([
    context.data.supabase
      .from("system_media")
      .select("id,storage_path")
      .eq("id", mediaId)
      .eq("system_id", systemId)
      .maybeSingle<{ id: string; storage_path: string | null }>(),
    context.data.supabase
      .from("system_media")
      .select("id", { count: "exact", head: true })
      .eq("system_id", systemId),
  ]);

  if (mediaResult.error || countResult.error || !mediaResult.data) {
    return errorState("The media item could not be verified.");
  }
  if (context.data.system.status === "published" && (countResult.count ?? 0) <= 1) {
    return errorState("A published system must keep at least one media item.");
  }

  const { error } = await context.data.supabase
    .from("system_media")
    .delete()
    .eq("id", mediaId)
    .eq("system_id", systemId);

  if (error) return errorState("The media item could not be removed.");

  let cleanupFailed = false;
  if (mediaResult.data.storage_path) {
    cleanupFailed = !(await removeStoredObject(
      context.data.supabase,
      MEDIA_BUCKET,
      mediaResult.data.storage_path,
    ));
  }

  revalidateResources(context.data);
  return cleanupFailed
    ? errorState("Media metadata was removed, but the private object needs manual cleanup.")
    : successState("Media item removed.");
}

export async function addVersion(
  systemId: string,
  _previousState: ResourceActionState,
  formData: FormData,
): Promise<ResourceActionState> {
  const input = versionInputSchema.safeParse({
    versionLabel: formData.get("versionLabel"),
    releaseNotes: formData.get("releaseNotes"),
    makeCurrent: formData.get("makeCurrent") === "on",
  });
  if (!input.success) return validationState(input.error);

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const { error } = await context.data.supabase.rpc("create_system_version", {
    p_system_id: systemId,
    p_version_label: input.data.versionLabel,
    p_release_notes: input.data.releaseNotes ?? "",
    p_make_current: input.data.makeCurrent,
  });

  if (error?.code === "23505") {
    return {
      status: "error",
      message: "That version label already exists for this system.",
      fieldErrors: { versionLabel: ["Choose a unique version label."] },
    };
  }
  if (error) return errorState("The product version could not be created.");

  revalidateResources(context.data);
  return successState("Product version created.");
}

export async function removeVersion(
  systemId: string,
  versionId: string,
): Promise<ResourceActionState> {
  if (!catalogResourceIdSchema.safeParse(versionId).success) {
    return errorState("The version identifier is invalid.");
  }

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const [versionResult, fileCount] = await Promise.all([
    context.data.supabase
      .from("system_versions")
      .select("id,is_current")
      .eq("id", versionId)
      .eq("system_id", systemId)
      .maybeSingle<{ id: string; is_current: boolean }>(),
    context.data.supabase
      .from("system_files")
      .select("id", { count: "exact", head: true })
      .eq("system_version_id", versionId),
  ]);

  if (versionResult.error || fileCount.error || !versionResult.data) {
    return errorState("The version could not be verified.");
  }
  if ((fileCount.count ?? 0) > 0) {
    return errorState("Remove the version files before deleting this version.");
  }
  if (context.data.system.status === "published" && versionResult.data.is_current) {
    return errorState("The current version of a published system cannot be removed.");
  }

  const { error } = await context.data.supabase
    .from("system_versions")
    .delete()
    .eq("id", versionId)
    .eq("system_id", systemId);

  if (error) return errorState("The version could not be removed.");

  revalidateResources(context.data);
  return successState("Version removed.");
}

export async function prepareDeliverableUpload(
  systemId: string,
  request: unknown,
): Promise<UploadPreparation> {
  const input = deliverableUploadRequestSchema.safeParse(request);
  if (!input.success) return uploadValidationFailure(input.error);

  const context = await getCatalogContext(systemId);
  if (!context.ok) return uploadContextFailure(context.state);

  if (!(await versionBelongsToSystem(context.data.supabase, input.data.versionId, systemId))) {
    return { status: "error", message: "Select a version owned by this system." };
  }

  const storagePath = `${systemId}/versions/${input.data.versionId}/${crypto.randomUUID()}.zip`;
  const { data, error } = await context.data.supabase.storage
    .from(DELIVERABLE_BUCKET)
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (error || !data) {
    return { status: "error", message: "A private ZIP upload could not be prepared." };
  }

  return {
    status: "ready",
    bucket: DELIVERABLE_BUCKET,
    storagePath,
    token: data.token,
    originalFileName: input.data.fileName,
    expectedSize: input.data.fileSize,
    expectedContentType: input.data.contentType,
    versionId: input.data.versionId,
  };
}

export async function confirmDeliverableUpload(
  systemId: string,
  request: unknown,
): Promise<ResourceActionState> {
  const input = confirmUploadSchema.safeParse(request);
  if (!input.success || !input.data.versionId) {
    return errorState("The uploaded ZIP metadata is invalid.");
  }

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const expectedPrefix = `${systemId}/versions/${input.data.versionId}/`;
  if (!isOwnedPath(input.data.storagePath, expectedPrefix)) {
    return errorState("The uploaded ZIP path is invalid.");
  }
  if (!(await versionBelongsToSystem(context.data.supabase, input.data.versionId, systemId))) {
    return errorState("The selected version does not belong to this system.");
  }

  const verified = await verifyStoredObject(
    context.data.supabase,
    DELIVERABLE_BUCKET,
    input.data.storagePath,
    input.data.expectedSize,
    deliverableMimeTypes,
  );
  if (!verified.ok) {
    await removeStoredObject(context.data.supabase, DELIVERABLE_BUCKET, input.data.storagePath);
    return errorState(verified.message);
  }

  const { error } = await context.data.supabase.from("system_files").insert({
    system_version_id: input.data.versionId,
    storage_bucket: DELIVERABLE_BUCKET,
    storage_path: input.data.storagePath,
    original_filename: input.data.originalFileName,
    byte_size: verified.size,
    sha256: null,
    created_by: context.data.admin.identity.id,
  });

  if (error) {
    await removeStoredObject(context.data.supabase, DELIVERABLE_BUCKET, input.data.storagePath);
    return errorState("The ZIP metadata could not be saved.");
  }

  revalidateResources(context.data);
  return successState("Private deliverable uploaded.");
}

export async function removeDeliverable(
  systemId: string,
  fileId: string,
): Promise<ResourceActionState> {
  if (!catalogResourceIdSchema.safeParse(fileId).success) {
    return errorState("The file identifier is invalid.");
  }

  const context = await getCatalogContext(systemId);
  if (!context.ok) return context.state;

  const fileResult = await context.data.supabase
    .from("system_files")
    .select("id,storage_path,system_version_id")
    .eq("id", fileId)
    .maybeSingle<{ id: string; storage_path: string; system_version_id: string }>();

  if (fileResult.error || !fileResult.data) {
    return errorState("The deliverable could not be verified.");
  }

  const versionResult = await context.data.supabase
    .from("system_versions")
    .select("id,is_current,system_id")
    .eq("id", fileResult.data.system_version_id)
    .eq("system_id", systemId)
    .maybeSingle<{ id: string; is_current: boolean; system_id: string }>();

  if (versionResult.error || !versionResult.data) {
    return errorState("The deliverable does not belong to this system.");
  }

  if (
    context.data.system.status === "published" &&
    context.data.system.product_type !== "custom_service" &&
    versionResult.data.is_current
  ) {
    const { count, error } = await context.data.supabase
      .from("system_files")
      .select("id", { count: "exact", head: true })
      .eq("system_version_id", versionResult.data.id);

    if (error) return errorState("The current deliverables could not be verified.");
    if ((count ?? 0) <= 1) {
      return errorState("A published sold system must keep a current private deliverable.");
    }
  }

  const { error } = await context.data.supabase
    .from("system_files")
    .delete()
    .eq("id", fileId)
    .eq("system_version_id", versionResult.data.id);

  if (error) return errorState("The deliverable metadata could not be removed.");

  const cleaned = await removeStoredObject(
    context.data.supabase,
    DELIVERABLE_BUCKET,
    fileResult.data.storage_path,
  );

  revalidateResources(context.data);
  return cleaned
    ? successState("Private deliverable removed.")
    : errorState("File metadata was removed, but the private object needs manual cleanup.");
}

async function getCatalogContext(
  systemId: string,
): Promise<
  | { ok: true; data: CatalogContext }
  | { ok: false; state: ResourceActionState }
> {
  if (!catalogResourceIdSchema.safeParse(systemId).success) {
    return { ok: false, state: errorState("The system identifier is invalid.") };
  }
  if (!isSupabasePubliclyConfigured()) {
    return {
      ok: false,
      state: {
        status: "unavailable",
        message: "Catalog management is unavailable until Supabase is connected.",
      },
    };
  }

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return {
        ok: false,
        state: errorState("Your administrator access could not be verified."),
      };
    }
    throw error;
  }

  const supabase = await createClient();
  const { data: system, error } = await supabase
    .from("systems")
    .select("id,slug,status,product_type")
    .eq("id", systemId)
    .maybeSingle<CatalogContext["system"]>();

  if (error || !system) {
    return {
      ok: false,
      state: errorState("The system no longer exists or is not accessible."),
    };
  }

  return { ok: true, data: { supabase, admin, system } };
}

async function getNextSortOrder(
  supabase: CatalogContext["supabase"],
  table: "system_features" | "system_media",
  systemId: string,
) {
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .eq("system_id", systemId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle<{ sort_order: number }>();

  if (error) return null;
  return (data?.sort_order ?? -1) + 1;
}

async function versionBelongsToSystem(
  supabase: CatalogContext["supabase"],
  versionId: string,
  systemId: string,
) {
  const { data, error } = await supabase
    .from("system_versions")
    .select("id")
    .eq("id", versionId)
    .eq("system_id", systemId)
    .maybeSingle<{ id: string }>();

  return !error && Boolean(data);
}

async function verifyStoredObject(
  supabase: CatalogContext["supabase"],
  bucket: typeof MEDIA_BUCKET | typeof DELIVERABLE_BUCKET,
  path: string,
  expectedSize: number,
  allowedMimeTypes: Set<string>,
): Promise<{ ok: true; size: number; contentType: string } | { ok: false; message: string }> {
  const { data, error } = await supabase.storage.from(bucket).info(path);
  if (error || !data || typeof data.size !== "number") {
    return { ok: false, message: "The uploaded object could not be verified." };
  }

  const contentType = data.contentType ?? "";
  if (data.size !== expectedSize) {
    return { ok: false, message: "The uploaded object size does not match the selected file." };
  }
  if (!allowedMimeTypes.has(contentType)) {
    return { ok: false, message: "The uploaded object type is not allowed." };
  }

  return { ok: true, size: data.size, contentType };
}

async function removeStoredObject(
  supabase: CatalogContext["supabase"],
  bucket: typeof MEDIA_BUCKET | typeof DELIVERABLE_BUCKET,
  path: string,
) {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}

function isOwnedPath(path: string, prefix: string) {
  return path.startsWith(prefix) && !path.includes("..") && !path.includes("\\");
}

function revalidateResources(context: CatalogContext) {
  revalidatePath(`/admin/systems/${context.system.id}/edit`);
  revalidatePath("/admin/systems");
  revalidatePath("/systems");
  revalidatePath(`/systems/${context.system.slug}`);
}

function validationState(error: z.ZodError): ResourceActionState {
  return {
    status: "error",
    message: "Review the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function uploadValidationFailure(error: z.ZodError): UploadPreparation {
  return {
    status: "error",
    message: error.issues[0]?.message ?? "The selected file is invalid.",
  };
}

function uploadContextFailure(state: ResourceActionState): UploadPreparation {
  return {
    status: state.status === "unavailable" ? "unavailable" : "error",
    message: state.message ?? "The upload could not be prepared.",
  };
}

function successState(message: string): ResourceActionState {
  return { status: "success", message };
}

function errorState(message: string): ResourceActionState {
  return { status: "error", message };
}
