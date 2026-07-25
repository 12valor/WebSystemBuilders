import type {
  AdminMediaFilters,
  AdminMediaRecord,
} from "@/features/catalog/admin-media-types";

export function filterAdminMedia(
  media: AdminMediaRecord[],
  filters: AdminMediaFilters,
) {
  const query = filters.query.trim().toLowerCase();

  return media.filter((item) => {
    const searchable = [
      item.altText,
      item.system.title,
      item.system.slug,
      item.mediaType,
    ].filter(Boolean).join(" ").toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (filters.mediaType === "all" || item.mediaType === filters.mediaType) &&
      (filters.source === "all" || item.source === filters.source) &&
      (filters.systemStatus === "all" || item.system.status === filters.systemStatus)
    );
  });
}

export function getAdminMediaMetrics(media: AdminMediaRecord[]) {
  return {
    total: media.length,
    uploads: media.filter((item) => item.source === "upload").length,
    external: media.filter((item) => item.source === "external").length,
    needsAttention: media.filter((item) => !item.altText || (item.source === "upload" && !item.previewUrl)).length,
  };
}
