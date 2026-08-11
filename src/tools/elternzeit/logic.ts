/**
 * Elternzeit-Planer – reine Berechnung.
 *
 * Der Planer rechnet Zeiträume und Fristen aus, er bewertet keinen Einzelfall.
 * Grundlage sind die Regeln des BEEG und des Mutterschutzgesetzes in ihrer
 * allgemeinen Form:
 *
 *  - Mutterschutz: 6 Wochen vor dem errechneten Termin, 8 Wochen nach der
 *    Geburt; 12 Wochen bei Mehrlings- und Frühgeburten.
 *  - Elternzeit: bis zu 36 Monate je Elternteil, davon bis zu 24 Monate
 *    zwischen dem 3. und dem 8. Geburtstag.
 *  - Anmeldefrist: 7 Wochen vor Beginn, 13 Wochen für Zeiträume ab dem
 *    3. Geburtstag.
 *  - Basiselterngeld: 12 Lebensmonate, 14 wenn beide Eltern mindestens
 *    2 Monate nehmen (Partnermonate) oder bei Alleinerziehenden.
 *  - Elterngeld wird rückwirkend nur für 3 Monate vor dem Antragsmonat gezahlt.
 *
 * Ein Lebensmonat beginnt am Geburtstag des Kindes und endet am Tag vor dem
 * gleichen Datum im Folgemonat.
 */

import { addDays, addMonths, isValidIso, type Iso } from "@/lib/date";

export const MAX_ELTERNZEIT_MONTHS = 36;
export const MONTHS_AFTER_THIRD_BIRTHDAY = 24;
export const BASE_ELTERNGELD_MONTHS = 12;
export const PARTNER_BONUS_MONTHS = 2;
/** Mindestmonate je Elternteil, damit die beiden Partnermonate dazukommen. */
export const PARTNER_BONUS_THRESHOLD = 2;

export interface ParentPlan {
  /** Anzahl Monate Elternzeit. 0 = dieser Elternteil nimmt keine. */
  months: number;
  /** Ab welchem Lebensmonat des Kindes (1 = ab Geburt). */
  startMonth: number;
}

export interface ElternzeitInput {
  /** Errechneter Geburtstermin oder Geburtsdatum, ISO "YYYY-MM-DD". */
  birthDate: Iso;
  /** Mehrlings- oder Frühgeburt: Mutterschutz danach 12 statt 8 Wochen. */
  extendedMutterschutz: boolean;
  /** Alleinerziehend – dann gibt es die 14 Monate ohne Partnermonate. */
  singleParent: boolean;
  /** Elternteil 1 ist die Person, die entbindet (Mutterschutz gilt für sie). */
  parentOne: ParentPlan;
  parentTwo: ParentPlan;
}

export interface Period {
  label: string;
  start: Iso;
  end: Iso;
  months: number;
  startMonth: number;
  endMonth: number;
  note?: string;
}

export type MilestoneKind = "frist" | "start" | "ende" | "info";

export interface Milestone {
  date: Iso;
  title: string;
  detail: string;
  kind: MilestoneKind;
}

export interface ElternzeitResult {
  birthDate: Iso;
  mutterschutz: {
    start: Iso;
    end: Iso;
    weeksBefore: number;
    weeksAfter: number;
  };
  thirdBirthday: Iso;
  eighthBirthday: Iso;
  periods: Period[];
  /** Chronologisch sortiert. */
  milestones: Milestone[];
  /** Elternzeit-Monate beider Elternteile zusammen. */
  totalMonths: number;
  elterngeld: {
    /** Höchstzahl an Basiselterngeld-Monaten in dieser Konstellation. */
    maxMonths: number;
    /** Wie viele der geplanten Monate davon abgedeckt sind. */
    coveredMonths: number;
    /** Geplante Monate, die ohne Basiselterngeld bleiben. */
    uncoveredMonths: number;
    partnerBonus: boolean;
  };
  /** Hinweise, die den Plan betreffen – keine Rechtsberatung. */
  warnings: string[];
}

const WEEK = 7;
const MUTTERSCHUTZ_WEEKS_BEFORE = 6;
const MUTTERSCHUTZ_WEEKS_AFTER = 8;
const MUTTERSCHUTZ_WEEKS_AFTER_EXTENDED = 12;
const NOTICE_WEEKS = 7;
const NOTICE_WEEKS_AFTER_THIRD = 13;
const ELTERNGELD_RETROACTIVE_MONTHS = 3;

