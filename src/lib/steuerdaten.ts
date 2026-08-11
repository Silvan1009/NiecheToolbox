/**
 * Alle Rechengrößen für Lohnsteuer und Sozialversicherung – an einer Stelle
 * und datiert.
 *
 * Das ist der Punkt, an dem dieser Rechner jedes Jahr veraltet. Deshalb steht
 * hier jede Zahl mit ihrer Quelle, und die Rechenlogik enthält keine einzige
 * davon: Der Jahreswechsel ist eine Änderung in dieser Datei, nicht eine Suche
 * quer durch den Code.
 *
 * Quellen (Stand Januar 2026):
 *   Einkommensteuertarif – § 32a EStG, Fassung für den VZ 2026
 *   Rechengrößen der Sozialversicherung – Sozialversicherungsrechengrößen-
 *     verordnung 2026, veröffentlicht vom GKV-Spitzenverband
 *   Durchschnittlicher Zusatzbeitrag – Bekanntmachung des BMG für 2026
 *   Vorsorgepauschale – § 39b Abs. 2 Satz 5 Nr. 3 EStG in der ab 01.01.2026
 *     geltenden Fassung
 *   Solidaritätszuschlag – § 3, § 4 SolZG
 */

import type { RegionCode } from "./regionen";

export const STEUERDATEN_STAND = "2026-01-01";
export const STEUERJAHR = 2026;

/* ---------------------------------------------------------------------------
 * Einkommensteuertarif § 32a EStG 2026
 * ------------------------------------------------------------------------- */

export const GRUNDFREIBETRAG = 12348;

/**
 * Einkommensteuer nach § 32a Abs. 1 EStG für 2026, Grundtarif.
 *
 * Die Koeffizienten stehen so im Gesetz. `y` und `z` sind jeweils ein
 * Zehntausendstel des Betrags, der die jeweilige Zonengrenze übersteigt.
 * Das Ergebnis wird auf volle Euro abgerundet, ebenfalls Vorgabe des Gesetzes.
 *
 * Die Zonengrenzen stehen bewusst als Literal in der Formel und nicht in einer
 * eigenen Konstantentabelle daneben: Grenze und zugehörige Koeffizienten
 * gehören im Gesetz zusammen, getrennt laufen sie auseinander. Genau das war
 * hier passiert – eine ungenutzte Tabelle nannte als Beginn der letzten Zone
 * 277826, die Formel prüft auf 277825.
 */
export function einkommensteuer(zvE: number): number {
  const x = Math.floor(Math.max(0, zvE));

  if (x <= 12348) return 0;

  if (x <= 17799) {
    const y = (x - 12348) / 10000;
    return Math.floor((914.51 * y + 1400) * y);
  }

  if (x <= 69878) {
    const z = (x - 17799) / 10000;
    return Math.floor((173.1 * z + 2397) * z + 1034.87);
  }

  if (x <= 277825) return Math.floor(0.42 * x - 11135.63);

  return Math.floor(0.45 * x - 19470.38);
}

/* ---------------------------------------------------------------------------
 * Pauschbeträge und Freibeträge
 * ------------------------------------------------------------------------- */

/** Arbeitnehmer-Pauschbetrag, § 9a Satz 1 Nr. 1a EStG. */
export const ARBEITNEHMER_PAUSCHBETRAG = 1230;

/** Sonderausgaben-Pauschbetrag, § 10c EStG. */
export const SONDERAUSGABEN_PAUSCHBETRAG = 36;

/** Entlastungsbetrag für Alleinerziehende, § 24b EStG – Steuerklasse II. */
export const ENTLASTUNGSBETRAG_ALLEINERZIEHENDE = 4260;
/** Erhöhung je weiterem Kind. */
export const ENTLASTUNGSBETRAG_JE_WEITEREM_KIND = 240;

/**
 * Kinderfreibetrag inklusive Betreuungsfreibetrag, § 32 Abs. 6 EStG – der
 * volle Betrag für beide Elternteile zusammen.
 *
 * Wichtig: Er mindert nicht die Lohnsteuer, sondern nur die Bemessungsgrundlage
 * für Solidaritätszuschlag und Kirchensteuer. Für die Lohnsteuer selbst wird
 * stattdessen Kindergeld gezahlt.
 */
export const KINDERFREIBETRAG_VOLL = 6828;
export const BETREUUNGSFREIBETRAG_VOLL = 2928;

/* ---------------------------------------------------------------------------
 * Sozialversicherung 2026
 * ------------------------------------------------------------------------- */

/** Beitragsbemessungsgrenze Renten- und Arbeitslosenversicherung, Jahr. */
export const BBG_RENTE = 101400;

/** Beitragsbemessungsgrenze Kranken- und Pflegeversicherung, Jahr. */
export const BBG_KRANKEN = 69750;

/** Jahresarbeitsentgeltgrenze: ab hier ist ein Wechsel in die PKV möglich. */
export const VERSICHERUNGSPFLICHTGRENZE = 77400;

