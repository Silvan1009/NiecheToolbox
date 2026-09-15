import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  countWords,
  extractProse,
  jaccard,
  shinglesOf,
} from "../src/lib/contentAudit";

/**
 * Misst nach `next build`, wie viel eigener Text auf der Seite steht – und
 * wie viel davon sich wiederholt.
 *
 * ------------------------------------------------------------------------
 * Warum es dieses Skript gibt
 * ------------------------------------------------------------------------
 *
 * Die zweite AdSense-Prüfung endete mit "Minderwertige Inhalte". Der Grund
 * war nicht schlechte Schreibe, sondern Arithmetik: 174 der 211 Seiten sind
 * programmatisch erzeugte Varianten, und `buildVariants()` hängte an jede von
 * ihnen den Text der Elternseite an. Gemessen am fertigen Export standen
 * ~177.000 gerenderte Wörter auf nur ~50.000 verschiedenen Vier-Wort-Folgen –
 * gut zwei Drittel des Textes waren also anderswo auf derselben Seite schon
 * einmal zu lesen. Wer drei URLs aus der Sitemap zieht, landet mit hoher
 * Wahrscheinlichkeit zweimal auf demselben Text.
 *
 * Solche Zahlen lassen sich nicht schätzen. Deshalb misst dieses Skript sie,
 * statt sich auf den Eindruck beim Überfliegen zu verlassen.
 *
 * ------------------------------------------------------------------------
 * Was als "eigener Text" zählt
 * ------------------------------------------------------------------------
 *
 * Nur, was in einem `[data-prose]`-Abschnitt steht: der Erklärtext, die
 * `ContentSection`-Blöcke und die FAQ. Kopfzeile, Fußzeile, Brotkrumen,
 * Variantenliste, "Passt dazu" und die Beschriftungen des Rechners bleiben
 * draußen – die sind auf jeder Seite gleich und würden jede Messung
 * beschönigen. Die Markierung setzen ToolPageShell.tsx, WegPageShell.tsx,
 * Prose.tsx und Faq.tsx; Prose.test.tsx wacht darüber, dass sie nicht
 * stillschweigend verschwindet.
 *
 * ------------------------------------------------------------------------
 * Melden oder abbrechen
 * ------------------------------------------------------------------------
 *
 * Standardmäßig meldet das Skript nur. Erst `CONTENT_AUDIT=enforce` lässt es
 * den Build scheitern – dasselbe Muster wie `CSP_MODE` in
 * generate-htaccess.ts. Solange die Inhaltsarbeit läuft, wären harte Grenzen
 * ein Build, der wochenlang rot ist und deshalb ignoriert wird.
 */

const OUT_DIR = join(process.cwd(), "out");
const SITEMAP = join(OUT_DIR, "sitemap.xml");
const ENFORCE = process.env.CONTENT_AUDIT === "enforce";

/** Zielwerte vor der erneuten AdSense-Prüfung. */
const TARGETS = {
  /** Eigene Prosa je indexierter Seite. */
  minWords: 800,
  /**
   * Anteil der Vier-Wort-Folgen, die seitenweit nur ein einziges Mal
   * vorkommen.
   *
   * Gemessen wird ausschließlich innerhalb von `[data-prose]`, also ohne
   * Kopf-, Fußzeile und Rechnerbeschriftungen. Beim ersten Lauf waren es
   * 75,3 %. Das Ziel liegt bewusst darüber: Wenn der geteilte Elterntext aus
   * den Varianten verschwindet (Phase 3b), muss diese Zahl steigen – bleibt
   * sie stehen, ist die Entduplizierung nur verschoben worden.
   */
  minDistinctShingleRatio: 0.85,
  /** Überlappung zwischen zwei beliebigen Seiten. */
  maxPairOverlap: 0.4,
  /** IONOS Deploy Now bricht oberhalb davon ab. */
  maxExportMib: 47.7,
};

/* ---------------------------------------------------------------------------
 * Seiten einsammeln
 * ------------------------------------------------------------------------- */

