/**
 * Erbschaft- und Schenkungsteuer-Rechner – reine Berechnung, keine React-Abhängigkeiten.
 *
 * Anders als beim Kredit- oder Sparplan-Rechner steht hinter jeder Zahl hier
 * eine konkrete Gesetzesnorm, kein Marktdurchschnitt und kein Modell – die
 * Erbschaftsteuer ist auf den Cent genau festgelegt (§§ 10, 14–19 ErbStG).
 * Drei Details entscheiden dabei über einen fünf- bis sechsstelligen Betrag
 * und werden in den meisten Überschlagsrechnungen übersehen:
 *
 *   Eltern und Großeltern wechseln je nach Anlass die Steuerklasse. Bei einer
 *   Erbschaft gehören sie zur Steuerklasse I (100.000 € Freibetrag), bei einer
 *   Schenkung zu Lebzeiten zur Steuerklasse II (20.000 €) – §§ 15, 16 ErbStG.
 *
 *   Der Stufentarif nach § 19 Abs. 1 ErbStG wendet einen einzigen Steuersatz
 *   auf den gesamten steuerpflichtigen Erwerb an, nicht wie bei der
 *   Einkommensteuer nur auf den Teil oberhalb der Grenze. Ohne Korrektur
 *   könnte ein Euro mehr Erbe mehrere Tausend Euro mehr Steuer auslösen und
 *   den Erben ärmer machen als ohne den zusätzlichen Euro. Genau das
 *   verhindert der Härteausgleich nach § 19 Abs. 3 ErbStG.
 *
 *   Freibeträge lassen sich alle zehn Jahre erneut nutzen (§ 14 ErbStG) – wer
 *   schon einmal geschenkt hat, muss diesen Betrag hier angeben, sonst
 *   rechnet der Rechner mit einem zu hohen verbleibenden Freibetrag.
 *
 * Keine Steuerberatung: Versorgungsfreibeträge, die Steuerbefreiung fürs
 * selbst genutzte Familienheim, Verschonungsregeln für Betriebsvermögen und
 * die genaue Zusammenrechnung mehrerer Vorerwerbe bleiben außen vor, weil sie
 * stark vom Einzelfall abhängen.
 */

import { clamp, nn } from "@/lib/finanzmath";

export type ErbschaftModus = "erbschaft" | "schenkung";

export type Verwandtschaft =
  | "ehepartner"
  | "kind"
  | "enkelKindVerstorben"
  | "enkel"
  | "elternGrosseltern"
  | "geschwisterNeffenNichten"
  | "stiefSchwiegerGeschieden"
  | "sonstige";

export const verwandtschaftLabels: Record<Verwandtschaft, string> = {
  ehepartner: "Ehepartner / eingetragene:r Lebenspartner:in",
  kind: "Kind, Stiefkind, Adoptivkind",
  enkelKindVerstorben: "Enkel, dessen Elternteil (Ihr Kind) bereits verstorben ist",
  enkel: "Enkel (Elternteil noch lebend)",
  elternGrosseltern: "Eltern, Großeltern",
  geschwisterNeffenNichten: "Geschwister, Nichten, Neffen",
  stiefSchwiegerGeschieden: "Stiefeltern, Schwiegerkinder, Schwiegereltern, geschiedene:r Ehepartner:in",
  sonstige: "Alle übrigen (Freunde, nichteheliche Partnerschaft, entfernte Verwandte)",
};

interface VerwandtschaftRegel {
  steuerklasse: 1 | 2 | 3;
  freibetrag: number;
}

/**
 * §§ 15, 16 ErbStG. Eltern und Großeltern sind der einzige Fall, in dem der
 * Anlass (Tod oder Schenkung) die Steuerklasse selbst verändert – bei allen
 * anderen Verwandtschaftsgraden bleiben Klasse und Freibetrag gleich.
 */
function verwandtschaftRegel(
  verwandtschaft: Verwandtschaft,
  modus: ErbschaftModus,
): VerwandtschaftRegel {
  switch (verwandtschaft) {
    case "ehepartner":
      return { steuerklasse: 1, freibetrag: 500_000 };
    case "kind":
      return { steuerklasse: 1, freibetrag: 400_000 };
    case "enkelKindVerstorben":
      return { steuerklasse: 1, freibetrag: 400_000 };
    case "enkel":
      return { steuerklasse: 1, freibetrag: 200_000 };
    case "elternGrosseltern":
      return modus === "erbschaft"
        ? { steuerklasse: 1, freibetrag: 100_000 }
        : { steuerklasse: 2, freibetrag: 20_000 };
    case "geschwisterNeffenNichten":
      return { steuerklasse: 2, freibetrag: 20_000 };
    case "stiefSchwiegerGeschieden":
      return { steuerklasse: 2, freibetrag: 20_000 };
    case "sonstige":
      return { steuerklasse: 3, freibetrag: 20_000 };
  }
}

