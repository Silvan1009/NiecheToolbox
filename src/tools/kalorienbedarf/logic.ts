/**
 * Kalorienbedarf-Rechner – Grundumsatz nach Mifflin-St Jeor, Gesamtumsatz über
 * den PAL-Faktor (Aktivitätslevel).
 *
 * Mifflin-St Jeor gilt heute als genauer als die ältere Harris-Benedict-
 * Formel und ist die von der Academy of Nutrition and Dietetics empfohlene
 * Formel für Erwachsene. Sie ist nicht für Kinder, Schwangere oder Stillende
 * validiert – hier zählt eine andere Datengrundlage.
 *
 * Bewusst außerhalb des Umfangs: Makro-Aufteilung und Abnehmen/Zunehmen-
 * Zieldeltas. Das würde vom reinen Rechner zum Ernährungsplan kippen und
 * zusätzliche medizinische Vorsichtspflichten nach sich ziehen.
 */

export type Geschlecht = "maennlich" | "weiblich";

export type Aktivitaetslevel =
  "kaum" | "leicht" | "moderat" | "hoch" | "sehrhoch";

export interface AktivitaetOption {
  id: Aktivitaetslevel;
  label: string;
  pal: number;
  hint: string;
}

export const aktivitaetOptions: readonly AktivitaetOption[] = [
  {
    id: "kaum",
    label: "Kaum Bewegung",
    pal: 1.2,
    hint: "Sitzende Tätigkeit, kaum Sport",
  },
  {
    id: "leicht",
    label: "Leicht aktiv",
    pal: 1.375,
    hint: "1–3× Sport pro Woche",
  },
  {
    id: "moderat",
    label: "Moderat aktiv",
    pal: 1.55,
    hint: "3–5× Sport pro Woche",
  },
  {
    id: "hoch",
    label: "Hoch aktiv",
    pal: 1.725,
    hint: "6–7× intensiver Sport",
  },
  {
    id: "sehrhoch",
    label: "Sehr hoch aktiv",
    pal: 1.9,
    hint: "Leistungssport oder körperlich fordernder Beruf",
  },
] as const;

export const getAktivitaet = (id: string): AktivitaetOption =>
  aktivitaetOptions.find((option) => option.id === id) ?? aktivitaetOptions[2];

export interface KalorienbedarfInput {
  gewichtKg: number;
  groesseCm: number;
  alter: number;
  geschlecht: Geschlecht;
  aktivitaet: Aktivitaetslevel;
}

export interface KalorienbedarfResult {
  /** Kalorienbedarf in Ruhe, kcal pro Tag. */
  grundumsatz: number;
  /** Grundumsatz mal Aktivitätsfaktor, kcal pro Tag. */
  gesamtumsatz: number;
  pal: number;
  warnings: string[];
}

function nonNegative(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function calculateKalorienbedarf(
  input: KalorienbedarfInput,
): KalorienbedarfResult {
  const gewicht = nonNegative(input.gewichtKg);
  const groesse = nonNegative(input.groesseCm);
  const alter = nonNegative(input.alter);

  const basis = 10 * gewicht + 6.25 * groesse - 5 * alter;
  const grundumsatz = Math.max(
    0,
    input.geschlecht === "maennlich" ? basis + 5 : basis - 161,
  );

  const { pal } = getAktivitaet(input.aktivitaet);
  const gesamtumsatz = grundumsatz * pal;

  const warnings: string[] = [];
  if (alter > 0 && alter < 18) {
    warnings.push(
      "Mifflin-St Jeor ist für Erwachsene validiert. Bei Kindern und Jugendlichen ist der Energiebedarf altersabhängig anders und gehört in kinderärztliche Beratung.",
    );
  }

  return { grundumsatz, gesamtumsatz, pal, warnings };
}

export function defaultInput(): KalorienbedarfInput {
  return {
    gewichtKg: 75,
    groesseCm: 178,
    alter: 35,
    geschlecht: "maennlich",
    aktivitaet: "moderat",
  };
}
