import type { Metadata } from "next";
import localFont from "next/font/local";
import CookieBanner from "./components/CookieBanner";
import TabTitle from "./components/TabTitle";
import { isIndexable, siteUrl } from "./site";
import "./globals.css";

// Lokal eingebunden (DSGVO): Die Schriften werden von der eigenen Domain
// ausgeliefert, es gehen keine Anfragen an Google oder andere Dritte.
// Auf lateinische Zeichen reduziert; Quelldateien und Lizenzen (OFL) siehe app/fonts.
const inter = localFont({
  src: "./fonts/inter-latin-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const reggaeOne = localFont({
  src: "./fonts/reggae-one-latin.woff2",
  variable: "--font-reggae-one",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Japanisch-Coaching | Kenji Tanaka",
  description:
    "Japanisch lernen für Berufstätige: Sprich endlich 10+ Minuten frei Japanisch und baue tiefere Verbindungen zu Japan auf. Persönlich begleitet von Kenji Tanaka.",
  // Vorschau-Deployments und Builds ohne Domain nicht indexieren (siehe site.ts).
  robots: isIndexable ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${reggaeOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <TabTitle />
        <CookieBanner />
      </body>
    </html>
  );
}
