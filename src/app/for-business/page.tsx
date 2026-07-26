import type { Metadata } from "next";
import { BusinessLandingContent } from "@/components/marketing/business-landing-content";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "Software Systems for Business Operations | WebSystemBuilders",
  description: "Explore ready-made and custom software systems for sales, inventory, warehouse, and management workflows.",
  alternates: { canonical: "/for-business" },
};

export default function ForBusinessPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <BusinessLandingContent />
      </main>
      <SiteFooter />
    </>
  );
}
