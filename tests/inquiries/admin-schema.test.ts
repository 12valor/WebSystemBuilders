import { describe, expect, it } from "vitest";
import { adminInquiryUpdateSchema } from "../../src/features/inquiries/admin-schema";

describe("admin inquiry validation", () => {
  it("accepts the supported status and assignment controls", () => {
    expect(adminInquiryUpdateSchema.parse({
      status: "in_review",
      assignment: "assign_to_me",
    })).toEqual({ status: "in_review", assignment: "assign_to_me" });

    expect(adminInquiryUpdateSchema.safeParse({
      status: "closed",
      assignment: "unassign",
    }).success).toBe(true);
  });

  it("rejects invented statuses and assignment targets", () => {
    expect(adminInquiryUpdateSchema.safeParse({
      status: "deleted",
      assignment: "another-user-id",
    }).success).toBe(false);
  });
});
