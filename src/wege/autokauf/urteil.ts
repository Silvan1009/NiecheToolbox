/**
 * Urteil des Auto-Wegs: reine Verrechnung von Gesamtkosten und Nettoeinkommen
 * zu einer Einstufung. Keine eigene Kosten- oder Zinslogik – die kommt aus
 * dem Kredit-, dem Autokosten- und dem Brutto-Netto-Rechner. Dieses Modul
 * bekommt nur die beiden Ergebniszahlen.
 */

/** Bis hierhin gilt der Anteil am Netto als komfortabel. */
export const ANTEIL_KOMFORTABEL = 15;
/** Bis hierhin noch tragbar, aber eng – darüber ist der Anteil hoch. */
export const ANTEIL_ENG = 25;

export type AutokaufEinstufung = "komfortabel" | "tragbar" | "eng";

export interface AutokaufUrteilInput {
  /** Kreditrate plus Unterhalt inklusive Versicherung, pro Monat. */
  gesamtkostenMonat: number;
  nettoMonat: number;
}

export interface AutokaufUrteil {
  gesamtkostenMonat: number;
  nettoMonat: number;
  /** null ohne Nettoeinkommen – dann ist der Anteil nicht definiert. */
  anteilProzent: number | null;
  einstufung: AutokaufEinstufung;
}

export function bewerteAutokauf(input: AutokaufUrteilInput): AutokaufUrteil {
  const gesamtkostenMonat = Math.max(0, input.gesamtkostenMonat);
  const nettoMonat = Math.max(0, input.nettoMonat);
  const anteilProzent =
    nettoMonat > 0 ? (gesamtkostenMonat / nettoMonat) * 100 : null;

  const einstufung: AutokaufEinstufung =
    anteilProzent === null || anteilProzent > ANTEIL_ENG
      ? "eng"
      : anteilProzent <= ANTEIL_KOMFORTABEL
        ? "komfortabel"
        : "tragbar";

  return { gesamtkostenMonat, nettoMonat, anteilProzent, einstufung };
}
