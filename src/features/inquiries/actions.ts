"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { inquirySchema, type InquiryInput } from "@/features/inquiries/schemas";
import { getInquiryEnv, isInquirySubmissionConfigured } from "@/lib/env/inquiries";

export type InquiryFieldName =
  | "inquiryType"
  | "name"
  | "email"
  | "audience"
  | "organization"
  | "subject"
  | "message"
  | "projectType"
  | "requirements"
  | "timeline"
  | "sourcePath"
  | "consent";

export type InquiryFormValues = Partial<Record<InquiryFieldName, string>>;

export type InquiryState = {
  status: "idle" | "success" | "error" | "unavailable" | "limited";
  message?: string;
  values?: InquiryFormValues;
  fieldErrors?: Partial<Record<InquiryFieldName, string[]>>;
};

const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function submitInquiry(
  _previousState: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  if (String(formData.get("website") ?? "").trim()) {
    return { status: "success", message: "Your inquiry has been received." };
  }

  const values = formValues(formData);
  const parsed = inquirySchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      values,
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<Record<InquiryFieldName, string[]>>,
    };
  }

  if (!isInquirySubmissionConfigured()) {
    return {
      status: "unavailable",
      message: "Secure inquiry submission is still being configured. Your information was not sent or stored.",
      values,
    };
  }

  const env = getInquiryEnv();
  const requestHeaders = await headers();
  const requestAddress = getRequestAddress(requestHeaders);
  const requestFingerprint = fingerprint(requestAddress, env.INQUIRY_FINGERPRINT_SALT);
  const emailFingerprint = fingerprint(parsed.data.email.toLowerCase(), env.INQUIRY_FINGERPRINT_SALT);
  const supabase = createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count, error: rateLimitError } = await supabase
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .gte("created_at", windowStart)
    .or(`request_fingerprint.eq.${requestFingerprint},email_fingerprint.eq.${emailFingerprint}`);

  if (rateLimitError) return unavailableState(values);

  if ((count ?? 0) >= RATE_LIMIT_COUNT) {
    return {
      status: "limited",
      message: "Too many inquiries were submitted recently. Please wait before trying again.",
      values,
    };
  }

  const record = mapInquiryRecord(parsed.data, requestFingerprint, emailFingerprint);
  const { error } = await supabase.from("inquiries").insert(record);

  if (error) return unavailableState(values);

  return {
    status: "success",
    message: "Your inquiry has been received and is ready for review.",
  };
}

function formValues(formData: FormData): InquiryFormValues {
  return {
    inquiryType: String(formData.get("inquiryType") ?? ""),
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    audience: String(formData.get("audience") ?? ""),
    organization: String(formData.get("organization") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    projectType: String(formData.get("projectType") ?? ""),
    requirements: String(formData.get("requirements") ?? ""),
    timeline: String(formData.get("timeline") ?? ""),
    sourcePath: String(formData.get("sourcePath") ?? ""),
    consent: String(formData.get("consent") ?? ""),
  };
}

function mapInquiryRecord(
  input: InquiryInput,
  requestFingerprint: string,
  emailFingerprint: string,
) {
  return {
    inquiry_type: input.inquiryType,
    name: input.name,
    email: input.email.toLowerCase(),
    audience: input.audience,
    organization: input.organization ?? null,
    subject: input.subject,
    message: input.message,
    project_type: input.inquiryType === "quote" ? input.projectType : null,
    requirements: input.inquiryType === "quote" ? input.requirements : null,
    timeline: input.timeline ?? null,
    source_path: input.sourcePath,
    request_fingerprint: requestFingerprint,
    email_fingerprint: emailFingerprint,
  };
}

function getRequestAddress(requestHeaders: Headers) {
  const forwarded = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || requestHeaders.get("x-real-ip")?.trim() || "unavailable";
}

function fingerprint(value: string, salt: string) {
  return createHmac("sha256", salt).update(value).digest("hex");
}

function unavailableState(values: InquiryFormValues): InquiryState {
  return {
    status: "unavailable",
    message: "The inquiry could not be stored securely. Please wait a moment and try again.",
    values,
  };
}
