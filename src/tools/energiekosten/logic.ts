/**
 * Energiekosten eines Haushalts – die Jahresrechnung, nicht das einzelne Gerät.
 *
 * Der Stromkosten-Rechner nebenan beantwortet "was kostet mein Trockner".
 * Hier geht es um die andere Frage, die einmal im Jahr per Post kommt: was
 * kostet der Haushalt insgesamt, und stimmt der Abschlag, den ich zahle?
 *
 * Drei Dinge machen den Unterschied zu einer Multiplikation auf dem Handy:
 *
 *   Der Grundpreis. Er ist verbrauchsunabhängig und entscheidet bei kleinen
 *   Haushalten über den günstigeren Tarif. Ein Vergleich allein über den
 *   Arbeitspreis geht deshalb regelmäßig nach hinten los – dafür gibt es hier
 *   den Effektivpreis, der beides zusammenrechnet.
 *
 *   Der Abschlag. Er ist eine Schätzung des Versorgers, nicht die Rechnung.
 *   Die Differenz ist die Zahl, die Leute wirklich suchen: Nachzahlung oder
 *   Guthaben.
 *
 *   Der Vergleichsverbrauch. Wer nicht weiß, ob 4.800 kWh viel sind, kann mit
 *   seiner Rechnung nichts anfangen. Deshalb steht neben dem eingetragenen
 *   Verbrauch immer ein Erwartungswert für diesen Haushalt.
 *
 * Gerechnet wird in ganzen Cent. Das trifft sich hier gut: Arbeitspreise
 * stehen ohnehin in Cent je Kilowattstunde auf der Rechnung.
 */

import { MONATE_PRO_JAHR, cents, clamp, nn } from "@/lib/finanzmath";
import { CO2_G_PER_KWH } from "@/tools/stromkosten/logic";

export type Energieart = "strom" | "gas";
export type Modus = "strom" | "gas" | "beide";
export type Gebaeudestandard =
  | "unsaniert"
  | "teilsaniert"
  | "saniert"
  | "neubau";

/**
 * CO₂ je Kilowattstunde Erdgas, in Gramm.
 *
 * Deutlich niedriger als beim Strommix (dort 380, siehe stromkosten/logic.ts),
 * weil bei Gas nur die Verbrennung zählt und kein Kraftwerkswirkungsgrad
 * dazwischensteht. Anders als der Strommix sinkt dieser Wert nicht von Jahr zu
 * Jahr – er ist Chemie, keine Statistik.
 */
export const CO2_G_PER_KWH_GAS = 201;

/**
 * Heizenergiebedarf je Quadratmeter und Jahr, in Kilowattstunden.
 *
 * Größenordnungen aus den Effizienzklassen des Energieausweises. Sie taugen
 * als Erwartungswert, nicht als Nachweis: Lage, Bewohnerzahl und
 * Heizgewohnheiten streuen erheblich.
 */
export const KWH_PRO_QM: Record<Gebaeudestandard, number> = {
  unsaniert: 200,
  teilsaniert: 150,
  saniert: 100,
  neubau: 60,
};

export const gebaeudestandardLabels: Record<Gebaeudestandard, string> = {
  unsaniert: "Unsaniert (Baujahr vor 1979)",
  teilsaniert: "Teilsaniert (neue Fenster oder Dach)",
  saniert: "Saniert (Dämmung und Fenster)",
  neubau: "Neubau oder KfW-Standard",
};

export const energieartLabels: Record<Energieart, string> = {
  strom: "Strom",
  gas: "Gas",
};

export interface TarifInput {
  /** Jahresverbrauch in kWh – die Zahl von der Jahresabrechnung. */
  verbrauchKwh: number;
  /** Arbeitspreis in ct/kWh. */
  arbeitspreisCt: number;
  /** Grundpreis in € pro Monat. */
  grundpreisMonat: number;
  /** Aktueller Abschlag in € pro Monat. 0 heißt: kein Abschlag bekannt. */
  abschlagMonat: number;
  /** Arbeitspreis eines Vergleichstarifs; 0 schaltet den Vergleich ab. */
  neuArbeitspreisCt: number;
  neuGrundpreisMonat: number;
}

export interface EnergieInput {
  modus: Modus;
  /** Personen im Haushalt – nur für den Stromvergleichswert. */
  personen: number;
  /** Wohnfläche in m² – nur für den Gasvergleichswert. */
  wohnflaecheM2: number;
  standard: Gebaeudestandard;
  /** Warmwasser über Strom statt über die Heizung (Durchlauferhitzer). */
  warmwasserElektrisch: boolean;
  strom: TarifInput;
  gas: TarifInput;
}

