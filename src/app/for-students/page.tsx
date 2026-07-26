import type { Metadata } from "next";
import { StudentLandingPage } from "@/components/marketing/student-landing-page";

export const metadata: Metadata = {
  title: "Systems and Technical Support for Students | WebSystemBuilders",
  description: "Explore ethical capstone and thesis-related system development, templates, debugging, deployment, and technical guidance.",
  alternates: { canonical: "/for-students" },
};

export default function ForStudentsPage() {
  return <StudentLandingPage />;
}
