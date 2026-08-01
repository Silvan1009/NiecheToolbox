import { describe, expect, it } from "vitest";
import { toEuro } from "@/lib/finanzmath";
import {
  calculateUrlaub,
  defaultInput,
  monateBis,
  type UrlaubInput,
} from "./logic";

const base: UrlaubInput = {
  erwachsene: 2,
  kinder: 0,
  kindFaktorPercent: 60,
  naechte: 7,
  anreiseGesamt: 0,
  anreiseProPerson: 100,
  unterkunftProNacht: 80,
  verpflegungProPersonTag: 30,
  aktivitaetenProPersonTag: 0,
  transportVorOrtGesamt: 0,
  versicherungGesamt: 0,
  pufferPercent: 0,
  ruecklageVorhanden: 0,
  monateBisAbreise: 6,
};

const rechne = (overrides: Partial<UrlaubInput> = {}) =>
  calculateUrlaub({ ...base, ...overrides });

describe("Gesamtbudget", () => {
  it("addiert die Posten zur Zwischensumme", () => {
    const result = rechne();
    // Anreise 2*100 = 200, Unterkunft 7*80 = 560, Essen 30*2*8 = 480
    expect(toEuro(result.zwischensummeC)).toBeCloseTo(1240, 2);
  });

  it("Gegenprobe: die ausgewiesenen Posten ergeben genau die Zwischensumme", () => {
    const result = rechne({ aktivitaetenProPersonTag: 12, versicherungGesamt: 45 });
    const summe = result.posten.reduce((total, p) => total + p.betragC, 0);
    expect(summe).toBe(result.zwischensummeC);
  });

  it("schlaegt den Puffer auf die Zwischensumme auf", () => {
    const result = rechne({ pufferPercent: 10 });
    expect(toEuro(result.pufferC)).toBeCloseTo(124, 2);
    expect(result.gesamtC).toBe(result.zwischensummeC + result.pufferC);
  });

  it("ohne Puffer ist die Gesamtsumme die Zwischensumme", () => {
    const result = rechne();
    expect(result.pufferC).toBe(0);
    expect(result.gesamtC).toBe(result.zwischensummeC);
  });

  it("fuehrt keine Nullposten in der Aufstellung", () => {
    const result = rechne();
    expect(result.posten.every((p) => p.betragC > 0)).toBe(true);
    expect(result.posten.map((p) => p.label)).not.toContain("Reiseversicherung");
  });

  it("nimmt einen gesetzten Posten in die Aufstellung auf", () => {
    const result = rechne({ versicherungGesamt: 40 });
    expect(result.posten.map((p) => p.label)).toContain("Reiseversicherung");
  });
});

describe("Tage und Naechte", () => {
  it("rechnet sieben Naechte als acht Verpflegungstage", () => {
    const result = rechne();
    expect(result.tage).toBe(8);
    // 30 € * 2 Personen * 8 Tage
    const essen = result.posten.find((p) => p.label === "Verpflegung");
    expect(toEuro(essen!.betragC)).toBeCloseTo(480, 2);
  });

  it("ohne Uebernachtung bleibt der Anreisetag", () => {
    const result = rechne({ naechte: 0 });
    expect(result.tage).toBe(1);
    expect(result.warnings.join(" ")).toContain("Tagesausflug");
  });

  it("rechnet die Unterkunft pro Nacht, nicht pro Person und Nacht", () => {
    const zweiPersonen = rechne({ erwachsene: 2 });
    const vierPersonen = rechne({ erwachsene: 4 });
    const unterkunft = (r: ReturnType<typeof rechne>) =>
      r.posten.find((p) => p.label === "Unterkunft")!.betragC;
    expect(unterkunft(vierPersonen)).toBe(unterkunft(zweiPersonen));
  });
});