export interface EnergieSparte {
  art: Energieart;
  verbrauchKwh: number;
  arbeitskostenC: number;
  grundkostenC: number;
  jahreskostenC: number;
  monatskostenC: number;
  abschlagJahrC: number;
  /** Über null: Nachzahlung. Unter null: Guthaben. */
  differenzC: number;
  /**
   * Mischpreis aus Arbeits- und Grundpreis, in ct/kWh.
   * `null` ohne Verbrauch – dann gibt es keinen Preis je Einheit.
   */
  effektivpreisCt: number | null;
  /** Jahreskosten des Vergleichstarifs; `null` ohne Vergleich. */
  neuJahreskostenC: number | null;
  /** Positiv heißt: der Vergleichstarif ist günstiger. */
  ersparnisJahrC: number | null;
  /** Erwartungswert für diesen Haushalt, in kWh. */
  vergleichKwh: number;
  co2KgPerYear: number;
}

export interface EnergieResult {
  sparten: EnergieSparte[];
  jahreskostenC: number;
  monatskostenC: number;
  abschlagJahrC: number;
  differenzC: number;
  ersparnisJahrC: number | null;
  co2KgPerYear: number;
  warnings: string[];
}

/**
 * Stromverbrauch, den ein Haushalt dieser Größe üblicherweise hat.
 *
 * Der erste Kopf kostet am meisten: Kühlschrank, Router und Licht laufen
 * unabhängig von der Personenzahl. Jede weitere Person schlägt deshalb mit
 * weniger zu Buche als die erste.
 */
export function schaetzeStromverbrauch(
  personen: number,
  warmwasserElektrisch: boolean,
): number {
  const koepfe = clamp(Math.round(personen), 1, 12);
  const grundlast = 1500 + 900 * (koepfe - 1);
  // Ein Durchlauferhitzer ist der teuerste Einzelposten im Strompreis.
  return grundlast + (warmwasserElektrisch ? 550 * koepfe : 0);
}

/** Gasverbrauch nach Wohnfläche und Dämmzustand. */
export function schaetzeGasverbrauch(
  wohnflaecheM2: number,
  standard: Gebaeudestandard,
): number {
  const flaeche = clamp(Math.round(wohnflaecheM2), 10, 1000);
  return flaeche * KWH_PRO_QM[standard];
}

function berechneSparte(
  art: Energieart,
  tarif: TarifInput,
  vergleichKwh: number,
): EnergieSparte {
  const verbrauchKwh = nn(tarif.verbrauchKwh);
  const arbeitspreisCt = nn(tarif.arbeitspreisCt);

  // ct/kWh mal kWh ergibt Cent. Keine Abkürzung, sondern Einheiten-Identität –
  // deshalb braucht es hier keine Umrechnung über Euro und zurück.
  const arbeitskostenC = Math.round(verbrauchKwh * arbeitspreisCt);
  const grundkostenC = cents(nn(tarif.grundpreisMonat)) * MONATE_PRO_JAHR;
  const jahreskostenC = arbeitskostenC + grundkostenC;
  const abschlagJahrC = cents(nn(tarif.abschlagMonat)) * MONATE_PRO_JAHR;

  const neuArbeitspreisCt = nn(tarif.neuArbeitspreisCt);
  // Ein Vergleich ohne Arbeitspreis wäre keiner: der Grundpreis allein sagt
  // nichts über den Tarif.
  const hatVergleich = neuArbeitspreisCt > 0;
  const neuJahreskostenC = hatVergleich
    ? Math.round(verbrauchKwh * neuArbeitspreisCt) +
      cents(nn(tarif.neuGrundpreisMonat)) * MONATE_PRO_JAHR
    : null;

  const co2Faktor = art === "strom" ? CO2_G_PER_KWH : CO2_G_PER_KWH_GAS;

  return {
    art,
    verbrauchKwh,
    arbeitskostenC,
    grundkostenC,
    jahreskostenC,
    monatskostenC: Math.round(jahreskostenC / MONATE_PRO_JAHR),
    abschlagJahrC,
    differenzC: jahreskostenC - abschlagJahrC,
    effektivpreisCt: verbrauchKwh > 0 ? jahreskostenC / verbrauchKwh : null,
    neuJahreskostenC,
    ersparnisJahrC:
      neuJahreskostenC === null ? null : jahreskostenC - neuJahreskostenC,
    vergleichKwh,
    co2KgPerYear: (verbrauchKwh * co2Faktor) / 1000,
  };
}

