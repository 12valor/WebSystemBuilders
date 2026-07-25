import { describe, expect, it } from "vitest";
import { testimonialInputSchema, testimonialUpdateInputSchema } from "../../src/features/content/testimonial-schema";

const valid = { quote: "This is a real customer statement retained with permission.", attributionName: "Verified customer", attributionRole: "Owner", attributionOrganization: "Customer organization", relationshipContext: "Purchased system customer", verificationReference: "Private approval record reference", permissionConfirmed: true, isFeatured: true, sortOrder: "1" };

describe("testimonial validation", () => {
  it("normalizes optional attribution fields and order", () => { expect(testimonialInputSchema.parse({ ...valid, attributionRole: "", attributionOrganization: "" })).toMatchObject({ attributionRole: null, attributionOrganization: null, sortOrder: 1 }); });
  it("requires a meaningful private verification reference", () => { expect(testimonialInputSchema.safeParse({ ...valid, verificationReference: "no" }).success).toBe(false); });
  it("blocks publication without confirmed permission", () => { expect(testimonialUpdateInputSchema.safeParse({ ...valid, permissionConfirmed: false, intent: "publish", updatedAt: "2026-07-25T00:00:00.000Z" }).success).toBe(false); });
});
