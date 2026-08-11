import { describe, expect, it } from "vitest";
import {
  calculateAutokosten,
  defaultInput,
  type AutokostenInput,
} from "./logic";

describe("Auto-Unterhaltskosten-Rechner", () => {
  it("rechnet die Voreinstellung korrekt durch", () => {
    const result = calculateAutokosten(defaultInput());
    expect(result.kraftstoffJahr).toBeCloseTo(1365, 2);
    expect(result.wertverlustJahr).toBeCloseTo(2166.67, 2);
    expect(result.gesamtkostenJahr).toBeCloseTo(5061.67, 2);
    expect(result.gesamtkostenMonat).toBeCloseTo(421.81, 2);
    expect(result.kostenProKmCent).toBeCloseTo(42.18, 2);
  });

  it("verteilt den Wertverlust linear über die Haltedauer", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      kaufpreis: 30000,
      restwert: 12000,
      haltedauerJahre: 6,
    };
    const result = calculateAutokosten(input);
    expect(result.wertverlustJahr).toBeCloseTo((30000 - 12000) / 6, 2);
  });

  it("setzt den Wertverlust auf null, wenn der Restwert den Kaufpreis erreicht", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      kaufpreis: 20000,
      restwert: 20000,
    };
    const result = calculateAutokosten(input);
    expect(result.wertverlustJahr).toBe(0);
    expect(
      result.warnings.some((w) =>
        w.includes("Restwert liegt auf Höhe des Kaufpreises"),
      ),
    ).toBe(true);
  });

  it("kappt einen Restwert oberhalb des Kaufpreises auf den Kaufpreis", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      kaufpreis: 20000,
      restwert: 50000,
    };
    const result = calculateAutokosten(input);
    expect(result.wertverlustJahr).toBe(0);
  });

  it("berechnet Kraftstoffkosten aus Verbrauch, Preis und Fahrleistung", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      antrieb: "diesel",
      verbrauch: 5,
      kraftstoffpreis: 1.6,
      kmProJahr: 20000,
    };
    const result = calculateAutokosten(input);
    // 5 l/100km * 20.000 km = 1.000 Liter * 1,60 € = 1.600 €.
    expect(result.kraftstoffLiterOderKwh).toBeCloseTo(1000, 6);
    expect(result.kraftstoffJahr).toBeCloseTo(1600, 2);
    expect(result.kraftstoffLabel).toBe("Kraftstoff");
  });

  it("nennt den Posten bei Elektroantrieb Stromkosten", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      antrieb: "elektro",
      verbrauch: 18,
      kraftstoffpreis: 0.32,
      kmProJahr: 15000,
    };
    const result = calculateAutokosten(input);
    expect(result.kraftstoffLabel).toBe("Stromkosten");
    // 18 kWh/100km * 15.000 km = 2.700 kWh * 0,32 € = 864 €.
    expect(result.kraftstoffJahr).toBeCloseTo(864, 2);
    expect(result.posten.some((p) => p.label === "Stromkosten")).toBe(true);
  });

  it("summiert alle Posten exakt zu den Gesamtkosten", () => {
    const result = calculateAutokosten(defaultInput());
    const summe = result.posten.reduce((sum, p) => sum + p.jahr, 0);
    expect(summe).toBeCloseTo(result.gesamtkostenJahr, 2);
  });

  it("hat Anteile, die sich zu 100 Prozent aufsummieren", () => {
    const result = calculateAutokosten(defaultInput());
    const summeAnteile = result.posten.reduce(
      (sum, p) => sum + p.anteilProzent,
      0,
    );
    expect(summeAnteile).toBeCloseTo(100, 6);
  });

  it("rechnet Monatskosten pro Posten als ein Zwölftel des Jahresbetrags", () => {
    const result = calculateAutokosten(defaultInput());
    for (const posten of result.posten) {
      expect(posten.monat).toBeCloseTo(posten.jahr / 12, 1);
    }
  });

  it("warnt, wenn der Wertverlust der größte Kostentreiber ist", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      kaufpreis: 45000,
      restwert: 15000,
      haltedauerJahre: 4,
    };
    const result = calculateAutokosten(input);
    expect(result.warnings.some((w) => w.includes("Wertverlust macht"))).toBe(
      true,
    );
  });

  it("warnt bei geringer Fahrleistung, dass Fixkosten dominieren", () => {
    const input: AutokostenInput = { ...defaultInput(), kmProJahr: 3000 };
    const result = calculateAutokosten(input);
    expect(
      result.warnings.some((w) => w.includes("dominieren die Fixkosten")),
    ).toBe(true);
  });

  it("liefert keinen Kilometerpreis ohne Fahrleistung, aber weiterhin Gesamtkosten", () => {
    const input: AutokostenInput = { ...defaultInput(), kmProJahr: 0 };
    const result = calculateAutokosten(input);
    expect(result.kostenProKmCent).toBe(0);
    expect(result.gesamtkostenJahr).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes("Ohne Fahrleistung"))).toBe(
      true,
    );
  });

  it("fängt negative und unsinnige Eingaben ab", () => {
    const input: AutokostenInput = {
      ...defaultInput(),
      verbrauch: 0,
      kraftstoffpreis: 0,
      kaufpreis: -1000,
      restwert: -500,
      kfzSteuerJahr: -80,
      versicherungJahr: -700,
      wartungJahr: -450,
      verschleissJahr: -300,
      sonstigesJahr: -50,
    };
    const result = calculateAutokosten(input);
    expect(result.gesamtkostenJahr).toBe(0);
    expect(result.wertverlustJahr).toBe(0);
    expect(Number.isFinite(result.kostenProKmCent)).toBe(true);
  });

  it("hält die Haltedauer bei mindestens einem Jahr", () => {
    const input: AutokostenInput = { ...defaultInput(), haltedauerJahre: 0 };
    const result = calculateAutokosten(input);
    expect(Number.isFinite(result.wertverlustJahr)).toBe(true);
    expect(result.wertverlustJahr).toBeGreaterThan(0);
  });
});