/** Marktnahe Obergrenze je Sparte, in ct/kWh – darüber lohnt ein Wechsel. */
const PREIS_AUFFAELLIG_CT: Record<Energieart, number> = { strom: 45, gas: 16 };

export function calculateEnergie(input: EnergieInput): EnergieResult {
  const stromVergleich = schaetzeStromverbrauch(
    input.personen,
    input.warmwasserElektrisch,
  );
  const gasVergleich = schaetzeGasverbrauch(input.wohnflaecheM2, input.standard);

  const alle: Record<Energieart, EnergieSparte> = {
    strom: berechneSparte("strom", input.strom, stromVergleich),
    gas: berechneSparte("gas", input.gas, gasVergleich),
  };

  const sparten: EnergieSparte[] =
    input.modus === "beide" ? [alle.strom, alle.gas] : [alle[input.modus]];

  const summe = (pick: (s: EnergieSparte) => number) =>
    sparten.reduce((total, sparte) => total + pick(sparte), 0);

  const jahreskostenC = summe((s) => s.jahreskostenC);
  const abschlagJahrC = summe((s) => s.abschlagJahrC);

  // Nur summieren, wenn wenigstens eine Sparte einen Vergleich hat – sonst
  // wäre "0 Euro Ersparnis" eine Aussage, die niemand getroffen hat.
  const mitVergleich = sparten.filter((s) => s.ersparnisJahrC !== null);
  const ersparnisJahrC =
    mitVergleich.length > 0
      ? mitVergleich.reduce((total, s) => total + (s.ersparnisJahrC ?? 0), 0)
      : null;

  const warnings: string[] = [];

  for (const sparte of sparten) {
    const name = energieartLabels[sparte.art];

    if (sparte.verbrauchKwh === 0) {
      warnings.push(
        `Ohne Jahresverbrauch für ${name} bleibt nur der Grundpreis stehen. Die Zahl steht auf der letzten Jahresabrechnung.`,
      );
      continue;
    }

    if (sparte.abschlagJahrC > 0) {
      const deckung = sparte.abschlagJahrC / sparte.jahreskostenC;
      if (deckung < 0.85) {
        warnings.push(
          `Der ${name}-Abschlag deckt die Jahreskosten nicht – auf diese Rechnung folgt eine Nachzahlung.`,
        );
      } else if (deckung > 1.15) {
        warnings.push(
          `Du zahlst bei ${name} deutlich mehr Abschlag als nötig und finanzierst damit deinen Versorger vor. Eine Senkung lässt sich jederzeit verlangen.`,
        );
      }
    }

    if (nn(sparte.arbeitskostenC) > 0) {
      const preis = nn(input[sparte.art].arbeitspreisCt);
      if (preis > PREIS_AUFFAELLIG_CT[sparte.art]) {
        warnings.push(
          `${preis.toString().replace(".", ",")} ct/kWh liegt bei ${name} über dem, was Neukundentarife derzeit verlangen. Ein Wechsel ist hier der größte Hebel.`,
        );
      }
    }

    if (sparte.verbrauchKwh > sparte.vergleichKwh * 1.5) {
      warnings.push(
        `Der ${name}-Verbrauch liegt weit über dem, was für diesen Haushalt zu erwarten wäre. Bei Strom lohnt der Blick auf alte Geräte und Dauerläufer, bei Gas auf Heizungseinstellung und Dämmung.`,
      );
    }
  }

  return {
    sparten,
    jahreskostenC,
    monatskostenC: Math.round(jahreskostenC / MONATE_PRO_JAHR),
    abschlagJahrC,
    differenzC: jahreskostenC - abschlagJahrC,
    ersparnisJahrC,
    co2KgPerYear: summe((s) => s.co2KgPerYear),
    warnings,
  };
}

/**
 * Voreinstellung: Zwei-Personen-Haushalt mit Gasheizung, Preise auf dem
 * Niveau, das Ende 2025 in Neuverträgen üblich war.
 */
export function defaultInput(): EnergieInput {
  return {
    modus: "beide",
    personen: 2,
    wohnflaecheM2: 90,
    standard: "teilsaniert",
    warmwasserElektrisch: false,
    strom: {
      verbrauchKwh: 2400,
      arbeitspreisCt: 35,
      grundpreisMonat: 12,
      abschlagMonat: 80,
      neuArbeitspreisCt: 0,
      neuGrundpreisMonat: 0,
    },
    gas: {
      verbrauchKwh: 13500,
      arbeitspreisCt: 11,
      grundpreisMonat: 13,
      abschlagMonat: 145,
      neuArbeitspreisCt: 0,
      neuGrundpreisMonat: 0,
    },
  };
}