/** § 10 Abs. 5 Nr. 3 ErbStG, seit 1.1.2025. Nur bei Erbschaft, ohne Nachweis. */
const ERBFALLKOSTENPAUSCHALE = 15_000;

/** § 19 Abs. 1 ErbStG. Jede Zeile gilt "bis einschließlich" für den ganzen Erwerb, kein Grenzsteuersatz. */
interface Stufe {
  bis: number;
  satzI: number;
  satzII: number;
  satzIII: number;
}

const STUFEN: Stufe[] = [
  { bis: 75_000, satzI: 7, satzII: 15, satzIII: 30 },
  { bis: 300_000, satzI: 11, satzII: 20, satzIII: 30 },
  { bis: 600_000, satzI: 15, satzII: 25, satzIII: 30 },
  { bis: 6_000_000, satzI: 19, satzII: 30, satzIII: 30 },
  { bis: 13_000_000, satzI: 23, satzII: 35, satzIII: 50 },
  { bis: 26_000_000, satzI: 27, satzII: 40, satzIII: 50 },
  { bis: Infinity, satzI: 30, satzII: 43, satzIII: 50 },
];

function satzFuerKlasse(stufe: Stufe, klasse: 1 | 2 | 3): number {
  if (klasse === 1) return stufe.satzI;
  if (klasse === 2) return stufe.satzII;
  return stufe.satzIII;
}

export interface ErbschaftInput {
  modus: ErbschaftModus;
  verwandtschaft: Verwandtschaft;
  vermoegenswert: number;
  /** Nur bei Erbschaft: Schulden und Kosten über die Pauschale hinaus. */
  nachlassverbindlichkeiten: number;
  /** Schenkungen an dieselbe Person in den letzten zehn Jahren (§ 14 ErbStG). */
  bereitsGenutzterFreibetrag: number;
}

export interface StufenZeile {
  bis: number;
  satz: number;
  aktuell: boolean;
}

export interface ErbschaftResult {
  steuerklasse: 1 | 2 | 3;
  freibetrag: number;
  freibetragVerbleibend: number;
  erbfallkostenpauschale: number;
  /** Vermögenswert nach Verbindlichkeiten und Pauschale, vor Freibetrag. */
  bereicherung: number;
  /** Nach Freibetragsabzug und Abrundung auf volle 100 € (§ 10 Abs. 1 S. 6 ErbStG). */
  steuerpflichtigerErwerb: number;
  steuersatz: number;
  steuerVorHaerteausgleich: number;
  /** Steuerersparnis durch den Härteausgleich nach § 19 Abs. 3 ErbStG. */
  haerteausgleich: number;
  steuer: number;
  nettoErwerb: number;
  stufen: StufenZeile[];
  warnings: string[];
}

