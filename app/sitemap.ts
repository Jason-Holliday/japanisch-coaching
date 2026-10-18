import type { MetadataRoute } from "next";
import { siteUrl } from "./site";

// Neue Unterseiten (z. B. Impressum, AGB) hier ergänzen.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/datenschutz", siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
