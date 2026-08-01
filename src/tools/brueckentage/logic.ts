/**
 * Brückentage-Optimierer – reine Berechnung, keine React-/DOM-Abhängigkeiten.
 *
 * Bundesländer und Feiertagskalender kommen aus lib/regionen – hier lebt nur
 * der Optimierer selbst.
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
  type Iso,
} from "@/lib/date";
import {
  getRegion,
  holidaysFor,
  type Holiday,
  type Region,
  type RegionCode,
} from "@/lib/regionen";

// Für Tests und Aufrufer weiterhin über dieses Modul erreichbar.
export { DAY_MS, fromIso, toIso };
export type { Iso };

/* ---------------------------------------------------------------------------
 * Optimierer
 * ------------------------------------------------------------------------- */

export interface BridgeBlock {
  /** Die konkreten Urlaubstage, die eingesetzt werden. */
  vacationDays: Iso[];
  /** Erster und letzter Urlaubstag. */
  vacationStart: Iso;
  vacationEnd: Iso;
  /** Anfang und Ende der zusammenhängenden freien Zeit. */
  freeStart: Iso;
  freeEnd: Iso;
  /** Länge der freien Spanne in Tagen. */
  freeDays: number;
  /** freeDays / Anzahl Urlaubstage – der Hebel. */
  ratio: number;
  /** Die Feiertage, die diesen Block tragen. */
  holidays: { date: Iso; name: string }[];
}

/**
 * Ein Feiertags-Anlass mit seinen sinnvollen Varianten.
 *
 * `recommended` ist der Vorschlag mit dem besten Verhältnis (meist ein
 * einzelner Brückentag). `options` enthält zusätzlich die längeren Varianten –
 * aber nur Pareto-optimale: mehr Urlaubstage müssen auch mehr freie Tage
 * bringen, sonst fliegt die Variante raus.
 */
export interface BridgeOccasion {
  /** Stabiler Schlüssel: die beteiligten Feiertagsdaten. */
  key: string;
  holidays: { date: Iso; name: string }[];
  recommended: BridgeBlock;
  /** Aufsteigend nach eingesetzten Urlaubstagen, enthält `recommended`. */
  options: BridgeBlock[];
}

export interface BrueckentageResult {
  year: number;
  region: Region;
  budget: number;
  includePartial: boolean;
  /** Alle Feiertage des Jahres im Bundesland. */
  holidays: Holiday[];
  /** Feiertage, die auf ein Wochenende fallen – verschenkte freie Tage. */
  holidaysOnWeekend: number;
  /** Feiertage, die auf einen Werktag fallen. */
  holidaysOnWorkday: number;
  /** Alle Anlässe des Jahres, chronologisch. */
  occasions: BridgeOccasion[];
  /**
   * Die längste zusammenhängende freie Spanne, die mit dem Budget erreichbar
   * ist – das ist die Payoff-Zahl ("X Tage am Stück frei").
   */
  best: BridgeBlock | null;
  /** Der Vorschlag mit dem besten Verhältnis freie Tage / Urlaubstag. */
  mostEfficient: BridgeBlock | null;
  /** Nicht überlappende Auswahl innerhalb des Budgets, chronologisch. */
  plan: {
    blocks: BridgeBlock[];
    vacationDaysUsed: number;
    freeDays: number;
  };
}

/** Maximale Urlaubstage pro Block – mehr ist kein Brückentag mehr, sondern Urlaub. */
const MAX_PER_BLOCK = 5;

export interface BrueckentageInput {
  year: number;
  region: RegionCode;
  /** Urlaubstage, die insgesamt eingesetzt werden sollen. */
  budget: number;
  /** Regional geltende Feiertage mitzählen (z. B. Mariä Himmelfahrt in Bayern). */
  includePartial?: boolean;
}

