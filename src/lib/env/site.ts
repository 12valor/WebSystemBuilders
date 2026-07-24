import "server-only";
import { z } from "zod";

const siteUrlSchema = z.url().transform((value) => value.replace(/\/$/, ""));

export function parseSiteUrl(value: string) {
  const result = siteUrlSchema.safeParse(value);

  if (!result.success) {
    throw new Error("Invalid SITE_URL configuration: " + z.prettifyError(result.error));
  }

  return result.data;
}

export function getSiteUrl() {
  if (process.env.SITE_URL) {
    const siteUrl = parseSiteUrl(process.env.SITE_URL);
    if (process.env.NODE_ENV === "production" && !siteUrl.startsWith("https://")) {
      throw new Error("SITE_URL must use HTTPS in production.");
    }
    return siteUrl;
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelHost) return parseSiteUrl(`https://${vercelHost}`);

  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL is required for production authentication callbacks.");
  }

  return "http://localhost:3000";
}

export function isSiteUrlConfigured() {
  if (process.env.SITE_URL) {
    const result = siteUrlSchema.safeParse(process.env.SITE_URL);
    return (
      result.success &&
      (process.env.NODE_ENV !== "production" || result.data.startsWith("https://"))
    );
  }

  return Boolean(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      process.env.NODE_ENV !== "production",
  );
}
