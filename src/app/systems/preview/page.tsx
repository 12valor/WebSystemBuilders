import type { Metadata } from "next";
import { SystemDetailPreview } from "@/components/catalog/system-detail-preview";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export const metadata: Metadata = {
  title: "System detail layout preview",
  description: "Phase 1 interface preview for an administrator-published system listing.",
  robots: { index: false, follow: false },
};

export default function SystemDetailPreviewPage() {
  return (
    <>
      <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 bg-white px-3 py-2 text-sm font-semibold text-black transition-transform focus:translate-y-0">Skip to content</a>
      <SiteHeader />
      <SystemDetailPreview />
      <SiteFooter />
    </>
  );
}
