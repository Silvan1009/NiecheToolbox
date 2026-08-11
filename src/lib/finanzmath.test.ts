import { describe, expect, it } from "vitest";
import {
  annuitaetsRate,
  effektivzins,
  endwert,
  internerZinsfuss,
  laufzeitAusRate,
  tilgungsplan,
  verdopplungsdauer,
} from "./finanzmath";

describe("annuitaetsRate", () => {
  it("rechnet die Rate eines Annuitätendarlehens", () => {
    // 10.000 € über 5 Jahre zu 5 %: A = K·i/(1−(1+i)^−n) mit i = 0,05/12
    // ergibt 188,712 € – aufgerundet auf 188,72 €, damit die Laufzeit hält.
    expect(annuitaetsRate(1_000_000, 5, 60)).toBe(18872);
  });

  it("rundet auf, damit das Darlehen in der Laufzeit auch getilgt ist", () => {
    // Abgerundet fehlten am Ende zwölf Cent und es bräuchte einen 61. Monat.
    const plan = tilgungsplan({
      darlehenC: 1_000_000,
      zinsPa: 5,
      monatsrateC: annuitaetsRate(1_000_000, 5, 60),
    });
    expect(plan.volltilgungMonate).toBe(60);
    // Die letzte Rate ist der Rest und fällt kleiner aus als die reguläre.
    const letzte = plan.monatsFlowsC[59] ?? 0;
    expect(Math.abs(letzte)).toBeLessThan(18872);
  });

  it("teilt ohne Zins schlicht auf die Laufzeit", () => {
    expect(annuitaetsRate(1_200_000, 0, 12)).toBe(100_000); // 1.000,00 €
  });

  it("liefert 0 statt NaN, wenn es nichts zu tilgen gibt", () => {
    expect(annuitaetsRate(0, 5, 60)).toBe(0);
    expect(annuitaetsRate(1_000_000, 5, 0)).toBe(0);
  });

  it("passt zur Baufinanzierungs-Faustformel Zins plus Tilgung", () => {
    // 200.000 € zu 3 % Zins und 2 % Tilgung: 5 % von 200.000 = 10.000 im Jahr,
    // also 833,33 € im Monat. Die Annuitätenformel muss dieselbe Rate über die
    // Laufzeit ergeben, die sich daraus ergibt (rund 30 Jahre und 2 Monate).
    const monate = laufzeitAusRate(20_000_000, 3, 83_333);
    expect(monate).not.toBeNull();
    expect(annuitaetsRate(20_000_000, 3, monate ?? 0)).toBeCloseTo(83_333, -2);
  });
});

describe("laufzeitAusRate", () => {
  it("rechnet die Laufzeit aus einer gewünschten Rate", () => {
    // Gegenprobe zu annuitaetsRate: 188,72 € tilgen 10.000 € in 60 Monaten.
    expect(laufzeitAusRate(1_000_000, 5, 18_872)).toBe(60);
  });

  it("ist die Umkehrung von annuitaetsRate", () => {
    // Ein Cent weniger reicht nicht: 188,71 € brauchen einen 61. Monat.
    // Genau deshalb rundet annuitaetsRate auf.
    expect(laufzeitAusRate(1_000_000, 5, 18_871)).toBe(61);
  });

  it("meldet null, wenn die Rate die Monatszinsen nicht deckt", () => {
    // 10.000 € zu 5 % kosten rund 41,67 € Zins im Monat. Eine Rate von 40 €
    // lässt die Restschuld wachsen – dann gibt es keine Laufzeit.
    expect(laufzeitAusRate(1_000_000, 5, 4_000)).toBeNull();
  });

  it("meldet null bei einer Rate von null", () => {
    expect(laufzeitAusRate(1_000_000, 5, 0)).toBeNull();
  });

  it("teilt ohne Zins schlicht durch die Rate", () => {
    expect(laufzeitAusRate(1_200_000, 0, 100_000)).toBe(12);
  });
});

