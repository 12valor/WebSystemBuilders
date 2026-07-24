export function parseMoneyToMinorUnits(value: string): number | null {
  const normalized = value.trim();
  if (!normalized) return null;
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;

  const [whole, fraction = ""] = normalized.split(".");
  const minorText = whole + fraction.padEnd(2, "0");
  const minor = Number(minorText);

  if (!Number.isSafeInteger(minor) || minor < 0) return null;
  return minor;
}
