import { describe, expect, it } from "vitest";
import { toEuro } from "@/lib/finanzmath";
import {
  CO2_G_PER_KWH_GAS,
  calculateEnergie,
  defaultInput,
  schaetzeGasverbrauch,
  schaetzeStromverbrauch,
  type EnergieInput,
  type TarifInput,
} from "./logic";

const tarif = (overrides: Partial<TarifInput> = {}): TarifInput => ({
  verbrauchKwh: 3000,
  arbeitspreisCt: 35,
  grundpreisMonat: 12,
  abschlagMonat: 0,
  neuArbeitspreisCt: 0,
  neuGrundpreisMonat: 0,
  ...overrides,
});

const base: EnergieInput = {
  modus: "strom",
  personen: 2,
  wohnflaecheM2: 90,
  standard: "teilsaniert",
  warmwasserElektrisch: false,
  strom: tarif(),
  gas: tarif({ verbrauchKwh: 18000, arbeitspreisCt: 11, grundpreisMonat: 13 }),
};

const rechne = (overrides: Partial<EnergieInput> = {}) =>
  calculateEnergie({ ...base, ...overrides });

/** Erste (bei "beide": einzige interessierende) Sparte des Ergebnisses. */
const ersteSparte = (overrides: Partial<EnergieInput> = {}) =>
  rechne(overrides).sparten[0]!;

describe("Jahreskosten", () => {
  it("summiert Arbeitspreis und Grundpreis", () => {
    const sparte = ersteSparte();
    // 3000 kWh * 35 ct = 105.000 ct; Grundpreis 12 € * 12 = 144 €
    expect(toEuro(sparte.arbeitskostenC)).toBeCloseTo(1050, 2);
    expect(toEuro(sparte.grundkostenC)).toBeCloseTo(144, 2);
    expect(toEuro(sparte.jahreskostenC)).toBeCloseTo(1194, 2);
  });

  it("rechnet ct/kWh ohne Rundungsverlust in Cent um", () => {
    // 2733 kWh * 28,7 ct = 78.437,1 ct – auf den Cent gerundet.
    const sparte = ersteSparte({
      strom: tarif({
        verbrauchKwh: 2733,
        arbeitspreisCt: 28.7,
        grundpreisMonat: 0,
      }),
    });
    expect(sparte.arbeitskostenC).toBe(78437);
  });

  it("Gegenprobe: Jahreskosten sind genau Arbeits- plus Grundkosten", () => {
    const sparte = ersteSparte();
    expect(sparte.jahreskostenC).toBe(
      sparte.arbeitskostenC + sparte.grundkostenC,
    );
  });

  it("leitet die Monatskosten aus den Jahreskosten ab", () => {
    const result = rechne();
    expect(result.monatskostenC).toBe(Math.round(result.jahreskostenC / 12));
  });

  it("ohne Grundpreis bleiben nur die Arbeitskosten", () => {
    const sparte = ersteSparte({ strom: tarif({ grundpreisMonat: 0 }) });
    expect(sparte.grundkostenC).toBe(0);
    expect(sparte.jahreskostenC).toBe(sparte.arbeitskostenC);
  });
});

describe("Abschlag", () => {
  it("weist eine Unterdeckung als Nachzahlung aus", () => {
    const result = rechne({ strom: tarif({ abschlagMonat: 80 }) });
    // 1194 € Kosten gegen 960 € Abschlag
    expect(toEuro(result.differenzC)).toBeCloseTo(234, 2);
    expect(result.differenzC).toBeGreaterThan(0);
  });

  it("weist eine Überzahlung als Guthaben aus", () => {
    const result = rechne({ strom: tarif({ abschlagMonat: 120 }) });
    expect(result.differenzC).toBeLessThan(0);
    expect(toEuro(result.differenzC)).toBeCloseTo(-246, 2);
  });

  it("ein passender Abschlag ergibt genau null Differenz", () => {
    // 1194 € / 12 = 99,50 € im Monat
    const result = rechne({ strom: tarif({ abschlagMonat: 99.5 }) });
    expect(result.differenzC).toBe(0);
  });

  it("warnt bei Unterdeckung vor der Nachzahlung", () => {
    const result = rechne({ strom: tarif({ abschlagMonat: 50 }) });
    expect(result.warnings.join(" ")).toContain("Nachzahlung");
  });

  it("warnt bei zu hohem Abschlag vor der Vorfinanzierung", () => {
    const result = rechne({ strom: tarif({ abschlagMonat: 150 }) });
    expect(result.warnings.join(" ")).toContain("Versorger vor");
  });

  it("ohne Abschlag gibt es keine Abschlagswarnung", () => {
    const result = rechne({ strom: tarif({ abschlagMonat: 0 }) });
    expect(result.warnings.join(" ")).not.toContain("Nachzahlung");
  });
});

