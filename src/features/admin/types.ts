import type { CatalogAudienceValue } from "@/features/catalog/types";

export type AdminDataStatus = "ready" | "unconfigured" | "error";

export type AdminActivityRecord = {
  id: string;
  actorLabel: string;
  action: string;
  targetTable: string;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type AdminInquirySummary = {
  id: string;
  subject: string;
  audience: "student" | "business" | "general";
  status: "new" | "in_review" | "responded" | "closed" | "spam";
  createdAt: string;
};

export type AdminDashboardData = {
  status: AdminDataStatus;
  metrics: {
    publishedSystems: number | null;
    draftSystems: number | null;
    activeCategories: number | null;
    newInquiries: number | null;
  };
  recentActivity: AdminActivityRecord[];
  recentInquiries: AdminInquirySummary[];
};

export type AdminManagedCategory = {
  id: string;
  name: string;
  slug: string;
  audience: CatalogAudienceValue;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  linkedSystemCount: number;
  updatedAt: string;
};

export type AdminCategoriesData = {
  status: AdminDataStatus;
  categories: AdminManagedCategory[];
};

export type AdminAuditLogData = {
  status: AdminDataStatus;
  activities: AdminActivityRecord[];
};
