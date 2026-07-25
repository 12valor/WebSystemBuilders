export type SiteContentPlacement = "announcement" | "homepage_feature";
export type SiteContentStatus = "draft" | "published" | "archived";

export type SiteContentBlock = {
  id: string;
  placement: SiteContentPlacement;
  eyebrow: string | null;
  title: string;
  body: string | null;
  actionLabel: string | null;
  actionHref: string | null;
  status: SiteContentStatus;
  sortOrder: number;
  publishedAt: string | null;
  updatedAt: string;
};

export type AdminSiteContentData = {
  status: "ready" | "unconfigured" | "error";
  items: SiteContentBlock[];
};

export type PublicSiteContent = {
  announcement: SiteContentBlock | null;
  homepageFeature: SiteContentBlock | null;
};