export function calculateErbschaftsteuer(input: ErbschaftInput): ErbschaftResult {
  const modus = input.modus;
  const regel = verwandtschaftRegel(input.verwandtschaft, modus);

  const freibetrag = regel.freibetrag;
  const bereitsGenutzt = clamp(nn(input.bereitsGenutzterFreibetrag), 0, freibetrag);
  const freibetragVerbleibend = freibetrag - bereitsGenutzt;

  const pauschale = modus === "erbschaft" ? ERBFALLKOSTENPAUSCHALE : 0;
  const verbindlichkeiten = modus === "erbschaft" ? nn(input.nachlassverbindlichkeiten) : 0;

  const vermoegenswert = nn(input.vermoegenswert);
  const bereicherung = Math.max(0, vermoegenswert - verbindlichkeiten - pauschale);
  const nachFreibetrag = Math.max(0, bereicherung - freibetragVerbleibend);
  const steuerpflichtigerErwerb = Math.floor(nachFreibetrag / 100) * 100;

  const stufenIndex = STUFEN.findIndex((s) => steuerpflichtigerErwerb <= s.bis);
  const stufe = STUFEN[stufenIndex] ?? STUFEN[STUFEN.length - 1]!;
  const steuersatz = steuerpflichtigerErwerb > 0 ? satzFuerKlasse(stufe, regel.steuerklasse) : 0;

  const steuerVorHaerteausgleich = Math.round((steuerpflichtigerErwerb * steuersatz) / 100);

  let steuer = steuerVorHaerteausgleich;
  let haerteausgleich = 0;

  if (steuerpflichtigerErwerb > 0 && stufenIndex > 0) {
    const vorherigeStufe = STUFEN[stufenIndex - 1]!;
    const grenze = vorherigeStufe.bis;
    const satzAnGrenze = satzFuerKlasse(vorherigeStufe, regel.steuerklasse);
    const steuerAnGrenze = Math.round((grenze * satzAnGrenze) / 100);

    const unterschied = steuerVorHaerteausgleich - steuerAnGrenze;
    const ueberschreitung = steuerpflichtigerErwerb - grenze;
    // § 19 Abs. 3 ErbStG: bis 30 % Steuersatz darf die Hälfte, darüber drei
    // Viertel der Überschreitung für den Härteausgleich herangezogen werden.
    const kappungsfaktor = steuersatz <= 30 ? 0.5 : 0.75;
    const kappung = ueberschreitung * kappungsfaktor;

    if (unterschied > kappung) {
      haerteausgleich = unterschied - kappung;
      steuer = steuerAnGrenze + kappung;
    }
  }

  // Wie das Finanzamt: der festgesetzte Betrag wird auf volle Euro abgerundet.
  steuer = Math.floor(steuer);

  const stufen: StufenZeile[] = STUFEN.map((s) => ({
    bis: s.bis,
    satz: satzFuerKlasse(s, regel.steuerklasse),
    aktuell: s === stufe && steuerpflichtigerErwerb > 0,
  }));

  const warnings: string[] = [];

  if (steuerpflichtigerErwerb === 0 && bereicherung > 0) {
    warnings.push(
      "Der Wert bleibt innerhalb des verbleibenden Freibetrags – es fällt keine Erbschaft- oder Schenkungsteuer an.",
    );
  }

  if (haerteausgleich > 0) {
    warnings.push(
      `Der Härteausgleich senkt die Steuer um ${Math.round(haerteausgleich).toLocaleString("de-DE")} €, weil der steuerpflichtige Erwerb die nächstniedrigere Wertgrenze nur um ${Math.round(steuerpflichtigerErwerb - (STUFEN[stufenIndex - 1]?.bis ?? 0)).toLocaleString("de-DE")} € überschreitet.`,
    );
  }

  if (input.verwandtschaft === "elternGrosseltern") {
    warnings.push(
      modus === "erbschaft"
        ? "Eltern und Großeltern zählen nur bei einer Erbschaft zur günstigeren Steuerklasse I. Bei einer Schenkung zu Lebzeiten gilt für sie Steuerklasse II mit nur 20.000 € Freibetrag."
        : "Eltern und Großeltern zählen bei einer Schenkung zu Lebzeiten zur Steuerklasse II. Bei einer Erbschaft gilt für sie die günstigere Steuerklasse I mit 100.000 € Freibetrag.",
    );
  }

  if (modus === "schenkung" && bereitsGenutzt === 0 && vermoegenswert > 0) {
    warnings.push(
      "Der Freibetrag lässt sich alle zehn Jahre erneut nutzen. Wer eine große Summe in mehreren zeitlich gestaffelten Schenkungen überträgt, kann so mehrfach steuerfrei schenken.",
    );
  }

  if (bereitsGenutzt >= freibetrag && freibetrag > 0) {
    warnings.push(
      "Der Freibetrag ist durch frühere Schenkungen bereits vollständig ausgeschöpft – der volle Wert dieses Erwerbs ist steuerpflichtig.",
    );
  }

  const nettoErwerb = vermoegenswert - verbindlichkeiten - steuer;

  return {
    steuerklasse: regel.steuerklasse,
    freibetrag,
    freibetragVerbleibend,
    erbfallkostenpauschale: pauschale,
    bereicherung,
    steuerpflichtigerErwerb,
    steuersatz,
    steuerVorHaerteausgleich,
    haerteausgleich,
    steuer,
    nettoErwerb,
    stufen,
    warnings,
  };
}

export function defaultInput(): ErbschaftInput {
  return {
    modus: "erbschaft",
    verwandtschaft: "kind",
    vermoegenswert: 500_000,
    nachlassverbindlichkeiten: 0,
    bereitsGenutzterFreibetrag: 0,
  };
}
