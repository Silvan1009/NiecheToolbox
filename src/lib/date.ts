/**
 * Kalendertag-Arithmetik. Reine Funktionen, keine Zeitzonen-Überraschungen.
 *
 * Ein Datum ist immer ein ISO-String "YYYY-MM-DD" und wird intern als
 * UTC-Mitternacht gerechnet. Damit gibt es keine Sommerzeit-Sprünge und
 * Server und Client kommen zum selben Ergebnis.
 */

export type Iso = string;

export const DAY_MS = 86_400_000;

export const utcMs = (year: number, month: number, day: number) =>
  Date.UTC(year, month - 1, day);

export const toIso = (ms: number): Iso => new Date(ms).toISOString().slice(0, 10);

export const fromIso = (iso: Iso): number => Date.parse(`${iso}T00:00:00Z`);

/** 0 = Sonntag … 6 = Samstag */
export const weekdayOf = (ms: number): number => new Date(ms).getUTCDay();

export const isWeekendMs = (ms: number): boolean => {
  const day = weekdayOf(ms);
  return day === 0 || day === 6;
};

export const addDays = (iso: Iso, days: number): Iso =>
  toIso(fromIso(iso) + days * DAY_MS);

export const diffDays = (from: Iso, to: Iso): number =>
  (fromIso(to) - fromIso(from)) / DAY_MS;

/**
 * Monate addieren mit Monatsende-Klemmung: 31.01. + 1 Monat = 28.02.
 * (bzw. 29.02. im Schaltjahr) – so wie Fristen im Alltag gelesen werden.
 */
export function addMonths(iso: Iso, months: number): Iso {
  const [year, month, day] = iso.split("-").map(Number);
  const index = month - 1 + months;
  const targetYear = year + Math.floor(index / 12);
  const targetMonth = ((index % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  return toIso(Date.UTC(targetYear, targetMonth, Math.min(day, lastDay)));
}

/** Erster Tag des Monats, in dem `iso` liegt. */
export function startOfMonth(iso: Iso): Iso {
  const [year, month] = iso.split("-").map(Number);
  return toIso(utcMs(year, month, 1));
}

/** Letzter Tag des Monats, in dem `iso` liegt. */
export function endOfMonth(iso: Iso): Iso {
  const [year, month] = iso.split("-").map(Number);
  return toIso(Date.UTC(year, month, 0));
}

/**
 * Vollendete Jahre zwischen zwei Kalendertagen – so wie Fristen gezählt
 * werden: der Jahrestag muss erreicht sein. 01.03.2020 bis 28.02.2025 sind
 * vier Jahre, bis 01.03.2025 sind es fünf.
 */
export function fullYearsBetween(from: Iso, to: Iso): number {
  const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
  const [toYear, toMonth, toDay] = to.split("-").map(Number);
  let years = toYear - fromYear;
  if (toMonth < fromMonth || (toMonth === fromMonth && toDay < fromDay)) {
    years -= 1;
  }
  return Math.max(0, years);
}

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isValidIso(value: unknown): value is Iso {
  if (typeof value !== "string" || !ISO_PATTERN.test(value)) return false;
  const ms = fromIso(value);
  // Verhindert "2026-02-31": Date.parse akzeptiert es nicht, aber
  // ein Roundtrip deckt auch andere Verschiebungen auf.
  return Number.isFinite(ms) && toIso(ms) === value;
}

/** Heute als ISO-Kalendertag (UTC). */
export const todayIso = (): Iso => toIso(Date.now());
