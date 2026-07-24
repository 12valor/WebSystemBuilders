export function getSafeNextPath(value: string | null | undefined, fallback = "/account") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;

  try {
    const candidate = new URL(value, "https://websystembuilders.local");
    if (candidate.origin !== "https://websystembuilders.local") return fallback;
    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return fallback;
  }
}
