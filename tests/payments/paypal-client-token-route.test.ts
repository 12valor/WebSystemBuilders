import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getCurrentIdentity: vi.fn(),
  getCurrentUser: vi.fn(),
  getPayPalEnv: vi.fn(),
  createBrowserSafeClientToken: vi.fn(),
}));
vi.mock("@/lib/auth/current-user", () => ({ getCurrentIdentity: mocks.getCurrentIdentity, getCurrentUser: mocks.getCurrentUser }));
vi.mock("@/lib/env/paypal", () => ({ getPayPalEnv: mocks.getPayPalEnv }));
vi.mock("@/features/payments/paypal", () => ({
  PayPalProviderError: class PayPalProviderError extends Error {},
  createPayPalAdapter: () => ({ createBrowserSafeClientToken: mocks.createBrowserSafeClientToken }),
}));
import { POST } from "@/app/api/payments/paypal/client-token/route";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getCurrentIdentity.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81" });
  mocks.getCurrentUser.mockResolvedValue({ id: "eadfdb1e-2f32-4e26-b640-fca85acdfe81", email_confirmed_at: "2026-08-17" });
  mocks.getPayPalEnv.mockReturnValue({ SITE_URL: "https://websystembuilders.com" });
  mocks.createBrowserSafeClientToken.mockResolvedValue({ clientToken: "browser_safe_token_123456", expiresIn: 3600 });
});

describe("PayPal browser-token route", () => {
  it("requires a verified account", async () => {
    mocks.getCurrentIdentity.mockResolvedValue(null);
    expect((await POST(new Request("https://websystembuilders.com/api/payments/paypal/client-token", { method: "POST" }))).status).toBe(401);
  });
  it("returns only the short-lived browser-safe token with no-store headers", async () => {
    const response = await POST(new Request("https://websystembuilders.com/api/payments/paypal/client-token", { method: "POST" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    await expect(response.json()).resolves.toEqual({ clientToken: "browser_safe_token_123456", expiresIn: 3600 });
  });
});
