import { describe, expect, it } from "vitest";
import {
  faqInputSchema,
  faqUpdateInputSchema,
} from "../../src/features/content/faq-schema";

const validFaq = {
  question: "How is delivery verified?",
  answer: "Delivery begins only after verified server-side payment confirmation.",
  category: "Delivery",
  sortOrder: "4",
};

describe("FAQ content validation", () => {
  it("normalizes a complete FAQ entry", () => {
    expect(faqInputSchema.parse(validFaq)).toEqual({
      ...validFaq,
      sortOrder: 4,
    });
  });

  it("rejects incomplete or oversized public content", () => {
    const result = faqInputSchema.safeParse({
      question: "Why?",
      answer: "Too short",
      category: "G",
      sortOrder: 10_001,
    });

    expect(result.success).toBe(false);
  });

  it("requires a supported lifecycle intent and concurrency timestamp", () => {
    expect(faqUpdateInputSchema.safeParse({
      ...validFaq,
      intent: "publish",
      updatedAt: "2026-07-25T00:00:00.000Z",
    }).success).toBe(true);
    expect(faqUpdateInputSchema.safeParse({
      ...validFaq,
      intent: "delete",
      updatedAt: "not-a-date",
    }).success).toBe(false);
  });
});
