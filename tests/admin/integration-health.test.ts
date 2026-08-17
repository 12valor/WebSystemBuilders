import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getIntegrationHealth } from "@/features/admin/integration-health";

const original = { ...process.env };

afterEach(() => {
  process.env = { ...original };
});

describe("administrator integration health", () => {
  it("reports the server-only PayPal environment without exposing credentials", () => {
    Object.assign(process.env, {
      PAYPAL_CLIENT_ID: "client_example_12345",
      PAYPAL_CLIENT_SECRET: "secret_example_12345",
      PAYPAL_ENVIRONMENT: "sandbox",
      PAYPAL_WEBHOOK_ID: "webhook_12345",
      SITE_URL: "http://localhost:3000",
    });

    const paypal = getIntegrationHealth().find((item) => item.id === "paypal");

    expect(paypal).toMatchObject({
      label: "PayPal Checkout",
      status: "configured",
      liveVerified: false,
    });
    expect(paypal?.detail).toContain("Sandbox");
    expect(paypal?.detail).not.toContain(process.env.PAYPAL_CLIENT_ID);
    expect(paypal?.detail).not.toContain(process.env.PAYPAL_CLIENT_SECRET);
  });

  it("fails closed when the PayPal server configuration is incomplete", () => {
    Object.assign(process.env, {
      PAYPAL_CLIENT_ID: "client_example_12345",
      PAYPAL_CLIENT_SECRET: "",
      PAYPAL_ENVIRONMENT: "sandbox",
      PAYPAL_WEBHOOK_ID: "webhook_12345",
      SITE_URL: "http://localhost:3000",
    });

    expect(getIntegrationHealth().find((item) => item.id === "paypal")?.status).toBe("not_configured");
  });
});