describe("Kinder", () => {
  it("zaehlt ein Kind bei der Verpflegung nur anteilig", () => {
    const ohne = rechne({ erwachsene: 2, kinder: 0 });
    const mit = rechne({ erwachsene: 2, kinder: 1 });
    const essen = (r: ReturnType<typeof rechne>) =>
      r.posten.find((p) => p.label === "Verpflegung")!.betragC;

    expect(mit.personenGewichtet).toBeCloseTo(2.6, 6);
    // Ein Kind zu 60 Prozent: 30 € * 0,6 * 8 Tage = 144 €
    expect(toEuro(essen(mit) - essen(ohne))).toBeCloseTo(144, 2);
  });

  it("macht Kind und Erwachsenen bei Faktor 100 gleich teuer", () => {
    const dreiErwachsene = rechne({ erwachsene: 3, kinder: 0 });
    const zweiPlusKind = rechne({
      erwachsene: 2,
      kinder: 1,
      kindFaktorPercent: 100,
    });
    expect(zweiPlusKind.zwischensummeC).toBe(dreiErwachsene.zwischensummeC);
  });

  it("zaehlt Kinder bei der Anreise pro Kopf voll", () => {
    const result = rechne({ erwachsene: 2, kinder: 2 });
    const anreise = result.posten.find((p) => p.label === "Anreise")!;
    // 100 € mal vier Koepfe, ohne Kind-Faktor
    expect(toEuro(anreise.betragC)).toBeCloseTo(400, 2);
  });

  it("warnt, wenn Kinder voll angesetzt werden", () => {
    const result = rechne({ kinder: 2, kindFaktorPercent: 100 });
    expect(result.warnings.join(" ")).toContain("zu hoch gegriffen");
  });
});

describe("Pro Kopf und pro Tag", () => {
  it("Gegenprobe: pro Person mal Personen ergibt die Gesamtsumme", () => {
    const result = rechne({ erwachsene: 2, pufferPercent: 10 });
    expect(result.proPersonC * result.personen).toBeCloseTo(result.gesamtC, -1);
  });

  it("laesst Anreise und Unterkunft aus dem Tagesbudget vor Ort heraus", () => {
    const result = rechne({
      anreiseProPerson: 500,
      unterkunftProNacht: 300,
      verpflegungProPersonTag: 30,
      aktivitaetenProPersonTag: 0,
      transportVorOrtGesamt: 0,
    });
    // Nur Verpflegung: 30 € * 2 Personen = 60 € am Tag
    expect(toEuro(result.tagesbudgetVorOrtC)).toBeCloseTo(60, 2);
  });

  it("warnt bei einem unrealistisch niedrigen Tagesbudget", () => {
    const result = rechne({ verpflegungProPersonTag: 8 });
    expect(result.warnings.join(" ")).toContain("20 Euro pro Person");
  });

  it("liefert ohne Reisende keine Division durch null", () => {
    const result = rechne({ erwachsene: 0, kinder: 0 });
    expect(result.proPersonC).toBe(0);
    expect(Number.isFinite(result.proTagC)).toBe(true);
    expect(result.warnings.join(" ")).toContain("mindestens eine Person");
  });
});

describe("Sparrate", () => {
  it("verteilt den offenen Betrag auf die Monate", () => {
    const result = rechne({ monateBisAbreise: 4 });
    // 1240 € auf vier Monate
    expect(toEuro(result.sparrateC!)).toBeCloseTo(310, 2);
  });

  it("rundet so auf, dass das Budget erreicht wird", () => {
    const result = rechne({ monateBisAbreise: 7 });
    expect(result.sparrateC! * 7).toBeGreaterThanOrEqual(result.offenC);
  });

  it("senkt die Rate um eine vorhandene Ruecklage", () => {
    const ohne = rechne({ monateBisAbreise: 4 });
    const mit = rechne({ monateBisAbreise: 4, ruecklageVorhanden: 400 });
    expect(mit.sparrateC!).toBeLessThan(ohne.sparrateC!);
    expect(toEuro(mit.offenC)).toBeCloseTo(840, 2);
  });

  it("eine Ruecklage ueber dem Budget laesst nichts offen", () => {
    const result = rechne({ ruecklageVorhanden: 5000 });
    expect(result.offenC).toBe(0);
    expect(result.sparrateC).toBe(0);
  });

  it("ohne Vorlauf gibt es ausdruecklich keine Rate", () => {
    const result = rechne({ monateBisAbreise: 0 });
    expect(result.sparrateC).toBeNull();
    expect(result.warnings.join(" ")).toContain("Ohne Vorlauf");
  });
});

