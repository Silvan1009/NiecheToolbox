import { describe, expect, it } from "vitest";
import {
  calculateKredit,
  defaultInput,
  monateText,
  type KreditInput,
} from "./logic";

/**
 * Basisfall: 10.000 Euro zu 5 Prozent über 5 Jahre.
 *
 * Die Zahlen sind so gewählt, dass sich die Annuität von 188,72 Euro von Hand
 * nachrechnen lässt – dieselbe Rechnung wie in lib/finanzmath.test.ts, hier
 * aber durch den ganzen Rechner hindurch.
 */
const base: KreditInput = {
  modus: "rate-aus-laufzeit",
  kreditbetrag: 10000,
  sollzinsPercent: 5,
  laufzeitJahre: 5,
  wunschrateMonat: 200,
  sondertilgungJahr: 0,
  bearbeitungsgebuehrPercent: 0,
  restschuldversicherung: 0,
  zinsbindungJahre: 0,
};

const rechne = (overrides: Partial<KreditInput> = {}) =>
  calculateKredit({ ...base, ...overrides });

describe("Rate aus Laufzeit", () => {
  it("rechnet die Annuität für die gewünschte Laufzeit", () => {
    const result = rechne();
    expect(result.monatsrate).toBeCloseTo(188.72, 2);
    expect(result.laufzeitMonate).toBe(60);
  });

  it("tilgt am Ende der Laufzeit vollständig", () => {
    const result = rechne();
    expect(result.jahre).toHaveLength(5);
    expect(result.jahre[4]?.restschuld).toBeCloseTo(0, 2);
  });

  it("summiert die Zinsen über die Laufzeit", () => {
    // 59 volle Raten à 188,72 plus eine kleinere Schlussrate, weil die
    // aufgerundete Annuität einen Rest von wenigen Cent übrig lässt.
    const result = rechne();
    expect(result.gesamtzinsen).toBeCloseTo(1322.68, 2);
    expect(result.gesamtaufwand).toBeCloseTo(11322.68, 2);
    // Gegenprobe: Aufwand minus Zinsen ist genau die Tilgung.
    expect(result.gesamtaufwand - result.gesamtzinsen).toBeCloseTo(10000, 2);
  });

  it("senkt die Rate und erhöht die Zinsen bei längerer Laufzeit", () => {
    const kurz = rechne({ laufzeitJahre: 3 });
    const lang = rechne({ laufzeitJahre: 10 });
    expect(lang.monatsrate).toBeLessThan(kurz.monatsrate);
    expect(lang.gesamtzinsen).toBeGreaterThan(kurz.gesamtzinsen);
  });

  it("verlangt ohne Zins nur die reine Tilgung", () => {
    const result = rechne({ sollzinsPercent: 0 });
    expect(result.monatsrate).toBeCloseTo(166.67, 2); // 10.000 / 60
    expect(result.gesamtzinsen).toBeCloseTo(0, 2);
  });
});

describe("Laufzeit aus Rate", () => {
  it("rechnet die Laufzeit aus einer gewünschten Rate", () => {
    const result = rechne({ modus: "laufzeit-aus-rate", wunschrateMonat: 188.72 });
    expect(result.laufzeitMonate).toBe(60);
    expect(result.tilgtNicht).toBe(false);
  });

  it("verkürzt die Laufzeit bei höherer Rate", () => {
    const result = rechne({ modus: "laufzeit-aus-rate", wunschrateMonat: 400 });
    expect(result.laufzeitMonate).toBeLessThan(30);
  });

  it("meldet, wenn die Rate die Zinsen nicht deckt", () => {
    // 10.000 € zu 5 % kosten rund 41,67 € Zins im Monat.
    const result = rechne({ modus: "laufzeit-aus-rate", wunschrateMonat: 40 });
    expect(result.tilgtNicht).toBe(true);
    expect(result.warnings.join(" ")).toContain("deckt die Zinsen nicht");
    expect(result.effektiverJahreszins).toBeNull();
  });

  it("meldet auch eine Rate, die jenseits jeder Vertragslaufzeit tilgt", () => {
    // 45 € tilgen zwar, brauchen dafür aber weit über 40 Jahre.
    const result = rechne({ modus: "laufzeit-aus-rate", wunschrateMonat: 45 });
    expect(result.tilgtNicht).toBe(true);
  });
});

describe("Effektiver Jahreszins", () => {
  it("liegt ohne Nebenkosten knapp über dem Sollzins", () => {
    // Die monatliche Verzinsung allein hebt 5 % auf (1+0,05/12)^12 − 1.
    const result = rechne();
    expect(result.effektiverJahreszins ?? 0).toBeCloseTo(5.116, 2);
  });

  it("steigt durch eine Bearbeitungsgebühr", () => {
    // Die Gebühr mindert die Auszahlung, getilgt wird aber der volle Betrag.
    // 300 € Gebühr auf eine über die Laufzeit im Mittel gut halbierte
    // Restschuld heben den Effektivzins von 5,12 auf 6,44 Prozent.
    const result = rechne({ bearbeitungsgebuehrPercent: 3 });
    expect(result.auszahlung).toBeCloseTo(9700, 2);
    expect(result.monatsrate).toBeCloseTo(188.72, 2); // Rate unverändert
    expect(result.effektiverJahreszins ?? 0).toBeCloseTo(6.44, 1);
    expect(result.effektiverJahreszins ?? 0).toBeGreaterThan(
      rechne().effektiverJahreszins ?? 0,
    );
  });

  it("steigt durch eine mitfinanzierte Restschuldversicherung", () => {
    const ohne = rechne();
    const mit = rechne({ restschuldversicherung: 1000 });

    // Die Prämie erhöht die Schuld, nicht die Auszahlung.
    expect(mit.darlehen).toBeCloseTo(11000, 2);
    expect(mit.auszahlung).toBeCloseTo(10000, 2);
    expect(mit.monatsrate).toBeGreaterThan(ohne.monatsrate);
    expect(mit.effektiverJahreszins ?? 0).toBeGreaterThan(
      ohne.effektiverJahreszins ?? 0,
    );
    expect(mit.warnings.join(" ")).toContain("Restschuldversicherung");
  });

  it("warnt, wenn Effektiv- und Sollzins deutlich auseinanderliegen", () => {
    const result = rechne({ bearbeitungsgebuehrPercent: 3 });
    expect(result.warnings.join(" ")).toContain("effektive Jahreszins");
  });
});

