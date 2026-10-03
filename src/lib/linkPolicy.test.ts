import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Kein `<Link>` lädt sein Ziel vor.
 *
 * Next lädt für jeden Link im Sichtfeld die Zielroute vor – mehrere Dateien
 * je Link. Gemessen an der Rechnerseite: allein die vier Links im Seitenkopf
 * kosteten 112 KiB je Aufruf, ein Viertel des gesamten Seitengewichts, für
 * Seiten, die fast niemand als Nächstes öffnet. Wer hier ankommt, kommt aus
 * einer Suchmaschine auf genau einen Rechner.
 *
 * Mit `prefetch={false}` holt der Router die Zielseite erst beim Klick. Der
 * Seitenwechsel bleibt ein Übergang ohne Neuaufbau, er beginnt nur einen
 * Wimpernschlag später.
 */

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, files);
    else if (entry.name.endsWith(".tsx") && !entry.name.endsWith(".test.tsx")) {
      files.push(full);
    }
  }
  return files;
}

describe("Links", () => {
  const links = sourceFiles(SRC).flatMap((file) =>
    // `[^>]` schließt Zeilenumbrüche ein – das Tag darf über mehrere Zeilen gehen.
    [...readFileSync(file, "utf8").matchAll(/<Link\b[^>]*?>/g)].map(
      (match) => ({
        file: relative(SRC, file).split(sep).join("/"),
        tag: match[0].replace(/\s+/g, " "),
      }),
    ),
  );

  it("es gibt Links zu prüfen", () => {
    expect(links.length).toBeGreaterThan(20);
  });

  it("jeder <Link> schaltet das Vorladen ab", () => {
    for (const { file, tag } of links) {
      expect(
        tag.includes("prefetch={false}"),
        `${file}: ${tag.slice(0, 80)}`,
      ).toBe(true);
    }
  });
});
