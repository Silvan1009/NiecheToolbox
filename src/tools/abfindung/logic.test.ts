import { describe, expect, it } from "vitest";
import { calculateAbfindung, defaultInput, type AbfindungInput } from "./logic";

describe("Abfindungsrechner", () => {
  it("berechnet die Voreinstellung: 45.000 € zvE, 30.000 € Abfindung, ledig", () => {
    const result = calculateAbfindung(defaultInput());
    expect(result.steuerOhneAbfindung).toBe(8_835);
    expect(result.steuerAufAbfindungFuenftel).toBe(10_330);
    expect(result.steuerAufAbfindungVoll).toBe(11_529);
    expect(result.ersparnisEinkommensteuer).toBe(1_199);
    expect(result.nettoAbfindung).toBeCloseTo(19_670, 2);
    expect(result.effektiverSteuersatz).toBeCloseTo(34.43, 1);
  });

  it("spart gegenüber der vollen Versteuerung im selben Jahr", () => {
    const result = calculateAbfindung(defaultInput());
    expect(result.steuerAufAbfindungFuenftel).toBeLessThan(
      result.steuerAufAbfindungVoll,
    );
    expect(
      result.warnings.some(
        (w) => w.includes("spart hier") && w.includes("Fünftelregelung"),
      ),
    ).toBe(true);
  });

  it("rechnet mit dem Splittingtarif bei Zusammenveranlagung deutlich günstiger", () => {
    const ledig = calculateAbfindung({
      ...defaultInput(),
      zusammenveranlagung: false,
    });
    const verheiratet = calculateAbfindung({
      ...defaultInput(),
      zusammenveranlagung: true,
    });
    expect(verheiratet.steuerOhneAbfindung).toBe(4_398);
    expect(verheiratet.steuerAufAbfindungFuenftel).toBe(7_840);
    expect(verheiratet.steuerAufAbfindungFuenftel).toBeLessThan(
      ledig.steuerAufAbfindungFuenftel,
    );
  });

  it("bleibt bei einer Abfindung ohne reguläres Einkommen innerhalb des Grundfreibetrags steuerfrei", () => {
    // 30.000 € / 5 = 6.000 € je Fünftel, bleibt unter dem Grundfreibetrag von 12.348 €.
    const result = calculateAbfindung({
      ...defaultInput(),
      zvEOhneAbfindung: 0,
    });
    expect(result.steuerAufAbfindungFuenftel).toBe(0);
    expect(result.steuerAufAbfindungVoll).toBe(4_217);
    expect(result.nettoAbfindung).toBeCloseTo(30_000, 2);
    expect(result.ersparnisEinkommensteuer).toBe(4_217);
  });

  it("bringt im Spitzensteuersatz keinen Vorteil mehr gegenüber voller Versteuerung", () => {
    const result = calculateAbfindung({
      ...defaultInput(),
      zvEOhneAbfindung: 300_000,
    });
    expect(result.steuerAufAbfindungFuenftel).toBe(
      result.steuerAufAbfindungVoll,
    );
    expect(result.ersparnisEinkommensteuer).toBe(0);
    expect(result.warnings.some((w) => w.includes("keinen Vorteil"))).toBe(
      true,
    );
  });

  it("berechnet den Solidaritätszuschlag nur oberhalb der Freigrenze", () => {
    const niedrig = calculateAbfindung({
      ...defaultInput(),
      zvEOhneAbfindung: 20_000,
    });
    expect(niedrig.soliAufAbfindung).toBe(0);

    const hoch = calculateAbfindung({
      ...defaultInput(),
      zvEOhneAbfindung: 300_000,
    });
    expect(hoch.soliAufAbfindung).toBeGreaterThan(0);
  });

  it("berechnet die Kirchensteuer als Prozentsatz der Einkommensteuer auf die Abfindung", () => {
    const ohne = calculateAbfindung({
      ...defaultInput(),
      kirchensteuerPercent: 0,
    });
    const mit = calculateAbfindung({
      ...defaultInput(),
      kirchensteuerPercent: 9,
    });
    expect(ohne.kirchensteuerAufAbfindung).toBe(0);
    expect(mit.kirchensteuerAufAbfindung).toBeCloseTo(
      mit.steuerAufAbfindungFuenftel * 0.09,
      2,
    );
    expect(mit.nettoAbfindung).toBeLessThan(ohne.nettoAbfindung);
    expect(mit.warnings.some((w) => w.includes("Billigkeitsgründen"))).toBe(
      true,
    );
  });

  it("liefert ohne Abfindung überall null", () => {
    const result = calculateAbfindung({
      ...defaultInput(),
      abfindungsbetrag: 0,
    });
    expect(result.steuerAufAbfindungFuenftel).toBe(0);
    expect(result.nettoAbfindung).toBe(0);
    expect(result.effektiverSteuersatz).toBe(0);
  });

  it("fängt negative und unsinnige Eingaben ab", () => {
    const input: AbfindungInput = {
      zvEOhneAbfindung: -10_000,
      abfindungsbetrag: -5_000,
      zusammenveranlagung: false,
      kirchensteuerPercent: -5,
    };
    const result = calculateAbfindung(input);
    expect(result.steuerOhneAbfindung).toBe(0);
    expect(result.gesamtabgabeAufAbfindung).toBe(0);
    expect(Number.isFinite(result.nettoAbfindung)).toBe(true);
  });

  it("hält die Ersparnis nie negativ, auch bei ungewöhnlichen Eingaben", () => {
    for (const zvE of [0, 12_348, 45_000, 70_000, 280_000]) {
      for (const abfindung of [0, 1_000, 30_000, 200_000]) {
        const result = calculateAbfindung({
          ...defaultInput(),
          zvEOhneAbfindung: zvE,
          abfindungsbetrag: abfindung,
        });
        expect(result.ersparnisEinkommensteuer).toBeGreaterThanOrEqual(0);
        expect(result.steuerAufAbfindungFuenftel).toBeLessThanOrEqual(
          result.steuerAufAbfindungVoll,
        );
      }
    }
  });
});
