import type { HttpHeader } from "./securityHeaders";

/**
 * Baut die `.htaccess` für Apache (IONOS-Shared-Webhosting) als reinen Text.
 *
 * Ohne Abhängigkeit zu `next` oder zum `@/`-Alias: scripts/generate-htaccess.ts
 * lädt diese Datei direkt, und htaccess.test.ts prüft das Ergebnis.
 *
 * Die eine Regel, die hier über allem steht: **Eine Direktive, deren Modul
 * fehlt, beantwortet Apache mit 500 – auf jeder Anfrage.** Deshalb steht alles
 * außer den Kern-Direktiven in einem `<IfModule>`. Fehlt ein Modul, fehlt dann
 * nur die Optimierung, nicht die Seite. htaccess.test.ts setzt das durch.
 */

export interface HtaccessOptions {
  headers: HttpHeader[];
  redirects: readonly { from: string; to: string }[];
}

/**
 * Was komprimiert wird. Bilder und Schriften fehlen bewusst: PNG und WOFF2
 * sind bereits komprimiert, ein zweiter Durchlauf kostet nur Rechenzeit.
 *
 * `text/javascript` ist der Eintrag, um den es ging. Der Server komprimierte
 * von sich aus nur `text/html`; JavaScript und CSS gingen roh über die
 * Leitung – 1.079 KiB statt 310 KiB auf jeder Rechnerseite.
 */
export const COMPRESSIBLE_TYPES = [
  "text/html",
  "text/plain",
  "text/css",
  "text/javascript",
  "application/javascript",
  "application/json",
  "application/manifest+json",
  "application/xml",
  "text/xml",
  "image/svg+xml",
] as const;

/** Ein Jahr – der übliche Höchstwert für Dateien mit Inhalts-Hash im Namen. */
const ONE_YEAR = 31_536_000;
const ONE_DAY = 86_400;

/** Regex-Sonderzeichen in einem URL-Pfad entschärfen, bevor er in RedirectMatch landet. */
export function escapeRegex(path: string): string {
  return path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function indent(lines: string[], depth = 1): string {
  const pad = "  ".repeat(depth);
  return lines.map((line) => `${pad}${line}`).join("\n");
}

export function buildHtaccess({ headers, redirects }: HtaccessOptions): string {
  const securityLines = headers.map(
    ({ key, value }) =>
      `Header always set "${key}" "${value.replace(/"/g, '\\"')}"`,
  );

  /*
   * 301-Weiterleitungen für eingeschmolzene Variantenseiten (siehe
   * lib/retiredPaths.ts). `RedirectMatch` statt `Redirect`, damit ein exakter,
   * verankerter Pfad geprüft wird und kein Präfix zwei Einträge kollidieren
   * lässt.
   */
  const redirectLines = redirects.map(
    ({ from, to }) => `RedirectMatch 301 "^${escapeRegex(from)}$" "${to}"`,
  );

  const types = COMPRESSIBLE_TYPES.join(" ");

  return `# Automatisch erzeugt von scripts/generate-htaccess.ts – nicht von Hand pflegen.
#
# Alles außer den Kern-Direktiven steht in <IfModule>: Eine Direktive, deren
# Modul fehlt, beantwortet Apache auf *jeder* Anfrage mit 500.

# --- Zeichensatz -------------------------------------------------------------
# Ohne diese Zeile schickt Apache "Content-Type: text/html" ohne charset und
# überlässt dem Browser das Raten.
AddDefaultCharset UTF-8
<IfModule mod_mime.c>
  AddCharset UTF-8 .js .css .json .xml .txt .svg .webmanifest
  # Apache kennt die Endung nicht und schickte das Manifest ohne Content-Type.
  AddType application/manifest+json .webmanifest
</IfModule>

# --- Sicherheits-Header ------------------------------------------------------
<IfModule mod_headers.c>
${indent(securityLines)}
</IfModule>

# --- Kompression -------------------------------------------------------------
# gzip über mod_deflate. Der Filter prüft, ob die Antwort schon kodiert ist,
# und hält sich dann heraus – doppelt komprimiert wird nichts, auch nicht
# dort, wo der Server HTML bereits selbst packt (gegen httpd:2.4 geprüft).
#
# Bewusst kein Brotli daneben: Stehen beide Filter in der Kette, gewinnt in
# Apache immer DEFLATE, sobald der Browser gzip annimmt – und das tut jeder.
# Der Brotli-Block wäre eine Zeile, die nie etwas bewirkt.
<IfModule mod_filter.c>
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE ${types}
  </IfModule>
</IfModule>

# --- Caching -----------------------------------------------------------------
# /_next/static/: Jede Datei trägt den Hash ihres Inhalts im Namen. Ändert sich
#   der Inhalt, ändert sich der Name – der Browser darf sie ein Jahr behalten
#   und muss nie nachfragen.
# Seiten (Pfad endet auf "/"): immer nachfragen. Das HTML verweist auf die
#   gehashten Dateien; läge es nach einem Deploy noch im Cache, zeigte es auf
#   Dateien, die es nicht mehr gibt.
# OG-Bilder und Icons: ein Tag. Kein Hash im Namen, aber selten geändert.
<IfModule mod_setenvif.c>
  SetEnvIf Request_URI "^/_next/static/" RK_IMMUTABLE
  SetEnvIf Request_URI "/$" RK_DOCUMENT
  SetEnvIf Request_URI "^/(og/|favicon\\.ico$|icon|apple-icon|manifest\\.webmanifest$)" RK_DAILY
  # Die RSC-Payloads (index.txt, __next.*.txt) sind Bausteine für die
  # Navigation, keine Seiten – sie sollen nicht als Suchtreffer auftauchen.
  # robots.txt und ads.txt bleiben davon ausgenommen.
  SetEnvIf Request_URI "\\.txt$" RK_NOINDEX
  SetEnvIf Request_URI "^/(robots|ads)\\.txt$" !RK_NOINDEX
</IfModule>
<IfModule mod_headers.c>
  Header set Cache-Control "public, max-age=${ONE_YEAR}, immutable" env=RK_IMMUTABLE
  Header set Cache-Control "public, max-age=0, must-revalidate" env=RK_DOCUMENT
  Header set Cache-Control "public, max-age=${ONE_DAY}" env=RK_DAILY
  Header set X-Robots-Tag "noindex" env=RK_NOINDEX
</IfModule>

# --- Fehlerseite -------------------------------------------------------------
# Kein Rewrite auf ".html" und bewusst kein "DirectorySlash"/"Options":
#
# Seit \`trailingSlash: true\` (next.config.ts) exportiert Next jede Seite als
# "<pfad>/index.html". Apache findet die über DirectoryIndex von allein.
#
# "DirectorySlash Off" und "Options -Indexes" stehen hier absichtlich nicht:
# beide gehören zur AllowOverride-Klasse "Indexes", die Shared Hosting nicht
# garantiert. Ist sie nicht freigegeben, beantwortet Apache *jede* Anfrage mit
# 500 – ein Totalausfall, um eine Kleinigkeit abzusichern.
ErrorDocument 404 /404.html

# --- Weiterleitungen ---------------------------------------------------------
# Eingeschmolzene Variantenseiten (siehe src/lib/retiredPaths.ts) – dauerhafte
# Weiterleitung statt 404, für Besucher mit alten Links und für Google.
<IfModule mod_alias.c>
${indent(redirectLines)}
</IfModule>
`;
}
