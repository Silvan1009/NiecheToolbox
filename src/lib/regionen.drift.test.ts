/**
 * Drift-Wächter für die hartcodierte Feiertagstabelle in `regionen.ts`.
 *
 * Die Tabelle ist bewusst kein API-Abruf: sie kennt zusätzlich die nur
 * regional geltenden Feiertage (Fronleichnam in Sachsen/Thüringen, Mariä
 * Himmelfahrt in Bayern), die keine der öffentlichen APIs abbildet. Sie ist
 * damit reicher als die Quelle – aber auch stiller, wenn sich Feiertagsrecht
 * ändert. Dieser Test gleicht sie deshalb gegen Nager.Date ab.
 *
 * Läuft NICHT im Build. `build` ist `next build`, `prebuild` sind die beiden
 * tsx-Skripte – Vitest ruft keines davon auf. Ein Ausfall von Nager.Date kann
 * ein Deployment also nicht kippen.
 *
 * Gezielt aufrufen: `npm run test:holidays`
 * Hermetisch überspringen: `SKIP_NETWORK_TESTS=1 npm test`
 */

import { beforeAll, describe, expect, it, type TestContext } from "vitest";
import { holidaysFor, regions, type RegionCode } from "./regionen";

const API = "https://date.nager.at/api/v3/PublicHolidays";
const TIMEOUT_MS = 5_000;

/**
 * Dasselbe Fenster, das die Site veröffentlicht: `VARIANT_YEARS = 3` ab dem
 * laufenden Jahr (brueckentage/manifest.ts). Abgeleitet statt hartcodiert,
 * damit es mitwandert. Frühere Jahre bleiben außen vor – die `since`-Regeln
 * prüft regionen.test.ts bereits offline, und Nagers Rückschau vor 2018 ist
 * nichts, woran diese Suite hängen sollte.
 */
const BASE_YEAR = new Date().getUTCFullYear();
const YEARS = [BASE_YEAR, BASE_YEAR + 1, BASE_YEAR + 2];

/** ISO-3166-2-Codes der 16 Länder, wie Nager sie in `counties` liefert. */
const COUNTY_OF = new Map<RegionCode, string>(
  regions.map((r) => [r.code, `DE-${r.code.toUpperCase()}`]),
);
const KNOWN_COUNTIES = new Set(COUNTY_OF.values());

interface NagerHoliday {
  date: string;
  localName: string;
  name: string;
  global: boolean;
  counties: string[] | null;
  types: string[];
}

/** Geladene Jahre; `null` = Abruf fehlgeschlagen, Tests überspringen. */
const fetched = new Map<number, NagerHoliday[] | null>();
const skipReason = new Map<number, string>();

async function load(year: number): Promise<void> {
  if (process.env.SKIP_NETWORK_TESTS) {
    fetched.set(year, null);
    skipReason.set(year, "SKIP_NETWORK_TESTS gesetzt");
    return;
  }

  let payload: unknown;
  try {
    const res = await fetch(`${API}/${year}/DE`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
    });
    // Nicht-2xx zählt als Nichterreichbarkeit: ein 5xx oder ein Rate-Limit
    // sagt nichts über unsere Tabelle aus.
    if (!res.ok) {
      fetched.set(year, null);
      skipReason.set(year, `HTTP ${res.status}`);
      return;
    }
    payload = await res.json();
  } catch (error) {
    fetched.set(year, null);
    skipReason.set(
      year,
      error instanceof Error ? error.message : String(error),
    );
    return;
  }

  // Ab hier hat die API geantwortet. Ein unbrauchbarer Body ist dann kein
  // Netzwerkproblem mehr, sondern selbst eine Vertragsänderung – die soll
  // auffallen, nicht übersprungen werden.
  if (!Array.isArray(payload) || payload.length === 0) {
    throw new Error(
      `Nager.Date lieferte für ${year} kein brauchbares Array: ${JSON.stringify(payload).slice(0, 200)}`,
    );
  }

  fetched.set(year, payload as NagerHoliday[]);
}

