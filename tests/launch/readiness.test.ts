import { describe, expect, it } from "vitest";
import { checkLaunchReadiness } from "../../scripts/check-launch-readiness.mjs";

const ready = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example_1234567890",
  SUPABASE_SERVICE_ROLE_KEY: "service_role_example_1234567890",
  INQUIRY_FINGERPRINT_SALT: "a".repeat(32),
  PAYMONGO_SECRET_KEY: "sk_live_ABC123",
  PAYMONGO_WEBHOOK_SECRET: "whsk_ABC123",
  RESEND_API_KEY: "re_ABC123",
  RESEND_FROM_EMAIL: "delivery@mail.websystembuilders.com",
  SITE_URL: "https://websystembuilders.com",
};

describe("production launch environment", () => {
  it("accepts production-scoped provider configuration without inspecting secret values", () => {
    expect(checkLaunchReadiness(ready)).toEqual([]);
  });

  it("rejects test payment keys, foreign senders, non-canonical origins, and missing secrets", () => {
    const issues = checkLaunchReadiness({ ...ready, PAYMONGO_SECRET_KEY: "sk_test_ABC123", RESEND_FROM_EMAIL: "delivery@example.com", SITE_URL: "http://localhost:3000", SUPABASE_SERVICE_ROLE_KEY: "" });
    expect(issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["paymongo_live_key", "resend_sender", "canonical_site_url", "supabase_service_role"]));
    expect(JSON.stringify(issues)).not.toContain("sk_test_ABC123");
  });
});
