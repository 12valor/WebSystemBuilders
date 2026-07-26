import type { CompanyProfile, PublicCompanyProfile } from "@/features/content/company-profile-types";

export const approvedCompanyProfile: CompanyProfile = {
  id: 1,
  brandName: "WebSystemBuilders",
  companySummary: "WebSystemBuilders helps students and business owners access ready-made software systems and request custom development through one professional platform.",
  founderName: "AG Evangelista",
  founderTitle: "Web Developer",
  founderBio: "AG Evangelista is the founder of WebSystemBuilders and a web developer focused on creating practical software solutions for students and business owners.",
  publicEmail: "evangelista.agdiaz@gmail.com",
  publicPhone: null,
  status: "published",
  publishedAt: "2026-07-26T00:00:00.000Z",
  updatedAt: "2026-07-26T00:00:00.000Z",
};

export function toPublicCompanyProfile(profile: CompanyProfile): PublicCompanyProfile {
  const { status: _status, publishedAt: _publishedAt, updatedAt: _updatedAt, ...publicProfile } = profile;
  void _status; void _publishedAt; void _updatedAt;
  return publicProfile;
}
