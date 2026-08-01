/**
 * Kündigungsfristen für Wohnraummietverträge (§ 573c BGB) und
 * Arbeitsverträge (§ 622 BGB) – reine Berechnung.
 *
 * Zwei Fragen, dieselbe Mechanik:
 *   vorwärts  – "Ich kündige am 5. März. Wann endet der Vertrag?"
 *   rückwärts – "Ich will zum 30. Juni raus. Bis wann muss die Kündigung da sein?"
 *
 * Maßgeblich ist immer der **Zugang** beim Empfänger, nicht das Absenden.
 * Diese Datei rechnet ausschließlich mit den gesetzlichen Fristen; ein Vertrag
 * kann längere vorsehen (siehe `warnings`).
 */

import {
  addDays,
  addMonths,
  endOfMonth,
  fromIso,
  fullYearsBetween,
  startOfMonth,
  toIso,
  utcMs,
  weekdayOf,
  type Iso,
} from "@/lib/date";
import { holidaysFor, type RegionCode } from "@/lib/regionen";

export type { Iso };

export type ContractKind = "wohnung" | "arbeit";
export type Party = "mieter" | "vermieter" | "arbeitnehmer" | "arbeitgeber";
export type Direction = "vorwaerts" | "rueckwaerts";

export const partiesFor: Record<ContractKind, readonly Party[]> = {
  wohnung: ["mieter", "vermieter"],
  arbeit: ["arbeitnehmer", "arbeitgeber"],
};

export const partyLabels: Record<Party, string> = {
  mieter: "Ich als Mieter:in",
  vermieter: "Vermieter:in",
  arbeitnehmer: "Ich als Arbeitnehmer:in",
  arbeitgeber: "Arbeitgeber",
};

export const contractLabels: Record<ContractKind, string> = {
  wohnung: "Wohnung",
  arbeit: "Arbeitsvertrag",
};

/* ---------------------------------------------------------------------------
 * Werktage
 * ------------------------------------------------------------------------- */

/**
 * Werktag im Sinne des Mietrechts: Montag bis Samstag, ohne gesetzliche
 * Feiertage. Der Samstag zählt hier mit – anders als bei der Mietzahlung,
 * für die der BGH ihn ausgenommen hat. Die Frage ist umstritten; wer den
 * Streit vermeiden will, kündigt ein bis zwei Tage früher.
 *
 * Berücksichtigt werden landesweite Feiertage. Nur regional geltende
 * Feiertage (etwa Mariä Himmelfahrt in Teilen Bayerns) bleiben außen vor.
 */
export function isWerktag(iso: Iso, region: RegionCode): boolean {
  const day = weekdayOf(fromIso(iso));
  if (day === 0) return false; // Sonntag
  return !holidayDates(Number(iso.slice(0, 4)), region).has(iso);
}

const holidayCache = new Map<string, Set<Iso>>();

function holidayDates(year: number, region: RegionCode): Set<Iso> {
  const key = `${year}:${region}`;
  const cached = holidayCache.get(key);
  if (cached) return cached;
  const set = new Set(
    holidaysFor(year, region, { includePartial: false }).map((h) => h.date),
  );
  holidayCache.set(key, set);
  return set;
}

/** Der dritte Werktag des Monats, in dem `iso` liegt (Karenzzeit § 573c). */
export function thirdWerktag(iso: Iso, region: RegionCode): Iso {
  let cursor = startOfMonth(iso);
  let count = 0;
  // Ein Monat hat immer mindestens drei Werktage – die Schleife terminiert.
  for (let guard = 0; guard < 31; guard += 1) {
    if (isWerktag(cursor, region)) {
      count += 1;
      if (count === 3) return cursor;
    }
    cursor = addDays(cursor, 1);
  }
  return cursor;
}

/* ---------------------------------------------------------------------------
 * Fristen
 * ------------------------------------------------------------------------- */

/**
 * Eine Kündigungsfrist besteht aus einer Länge und einem zulässigen
 * Endtermin. Beides zusammen bestimmt das Vertragsende.
 */
export type Frist =
  /** Probezeit: zwei Wochen, Ende an einem beliebigen Tag. */
  | { unit: "wochen"; value: number; termin: "beliebig" }
  /** Grundfrist Arbeit: vier Wochen zum 15. oder zum Monatsende. */
  | { unit: "wochen"; value: number; termin: "halbmonat" }
  /** Gestaffelte Arbeitgeberfrist: n Monate zum Monatsende. */
  | { unit: "monate"; value: number; termin: "monatsende" }
  /** Miete: n Monate, mit Karenzzeit bis zum dritten Werktag. */
  | { unit: "monate"; value: number; termin: "karenz" };

/** § 622 Abs. 2 BGB – Staffelung nach Betriebszugehörigkeit. */
const EMPLOYER_TIERS: readonly { years: number; months: number }[] = [
  { years: 20, months: 7 },
  { years: 15, months: 6 },
  { years: 12, months: 5 },
  { years: 10, months: 4 },
  { years: 8, months: 3 },
  { years: 5, months: 2 },
  { years: 2, months: 1 },
];

