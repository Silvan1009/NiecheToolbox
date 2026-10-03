import { describe, expect, it } from "vitest";
import { buildHtaccess, COMPRESSIBLE_TYPES, escapeRegex } from "./htaccess";
import { securityHeaders } from "./securityHeaders";

const htaccess = buildHtaccess({
  headers: securityHeaders({ cspMode: "enforce" }),
  redirects: [
    { from: "/tools/brueckentage/bayern-2026/", to: "/tools/brueckentage/" },
  ],
});

/**
 * Direktiven, die zum Apache-Kern gehören und deshalb ohne <IfModule> stehen
 * dürfen. Alles andere braucht einen Wächter.
 */
const CORE_DIRECTIVES = new Set(["AddDefaultCharset", "ErrorDocument"]);

/** Direktiven der obersten Ebene – also außerhalb jedes <IfModule>-Blocks. */
function unguardedDirectives(text: string): string[] {
  const found: string[] = [];
  let depth = 0;
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line === "" || line.startsWith("#")) continue;
    if (line.startsWith("</IfModule")) {
      depth -= 1;
      continue;
    }
    if (line.startsWith("<IfModule")) {
      depth += 1;
      continue;
    }
    if (depth === 0) found.push(line.split(/\s+/)[0]);
  }
  return found;
}

describe("buildHtaccess", () => {
  // Der wichtigste Test dieser Datei. Eine Direktive, deren Modul auf dem
  // Hosting fehlt, beantwortet Apache auf jeder Anfrage mit 500.
  it("lässt außerhalb von <IfModule> nur Kern-Direktiven zu", () => {
    const unguarded = unguardedDirectives(htaccess);
    expect(unguarded.length).toBeGreaterThan(0);
    for (const directive of unguarded) {
      expect(
        CORE_DIRECTIVES.has(directive),
        `${directive} steht ohne <IfModule> in der .htaccess`,
      ).toBe(true);
    }
  });

  it("schließt jeden <IfModule>-Block wieder", () => {
    const opened = htaccess.match(/<IfModule /g)?.length ?? 0;
    const closed = htaccess.match(/<\/IfModule>/g)?.length ?? 0;
    expect(opened).toBeGreaterThan(0);
    expect(closed).toBe(opened);
  });

  it("verwendet keine Direktiven der AllowOverride-Klasse Indexes oder Options", () => {
    const directives = htaccess
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"))
      .map((line) => line.split(/\s+/)[0]);
    for (const forbidden of [
      "Options",
      "DirectorySlash",
      "DirectoryIndex",
      "IndexOptions",
    ]) {
      expect(directives).not.toContain(forbidden);
    }
  });

  describe("Kompression", () => {
    // Regressionstest: Der Server packte von sich aus nur text/html.
    it.each(["text/javascript", "text/css", "application/json"])(
      "komprimiert %s",
      (type) => {
        expect(COMPRESSIBLE_TYPES).toContain(type);
        expect(htaccess).toMatch(
          new RegExp(`AddOutputFilterByType DEFLATE [^\\n]*${type}`),
        );
      },
    );

    // Neben DEFLATE kommt Brotli in Apache nie zum Zug – siehe lib/htaccess.ts.
    it("verspricht kein Brotli, das nie greift", () => {
      expect(htaccess).not.toContain("BROTLI_COMPRESS");
    });

    it("packt nichts, was schon komprimiert ist", () => {
      for (const type of ["image/png", "font/woff2", "image/x-icon"]) {
        expect(COMPRESSIBLE_TYPES).not.toContain(type);
      }
    });

    // AddOutputFilterByType gehört in Apache 2.4 zu mod_filter, nicht zu
    // mod_deflate. Ohne diesen äußeren Wächter: 500.
    it("hängt den Filter an mod_filter", () => {
      const block = htaccess.slice(
        htaccess.indexOf("<IfModule mod_filter.c>"),
        htaccess.indexOf("# --- Caching"),
      );
      expect(block).toContain("<IfModule mod_deflate.c>");
      expect(block).toContain("AddOutputFilterByType DEFLATE");
    });
  });

  describe("Caching", () => {
    it("lässt gehashte Dateien ein Jahr im Cache", () => {
      expect(htaccess).toContain(
        'Header set Cache-Control "public, max-age=31536000, immutable" env=RK_IMMUTABLE',
      );
      expect(htaccess).toContain(
        'SetEnvIf Request_URI "^/_next/static/" RK_IMMUTABLE',
      );
    });

    // Gecachtes HTML zeigte nach einem Deploy auf Dateien, die es nicht mehr gibt.
    it("lässt Seiten immer nachfragen", () => {
      expect(htaccess).toContain(
        'Header set Cache-Control "public, max-age=0, must-revalidate" env=RK_DOCUMENT',
      );
    });

    it("hält die RSC-Payloads aus dem Suchindex, robots.txt und ads.txt nicht", () => {
      expect(htaccess).toContain(
        'Header set X-Robots-Tag "noindex" env=RK_NOINDEX',
      );
      expect(htaccess).toContain(
        'SetEnvIf Request_URI "^/(robots|ads)\\.txt$" !RK_NOINDEX',
      );
    });
  });

  it("setzt die Sicherheits-Header auch auf Fehlerantworten", () => {
    expect(htaccess).toContain(
      'Header always set "X-Content-Type-Options" "nosniff"',
    );
    expect(htaccess).toContain('Header always set "Content-Security-Policy"');
  });

  it("liefert Text als UTF-8 aus", () => {
    expect(htaccess).toContain("AddDefaultCharset UTF-8");
  });

  it("gibt dem Web-App-Manifest seinen Medientyp", () => {
    expect(htaccess).toContain(
      "AddType application/manifest+json .webmanifest",
    );
  });

  it("leitet eingeschmolzene Seiten verankert weiter", () => {
    expect(htaccess).toContain(
      'RedirectMatch 301 "^/tools/brueckentage/bayern-2026/$" "/tools/brueckentage/"',
    );
    expect(htaccess).toContain("ErrorDocument 404 /404.html");
  });
});

describe("escapeRegex", () => {
  it("entschärft Regex-Sonderzeichen in Pfaden", () => {
    expect(escapeRegex("/a.b/c+d/")).toBe("/a\\.b/c\\+d/");
  });
});
