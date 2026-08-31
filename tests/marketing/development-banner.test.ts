import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("development banner and shadcn UI primitives", () => {
  it("provides shadcn button primitive at src/components/ui/button.tsx", () => {
    const buttonFile = readFileSync(resolve("src/components/ui/button.tsx"), "utf8");
    expect(buttonFile).toContain("export { Button, buttonVariants }");
    expect(buttonFile).toContain("class-variance-authority");
    expect(buttonFile).toContain("@radix-ui/react-slot");
  });

  it("provides shadcn banner primitive at src/components/ui/banner.tsx", () => {
    const bannerFile = readFileSync(resolve("src/components/ui/banner.tsx"), "utf8");
    expect(bannerFile).toContain("export { Banner");
    expect(bannerFile).toContain("bannerVariants");
    expect(bannerFile).toContain('variant: {');
    expect(bannerFile).toContain('size: {');
  });

  it("provides development notice banner with compliant messaging", () => {
    const noticeFile = readFileSync(resolve("src/components/marketing/development-notice-banner.tsx"), "utf8");
    expect(noticeFile).toContain("This website is in development.");
    expect(noticeFile).toContain("Some features and content may still be updated.");
    expect(noticeFile).toContain("Construction");
    expect(noticeFile).toContain("Learn more");
    expect(noticeFile).toContain('aria-label="Close development notice"');
    expect(noticeFile).toContain('export function DevelopmentNoticeBanner');
    expect(noticeFile).toContain('export function BannerCenteredButton');

    // Asserts that prohibited or negative slop language is avoided
    const lower = noticeFile.toLowerCase();
    expect(lower).not.toContain("live and ready to use");
    expect(lower).not.toContain("expect bugs");
    expect(lower).not.toContain("website incomplete");
    expect(lower).not.toContain("website not finished");
    expect(lower).not.toContain("beta website");
  });

  it("integrates development notice into SiteHeader below navigation", () => {
    const siteHeaderFile = readFileSync(resolve("src/components/marketing/site-header.tsx"), "utf8");
    expect(siteHeaderFile).toContain("DevelopmentNoticeBanner");
    expect(siteHeaderFile).toContain("<DevelopmentNoticeBanner />");
    expect(siteHeaderFile.indexOf("<DevelopmentNoticeBanner />")).toBeGreaterThan(
      siteHeaderFile.indexOf("<SiteNavigation />")
    );
  });
});
