import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("main landmark and skip navigation", () => {
  it("provides a global keyboard skip link", () => {
    const layout = readFileSync(resolve("src/app/layout.tsx"), "utf8");
    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain("Skip to main content");
  });

  it("gives critical application main elements a target id", () => {
    const files = [
      "src/app/account/page.tsx", "src/app/checkout/[slug]/page.tsx", "src/app/checkout/status/[orderNumber]/page.tsx",
      "src/app/downloads/[token]/page.tsx", "src/components/customer/customer-account.tsx", "src/components/admin/admin-shell.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(resolve(file), "utf8");
      expect(source, file).not.toMatch(/<main(?![^>]*\bid=)/);
    }
  });
});
