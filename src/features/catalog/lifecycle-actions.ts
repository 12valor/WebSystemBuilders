"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  archiveSystemConfirmationSchema,
  canArchiveSystem,
  canUnpublishSystem,
  systemLifecycleStatusSchema,
} from "@/features/catalog/lifecycle-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type SystemLifecycleState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
};

const systemIdSchema = z.uuid();

export async function duplicateSystem(
  systemId: string,
  _previousState: SystemLifecycleState,
  _formData: FormData,
): Promise<SystemLifecycleState> {
  void _previousState;
  void _formData;
  const id = systemIdSchema.safeParse(systemId);
  if (!id.success) return invalidSystemState();

  const context = await authorizeLifecycle();
  if (!context.ok) return context.state;

  const { data, error } = await context.supabase.rpc("duplicate_system", {
    p_system_id: id.data,
  });
  const createdId = z.uuid().safeParse(data);

  if (error || !createdId.success) {
    return {
      status: "error",
      message: "The private duplicate could not be created.",
    };
  }

  revalidateCatalogPaths(id.data);
  revalidateCatalogPaths(createdId.data);
  redirect(`/admin/systems/${createdId.data}/edit?duplicated=1`);
}

export async function unpublishSystem(
  systemId: string,
  _previousState: SystemLifecycleState,
  _formData: FormData,
): Promise<SystemLifecycleState> {
  void _previousState;
  void _formData;
  const id = systemIdSchema.safeParse(systemId);
  if (!id.success) return invalidSystemState();

  const context = await authorizeLifecycle();
  if (!context.ok) return context.state;
  const current = await loadCurrentSystem(context.supabase, id.data);
  if (!current.ok) return current.state;

  if (!canUnpublishSystem(current.system.status)) {
    return {
      status: "error",
      message: "Only a published system can be unpublished.",
    };
  }

  const updated = await updateLifecycleStatus(
    context.supabase,
    current.system,
    "unlisted",
    context.adminId,
  );
  if (!updated.ok) return updated.state;

  revalidateCatalogPaths(id.data, current.system.slug);
  redirect(`/admin/systems/${id.data}/edit?unpublished=1`);
}

export async function archiveSystem(
  systemId: string,
  _previousState: SystemLifecycleState,
  formData: FormData,
): Promise<SystemLifecycleState> {
  void _previousState;
  const id = systemIdSchema.safeParse(systemId);
  if (!id.success) return invalidSystemState();

  const confirmation = archiveSystemConfirmationSchema.safeParse(formData.get("confirmation"));
  if (!confirmation.success) {
    return {
      status: "error",
      message: "Confirm that the system should be archived before continuing.",
    };
  }

  const context = await authorizeLifecycle();
  if (!context.ok) return context.state;
  const current = await loadCurrentSystem(context.supabase, id.data);
  if (!current.ok) return current.state;

  if (!canArchiveSystem(current.system.status)) {
    return { status: "error", message: "This system is already archived." };
  }

  const updated = await updateLifecycleStatus(
    context.supabase,
    current.system,
    "archived",
    context.adminId,
  );
  if (!updated.ok) return updated.state;

  revalidateCatalogPaths(id.data, current.system.slug);
  redirect(`/admin/systems/${id.data}/edit?archived=1`);
}

async function authorizeLifecycle(): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; adminId: string }
  | { ok: false; state: SystemLifecycleState }
> {
  if (!isSupabasePubliclyConfigured()) {
    return {
      ok: false,
      state: {
        status: "unavailable",
        message: "System operations are unavailable until the Supabase project is connected.",
      },
    };
  }

  try {
    const admin = await requireAdmin();
    return { ok: true, supabase: await createClient(), adminId: admin.identity.id };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return {
        ok: false,
        state: { status: "error", message: "Your administrator access could not be verified." },
      };
    }
    throw error;
  }
}

async function loadCurrentSystem(
  supabase: Awaited<ReturnType<typeof createClient>>,
  systemId: string,
): Promise<
  | {
      ok: true;
      system: {
        id: string;
        slug: string;
        status: z.infer<typeof systemLifecycleStatusSchema>;
        updatedAt: string;
      };
    }
  | { ok: false; state: SystemLifecycleState }
> {
  const result = await supabase
    .from("systems")
    .select("id,slug,status,updated_at")
    .eq("id", systemId)
    .maybeSingle<{
      id: string;
      slug: string;
      status: string;
      updated_at: string;
    }>();

  if (result.error) {
    return { ok: false, state: { status: "error", message: "The system could not be verified." } };
  }
  if (!result.data) {
    return { ok: false, state: { status: "error", message: "The system no longer exists or is not accessible." } };
  }

  const status = systemLifecycleStatusSchema.safeParse(result.data.status);
  if (!status.success) {
    return { ok: false, state: { status: "error", message: "The system has an unsupported lifecycle state." } };
  }

  return {
    ok: true,
    system: {
      id: result.data.id,
      slug: result.data.slug,
      status: status.data,
      updatedAt: result.data.updated_at,
    },
  };
}

async function updateLifecycleStatus(
  supabase: Awaited<ReturnType<typeof createClient>>,
  system: {
    id: string;
    slug: string;
    status: z.infer<typeof systemLifecycleStatusSchema>;
    updatedAt: string;
  },
  status: "unlisted" | "archived",
  adminId: string,
): Promise<{ ok: true } | { ok: false; state: SystemLifecycleState }> {
  const { data, error } = await supabase
    .from("systems")
    .update({ status, updated_by: adminId })
    .eq("id", system.id)
    .eq("updated_at", system.updatedAt)
    .select("id")
    .maybeSingle<{ id: string }>();

  if (error) {
    return { ok: false, state: { status: "error", message: "The lifecycle change could not be saved." } };
  }
  if (!data) {
    return {
      ok: false,
      state: {
        status: "error",
        message: "Another administrator changed this system. Reload it before trying again.",
      },
    };
  }
  return { ok: true };
}

function invalidSystemState(): SystemLifecycleState {
  return { status: "error", message: "The system identifier is invalid." };
}

function revalidateCatalogPaths(systemId: string, slug?: string) {
  revalidatePath("/");
  revalidatePath("/for-students");
  revalidatePath("/for-business");
  revalidatePath("/systems");
  revalidatePath("/admin");
  revalidatePath("/admin/systems");
  revalidatePath(`/admin/systems/${systemId}/edit`);
  if (slug) revalidatePath(`/systems/${slug}`);
}
