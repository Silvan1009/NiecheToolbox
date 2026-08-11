/**
 * BMI-Rechner – reine Berechnung.
 *
 * Body-Mass-Index nach WHO: Gewicht in Kilogramm geteilt durch die
 * Körpergröße in Metern zum Quadrat. Die Kategorien gelten für Erwachsene
 * unabhängig vom Geschlecht – ein Geschlechts-Feld würde am Ergebnis nichts
 * ändern und wird deshalb bewusst nicht abgefragt.
 *
 * Für Kinder und Jugendliche gilt der Erwachsenen-BMI ausdrücklich nicht:
 * dort entscheiden alters- und geschlechtsspezifische Perzentilkurven
 * (Kromeyer-Hauschild bzw. WHO/CDC-Wachstumskurven) – eine andere
 * Datengrundlage als eine angepasste Formel. Das optionale Alter dient hier
 * ausschließlich als Schalter für einen Warnhinweis, nicht als Rechengröße.
 */

export type BmiKategorie =
  | "untergewicht"
  | "normalgewicht"
  | "uebergewicht"
  | "adipositas-1"
  | "adipositas-2"
  | "adipositas-3";

export const bmiKategorieLabels: Record<BmiKategorie, string> = {
  untergewicht: "Untergewicht",
  normalgewicht: "Normalgewicht",
  uebergewicht: "Übergewicht",
  "adipositas-1": "Adipositas Grad I",
  "adipositas-2": "Adipositas Grad II",
  "adipositas-3": "Adipositas Grad III",
};

export interface BmiInput {
  gewichtKg: number;
  groesseCm: number;
  /** Optional, 0 oder undefined = nicht angegeben. Ändert nur den Hinweistext. */
  alter?: number;
}

export interface BmiResult {
  bmi: number;
  kategorie: BmiKategorie;
  /** Gewichtsspanne in kg für die eingegebene Größe, die BMI 18,5–24,9 entspricht. */
  normalgewichtMinKg: number;
  normalgewichtMaxKg: number;
  minderjaehrig: boolean;
  warnings: string[];
}

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function kategorisieren(bmi: number): BmiKategorie {
  if (bmi < 18.5) return "untergewicht";
  if (bmi < 25) return "normalgewicht";
  if (bmi < 30) return "uebergewicht";
  if (bmi < 35) return "adipositas-1";
  if (bmi < 40) return "adipositas-2";
  return "adipositas-3";
}

export function calculateBmi(input: BmiInput): BmiResult {
  const gewicht = nonNegative(input.gewichtKg);
  const groesseM = nonNegative(input.groesseCm) / 100;
  const quadrat = groesseM * groesseM;

  const bmi = quadrat > 0 ? gewicht / quadrat : 0;
  const minderjaehrig =
    input.alter !== undefined && input.alter > 0 && input.alter < 18;

  const warnings: string[] = [];
  if (minderjaehrig) {
    warnings.push(
      "Für unter 18-Jährige ist der Erwachsenen-BMI nicht aussagekräftig. Hier zählen alters- und geschlechtsspezifische Perzentilkurven, die eine Kinder- oder Jugendärztin beurteilt.",
    );
  }

  return {
    bmi,
    kategorie: kategorisieren(bmi),
    normalgewichtMinKg: 18.5 * quadrat,
    normalgewichtMaxKg: 24.9 * quadrat,
    minderjaehrig,
    warnings,
  };
}

export function defaultInput(): BmiInput {
  return { gewichtKg: 75, groesseCm: 178 };
}
