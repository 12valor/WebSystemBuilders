import "server-only";
import { z } from "zod";
import type {
  AdminActivityRecord,
  AdminAuditLogData,
  AdminCategoriesData,
  AdminDashboardData,
} from "@/features/admin/types";
import { isSupabasePubliclyConfigured } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

const systemSummarySchema = z.object({
  id: z.uuid(),
  category_id: z.uuid().nullable(),
  status: z.enum(["draft", "published", "unlisted", "archived"]),
  audience: z.enum(["students", "business", "both"]),
});

const categorySchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  audience: z.enum(["students", "business", "both"]),
  description: z.string().nullable(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  updated_at: z.string(),
});

const inquirySchema = z.object({
  id: z.uuid(),
  subject: z.string(),
  audience: z.enum(["student", "business", "general"]),
  status: z.enum(["new", "in_review", "responded", "closed", "spam"]),
  created_at: z.string(),
});

const auditSchema = z.object({
  id: z.union([z.number(), z.string()]),
  actor_user_id: z.uuid().nullable(),
  action: z.string(),
  target_table: z.string(),
  target_id: z.string().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  created_at: z.string(),
});

const profileSchema = z.object({
  user_id: z.uuid(),
  display_name: z.string().nullable(),
});

const emptyMetrics = {
  publishedSystems: null,
  draftSystems: null,
  activeCategories: null,
  newInquiries: null,
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  if (!isSupabasePubliclyConfigured()) {
    return { status: "unconfigured", metrics: emptyMetrics, recentActivity: [], recentInquiries: [] };
  }

  const supabase = await createClient();
  const [systemResult, categoryResult, inquiryResult, newInquiryResult, auditResult] = await Promise.all([
    supabase.from("systems").select("id,category_id,status,audience"),
    supabase.from("system_categories").select("id,name,slug,audience,description,sort_order,is_active,updated_at"),
    supabase
      .from("inquiries")
      .select("id,subject,audience,status,created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("audit_logs")
      .select("id,actor_user_id,action,target_table,target_id,metadata,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  if (systemResult.error || categoryResult.error || inquiryResult.error || newInquiryResult.error || auditResult.error) {
    return { status: "error", metrics: emptyMetrics, recentActivity: [], recentInquiries: [] };
  }

  const systems = z.array(systemSummarySchema).safeParse(systemResult.data);
  const categories = z.array(categorySchema).safeParse(categoryResult.data);
  const inquiries = z.array(inquirySchema).safeParse(inquiryResult.data);
  const audits = z.array(auditSchema).safeParse(auditResult.data);

  if (!systems.success || !categories.success || !inquiries.success || !audits.success) {
    return { status: "error", metrics: emptyMetrics, recentActivity: [], recentInquiries: [] };
  }

  const actorLabels = await loadActorLabels(
    supabase,
    audits.data.map((activity) => activity.actor_user_id),
  );

  return {
    status: "ready",
    metrics: {
      publishedSystems: systems.data.filter((system) => system.status === "published").length,
      draftSystems: systems.data.filter((system) => system.status === "draft" || system.status === "unlisted").length,
      activeCategories: categories.data.filter((category) => category.is_active).length,
      newInquiries: newInquiryResult.count ?? 0,
    },
    recentActivity: audits.data.map((activity) => mapActivity(activity, actorLabels)),
    recentInquiries: inquiries.data.map((inquiry) => ({
      id: inquiry.id,
      subject: inquiry.subject,
      audience: inquiry.audience,
      status: inquiry.status,
      createdAt: inquiry.created_at,
    })),
  };
}

export async function getAdminCategoriesData(): Promise<AdminCategoriesData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", categories: [] };

  const supabase = await createClient();
  const [categoryResult, systemResult] = await Promise.all([
    supabase
      .from("system_categories")
      .select("id,name,slug,audience,description,sort_order,is_active,updated_at")
      .order("sort_order")
      .order("name"),
    supabase.from("systems").select("id,category_id,status,audience"),
  ]);

  if (categoryResult.error || systemResult.error) return { status: "error", categories: [] };

  const categories = z.array(categorySchema).safeParse(categoryResult.data);
  const systems = z.array(systemSummarySchema).safeParse(systemResult.data);
  if (!categories.success || !systems.success) return { status: "error", categories: [] };

  return {
    status: "ready",
    categories: categories.data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      audience: category.audience,
      description: category.description,
      sortOrder: category.sort_order,
      isActive: category.is_active,
      linkedSystemCount: systems.data.filter((system) => system.category_id === category.id).length,
      updatedAt: category.updated_at,
    })),
  };
}

export async function getAdminAuditLogData(): Promise<AdminAuditLogData> {
  if (!isSupabasePubliclyConfigured()) return { status: "unconfigured", activities: [] };

  const supabase = await createClient();
  const result = await supabase
    .from("audit_logs")
    .select("id,actor_user_id,action,target_table,target_id,metadata,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (result.error) return { status: "error", activities: [] };
  const audits = z.array(auditSchema).safeParse(result.data);
  if (!audits.success) return { status: "error", activities: [] };

  const actorLabels = await loadActorLabels(
    supabase,
    audits.data.map((activity) => activity.actor_user_id),
  );

  return {
    status: "ready",
    activities: audits.data.map((activity) => mapActivity(activity, actorLabels)),
  };
}

async function loadActorLabels(
  supabase: Awaited<ReturnType<typeof createClient>>,
  actorIds: Array<string | null>,
) {
  const ids = [...new Set(actorIds.filter((id): id is string => Boolean(id)))];
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

function mapActivity(
  activity: z.infer<typeof auditSchema>,
  actorLabels: Map<string, string>,
): AdminActivityRecord {
  return {
    id: String(activity.id),
    actorLabel: activity.actor_user_id
      ? actorLabels.get(activity.actor_user_id) ?? "Administrator"
      : "System",
    action: activity.action,
    targetTable: activity.target_table,
    targetId: activity.target_id,
    metadata: activity.metadata,
    createdAt: activity.created_at,
  };
}
