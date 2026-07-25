import { describe, expect, it } from "vitest";
import {
  portfolioInputSchema,
  portfolioUpdateInputSchema,
} from "../../src/features/content/portfolio-schema";

const validPortfolio = {
  title: "Verified inventory implementation",
  slug: "verified-inventory-implementation",
  audience: "business",
  summary: "A factual overview of the approved inventory implementation.",
  description: "A complete description of the reviewed project scope and the work that was implemented.",
  outcome: "The approved project outcome is supported by retained evidence.",
  technologyStack: "Next.js, TypeScript, Next.js",
  projectUrl: "https://example.com/project",
  isFeatured: true,
  sortOrder: "2",
};

describe("portfolio content validation", () => {
  it("normalizes a complete portfolio record", () => {
    expect(portfolioInputSchema.parse(validPortfolio)).toMatchObject({
      slug: "verified-inventory-implementation",
      technologyStack: ["Next.js", "TypeScript"],
      projectUrl: "https://example.com/project",
      sortOrder: 2,
    });
  });

  it("allows omitted outcomes and approved links", () => {
    const result = portfolioInputSchema.parse({
      ...validPortfolio,
      outcome: "",
      projectUrl: "",
    });
    expect(result.outcome).toBeNull();
    expect(result.projectUrl).toBeNull();
  });

  it("rejects unsafe links and unsupported lifecycle intents", () => {
    expect(portfolioInputSchema.safeParse({
      ...validPortfolio,
      projectUrl: "http://example.com/project",
    }).success).toBe(false);
    expect(portfolioUpdateInputSchema.safeParse({
      ...validPortfolio,
      intent: "delete",
      updatedAt: "2026-07-25T00:00:00.000Z",
    }).success).toBe(false);
  });
});