describe("Puffer", () => {
  it("warnt bei zu knappem Puffer", () => {
    const result = rechne({ pufferPercent: 2 });
    expect(result.warnings.join(" ")).toContain("Puffer");
  });

  it("schweigt bei ausreichendem Puffer", () => {
    const result = rechne({ pufferPercent: 10 });
    expect(result.warnings.join(" ")).not.toContain("Puffer platzt");
  });
});

describe("monateBis", () => {
  it("zaehlt volle Monate bis zur Abreise", () => {
    expect(monateBis("2026-01-01", "2026-07-01")).toBe(5);
    expect(monateBis("2026-01-01", "2026-12-31")).toBe(11);
  });

  it("rundet ab statt auf", () => {
    // 45 Tage sind ein voller Monat, nicht zwei.
    expect(monateBis("2026-01-01", "2026-02-15")).toBe(1);
  });

  it("liefert fuer die Vergangenheit null", () => {
    expect(monateBis("2026-07-01", "2026-01-01")).toBe(0);
    expect(monateBis("2026-07-01", "2026-07-01")).toBe(0);
  });

  it("faengt unbrauchbare Datumsangaben ab", () => {
    expect(monateBis("keins", "2026-07-01")).toBe(0);
    expect(monateBis("2026-07-01", "2026-02-31")).toBe(0);
  });
});

describe("Robustheit", () => {
  it("klemmt unsinnige Eingaben statt NaN zu liefern", () => {
    const result = rechne({
      erwachsene: Number.NaN,
      kinder: -3,
      naechte: Number.POSITIVE_INFINITY,
      unterkunftProNacht: -80,
      verpflegungProPersonTag: Number.NaN,
      pufferPercent: 500,
      monateBisAbreise: Number.NaN,
    });

    expect(Number.isFinite(result.gesamtC)).toBe(true);
    expect(Number.isFinite(result.proTagC)).toBe(true);
    expect(Number.isFinite(result.tagesbudgetVorOrtC)).toBe(true);
    expect(result.offenC).toBeGreaterThanOrEqual(0);
  });

  it("klemmt den Puffer bei hundert Prozent", () => {
    const result = rechne({ pufferPercent: 500 });
    expect(result.pufferC).toBe(result.zwischensummeC);
  });

  it("liefert bei leerer Reise ueberall null", () => {
    const result = rechne({
      anreiseProPerson: 0,
      unterkunftProNacht: 0,
      verpflegungProPersonTag: 0,
    });
    expect(result.gesamtC).toBe(0);
    expect(result.posten).toHaveLength(0);
  });
});

describe("Voreinstellung", () => {
  it("ergibt ein plausibles Budget fuer eine Woche zu zweit", () => {
    const result = calculateUrlaub(defaultInput());
    const euro = toEuro(result.gesamtC);
    expect(euro).toBeGreaterThan(1500);
    expect(euro).toBeLessThan(4000);
  });

  it("startet ohne Warnungen", () => {
    // Ein Rechner, der beim ersten Laden meckert, erschreckt grundlos.
    expect(calculateUrlaub(defaultInput()).warnings).toHaveLength(0);
  });

  it("nennt eine tragbare Sparrate", () => {
    const result = calculateUrlaub(defaultInput());
    expect(result.sparrateC).not.toBeNull();
    expect(toEuro(result.sparrateC!)).toBeGreaterThan(0);
    expect(toEuro(result.sparrateC!)).toBeLessThan(600);
  });
});
