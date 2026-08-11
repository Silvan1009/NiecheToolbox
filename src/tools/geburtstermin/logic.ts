/**
 * Geburtstermin-/SSW-Rechner – Naegele-Regel und Schwangerschaftswoche.
 *
 * Gerechnet wird ab dem ersten Tag der letzten Periode (LMP), wie in der
 * Geburtshilfe üblich – nicht ab dem vermuteten Tag der Empfängnis. Die
 * klassische Naegele-Regel lautet: LMP + 7 Tage − 3 Monate + 1 Jahr, was
 * rechnerisch identisch zu LMP + 7 Tage + 9 Monaten ist.
 *
 * Bei einer von 28 Tagen abweichenden Zykluslänge verschiebt sich der
 * vermutete Eisprung und damit der Termin um genau die Differenz – das
 * bildet die `effektiveLmp` ab, auf der auch die Schwangerschaftswoche
 * beruht, damit beide Werte konsistent zueinander bleiben.
 *
 * Der errechnete Termin ist eine Schätzung: Nur rund 4–5 % der Geburten
 * treffen ihn exakt. Der übliche Zeitraum (37.–42. Schwangerschaftswoche)
 * wird deshalb als eigener, gleichrangiger Wert ausgewiesen und nicht nur
 * als Fußnote.
 */

import {
  addDays,
  addMonths,
  diffDays,
  isValidIso,
  todayIso,
  type Iso,
} from "@/lib/date";

export const STANDARD_ZYKLUS_TAGE = 28;
const DUE_DATE_RANGE_DAYS = 14;

export interface GeburtsterminInput {
  letzteRegel: Iso;
  /** Tage, Default 28. Abweichungen verschieben Termin und SSW gleichermaßen. */
  zykluslaengeTage: number;
  heute: Iso;
}

export type Trimester = 1 | 2 | 3;

export interface GeburtsterminResult {
  gueltig: boolean;
  effektiveLmp: Iso;
  errechneterTermin: Iso;
  ssw: number;
  sswTag: number;
  trimester: Trimester;
  fruehesterZeitraum: Iso;
  spaetesterZeitraum: Iso;
  /** Negativ, wenn der Termin bereits verstrichen ist. */
  tageBisTermin: number;
  warnings: string[];
}

function trimesterVon(ssw: number): Trimester {
  if (ssw < 14) return 1;
  if (ssw < 28) return 2;
  return 3;
}

export function calculateGeburtstermin(
  input: GeburtsterminInput,
): GeburtsterminResult {
  const heute = isValidIso(input.heute) ? input.heute : todayIso();

  if (!isValidIso(input.letzteRegel)) {
    return {
      gueltig: false,
      effektiveLmp: heute,
      errechneterTermin: heute,
      ssw: 0,
      sswTag: 0,
      trimester: 1,
      fruehesterZeitraum: heute,
      spaetesterZeitraum: heute,
      tageBisTermin: 0,
      warnings: [
        "Trag den ersten Tag deiner letzten Periode ein, um Termin und Schwangerschaftswoche zu sehen.",
      ],
    };
  }

  const zyklusAbweichung =
    Math.trunc(input.zykluslaengeTage) - STANDARD_ZYKLUS_TAGE;
  const effektiveLmp = addDays(input.letzteRegel, zyklusAbweichung);
  const errechneterTermin = addMonths(addDays(effektiveLmp, 7), 9);

  const tageSeitLmp = diffDays(effektiveLmp, heute);
  const ssw = Math.max(0, Math.floor(tageSeitLmp / 7));
  const sswTag = Math.max(0, tageSeitLmp) % 7;

  const warnings: string[] = [];
  if (tageSeitLmp < 0) {
    warnings.push(
      "Die letzte Periode liegt nach dem heutigen Datum – prüfe die Eingabe.",
    );
  }
  if (ssw > 42) {
    warnings.push(
      "Der errechnete Termin liegt mehr als zwei Wochen zurück. Das kommt vor, gehört aber in ärztliche Betreuung.",
    );
  }

  return {
    gueltig: true,
    effektiveLmp,
    errechneterTermin,
    ssw,
    sswTag,
    trimester: trimesterVon(ssw),
    fruehesterZeitraum: addDays(errechneterTermin, -DUE_DATE_RANGE_DAYS),
    spaetesterZeitraum: addDays(errechneterTermin, DUE_DATE_RANGE_DAYS),
    tageBisTermin: diffDays(heute, errechneterTermin),
    warnings,
  };
}

export function defaultInput(): GeburtsterminInput {
  const heute = todayIso();
  return {
    // Zehn Wochen her – zeigt beim ersten Laden ein plausibles Beispiel.
    letzteRegel: addDays(heute, -70),
    zykluslaengeTage: STANDARD_ZYKLUS_TAGE,
    heute,
  };
}