/**
 * Die Sitemap ist die maßgebliche Liste. Was dort nicht steht, soll auch nicht
 * in die Bewertung: `/favoriten/` ist auf noindex gesetzt und die 404-Seite
 * ist keine Inhaltsseite.
 */
function indexedPaths(): string[] {
  if (!existsSync(SITEMAP)) {
    console.error(
      "content-audit: out/sitemap.xml fehlt – erst `next build` laufen lassen.",
    );
    process.exit(ENFORCE ? 1 : 0);
  }

  const xml = readFileSync(SITEMAP, "utf8");
  const paths: string[] = [];
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = match[1].replace(/^https?:\/\/[^/]+/, "");
    paths.push(path || "/");
  }
  return paths;
}

interface Page {
  path: string;
  words: number;
  shingles: Set<string>;
}

function collect(): Page[] {
  const pages: Page[] = [];

  for (const path of indexedPaths()) {
    const file = join(OUT_DIR, path, "index.html");
    if (!existsSync(file)) {
      console.warn(`content-audit: keine Datei zu ${path}`);
      continue;
    }
    const prose = extractProse(readFileSync(file, "utf8"));
    pages.push({
      path,
      words: countWords(prose),
      shingles: shinglesOf(prose),
    });
  }

  return pages;
}

function exportMib(): number {
  let bytes = 0;
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else bytes += statSync(full).size;
    }
  };
  walk(OUT_DIR);
  return bytes / 1024 / 1024;
}

/* ---------------------------------------------------------------------------
 * Bericht
 * ------------------------------------------------------------------------- */

const pages = collect();

if (pages.length === 0) {
  console.error("content-audit: keine Seiten gefunden.");
  process.exit(1);
}

const totalWords = pages.reduce((sum, page) => sum + page.words, 0);

// Wie oft kommt jede Wortfolge seitenweit vor? Alles über eins ist Text, den
// es woanders schon gibt.
const occurrences = new Map<string, number>();
for (const page of pages) {
  for (const shingle of page.shingles) {
    occurrences.set(shingle, (occurrences.get(shingle) ?? 0) + 1);
  }
}
let uniqueShingles = 0;
for (const count of occurrences.values()) if (count === 1) uniqueShingles += 1;
const distinctRatio = uniqueShingles / occurrences.size;

/**
 * Reine Verzeichnisseiten. Sie bestehen aus Karten und Links, und das ist
 * ihre Aufgabe – eine Wortgrenze dort einzufordern hieße, sie mit Text
 * aufzufüllen, den niemand liest. Die Startseite steht nicht in dieser Liste:
 * Sie ist die erste Seite, die ein Prüfer öffnet, und braucht eine echte
 * Einordnung (Phase 1).
 */
const LISTING_PAGES = new Set(["/rechner/", "/wege/"]);

/**
 * Rechtsseiten. Ein Impressum oder eine Datenschutzerklärung mit Text
 * aufzufüllen wäre kontraproduktiv – ihre Aufgabe ist die gesetzlich
 * vorgeschriebene Angabe, nicht redaktionelle Länge. Beide bleiben deshalb
 * von der Wortgrenze ausgenommen, unabhängig davon, wie kurz sie sind.
 */
const LEGAL_PAGES = new Set([
  "/rechtliches/impressum/",
  "/rechtliches/datenschutz/",
]);

const EXEMPT_FROM_MIN_WORDS = new Set([...LISTING_PAGES, ...LEGAL_PAGES]);

const tooShort = pages
  .filter(
    (page) =>
      !EXEMPT_FROM_MIN_WORDS.has(page.path) && page.words < TARGETS.minWords,
  )
  .sort((a, b) => a.words - b.words);

// Nur Seiten desselben Tools können sich stark überlappen – alles andere zu
// vergleichen kostet Zeit ohne Erkenntnis. Der Präfix bis zum vorletzten
// Segment ist die Tool-Seite.
const familyOf = (path: string) => path.split("/").slice(0, 3).join("/");
const families = new Map<string, Page[]>();
for (const page of pages) {
  const key = familyOf(page.path);
  families.set(key, [...(families.get(key) ?? []), page]);
}

