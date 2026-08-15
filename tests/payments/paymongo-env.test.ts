import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { parsePaymentMethods } from "@/lib/env/paymongo";

describe("PayMongo payment method configuration", () => {
  it("accepts only an explicit supported subset", () => {
    expect(parsePaymentMethods("qrph, gcash")).toMatchObject({ success: true, data: ["qrph", "gcash"] });
    expect(parsePaymentMethods("card")).toMatchObject({ success: true, data: ["card"] });
  });

  it("rejects empty, unknown, and duplicate methods", () => {
    expect(parsePaymentMethods(undefined).success).toBe(false);
    expect(parsePaymentMethods("qrph,paymaya").success).toBe(false);
    expect(parsePaymentMethods("gcash,gcash").success).toBe(false);
  });
});
