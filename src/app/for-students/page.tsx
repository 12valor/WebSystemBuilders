import type { Metadata } from "next";
import {
  EditorialSection,
  PublicCallToAction,
  PublicPageHero,
  PublicPageShell,
  StatementSection,
} from "@/components/marketing/public-page";

export const metadata: Metadata = {
  title: "Systems and technical support for students",
  description: "Explore ethical capstone and thesis-related system development, templates, debugging, deployment, and technical guidance.",
  alternates: { canonical: "/for-students" },
};

export default function ForStudentsPage() {
  return (
    <PublicPageShell>
      <PublicPageHero
        eyebrow="For students"
        title="Technical support for the system you need to build."
        description="Explore ready-made foundations or request development support for a capstone, thesis-related, or other approved academic software project."
        primary={{ label: "Browse student systems", href: "/systems?audience=students" }}
        secondary={{ label: "View custom development", href: "/services/custom-development" }}
      />
      <EditorialSection
        eyebrow="Student services"
        title="Support across the technical workflow."
        introduction="The right service depends on your approved requirements, current progress, and the rules of your school or program."
        items={[
          { title: "System development", description: "Build the software implementation around reviewed functional requirements and an agreed technical scope." },
          { title: "Templates and starting points", description: "Use a ready-made system as a technical foundation when its features and license match the project." },
          { title: "Debugging and deployment", description: "Identify implementation problems, prepare the system environment, and work through deployment requirements." },
          { title: "Documentation guidance", description: "Receive technical guidance for explaining the system architecture, setup, features, and limitations." },
        ]}
      />
      <StatementSection
        eyebrow="Ethical boundary"
        title="Technical help should support your learning, not misrepresent it."
        copy={[
          "WebSystemBuilders provides software development, debugging, deployment assistance, documentation guidance, and technical mentoring.",
          "Every student remains responsible for following school policies, understanding the submitted work, and presenting authorship honestly. No service guarantees grades or bypasses academic requirements.",
        ]}
      />
      <PublicCallToAction
        title="Start with the approved requirements."
        description="Review available student systems first. If none match, continue with custom development and prepare the functional requirements your school has approved."
        primary={{ label: "Explore student systems", href: "/systems?audience=students" }}
        secondary={{ label: "Custom development", href: "/services/custom-development" }}
      />
    </PublicPageShell>
  );
}
