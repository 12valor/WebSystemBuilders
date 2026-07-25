"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { adminInquiryUpdateSchema } from "@/features/inquiries/admin-schema";
import { AuthorizationError, requireAdmin } from "@/lib/auth/authorization";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

export type AdminInquiryState = {
  status: "idle" | "error" | "unavailable";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const inquiryIdSchema = z.uuid();

export async function updateAdminInquiry(
  inquiryId: string,
  _previousState: AdminInquiryState,
  formData: FormData,
): Promise<AdminInquiryState> {
  const id = inquiryIdSchema.safeParse(inquiryId);
  if (!id.success) return { status: "error", message: "The inquiry identifier is invalid." };

  const input = adminInquiryUpdateSchema.safeParse({
    status: formData.get("status"),
    assignment: formData.get("assignment"),
  });
  if (!input.success) {
    return {
      status: "error",
      message: "Review the inquiry controls before saving.",
      fieldErrors: input.error.flatten().fieldErrors,
    };
  }

  if (!isSupabasePubliclyConfigured()) {
    return {
      status: "unavailable",
      message: "Inquiry operations are unavailable until the Supabase project is connected.",
    };
  }

  let admin;
  try {
    admin = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { status: "error", message: "Your administrator access could not be verified." };
    }
    throw error;
  }

  const supabase = await createClient();
  const currentResult = await supabase
    .from("inquiries")
    .select("id,status,assigned_to,responded_at,closed_at")
    .eq("id", id.data)
    .maybeSingle<{
      id: string;
      status: "new" | "in_review" | "responded" | "closed" | "spam";
      assigned_to: string | null;
      responded_at: string | null;
      closed_at: string | null;
    }>();

  if (currentResult.error) {
    return { status: "error", message: "The inquiry could not be verified." };
  }
  if (!currentResult.data) {
    return { status: "error", message: "The inquiry no longer exists or is not accessible." };
  }

  const assignedTo = input.data.assignment === "assign_to_me"
    ? admin.identity.id
    : input.data.assignment === "unassign"
      ? null
      : currentResult.data.assigned_to;

  const unchanged = input.data.status === currentResult.data.status
    && assignedTo === currentResult.data.assigned_to;
  if (unchanged) redirect(`/admin/inquiries?id=${id.data}&result=unchanged`);

  const now = new Date().toISOString();
  const respondedAt = currentResult.data.responded_at
    ?? (input.data.status === "responded" ? now : null);
  const closedAt = input.data.status === "closed"
    ? currentResult.data.closed_at ?? now
    : null;

  const { error } = await supabase
    .from("inquiries")
    .update({
      status: input.data.status,
      assigned_to: assignedTo,
      responded_at: respondedAt,
      closed_at: closedAt,
    })
    .eq("id", id.data);

  if (error) return { status: "error", message: "The inquiry could not be updated." };

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/audit-log");
  redirect(`/admin/inquiries?id=${id.data}&result=updated`);
}
