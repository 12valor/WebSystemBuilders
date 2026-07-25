import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repository = readFileSync(
  resolve("src/features/content/testimonial-repository.ts"),
  "utf8",
);

describe("testimonial public-data boundary", () => {
  it("keeps private verification fields out of the shared public column list", () => {
    const columns = repository.match(/const columns = "([^"]+)";/)?.[1] ?? "";
    expect(columns).not.toContain("source_reference");
    expect(columns).not.toContain("permission_confirmed_at");
  });

  it("queries verification evidence only in the administrator loader", () => {
    const publicLoader = repository.slice(repository.indexOf("export async function getPublicTestimonials"));
    expect(publicLoader).not.toContain('from("testimonial_verifications")');
  });
});
