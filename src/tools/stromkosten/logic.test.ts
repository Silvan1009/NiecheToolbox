import { describe, expect, it } from "vitest";
import {
  CO2_G_PER_KWH,
  calculatePower,
  devicePresets,
  usagePatterns,
  type PowerInput,
} from "./logic";

const base: PowerInput = {
  watts: 100,
  pattern: "taeglich",
  usage: 5,
  kwhPerCycle: 0,
  standbyWatts: 0,
  pricePerKwhCents: 35,
};

const power = (overrides: Partial<PowerInput> = {}) =>
  calculatePower({ ...base, ...overrides });

describe("Verbrauch im Betrieb", () => {
  it("rechnet Watt mal Stunden mal Preis", () => {
    // 100 W × 5 h × 365 Tage = 182,5 kWh; bei 35 ct sind das 63,88 €.
    const result = power();
    expect(result.activeHours).toBe(1825);
    expect(result.activeKwh).toBeCloseTo(182.5, 6);
    expect(result.costPerYear).toBeCloseTo(63.875, 6);
  });

  it("teilt die Jahreskosten korrekt auf Monat und Tag", () => {
    const result = power();
    expect(result.costPerMonth).toBeCloseTo(result.costPerYear / 12, 8);
    expect(result.costPerDay).toBeCloseTo(result.costPerYear / 365, 8);
  });

  it("rechnet Stunden pro Woche auf das Jahr um", () => {
    // 2000 W × 2 h × 52 Wochen = 208 kWh
    const result = power({ watts: 2000, pattern: "woechentlich", usage: 2 });
    expect(result.activeHours).toBe(104);
    expect(result.activeKwh).toBeCloseTo(208, 6);
  });

  it("nimmt bei Durchgängen den Verbrauch je Lauf, nicht die Leistung", () => {
    // Eine Waschmaschine zieht beim Aufheizen 2000 W und danach fast nichts –
    // deshalb zählt hier nur die Angabe in kWh je Durchgang.
    const result = power({
      pattern: "durchgaenge",
      usage: 4,
      kwhPerCycle: 0.9,
      watts: 2000,
      standbyWatts: 0,
    });
    // 4 Durchgänge × 52 Wochen × 0,9 kWh = 187,2 kWh
    expect(result.activeKwh).toBeCloseTo(187.2, 6);
    // Die Wattangabe darf das Ergebnis nicht beeinflussen.
    const higherWatts = power({
      pattern: "durchgaenge",
      usage: 4,
      kwhPerCycle: 0.9,
      watts: 9000,
      standbyWatts: 0,
    });
    expect(higherWatts.activeKwh).toBeCloseTo(result.activeKwh, 6);
  });

  it("kostet nichts, wenn nichts läuft", () => {
    const result = power({ usage: 0, standbyWatts: 0 });
    expect(result.totalKwh).toBe(0);
    expect(result.costPerYear).toBe(0);
    expect(result.standbyShare).toBe(0);
    expect(result.co2KgPerYear).toBe(0);
  });
});

describe("Standby", () => {
  it("rechnet Standby nur für die Zeit außerhalb der Nutzung", () => {
    // 1 h täglich aktiv = 365 h; Standby läuft die restlichen 8395 h.
    const result = power({ watts: 100, usage: 1, standbyWatts: 2 });
    expect(result.activeHours).toBe(365);
    expect(result.standbyKwh).toBeCloseTo((2 * (8760 - 365)) / 1000, 6);
  });

  it("lässt bei Dauerbetrieb keinen Standby übrig", () => {
    const result = power({ usage: 24, standbyWatts: 5 });
    expect(result.activeHours).toBe(8760);
    expect(result.standbyKwh).toBe(0);
    expect(result.standbyShare).toBe(0);
  });

  it("zeigt, dass Standby den größeren Posten stellen kann", () => {
    // Ein Gerät mit 3 W Dauerlast, dreimal die Woche eine Stunde genutzt.
    const result = power({
      watts: 50,
      pattern: "woechentlich",
      usage: 3,
      standbyWatts: 3,
    });
    expect(result.standbyKwh).toBeGreaterThan(result.activeKwh);
    expect(result.standbyShare).toBeGreaterThan(50);
    expect(result.warnings.join(" ")).toContain("Standby");
  });

  it("beziffert die Standby-Kosten getrennt", () => {
    const result = power({ usage: 1, standbyWatts: 2 });
    expect(result.standbyCostPerYear).toBeCloseTo(
      result.standbyKwh * 0.35,
      8,
    );
    expect(result.standbyCostPerYear).toBeLessThan(result.costPerYear);
  });

  it("summiert Betrieb und Standby zum Gesamtverbrauch", () => {
    for (const standbyWatts of [0, 0.5, 2, 10]) {
      for (const usage of [0, 1, 8, 24]) {
        const result = power({ usage, standbyWatts });
        expect(result.totalKwh).toBeCloseTo(
          result.activeKwh + result.standbyKwh,
          8,
        );
      }
    }
  });
});

