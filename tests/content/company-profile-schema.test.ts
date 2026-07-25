import { describe, expect, it } from "vitest";
import { companyProfileInputSchema } from "../../src/features/content/company-profile-schema";

const valid = {
  companySummary: "WebSystemBuilders provides approved software-system services for its documented audiences.",
  founderBio: "AG Evangelista is the founder and web developer behind the approved WebSystemBuilders identity.",
  publicEmail: " CONTACT@WebSystemBuilders.com ",
  publicPhone: "+63 912 345 6789",
  intent: "publish",
  updatedAt: "2026-07-25T00:00:00.000Z",
};

describe("company profile validation", () => {
  it("normalizes approved optional public contacts", () => {
    expect(companyProfileInputSchema.parse(valid)).toMatchObject({ publicEmail: "contact@websystembuilders.com", publicPhone: "+63 912 345 6789" });
  });

  it("allows contact channels to remain unpublished", () => {
    expect(companyProfileInputSchema.parse({ ...valid, publicEmail: "", publicPhone: "" })).toMatchObject({ publicEmail: null, publicPhone: null });
  });

  it("rejects invalid contact details and destructive intents", () => {
    expect(companyProfileInputSchema.safeParse({ ...valid, publicEmail: "not-an-email" }).success).toBe(false);
    expect(companyProfileInputSchema.safeParse({ ...valid, publicPhone: "call-me" }).success).toBe(false);
    expect(companyProfileInputSchema.safeParse({ ...valid, intent: "delete" }).success).toBe(false);
  });
});