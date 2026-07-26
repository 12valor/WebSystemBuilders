import type { Metadata } from "next";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { StudentLandingContent } from "@/components/marketing/student-landing-content";

export const metadata: Metadata = {
  title: "Systems and Technical Support for Students | WebSystemBuilders",
  description: "Explore ethical capstone and thesis-related system development, templates, debugging, deployment, and technical guidance.",
  alternates: { canonical: "/for-students" },
};

export default function ForStudentsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <StudentLandingContent />
      </main>
      <SiteFooter />
    </>
  );
}
