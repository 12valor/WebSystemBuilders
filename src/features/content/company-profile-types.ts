export type CompanyProfileStatus = "draft" | "published" | "archived";

export type CompanyProfile = {
  id: 1;
  brandName: "WebSystemBuilders";
  companySummary: string;
  founderName: "AG Evangelista";
  founderTitle: "Web Developer";
  founderBio: string;
  publicEmail: string | null;
  publicPhone: string | null;
  status: CompanyProfileStatus;
  publishedAt: string | null;
  updatedAt: string;
};

export type PublicCompanyProfile = Omit<CompanyProfile, "status" | "publishedAt" | "updatedAt">;

export type AdminCompanyProfileData = {
  status: "ready" | "unconfigured" | "error";
  profile: CompanyProfile;
};