describe("Effektivpreis", () => {
  it("liegt über dem Arbeitspreis, solange ein Grundpreis anfällt", () => {
    const sparte = ersteSparte();
    expect(sparte.effektivpreisCt).toBeGreaterThan(35);
    // 119.400 ct / 3000 kWh = 39,8 ct
    expect(sparte.effektivpreisCt).toBeCloseTo(39.8, 4);
  });

  it("entspricht ohne Grundpreis genau dem Arbeitspreis", () => {
    const sparte = ersteSparte({ strom: tarif({ grundpreisMonat: 0 }) });
    expect(sparte.effektivpreisCt).toBeCloseTo(35, 6);
  });

  it("ist ohne Verbrauch nicht bestimmbar", () => {
    const sparte = ersteSparte({ strom: tarif({ verbrauchKwh: 0 }) });
    expect(sparte.effektivpreisCt).toBeNull();
  });

  it("trifft kleine Haushalte stärker als große", () => {
    const klein = ersteSparte({ strom: tarif({ verbrauchKwh: 1200 }) });
    const gross = ersteSparte({ strom: tarif({ verbrauchKwh: 6000 }) });
    expect(klein.effektivpreisCt!).toBeGreaterThan(gross.effektivpreisCt!);
  });
});

describe("Tarifwechsel", () => {
  it("beziffert die Ersparnis eines günstigeren Arbeitspreises", () => {
    const result = rechne({
      strom: tarif({ neuArbeitspreisCt: 28, neuGrundpreisMonat: 12 }),
    });
    // 7 ct * 3000 kWh = 210 €
    expect(toEuro(result.ersparnisJahrC!)).toBeCloseTo(210, 2);
  });

  it("ein höherer Grundpreis kann die Ersparnis auffressen", () => {
    const result = rechne({
      strom: tarif({ neuArbeitspreisCt: 34, neuGrundpreisMonat: 40 }),
    });
    // 30 € Arbeitspreisvorteil gegen 336 € Mehrkosten Grundpreis
    expect(result.ersparnisJahrC).toBeLessThan(0);
  });

  it("bleibt ohne Vergleichstarif ausdrücklich unbestimmt", () => {
    const result = rechne();
    expect(result.ersparnisJahrC).toBeNull();
    expect(result.sparten[0]!.neuJahreskostenC).toBeNull();
  });

  it("ein Grundpreis allein startet noch keinen Vergleich", () => {
    const result = rechne({
      strom: tarif({ neuArbeitspreisCt: 0, neuGrundpreisMonat: 5 }),
    });
    expect(result.ersparnisJahrC).toBeNull();
  });
});

describe("Modus", () => {
  it("rechnet im Strommodus genau eine Sparte", () => {
    const result = rechne({ modus: "strom" });
    expect(result.sparten).toHaveLength(1);
    expect(result.sparten[0]!.art).toBe("strom");
  });

  it("rechnet im Gasmodus nur Gas", () => {
    const result = rechne({ modus: "gas" });
    expect(result.sparten).toHaveLength(1);
    expect(result.sparten[0]!.art).toBe("gas");
  });

  it("summiert bei beiden Sparten die Jahreskosten", () => {
    const nurStrom = rechne({ modus: "strom" }).jahreskostenC;
    const nurGas = rechne({ modus: "gas" }).jahreskostenC;
    const beide = rechne({ modus: "beide" });
    expect(beide.sparten).toHaveLength(2);
    expect(beide.jahreskostenC).toBe(nurStrom + nurGas);
  });
});

describe("CO2", () => {
  it("rechnet Strom mit dem Strommix-Faktor", () => {
    const sparte = ersteSparte();
    // 3000 kWh * 380 g = 1140 kg
    expect(sparte.co2KgPerYear).toBeCloseTo(1140, 6);
  });

  it("rechnet Gas mit dem niedrigeren Verbrennungsfaktor", () => {
    const sparte = ersteSparte({ modus: "gas" });
    expect(sparte.co2KgPerYear).toBeCloseTo(
      (18000 * CO2_G_PER_KWH_GAS) / 1000,
      6,
    );
  });

  it("Gas ist je Kilowattstunde klimafreundlicher als Netzstrom", () => {
    const strom = ersteSparte({
      modus: "strom",
      strom: tarif({ verbrauchKwh: 1000 }),
    });
    const gas = ersteSparte({
      modus: "gas",
      gas: tarif({ verbrauchKwh: 1000 }),
    });
    expect(gas.co2KgPerYear).toBeLessThan(strom.co2KgPerYear);
  });
});

