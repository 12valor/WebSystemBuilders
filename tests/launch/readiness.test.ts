import { describe, expect, it } from "vitest";
import { checkLaunchReadiness } from "../../scripts/check-launch-readiness.mjs";

const ready = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example_1234567890",
  SUPABASE_SERVICE_ROLE_KEY: "service_role_example_1234567890",
  PAYMONGO_SECRET_KEY: "sk_test_example_1234567890",
  PAYMONGO_WEBHOOK_SECRET: "whsec_example_1234567890",
  PAYMONGO_PAYMENT_METHODS: "qrph,gcash",
  INQUIRY_FINGERPRINT_SALT: "a".repeat(32),
  RESEND_API_KEY: "re_ABC123",
  RESEND_FROM_EMAIL: "delivery@mail.websystembuilders.com",
  SITE_URL: "https://websystembuilders.com",
};

describe("production launch environment", () => {
  it("accepts production-scoped provider configuration without inspecting secret values", () => {
    expect(checkLaunchReadiness(ready)).toEqual([]);
  });

  it("rejects invalid keys, foreign senders, non-canonical origins, and missing secrets", () => {
    const issues = checkLaunchReadiness({ ...ready, RESEND_FROM_EMAIL: "delivery@example.com", SITE_URL: "http://localhost:3000", SUPABASE_SERVICE_ROLE_KEY: "", PAYMONGO_SECRET_KEY: "sk_live_forbidden", PAYMONGO_PAYMENT_METHODS: "all" });
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["resend_sender", "canonical_site_url", "supabase_service_role", "paymongo_test_key", "paymongo_payment_methods"]));
  });
});
