import type { AdminActivityRecord } from "@/features/admin/types";

const actionLabels: Record<string, string> = {
  "system.created": "Created a system draft",
  "system.updated": "Updated a system",
  "system.duplicated": "Duplicated a system",
  "system.unpublished": "Unpublished a system",
  "system.archived": "Archived a system",
  "category.created": "Created a category",
  "category.updated": "Updated a category",
  "media.created": "Added catalog media",
  "media.updated": "Updated catalog media",
  "media.removed": "Removed catalog media",
  "faq.created": "Created an FAQ draft",
  "faq.updated": "Updated an FAQ",
  "faq.published": "Published an FAQ",
  "faq.archived": "Archived an FAQ",
  "testimonial.created": "Created a testimonial draft",
  "testimonial.updated": "Updated a testimonial",
  "testimonial.published": "Published a testimonial",
  "testimonial.archived": "Archived a testimonial",
  "content_block.created": "Created a site-content draft",
  "content_block.updated": "Updated site content",
  "content_block.published": "Published site content",
  "content_block.archived": "Archived site content",
  "company_profile.updated": "Updated the company profile",
  "company_profile.published": "Published the company profile",
  "company_profile.archived": "Archived the company profile",
  "admin_access.granted": "Granted or changed administrator access",
  "admin_access.revoked": "Revoked administrator access",
  "inquiry.updated": "Updated an inquiry",
  "order.paid": "Verified an order payment",
  "delivery.revoked": "Revoked order delivery",
  "support.created": "Created an order support request",
  "support.updated": "Updated order support",
};

const safeMetadataKeys = ["name", "slug", "status", "previous_status", "audience", "is_active", "assigned", "inquiry_type", "media_type", "source", "category", "is_featured", "placement", "has_public_email", "has_public_phone", "access_action", "role", "order_number", "order_id"] as const;

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
