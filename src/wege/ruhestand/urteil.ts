/**
 * Urteil des Ruhestands-Wegs: reine Verrechnung von Kapitalbedarf und
 * projiziertem Kapital zu einem Fehlbetrag oder Überschuss. Keine eigene
 * Renten- oder Zinslogik – die kommt aus dem Rentenabschlags-, dem
 * Rentenlücken- und dem Sparplan-Rechner. Dieses Modul bekommt nur die
 * beiden Ergebniszahlen.
 */

export interface RuhestandUrteilInput {
  kapitalbedarf: number;
  projiziertesKapital: number;
}

export interface RuhestandUrteil {
  kapitalbedarf: number;
  projiziertesKapital: number;
  /** projiziertesKapital − kapitalbedarf: negativ = Fehlbetrag, positiv = Überschuss. */
  differenz: number;
  gedeckt: boolean;
}

export function bewerteRuhestand(input: RuhestandUrteilInput): RuhestandUrteil {
  const kapitalbedarf = Math.max(0, input.kapitalbedarf);
  const projiziertesKapital = Math.max(0, input.projiziertesKapital);
  const differenz = projiziertesKapital - kapitalbedarf;

  return {
    kapitalbedarf,
    projiziertesKapital,
    differenz,
    gedeckt: differenz >= 0,
  };
}
