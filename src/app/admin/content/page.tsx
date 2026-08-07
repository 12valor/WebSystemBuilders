import type { Metadata } from "next";
import { AdminContentWorkspace } from "@/components/admin/admin-content-workspace";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminFaqData } from "@/features/content/faq-repository";
import { getAdminTestimonialData } from "@/features/content/testimonial-repository";
import { getAdminSiteContentData } from "@/features/content/site-content-repository";
import { getAdminCompanyProfileData } from "@/features/content/company-profile-repository";

export const metadata: Metadata = {
  title: "Admin content",
  robots: { index: false, follow: false },
};

const results = ["created", "updated", "published", "archived", "testimonial-created", "testimonial-updated", "testimonial-published", "testimonial-archived", "content-created", "content-updated", "content-published", "content-archived", "company-updated", "company-published", "company-archived"] as const;

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const [data, testimonialData, siteContentData, companyProfileData, params] = await Promise.all([getAdminFaqData(), getAdminTestimonialData(), getAdminSiteContentData(), getAdminCompanyProfileData(), searchParams]);
  const result = results.find((item) => item === params.result);
  return <AdminShell active="Content"><AdminContentWorkspace data={data} testimonialData={testimonialData} siteContentData={siteContentData} companyProfileData={companyProfileData} result={result} /></AdminShell>;
}
