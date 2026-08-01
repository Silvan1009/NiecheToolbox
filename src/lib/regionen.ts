/**
 * Bundesländer und ihre gesetzlichen Feiertage.
 *
 * Alles rechnerisch, keine externe API: Ostern kommt aus der Gauß-Osterformel,
 * die beweglichen Feiertage hängen daran, die festen stehen in einer Tabelle
 * mit einer Bundesland-Matrix. Damit ist die Feiertagslogik über Jahre hinweg
 * wartungsfrei.
 *
 * Die Tabelle ist trotzdem nicht unbeaufsichtigt: `regionen.drift.test.ts`
 * gleicht sie gegen Nager.Date ab, damit eine Rechtsänderung auffällt. Der
 * Abruf lebt allein im Test – dieses Modul bleibt netzwerkfrei.
 *
 * Alle Datumsangaben sind reine Kalendertage als ISO-String "YYYY-MM-DD" und
 * werden intern als UTC-Mitternacht gerechnet – so gibt es keine Sommerzeit-
 * oder Zeitzonen-Verschiebungen.
 */

import {
  DAY_MS,
  fromIso,
  isWeekendMs,
  toIso,
  utcMs,
  weekdayOf,
  type Iso,
} from "./date";

export type RegionCode =
  | "bw"
  | "by"
  | "be"
  | "bb"
  | "hb"
  | "hh"
  | "he"
  | "mv"
  | "ni"
  | "nw"
  | "rp"
  | "sl"
  | "sn"
  | "st"
  | "sh"
  | "th";

export interface Region {
  code: RegionCode;
  name: string;
  /** URL-Segment für SEO-Varianten, z. B. "baden-wuerttemberg" */
  slug: string;
}

/** Alphabetisch – so erscheinen sie auch im Auswahlfeld. */
export const regions: readonly Region[] = [
  { code: "bw", name: "Baden-Württemberg", slug: "baden-wuerttemberg" },
  { code: "by", name: "Bayern", slug: "bayern" },
  { code: "be", name: "Berlin", slug: "berlin" },
  { code: "bb", name: "Brandenburg", slug: "brandenburg" },
  { code: "hb", name: "Bremen", slug: "bremen" },
  { code: "hh", name: "Hamburg", slug: "hamburg" },
  { code: "he", name: "Hessen", slug: "hessen" },
  { code: "mv", name: "Mecklenburg-Vorpommern", slug: "mecklenburg-vorpommern" },
  { code: "ni", name: "Niedersachsen", slug: "niedersachsen" },
  { code: "nw", name: "Nordrhein-Westfalen", slug: "nordrhein-westfalen" },
  { code: "rp", name: "Rheinland-Pfalz", slug: "rheinland-pfalz" },
  { code: "sl", name: "Saarland", slug: "saarland" },
  { code: "sn", name: "Sachsen", slug: "sachsen" },
  { code: "st", name: "Sachsen-Anhalt", slug: "sachsen-anhalt" },
  { code: "sh", name: "Schleswig-Holstein", slug: "schleswig-holstein" },
  { code: "th", name: "Thüringen", slug: "thueringen" },
] as const;

const regionByCode = new Map(regions.map((r) => [r.code, r]));
const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

export const getRegion = (code: string): Region | undefined =>
  regionByCode.get(code as RegionCode);

export const getRegionBySlug = (slug: string): Region | undefined =>
  regionBySlug.get(slug);

export const isRegionCode = (value: unknown): value is RegionCode =>
  typeof value === "string" && regionByCode.has(value as RegionCode);

/* ---------------------------------------------------------------------------
 * Ostern: Gauß-Osterformel
 * ------------------------------------------------------------------------- */

/**
 * Ostersonntag nach der Gauß-Osterformel (gregorianischer Kalender),
 * inklusive der beiden Ausnahmeregeln.
 */
