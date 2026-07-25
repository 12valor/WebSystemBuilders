import type { Metadata } from "next";
import { AdminContentWorkspace } from "@/components/admin/admin-content-workspace";
import { getAdminPortfolioData } from "@/features/content/portfolio-repository";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminFaqData } from "@/features/content/faq-repository";
import { getAdminTestimonialData } from "@/features/content/testimonial-repository";
import { getAdminSiteContentData } from "@/features/content/site-content-repository";

export const metadata: Metadata = {
  title: "Admin content",
  robots: { index: false, follow: false },
};

const results = ["created", "updated", "published", "archived", "portfolio-created", "portfolio-updated", "portfolio-published", "portfolio-archived", "testimonial-created", "testimonial-updated", "testimonial-published", "testimonial-archived", "content-created", "content-updated", "content-published", "content-archived"] as const;

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ result?: string }>;
}) {
  const [data, portfolioData, testimonialData, siteContentData, params] = await Promise.all([getAdminFaqData(), getAdminPortfolioData(), getAdminTestimonialData(), getAdminSiteContentData(), searchParams]);
  const result = results.find((item) => item === params.result);
  return <AdminShell active="Content"><AdminContentWorkspace data={data} portfolioData={portfolioData} testimonialData={testimonialData} siteContentData={siteContentData} result={result} /></AdminShell>;
}
