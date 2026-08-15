/**
 * Prozentrechner – reine Berechnung.
 *
 * Prozentrechnung ist immer dieselbe Gleichung (Prozentwert = Grundwert ×
 * Prozentsatz / 100), nur nach einer anderen Größe aufgelöst. Jede Funktion
 * hier deckt eine der vier Alltagsfragen ab.
 */

/** Division, die bei Nenner 0 nicht NaN/Infinity liefert, sondern `valid: false`. */
function safeDivide(numerator: number, denominator: number) {
  if (denominator === 0) return { value: 0, valid: false };
  return { value: numerator / denominator, valid: true };
}

export interface AnteilInput {
  /** Ausgangswert, 100 % ("Grundwert"). */
  basis: number;
  /** Gesuchter Anteil in Prozent. */
  prozent: number;
}

export interface AnteilResult {
  basis: number;
  prozent: number;
  /** Der Anteil selbst (Prozentwert). */
  anteil: number;
  /** Ausgangswert minus Anteil – z. B. Preis nach Rabatt. */
  nachAbzug: number;
  /** Ausgangswert plus Anteil – z. B. Preis nach Aufschlag/Steuer. */
  nachZuschlag: number;
}

/** Wie viel sind `prozent` % von `basis`? Deckt Rabatt- und Aufschlagrechnung mit ab. */
export function berechneAnteil(input: AnteilInput): AnteilResult {
  const basis = Math.max(0, input.basis);
  const prozent = Math.max(0, input.prozent);
  const anteil = (basis * prozent) / 100;

  return {
    basis,
    prozent,
    anteil,
    nachAbzug: basis - anteil,
    nachZuschlag: basis + anteil,
  };
}

export interface GrundwertInput {
  /** Bekannter Anteil (Prozentwert). */
  wert: number;
  /** Prozentsatz, den dieser Anteil vom gesuchten Grundwert ausmacht. */
  prozent: number;
}

export interface GrundwertResult {
  wert: number;
  prozent: number;
  /** Der gesuchte Ausgangswert (100 %). */
  grundwert: number;
  /** false bei 0 % – dann lässt sich kein Grundwert bestimmen. */
  valid: boolean;
}

/** `wert` sind `prozent` % wovon? */
export function berechneGrundwert(input: GrundwertInput): GrundwertResult {
  const wert = Math.max(0, input.wert);
  const prozent = Math.max(0, input.prozent);
  const { value, valid } = safeDivide(wert, prozent / 100);

  return { wert, prozent, grundwert: value, valid };
}

export interface ProzentsatzInput {
  /** Bekannter Anteil (Prozentwert). */
  wert: number;
  /** Bekannter Ausgangswert (Grundwert). */
  basis: number;
}

export interface ProzentsatzResult {
  wert: number;
  basis: number;
  /** Wie viel Prozent `wert` von `basis` ist. */
  prozentsatz: number;
  /** false bei Grundwert 0 – dann ist der Anteil nicht definiert. */
  valid: boolean;
}

/** `wert` ist wie viel Prozent von `basis`? */
export function berechneProzentsatz(
  input: ProzentsatzInput,
): ProzentsatzResult {
  const wert = Math.max(0, input.wert);
  const basis = Math.max(0, input.basis);
  const { value, valid } = safeDivide(wert, basis);

  return { wert, basis, prozentsatz: value * 100, valid };
}

export interface VeraenderungInput {
  /** Wert vorher. */
  alt: number;
  /** Wert nachher. */
  neu: number;
}

export type Richtung = "zunahme" | "abnahme" | "gleich";

export interface VeraenderungResult {
  alt: number;
  neu: number;
  /** Absolute Differenz, kann negativ sein. */
  differenz: number;
  /** Prozentuale Veränderung, kann negativ sein. */
  prozent: number;
  richtung: Richtung;
  /** false bei Ausgangswert 0 – dann ist keine relative Veränderung definiert. */
  valid: boolean;
}

/** Von `alt` auf `neu` – wie viel Prozent Veränderung, bezogen auf `alt`? */
export function berechneVeraenderung(
  input: VeraenderungInput,
): VeraenderungResult {
  const alt = Math.max(0, input.alt);
  const neu = Math.max(0, input.neu);
  const differenz = neu - alt;
  const { value, valid } = safeDivide(differenz, alt);
  const prozent = value * 100;

  const richtung: Richtung =
    differenz > 0 ? "zunahme" : differenz < 0 ? "abnahme" : "gleich";

  return { alt, neu, differenz, prozent, richtung, valid };
}
