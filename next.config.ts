import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Das Stylesheet ist klein (~8 KB) und blockiert sonst das erste Rendern
    // mit einem eigenen Roundtrip. Inline gesetzt spart das auf jeder Seite
    // eine render-blockierende Anfrage.
    inlineCss: true,
  },
};

export default nextConfig;
