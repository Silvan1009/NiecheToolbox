import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Wann eine Seite zuletzt geändert wurde – aus der Git-Historie, nicht aus dem
 * Build-Zeitpunkt.
 *
 * Vorher trug jeder Sitemap-Eintrag `new Date()`: Bei jedem Deploy
 * behaupteten alle 67 Seiten, heute geändert worden zu sein. Google wertet
 * `lastmod` nur aus, solange es sich als verlässlich erweist; ein Datum, das
 * bei jedem Build springt, ist das Gegenteil davon.
 *
 * scripts/generate-last-modified.ts schreibt die Daten vor dem Build nach
 * `.generated/last-modified.json`. Diese Datei liest sie zur Buildzeit –
 * bewusst über `fs` statt per Import, damit Typprüfung, Lint und Tests ohne
 * die erzeugte Datei auskommen. Fehlt sie oder fehlt ein Eintrag, gibt es kein
 * Datum: Die Seite zeigt dann keins, statt eines zu erfinden.
 *
 * Nur für Server-Code (Seiten, Sitemap). Client-Module dürfen sie nicht
 * importieren.
 */

export const LAST_MODIFIED_FILE = join(".generated", "last-modified.json");

/** Schlüssel einer Seite in der erzeugten Datei. */
export const lastModifiedKey = {
  tool: (slug: string) => `tools/${slug}`,
  weg: (slug: string) => `wege/${slug}`,
  page: (name: string) => `seite/${name}`,
};

let cache: Record<string, string> | null = null;

function load(): Record<string, string> {
  if (cache) return cache;
  const file = join(process.cwd(), LAST_MODIFIED_FILE);
  if (!existsSync(file)) {
    cache = {};
    return cache;
  }
  try {
    cache = JSON.parse(readFileSync(file, "utf8")) as Record<string, string>;
  } catch {
    cache = {};
  }
  return cache;
}

/** ISO-Datum (`2026-10-02`) der letzten Änderung, oder `undefined`. */
export function lastModified(key: string): string | undefined {
  const value = load()[key];
  return isIsoDate(value) ? value : undefined;
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

/**
 * `2026-10-02` → `2. Oktober 2026`. Von Hand statt über `Intl`, damit das
 * Ergebnis nicht von Zeitzone oder ICU-Daten der Build-Maschine abhängt.
 */
export function formatGermanDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day}. ${MONTHS[month - 1]} ${year}`;
}
