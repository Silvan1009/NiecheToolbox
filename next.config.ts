import type { NextConfig } from "next";

/**
 * Statischer Export fürs IONOS-Shared-Webhosting: kein Node.js-Server, nur
 * Apache/FTP. Security-Header laufen deshalb nicht mehr hier (headers() wird
 * bei output: "export" nicht unterstützt), sondern als .htaccess-Direktiven,
 * erzeugt von scripts/generate-htaccess.ts.
 */
const nextConfig: NextConfig = {
  output: "export",

  experimental: {
    // Das Stylesheet ist klein (~8 KB) und blockiert sonst das erste Rendern
    // mit einem eigenen Roundtrip. Inline gesetzt spart das auf jeder Seite
    // eine render-blockierende Anfrage.
    inlineCss: true,
  },
};

export default nextConfig;
