import type { NextConfig } from "next";
import { securityHeaders, type CspMode } from "./src/lib/securityHeaders";

const isProduction = process.env.NODE_ENV === "production";
const cspMode = (process.env.CSP_MODE ?? "report-only") as CspMode;

/**
 * Origin der Reichweitenmessung, damit die CSP sie nicht ausschließt.
 * Aus der Skript-URL abgeleitet – eine kaputte URL soll den Build nicht kippen.
 */
function analyticsOrigin(): string | null {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none";
  if (provider === "none") return null;

  const url =
    provider === "umami"
      ? process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL
      : process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL;
  if (!url) return null;

  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const nextConfig: NextConfig = {
  experimental: {
    // Das Stylesheet ist klein (~8 KB) und blockiert sonst das erste Rendern
    // mit einem eigenen Roundtrip. Inline gesetzt spart das auf jeder Seite
    // eine render-blockierende Anfrage.
    inlineCss: true,
  },

  // Header wirken zur Antwortzeit und lassen Rendering-Modus und Route-Cache
  // unangetastet. Deshalb hier und nicht in proxy.ts: ein CSP-Nonce bräuchte
  // pro Anfrage einen frischen Wert, würde dynamisches Rendern erzwingen und
  // das revalidate = 86400 der Tool-Seiten aushebeln.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders({
          cspMode,
          isProduction,
          analyticsOrigin: analyticsOrigin(),
        }),
      },
    ];
  },
};

export default nextConfig;
