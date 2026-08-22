/**
 * Urteil des Nachwuchs-Wegs: reine Verrechnung von Haushaltsnetto vor der
 * Geburt gegen Elterngeld plus Kindergeld während des Bezugs. Keine eigene
 * Steuer- oder Elterngeldlogik – die kommt aus dem Brutto-Netto-, dem
 * Elterngeld- und dem Kindergeld-Rechner. Dieses Modul bekommt nur die
 * beiden Ergebniszahlen.
 */

/** Ab dieser Ersatzquote gilt der Übergang als komfortabel. */
export const ERSATZQUOTE_KOMFORTABEL = 90;
/** Bis hierhin noch tragbar, aber eng – darunter ist die Lücke deutlich. */
export const ERSATZQUOTE_ENG = 70;

export type NachwuchsEinstufung = "komfortabel" | "tragbar" | "eng";

export interface NachwuchsUrteilInput {
  nettoVorGeburtMonat: number;
  /** Elterngeld plus Kindergeld, zusammen pro Monat während des Bezugs. */
  elterngeldPlusKindergeldMonat: number;
}

export interface NachwuchsUrteil {
  nettoVorGeburtMonat: number;
  elterngeldPlusKindergeldMonat: number;
  /** elterngeldPlusKindergeldMonat − nettoVorGeburtMonat: meist negativ. */
  deltaMonat: number;
  /** null ohne Netto vor der Geburt – dann ist die Quote nicht definiert. */
  ersatzquoteProzent: number | null;
  einstufung: NachwuchsEinstufung;
}

export function bewerteNachwuchs(input: NachwuchsUrteilInput): NachwuchsUrteil {
  const nettoVorGeburtMonat = Math.max(0, input.nettoVorGeburtMonat);
  const elterngeldPlusKindergeldMonat = Math.max(
    0,
    input.elterngeldPlusKindergeldMonat,
  );
  const deltaMonat = elterngeldPlusKindergeldMonat - nettoVorGeburtMonat;
  const ersatzquoteProzent =
    nettoVorGeburtMonat > 0
      ? (elterngeldPlusKindergeldMonat / nettoVorGeburtMonat) * 100
      : null;

  const einstufung: NachwuchsEinstufung =
    ersatzquoteProzent === null || ersatzquoteProzent < ERSATZQUOTE_ENG
      ? "eng"
      : ersatzquoteProzent >= ERSATZQUOTE_KOMFORTABEL
        ? "komfortabel"
        : "tragbar";

  return {
    nettoVorGeburtMonat,
    elterngeldPlusKindergeldMonat,
    deltaMonat,
    ersatzquoteProzent,
    einstufung,
  };
}
