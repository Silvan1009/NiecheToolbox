import { describe, expect, it } from "vitest";
import {
  aktivitaetOptions,
  calculateKalorienbedarf,
  defaultInput,
  getAktivitaet,
  type KalorienbedarfInput,
} from "./logic";

const basis: KalorienbedarfInput = {
  gewichtKg: 70,
  groesseCm: 175,
  alter: 30,
  geschlecht: "maennlich",
  aktivitaet: "kaum",
};

const rechne = (overrides: Partial<KalorienbedarfInput> = {}) =>
  calculateKalorienbedarf({ ...basis, ...overrides });

describe("Grundumsatz nach Mifflin-St Jeor", () => {
  it("rechnet den Referenzwert für einen Mann", () => {
    // 10*70 + 6.25*175 - 5*30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75
    expect(rechne().grundumsatz).toBeCloseTo(1648.75, 1);
  });

  it("rechnet den Referenzwert für eine Frau", () => {
    // 10*70 + 6.25*175 - 5*30 - 161 = 700 + 1093.75 - 150 - 161 = 1482.75
    expect(rechne({ geschlecht: "weiblich" }).grundumsatz).toBeCloseTo(
      1482.75,
      1,
    );
  });

  it("liegt bei Männern konstant 166 kcal über Frauen mit gleichen Werten", () => {
    const mann = rechne({ geschlecht: "maennlich" }).grundumsatz;
    const frau = rechne({ geschlecht: "weiblich" }).grundumsatz;
    expect(mann - frau).toBeCloseTo(166, 5);
  });

  it("steigt mit dem Gewicht", () => {
    const leicht = rechne({ gewichtKg: 60 }).grundumsatz;
    const schwer = rechne({ gewichtKg: 90 }).grundumsatz;
    expect(schwer).toBeGreaterThan(leicht);
  });

  it("sinkt mit dem Alter", () => {
    const jung = rechne({ alter: 20 }).grundumsatz;
    const alt = rechne({ alter: 60 }).grundumsatz;
    expect(alt).toBeLessThan(jung);
  });
});

describe("Gesamtumsatz über den PAL-Faktor", () => {
  it("ist Grundumsatz mal Aktivitätsfaktor", () => {
    const result = rechne({ aktivitaet: "hoch" });
    expect(result.pal).toBeCloseTo(1.725, 5);
    expect(result.gesamtumsatz).toBeCloseTo(result.grundumsatz * 1.725, 5);
  });

  it("kennt alle fünf Aktivitätsstufen", () => {
    expect(aktivitaetOptions).toHaveLength(5);
    expect(getAktivitaet("sehrhoch").pal).toBeCloseTo(1.9, 5);
  });

  it("fällt bei unbekannter Stufe auf einen Mittelwert zurück", () => {
    expect(getAktivitaet("unsinn").id).toBe("moderat");
  });

  it("steigt mit jeder Aktivitätsstufe", () => {
    const werte = aktivitaetOptions.map(
      (option) => rechne({ aktivitaet: option.id }).gesamtumsatz,
    );
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]!).toBeGreaterThan(werte[i - 1]!);
    }
  });
});

describe("Warnhinweise", () => {
  it("warnt bei einem Alter unter 18", () => {
    const result = rechne({ alter: 15 });
    expect(result.warnings.join(" ")).toContain("Kindern und Jugendlichen");
  });

  it("warnt nicht bei Erwachsenen", () => {
    expect(rechne({ alter: 30 }).warnings).toHaveLength(0);
  });
});

describe("Robustheit", () => {
  it("liefert bei fehlerhaften Eingaben endliche, nicht-negative Werte", () => {
    const result = calculateKalorienbedarf({
      gewichtKg: Number.NaN,
      groesseCm: -10,
      alter: 30,
      geschlecht: "maennlich",
      aktivitaet: "kaum",
    });
    expect(Number.isFinite(result.grundumsatz)).toBe(true);
    expect(result.grundumsatz).toBeGreaterThanOrEqual(0);
  });

  it("rutscht nie unter null, auch bei extrem hohem Alter", () => {
    const result = rechne({ alter: 1000 });
    expect(result.grundumsatz).toBe(0);
    expect(result.gesamtumsatz).toBe(0);
  });
});

describe("Voreinstellung", () => {
  it("ergibt ein plausibles Ergebnis", () => {
    const result = calculateKalorienbedarf(defaultInput());
    expect(result.grundumsatz).toBeGreaterThan(1000);
    expect(result.gesamtumsatz).toBeGreaterThan(result.grundumsatz);
  });
});
