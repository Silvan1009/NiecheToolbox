/**
 * Arbeitstage zwischen zwei Daten – reine Berechnung.
 *
 * Die Feiertagsmatrix kommt aus dem Brückentage-Rechner. Ein Feiertag zählt
 * nur dann als Ausfall, wenn er auf einen Tag fällt, an dem ohnehin gearbeitet
 * würde: Der 1. Mai an einem Samstag kostet niemanden einen Arbeitstag.
 */

import { addDays, diffDays, fromIso, weekdayOf, type Iso } from "@/lib/date";
import { holidaysFor, type RegionCode } from "@/lib/regionen";

export type { Iso };

/** 1 = Montag … 7 = Sonntag (ISO-Wochentage, wie sie hier gelesen werden). */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Die üblichen Arbeitswochen als Voreinstellungen. */
export const weekPresets = {
  "5": { label: "Montag bis Freitag", days: [1, 2, 3, 4, 5] as IsoWeekday[] },
  "6": {
    label: "Montag bis Samstag",
    days: [1, 2, 3, 4, 5, 6] as IsoWeekday[],
  },
  "7": {
    label: "Alle sieben Tage",
    days: [1, 2, 3, 4, 5, 6, 7] as IsoWeekday[],
  },
} as const;

export type WeekPreset = keyof typeof weekPresets;

/** Für die Monatsübersicht und die Texte der Variantenseiten. */
export const MONTH_NAMES = [
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
] as const;

/** JS-Wochentag (0 = Sonntag) auf ISO-Wochentag (1 = Montag) drehen. */
export function isoWeekdayOf(iso: Iso): IsoWeekday {
  const day = weekdayOf(fromIso(iso));
  return (day === 0 ? 7 : day) as IsoWeekday;
}

export interface WorkdayHoliday {
  date: Iso;
  name: string;
  weekday: IsoWeekday;
  /** Fällt auf einen Tag, an dem gearbeitet würde – kostet also einen Arbeitstag. */
  countsAsLoss: boolean;
  partial: boolean;
}

export interface WorkdaysInput {
  from: Iso;
  to: Iso;
  region: RegionCode;
  /** Wochentage, an denen gearbeitet wird. */
  workdays: IsoWeekday[];
  /** Nur regional geltende Feiertage mitzählen. */
  includePartial: boolean;
  /** Urlaubs- oder Krankheitstage, die noch abgezogen werden. */
  daysOff: number;
}

export interface WorkdaysResult {
  from: Iso;
  to: Iso;
  /** Kalendertage inklusive beider Enddaten. */
  calendarDays: number;
  /** Tage, die auf einen Arbeitswochentag fallen – vor Feiertagsabzug. */
  scheduledDays: number;
  /** Feiertage, die einen Arbeitstag gekostet haben. */
  lostToHolidays: number;
  /** Arbeitstage nach Feiertagsabzug. */
  workdays: number;
  /** Arbeitstage abzüglich Urlaub. */
  netWorkdays: number;
  /** Tage, an denen ohnehin nicht gearbeitet würde. */
  offDays: number;
  /** Feiertage, die ins Wochenende fielen – also nichts gebracht haben. */
  wastedHolidays: number;
  holidays: WorkdayHoliday[];
  /** Eingaben waren vertauscht und wurden getauscht. */
  swapped: boolean;
}

/**
 * Alle Feiertage der berührten Jahre – ein Zeitraum darf Jahresgrenzen
 * überschreiten.
 */
function holidaysInRange(
  from: Iso,
  to: Iso,
  region: RegionCode,
  includePartial: boolean,
): { date: Iso; name: string; partial: boolean }[] {
  const firstYear = Number(from.slice(0, 4));
  const lastYear = Number(to.slice(0, 4));
  const result: { date: Iso; name: string; partial: boolean }[] = [];

  for (let year = firstYear; year <= lastYear; year += 1) {
    for (const holiday of holidaysFor(year, region)) {
      // Nur teilweise geltende Feiertage sind ohne `includePartial` reine
      // Information und dürfen keinen Arbeitstag streichen.
      if (holiday.partial && !includePartial) continue;
      if (holiday.date < from || holiday.date > to) continue;
      result.push({
        date: holiday.date,
        name: holiday.name,
        partial: holiday.partial,
      });
    }
  }

  return result;
}

export function calculateWorkdays(input: WorkdaysInput): WorkdaysResult {
  // Vertauschte Daten sind ein Tippfehler, kein Fehlerfall: still drehen.
  const swapped = input.to < input.from;
  const from = swapped ? input.to : input.from;
  const to = swapped ? input.from : input.to;

  const working = new Set(input.workdays);
  const calendarDays = diffDays(from, to) + 1;

  const holidayList = holidaysInRange(
    from,
    to,
    input.region,
    input.includePartial,
  );

  let scheduledDays = 0;
  for (let cursor = from; cursor <= to; cursor = addDays(cursor, 1)) {
    if (working.has(isoWeekdayOf(cursor))) scheduledDays += 1;
  }

  const holidays: WorkdayHoliday[] = holidayList.map((holiday) => {
    const weekday = isoWeekdayOf(holiday.date);
    return {
      date: holiday.date,
      name: holiday.name,
      weekday,
      countsAsLoss: working.has(weekday),
      partial: holiday.partial,
    };
  });

  const lostToHolidays = holidays.filter((h) => h.countsAsLoss).length;
  const workdays = scheduledDays - lostToHolidays;
  const daysOff = Math.max(0, Math.trunc(input.daysOff));

  return {
    from,
    to,
    calendarDays,
    scheduledDays,
    lostToHolidays,
    workdays,
    // Mehr Urlaub als Arbeitstage ergibt keine negativen Tage.
    netWorkdays: Math.max(0, workdays - daysOff),
    offDays: calendarDays - scheduledDays,
    wastedHolidays: holidays.length - lostToHolidays,
    holidays,
    swapped,
  };
}

/** Ganzes Kalenderjahr – der häufigste Fall ("Arbeitstage 2026"). */
export function yearRange(year: number): { from: Iso; to: Iso } {
  return { from: `${year}-01-01`, to: `${year}-12-31` };
}

/** Ein Kalendermonat, 1-basiert. */
export function monthRange(
  year: number,
  month: number,
): { from: Iso; to: Iso } {
  const padded = String(month).padStart(2, "0");
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { from: `${year}-${padded}-01`, to: `${year}-${padded}-${lastDay}` };
}

/** Ein Quartal, 1–4. */
export function quarterRange(
  year: number,
  quarter: number,
): { from: Iso; to: Iso } {
  const firstMonth = (quarter - 1) * 3 + 1;
  return {
    from: monthRange(year, firstMonth).from,
    to: monthRange(year, firstMonth + 2).to,
  };
}

/** Alle Monate eines Jahres mit ihren Arbeitstagen – für die Jahresübersicht. */
export function monthlyBreakdown(
  year: number,
  region: RegionCode,
  workdays: IsoWeekday[],
  includePartial: boolean,
): { month: number; workdays: number; holidays: number }[] {
  return Array.from({ length: 12 }, (_, index) => {
    const range = monthRange(year, index + 1);
    const result = calculateWorkdays({
      ...range,
      region,
      workdays,
      includePartial,
      daysOff: 0,
    });
    return {
      month: index + 1,
      workdays: result.workdays,
      holidays: result.lostToHolidays,
    };
  });
}
