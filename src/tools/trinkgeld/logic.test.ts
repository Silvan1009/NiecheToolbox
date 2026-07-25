import { describe, expect, it } from "vitest";
import { calculateTip, roundingLabels, type Rounding } from "./logic";

const ALL_ROUNDINGS = Object.keys(roundingLabels) as Rounding[];

describe("Trinkgeld-Splitter", () => {
  it("teilt einen glatten Betrag exakt auf", () => {
    const result = calculateTip({
      bill: 100,
      tipPercent: 10,
      people: 4,
      rounding: "cent",
    });
    expect(result.total).toBe(110);
    expect(result.perPerson).toBe(27.5);
    expect(result.tip).toBe(10);
    expect(result.effectiveTipPercent).toBeCloseTo(10, 10);
    expect(result.roundingExtra).toBe(0);
  });

  it("rechnet ohne Kommafehler", () => {
    // 0,1 + 0,2 in Euro würde driften; in Cent nicht.
    const result = calculateTip({
      bill: 45.3,
      tipPercent: 10,
      people: 3,
      rounding: "cent",
    });
    expect(result.total).toBe(49.83);
    expect(result.perPerson).toBe(16.61);
    expect(result.tip).toBe(4.53);
  });

  it("rundet den Rest-Cent nach oben, damit die Summe reicht", () => {
    // 10,00 € auf 3 Personen: 3,33 € wären 9,99 € – ein Cent fehlt.
    const result = calculateTip({
      bill: 10,
      tipPercent: 0,
      people: 3,
      rounding: "cent",
    });
    expect(result.perPerson).toBe(3.34);
    expect(result.total).toBe(10.02);
    expect(result.roundingExtra).toBe(0.02);
    expect(result.tip).toBe(0.02);
  });

  it("rundet pro Person auf 50 Cent", () => {
    const result = calculateTip({
      bill: 47.8,
      tipPercent: 10,
      people: 3,
      rounding: "person-50",
    });
    // 52,58 / 3 = 17,526… -> 18,00 pro Person
    expect(result.perPerson).toBe(18);
    expect(result.total).toBe(54);
    expect(result.tip).toBe(6.2);
    expect(result.effectiveTipPercent).toBeCloseTo(12.97, 2);
  });

  it("rundet pro Person auf einen Euro", () => {
    const result = calculateTip({
      bill: 61.2,
      tipPercent: 5,
      people: 4,
      rounding: "person-100",
    });
    // 64,26 / 4 = 16,065 -> 17,00 pro Person
    expect(result.perPerson).toBe(17);
    expect(result.total).toBe(68);
  });

  it("rundet den Gesamtbetrag auf einen Euro", () => {
    const result = calculateTip({
      bill: 38.4,
      tipPercent: 10,
      people: 3,
      rounding: "total-100",
    });
    // 42,24 -> 43,00 gesamt -> 14,34 pro Person (aufgerundet)
    expect(result.perPerson).toBe(14.34);
    expect(result.total).toBe(43.02);
  });

  it("lässt bereits runde Beträge unangetastet", () => {
    const result = calculateTip({
      bill: 40,
      tipPercent: 0,
      people: 4,
      rounding: "person-100",
    });
    expect(result.perPerson).toBe(10);
    expect(result.total).toBe(40);
    expect(result.roundingExtra).toBe(0);
  });

  it("kommt mit einer Person klar", () => {
    const result = calculateTip({
      bill: 23.5,
      tipPercent: 15,
      people: 1,
      rounding: "cent",
    });
    expect(result.perPerson).toBe(27.03);
    expect(result.total).toBe(27.03);
  });

  it("fängt unsinnige Eingaben ab", () => {
    const zero = calculateTip({
      bill: 0,
      tipPercent: 10,
      people: 3,
      rounding: "cent",
    });
    expect(zero.perPerson).toBe(0);
    expect(zero.effectiveTipPercent).toBe(0);

    const negative = calculateTip({
      bill: -20,
      tipPercent: -5,
      people: 0,
      rounding: "cent",
    });
    expect(negative.bill).toBe(0);
    expect(negative.people).toBe(1);
    expect(negative.perPerson).toBe(0);
  });

  it("hält die Invarianten für alle Rundungsarten", () => {
    for (const rounding of ALL_ROUNDINGS) {
      for (const bill of [9.99, 23.4, 57.35, 118.7, 250]) {
        for (const tipPercent of [0, 5, 7.5, 10, 15, 20]) {
          for (const people of [1, 2, 3, 4, 5, 7, 12]) {
            const result = calculateTip({ bill, tipPercent, people, rounding });

            // Jede Person zahlt gleich viel, und es reicht immer.
            expect(result.perPerson * result.people).toBeCloseTo(result.total, 8);
            expect(result.total).toBeGreaterThanOrEqual(bill);

            // Trinkgeld = Gesamt minus Rechnung.
            expect(result.tip).toBeCloseTo(result.total - bill, 8);

            // Gerundet wird nie nach unten, und nie mehr als nötig.
            expect(result.roundingExtra).toBeGreaterThanOrEqual(0);
            const step =
              rounding === "person-100" ? 1 : rounding === "person-50" ? 0.5 : 1;
            expect(result.roundingExtra).toBeLessThan(step * people + 0.01);

            // Beträge sind auf den Cent genau.
            for (const value of [result.perPerson, result.total, result.tip]) {
              expect(Math.abs(value * 100 - Math.round(value * 100))).toBeLessThan(
                1e-6,
              );
            }

            // Das tatsächliche Trinkgeld ist mindestens das gewünschte –
            // bis auf den halben Cent, den die Rundung auf ganze Cent kostet.
            expect(result.tip + 0.005).toBeGreaterThanOrEqual(
              (bill * tipPercent) / 100,
            );
          }
        }
      }
    }
  });
});
