import { describe, expect, it } from "vitest";
import { calculateSparplan, defaultInput, type SparplanInput } from "./logic";
import { SPARERPAUSCHBETRAG, abgeltungsteuer } from "./steuern";

/**
 * Basisfall ohne Störgrößen: nur Startkapital, keine Rate, keine Kosten,
 * keine Steuern. So lässt sich gegen die Schulbuchformel prüfen; die
 * Zusatzeffekte kommen in den einzelnen Tests dazu.
 */
const base: SparplanInput = {
  modus: "endkapital",
  startkapital: 10000,
  sparrateMonat: 0,
  zielkapital: 0,
  dynamikPercent: 0,
  renditePercent: 0,
  laufzeitJahre: 10,
  kostenPercent: 0,
  ausgabeaufschlagPercent: 0,
  inflationPercent: 0,
  anlageart: "aktienfonds",
  steuernBeruecksichtigen: false,
  kirchensteuerPercent: 0,
  entnahmeJahre: 25,
};

const rechne = (overrides: Partial<SparplanInput> = {}) =>
  calculateSparplan({ ...base, ...overrides });

describe("Zinseszins", () => {
  it("behandelt die Rendite als effektiven Jahreszins", () => {
    // Der Schulbuchwert: 10.000 € zu 5 % über 10 Jahre sind 10.000 · 1,05^10
    // = 16.288,95 €. Wer den Monatszins als 5/12 rechnet, landet bei
    // 16.470,09 € – das wären effektiv 5,116 statt 5 Prozent.
    const result = rechne({ renditePercent: 5 });
    expect(result.endkapital).toBeCloseTo(16288.95, 0);
  });

  it("trifft den Referenzfall des Finanztip-Sparplanrechners", () => {
    // 10.000 € Start, 250 € im Monat, 6 %, 20 Jahre, ohne Kosten und Steuern.
    // Finanztip weist dafür 70.000 € Einzahlung, 75.983 € Ertrag und
    // 145.983 € Endvermögen aus, inflationsbereinigt 98.242 €.
    const result = rechne({
      startkapital: 10000,
      sparrateMonat: 250,
      renditePercent: 6,
      laufzeitJahre: 20,
      inflationPercent: 2,
    });
    expect(result.eingezahlt).toBeCloseTo(70000, 2);
    expect(result.endkapital).toBeCloseTo(145983, 0);
    expect(result.ertrag).toBeCloseTo(75983, 0);
    expect(result.endkapitalReal).toBeCloseTo(98242, 0);
  });

  it("gibt die eingegebene Rendite auch wieder aus", () => {
    // Gegenprobe über die Zahlungsreihe: ohne Kosten und Steuern muss der
    // interne Zinsfuß exakt die Eingabe treffen. Das prüft zugleich, dass die
    // Einzahlungen in der Reihe auf den richtigen Zeitpunkten liegen.
    const result = rechne({
      startkapital: 10000,
      sparrateMonat: 250,
      renditePercent: 6,
      laufzeitJahre: 20,
    });
    expect(result.renditeNachKostenUndSteuernProJahr ?? 0).toBeCloseTo(6, 3);
  });

  it("lässt das Kapital ohne Rendite unverändert", () => {
    const result = rechne();
    expect(result.endkapital).toBeCloseTo(10000, 2);
    expect(result.ertrag).toBeCloseTo(0, 2);
  });

  it("rechnet die Verdopplungsdauer aus Rendite minus Kosten", () => {
    // ln(2)/ln(1,07) = 10,24 Jahre.
    expect(rechne({ renditePercent: 7 }).verdopplungJahre ?? 0).toBeCloseTo(
      10.24,
      1,
    );
    // Ein Prozent Kosten verlängert die Verdopplung spürbar.
    const mitKosten = rechne({ renditePercent: 7, kostenPercent: 1 });
    expect(mitKosten.verdopplungJahre ?? 0).toBeGreaterThan(11);
  });
});