describe("Zinsbindung und Restschuld", () => {
  it("weist die Restschuld zum Ende der Zinsbindung aus", () => {
    // Baufinanzierung: 300.000 € zu 3,5 %, 2 % Tilgung heißt 5,5 % Annuität,
    // also 1.375 € im Monat. Nach 10 Jahren steht noch der Großteil offen.
    const result = rechne({
      kreditbetrag: 300000,
      sollzinsPercent: 3.5,
      modus: "laufzeit-aus-rate",
      wunschrateMonat: 1375,
      zinsbindungJahre: 10,
    });
    expect(result.restschuldNachZinsbindung).not.toBeNull();
    expect(result.restschuldNachZinsbindung ?? 0).toBeGreaterThan(220000);
    expect(result.restschuldNachZinsbindung ?? 0).toBeLessThan(250000);
    expect(result.warnings.join(" ")).toContain("Zinsbindung");
  });

  it("meldet keine Restschuld ohne Zinsbindung", () => {
    expect(rechne().restschuldNachZinsbindung).toBeNull();
  });

  it("meldet null, wenn der Kredit vor Ablauf der Bindung getilgt ist", () => {
    const result = rechne({ zinsbindungJahre: 10 }); // Kredit läuft nur 5
    expect(result.restschuldNachZinsbindung).toBe(0);
  });
});

describe("Sondertilgung", () => {
  it("spart Zinsen und verkürzt die Laufzeit", () => {
    const result = rechne({
      kreditbetrag: 100000,
      laufzeitJahre: 20,
      sondertilgungJahr: 3000,
    });
    expect(result.sondertilgungZinsersparnis).toBeGreaterThan(0);
    expect(result.sondertilgungVerkuerzungMonate).toBeGreaterThan(0);
    expect(result.laufzeitMonate).toBeLessThan(240);
  });

  it("tilgt trotz Sondertilgung vollständig und nicht darüber hinaus", () => {
    const result = rechne({
      kreditbetrag: 100000,
      laufzeitJahre: 20,
      sondertilgungJahr: 3000,
    });
    const letzte = result.jahre[result.jahre.length - 1];
    expect(letzte?.restschuld).toBeCloseTo(0, 2);
  });

  it("meldet ohne Sondertilgung keine Ersparnis", () => {
    const result = rechne();
    expect(result.sondertilgungZinsersparnis).toBe(0);
    expect(result.sondertilgungVerkuerzungMonate).toBe(0);
  });

  it("empfiehlt bei langer Laufzeit ein Sondertilgungsrecht", () => {
    const result = rechne({ kreditbetrag: 100000, laufzeitJahre: 20 });
    expect(result.warnings.join(" ")).toContain("Sondertilgungsrecht");
  });
});

describe("Summen und Anteile", () => {
  it("rechnet die Kreditkosten als Aufwand minus Auszahlung", () => {
    const result = rechne({ bearbeitungsgebuehrPercent: 3 });
    expect(result.kreditkosten).toBeCloseTo(
      result.gesamtaufwand - result.auszahlung,
      2,
    );
  });

  it("weist den Zinsanteil an allen Zahlungen aus", () => {
    const result = rechne();
    // 1.322 € Zinsen von 11.322 € Gesamtaufwand sind rund 12 %.
    expect(result.zinsanteilProzent ?? 0).toBeCloseTo(11.7, 0);
  });

  it("klemmt unsinnige Eingaben statt NaN zu liefern", () => {
    const result = rechne({
      kreditbetrag: -5000,
      sollzinsPercent: Number.NaN,
      laufzeitJahre: Number.POSITIVE_INFINITY,
    });
    expect(Number.isFinite(result.monatsrate)).toBe(true);
    expect(Number.isFinite(result.gesamtzinsen)).toBe(true);
  });
});

describe("monateText", () => {
  it("schreibt Jahre und Monate aus", () => {
    expect(monateText(27)).toBe("2 Jahre und 3 Monate");
    expect(monateText(24)).toBe("2 Jahre");
    expect(monateText(13)).toBe("ein Jahr und einen Monat");
    expect(monateText(1)).toBe("einen Monat");
    expect(monateText(5)).toBe("5 Monate");
  });
});

describe("Voreinstellung", () => {
  it("rechnet mit den Startwerten ein plausibles Ergebnis", () => {
    const result = calculateKredit(defaultInput());
    // 20.000 € zu 6,5 % über 6 Jahre.
    expect(result.monatsrate).toBeGreaterThan(300);
    expect(result.monatsrate).toBeLessThan(350);
    expect(result.laufzeitMonate).toBe(72);
    expect(result.effektiverJahreszins ?? 0).toBeGreaterThan(6.5);
  });
});
