import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { gzipSync } from "node:zlib";
import { DESCRIPTION_MAX, DESCRIPTION_MIN, TITLE_MAX } from "../src/lib/seo";

/**
 * Prüft den fertigen Export Seite für Seite – das, was Suchmaschine und
 * Besucher tatsächlich bekommen, nicht das, was der Quelltext verspricht.
 *
 * Läuft nach jedem Build und bricht ihn bei einem Verstoß ab. Jede Regel hier
 * stammt aus einem Befund, der vorher unbemerkt live war:
 *
 *   · 50 von 67 Titeln über 60 Zeichen, 24 Beschreibungen zu kurz
 *   · acht Seiten mit dem Canonical und der Vorschau der Startseite
 *   · neun Seiten ohne Vorschaubild
 *   · Überschriften, die von <h1> direkt auf <h3> springen
 *   · der Code aller 29 Rechner im Bundle jeder Rechnerseite
 *   · `lastmod` in der Sitemap, das bei jedem Deploy auf „heute“ sprang
 *
 * seo.test.ts prüft dieselben Grenzen schon an den Manifesten – schneller,
 * aber nur für das, was aus einem Manifest kommt. Dieses Skript sieht auch
 * die Einzelseiten und alles, was erst beim Rendern entsteht.
 */

const OUT_DIR = join(process.cwd(), "out");
const SITE_URL = (process.env.SITE_URL ?? "https://rechnerkiste.app").replace(
  /\/+$/,
  "",
);

/**
 * Obergrenze für das JavaScript, das eine Seite über <script>-Tags lädt,
 * gzip-komprimiert. Der Sockel aus React und dem Next-Router liegt bei rund
 * 165 KiB; die Grenze lässt Luft für den Rechner der Seite, aber nicht für
 * den Rückfall, alle Rechner auf einmal zu laden (das waren 310 KiB).
 */
const JS_BUDGET_KIB = 215;

/** Seiten, die es gibt, die aber keine Inhaltsseiten sind. */
const ERROR_PAGES = new Set(["/404.html", "/_not-found/"]);

interface Page {
  path: string;
  file: string;
  html: string;
  head: string;
  body: string;
}