describe("Grenzen und Warnungen", () => {
  it("klemmt mehr als 24 Stunden am Tag", () => {
    const result = power({ usage: 30 });
    expect(result.activeHours).toBe(8760);
    expect(result.warnings.join(" ")).toContain("24 Stunden");
  });

  it("klemmt mehr als 168 Stunden pro Woche", () => {
    const result = power({ pattern: "woechentlich", usage: 200 });
    expect(result.activeHours).toBe(168 * 52);
    expect(result.warnings.join(" ")).toContain("168 Stunden");
  });

  it("warnt bei starken Dauerverbrauchern", () => {
    const heizluefter = power({ watts: 2000, usage: 3 });
    expect(heizluefter.warnings.join(" ")).toContain("teuersten");
  });

  it("fängt negative Eingaben ab", () => {
    const result = power({
      watts: -100,
      usage: -5,
      standbyWatts: -2,
      pricePerKwhCents: -35,
    });
    expect(result.totalKwh).toBe(0);
    expect(result.costPerYear).toBe(0);
    expect(Number.isFinite(result.standbyShare)).toBe(true);
  });
});

describe("CO₂", () => {
  it("rechnet mit dem hinterlegten Strommix", () => {
    const result = power();
    expect(result.co2KgPerYear).toBeCloseTo(
      (result.totalKwh * CO2_G_PER_KWH) / 1000,
      8,
    );
  });
});

describe("Voreinstellungen", () => {
  it("liefert für jede Voreinstellung ein plausibles Ergebnis", () => {
    for (const preset of devicePresets) {
      const result = calculatePower({
        watts: preset.watts,
        pattern: preset.pattern,
        usage: preset.usage,
        kwhPerCycle: preset.kwhPerCycle,
        standbyWatts: preset.standbyWatts,
        pricePerKwhCents: 35,
      });
      expect(result.totalKwh).toBeGreaterThan(0);
      expect(Number.isFinite(result.costPerYear)).toBe(true);
      // Kein Haushaltsgerät verbraucht allein mehr als 5000 kWh im Jahr.
      expect(result.totalKwh).toBeLessThan(5000);
    }
  });

  it("nutzt nur bekannte Nutzungsmuster", () => {
    for (const preset of devicePresets) {
      expect(preset.pattern in usagePatterns).toBe(true);
    }
  });

  it("gibt bei Durchgängen einen Verbrauch je Lauf an", () => {
    for (const preset of devicePresets) {
      if (preset.pattern === "durchgaenge") {
        expect(preset.kwhPerCycle).toBeGreaterThan(0);
      }
    }
  });

  it("hält eindeutige Kennungen", () => {
    const ids = devicePresets.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("ordnet den Kühlschrank im erwarteten Bereich ein", () => {
    // Ein moderner Kühlschrank liegt bei 100 bis 200 kWh im Jahr.
    const fridge = devicePresets.find((preset) => preset.id === "kuehlschrank")!;
    const result = calculatePower({
      watts: fridge.watts,
      pattern: fridge.pattern,
      usage: fridge.usage,
      kwhPerCycle: fridge.kwhPerCycle,
      standbyWatts: fridge.standbyWatts,
      pricePerKwhCents: 35,
    });
    expect(result.totalKwh).toBeGreaterThan(100);
    expect(result.totalKwh).toBeLessThan(500);
  });
});

describe("Invarianten", () => {
  it("steigt monoton mit der Nutzung", () => {
    let previous = -1;
    for (let usage = 0; usage <= 24; usage += 1) {
      const result = power({ usage, standbyWatts: 0 });
      expect(result.costPerYear).toBeGreaterThanOrEqual(previous);
      previous = result.costPerYear;
    }
  });

  it("steigt linear mit dem Preis", () => {
    const cheap = power({ pricePerKwhCents: 20 });
    const dear = power({ pricePerKwhCents: 40 });
    expect(dear.costPerYear).toBeCloseTo(cheap.costPerYear * 2, 6);
    // Der Verbrauch bleibt gleich – nur die Kosten ändern sich.
    expect(dear.totalKwh).toBeCloseTo(cheap.totalKwh, 8);
  });
});
