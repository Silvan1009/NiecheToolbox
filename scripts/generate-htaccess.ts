import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { securityHeaders, type CspMode } from "../src/lib/securityHeaders";

/**
 * Erzeugt public/.htaccess für Apache (IONOS-Shared-Webhosting).
 *
 * Bei `output: "export"` gibt es keinen Server mehr, der `headers()` aus
 * next.config.ts zur Antwortzeit anwenden könnte – die gleiche Logik aus
 * securityHeaders() läuft deshalb hier einmalig beim Build und landet als
 * `Header set`-Direktiven in .htaccess. Dazu ein mod_rewrite-Fallback: Next
 * exportiert `seite.html` statt `seite/`, Apache muss `/tools/foo` also auf
 * `/tools/foo.html` umbiegen.
 */

loadEnvConfig(process.cwd());

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

// Diese Datei wird ausschließlich für den Produktions-Export erzeugt (siehe
// npm run build) – anders als next.config.ts vorher lesen wir hier kein
// NODE_ENV, weil der Prebuild-Schritt vor next builds eigenem
// NODE_ENV=production läuft.
const isProduction = true;
const cspMode = (process.env.CSP_MODE ?? "report-only") as CspMode;

const headers = securityHeaders({
  cspMode,
  isProduction,
  analyticsOrigin: analyticsOrigin(),
});

const headerLines = headers
  .map(({ key, value }) => `  Header always set "${key}" "${value.replace(/"/g, '\\"')}"`)
  .join("\n");

const htaccess = `# Automatisch erzeugt von scripts/generate-htaccess.ts – nicht von Hand pflegen.

<IfModule mod_headers.c>
${headerLines}
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}\\.html -f
  RewriteRule ^(.*)$ $1.html [L]
</IfModule>

ErrorDocument 404 /404.html
`;

writeFileSync(join(process.cwd(), "public", ".htaccess"), htaccess);
console.log("public/.htaccess geschrieben.");
