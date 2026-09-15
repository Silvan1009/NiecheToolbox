import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Prüft nach dem Export, dass jeder interne Link auch wirklich irgendwo
 * hinführt.
 *
 * Entstanden aus der AdSense-Konsolidierung: 151 Variantenseiten wurden
 * entfernt (siehe src/lib/retiredPaths.ts) und durch Redirects ersetzt. Ein
 * vergessener Link auf eine der alten URLs wäre lokal unsichtbar – Next baut
 * ihn klaglos als `<a href>`, der Browser findet die Seite trotzdem nicht
 * mehr (Redirects laufen erst auf dem Apache-Server, nicht im Export). Dieses
 * Skript findet solche Links vor dem Deploy statt danach über die Google
 * Search Console.
 *
 * Geprüft wird jedes `href`-Attribut in jeder exportierten HTML-Datei:
 * externe Links (http(s)://, mailto:, tel:, ...) werden übersprungen, außer
 * sie zeigen auf die eigene Domain – dann zählen sie wie ein interner Link.
 * Für jedes verbleibende Ziel muss eine passende Datei in `out/` existieren.
 */

const OUT_DIR = join(process.cwd(), "out");
const SITE_URL = (process.env.SITE_URL ?? "https://rechnerkiste.app").replace(
  /\/+$/,
  "",
);

const HREF_PATTERN = /href=["']([^"']+)["']/g;

function collectHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectHtmlFiles(full));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

/** `href` auf einen internen Pfad normalisieren, oder `null` bei externem Ziel. */
function toInternalPath(href: string): string | null {
  if (href.startsWith("#")) return null;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  if (href.startsWith("//")) return null; // protokollrelativ, immer extern
  if (href.startsWith("data:") || href.startsWith("javascript:")) return null;

  let path = href;
  if (path.startsWith(SITE_URL)) {
    path = path.slice(SITE_URL.length) || "/";
  } else if (/^https?:\/\//.test(path)) {
    return null; // andere Domain
  }

  if (!path.startsWith("/")) return null; // relativer Pfad, hier nicht erwartet

  const withoutHash = path.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  return withoutQuery.length > 0 ? withoutQuery : "/";
}

/** Ob eine als Datei exportierte Version dieses Pfads existiert. */
function resolves(path: string): boolean {
  const decoded = decodeURIComponent(path);
  const hasExtension = /\.[a-zA-Z0-9]+$/.test(decoded);

  if (hasExtension) {
    return existsSync(join(OUT_DIR, decoded));
  }
  // trailingSlash: true exportiert jede Seite als "<pfad>/index.html" – auch
  // ein Link ohne abschließenden Schrägstrich muss also dorthin auflösen.
  return existsSync(join(OUT_DIR, decoded, "index.html"));
}

if (!existsSync(OUT_DIR)) {
  console.error("check-links: out/ fehlt – erst `next build` laufen lassen.");
  process.exit(1);
}

const failures: { file: string; href: string; target: string }[] = [];
const checked = new Map<string, boolean>();

for (const file of collectHtmlFiles(OUT_DIR)) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(HREF_PATTERN)) {
    const href = match[1];
    const target = toInternalPath(href);
    if (target === null) continue;

    let ok = checked.get(target);
    if (ok === undefined) {
      ok = resolves(target);
      checked.set(target, ok);
    }
    if (!ok) {
      failures.push({
        file: file.slice(OUT_DIR.length).replace(/\\/g, "/"),
        href,
        target,
      });
    }
  }
}

if (failures.length > 0) {
  console.error(
    `\ncheck-links: ${failures.length} toter interner Link(s) gefunden:\n`,
  );
  for (const { file, href, target } of failures.slice(0, 40)) {
    console.error(`  ${file}  →  ${href}  (aufgelöst: ${target})`);
  }
  if (failures.length > 40) {
    console.error(`  … und ${failures.length - 40} weitere`);
  }
  console.error("");
  process.exit(1);
}

console.log(
  `check-links: ${checked.size} eindeutige interne Ziele geprüft, alle erreichbar.`,
);
