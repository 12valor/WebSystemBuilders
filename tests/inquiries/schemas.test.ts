import { describe, expect, it } from "vitest";
import { inquirySchema } from "@/features/inquiries/schemas";

const baseInput = {
  name: "Alex Rivera",
  email: "alex@example.com",
  audience: "business",
  organization: "Example Store",
  subject: "Inventory workflow review",
  message: "We need guidance on the right system path for our current workflow.",
  timeline: "For review next quarter",
  sourcePath: "/request-a-quote",
  consent: "on",
};

describe("inquiry schema", () => {
  it("accepts a detailed quotation request", () => {
    const result = inquirySchema.safeParse({
      ...baseInput,
      inquiryType: "quote",
      projectType: "custom-system",
      requirements: "Three roles need to receive stock, track movement, and review inventory reports.",
    });

    expect(result.success).toBe(true);
  });

  it("requires quotation requirements", () => {
    const result = inquirySchema.safeParse({
      ...baseInput,
      inquiryType: "quote",
      projectType: "custom-system",
      requirements: "Too short",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a general contact inquiry without project fields", () => {
    const result = inquirySchema.safeParse({
      ...baseInput,
      inquiryType: "contact",
      audience: "general",
      organization: "",
    });

    expect(result.success).toBe(true);
  });

  it("requires explicit information-use confirmation", () => {
    const result = inquirySchema.safeParse({
      ...baseInput,
      inquiryType: "contact",
      consent: "",
    });

    expect(result.success).toBe(false);
  });
});
