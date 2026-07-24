import { describe, expect, it } from "vitest";
import { signInLinkSchema } from "../../src/features/auth/schemas";

describe("secure sign-in input", () => {
  it("normalizes email and preserves a safe destination", () => {
    expect(
      signInLinkSchema.parse({
        email: "  Customer@Example.COM ",
        next: "/account?tab=downloads",
      }),
    ).toEqual({
      email: "customer@example.com",
      next: "/account?tab=downloads",
    });
  });

  it("rejects an invalid email and replaces an external destination", () => {
    expect(
      signInLinkSchema.safeParse({ email: "not-an-email", next: "https://example.com" })
        .success,
    ).toBe(false);

    expect(
      signInLinkSchema.parse({ email: "customer@example.com", next: "//example.com" }).next,
    ).toBe("/account");
  });
});