export function calculateBrueckentage(
  input: BrueckentageInput,
): BrueckentageResult {
  const region = getRegion(input.region);
  if (!region) throw new Error(`Unbekanntes Bundesland: ${input.region}`);

  const year = Math.trunc(input.year);
  const budget = Math.min(30, Math.max(1, Math.trunc(input.budget)));
  const includePartial = input.includePartial ?? false;
  const maxPerBlock = Math.min(MAX_PER_BLOCK, budget);

  const holidays = holidaysFor(year, region.code, { includePartial });

  // Feiertage der Nachbarjahre mitnehmen: freie Spannen dürfen über den
  // Jahreswechsel hinausreichen (Weihnachten/Neujahr).
  const holidayNames = new Map<number, string>();
  for (const y of [year - 1, year, year + 1]) {
    for (const holiday of holidaysFor(y, region.code, { includePartial })) {
      if (holiday.partial && !includePartial) continue;
      holidayNames.set(fromIso(holiday.date), holiday.name);
    }
  }

  const isWorkday = (ms: number) => !isWeekendMs(ms) && !holidayNames.has(ms);

  const yearStart = utcMs(year, 1, 1);
  const yearEnd = utcMs(year, 12, 31);

  /**
   * Kandidaten je Anlass: Schlüssel = beteiligte Feiertage, darin je Anzahl
   * Urlaubstage die Variante mit der längsten freien Spanne.
   */
  const byOccasion = new Map<string, Map<number, BridgeBlock>>();

  for (let start = yearStart; start <= yearEnd; start += DAY_MS) {
    if (!isWorkday(start)) continue;

    const vacation: number[] = [];

    for (let end = start; end <= yearEnd; end += DAY_MS) {
      if (isWorkday(end)) {
        vacation.push(end);
        if (vacation.length > maxPerBlock) break;
      } else {
        // Ein Block, der auf einem freien Tag endet, ist identisch mit dem
        // kürzeren Block, der auf dem letzten Werktag endet.
        continue;
      }

      // Freie Spanne nach außen erweitern, solange angrenzende Tage frei sind.
      let freeStart = start;
      while (!isWorkday(freeStart - DAY_MS)) freeStart -= DAY_MS;
      let freeEnd = end;
      while (!isWorkday(freeEnd + DAY_MS)) freeEnd += DAY_MS;

      // Welche Feiertage tragen diese Spanne? Nur Werktags-Feiertage sparen
      // wirklich Urlaub – ohne einen solchen ist es kein Brückentag.
      const involved: { date: Iso; name: string }[] = [];
      for (let ms = freeStart; ms <= freeEnd; ms += DAY_MS) {
        const name = holidayNames.get(ms);
        if (name && !isWeekendMs(ms)) involved.push({ date: toIso(ms), name });
      }
      if (involved.length === 0) continue;

      const freeDays = (freeEnd - freeStart) / DAY_MS + 1;
      const block: BridgeBlock = {
        vacationDays: vacation.map(toIso),
        vacationStart: toIso(vacation[0]),
        vacationEnd: toIso(vacation[vacation.length - 1]),
        freeStart: toIso(freeStart),
        freeEnd: toIso(freeEnd),
        freeDays,
        ratio: freeDays / vacation.length,
        holidays: involved,
      };

      const key = involved.map((h) => h.date).join("|");
      let variants = byOccasion.get(key);
      if (!variants) {
        variants = new Map<number, BridgeBlock>();
        byOccasion.set(key, variants);
      }
      const cost = vacation.length;
      const previous = variants.get(cost);
      if (!previous || block.freeDays > previous.freeDays) {
        variants.set(cost, block);
      }
    }
  }

  const occasions: BridgeOccasion[] = [];

  for (const [key, variants] of byOccasion) {
    // Pareto-Filter: mehr Urlaubstage müssen mehr freie Tage bringen.
    const options: BridgeBlock[] = [];
    let bestSoFar = 0;
    for (const cost of [...variants.keys()].sort((a, b) => a - b)) {
      const block = variants.get(cost)!;
      if (block.freeDays <= bestSoFar) continue;
      bestSoFar = block.freeDays;
      options.push(block);
    }
    if (options.length === 0) continue;

    const recommended = options.reduce((champion, block) =>
      block.ratio > champion.ratio ||
      (block.ratio === champion.ratio && block.freeDays > champion.freeDays)
        ? block
        : champion,
    );

    occasions.push({
      key,
      holidays: recommended.holidays,
      recommended,
      options,
    });
  }

  occasions.sort((a, b) =>
    a.recommended.freeStart.localeCompare(b.recommended.freeStart),
  );

  const allOptions = occasions.flatMap((occasion) => occasion.options);

  // Payoff: die längste Spanne, die das Budget hergibt.
  const affordable = allOptions.filter(
    (block) => block.vacationDays.length <= budget,
  );
  const best =
    affordable.reduce<BridgeBlock | null>(
      (champion, block) =>
        !champion ||
        block.freeDays > champion.freeDays ||
        (block.freeDays === champion.freeDays && block.ratio > champion.ratio)
          ? block
          : champion,
      null,
    ) ?? null;

  const mostEfficient =
    allOptions.reduce<BridgeBlock | null>(
      (champion, block) =>
        !champion ||
        block.ratio > champion.ratio ||
        (block.ratio === champion.ratio && block.freeDays > champion.freeDays)
          ? block
          : champion,
      null,
    ) ?? null;

  // Jahresplan: die effizientesten Anlässe, die sich nicht überlappen,
  // bis das Budget aufgebraucht ist.
  const planBlocks: BridgeBlock[] = [];
  let used = 0;
  const byEfficiency = occasions
    .map((occasion) => occasion.recommended)
    .sort((a, b) => b.ratio - a.ratio || b.freeDays - a.freeDays);

  for (const block of byEfficiency) {
    if (used + block.vacationDays.length > budget) continue;
    const collides = planBlocks.some(
      (chosen) =>
        block.freeStart <= chosen.freeEnd && chosen.freeStart <= block.freeEnd,
    );
    if (collides) continue;
    planBlocks.push(block);
    used += block.vacationDays.length;
  }
  planBlocks.sort((a, b) => a.freeStart.localeCompare(b.freeStart));

  const countedHolidays = holidays.filter((h) => includePartial || !h.partial);

  return {
    year,
    region,
    budget,
    includePartial,
    holidays,
    holidaysOnWeekend: countedHolidays.filter((h) => h.onWeekend).length,
    holidaysOnWorkday: countedHolidays.filter((h) => !h.onWeekend).length,
    occasions,
    best,
    mostEfficient,
    plan: {
      blocks: planBlocks,
      vacationDaysUsed: used,
      freeDays: planBlocks.reduce((sum, block) => sum + block.freeDays, 0),
    },
  };
}
