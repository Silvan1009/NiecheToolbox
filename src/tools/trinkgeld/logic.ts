/**
 * Trinkgeld-Splitter – reine Berechnung.
 *
 * Gerechnet wird durchgehend in ganzen Cent. Kommazahlen in Euro würden bei
 * Divisionen driften ("29,999999 €"); mit Cent-Integern stimmt jeder Betrag
 * auf den Cent.
 */

export type Rounding =
  /** Nur auf den Cent aufrunden (unvermeidbar bei Division). */
  | "cent"
  /** Pro Person auf die nächsten 50 Cent aufrunden. */
  | "person-50"
  /** Pro Person auf den nächsten Euro aufrunden. */
  | "person-100"
  /** Gesamtbetrag auf den nächsten Euro aufrunden, dann teilen. */
  | "total-100";

export const roundingLabels: Record<Rounding, string> = {
  cent: "Nicht runden",
  "person-50": "Pro Person auf 50 Cent",
  "person-100": "Pro Person auf 1 Euro",
  "total-100": "Gesamtbetrag auf 1 Euro",
};

export interface TipInput {
  /** Rechnungsbetrag in Euro. */
  bill: number;
  /** Trinkgeld in Prozent der Rechnung. */
  tipPercent: number;
  /** Anzahl Personen, die teilen. */
  people: number;
  rounding: Rounding;
}

export interface TipResult {
  /** Rechnungsbetrag in Euro. */
  bill: number;
  tipPercent: number;
  people: number;
  rounding: Rounding;
  /** Was jede Person zahlt. */
  perPerson: number;
  /** Was insgesamt auf den Tisch kommt. */
  total: number;
  /** Trinkgeld, das tatsächlich beim Service landet. */
  tip: number;
  /** Trinkgeld in Prozent – nach dem Runden meist etwas mehr als eingegeben. */
  effectiveTipPercent: number;
  /** Aufschlag, der allein durch das Runden entsteht. */
  roundingExtra: number;
}

const toCents = (euro: number) => Math.round(euro * 100);
const toEuro = (cents: number) => cents / 100;
const ceilTo = (cents: number, step: number) => Math.ceil(cents / step) * step;

export function calculateTip(input: TipInput): TipResult {
  const billCents = Math.max(0, toCents(input.bill));
  const tipPercent = Math.max(0, input.tipPercent);
  const people = Math.max(1, Math.trunc(input.people));

  const tipCents = Math.round((billCents * tipPercent) / 100);
  const targetCents = billCents + tipCents;

  let perPersonCents: number;
  if (input.rounding === "total-100") {
    perPersonCents = Math.ceil(ceilTo(targetCents, 100) / people);
  } else {
    const step =
      input.rounding === "person-50" ? 50 : input.rounding === "person-100" ? 100 : 1;
    perPersonCents = ceilTo(targetCents / people, step);
  }

  const collectedCents = perPersonCents * people;
  const actualTipCents = collectedCents - billCents;

  return {
    bill: toEuro(billCents),
    tipPercent,
    people,
    rounding: input.rounding,
    perPerson: toEuro(perPersonCents),
    total: toEuro(collectedCents),
    tip: toEuro(actualTipCents),
    effectiveTipPercent:
      billCents === 0 ? 0 : (actualTipCents / billCents) * 100,
    roundingExtra: toEuro(collectedCents - targetCents),
  };
}