describe("Verbrauchsschaetzung", () => {
  it("waechst mit jeder weiteren Person, aber unterproportional", () => {
    const eins = schaetzeStromverbrauch(1, false);
    const zwei = schaetzeStromverbrauch(2, false);
    const drei = schaetzeStromverbrauch(3, false);
    expect(eins).toBe(1500);
    expect(zwei).toBeGreaterThan(eins);
    expect(drei).toBeGreaterThan(zwei);
    expect(zwei).toBeLessThan(eins * 2);
  });

  it("trifft den ueblichen Wert eines Vier-Personen-Haushalts", () => {
    expect(schaetzeStromverbrauch(4, false)).toBe(4200);
  });

  it("elektrisches Warmwasser hebt den Wert deutlich", () => {
    expect(schaetzeStromverbrauch(2, true)).toBeGreaterThan(
      schaetzeStromverbrauch(2, false),
    );
  });

  it("skaliert Gas linear mit der Wohnflaeche", () => {
    expect(schaetzeGasverbrauch(100, "teilsaniert")).toBe(15000);
    expect(schaetzeGasverbrauch(200, "teilsaniert")).toBe(30000);
  });

  it("besserer Daemmzustand senkt den Gasbedarf", () => {
    const unsaniert = schaetzeGasverbrauch(120, "unsaniert");
    const saniert = schaetzeGasverbrauch(120, "saniert");
    const neubau = schaetzeGasverbrauch(120, "neubau");
    expect(saniert).toBeLessThan(unsaniert);
    expect(neubau).toBeLessThan(saniert);
  });

  it("klemmt unsinnige Haushaltsangaben", () => {
    expect(schaetzeStromverbrauch(0, false)).toBe(1500);
    expect(schaetzeStromverbrauch(Number.NaN, false)).toBe(1500);
    expect(
      Number.isFinite(
        schaetzeGasverbrauch(Number.POSITIVE_INFINITY, "saniert"),
      ),
    ).toBe(true);
  });

  it("steht als Vergleichswert am Ergebnis", () => {
    const result = rechne({ modus: "beide", personen: 4, wohnflaecheM2: 100 });
    expect(result.sparten[0]!.vergleichKwh).toBe(4200);
    expect(result.sparten[1]!.vergleichKwh).toBe(15000);
  });

  it("warnt bei auffaellig hohem Verbrauch", () => {
    const result = rechne({
      personen: 1,
      strom: tarif({ verbrauchKwh: 9000 }),
    });
    expect(result.warnings.join(" ")).toContain("weit über");
  });
});

describe("Preishinweise", () => {
  it("warnt bei einem Strompreis über Marktniveau", () => {
    const result = rechne({ strom: tarif({ arbeitspreisCt: 52 }) });
    expect(result.warnings.join(" ")).toContain("52 ct/kWh");
  });

  it("nutzt für Gas eine eigene, niedrigere Schwelle", () => {
    // 20 ct wären bei Strom unauffällig, bei Gas nicht.
    const result = rechne({ modus: "gas", gas: tarif({ arbeitspreisCt: 20 }) });
    expect(result.warnings.join(" ")).toContain("20 ct/kWh");
  });

  it("schreibt das Dezimalkomma deutsch", () => {
    const result = rechne({ strom: tarif({ arbeitspreisCt: 48.5 }) });
    expect(result.warnings.join(" ")).toContain("48,5 ct/kWh");
  });

  it("meldet einen fehlenden Verbrauch statt still zu rechnen", () => {
    const result = rechne({ strom: tarif({ verbrauchKwh: 0 }) });
    expect(result.warnings.join(" ")).toContain("Jahresabrechnung");
  });
});

describe("Robustheit", () => {
  it("klemmt unsinnige Eingaben statt NaN zu liefern", () => {
    const result = rechne({
      modus: "beide",
      personen: Number.NaN,
      wohnflaecheM2: -50,
      strom: tarif({
        verbrauchKwh: -3000,
        arbeitspreisCt: Number.NaN,
        grundpreisMonat: Number.POSITIVE_INFINITY,
      }),
      gas: tarif({ verbrauchKwh: Number.NaN, arbeitspreisCt: -5 }),
    });

    expect(Number.isFinite(result.jahreskostenC)).toBe(true);
    expect(Number.isFinite(result.differenzC)).toBe(true);
    expect(Number.isFinite(result.co2KgPerYear)).toBe(true);
    for (const sparte of result.sparten) {
      expect(Number.isFinite(sparte.jahreskostenC)).toBe(true);
      expect(Number.isFinite(sparte.vergleichKwh)).toBe(true);
    }
  });

  it("liefert bei leerem Tarif überall null Kosten", () => {
    const result = rechne({
      strom: tarif({ verbrauchKwh: 0, arbeitspreisCt: 0, grundpreisMonat: 0 }),
    });
    expect(result.jahreskostenC).toBe(0);
    expect(result.differenzC).toBe(0);
  });
});

describe("Voreinstellung", () => {
  it("ergibt plausible Jahreskosten für einen Zwei-Personen-Haushalt", () => {
    const result = calculateEnergie(defaultInput());
    const euro = toEuro(result.jahreskostenC);
    expect(euro).toBeGreaterThan(1000);
    expect(euro).toBeLessThan(5000);
    expect(result.sparten).toHaveLength(2);
  });

  it("ist so eingestellt, dass der Abschlag ungefähr passt", () => {
    const result = calculateEnergie(defaultInput());
    // Ein Rechner, der beim ersten Laden eine Nachzahlung schreit, erschreckt
    // grundlos – die Voreinstellung soll ausgeglichen sein.
    expect(Math.abs(toEuro(result.differenzC))).toBeLessThan(250);
  });
});
