export type FaqStatus = "draft" | "published" | "archived";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: FaqStatus;
  sortOrder: number;
  publishedAt: string | null;
  updatedAt: string;
};

export type AdminFaqData = {
  status: "ready" | "unconfigured" | "error";
  items: FaqItem[];
};
