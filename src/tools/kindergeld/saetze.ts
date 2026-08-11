/**
 * Kindergeldsätze und Altersgrenzen – an einer Stelle und datiert.
 *
 * Das ist der Punkt, an dem dieser Rechner jedes Jahr veraltet. Die
 * Rechenlogik enthält keine dieser Zahlen: Der Jahreswechsel ist eine
 * Änderung in dieser Datei, nicht eine Suche quer durch den Code.
 *
 * Die Freibeträge stehen bewusst nicht hier, sondern werden aus
 * lib/steuerdaten.ts importiert. Zwei Dateien mit demselben
 * Kinderfreibetrag wären zwei Stellen, die zum Jahreswechsel auseinanderlaufen.
 *
 * Quellen (Stand Januar 2026):
 *   Kindergeld – § 66 Abs. 1 EStG
 *   Altersgrenzen – § 32 Abs. 4 EStG
 */

export type KindStatus = "regulaer" | "ausbildung" | "arbeitsuchend";

/** Kindergeld je Kind und Monat, in Euro, nach Kalenderjahr. */
export const KINDERGELD_JE_MONAT: Record<number, number> = {
  2023: 250,
  2024: 250,
  2025: 255,
  2026: 259,
};

/** Jüngstes Jahr, für das ein Satz beschlossen ist. */
export const KINDERGELD_NEUESTES_JAHR = 2026;
const KINDERGELD_AELTESTES_JAHR = 2023;

/**
 * Altersgrenze je Status, § 32 Abs. 4 EStG.
 *
 * Bis 18 ohne Bedingung. Danach nur noch, wenn das Kind eine Ausbildung oder
 * ein Studium absolviert (bis 25) oder ohne Ausbildungsplatz bei der
 * Arbeitsagentur gemeldet ist (bis 21).
 */
export const ALTERSGRENZE: Record<KindStatus, number> = {
  regulaer: 18,
  arbeitsuchend: 21,
  ausbildung: 25,
};

export const statusLabels: Record<KindStatus, string> = {
  regulaer: "Kind oder Schüler (bis 18)",
  ausbildung: "Ausbildung oder Studium (bis 25)",
  arbeitsuchend: "Arbeitsuchend gemeldet (bis 21)",
};

/**
 * Satz für ein Kalenderjahr.
 *
 * Jenseits des bekannten Zeitraums wird der nächstgelegene bekannte Satz
 * genommen und das ausdrücklich gemeldet – ein stillschweigend
 * fortgeschriebener Wert wäre eine Behauptung über eine noch nicht getroffene
 * politische Entscheidung.
 */
export function kindergeldSatz(jahr: number): {
  satz: number;
  extrapoliert: boolean;
} {
  if (!Number.isFinite(jahr)) {
    return {
      satz: KINDERGELD_JE_MONAT[KINDERGELD_NEUESTES_JAHR]!,
      extrapoliert: true,
    };
  }

  const gerundet = Math.round(jahr);
  const bekannt = KINDERGELD_JE_MONAT[gerundet];
  if (bekannt !== undefined) return { satz: bekannt, extrapoliert: false };

  const rand =
    gerundet < KINDERGELD_AELTESTES_JAHR
      ? KINDERGELD_AELTESTES_JAHR
      : KINDERGELD_NEUESTES_JAHR;
  return { satz: KINDERGELD_JE_MONAT[rand]!, extrapoliert: true };
}