describe("Sparrate", () => {
  it("summiert Einzahlungen ohne Rendite schlicht auf", () => {
    // 200 € × 12 Monate × 10 Jahre = 24.000, plus 10.000 Startkapital.
    const result = rechne({ sparrateMonat: 200 });
    expect(result.eingezahlt).toBeCloseTo(34000, 2);
    expect(result.endkapital).toBeCloseTo(34000, 2);
  });

  it("zahlt die Rate zu Monatsbeginn ein", () => {
    // 100 € über ein Jahr zu 12 % effektiv, also 1,12^(1/12) − 1 = 0,94888 %
    // im Monat. Vorschüssig: 100 · ((1,12 − 1)/i) · (1 + i) = 1.276,64 €.
    // Nachschüssig wären es 1.264,64 € – der Unterschied von zwölf Euro ist
    // genau eine Monatsverzinsung des Gesamtbetrags.
    const i = 1.12 ** (1 / 12) - 1;
    const erwartet = 100 * ((1.12 - 1) / i) * (1 + i);

    const result = rechne({
      startkapital: 0,
      sparrateMonat: 100,
      renditePercent: 12,
      laufzeitJahre: 1,
    });
    expect(result.endkapital).toBeCloseTo(erwartet, 0);
    expect(result.endkapital).toBeCloseTo(1276.64, 1);
  });

  it("erhöht die Rate jährlich um die Dynamik", () => {
    const result = rechne({
      startkapital: 0,
      sparrateMonat: 100,
      dynamikPercent: 10,
      laufzeitJahre: 3,
    });
    // 100 → 110 → 121 im dritten Jahr.
    expect(result.jahre[2]?.sparrateMonat).toBeCloseTo(121, 2);
    // 12 · (100 + 110 + 121) = 3.972 €.
    expect(result.eingezahlt).toBeCloseTo(3972, 2);
  });
});

describe("Kosten", () => {
  it("mindert das Endkapital um die laufenden Kosten", () => {
    const ohne = rechne({ renditePercent: 7, laufzeitJahre: 30 });
    const mit = rechne({
      renditePercent: 7,
      laufzeitJahre: 30,
      kostenPercent: 1,
    });
    expect(mit.endkapital).toBeLessThan(ohne.endkapital);
    // Ein Prozent über dreißig Jahre kostet rund ein Viertel des Endkapitals.
    const anteil = 1 - mit.endkapital / ohne.endkapital;
    expect(anteil).toBeGreaterThan(0.2);
    expect(anteil).toBeLessThan(0.3);
  });

  it("zieht den Ausgabeaufschlag von jeder Einzahlung ab", () => {
    // 5 % auf 10.000 € Startkapital = 500 €.
    const result = rechne({ ausgabeaufschlagPercent: 5 });
    expect(result.ausgabeaufschlagGesamt).toBeCloseTo(500, 2);
    expect(result.endkapital).toBeCloseTo(9500, 2);
  });

  it("weist die Kosten in den Hinweisen aus", () => {
    const result = rechne({ renditePercent: 7, kostenPercent: 1 });
    expect(result.warnings.join(" ")).toContain("laufende Kosten");
  });
});

describe("Inflation", () => {
  it("rechnet das Endkapital in heutige Kaufkraft um", () => {
    // 10.000 € nach 10 Jahren bei 2 % Inflation: 10.000/1,02^10 = 8.203,48 €.
    const result = rechne({ inflationPercent: 2 });
    expect(result.endkapitalReal).toBeCloseTo(8203.48, 0);
  });

  it("warnt, wenn die Rendite die Inflation nicht schlägt", () => {
    const result = rechne({ renditePercent: 2, inflationPercent: 3 });
    expect(result.warnings.join(" ")).toContain("Kaufkraft");
  });
});