/** Überspringt den Test, wenn das Jahr nicht geladen werden konnte. */
function requireData(ctx: TestContext, year: number): NagerHoliday[] {
  const data = fetched.get(year);
  if (!data) {
    ctx.skip(`Nager.Date für ${year} nicht abrufbar: ${skipReason.get(year)}`);
  }
  return data as NagerHoliday[];
}

/**
 * Die Daten, die Nager für ein Bundesland als landesweit gültig ausweist.
 * `global` heißt bundesweit, sonst muss der Ländercode in `counties` stehen.
 */
function apiStatewideDates(
  data: NagerHoliday[],
  region: RegionCode,
): Set<string> {
  const county = COUNTY_OF.get(region)!;
  return new Set(
    data
      .filter((h) => h.types.includes("Public"))
      .filter((h) => h.global || (h.counties?.includes(county) ?? false))
      .map((h) => h.date),
  );
}

/** Unsere landesweiten Feiertage – alles ohne `partial`-Markierung. */
function localStatewideDates(year: number, region: RegionCode): Set<string> {
  return new Set(
    holidaysFor(year, region, { includePartial: true })
      .filter((h) => !h.partial)
      .map((h) => h.date),
  );
}

function describeDates(data: NagerHoliday[], dates: string[]): string {
  return dates
    .map((d) => `${d} (${data.find((h) => h.date === d)?.localName ?? "?"})`)
    .join(", ");
}

describe("Feiertagstabelle gegen Nager.Date", { timeout: 15_000 }, () => {
  beforeAll(async () => {
    // Ein Abruf pro Jahr, nicht pro Bundesland: die Antwort enthält alle
    // Länder in `counties`.
    await Promise.all(YEARS.map(load));
  });

  for (const year of YEARS) {
    describe(`${year}`, () => {
      it("liefert nur bekannte Ländercodes", (ctx) => {
        const data = requireData(ctx, year);
        const unknown = [
          ...new Set(data.flatMap((h) => h.counties ?? [])),
        ].filter((c) => !KNOWN_COUNTIES.has(c));

        // Ein unbekanntes DE-XY würde sonst stillschweigend weggefiltert und
        // die Mengenvergleiche unten wertlos machen.
        expect(
          unknown,
          `Nager kennt Ländercodes, die wir nicht abbilden`,
        ).toEqual([]);
      });

      for (const region of regions) {
        describe(region.name, () => {
          it("hat dieselben landesweiten Feiertage wie Nager.Date", (ctx) => {
            const data = requireData(ctx, year);
            const api = apiStatewideDates(data, region.code);
            const local = localStatewideDates(year, region.code);

            // Vergleich über das ISO-Datum, nicht über den Namen: Nager pflegt
            // `localName` frei, eine Umbenennung dort ist keine Drift.
            const missing = [...api].filter((d) => !local.has(d)).sort();
            const extra = [...local].filter((d) => !api.has(d)).sort();

            expect(
              missing,
              `Nager kennt für ${region.name} ${year} Feiertage, die unsere Tabelle nicht hat: ${describeDates(data, missing)}`,
            ).toEqual([]);
            expect(
              extra,
              `Unsere Tabelle führt für ${region.name} ${year} landesweite Feiertage, die Nager nicht kennt: ${extra.join(", ")}`,
            ).toEqual([]);
          });

          it("führt regional geltende Tage nicht als landesweit", (ctx) => {
            const data = requireData(ctx, year);
            const api = apiStatewideDates(data, region.code);

            const partial = holidaysFor(year, region.code, {
              includePartial: true,
            })
              .filter((h) => h.partial)
              .map((h) => h.date);

            // Sollte Nager Fronleichnam eines Tages landesweit für Sachsen
            // führen, ist das eine echte Rechtsänderung – und soll auffallen.
            const promoted = partial.filter((d) => api.has(d));
            expect(
              promoted,
              `Nager führt für ${region.name} ${year} landesweit, was bei uns nur regional gilt: ${describeDates(data, promoted)}`,
            ).toEqual([]);
          });
        });
      }
    });
  }
});
