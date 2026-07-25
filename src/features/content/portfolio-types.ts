export type PortfolioStatus = "draft" | "published" | "archived";
export type PortfolioAudience = "students" | "business" | "both";

export type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  audience: PortfolioAudience;
  summary: string;
  description: string;
  outcome: string | null;
  technologyStack: string[];
  projectUrl: string | null;
  isFeatured: boolean;
  status: PortfolioStatus;
  sortOrder: number;
  publishedAt: string | null;
  updatedAt: string;
};

export type AdminPortfolioData = {
  status: "ready" | "unconfigured" | "error";
  items: PortfolioItem[];
};

export type PublicPortfolioData = {
  status: "ready" | "unconfigured" | "error";
  items: Array<Omit<PortfolioItem, "status" | "updatedAt">>;
};
