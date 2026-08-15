import { describe, expect, it } from "vitest";
import {
  berechneAnteil,
  berechneGrundwert,
  berechneProzentsatz,
  berechneVeraenderung,
} from "./logic";

describe("berechneAnteil", () => {
  it("19 % von 250 sind 47,50", () => {
    const result = berechneAnteil({ basis: 250, prozent: 19 });
    expect(result.anteil).toBeCloseTo(47.5, 10);
  });

  it("zeigt Wert nach Abzug (Rabatt) und nach Zuschlag (Aufschlag)", () => {
    const result = berechneAnteil({ basis: 79.99, prozent: 20 });
    expect(result.anteil).toBeCloseTo(15.998, 10);
    expect(result.nachAbzug).toBeCloseTo(63.992, 10);
    expect(result.nachZuschlag).toBeCloseTo(95.988, 10);
  });

  it("0 % ergibt einen Anteil von 0", () => {
    const result = berechneAnteil({ basis: 500, prozent: 0 });
    expect(result.anteil).toBe(0);
    expect(result.nachAbzug).toBe(500);
    expect(result.nachZuschlag).toBe(500);
  });

  it("negative Eingaben werden auf 0 gekappt", () => {
    const result = berechneAnteil({ basis: -100, prozent: -10 });
    expect(result.basis).toBe(0);
    expect(result.prozent).toBe(0);
    expect(result.anteil).toBe(0);
  });
});

describe("berechneGrundwert", () => {
  it("45 sind 15 % von 300", () => {
    const result = berechneGrundwert({ wert: 45, prozent: 15 });
    expect(result.grundwert).toBeCloseTo(300, 10);
    expect(result.valid).toBe(true);
  });

  it("0 % liefert kein gültiges Ergebnis", () => {
    const result = berechneGrundwert({ wert: 45, prozent: 0 });
    expect(result.valid).toBe(false);
    expect(result.grundwert).toBe(0);
  });

  it("ist die Umkehrung von berechneAnteil", () => {
    const anteil = berechneAnteil({ basis: 300, prozent: 15 });
    const grundwert = berechneGrundwert({
      wert: anteil.anteil,
      prozent: 15,
    });
    expect(grundwert.grundwert).toBeCloseTo(300, 10);
  });
});

describe("berechneProzentsatz", () => {
  it("40 von 200 sind 20 %", () => {
    const result = berechneProzentsatz({ wert: 40, basis: 200 });
    expect(result.prozentsatz).toBeCloseTo(20, 10);
    expect(result.valid).toBe(true);
  });

  it("Grundwert 0 liefert kein gültiges Ergebnis", () => {
    const result = berechneProzentsatz({ wert: 40, basis: 0 });
    expect(result.valid).toBe(false);
    expect(result.prozentsatz).toBe(0);
  });

  it("Anteil größer als Grundwert ergibt über 100 %", () => {
    const result = berechneProzentsatz({ wert: 250, basis: 200 });
    expect(result.prozentsatz).toBeCloseTo(125, 10);
  });
});

describe("berechneVeraenderung", () => {
  it("von 80 auf 100 sind 25 % mehr", () => {
    const result = berechneVeraenderung({ alt: 80, neu: 100 });
    expect(result.prozent).toBeCloseTo(25, 10);
    expect(result.differenz).toBeCloseTo(20, 10);
    expect(result.richtung).toBe("zunahme");
  });

  it("von 100 auf 80 sind 20 % weniger – nicht symmetrisch zu +25 %", () => {
    const result = berechneVeraenderung({ alt: 100, neu: 80 });
    expect(result.prozent).toBeCloseTo(-20, 10);
    expect(result.richtung).toBe("abnahme");
  });

  it("unveränderter Wert ergibt 0 % und Richtung 'gleich'", () => {
    const result = berechneVeraenderung({ alt: 50, neu: 50 });
    expect(result.prozent).toBe(0);
    expect(result.richtung).toBe("gleich");
  });

  it("Ausgangswert 0 liefert kein gültiges Ergebnis", () => {
    const result = berechneVeraenderung({ alt: 0, neu: 50 });
    expect(result.valid).toBe(false);
  });

  it("+20 % und danach -20 % führen nicht zum Ausgangswert zurück", () => {
    const hoch = berechneAnteil({ basis: 100, prozent: 20 });
    const runter = berechneAnteil({ basis: hoch.nachZuschlag, prozent: 20 });
    expect(runter.nachAbzug).toBeCloseTo(96, 10);
    expect(runter.nachAbzug).not.toBeCloseTo(100, 5);
  });
});