export function easterSunday(year: number): Iso {
  const a = year % 19;
  const b = year % 4;
  const c = year % 7;
  const k = Math.floor(year / 100);
  const p = Math.floor((13 + 8 * k) / 25);
  const q = Math.floor(k / 4);
  const M = (15 - p + k - q) % 30;
  const N = (4 + k - q) % 7;
  const d = (19 * a + M) % 30;
  let e = (2 * b + 4 * c + 6 * d + N) % 7;

  // Ausnahme 1: d = 29, e = 6  ->  19. April statt 26. April
  // Ausnahme 2: d = 28, e = 6 und (11M + 11) mod 30 < 19 -> 18. statt 25. April
  if (d === 29 && e === 6) {
    e = -1;
  } else if (d === 28 && e === 6 && (11 * M + 11) % 30 < 19) {
    e = -1;
  }

  // Ostern = 22. März + d + e
  return toIso(utcMs(year, 3, 22) + (d + e) * DAY_MS);
}

/** Der letzte Mittwoch vor dem 23. November. */
export function bussUndBettag(year: number): Iso {
  let ms = utcMs(year, 11, 22);
  while (weekdayOf(ms) !== 3) ms -= DAY_MS;
  return toIso(ms);
}

/* ---------------------------------------------------------------------------
 * Feiertags-Definitionen + Bundesland-Matrix
 * ------------------------------------------------------------------------- */

const ALL: readonly RegionCode[] = regions.map((r) => r.code);

interface HolidayDef {
  name: string;
  /** Festes Datum */
  fixed?: { month: number; day: number };
  /** Tage relativ zum Ostersonntag */
  easterOffset?: number;
  /** Sonderberechnung */
  compute?: (year: number) => Iso;
  /** Bundesländer, in denen der Tag landesweit gesetzlicher Feiertag ist. */
  regions: readonly RegionCode[];
  /** Bundesländer, in denen er nur in Teilen des Landes gilt. */
  partialRegions?: readonly RegionCode[];
  /** Erst ab diesem Jahr gesetzlicher Feiertag (pro Bundesland). */
  since?: Partial<Record<RegionCode, number>>;
  /**
   * Letztes Jahr, in dem der Tag gilt (einschließlich, pro Bundesland).
   * Zusammen mit `since` im selben Jahr ergibt das einen einmaligen Feiertag.
   */
  until?: Partial<Record<RegionCode, number>>;
  note?: string;
}

const HOLIDAY_DEFS: readonly HolidayDef[] = [
  { name: "Neujahr", fixed: { month: 1, day: 1 }, regions: ALL },
  {
    name: "Heilige Drei Könige",
    fixed: { month: 1, day: 6 },
    regions: ["bw", "by", "st"],
  },
  {
    name: "Internationaler Frauentag",
    fixed: { month: 3, day: 8 },
    regions: ["be", "mv"],
    since: { be: 2019, mv: 2023 },
  },
  { name: "Karfreitag", easterOffset: -2, regions: ALL },
  {
    name: "Ostersonntag",
    easterOffset: 0,
    regions: ["bb"],
    note: "Gesetzlicher Feiertag nur in Brandenburg – fällt ohnehin auf einen Sonntag.",
  },
  { name: "Ostermontag", easterOffset: 1, regions: ALL },
  { name: "Tag der Arbeit", fixed: { month: 5, day: 1 }, regions: ALL },
  { name: "Christi Himmelfahrt", easterOffset: 39, regions: ALL },
  {
    name: "Pfingstsonntag",
    easterOffset: 49,
    regions: ["bb"],
    note: "Gesetzlicher Feiertag nur in Brandenburg – fällt ohnehin auf einen Sonntag.",
  },
  { name: "Pfingstmontag", easterOffset: 50, regions: ALL },
  {
    name: "Fronleichnam",
    easterOffset: 60,
    regions: ["bw", "by", "he", "nw", "rp", "sl"],
    partialRegions: ["sn", "th"],
    note: "In Sachsen und Thüringen nur in einzelnen Gemeinden.",
  },
  {
    // Einmalig: das Abgeordnetenhaus hat den 75. Jahrestag des Volksaufstands
    // zum gesetzlichen Feiertag erklärt – nur für 2028, nur für Berlin.
    // Fällt auf einen Samstag, bringt also keinen freien Tag.
    name: "75. Jahrestag des Volksaufstands vom 17. Juni 1953",
    fixed: { month: 6, day: 17 },
    regions: ["be"],
    since: { be: 2028 },
    until: { be: 2028 },
    note: "Einmaliger Feiertag in Berlin zum 75. Jahrestag des Volksaufstands von 1953.",
  },
  {
    name: "Mariä Himmelfahrt",
    fixed: { month: 8, day: 15 },
    regions: ["sl"],
    partialRegions: ["by"],
    note: "In Bayern nur in Gemeinden mit überwiegend katholischer Bevölkerung – das sind die meisten.",
  },
  {
    name: "Weltkindertag",
    fixed: { month: 9, day: 20 },
    regions: ["th"],
    since: { th: 2019 },
  },
  {
    name: "Tag der Deutschen Einheit",
    fixed: { month: 10, day: 3 },
    regions: ALL,
  },
  {
    name: "Reformationstag",
    fixed: { month: 10, day: 31 },
    regions: ["bb", "hb", "hh", "mv", "ni", "sn", "st", "sh", "th"],
    since: { hb: 2018, hh: 2018, ni: 2018, sh: 2018 },
  },
  {
    name: "Allerheiligen",
    fixed: { month: 11, day: 1 },
    regions: ["bw", "by", "nw", "rp", "sl"],
  },
  { name: "Buß- und Bettag", compute: bussUndBettag, regions: ["sn"] },
  { name: "1. Weihnachtstag", fixed: { month: 12, day: 25 }, regions: ALL },
  { name: "2. Weihnachtstag", fixed: { month: 12, day: 26 }, regions: ALL },
];