function collect(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collect(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

const decode = (text: string) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function first(source: string, pattern: RegExp): string | null {
  const match = source.match(pattern);
  return match ? decode(match[1]) : null;
}

function all(source: string, pattern: RegExp): string[] {
  return [...source.matchAll(pattern)].map((match) => decode(match[1]));
}

if (!existsSync(OUT_DIR)) {
  console.error("seo-audit: out/ fehlt – erst `next build` laufen lassen.");
  process.exit(1);
}

const pages: Page[] = collect(OUT_DIR).map((file) => {
  const html = readFileSync(file, "utf8");
  const path =
    "/" +
    relative(OUT_DIR, file)
      .split(sep)
      .join("/")
      .replace(/index\.html$/, "");
  const headEnd = html.indexOf("</head>");
  return {
    path,
    file,
    html,
    head: html.slice(0, headEnd),
    body: html.slice(headEnd),
  };
});

const failures: string[] = [];
const fail = (path: string, message: string) =>
  failures.push(`${path}  ${message}`);

const gzipSizes = new Map<string, number>();
function gzipSize(src: string): number {
  const cached = gzipSizes.get(src);
  if (cached !== undefined) return cached;
  const file = join(OUT_DIR, decodeURIComponent(src.split("?")[0]));
  const size = existsSync(file) ? gzipSync(readFileSync(file)).length : 0;
  gzipSizes.set(src, size);
  return size;
}

const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
const indexable: string[] = [];
let heaviest = { path: "", kib: 0 };

for (const page of pages) {
  const { path, head, body, html } = page;
  const isErrorPage = ERROR_PAGES.has(path);

  /* --- Grundgerüst -------------------------------------------------------- */
  if (!/<html[^>]*\blang="de"/.test(html)) fail(path, 'ohne lang="de"');

  const h1 = all(body, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
  if (h1.length !== 1) fail(path, `${h1.length} <h1> statt genau einer`);

  const levels = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      fail(path, `Überschrift springt von h${levels[i - 1]} auf h${levels[i]}`);
      break;
    }
  }

  for (const img of body.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\balt=/.test(img)) fail(path, `Bild ohne alt: ${img.slice(0, 80)}`);
  }

  /* --- JavaScript-Gewicht ------------------------------------------------- */
  const scripts = new Set(
    [...html.matchAll(/<script\b([^>]*)\bsrc="([^"]+)"/g)]
      .filter((m) => !/nomodule/i.test(m[1]))
      .map((m) => m[2])
      .filter((src) => src.startsWith("/")),
  );
  const kib = [...scripts].reduce((sum, src) => sum + gzipSize(src), 0) / 1024;
  if (kib > heaviest.kib) heaviest = { path, kib };
  if (kib > JS_BUDGET_KIB) {
    fail(
      path,
      `lädt ${kib.toFixed(0)} KiB JavaScript (gzip), Grenze ${JS_BUDGET_KIB} KiB`,
    );
  }

  /* --- Strukturierte Daten ------------------------------------------------ */
  const types: string[] = [];
  // Roh, ohne decode(): Der Inhalt ist JSON, kein HTML.
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => match[1]);
  for (const raw of blocks) {
    try {
      const data = JSON.parse(raw) as { "@graph"?: { "@type": string }[] };
      for (const node of data["@graph"] ?? []) types.push(node["@type"]);
    } catch {
      fail(path, "JSON-LD ist kein gültiges JSON");
    }
  }

  if (isErrorPage) continue;

  /* --- Titel und Beschreibung --------------------------------------------- */
  const title = first(head, /<title>([^<]*)<\/title>/);
  if (!title) fail(path, "ohne <title>");
  else {
    if (title.length > TITLE_MAX) {
      fail(
        path,
        `Titel mit ${title.length} Zeichen (max. ${TITLE_MAX}): ${title}`,
      );
    }
    titles.set(title, [...(titles.get(title) ?? []), path]);
  }

  const description = first(head, /<meta name="description" content="([^"]*)"/);
  if (!description) fail(path, "ohne Meta-Description");
  else {
    const length = description.length;
    if (length < DESCRIPTION_MIN || length > DESCRIPTION_MAX) {
      fail(
        path,
        `Beschreibung mit ${length} Zeichen (${DESCRIPTION_MIN}–${DESCRIPTION_MAX})`,
      );
    }
    descriptions.set(description, [
      ...(descriptions.get(description) ?? []),
      path,
    ]);
  }

  /* --- Canonical und Index ------------------------------------------------ */
  const canonicals = all(head, /<link rel="canonical" href="([^"]*)"/g);
  const expected = `${SITE_URL}${path}`;
  if (canonicals.length !== 1) {
    fail(path, `${canonicals.length} Canonical-Angaben statt genau einer`);
  } else if (canonicals[0] !== expected) {
    fail(path, `Canonical zeigt auf ${canonicals[0]}`);
  }

  const robots = first(head, /<meta name="robots" content="([^"]*)"/) ?? "";
  if (!robots.includes("noindex")) indexable.push(path);

  /* --- Open Graph ---------------------------------------------------------- */
  const og = (property: string) =>
    first(
      head,
      new RegExp(`<meta property="og:${property}" content="([^"]*)"`),
    );
  for (const property of [
    "title",
    "description",
    "site_name",
    "locale",
    "type",
  ]) {
    if (!og(property)) fail(path, `ohne og:${property}`);
  }
  if (og("url") !== expected) fail(path, `og:url zeigt auf ${og("url")}`);

  const image = og("image");
  if (!image) fail(path, "ohne og:image");
  else if (!image.startsWith(SITE_URL)) fail(path, `og:image extern: ${image}`);
  else if (!existsSync(join(OUT_DIR, image.slice(SITE_URL.length)))) {
    fail(path, `og:image fehlt im Export: ${image}`);
  }

  /* --- Strukturierte Daten: Pflichtknoten ---------------------------------- */
  if (!robots.includes("noindex")) {
    for (const required of ["Organization", "WebSite"]) {
      if (!types.includes(required)) fail(path, `JSON-LD ohne ${required}`);
    }
    const isCalculator = /^\/(tools|wege)\/[^/]+\//.test(path);
    if (isCalculator && !types.includes("WebApplication")) {
      fail(path, "Rechnerseite ohne WebApplication im JSON-LD");
    }
    if (isCalculator && !types.includes("BreadcrumbList")) {
      fail(path, "Rechnerseite ohne BreadcrumbList im JSON-LD");
    }
  }
}

