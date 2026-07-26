import type { MetadataRoute } from "next";

export const revalidate = 86400;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/admin", "/api", "/auth", "/checkout", "/downloads", "/systems/preview"],
    },
    sitemap: "https://websystembuilders.com/sitemap.xml",
  };
}