export interface Holiday {
  date: Iso;
  name: string;
  /** 0 = Sonntag … 6 = Samstag */
  weekday: number;
  /** Fällt auf Samstag oder Sonntag – bringt also keinen freien Tag. */
  onWeekend: boolean;
  /** Gilt im gewählten Bundesland nur in Teilen des Landes. */
  partial: boolean;
  note?: string;
}

function dateOf(def: HolidayDef, year: number): Iso {
  if (def.fixed) return toIso(utcMs(year, def.fixed.month, def.fixed.day));
  if (def.compute) return def.compute(year);
  if (def.easterOffset !== undefined) {
    return toIso(fromIso(easterSunday(year)) + def.easterOffset * DAY_MS);
  }
  throw new Error(`Feiertag "${def.name}" hat keine Datumsregel.`);
}

/**
 * Alle gesetzlichen Feiertage eines Jahres für ein Bundesland,
 * chronologisch sortiert.
 *
 * Teilweise geltende Feiertage (z. B. Mariä Himmelfahrt in Bayern) sind
 * enthalten und mit `partial: true` markiert. Ob sie mitzählen, entscheidet
 * der Aufrufer über `includePartial`.
 */
export function holidaysFor(
  year: number,
  region: RegionCode,
  options: { includePartial?: boolean } = {},
): Holiday[] {
  const includePartial = options.includePartial ?? false;

  const result: Holiday[] = [];

  for (const def of HOLIDAY_DEFS) {
    const statewide = def.regions.includes(region);
    const partialHere = def.partialRegions?.includes(region) ?? false;
    if (!statewide && !partialHere) continue;

    const since = def.since?.[region];
    if (since !== undefined && year < since) continue;

    const until = def.until?.[region];
    if (until !== undefined && year > until) continue;

    if (partialHere && !includePartial) {
      // Als Information behalten, aber nicht als freier Tag verrechnen.
      const date = dateOf(def, year);
      const ms = fromIso(date);
      result.push({
        date,
        name: def.name,
        weekday: weekdayOf(ms),
        onWeekend: isWeekendMs(ms),
        partial: true,
        note: def.note,
      });
      continue;
    }

    const date = dateOf(def, year);
    const ms = fromIso(date);
    result.push({
      date,
      name: def.name,
      weekday: weekdayOf(ms),
      onWeekend: isWeekendMs(ms),
      partial: partialHere,
      note: def.note,
    });
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/** Hat das Bundesland Feiertage, die nur regional gelten? */
export function partialHolidayNames(region: RegionCode): string[] {
  return HOLIDAY_DEFS.filter((def) => def.partialRegions?.includes(region)).map(
    (def) => def.name,
  );
}