for (const [title, paths] of titles) {
  if (paths.length > 1)
    fail(paths.join(", "), `teilen sich den Titel: ${title}`);
}
for (const [, paths] of descriptions) {
  if (paths.length > 1) fail(paths.join(", "), "teilen sich die Beschreibung");
}

/* --- Sitemap ---------------------------------------------------------------- */

const sitemapFile = join(OUT_DIR, "sitemap.xml");
let sitemapCount = 0;
let datedCount = 0;
if (!existsSync(sitemapFile)) {
  fail("/sitemap.xml", "fehlt im Export");
} else {
  const xml = readFileSync(sitemapFile, "utf8");
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => m[1]);
  const listed = new Set<string>();
  for (const entry of entries) {
    const loc = first(entry, /<loc>([^<]*)<\/loc>/) ?? "";
    const path = loc.slice(SITE_URL.length);
    listed.add(path);
    sitemapCount += 1;

    if (!loc.startsWith(SITE_URL))
      fail("/sitemap.xml", `fremde Adresse: ${loc}`);
    else if (!indexable.includes(path)) {
      fail("/sitemap.xml", `listet ${path}, die Seite fehlt oder ist noindex`);
    }

    const lastmod = first(entry, /<lastmod>([^<]*)<\/lastmod>/);
    if (lastmod) datedCount += 1;
    // Im CI steht die vollständige Git-Historie bereit – dort ist ein
    // fehlendes Datum ein Fehler in der Pipeline, kein Normalfall.
    else if (process.env.CI) fail("/sitemap.xml", `${path} ohne lastmod`);

    if (/<changefreq>|<priority>/.test(entry)) {
      fail("/sitemap.xml", `${path} trägt changefreq/priority`);
    }
  }
  for (const path of indexable) {
    if (!listed.has(path)) fail(path, "indexierbar, aber nicht in der Sitemap");
  }
}

/* --- Bericht ---------------------------------------------------------------- */

const exportBytes = collect(OUT_DIR).reduce(
  (sum, file) => sum + statSync(file).size,
  0,
);
console.log(`seo-audit: ${pages.length} Seiten geprüft`);
console.log(`  indexierbar:             ${indexable.length}`);
console.log(
  `  in der Sitemap:          ${sitemapCount} (${datedCount} mit lastmod)`,
);
console.log(
  `  schwerste Seite (JS):    ${heaviest.kib.toFixed(0)} KiB gzip  ${heaviest.path}  (Grenze ${JS_BUDGET_KIB})`,
);
console.log(
  `  HTML gesamt:             ${(exportBytes / 1024 / 1024).toFixed(1)} MiB`,
);

if (failures.length > 0) {
  console.error(`\nseo-audit: ${failures.length} Verstöße:\n`);
  for (const failure of failures) console.error(`  · ${failure}`);
  process.exit(1);
}
console.log("\n✓ Alle Seiten bestehen die SEO-Prüfung.");