describe("tilgungsplan", () => {
  const plan = tilgungsplan({
    darlehenC: 1_000_000,
    zinsPa: 5,
    monatsrateC: 18_872,
  });

  it("tilgt in der gerechneten Laufzeit vollständig", () => {
    expect(plan.volltilgungMonate).toBe(60);
    expect(plan.restschuldC).toBe(0);
    expect(plan.jahre).toHaveLength(5);
  });

  it("summiert Zins und Tilgung zur Gesamtsumme", () => {
    const tilgungSumme = plan.jahre.reduce((s, j) => s + j.tilgungC, 0);
    expect(tilgungSumme).toBe(1_000_000);
    // Gesamtzinsen rund 1.322 € – die Summe aller Raten minus Darlehen.
    const rateSumme = plan.jahre.reduce((s, j) => s + j.rateC, 0);
    expect(plan.gesamtzinsenC).toBe(rateSumme - 1_000_000);
    expect(plan.gesamtzinsenC).toBeCloseTo(132_200, -3);
  });

  it("verkürzt die Laufzeit durch Sondertilgung", () => {
    const mitSonder = tilgungsplan({
      darlehenC: 1_000_000,
      zinsPa: 5,
      monatsrateC: 18_872,
      sondertilgungC: 100_000, // 1.000 € im Jahr
    });
    expect(mitSonder.volltilgungMonate).toBeLessThan(60);
    expect(mitSonder.gesamtzinsenC).toBeLessThan(plan.gesamtzinsenC);
    expect(mitSonder.gesamtSondertilgungC).toBeGreaterThan(0);
    expect(mitSonder.restschuldC).toBe(0);
  });

  it("lässt die Restschuld stehen, wenn die Rate den Zins nicht deckt", () => {
    const zuKlein = tilgungsplan({
      darlehenC: 1_000_000,
      zinsPa: 5,
      monatsrateC: 4_000,
      maxJahre: 3,
    });
    expect(zuKlein.volltilgungMonate).toBeNull();
    expect(zuKlein.restschuldC).toBe(1_000_000);
  });

  it("liefert für jeden Monat einen Zahlungsstrom", () => {
    expect(plan.monatsFlowsC).toHaveLength(60);
    expect(plan.monatsFlowsC.every((flow) => flow < 0)).toBe(true);
  });
});

describe("effektivzins", () => {
  it("entspricht ohne Gebühren dem Sollzins", () => {
    // 10.000 € zu 5 % nominal, 60 Raten à 188,72 €. Der effektive Jahreszins
    // liegt durch die monatliche Verzinsung leicht über dem Sollzins:
    // (1 + 0,05/12)^12 − 1 = 5,116 %.
    const plan = tilgungsplan({
      darlehenC: 1_000_000,
      zinsPa: 5,
      monatsrateC: 18_872,
    });
    const effektiv = effektivzins([1_000_000, ...plan.monatsFlowsC]);
    expect(effektiv).not.toBeNull();
    expect(effektiv ?? 0).toBeCloseTo(5.116, 2);
  });

  it("steigt, wenn eine Bearbeitungsgebühr die Auszahlung mindert", () => {
    const plan = tilgungsplan({
      darlehenC: 1_000_000,
      zinsPa: 5,
      monatsrateC: 18_872,
    });
    const ohne = effektivzins([1_000_000, ...plan.monatsFlowsC]) ?? 0;
    // Gebühr von 200 €: getilgt werden 10.000, ausgezahlt nur 9.800.
    const mit = effektivzins([980_000, ...plan.monatsFlowsC]) ?? 0;
    expect(mit).toBeGreaterThan(ohne);
  });

  it("meldet null bei einer Reihe ohne Vorzeichenwechsel", () => {
    expect(effektivzins([1000, 2000, 3000])).toBeNull();
  });
});

describe("internerZinsfuss", () => {
  it("findet die Rendite einer einfachen Zahlungsreihe", () => {
    // 100 investiert, 110 zurück nach einer Periode: 10 Prozent.
    expect(internerZinsfuss([-100, 110]) ?? 0).toBeCloseTo(0.1, 6);
  });

  it("meldet null ohne Vorzeichenwechsel", () => {
    expect(internerZinsfuss([-100, -50])).toBeNull();
  });

  it("kommt mit langen Monatsreihen zurecht", () => {
    // Regression: die Suche startete früher fest bei −0,9999. Über 360
    // Monatsschritte unterläuft (1+r)^t dort auf null, der Barwert wird
    // Infinity und die Rendite fiel ohne Not auf null zurück. Hier: 30 Jahre
    // Sparplan mit 200 € im Monat und einem Endwert von 200.000 €.
    const flows = [0, ...Array<number>(360).fill(-200)];
    flows[360] += 200_000;

    const monatszins = internerZinsfuss(flows);
    expect(monatszins).not.toBeNull();
    expect(monatszins ?? 0).toBeGreaterThan(0);
    expect(monatszins ?? 0).toBeLessThan(0.02);
  });

  it("findet auch eine negative Rendite", () => {
    // 1.000 € eingezahlt, 800 € heraus: die Reihe hat eine Nullstelle unter
    // null, und die muss die Suche nach unten ebenfalls finden.
    const verlust = internerZinsfuss([-1000, 800]);
    expect(verlust).not.toBeNull();
    expect(verlust ?? 0).toBeCloseTo(-0.2, 6);
  });
});

describe("endwert und Verdopplung", () => {
  it("rechnet den Zinseszins einer Einmalanlage", () => {
    // Der Schulbuchwert: 10.000 € zu 5 % über 10 Jahre.
    expect(endwert(10_000, 5, 10)).toBeCloseTo(16_288.95, 2);
  });

  it("rechnet die Verdopplungsdauer statt die 72er-Regel zu schätzen", () => {
    // ln(2)/ln(1,07) = 10,24 Jahre – die Faustregel sagt 72/7 = 10,3.
    expect(verdopplungsdauer(7) ?? 0).toBeCloseTo(10.245, 2);
  });

  it("meldet null ohne Rendite", () => {
    expect(verdopplungsdauer(0)).toBeNull();
    expect(verdopplungsdauer(-3)).toBeNull();
  });
});
