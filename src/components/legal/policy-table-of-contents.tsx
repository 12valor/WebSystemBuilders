"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, Printer } from "lucide-react";
import type { PolicySection } from "@/components/legal/policy-page";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function PolicyTableOfContents({ sections }: { sections: PolicySection[] }) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(slugify(section.title));
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(slugify(section.title));
            return;
          }
        }
      }

      if (sections.length > 0 && window.scrollY < 400) {
        setActiveSection(slugify(sections[0].title));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      <h3 className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
        <List className="size-3.5 text-blue-600" />
        <span>Table of Contents</span>
      </h3>

      <nav className="mt-3.5 space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
        {sections.map((section, index) => {
          const slug = slugify(section.title);
          const isCurrent = activeSection === slug;
          return (
            <button
              key={section.title}
              type="button"
              onClick={() => scrollToSection(slug)}
              className={`group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs transition ${
                isCurrent
                  ? "bg-blue-50/90 font-bold text-blue-700 shadow-2xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={`font-mono text-[10px] pt-0.5 ${isCurrent ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="leading-snug">{section.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function MobilePolicyMenu({ sections }: { sections: PolicySection[] }) {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = document.getElementById(slugify(section.title));
        if (element) {
          const top = element.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(slugify(section.title));
            return;
          }
        }
      }

      if (sections.length > 0 && window.scrollY < 400) {
        setActiveSection(slugify(sections[0].title));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md lg:hidden print:hidden">
      <div className="mx-auto w-[min(calc(100%-32px),1180px)] py-2.5">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-800"
        >
          <div className="flex items-center gap-2 truncate">
            <List className="size-4 text-blue-600 shrink-0" />
            <span className="truncate">
              {sections.find((s) => slugify(s.title) === activeSection)?.title || "Table of Contents"}
            </span>
          </div>
          <ChevronDown className={`size-4 text-slate-400 transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
            <nav className="space-y-0.5">
              {sections.map((section, idx) => {
                const slug = slugify(section.title);
                const isCurrent = activeSection === slug;
                return (
                  <button
                    key={section.title}
                    type="button"
                    onClick={() => scrollToSection(slug)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                      isCurrent
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className="font-mono text-[10px] text-slate-400">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="truncate">{section.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50 transition print:hidden"
    >
      <Printer className="size-3.5 text-slate-400" />
      <span>Print Document</span>
    </button>
  );
}
