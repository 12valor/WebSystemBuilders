import type { MetadataRoute } from "next";
import { getPublicCatalogData } from "@/features/catalog/repository";

const siteUrl = "https://websystembuilders.com";

const publicRoutes = [
  "",
  "/systems",
  "/for-students",
  "/for-business",
  "/services/custom-development",
  "/process",
  "/about",
  "/portfolio",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getPublicCatalogData();
  const staticEntries: MetadataRoute.Sitemap = publicRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/systems" ? 0.9 : 0.7,
  }));

  if (catalog.status !== "ready") return staticEntries;

  return [
    ...staticEntries,
    ...catalog.systems.map((system) => ({
      url: `${siteUrl}/systems/${system.slug}`,
      lastModified: new Date(system.updatedAt),
      changeFrequency: "monthly" as const,
      priority: system.featured ? 0.8 : 0.7,
    })),
  ];
}
