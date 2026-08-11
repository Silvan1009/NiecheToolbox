import { describe, expect, it } from "vitest";
import { calculateBmi, defaultInput } from "./logic";

/** Größe 100 cm macht den BMI zahlenwertgleich mit dem Gewicht in kg. */
const bmiVon = (gewichtKg: number, alter?: number) =>
  calculateBmi({ gewichtKg, groesseCm: 100, alter });

describe("BMI-Kategorien", () => {
  it("ordnet die WHO-Grenzwerte korrekt zu", () => {
    expect(bmiVon(18.4).kategorie).toBe("untergewicht");
    expect(bmiVon(18.5).kategorie).toBe("normalgewicht");
    expect(bmiVon(24.9).kategorie).toBe("normalgewicht");
    expect(bmiVon(25).kategorie).toBe("uebergewicht");
    expect(bmiVon(29.9).kategorie).toBe("uebergewicht");
    expect(bmiVon(30).kategorie).toBe("adipositas-1");
    expect(bmiVon(34.9).kategorie).toBe("adipositas-1");
    expect(bmiVon(35).kategorie).toBe("adipositas-2");
    expect(bmiVon(39.9).kategorie).toBe("adipositas-2");
    expect(bmiVon(40).kategorie).toBe("adipositas-3");
  });

  it("berechnet den BMI aus Gewicht und Größe", () => {
    const result = calculateBmi({ gewichtKg: 75, groesseCm: 178 });
    expect(result.bmi).toBeCloseTo(23.67, 1);
  });
});

describe("Normalgewichtsspanne", () => {
  it("rechnet die Spanne für eine gegebene Größe aus", () => {
    const result = calculateBmi({ gewichtKg: 75, groesseCm: 180 });
    expect(result.normalgewichtMinKg).toBeCloseTo(59.94, 1);
    expect(result.normalgewichtMaxKg).toBeCloseTo(80.68, 1);
  });

  it("wächst mit dem Quadrat der Größe", () => {
    const klein = calculateBmi({ gewichtKg: 70, groesseCm: 160 });
    const gross = calculateBmi({ gewichtKg: 70, groesseCm: 200 });
    expect(gross.normalgewichtMaxKg).toBeGreaterThan(klein.normalgewichtMaxKg);
  });
});

describe("Minderjährige", () => {
  it("warnt bei einem Alter unter 18", () => {
    const result = bmiVon(22, 15);
    expect(result.minderjaehrig).toBe(true);
    expect(result.warnings.join(" ")).toContain("nicht aussagekräftig");
  });

  it("warnt nicht ohne Altersangabe", () => {
    const result = bmiVon(22);
    expect(result.minderjaehrig).toBe(false);
    expect(result.warnings).toHaveLength(0);
  });

  it("warnt nicht bei Erwachsenen", () => {
    expect(bmiVon(22, 40).minderjaehrig).toBe(false);
  });
});

describe("Robustheit", () => {
  it("liefert bei fehlerhaften Eingaben endliche Werte", () => {
    const result = calculateBmi({ gewichtKg: Number.NaN, groesseCm: 0 });
    expect(Number.isFinite(result.bmi)).toBe(true);
    expect(result.bmi).toBe(0);
  });

  it("verwirft negative Eingaben", () => {
    const result = calculateBmi({ gewichtKg: -10, groesseCm: 180 });
    expect(result.bmi).toBe(0);
  });
});

describe("Voreinstellung", () => {
  it("ergibt ein plausibles Ergebnis", () => {
    const result = calculateBmi(defaultInput());
    expect(result.kategorie).toBe("normalgewicht");
    expect(result.minderjaehrig).toBe(false);
  });
});
