import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { ads, site } from "@/config/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AdsBootstrap } from "@/components/ads/AdsBootstrap";
import { AdsenseLoader } from "@/components/ads/AdsenseLoader";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Ohne `weight` liefert next/font die Variable-Font-Datei – eine statt drei.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// Für Mono kein Webfont: siehe `--font-mono` in globals.css. IBM Plex Mono war
// hier, ist aber keine Variable-Font und stellte allein 11 der 23 @font-face-
// Regeln – für eine Schrift, die nur Ziffern trägt.

/*
 * Nur, was für jede Seite gleich ist. Titel, Beschreibung, Canonical und
 * Open Graph setzt jede Seite selbst über pageMetadata() aus lib/seo.ts.
 *
 * Bewusst kein `alternates.canonical` und kein `openGraph.url` hier: Beides
 * vererbt sich auf jede Seite, die es nicht überschreibt. Genau so zeigten
 * acht Seiten mit ihrem Canonical und ihrer Vorschau auf die Startseite.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
  other: {
    // Seitenverifizierung für AdSense. Cookielos und ohne Einwilligung nötig –
    // der übliche Weg über ein ungegatetes Werbe-Skript würde einem Prüfer,
    // der ablehnt, gar nichts zeigen.
    ...(ads.clientId ? { "google-adsense-account": ads.clientId } : {}),
    // Verifizierung für Google Search Console (HTML-Tag-Methode).
    ...(site.googleSiteVerification
      ? { "google-site-verification": site.googleSiteVerification }
      : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#fbfbfe",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.lang}
      className={`${inter.variable} ${bricolage.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        {/* Muss vor jedem Google-Tag laufen – daher ganz nach vorn. */}
        <AdsBootstrap />
        <a href="#inhalt" className="skip-link">
          Zum Inhalt springen
        </a>
        <SiteHeader />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <AdsenseLoader />
        <Analytics />
      </body>
    </html>
  );
}
