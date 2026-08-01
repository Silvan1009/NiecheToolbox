/**
 * Besteuerung von Kapitalerträgen – die Größen, die sich jährlich ändern.
 *
 * Alles an einer Stelle und datiert, damit der Jahreswechsel eine Änderung in
 * einer Datei ist und nicht eine Suche quer durch die Rechenlogik.
 *
 * Quellen:
 *   Abgeltungsteuer, Soli, Sparerpauschbetrag – § 32d, § 20 Abs. 9 EStG
 *   Teilfreistellung – § 20 InvStG
 *   Basiszins zum 2.1.2026 – BMF-Schreiben vom 13.01.2026 (§ 18 Abs. 4 InvStG)
 */

export const STEUER_STAND = "2026-01-01";

export const ABGELTUNGSTEUER_PROZENT = 25;
export const SOLI_PROZENT = 5.5;

/** § 20 Abs. 9 EStG – für Alleinstehende; Verheiratete das Doppelte. */
export const SPARERPAUSCHBETRAG = 1000;

/** Basiszins zum 2. Januar 2026, BMF-Schreiben vom 13.01.2026. */
export const BASISZINS_PROZENT = 3.2;

/** § 18 Abs. 1 InvStG: der Basisertrag ist auf 70 % des Basiszinses gedeckelt. */
export const BASISERTRAG_FAKTOR = 0.7;

export type Anlageart = "aktienfonds" | "mischfonds" | "immobilienfonds" | "zinsen";

interface AnlageartDef {
  label: string;
  hint: string;
  /** Teilfreistellung nach § 20 InvStG, in Prozent des Ertrags. */
  teilfreistellungPercent: number;
}

export const anlagearten: Record<Anlageart, AnlageartDef> = {
  aktienfonds: {
    label: "Aktienfonds oder Aktien-ETF",
    hint: "Mindestens 51 % Aktien – der Normalfall bei einem MSCI-World-ETF. 30 % des Ertrags bleiben steuerfrei.",
    teilfreistellungPercent: 30,
  },
  mischfonds: {
    label: "Mischfonds",
    hint: "Mindestens 25 % Aktien. 15 % des Ertrags bleiben steuerfrei.",
    teilfreistellungPercent: 15,
  },
  immobilienfonds: {
    label: "Immobilienfonds",
    hint: "Überwiegend Immobilien. 60 % des Ertrags bleiben steuerfrei, bei Auslandsschwerpunkt 80 %.",
    teilfreistellungPercent: 60,
  },
  zinsen: {
    label: "Zinsanlage ohne Fonds",
    hint: "Tagesgeld, Festgeld, Anleihen. Keine Teilfreistellung – der Ertrag ist voll steuerpflichtig.",
    teilfreistellungPercent: 0,
  },
};

export interface Steuerbetrag {
  kapitalertragsteuer: number;
  soli: number;
  kirchensteuer: number;
  gesamt: number;
}

const LEER: Steuerbetrag = {
  kapitalertragsteuer: 0,
  soli: 0,
  kirchensteuer: 0,
  gesamt: 0,
};

/**
 * Abgeltungsteuer auf einen bereits steuerpflichtigen Ertrag, in Cent.
 *
 * Die Kirchensteuer ist keine schlichte Zugabe: Sie ist als Sonderausgabe
 * abziehbar, und § 32d Abs. 1 Satz 4 EStG erledigt das über eine eigene
 * Formel – die Kapitalertragsteuer ist dann nicht ein Viertel des Ertrags,
 * sondern e/(4+k). Mit neun Prozent Kirchensteuer sinkt der Satz dadurch von
 * 25 auf 24,45 Prozent, und die Gesamtbelastung liegt bei 27,99 statt 26,375
 * Prozent. Wer stattdessen einfach 9 Prozent obendrauf rechnet, liegt zu hoch.
 */
export function abgeltungsteuer(
  ertragC: number,
  kirchensteuerPercent: number,
): Steuerbetrag {
  if (ertragC <= 0) return { ...LEER };

  const k = kirchensteuerPercent / 100;
  const kapitalertragsteuer = Math.round(ertragC / (4 + k));
  const soli = Math.round((kapitalertragsteuer * SOLI_PROZENT) / 100);
  const kirchensteuer = Math.round(kapitalertragsteuer * k);

  return {
    kapitalertragsteuer,
    soli,
    kirchensteuer,
    gesamt: kapitalertragsteuer + soli + kirchensteuer,
  };
}
