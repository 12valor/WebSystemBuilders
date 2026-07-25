import { describe, expect, it } from "vitest";
import { createDeliveryToken, hashDeliveryToken } from "@/features/delivery/token";

describe("delivery tokens", () => {
  it("creates high-entropy opaque tokens and stores only deterministic hashes", () => {
    const first = createDeliveryToken();
    const second = createDeliveryToken();
    expect(first.token).not.toBe(second.token);
    expect(first.token.length).toBeGreaterThanOrEqual(40);
    expect(first.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(first.hash).toBe(hashDeliveryToken(first.token));
    expect(first.hash).not.toContain(first.token);
  });
});
