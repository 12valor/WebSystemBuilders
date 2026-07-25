export type AdminMediaRecord = {
  id: string;
  mediaType: "image" | "video" | "demo";
  source: "upload" | "external";
  previewUrl: string | null;
  externalUrl: string | null;
  altText: string | null;
  sortOrder: number;
  createdAt: string;
  system: {
    id: string;
    title: string;
    slug: string;
    status: "draft" | "published" | "unlisted" | "archived";
  };
};

export type AdminMediaData = {
  status: "ready" | "unconfigured" | "error";
  media: AdminMediaRecord[];
};

export type AdminMediaFilters = {
  query: string;
  mediaType: "all" | AdminMediaRecord["mediaType"];
  source: "all" | AdminMediaRecord["source"];
  systemStatus: "all" | AdminMediaRecord["system"]["status"];
};
