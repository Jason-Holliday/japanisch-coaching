import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "./site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Formular-Endpunkt ist kein Inhalt für Suchmaschinen.
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
