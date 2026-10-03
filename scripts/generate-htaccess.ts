import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { analyticsOrigins } from "../src/lib/analyticsOrigins";
import { buildHtaccess } from "../src/lib/htaccess";
import { retiredPaths } from "../src/lib/retiredPaths";
import { securityHeaders, type CspMode } from "../src/lib/securityHeaders";

/**
 * Erzeugt public/.htaccess für Apache (IONOS-Shared-Webhosting).
 *
 * Bei `output: "export"` gibt es keinen Server mehr, der `headers()` aus
 * next.config.ts zur Antwortzeit anwenden könnte – die Logik aus
 * securityHeaders() läuft deshalb hier einmalig beim Build und landet als
 * `Header set`-Direktiven in .htaccess. Kompression, Caching und die
 * Weiterleitungen eingeschmolzener Seiten kommen in lib/htaccess.ts dazu.
 */

loadEnvConfig(process.cwd());

// Diese Datei wird ausschließlich für den Produktions-Export erzeugt (siehe
// npm run build) – wir lesen hier kein NODE_ENV, weil der Prebuild-Schritt vor
// next builds eigenem NODE_ENV=production läuft.
const isProduction = true;
const cspMode = (process.env.CSP_MODE ?? "report-only") as CspMode;
const analytics = analyticsOrigins();

const htaccess = buildHtaccess({
  headers: securityHeaders({
    cspMode,
    isProduction,
    analyticsOrigin: analytics.script,
    analyticsConnectOrigins: analytics.connect,
  }),
  redirects: retiredPaths,
});

writeFileSync(join(process.cwd(), "public", ".htaccess"), htaccess);
console.log("public/.htaccess geschrieben.");
