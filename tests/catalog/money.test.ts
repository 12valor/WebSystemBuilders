import { describe, expect, it } from "vitest";
import { parseMoneyToMinorUnits } from "../../src/features/catalog/money";

describe("catalog money parsing", () => {
  it("converts decimal PHP input to integer centavos", () => {
    expect(parseMoneyToMinorUnits("12500")).toBe(1_250_000);
    expect(parseMoneyToMinorUnits("12500.5")).toBe(1_250_050);
    expect(parseMoneyToMinorUnits("12500.50")).toBe(1_250_050);
  });

  it("rejects malformed, negative, and over-precision values", () => {
    expect(parseMoneyToMinorUnits("12.345")).toBeNull();
    expect(parseMoneyToMinorUnits("-1")).toBeNull();
    expect(parseMoneyToMinorUnits("1,000")).toBeNull();
    expect(parseMoneyToMinorUnits("")).toBeNull();
  });
});
