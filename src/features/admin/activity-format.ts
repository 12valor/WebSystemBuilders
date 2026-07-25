import type { AdminActivityRecord } from "@/features/admin/types";

const actionLabels: Record<string, string> = {
  "system.created": "Created a system draft",
  "system.updated": "Updated a system",
  "category.created": "Created a category",
  "category.updated": "Updated a category",
};

const safeMetadataKeys = ["name", "slug", "status", "audience", "is_active"] as const;

export function formatActivityAction(action: string) {
  return actionLabels[action] ?? action.replaceAll(".", " ");
}

export function formatActivityDetails(metadata: AdminActivityRecord["metadata"]) {
  const details = safeMetadataKeys.flatMap((key) => {
    const value = metadata[key];
    if (typeof value !== "string" && typeof value !== "boolean") return [];
    const label = key === "is_active" ? "active" : key.replaceAll("_", " ");
    return [`${label}: ${String(value)}`];
  });
  return details.join(" · ");
}

export function formatAdminDateTime(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value));
}
