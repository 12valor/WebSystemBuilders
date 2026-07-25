import "server-only";
import { z } from "zod";
import type {
  AdminInquiriesData,
  AdminInquiryEvent,
  AdminInquiryRecord,
} from "@/features/inquiries/admin-types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const inquiryRecordSchema = z.object({
  id: z.uuid(),
  inquiry_type: z.enum(["contact", "quote"]),
  audience: z.enum(["student", "business", "general"]),
  name: z.string(),
  email: z.string(),
  organization: z.string().nullable(),
  subject: z.string(),
  message: z.string(),
  project_type: z.string().nullable(),
  requirements: z.string().nullable(),
  timeline: z.string().nullable(),
  source_path: z.string(),
  status: z.enum(["new", "in_review", "responded", "closed", "spam"]),
  assigned_to: z.uuid().nullable(),
  responded_at: z.string().nullable(),
  closed_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

const inquiryEventSchema = z.object({
  id: z.union([z.number(), z.string()]),
  actor_user_id: z.uuid().nullable(),
  event_type: z.enum(["created", "assigned", "unassigned", "status_changed"]),
  from_status: z.enum(["new", "in_review", "responded", "closed", "spam"]).nullable(),
  to_status: z.enum(["new", "in_review", "responded", "closed", "spam"]).nullable(),
  assigned_to: z.uuid().nullable(),
  created_at: z.string(),
});

const profileSchema = z.object({
  user_id: z.uuid(),
  display_name: z.string().nullable(),
});

const inquiryColumns = "id,inquiry_type,audience,name,email,organization,subject,message,project_type,requirements,timeline,source_path,status,assigned_to,responded_at,closed_at,created_at,updated_at";

export async function getAdminInquiriesData(selectedId?: string): Promise<AdminInquiriesData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", inquiries: [], selectedInquiry: null, history: [] };
  }

  const selected = z.uuid().safeParse(selectedId);
  const supabase = await createClient();
  const [inquiryResult, historyResult] = await Promise.all([
    supabase
      .from("inquiries")
      .select(inquiryColumns)
      .order("created_at", { ascending: false })
      .limit(200),
    selected.success
      ? supabase
          .from("inquiry_events")
          .select("id,actor_user_id,event_type,from_status,to_status,assigned_to,created_at")
          .eq("inquiry_id", selected.data)
          .order("created_at", { ascending: false })
          .limit(100)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (inquiryResult.error || historyResult.error) {
    return { status: "error", inquiries: [], selectedInquiry: null, history: [] };
  }

  const inquiries = z.array(inquiryRecordSchema).safeParse(inquiryResult.data);
  const history = z.array(inquiryEventSchema).safeParse(historyResult.data);
  if (!inquiries.success || !history.success) {
    return { status: "error", inquiries: [], selectedInquiry: null, history: [] };
  }

  const actorIds = [
    ...inquiries.data.map((inquiry) => inquiry.assigned_to),
    ...history.data.flatMap((event) => [event.actor_user_id, event.assigned_to]),
  ];
  const labels = await loadProfileLabels(supabase, actorIds);
  const mappedInquiries = inquiries.data.map((inquiry) => mapInquiry(inquiry, labels));

  return {
    status: "ready",
    inquiries: mappedInquiries,
    selectedInquiry: selected.success
      ? mappedInquiries.find((inquiry) => inquiry.id === selected.data) ?? null
      : null,
    history: history.data.map((event) => mapEvent(event, labels)),
  };
}

async function loadProfileLabels(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: Array<string | null>,
) {
  const ids = [...new Set(userIds.filter((id): id is string => Boolean(id)))];
  const labels = new Map<string, string>();
  if (ids.length === 0) return labels;

  const result = await supabase.from("profiles").select("user_id,display_name").in("user_id", ids);
  if (result.error) return labels;

  const profiles = z.array(profileSchema).safeParse(result.data);
  if (!profiles.success) return labels;
  for (const profile of profiles.data) {
    labels.set(profile.user_id, profile.display_name?.trim() || "Administrator");
  }
  return labels;
}

function mapInquiry(
  inquiry: z.infer<typeof inquiryRecordSchema>,
  labels: Map<string, string>,
): AdminInquiryRecord {
  return {
    id: inquiry.id,
    inquiryType: inquiry.inquiry_type,
    audience: inquiry.audience,
    name: inquiry.name,
    email: inquiry.email,
    organization: inquiry.organization,
    subject: inquiry.subject,
    message: inquiry.message,
    projectType: inquiry.project_type,
    requirements: inquiry.requirements,
    timeline: inquiry.timeline,
    sourcePath: inquiry.source_path,
    status: inquiry.status,
    assignedTo: inquiry.assigned_to,
    assignedLabel: inquiry.assigned_to
      ? labels.get(inquiry.assigned_to) ?? "Administrator"
      : null,
    respondedAt: inquiry.responded_at,
    closedAt: inquiry.closed_at,
    createdAt: inquiry.created_at,
    updatedAt: inquiry.updated_at,
  };
}

function mapEvent(
  event: z.infer<typeof inquiryEventSchema>,
  labels: Map<string, string>,
): AdminInquiryEvent {
  return {
    id: String(event.id),
    eventType: event.event_type,
    actorLabel: event.actor_user_id
      ? labels.get(event.actor_user_id) ?? "Administrator"
      : "System",
    fromStatus: event.from_status,
    toStatus: event.to_status,
    assignedLabel: event.assigned_to
      ? labels.get(event.assigned_to) ?? "Administrator"
      : null,
    createdAt: event.created_at,
  };
}
