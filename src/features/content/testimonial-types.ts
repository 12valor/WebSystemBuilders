export type TestimonialStatus = "draft" | "published" | "archived";

export type TestimonialItem = {
  id: string;
  quote: string;
  attributionName: string;
  attributionRole: string | null;
  attributionOrganization: string | null;
  relationshipContext: string;
  verificationReference: string;
  permissionConfirmedAt: string | null;
  isFeatured: boolean;
  status: TestimonialStatus;
  sortOrder: number;
  publishedAt: string | null;
  updatedAt: string;
};

export type AdminTestimonialData = {
  status: "ready" | "unconfigured" | "error";
  items: TestimonialItem[];
};

export type PublicTestimonial = Pick<
  TestimonialItem,
  "id" | "quote" | "attributionName" | "attributionRole" | "attributionOrganization" | "relationshipContext" | "isFeatured"
>;
