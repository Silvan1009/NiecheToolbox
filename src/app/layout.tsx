import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Inter } from "next/font/google";
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

// IBM Plex Mono ist keine Variable-Font: jede Stärke ist eine eigene Datei.
// Deshalb nur die zwei, die wirklich vorkommen – und ohne Preload: Mono trägt
// nur Zahlen, die dank `swap` sofort in der Fallback-Schrift stehen. So bleibt
// der kritische Pfad auf Inter und Bricolage beschränkt.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: site.name,
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  // Seitenverifizierung für AdSense. Cookielos und ohne Einwilligung nötig –
  // der übliche Weg über ein ungegatetes Werbe-Skript würde einem Prüfer, der
  // ablehnt, gar nichts zeigen.
  ...(ads.clientId
    ? { other: { "google-adsense-account": ads.clientId } }
    : {}),
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
      className={`${inter.variable} ${bricolage.variable} ${plexMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        {/* Muss vor jedem Google-Tag laufen – daher ganz nach vorn. */}
        <AdsBootstrap />
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lift"
        >
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
