/**
 * Rentenabschlags-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Die Regelaltersgrenze ist kein rundes Alter mehr, seit sie zwischen den
 * Geburtsjahrgängen 1947 und 1964 schrittweise von 65 auf 67 Jahre angehoben
 * wurde – "mit 67 in Rente" gilt nur für 1964 und später Geborene. Für jeden
 * Jahrgang dazwischen gibt es eine eigene, monatsgenaue Grenze (§ 235 SGB VI),
 * und genau diese Grenze zählt für den Abschlag, nicht ein pauschales Alter.
 *
 * Der Abschlag selbst ist einfache Mathematik – 0,3 Prozent je Monat vor der
 * persönlichen Regelaltersgrenze (§ 77 Abs. 2 SGB VI) –, aber er wirkt
 * lebenslang auf jede einzelne Rentenzahlung, nicht nur einmalig. Deshalb
 * zeigt dieser Rechner neben dem Prozentsatz auch den kumulierten Effekt über
 * eine angenommene Rentenbezugsdauer.
 *
 * Gerechnet wird in ganzen Cent.
 */

import { cents, clamp, nn, toEuro } from "@/lib/finanzmath";
import { formatInteger } from "@/lib/format";

const ABSCHLAG_PRO_MONAT = 0.3;
const ZUSCHLAG_PRO_MONAT = 0.5;
/** § 77 Abs. 2 Satz 1 Nr. 2 SGB VI i. V. m. § 236 SGB VI: höchstens 48 Monate, also 14,4 Prozent. */
const MAX_ABSCHLAG_MONATE = 48;

interface Altersgrenze {
  jahre: number;
  monate: number;
}

/**
 * § 235 Abs. 2 SGB VI. 1947–1958: +1 Monat je Jahrgang bis 66 Jahre.
 * 1959–1964: +2 Monate je Jahrgang bis 67 Jahre. Davor 65, danach 67.
 */
function regelaltersgrenze(geburtsjahr: number): Altersgrenze {
  if (geburtsjahr <= 1946) return { jahre: 65, monate: 0 };
  if (geburtsjahr >= 1964) return { jahre: 67, monate: 0 };
  if (geburtsjahr <= 1958) {
    const monate = geburtsjahr - 1947 + 1;
    return monate >= 12 ? { jahre: 66, monate: monate - 12 } : { jahre: 65, monate };
  }
  // 1959–1963: von 66+2 bis 66+10, danach 67+0 ab 1964.
  const monate = (geburtsjahr - 1958) * 2;
  return { jahre: 66, monate };
}

export interface RentenabschlagInput {
  geburtsjahr: number;
  geplantesAlterJahre: number;
  geplantesAlterMonate: number;
  /** Erwartete monatliche Bruttorente bei Renteneintritt zur Regelaltersgrenze, aus der Renteninformation. */
  erwarteteRegelrente: number;
  /** Für den kumulierten Effekt über die Rentenbezugsdauer. */
  lebenserwartung: number;
}

export interface RentenabschlagResult {
  regelaltersgrenzeJahre: number;
  regelaltersgrenzeMonate: number;
  /** Negativ = früherer Renteneintritt, positiv = späterer. */
  differenzMonate: number;
  abschlagProzent: number;
  zuschlagProzent: number;
  renteMitAnpassung: number;
  /** Differenz zur Regelrente – negativ bei Abschlag, positiv bei Zuschlag. */
  differenzMonatlich: number;
  jahreRentenbezug: number;
  /** Kumulierter Effekt über die gesamte Rentenbezugsdauer – negativ bei Abschlag. */
  kumulierterEffekt: number;
  warnings: string[];
}

export function calculateRentenabschlag(input: RentenabschlagInput): RentenabschlagResult {
  const geburtsjahr = Math.round(clamp(input.geburtsjahr, 1940, 2010));
  const regel = regelaltersgrenze(geburtsjahr);
  const regelMonateGesamt = regel.jahre * 12 + regel.monate;

  const geplantesAlterJahre = Math.round(clamp(input.geplantesAlterJahre, 60, 75));
  const geplantesAlterMonate = Math.round(clamp(input.geplantesAlterMonate, 0, 11));
  const geplantMonateGesamt = geplantesAlterJahre * 12 + geplantesAlterMonate;

  const differenzMonate = geplantMonateGesamt - regelMonateGesamt;

  const abschlagMonate = Math.min(Math.max(0, -differenzMonate), MAX_ABSCHLAG_MONATE);
  const zuschlagMonate = Math.max(0, differenzMonate);

  const abschlagProzent = abschlagMonate * ABSCHLAG_PRO_MONAT;
  const zuschlagProzent = zuschlagMonate * ZUSCHLAG_PRO_MONAT;

  const regelrenteC = cents(nn(input.erwarteteRegelrente));
  const zugangsfaktor = 1 + (zuschlagProzent - abschlagProzent) / 100;
  const renteMitAnpassungC = Math.round(regelrenteC * zugangsfaktor);

  const differenzMonatlichC = renteMitAnpassungC - regelrenteC;

  const lebenserwartung = Math.round(clamp(input.lebenserwartung, geplantesAlterJahre + 1, 110));
  const jahreRentenbezug = Math.max(0, lebenserwartung - geplantesAlterJahre);
  const kumulierterEffektC = differenzMonatlichC * 12 * jahreRentenbezug;

  const warnings: string[] = [];

  if (abschlagMonate > 0 && -differenzMonate > MAX_ABSCHLAG_MONATE) {
    warnings.push(
      `Der Abschlag ist gesetzlich auf 14,4 Prozent gedeckelt (48 Monate). Ein noch früherer Renteneintritt würde daran nichts mehr ändern – er ist für die Altersrente für langjährig Versicherte ohnehin frühestens mit 63 Jahren möglich.`,
    );
  }

  if (abschlagProzent > 0) {
    warnings.push(
      `Der Abschlag gilt lebenslang für jede einzelne Rentenzahlung, nicht nur übergangsweise – bei ${jahreRentenbezug} Jahren angenommener Rentenbezugsdauer summiert er sich auf ${formatInteger(toEuro(Math.abs(kumulierterEffektC)))} €.`,
    );
  }

  if (zuschlagProzent > 0) {
    warnings.push(
      "Für den Zuschlag gibt es keine gesetzliche Obergrenze – wer deutlich über die Regelaltersgrenze hinaus arbeitet, erhöht die Rente entsprechend weiter.",
    );
  }

  if (abschlagProzent === 0 && zuschlagProzent === 0) {
    warnings.push(
      "Bei Renteneintritt genau zur Regelaltersgrenze gibt es weder Abschlag noch Zuschlag – die volle berechnete Rente wird ausgezahlt.",
    );
  }

  return {
    regelaltersgrenzeJahre: regel.jahre,
    regelaltersgrenzeMonate: regel.monate,
    differenzMonate,
    abschlagProzent,
    zuschlagProzent,
    renteMitAnpassung: toEuro(renteMitAnpassungC),
    differenzMonatlich: toEuro(differenzMonatlichC),
    jahreRentenbezug,
    kumulierterEffekt: toEuro(kumulierterEffektC),
    warnings,
  };
}

export function defaultInput(): RentenabschlagInput {
  return {
    geburtsjahr: 1985,
    geplantesAlterJahre: 63,
    geplantesAlterMonate: 0,
    erwarteteRegelrente: 1_600,
    lebenserwartung: 85,
  };
}