/** Erster Tag des n-ten Lebensmonats (n ab 1). */
export function lebensmonatStart(birthDate: Iso, month: number): Iso {
  return addMonths(birthDate, Math.max(1, Math.trunc(month)) - 1);
}

/** Letzter Tag des n-ten Lebensmonats. */
export function lebensmonatEnd(birthDate: Iso, month: number): Iso {
  return addDays(lebensmonatStart(birthDate, month + 1), -1);
}

const clampInt = (value: number, min: number, max: number) =>
  Math.min(
    max,
    Math.max(min, Math.trunc(Number.isFinite(value) ? value : min)),
  );

function normalisePlan(plan: ParentPlan): ParentPlan {
  return {
    months: clampInt(plan.months, 0, MAX_ELTERNZEIT_MONTHS),
    startMonth: clampInt(plan.startMonth, 1, 96),
  };
}

export function calculateElternzeit(input: ElternzeitInput): ElternzeitResult {
  if (!isValidIso(input.birthDate)) {
    throw new Error(`Ungültiges Datum: ${String(input.birthDate)}`);
  }

  const birthDate = input.birthDate;
  const parentOne = normalisePlan(input.parentOne);
  const parentTwo = normalisePlan(input.parentTwo);

  const weeksAfter = input.extendedMutterschutz
    ? MUTTERSCHUTZ_WEEKS_AFTER_EXTENDED
    : MUTTERSCHUTZ_WEEKS_AFTER;

  const mutterschutz = {
    start: addDays(birthDate, -MUTTERSCHUTZ_WEEKS_BEFORE * WEEK),
    end: addDays(birthDate, weeksAfter * WEEK),
    weeksBefore: MUTTERSCHUTZ_WEEKS_BEFORE,
    weeksAfter,
  };

  const thirdBirthday = addMonths(birthDate, 36);
  const eighthBirthday = addMonths(birthDate, 96);

  const periods: Period[] = [];
  const milestones: Milestone[] = [
    {
      date: mutterschutz.start,
      title: "Mutterschutz beginnt",
      detail: `${MUTTERSCHUTZ_WEEKS_BEFORE} Wochen vor dem errechneten Termin. Ab hier darf Elternteil 1 nicht mehr arbeiten, wenn es nicht ausdrücklich gewünscht ist.`,
      kind: "start",
    },
    {
      date: birthDate,
      title: "Geburt (errechneter Termin)",
      detail: "Ab diesem Tag zählen die Lebensmonate des Kindes.",
      kind: "info",
    },
    {
      date: mutterschutz.end,
      title: "Mutterschutz endet",
      detail: `${weeksAfter} Wochen nach der Geburt. Diese Zeit wird auf die Elternzeit von Elternteil 1 angerechnet.`,
      kind: "ende",
    },
    {
      date: addMonths(birthDate, ELTERNGELD_RETROACTIVE_MONTHS),
      title: "Elterngeld spätestens jetzt beantragen",
      detail: `Elterngeld wird rückwirkend nur für ${ELTERNGELD_RETROACTIVE_MONTHS} Monate vor dem Antragsmonat gezahlt. Wer später beantragt, verliert die ersten Monate.`,
      kind: "frist",
    },
  ];

  const plans: { label: string; plan: ParentPlan }[] = [
    { label: "Elternteil 1", plan: parentOne },
    { label: "Elternteil 2", plan: parentTwo },
  ];

  const warnings: string[] = [];

  for (const { label, plan } of plans) {
    if (plan.months === 0) continue;

    const startMonth = plan.startMonth;
    const endMonth = startMonth + plan.months - 1;
    const start = lebensmonatStart(birthDate, startMonth);
    const end = lebensmonatEnd(birthDate, endMonth);

    const overlapsMutterschutz =
      label === "Elternteil 1" && start <= mutterschutz.end;

    periods.push({
      label,
      start,
      end,
      months: plan.months,
      startMonth,
      endMonth,
      note: overlapsMutterschutz
        ? `Die ersten ${weeksAfter} Wochen sind Mutterschutz und werden auf die Elternzeit angerechnet.`
        : undefined,
    });

    const afterThird = start >= thirdBirthday;
    const noticeWeeks = afterThird ? NOTICE_WEEKS_AFTER_THIRD : NOTICE_WEEKS;

    milestones.push({
      date: addDays(start, -noticeWeeks * WEEK),
      title: `${label}: Elternzeit anmelden`,
      detail: `Die Elternzeit muss dem Arbeitgeber spätestens ${noticeWeeks} Wochen vor Beginn schriftlich mitgeteilt werden – verbindlich für die ersten zwei Jahre.`,
      kind: "frist",
    });
    milestones.push({
      date: start,
      title: `${label}: Elternzeit beginnt`,
      detail: `Lebensmonat ${startMonth} des Kindes.`,
      kind: "start",
    });
    milestones.push({
      date: addDays(end, 1),
      title: `${label}: zurück im Job`,
      detail: `Die Elternzeit endete am Tag davor, mit Ablauf von Lebensmonat ${endMonth}.`,
      kind: "ende",
    });

    if (end >= thirdBirthday) {
      const monthsAfterThird = Math.max(0, endMonth - 36);
      warnings.push(
        `${label}: ${monthsAfterThird} ${monthsAfterThird === 1 ? "Monat liegt" : "Monate liegen"} nach dem 3. Geburtstag. Diese Zeit ist möglich (bis zu ${MONTHS_AFTER_THIRD_BIRTHDAY} Monate bis zum 8. Geburtstag), muss aber ${NOTICE_WEEKS_AFTER_THIRD} Wochen vorher angemeldet werden und der Arbeitgeber kann sie aus dringenden betrieblichen Gründen ablehnen.`,
      );
    }
    if (endMonth > 96) {
      warnings.push(
        `${label}: Der Zeitraum endet nach dem 8. Geburtstag des Kindes. Elternzeit ist nur bis dahin möglich.`,
      );
    }
  }

  if (periods.length > 1) {
    milestones.push({
      date: thirdBirthday,
      title: "3. Geburtstag des Kindes",
      detail: `Bis hierhin ist Elternzeit ohne Zustimmung des Arbeitgebers möglich. Danach können noch bis zu ${MONTHS_AFTER_THIRD_BIRTHDAY} Monate genommen werden.`,
      kind: "info",
    });
  }

  const partnerBonus =
    input.singleParent ||
    (parentOne.months >= PARTNER_BONUS_THRESHOLD &&
      parentTwo.months >= PARTNER_BONUS_THRESHOLD);

  const maxMonths =
    BASE_ELTERNGELD_MONTHS + (partnerBonus ? PARTNER_BONUS_MONTHS : 0);

  const totalMonths = parentOne.months + parentTwo.months;
  const coveredMonths = Math.min(totalMonths, maxMonths);

  if (totalMonths > maxMonths) {
    warnings.push(
      `Geplant sind ${totalMonths} Monate Elternzeit, Basiselterngeld gibt es aber nur für ${maxMonths}. Die übrigen ${totalMonths - maxMonths} Monate sind unbezahlt – oder du prüfst ElterngeldPlus, das die Bezugsdauer verdoppelt (bei halbem Betrag).`,
    );
  }
  if (
    !input.singleParent &&
    totalMonths >= BASE_ELTERNGELD_MONTHS + PARTNER_BONUS_MONTHS &&
    !partnerBonus
  ) {
    warnings.push(
      `Die zwei Partnermonate gibt es nur, wenn beide Elternteile mindestens ${PARTNER_BONUS_THRESHOLD} Monate nehmen. Aktuell nimmt ein Elternteil weniger.`,
    );
  }
  if (totalMonths === 0) {
    warnings.push(
      "Noch ist keine Elternzeit geplant. Trage bei mindestens einem Elternteil Monate ein.",
    );
  }

  // ISO-Datumsstrings sortieren lexikografisch korrekt. Am selben Tag zählt
  // die inhaltliche Reihenfolge: erst die Frist, dann das Ereignis, dann was
  // endet, dann was beginnt (die Geburt steht also vor dem Elternzeit-Start,
  // und wer zurückkommt vor dem, der übernimmt).
  const kindOrder: Record<MilestoneKind, number> = {
    frist: 0,
    info: 1,
    ende: 2,
    start: 3,
  };
  milestones.sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      kindOrder[a.kind] - kindOrder[b.kind] ||
      a.title.localeCompare(b.title),
  );

  return {
    birthDate,
    mutterschutz,
    thirdBirthday,
    eighthBirthday,
    periods,
    milestones,
    totalMonths,
    elterngeld: {
      maxMonths,
      coveredMonths,
      uncoveredMonths: Math.max(0, totalMonths - maxMonths),
      partnerBonus,
    },
    warnings,
  };
}
