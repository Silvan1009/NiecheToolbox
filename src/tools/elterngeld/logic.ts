/**
 * Elterngeld-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Die Ersatzrate ist der Teil, der die meisten Überschlagsrechnungen falsch
 * macht: "67 Prozent vom Netto" stimmt nur für ein Einkommen zwischen 1.000
 * und 1.200 Euro. Darunter steigt die Rate über die Geringverdienerregelung
 * (§ 2 Abs. 2 BEEG) bis auf 100 Prozent, darüber sinkt sie bis auf 65 Prozent
 * – wer 2.500 Euro netto verdient hat, bekommt also 65 und nicht 67 Prozent.
 * Dieser Rechner bildet die Staffel exakt ab, statt mit einem festen Satz zu
 * multiplizieren.
 *
 * Modelliert wird der Normalfall ohne Erwerbstätigkeit während des Bezugs.
 * Wer während ElterngeldPlus in Teilzeit arbeitet, wird günstiger angerechnet
 * als bei Basiselterngeld – das kann die Plus-Variante in der Praxis über die
 * gesamte Bezugszeit sogar mehr Geld bringen, obwohl hier rechnerisch beide
 * Varianten in Summe gleich viel auszahlen. Siehe FAQ.
 *
 * Gerechnet wird in ganzen Cent.
 */

import { cents, clamp, nn, toEuro } from "@/lib/finanzmath";

const MINDESTBETRAG = 300;
const HOECHSTBETRAG = 1_800;
/** Ab diesem Nettoeinkommen greift die Geringverdienerregelung nicht mehr voll. */
const GERINGVERDIENER_GRENZE = 1_000;
const HOEHERVERDIENER_GRENZE = 1_200;

export type ElterngeldModus = "basis" | "plus";

export interface ElterngeldInput {
  nettoEinkommenVorGeburt: number;
  /** § 2a BEEG: weiteres Kind unter 3 oder zwei weitere Kinder unter 6 im Haushalt. */
  geschwisterbonus: boolean;
  /** Zusätzliche Kinder bei einer Mehrlingsgeburt (0 = Einzelkind). */
  mehrlingsKinder: number;
  modus: ElterngeldModus;
  /** Basiselterngeld-Monate, auf die sich der Anspruch bezieht (1–14). */
  bezugsmonate: number;
}

export interface ElterngeldResult {
  ersatzrate: number;
  basisbetragMonat: number;
  geschwisterbonusMonat: number;
  mehrlingszuschlagMonat: number;
  /** Voller Monatsbetrag inkl. Boni – die Basis für beide Modi. */
  vollerMonatsbetrag: number;
  monatsbetragBasis: number;
  monatsbetragPlus: number;
  ausgezahlterMonatsbetrag: number;
  bezugsmonateEffektiv: number;
  gesamtbetrag: number;
  warnings: string[];
}

/**
 * § 2 Abs. 2 BEEG. Zwischen 1.000 und 1.200 Euro bleibt es bei 67 Prozent;
 * außerhalb dieses Korridors verschiebt sich die Rate um 0,1 Punkte je 2 Euro
 * Differenz, gedeckelt bei 100 bzw. 65 Prozent.
 */
function ersatzrate(nettoEinkommen: number): number {
  if (nettoEinkommen < GERINGVERDIENER_GRENZE) {
    const rate = 67 + (GERINGVERDIENER_GRENZE - nettoEinkommen) * 0.05;
    return clamp(rate, 67, 100);
  }
  if (nettoEinkommen > HOEHERVERDIENER_GRENZE) {
    const rate = 67 - (nettoEinkommen - HOEHERVERDIENER_GRENZE) * 0.05;
    return clamp(rate, 65, 67);
  }
  return 67;
}

export function calculateElterngeld(input: ElterngeldInput): ElterngeldResult {
  const nettoEinkommen = nn(input.nettoEinkommenVorGeburt);
  const rate = nettoEinkommen > 0 ? ersatzrate(nettoEinkommen) : 0;

  const basisbetragC = clamp(
    Math.round(cents(nettoEinkommen) * (rate / 100)),
    cents(MINDESTBETRAG),
    cents(HOECHSTBETRAG),
  );

  const geschwisterbonusC = input.geschwisterbonus
    ? Math.max(Math.round(basisbetragC * 0.1), cents(75))
    : 0;

  const mehrlingsKinder = Math.round(clamp(nn(input.mehrlingsKinder), 0, 10));
  const mehrlingszuschlagC = mehrlingsKinder * cents(300);

  const vollerMonatsbetragC = basisbetragC + geschwisterbonusC + mehrlingszuschlagC;
  const plusMonatsbetragC = Math.round(vollerMonatsbetragC / 2);

  const bezugsmonate = Math.round(clamp(input.bezugsmonate, 1, 14));
  const istPlus = input.modus === "plus";

  const ausgezahlterMonatsbetragC = istPlus ? plusMonatsbetragC : vollerMonatsbetragC;
  const bezugsmonateEffektiv = istPlus ? bezugsmonate * 2 : bezugsmonate;
  const gesamtbetragC = ausgezahlterMonatsbetragC * bezugsmonateEffektiv;

  const warnings: string[] = [];

  if (nettoEinkommen <= 0) {
    warnings.push(
      `Ohne Erwerbseinkommen vor der Geburt gibt es den Mindestbetrag von ${MINDESTBETRAG} € im Monat – das gilt zum Beispiel für Studierende oder zuvor nicht erwerbstätige Elternteile.`,
    );
  } else if (rate === 100) {
    warnings.push(
      "Bei einem Nettoeinkommen von 340 € oder weniger greift die Geringverdienerregelung in voller Höhe: Die Ersatzrate liegt bei 100 Prozent.",
    );
  } else if (rate === 65) {
    warnings.push(
      "Ab einem Nettoeinkommen von 1.240 € oder mehr sinkt die Ersatzrate nicht weiter – sie bleibt bei 65 Prozent, auch bei deutlich höherem Einkommen.",
    );
  }

  if (basisbetragC === cents(HOECHSTBETRAG) && nettoEinkommen > 0) {
    warnings.push(
      `Der Höchstbetrag von ${HOECHSTBETRAG} € im Monat ist erreicht – ein noch höheres Einkommen vor der Geburt würde am Elterngeld nichts mehr ändern.`,
    );
  }

  if (bezugsmonate > 12) {
    warnings.push(
      "Mehr als 12 Basismonate stehen nur zu, wenn der andere Elternteil mindestens 2 Partnermonate nimmt, oder bei Alleinerziehenden mit alleinigem Sorgerecht.",
    );
  }

  return {
    ersatzrate: rate,
    basisbetragMonat: toEuro(basisbetragC),
    geschwisterbonusMonat: toEuro(geschwisterbonusC),
    mehrlingszuschlagMonat: toEuro(mehrlingszuschlagC),
    vollerMonatsbetrag: toEuro(vollerMonatsbetragC),
    monatsbetragBasis: toEuro(vollerMonatsbetragC),
    monatsbetragPlus: toEuro(plusMonatsbetragC),
    ausgezahlterMonatsbetrag: toEuro(ausgezahlterMonatsbetragC),
    bezugsmonateEffektiv,
    gesamtbetrag: toEuro(gesamtbetragC),
    warnings,
  };
}

export function defaultInput(): ElterngeldInput {
  return {
    nettoEinkommenVorGeburt: 2_200,
    geschwisterbonus: false,
    mehrlingsKinder: 0,
    modus: "basis",
    bezugsmonate: 12,
  };
}
