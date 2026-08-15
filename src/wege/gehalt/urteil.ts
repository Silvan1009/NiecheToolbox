/**
 * Urteil des Gehaltserhöhungs-Wegs: reine Verrechnung von Brutto-Plus und
 * Netto-Plus zu einer Grenzbelastung. Keine eigene Steuerlogik – die kommt
 * aus dem Brutto-Netto-Rechner, zweimal gerechnet: mit dem aktuellen und mit
 * dem erhöhten Bruttolohn. Dieses Modul bekommt nur die beiden Ergebniszahlen.
 */

/** Standard-Anlagehorizont für die Sparplan-Projektion im dritten Schritt. */
export const SPARHORIZONT_JAHRE_STANDARD = 20;

export interface GehaltUrteilInput {
  bruttoPlusMonat: number;
  nettoPlusMonat: number;
}

export interface GehaltUrteil {
  bruttoPlusMonat: number;
  nettoPlusMonat: number;
  /**
   * Anteil der Erhöhung, der an Steuer und Sozialabgaben geht. `null` ohne
   * Brutto-Plus – dann ist der Anteil nicht definiert, nicht 0.
   */
  grenzbelastungProzent: number | null;
}

export function bewerteGehalt(input: GehaltUrteilInput): GehaltUrteil {
  const bruttoPlusMonat = Math.max(0, input.bruttoPlusMonat);
  const nettoPlusMonat = input.nettoPlusMonat;

  const grenzbelastungProzent =
    bruttoPlusMonat > 0 ? 100 - (nettoPlusMonat / bruttoPlusMonat) * 100 : null;

  return { bruttoPlusMonat, nettoPlusMonat, grenzbelastungProzent };
}