const pairs: { a: string; b: string; overlap: number }[] = [];
for (const members of families.values()) {
  for (let i = 0; i < members.length; i += 1) {
    for (let j = i + 1; j < members.length; j += 1) {
      const overlap = jaccard(members[i].shingles, members[j].shingles);
      if (overlap > 0.1) {
        pairs.push({ a: members[i].path, b: members[j].path, overlap });
      }
    }
  }
}
pairs.sort((x, y) => y.overlap - x.overlap);

const worstOverlap = pairs[0]?.overlap ?? 0;
const size = exportMib();
const pct = (value: number) => `${(value * 100).toFixed(1)} %`;

console.log("\n── Inhaltsprüfung ──────────────────────────────────────────");
console.log(`Seiten in der Sitemap:        ${pages.length}`);
console.log(
  `Eigene Prosa gesamt:          ${totalWords.toLocaleString("de-DE")} Wörter ` +
    `(Ø ${Math.round(totalWords / pages.length)} je Seite)`,
);
console.log(
  `Einmalige Wortfolgen:         ${pct(distinctRatio)}  (Ziel ≥ ${pct(TARGETS.minDistinctShingleRatio)})`,
);
console.log(`Seiten unter ${TARGETS.minWords} Wörtern:     ${tooShort.length}`);
console.log(
  `Stärkste Überlappung:         ${pct(worstOverlap)}  (Ziel ≤ ${pct(TARGETS.maxPairOverlap)})`,
);
console.log(
  `Exportgröße:                  ${size.toFixed(1)} MiB  (Grenze ${TARGETS.maxExportMib} MiB)`,
);

if (tooShort.length > 0) {
  console.log("\nDie dünnsten Seiten:");
  for (const page of tooShort.slice(0, 12)) {
    console.log(`  ${String(page.words).padStart(5)} Wörter  ${page.path}`);
  }
  if (tooShort.length > 12) {
    console.log(`  … und ${tooShort.length - 12} weitere`);
  }
}

if (pairs.length > 0) {
  console.log("\nDie ähnlichsten Seitenpaare:");
  for (const pair of pairs.slice(0, 10)) {
    console.log(`  ${pct(pair.overlap).padStart(7)}  ${pair.a}  ↔  ${pair.b}`);
  }
}

/* ---------------------------------------------------------------------------
 * Urteil
 * ------------------------------------------------------------------------- */

const failures: string[] = [];
if (tooShort.length > 0) {
  failures.push(
    `${tooShort.length} Seiten unter ${TARGETS.minWords} Wörtern eigener Prosa`,
  );
}
if (distinctRatio < TARGETS.minDistinctShingleRatio) {
  failures.push(
    `nur ${pct(distinctRatio)} einmalige Wortfolgen (Ziel ≥ ${pct(TARGETS.minDistinctShingleRatio)})`,
  );
}
if (worstOverlap > TARGETS.maxPairOverlap) {
  failures.push(
    `Seitenpaare bis ${pct(worstOverlap)} Überlappung (Ziel ≤ ${pct(TARGETS.maxPairOverlap)})`,
  );
}
if (size > TARGETS.maxExportMib) {
  failures.push(
    `Export ${size.toFixed(1)} MiB über der Hosting-Grenze von ${TARGETS.maxExportMib} MiB`,
  );
}

console.log("");
if (failures.length === 0) {
  console.log("✓ Alle Zielwerte erreicht – bereit für die erneute Prüfung.");
} else {
  console.log("Noch offen:");
  for (const failure of failures) console.log(`  · ${failure}`);
  if (ENFORCE) {
    console.error(
      "\ncontent-audit: Zielwerte verfehlt (CONTENT_AUDIT=enforce).",
    );
    process.exit(1);
  }
  console.log(
    "\n(Nur Bericht. CONTENT_AUDIT=enforce lässt den Build daran scheitern.)",
  );
}
console.log("────────────────────────────────────────────────────────────\n");
