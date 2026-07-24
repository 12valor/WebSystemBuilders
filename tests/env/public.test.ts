import { describe, expect, it } from "vitest";
import { parsePublicSupabaseEnv } from "../../src/lib/env/public";

describe("public Supabase environment", () => {
  it("accepts a valid project URL and publishable key", () => {
    expect(
      parsePublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://example-project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example_key_1234567890",
      }),
    ).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "https://example-project.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example_key_1234567890",
    });
  });

  it("rejects missing or insecure configuration", () => {
    expect(() =>
      parsePublicSupabaseEnv({
        NEXT_PUBLIC_SUPABASE_URL: "http://localhost",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "short",
      }),
    ).toThrow("Invalid public Supabase configuration");
  });
});