describe("Steuern", () => {
  it("rechnet die Abgeltungsteuer mit Kirchensteuer nach § 32d EStG", () => {
    // Ohne Kirchensteuer: 25 % plus 5,5 % Soli = 26,375 %.
    const ohne = abgeltungsteuer(100_000, 0);
    expect(ohne.gesamt).toBe(26_375);

    // Mit 9 % Kirchensteuer sinkt die Kapitalertragsteuer auf e/4,09 =
    // 24,45 %, die Gesamtbelastung steigt auf 27,996 % – nicht auf 35 %.
    const mit = abgeltungsteuer(100_000, 9);
    expect(mit.kapitalertragsteuer).toBe(24_450); // 100.000/4,09
    expect(mit.soli).toBe(1_345); // 5,5 % davon
    expect(mit.kirchensteuer).toBe(2_201); // 9 % davon
    expect(mit.gesamt).toBe(27_996);
  });

  it("besteuert den Gewinn beim Verkauf mit Teilfreistellung", () => {
    // 10.000 € zu 5 % über 10 Jahre = 16.470,09 €, Gewinn 6.470,09 €.
    // Aktienfonds: 30 % teilfrei, bleiben 4.529,06 €; minus 1.000 €
    // Sparerpauschbetrag sind 3.529,06 € steuerpflichtig.
    const result = rechne({
      renditePercent: 5,
      steuernBeruecksichtigen: true,
      anlageart: "zinsen", // erst ohne Teilfreistellung prüfen
    });
    expect(result.steuernGesamt).toBeGreaterThan(0);

    const mitFreistellung = rechne({
      renditePercent: 5,
      steuernBeruecksichtigen: true,
      anlageart: "aktienfonds",
    });
    expect(mitFreistellung.steuernGesamt).toBeLessThan(result.steuernGesamt);
    expect(mitFreistellung.endkapitalNachSteuer).toBeGreaterThan(
      result.endkapitalNachSteuer,
    );
  });

  it("lässt Gewinne unter dem Sparerpauschbetrag steuerfrei", () => {
    // Kleiner Gewinn: 1.000 € zu 2 % über 2 Jahre bleibt unter 1.000 € Ertrag.
    const result = rechne({
      startkapital: 1000,
      renditePercent: 2,
      laufzeitJahre: 2,
      steuernBeruecksichtigen: true,
      anlageart: "zinsen",
    });
    expect(result.steuernGesamt).toBe(0);
    expect(SPARERPAUSCHBETRAG).toBe(1000);
  });

  it("zieht die Vorabpauschale jährlich vom Depot ab", () => {
    // Große Summe, damit der Basisertrag den Sparerpauschbetrag übersteigt.
    const result = rechne({
      startkapital: 200000,
      renditePercent: 7,
      laufzeitJahre: 10,
      steuernBeruecksichtigen: true,
    });
    expect(result.steuerLaufend).toBeGreaterThan(0);
    expect(result.jahre[0]?.vorabpauschale).toBeGreaterThan(0);
    expect(result.warnings.join(" ")).toContain("Vorabpauschale");
  });

  it("rechnet gezahlte Vorabpauschalen auf die Verkaufssteuer an", () => {
    // Sonst würde derselbe Ertrag zweimal besteuert. Die Gesamtsteuer mit
    // Vorabpauschale darf die Steuer ohne sie nur wenig übersteigen.
    const gross = rechne({
      startkapital: 200000,
      renditePercent: 7,
      laufzeitJahre: 15,
      steuernBeruecksichtigen: true,
    });
    const gewinn = gross.ertrag;
    // Effektive Steuerquote auf den Gewinn: rund 18 % bei Aktienfonds
    // (25 % auf 70 % des Gewinns, plus Soli).
    const quote = gross.steuernGesamt / gewinn;
    expect(quote).toBeGreaterThan(0.15);
    expect(quote).toBeLessThan(0.2);
  });

  it("erhöht die Steuer durch Kirchensteuer", () => {
    const ohne = rechne({
      startkapital: 100000,
      renditePercent: 6,
      steuernBeruecksichtigen: true,
    });
    const mit = rechne({
      startkapital: 100000,
      renditePercent: 6,
      steuernBeruecksichtigen: true,
      kirchensteuerPercent: 9,
    });
    expect(mit.steuernGesamt).toBeGreaterThan(ohne.steuernGesamt);
    expect(mit.endkapitalNachSteuer).toBeLessThan(ohne.endkapitalNachSteuer);
  });
});

describe("Zielmodus", () => {
  it("findet die Sparrate, die das Ziel erreicht", () => {
    const result = rechne({
      modus: "sparrate",
      startkapital: 0,
      zielkapital: 100000,
      renditePercent: 6,
      laufzeitJahre: 20,
    });
    expect(result.sparrateMonat).toBeGreaterThan(0);

    // Gegenprobe: mit genau dieser Rate im Normalmodus muss das Ziel
    // herauskommen.
    const probe = rechne({
      startkapital: 0,
      sparrateMonat: result.sparrateMonat,
      renditePercent: 6,
      laufzeitJahre: 20,
    });
    expect(probe.endkapitalNachSteuer).toBeGreaterThanOrEqual(99990);
    expect(probe.endkapitalNachSteuer).toBeLessThan(100100);
  });

  it("kommt ohne Rate aus, wenn das Startkapital reicht", () => {
    const result = rechne({
      modus: "sparrate",
      startkapital: 100000,
      zielkapital: 50000,
      renditePercent: 5,
    });
    expect(result.sparrateMonat).toBe(0);
    expect(result.warnings.join(" ")).toContain("von allein");
  });

  it("berücksichtigt die Steuern beim Zielbetrag", () => {
    const ohneSteuer = rechne({
      modus: "sparrate",
      startkapital: 0,
      zielkapital: 100000,
      renditePercent: 6,
      laufzeitJahre: 20,
    });
    const mitSteuer = rechne({
      modus: "sparrate",
      startkapital: 0,
      zielkapital: 100000,
      renditePercent: 6,
      laufzeitJahre: 20,
      steuernBeruecksichtigen: true,
    });
    // Wer 100.000 € nach Steuern will, muss mehr sparen.
    expect(mitSteuer.sparrateMonat).toBeGreaterThan(ohneSteuer.sparrateMonat);
  });
});

