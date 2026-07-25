import { describe, expect, it } from "vitest";
import { checkoutFormSchema } from "@/features/orders/checkout-schema";

const valid = {
  systemSlug: "inventory-system",
  customerName: "AG Evangelista",
  customerEmail: "OWNER@EXAMPLE.COM",
  termsAccepted: "on",
  licenseAccepted: "on",
  refundAccepted: "on",
  deliveryAccepted: "on",
};

describe("checkout form schema", () => {
  it("normalizes a complete acknowledged purchase", () => {
    const result = checkoutFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.customerEmail).toBe("owner@example.com");
  });

  it("blocks checkout when any policy acknowledgement is absent", () => {
    expect(checkoutFormSchema.safeParse({ ...valid, refundAccepted: "" }).success).toBe(false);
  });

  it("blocks malformed product slugs and buyer emails", () => {
    expect(checkoutFormSchema.safeParse({ ...valid, systemSlug: "../private", customerEmail: "invalid" }).success).toBe(false);
  });
});