/** § 573c Abs. 1 S. 2 BGB – Verlängerung für Vermieter nach 5 und 8 Jahren. */
function landlordMonths(years: number): number {
  if (years >= 8) return 9;
  if (years >= 5) return 6;
  return 3;
}

function employerFrist(years: number): Frist {
  const tier = EMPLOYER_TIERS.find((t) => years >= t.years);
  return tier
    ? { unit: "monate", value: tier.months, termin: "monatsende" }
    : { unit: "wochen", value: 4, termin: "halbmonat" };
}

/** Klartext-Länge, z. B. "3 Monate" oder "4 Wochen". */
export function fristLabel(frist: Frist): string {
  const unit =
    frist.unit === "wochen"
      ? frist.value === 1
        ? "Woche"
        : "Wochen"
      : frist.value === 1
        ? "Monat"
        : "Monate";
  return `${frist.value} ${unit}`;
}

/* ---------------------------------------------------------------------------
 * Vertragsende aus dem Zugang
 * ------------------------------------------------------------------------- */

/** Nächster zulässiger Termin (15. oder Monatsletzter) ab `earliest`. */
function nextHalbmonatTermin(earliest: Iso): Iso {
  const [year, month, day] = earliest.split("-").map(Number);
  if (day <= 15) return toIso(utcMs(year, month, 15));
  return endOfMonth(earliest);
}

interface EndOutcome {
  end: Iso;
  /** Nur bei Mietverträgen: Zugang lag in der Karenzzeit. */
  withinKarenz?: boolean;
  karenzDeadline?: Iso;
}

function endForFrist(zugang: Iso, frist: Frist, region: RegionCode): EndOutcome {
  switch (frist.termin) {
    case "beliebig":
      return { end: addDays(zugang, frist.value * 7) };

    case "halbmonat":
      return { end: nextHalbmonatTermin(addDays(zugang, frist.value * 7)) };

    case "monatsende":
      return { end: endOfMonth(addMonths(zugang, frist.value)) };

    case "karenz": {
      // Geht die Kündigung bis zum dritten Werktag zu, zählt der laufende
      // Monat als erster Fristmonat mit – sonst erst der folgende.
      const karenzDeadline = thirdWerktag(zugang, region);
      const withinKarenz = zugang <= karenzDeadline;
      const offset = withinKarenz ? frist.value - 1 : frist.value;
      return {
        end: endOfMonth(addMonths(startOfMonth(zugang), offset)),
        withinKarenz,
        karenzDeadline,
      };
    }
  }
}

/* ---------------------------------------------------------------------------
 * Öffentliche API
 * ------------------------------------------------------------------------- */

export interface NoticeInput {
  contract: ContractKind;
  party: Party;
  direction: Direction;
  /** Zugang der Kündigung – maßgeblich bei `direction: "vorwaerts"`. */
  zugang: Iso;
  /** Gewünschtes Vertragsende – maßgeblich bei `direction: "rueckwaerts"`. */
  wunschende: Iso;
  /** Beginn von Mietverhältnis bzw. Beschäftigung. */
  since: Iso;
  /** Für die Werktagsbestimmung der Karenzzeit. */
  region: RegionCode;
  /** Arbeitsvertrag: Kündigung fällt in eine vereinbarte Probezeit. */
  probezeit: boolean;
}

export interface NoticeResult {
  contract: ContractKind;
  party: Party;
  direction: Direction;
  /** Der Zugang, auf dem die Rechnung beruht. */
  zugang: Iso;
  /** Letzter Tag des Vertrags. */
  end: Iso;
  /** Kalendertage zwischen Zugang und Vertragsende. */
  daysOfNotice: number;
  frist: Frist;
  /** Vollendete Jahre Bestands- bzw. Betriebszugehörigkeit, die die Frist bestimmt haben. */
  years: number;
  /** Miete: Zugang lag innerhalb der Karenzzeit. */
  withinKarenz?: boolean;
  /** Miete: dritter Werktag des Zugangsmonats. */
  karenzDeadline?: Iso;
  /** Rückwärts: eingegebenes Wunschende. */
  requestedEnd?: Iso;
  /** Rückwärts: Wunschende war kein zulässiger Endtermin, es endet früher. */
  endsEarlierThanWanted: boolean;
  /** Der maßgebliche Tag fällt auf Sonntag oder Feiertag. */
  zugangOnClosedDay: boolean;
  warnings: string[];
}

