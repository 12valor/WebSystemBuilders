import { describe, expect, it } from "vitest";
import { supportRequestSchema } from "@/features/customer/schema";

const valid = { orderId: "11111111-1111-4111-8111-111111111111", subject: "Installation error", message: "The installer stops after the database setup step." };

describe("customer support request schema", () => {
  it("accepts an order-linked detailed request", () => { expect(supportRequestSchema.safeParse(valid).success).toBe(true); });
  it("rejects missing order ownership keys and underspecified messages", () => {
    expect(supportRequestSchema.safeParse({ ...valid, orderId: "not-an-order", message: "Help" }).success).toBe(false);
  });
});