/** Gesamtbeitragssätze in Prozent; Arbeitnehmer und Arbeitgeber teilen sich sie. */
export const BEITRAGSSATZ = {
  rente: 18.6,
  arbeitslosen: 2.6,
  /** Allgemeiner Beitragssatz, § 241 SGB V. */
  krankenAllgemein: 14.6,
  /** Ermäßigter Satz, § 243 SGB V – maßgeblich für die Vorsorgepauschale. */
  krankenErmaessigt: 14.0,
  pflege: 3.6,
} as const;

/** Durchschnittlicher Zusatzbeitrag 2026, vom BMG bekannt gegeben. */
export const ZUSATZBEITRAG_DURCHSCHNITT = 2.9;

/** Zuschlag für Kinderlose ab 23 Jahren – trägt der Arbeitnehmer allein. */
export const PFLEGE_KINDERLOS_ZUSCHLAG = 0.6;

/** Abschlag je Kind ab dem zweiten, bis zum fünften Kind. */
export const PFLEGE_ABSCHLAG_JE_KIND = 0.25;
export const PFLEGE_ABSCHLAG_MAX_KINDER = 5;

/**
 * Sachsen trägt die Pflegeversicherung anders auf.
 *
 * Weil dort der Buß- und Bettag als Feiertag erhalten blieb, zahlt der
 * Arbeitnehmer 0,5 Prozentpunkte mehr und der Arbeitgeber entsprechend
 * weniger. Das ist die einzige regionale Abweichung in der Sozialversicherung.
 */
export const PFLEGE_SACHSEN_MEHR_ARBEITNEHMER = 0.5;

/* ---------------------------------------------------------------------------
 * Solidaritätszuschlag
 * ------------------------------------------------------------------------- */

export const SOLI_SATZ = 5.5;
/** Freigrenze der Lohnsteuer, unterhalb derer kein Soli anfällt. */
export const SOLI_FREIGRENZE = 20350;
/** In Steuerklasse III gilt der doppelte Betrag. */
export const SOLI_FREIGRENZE_SPLITTING = 40700;
/** In der Milderungszone steigt der Soli gedeckelt an, § 4 Satz 2 SolZG. */
export const SOLI_MILDERUNG_SATZ = 11.9;

/**
 * Solidaritätszuschlag mit Freigrenze und Milderungszone, § 4 SolZG.
 *
 * Bis zur Freigrenze fällt nichts an. Direkt darüber würde der volle Zuschlag
 * einen Sprung erzeugen, deshalb ist er auf 11,9 Prozent des übersteigenden
 * Betrags begrenzt, bis der reguläre Satz von 5,5 Prozent günstiger ist.
 */
export function soliZuschlag(steuer: number, splitting: boolean): number {
  const freigrenze = splitting ? SOLI_FREIGRENZE_SPLITTING : SOLI_FREIGRENZE;
  if (steuer <= freigrenze) return 0;

  const voll = (steuer * SOLI_SATZ) / 100;
  const milderung = ((steuer - freigrenze) * SOLI_MILDERUNG_SATZ) / 100;
  return Math.min(voll, milderung);
}

/* ---------------------------------------------------------------------------
 * Kirchensteuer
 * ------------------------------------------------------------------------- */

/**
 * Kirchensteuersatz je Bundesland, in Prozent der Lohnsteuer.
 *
 * Bayern und Baden-Württemberg erheben 8 Prozent, alle übrigen Länder 9.
 */
export function kirchensteuersatz(region: RegionCode): number {
  return region === "by" || region === "bw" ? 8 : 9;
}

/* ---------------------------------------------------------------------------
 * Steuerklassen
 * ------------------------------------------------------------------------- */

export type Steuerklasse = 1 | 2 | 3 | 4 | 5 | 6;

interface SteuerklasseDef {
  label: string;
  hint: string;
}

export const steuerklassen: Record<Steuerklasse, SteuerklasseDef> = {
  1: {
    label: "I – ledig",
    hint: "Ledig, verwitwet oder geschieden, ohne Kind im Haushalt.",
  },
  2: {
    label: "II – alleinerziehend",
    hint: "Alleinerziehend mit Kindergeldanspruch. Mit Entlastungsbetrag von 4.260 Euro.",
  },
  3: {
    label: "III – verheiratet, höheres Einkommen",
    hint: "Nur zusammen mit Steuerklasse V beim Partner. Rechnet mit dem Splittingtarif.",
  },
  4: {
    label: "IV – verheiratet, ähnliches Einkommen",
    hint: "Beide Partner in IV. Steuerlich wie Klasse I, aber mit Kinderfreibeträgen.",
  },
  5: {
    label: "V – verheiratet, geringeres Einkommen",
    hint: "Gegenstück zu Klasse III. Hohe Abzüge, weil die Freibeträge beim Partner liegen.",
  },
  6: {
    label: "VI – zweites Arbeitsverhältnis",
    hint: "Für jeden weiteren Job. Ohne Freibeträge, deshalb die höchsten Abzüge.",
  },
};

export const isSteuerklasse = (value: unknown): value is Steuerklasse =>
  typeof value === "number" &&
  value >= 1 &&
  value <= 6 &&
  Number.isInteger(value);