describe("Entnahme", () => {
  it("rechnet die Entnahme, die das Kapital aufbraucht", () => {
    const result = rechne({ renditePercent: 0, entnahmeJahre: 10 });
    // 10.000 € ohne Rendite über 10 Jahre = 120 Monate à 83,34 €.
    expect(result.entnahmeMonat).toBeCloseTo(83.34, 1);
  });

  it("rechnet die ewige Entnahme aus dem Ertrag", () => {
    // 10.000 € zu 6 % werfen 600 € im Jahr ab, also 50 € im Monat – dabei
    // bleibt das Kapital unangetastet.
    const result = rechne({ startkapital: 10000, renditePercent: 0 });
    expect(result.entnahmeEwigMonat).toBe(0);

    const mitRendite = calculateSparplan({
      ...base,
      renditePercent: 6,
      laufzeitJahre: 1,
      startkapital: 10000,
    });
    // Nach einem Jahr zu 6 % sind es genau 10.600 €. Die ewige Entnahme ist
    // der effektive Monatszins darauf: 10.600 · (1,06^(1/12) − 1) = 51,60 €.
    expect(mitRendite.endkapital).toBeCloseTo(10600, 0);
    expect(mitRendite.entnahmeEwigMonat).toBeCloseTo(51.6, 1);
  });

  it("entnimmt weniger, als ewig möglich wäre, wenn das Kapital reichen soll", () => {
    const result = rechne({ renditePercent: 6, entnahmeJahre: 30 });
    expect(result.entnahmeMonat).toBeGreaterThan(result.entnahmeEwigMonat);
  });
});

describe("Rendite und Verlauf", () => {
  it("rechnet die Rendite nach Kosten aus der Zahlungsreihe", () => {
    // Ohne Kosten und Steuern kommt genau die Eingabe wieder heraus.
    const result = rechne({ renditePercent: 6, sparrateMonat: 200 });
    expect(result.renditeNachKostenUndSteuernProJahr ?? 0).toBeCloseTo(6, 2);
  });

  it("zieht die laufenden Kosten von der ausgewiesenen Rendite ab", () => {
    // Ein Prozent Gebühr muss die gemessene Rendite um rund einen Punkt senken.
    const result = rechne({
      renditePercent: 6,
      sparrateMonat: 200,
      kostenPercent: 1,
    });
    expect(result.renditeNachKostenUndSteuernProJahr ?? 0).toBeCloseTo(4.94, 1);
  });

  it("zieht die Steuern von der ausgewiesenen Rendite ab", () => {
    // Die Kennzahl heißt "nach Kosten und Steuern" – dann muss sie mit
    // eingeschalteten Steuern auch niedriger ausfallen.
    const brutto = rechne({ startkapital: 100000, renditePercent: 6 });
    const netto = rechne({
      startkapital: 100000,
      renditePercent: 6,
      steuernBeruecksichtigen: true,
    });
    expect(netto.renditeNachKostenUndSteuernProJahr ?? 0).toBeLessThan(
      brutto.renditeNachKostenUndSteuernProJahr ?? 0,
    );
  });

  it("liefert eine Zeile je Jahr", () => {
    const result = rechne({ laufzeitJahre: 15 });
    expect(result.jahre).toHaveLength(15);
    expect(result.jahre[14]?.jahr).toBe(15);
  });

  it("weist den Zinsanteil am Endkapital aus", () => {
    const result = rechne({ renditePercent: 7, laufzeitJahre: 30 });
    // Bei 30 Jahren und 7 Prozent stammt der Großteil aus Erträgen.
    expect(result.zinsanteilProzent ?? 0).toBeGreaterThan(80);
  });

  it("klemmt unsinnige Eingaben statt NaN zu liefern", () => {
    const result = rechne({
      laufzeitJahre: Number.NaN,
      renditePercent: Number.POSITIVE_INFINITY,
      startkapital: -5000,
    });
    expect(Number.isFinite(result.endkapital)).toBe(true);
    expect(result.laufzeitJahre).toBeGreaterThanOrEqual(1);
  });
});

describe("Voreinstellung", () => {
  it("rechnet mit den Startwerten ein plausibles Ergebnis", () => {
    const result = calculateSparplan(defaultInput());
    // 5.000 € Start plus 250 € im Monat über 20 Jahre = 65.000 € eingezahlt.
    expect(result.eingezahlt).toBeCloseTo(65000, 2);
    expect(result.endkapitalNachSteuer).toBeGreaterThan(result.eingezahlt);
    expect(result.endkapitalReal).toBeLessThan(result.endkapitalNachSteuer);
  });
});
