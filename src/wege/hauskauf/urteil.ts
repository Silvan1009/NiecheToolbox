/**
 * Hauskauf-Urteil – kombiniert das Ergebnis von Immobilien- und
 * Brutto-Netto-Rechner zu einer Einschätzung. Reine Berechnung, keine
 * React-/Next-Abhängigkeit, wie jede logic.ts im Projekt.
 *
 * Nimmt bewusst nur die vier Zahlen entgegen, die die Einschätzung braucht,
 * nicht die vollständigen ImmobilienResult/BruttoNettoResult – dadurch bleibt
 * diese Datei unabhängig von beiden Tool-logic.ts testbar und importiert
 * keine von beiden.
 */

import { nn } from "@/lib/finanzmath";

export type HauskaufEinstufung = "komfortabel" | "tragbar" | "eng";

export interface HauskaufUrteilInput {
  /** ImmobilienResult.belastungMonat – Rate und Nebenkosten, €/Monat. */
  belastungMonat: number;
  /** BruttoNettoResult.nettoMonat – Haushaltsnetto, €/Monat. */
  nettoMonat: number;
  /** ImmobilienResult.darlehen – ursprüngliche Darlehenssumme, €. */
  darlehen: number;
  /** ImmobilienResult.restschuldZinsbindung – Restschuld zum Ende der Zinsbindung, €. */
  restschuldZinsbindung: number;
}

export interface HauskaufUrteil {
  belastungMonat: number;
  nettoMonat: number;
  /** Anteil des Nettos für Rate und Nebenkosten, in Prozent. Null ohne Nettoeinkommen. */
  belastungsquote: number | null;
  einstufung: HauskaufEinstufung;
  /** Was vom Netto nach der Wohnbelastung bleibt, €/Monat – kann negativ sein. */
  liquiditaetspuffer: number;
  /** Restschuld in Prozent der ursprünglichen Darlehenssumme. Null ohne Darlehen. */
  restschuldQuote: number | null;
  /** Über 70 % der Darlehenssumme sind zum Ende der Zinsbindung noch offen. */
  restschuldRisiko: boolean;
}

/** Unterhalb dieser Quote gilt die Belastung als komfortabel. */
export const BELASTUNGSQUOTE_KOMFORTABEL = 30;
/** Bis einschließlich dieser Quote gilt die Belastung noch als tragbar. */
export const BELASTUNGSQUOTE_ENG = 40;

/**
 * Dieselbe Schwelle wie die Warnung in calculateImmobilie (logic.ts:544:
 * `restschuldZinsbindungC > darlehenC * 0.7`) – bewusst als eigene Konstante
 * dupliziert statt importiert, damit urteil.ts frei von Tool-logic.ts-Importen
 * bleibt. Bei einer Änderung dort diese Zahl nachziehen.
 */
export const RESTSCHULD_RISIKO_ANTEIL = 70;

export const einstufungLabel: Record<HauskaufEinstufung, string> = {
  komfortabel: "komfortabel",
  tragbar: "tragbar",
  eng: "eng",
};

export function bewerteHauskauf(input: HauskaufUrteilInput): HauskaufUrteil {
  const belastungMonat = nn(input.belastungMonat);
  const nettoMonat = nn(input.nettoMonat);
  const darlehen = nn(input.darlehen);
  const restschuldZinsbindung = nn(input.restschuldZinsbindung);

  const belastungsquote =
    nettoMonat > 0 ? (belastungMonat / nettoMonat) * 100 : null;

  const einstufung: HauskaufEinstufung =
    belastungsquote === null
      ? "eng"
      : belastungsquote < BELASTUNGSQUOTE_KOMFORTABEL
        ? "komfortabel"
        : belastungsquote <= BELASTUNGSQUOTE_ENG
          ? "tragbar"
          : "eng";

  const restschuldQuote =
    darlehen > 0 ? (restschuldZinsbindung / darlehen) * 100 : null;

  return {
    belastungMonat,
    nettoMonat,
    belastungsquote,
    einstufung,
    liquiditaetspuffer: nettoMonat - belastungMonat,
    restschuldQuote,
    restschuldRisiko:
      restschuldQuote !== null && restschuldQuote > RESTSCHULD_RISIKO_ANTEIL,
  };
}