/** Frist inklusive Fixpunkt-Auflösung für die Arbeitgeber-Staffelung. */
function resolveFrist(
  input: NoticeInput,
  zugang: Iso,
): { frist: Frist; years: number; outcome: EndOutcome } {
  if (input.contract === "arbeit" && input.probezeit) {
    const frist: Frist = { unit: "wochen", value: 2, termin: "beliebig" };
    return {
      frist,
      years: fullYearsBetween(input.since, zugang),
      outcome: endForFrist(zugang, frist, input.region),
    };
  }

  if (input.contract === "arbeit" && input.party === "arbeitnehmer") {
    // § 622 Abs. 1: für Arbeitnehmer bleibt es bei der Grundfrist.
    const frist: Frist = { unit: "wochen", value: 4, termin: "halbmonat" };
    return {
      frist,
      years: fullYearsBetween(input.since, zugang),
      outcome: endForFrist(zugang, frist, input.region),
    };
  }

  if (input.contract === "arbeit") {
    // Die Staffel bemisst sich nach der Betriebszugehörigkeit bei Ablauf der
    // Frist – die wiederum von der Staffel abhängt. Ein kurzer Fixpunkt löst
    // das auf: längere Fristen ergeben spätere Enden, also steigt der Wert
    // monoton und die Schleife kommt zur Ruhe.
    let years = fullYearsBetween(input.since, zugang);
    let frist = employerFrist(years);
    let outcome = endForFrist(zugang, frist, input.region);

    for (let guard = 0; guard < 4; guard += 1) {
      const yearsAtEnd = fullYearsBetween(input.since, outcome.end);
      const next = employerFrist(yearsAtEnd);
      if (next.termin === frist.termin && next.value === frist.value) break;
      years = yearsAtEnd;
      frist = next;
      outcome = endForFrist(zugang, frist, input.region);
    }
    return { frist, years, outcome };
  }

  // Wohnraummiete
  const years = fullYearsBetween(input.since, zugang);
  const months = input.party === "vermieter" ? landlordMonths(years) : 3;
  const frist: Frist = { unit: "monate", value: months, termin: "karenz" };
  return { frist, years, outcome: endForFrist(zugang, frist, input.region) };
}

function buildWarnings(input: NoticeInput, frist: Frist): string[] {
  const warnings: string[] = [];

  if (input.contract === "arbeit" && input.probezeit) {
    warnings.push(
      "Die Zwei-Wochen-Frist gilt nur, solange eine Probezeit vereinbart ist – höchstens für die ersten sechs Monate.",
    );
  }

  if (input.contract === "arbeit" && input.party === "arbeitnehmer") {
    warnings.push(
      "Viele Arbeitsverträge vereinbaren längere Fristen als das Gesetz. Steht im Vertrag mehr, gilt der Vertrag.",
    );
  }

  if (input.contract === "wohnung" && input.party === "mieter" && !input.probezeit) {
    warnings.push(
      "Für Mieter darf der Vertrag keine längere Frist als drei Monate vorsehen. Eine längere Klausel ist unwirksam.",
    );
  }

  if (input.contract === "wohnung" && input.party === "vermieter") {
    warnings.push(
      "Eine Vermieterkündigung braucht zusätzlich einen gesetzlichen Grund, etwa Eigenbedarf. Die Frist allein genügt nicht.",
    );
  }

  if (frist.termin === "karenz") {
    warnings.push(
      "Ob der Samstag als Werktag zählt, ist umstritten. Ein bis zwei Tage früher zustellen nimmt dem Streit die Grundlage.",
    );
  }

  return warnings;
}

/**
 * Frühestmöglicher Endtermin zu einem Zugang. Monoton steigend im Zugang –
 * darauf beruht die Rückwärtssuche.
 */
export function endForZugang(input: NoticeInput, zugang: Iso): Iso {
  return resolveFrist(input, zugang).outcome.end;
}

/**
 * Spätester Zugang, mit dem der Vertrag noch bis `wunschende` endet.
 * Gibt `null` zurück, wenn der Wunschtermin zu nah liegt.
 */
export function latestZugangFor(
  input: NoticeInput,
  wunschende: Iso,
  searchDays = 420,
): Iso | null {
  for (let back = 0; back <= searchDays; back += 1) {
    const candidate = addDays(wunschende, -back);
    if (endForZugang(input, candidate) <= wunschende) return candidate;
  }
  return null;
}

export function calculateNotice(input: NoticeInput): NoticeResult {
  const backwards = input.direction === "rueckwaerts";
  const zugang = backwards
    ? (latestZugangFor(input, input.wunschende) ?? input.wunschende)
    : input.zugang;

  const { frist, years, outcome } = resolveFrist(input, zugang);
  const warnings = buildWarnings(input, frist);

  const noZugangFound =
    backwards && latestZugangFor(input, input.wunschende) === null;
  if (noZugangFound) {
    warnings.unshift(
      "Zu diesem Wunschtermin ist keine fristgerechte Kündigung mehr möglich – er liegt zu nah.",
    );
  }

  const endsEarlierThanWanted =
    backwards && !noZugangFound && outcome.end < input.wunschende;

  const zugangOnClosedDay =
    weekdayOf(fromIso(zugang)) === 0 || !isWerktag(zugang, input.region);

  return {
    contract: input.contract,
    party: input.party,
    direction: input.direction,
    zugang,
    end: outcome.end,
    daysOfNotice: Math.round(
      (fromIso(outcome.end) - fromIso(zugang)) / 86_400_000,
    ),
    frist,
    years,
    withinKarenz: outcome.withinKarenz,
    karenzDeadline: outcome.karenzDeadline,
    requestedEnd: backwards ? input.wunschende : undefined,
    endsEarlierThanWanted,
    zugangOnClosedDay,
    warnings,
  };
}
