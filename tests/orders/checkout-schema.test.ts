import { describe, expect, it } from "vitest";
import { checkoutFormSchema } from "@/features/orders/checkout-schema";

const valid = {
  systemId: "38fb3ccd-6d59-4898-89ee-c73aab7b8cda",
  referenceNumber: "123456789",
  proofStoragePath: "eadfdb1e-2f32-4e26-b640-fca85acdfe81/system/proof.png",
  termsAccepted: "on",
  licenseAccepted: "on",
  refundAccepted: "on",
  deliveryAccepted: "on",
};

describe("checkout form schema", () => {
  it("normalizes a complete acknowledged purchase", () => {
    const result = checkoutFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.referenceNumber).toBe("123456789");
  });

  it("blocks checkout when any policy acknowledgement is absent", () => {
    expect(checkoutFormSchema.safeParse({ ...valid, refundAccepted: "" }).success).toBe(false);
  });

  it("blocks malformed product IDs and missing private proof paths", () => {
    expect(checkoutFormSchema.safeParse({ ...valid, systemId: "../private", proofStoragePath: "" }).success).toBe(false);
  });
});
