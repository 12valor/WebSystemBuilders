import { describe, expect, it } from "vitest";
import { siteContentInputSchema, siteContentUpdateSchema } from "../../src/features/content/site-content-schema";

describe("site content validation", () => {
  it("accepts a concise announcement with an internal action", () => {
    expect(siteContentInputSchema.parse({ placement: "announcement", eyebrow: "", title: "A factual service announcement.", body: "", actionLabel: "View systems", actionHref: "/systems", sortOrder: "0" })).toMatchObject({ eyebrow: null, body: null, actionHref: "/systems", sortOrder: 0 });
  });

  it("requires editorial context for homepage features", () => {
    expect(siteContentInputSchema.safeParse({ placement: "homepage_feature", eyebrow: "", title: "Approved homepage feature", body: "", actionLabel: "", actionHref: "", sortOrder: 1 }).success).toBe(false);
  });

  it("rejects external or protocol-relative action URLs", () => {
    for (const actionHref of ["https://example.com", "//example.com", "/systems`njavascript:alert(1)"]) {
      expect(siteContentInputSchema.safeParse({ placement: "announcement", eyebrow: "", title: "A factual service announcement.", body: "", actionLabel: "Open", actionHref, sortOrder: 0 }).success).toBe(false);
    }
  });

  it("requires a meaningful label when an action path is supplied", () => {
    expect(siteContentInputSchema.safeParse({ placement: "announcement", eyebrow: "", title: "A factual service announcement.", body: "", actionLabel: "A", actionHref: "/about", sortOrder: 0 }).success).toBe(false);
  });

  it("validates lifecycle intent and concurrency timestamp", () => {
    const result = siteContentUpdateSchema.safeParse({ placement: "homepage_feature", eyebrow: "Current focus", title: "Approved homepage feature", body: "Supporting information for this approved feature.", actionLabel: "Learn more", actionHref: "/about", sortOrder: "2", intent: "publish", updatedAt: "2026-07-25T00:00:00.000Z" });
    expect(result.success).toBe(true);
  });
});
