// Zentrale Basis-URL der Website für Metadaten, Sitemap und robots.txt.
// Die echte Domain wird beim Hosting als Umgebungsvariable gesetzt, z. B.
// NEXT_PUBLIC_SITE_URL=https://www.deine-domain.de
// Ohne Variable (lokale Entwicklung) wird localhost verwendet.
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

// Nur die Live-Seite soll in Suchmaschinen erscheinen. Vorschau-Deployments
// (z. B. Vercel Preview) und Builds ohne Domain werden gesperrt.
export const isIndexable =
  Boolean(process.env.NEXT_PUBLIC_SITE_URL) &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
