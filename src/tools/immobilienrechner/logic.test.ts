import { describe, expect, it } from "vitest";
import { regions } from "@/tools/brueckentage/logic";
import {
  GREST_BUNDESSATZ,
  grestFor,
  grestHistorie,
  grestSpanne,
  grunderwerbsteuer,
} from "./grunderwerbsteuer";
import {
  calculateImmobilie,
  defaultInput,
  internerZinsfuss,
  type ImmobilienInput,
} from "./logic";

/**
 * Basisfall: 400.000 Euro in Bayern.
 *
 * Die Zahlen sind so gewählt, dass die Darlehenssumme glatt aufgeht:
 * 400.000 Kaufpreis + 36.280 Nebenkosten − 136.280 Eigenkapital = 300.000.
 */
const base: ImmobilienInput = {
  modus: "kapitalanlage",
  kaufpreis: 400000,
  wohnflaeche: 80,
  modernisierung: 0,
  region: "by",
  grestPercent: 3.5,
  notarPercent: 2,
  maklerPercent: 3.57,
  eigenkapital: 136280,
  sollzinsPercent: 3.5,
  tilgungPercent: 2,
  zinsbindungJahre: 10,
  kaltmieteMonat: 1200,
  mietsteigerungPercent: 0,
  hausgeldMonat: 60,
  instandhaltungProQmJahr: 12,
  verwaltungMonat: 30,
  mietausfallPercent: 0,
  gebaeudeanteilPercent: 75,
  afaArt: "linear-2",
  grenzsteuersatzPercent: 42,
  ersparteMieteMonat: 1200,
  alternativrenditePercent: 0,
  horizontJahre: 10,
  wertsteigerungPercent: 0,
  verkaufskostenPercent: 0,
};

const rechne = (overrides: Partial<ImmobilienInput> = {}) =>
  calculateImmobilie({ ...base, ...overrides });

describe("Kaufnebenkosten", () => {
  it("rechnet jeden Posten als Anteil des Kaufpreises", () => {
    const result = rechne();
    expect(result.grunderwerbsteuer).toBeCloseTo(14000, 2); // 3,5 % von 400.000
    expect(result.notarUndGrundbuch).toBeCloseTo(8000, 2); // 2,0 %
    expect(result.maklerprovision).toBeCloseTo(14280, 2); // 3,57 %
    expect(result.nebenkosten).toBeCloseTo(36280, 2);
    expect(result.nebenkostenQuote).toBeCloseTo(9.07, 4);
  });

  it("bildet den Unterschied zwischen den Bundesländern ab", () => {
    const bayern = rechne({ grestPercent: 3.5 });
    const nrw = rechne({ grestPercent: 6.5 });
    expect(bayern.grunderwerbsteuer).toBeCloseTo(14000, 2);
    expect(nrw.grunderwerbsteuer).toBeCloseTo(26000, 2);
    // Drei Prozentpunkte auf 400.000 sind 12.000 Euro Unterschied.
    expect(nrw.nebenkosten - bayern.nebenkosten).toBeCloseTo(12000, 2);
  });

  it("zählt Modernisierung zur Gesamtinvestition, aber nicht zu den Nebenkosten", () => {
    const result = rechne({ modernisierung: 30000 });
    expect(result.nebenkosten).toBeCloseTo(36280, 2);
    expect(result.gesamtinvestition).toBeCloseTo(400000 + 36280 + 30000, 2);
  });

  it("rechnet den Quadratmeterpreis nur bei bekannter Fläche", () => {
    expect(rechne().preisProQm).toBeCloseTo(5000, 6); // 400.000 / 80
    expect(rechne({ wohnflaeche: 0 }).preisProQm).toBe(0);
  });
});

describe("Grunderwerbsteuer-Tabelle", () => {
  it("kennt jedes Bundesland", () => {
    for (const region of regions) {
      expect(grunderwerbsteuer[region.code]).toBeGreaterThan(0);
      expect(grestHistorie[region.code]).toBeTruthy();
    }
    expect(Object.keys(grunderwerbsteuer)).toHaveLength(regions.length);
  });

  it("hält sich an die tatsächliche Spanne der Länder", () => {
    for (const region of regions) {
      const satz = grunderwerbsteuer[region.code];
      expect(satz).toBeGreaterThanOrEqual(3.5);
      expect(satz).toBeLessThanOrEqual(6.5);
    }
    const spanne = grestSpanne();
    expect(spanne.min).toBe(3.5);
    expect(spanne.max).toBe(6.5);
  });

  it("lässt Bayern beim alten Bundessatz", () => {
    expect(grunderwerbsteuer.by).toBe(GREST_BUNDESSATZ);
    expect(grestFor("by")).toBe(3.5);
  });

  it("fällt bei unbekannter Kennung auf den Bundessatz zurück", () => {
    expect(grestFor("xx")).toBe(GREST_BUNDESSATZ);
  });
});

describe("Finanzierung", () => {
  it("finanziert die Lücke zwischen Eigenkapital und Gesamtinvestition", () => {
    const result = rechne();
    expect(result.darlehen).toBeCloseTo(300000, 2);
    expect(result.beleihungsauslauf).toBeCloseTo(75, 6); // 300.000 / 400.000
  });

  it("rechnet die Annuität aus Zins plus Tilgung", () => {
    // 300.000 × (3,5 % + 2 %) = 16.500 im Jahr, also 1.375 im Monat.
    const result = rechne();
    expect(result.jahresannuitaet).toBeCloseTo(16500, 2);
    expect(result.monatsrate).toBeCloseTo(1375, 2);
  });

  it("ermittelt die Restschuld zum Ende der Zinsbindung", () => {
    // Geschlossene Form: 300.000 × q^120 − 1.375 × (q^120 − 1) / i
    // mit i = 0,035/12 und q = 1 + i ergibt rund 228.288 Euro.
    const result = rechne();
    expect(result.restschuldZinsbindung).toBeGreaterThan(228000);
    expect(result.restschuldZinsbindung).toBeLessThan(228600);
    // Gezahlt wurden 120 × 1.375 = 165.000; der Rest ist Zins.
    expect(result.zinsenBisZinsbindung).toBeCloseTo(
      165000 - (300000 - result.restschuldZinsbindung),
      1,
    );
  });

  it("tilgt schneller bei höherer Anfangstilgung", () => {
    const langsam = rechne({ tilgungPercent: 1 });
    const schnell = rechne({ tilgungPercent: 4 });
    expect(schnell.restschuldZinsbindung).toBeLessThan(
      langsam.restschuldZinsbindung,
    );
    expect(schnell.volltilgungJahre!).toBeLessThan(langsam.volltilgungJahre!);
  });

  it("kommt ohne Zins nicht ins Straucheln", () => {
    // Ohne Zins teilt die geschlossene Annuitätenformel durch null.
    // 300.000 bei 5 % Tilgung sind 15.000 im Jahr, also genau 20 Jahre.
    const result = rechne({ sollzinsPercent: 0, tilgungPercent: 5 });
    expect(result.volltilgungJahre).toBeCloseTo(20, 6);
    expect(result.gesamtzinsen).toBe(0);
    expect(Number.isFinite(result.restschuldZinsbindung)).toBe(true);
  });

  it("erkennt eine Rate, die nie tilgt", () => {
    const result = rechne({ tilgungPercent: 0 });
    expect(result.volltilgungJahre).toBeNull();
    expect(result.restschuldZinsbindung).toBeCloseTo(300000, 2);
    expect(result.warnings.join(" ")).toContain("Tilgung");
  });

  it("kommt ohne Darlehen aus", () => {
    const result = rechne({ eigenkapital: 1000000 });
    expect(result.darlehen).toBe(0);
    expect(result.monatsrate).toBe(0);
    expect(result.volltilgungJahre).toBe(0);
    expect(result.eigenkapitalEingesetzt).toBeCloseTo(436280, 2);
  });

  it("warnt, wenn das Eigenkapital die Nebenkosten nicht deckt", () => {
    const result = rechne({ eigenkapital: 5000 });
    expect(result.warnings.join(" ")).toContain("Kaufnebenkosten");
  });
});

describe("Renditekennzahlen", () => {
  it("setzt die Bruttorendite auf den Kaufpreis, die Nettorendite auf die Gesamtinvestition", () => {
    const result = rechne();
    // 14.400 Jahresmiete auf 400.000 Kaufpreis.
    expect(result.bruttomietrendite).toBeCloseTo(3.6, 6);
    expect(result.nettomietrendite).toBeLessThan(result.bruttomietrendite);
  });

  it("ist der Kaufpreisfaktor der Kehrwert der Bruttorendite", () => {
    const result = rechne();
    expect(result.kaufpreisfaktor).toBeCloseTo(100 / result.bruttomietrendite, 6);
  });

  it("weist die Miete je Quadratmeter aus", () => {
    expect(rechne().mieteProQm).toBeCloseTo(15, 6); // 1.200 / 80
  });

  it("lässt die Eigenkapitalrendite ohne Eigenkapital nicht entgleisen", () => {
    const result = rechne({ eigenkapital: 0 });
    expect(result.eigenkapitalrendite).toBe(0);
    expect(Number.isFinite(result.eigenkapitalrendite)).toBe(true);
    expect(result.warnings.join(" ")).toContain("Eigenkapitalrendite");
  });
});

describe("Cashflow und Steuer", () => {
  it("zieht Bewirtschaftung und Rate von der Miete ab", () => {
    const result = rechne();
    // 14.400 Miete − (720 Hausgeld + 360 Verwaltung + 960 Instandhaltung)
    // − 16.500 Annuität
    expect(result.mieteJahr).toBeCloseTo(14400, 2);
    expect(result.bewirtschaftungJahr).toBeCloseTo(2040, 2);
    expect(result.cashflowVorSteuerJahr).toBeCloseTo(14400 - 2040 - 16500, 1);
  });

  it("mindert das Ausfallwagnis die Mieteinnahme", () => {
    const result = rechne({ mietausfallPercent: 5 });
    expect(result.mieteJahr).toBeCloseTo(14400 * 0.95, 2);
  });

  it("lässt den Cashflow ohne Steuersatz unverändert", () => {
    const result = rechne({ grenzsteuersatzPercent: 0 });
    expect(result.steuerwirkungJahr).toBe(0);
    expect(result.cashflowNachSteuerJahr).toBeCloseTo(
      result.cashflowVorSteuerJahr,
      6,
    );
  });

  it("erstattet Steuern, wenn das steuerliche Ergebnis negativ ist", () => {
    const result = rechne();
    // Miete − Bewirtschaftung − Zinsen − AfA ist hier negativ, also fließt
    // Steuer zurück und der Cashflow nach Steuern liegt über dem davor.
    expect(result.steuerlichesErgebnis).toBeLessThan(0);
    expect(result.steuerwirkungJahr).toBeLessThan(0);
    expect(result.cashflowNachSteuerJahr).toBeGreaterThan(
      result.cashflowVorSteuerJahr,
    );
  });

  it("warnt bei negativem Cashflow", () => {
    expect(rechne().warnings.join(" ")).toContain("Cashflow ist negativ");
  });

  it("warnt bei fehlender Instandhaltungsrücklage", () => {
    const result = rechne({ instandhaltungProQmJahr: 0 });
    expect(result.warnings.join(" ")).toContain("Instandhaltungsrücklage");
  });
});

describe("Abschreibung", () => {
  it("schreibt nur den Gebäudeanteil ab", () => {
    // Bemessungsgrundlage: 75 % von (400.000 + 36.280) = 327.210, davon 2 %.
    const result = rechne();
    expect(result.afaJahr).toBeCloseTo(6544.2, 2);

    const ohneGrundstueck = rechne({ gebaeudeanteilPercent: 100 });
    expect(ohneGrundstueck.afaJahr).toBeCloseTo(6544.2 / 0.75, 1);
  });

  it("summiert die lineare AfA über die Laufzeit auf die Bemessungsgrundlage", () => {
    // 2 % über 50 Jahre ergibt genau 100 Prozent.
    const result = rechne({ horizontJahre: 50 });
    const summe = result.jahre.reduce((sum, zeile) => sum + zeile.afa, 0);
    expect(summe).toBeCloseTo(327210, 2);
  });

  it("schreibt degressiv vom Restwert ab, also fallend", () => {
    const result = rechne({ afaArt: "degressiv-5", horizontJahre: 10 });
    expect(result.jahre[0].afa).toBeCloseTo(327210 * 0.05, 1);
    expect(result.jahre[1].afa).toBeLessThan(result.jahre[0].afa);
    // Auch degressiv wird nie mehr als die Bemessungsgrundlage abgeschrieben.
    const summe = result.jahre.reduce((sum, zeile) => sum + zeile.afa, 0);
    expect(summe).toBeLessThan(327210);
  });

  it("kennt keine Abschreibung bei Eigennutzung", () => {
    const result = rechne({ modus: "eigennutzung" });
    expect(result.afaJahr).toBe(0);
    expect(result.steuerwirkungJahr).toBe(0);
  });

  it("warnt bei anschaffungsnahem Herstellungsaufwand", () => {
    // Über 15 Prozent des Gebäudewerts.
    const result = rechne({ modernisierung: 80000 });
    expect(result.warnings.join(" ")).toContain("anschaffungsnah");
  });
});

describe("Verkauf und Gesamtrendite", () => {
  it("versteuert den Gewinn innerhalb der Spekulationsfrist", () => {
    const result = rechne({ horizontJahre: 9, wertsteigerungPercent: 3 });
    expect(result.spekulationssteuer).toBeGreaterThan(0);
    expect(result.warnings.join(" ")).toContain("Spekulationsfrist");
  });

  it("lässt den Gewinn nach zehn Jahren steuerfrei", () => {
    const result = rechne({ horizontJahre: 11, wertsteigerungPercent: 3 });
    expect(result.spekulationssteuer).toBe(0);
    expect(result.warnings.join(" ")).not.toContain("Spekulationsfrist");
  });

  it("besteuert bei Eigennutzung auch innerhalb der Frist nicht", () => {
    const result = rechne({
      modus: "eigennutzung",
      horizontJahre: 5,
      wertsteigerungPercent: 3,
    });
    expect(result.spekulationssteuer).toBe(0);
  });

  it("zieht Restschuld und Verkaufskosten vom Erlös ab", () => {
    const result = rechne({ verkaufskostenPercent: 3, wertsteigerungPercent: 0 });
    expect(result.immobilienwertEnde).toBeCloseTo(400000, 2);
    expect(result.verkaufskosten).toBeCloseTo(12000, 2);
    expect(result.nettoVerkaufserloes).toBeCloseTo(
      400000 - 12000 - result.restschuldEnde - result.spekulationssteuer,
      1,
    );
  });

  it("rechnet die Wertentwicklung zinseszinslich", () => {
    const result = rechne({ horizontJahre: 10, wertsteigerungPercent: 2 });
    expect(result.immobilienwertEnde).toBeCloseTo(400000 * 1.02 ** 10, 0);
  });

  it("verkraftet fallende Preise", () => {
    const result = rechne({ wertsteigerungPercent: -3 });
    expect(result.immobilienwertEnde).toBeLessThan(400000);
    expect(result.spekulationssteuer).toBe(0);
    expect(Number.isFinite(result.vermoegenszuwachs)).toBe(true);
  });

  it("verknüpft Vermögenszuwachs und Zahlungsreihe", () => {
    const result = rechne({ wertsteigerungPercent: 2 });
    expect(result.vermoegenszuwachs).toBeCloseTo(
      result.kumulierterCashflow +
        result.nettoVerkaufserloes -
        result.eigenkapitalEingesetzt,
      1,
    );
  });
});

describe("Interner Zinsfuß", () => {
  it("löst den einfachen Fall exakt", () => {
    expect(internerZinsfuss([-100, 110])!).toBeCloseTo(0.1, 8);
    expect(internerZinsfuss([-100, 0, 121])!).toBeCloseTo(0.1, 8);
  });

  it("liefert null ohne Vorzeichenwechsel", () => {
    expect(internerZinsfuss([-100, -10])).toBeNull();
    expect(internerZinsfuss([100, 110])).toBeNull();
  });

  it("weist eine Gesamtrendite für ein tragfähiges Objekt aus", () => {
    const result = rechne({ horizontJahre: 15, wertsteigerungPercent: 2.5 });
    expect(result.gesamtrenditeProJahr).not.toBeNull();
    expect(result.gesamtrenditeProJahr!).toBeGreaterThan(0);
    expect(Number.isFinite(result.gesamtrenditeProJahr!)).toBe(true);
  });
});

describe("Kaufen oder mieten", () => {
  const eigen = (overrides: Partial<ImmobilienInput> = {}) =>
    rechne({ modus: "eigennutzung", ...overrides });

  it("stellt Belastung und ersparte Miete gegenüber", () => {
    const result = eigen();
    expect(result.ersparteMieteMonat).toBeCloseTo(1200, 2);
    // 1.375 Rate + 170 Nebenkosten im Monat
    expect(result.belastungMonat).toBeCloseTo(1545, 2);
    expect(result.mehrbelastungMonat).toBeCloseTo(345, 2);
  });

  it("macht Mieten attraktiver, je höher die Alternativrendite", () => {
    const ohne = eigen({ alternativrenditePercent: 0 });
    const mit = eigen({ alternativrenditePercent: 6 });
    expect(mit.vermoegenMieten).toBeGreaterThan(ohne.vermoegenMieten);
    expect(mit.vorteilKaufen).toBeLessThan(ohne.vorteilKaufen);
  });

  it("macht Kaufen attraktiver, je stärker der Wert steigt", () => {
    const flach = eigen({ wertsteigerungPercent: 0 });
    const steil = eigen({ wertsteigerungPercent: 4 });
    expect(steil.vorteilKaufen).toBeGreaterThan(flach.vorteilKaufen);
  });

  it("bleibt der Vorteil die Differenz beider Vermögen", () => {
    const result = eigen({ alternativrenditePercent: 4 });
    expect(result.vorteilKaufen).toBeCloseTo(
      result.vermoegenKaufen - result.vermoegenMieten,
      6,
    );
  });
});

describe("Jahresverlauf", () => {
  it("deckt Zinsbindung und Betrachtungszeitraum ab", () => {
    expect(rechne({ zinsbindungJahre: 15, horizontJahre: 10 }).jahre).toHaveLength(15);
    expect(rechne({ zinsbindungJahre: 10, horizontJahre: 25 }).jahre).toHaveLength(25);
  });

  it("summiert Zins und Tilgung zur gezahlten Rate", () => {
    for (const zeile of rechne({ horizontJahre: 30 }).jahre) {
      expect(zeile.rate).toBeCloseTo(zeile.zins + zeile.tilgung, 6);
    }
  });

  it("tilgt insgesamt genau die Darlehenssumme", () => {
    const result = rechne({ horizontJahre: 50, tilgungPercent: 3 });
    const summeTilgung = result.jahre.reduce((sum, z) => sum + z.tilgung, 0);
    expect(summeTilgung).toBeCloseTo(result.darlehen, 2);
    expect(result.jahre[result.jahre.length - 1].restschuld).toBe(0);
  });

  it("lässt die Restschuld monoton fallen", () => {
    let vorher = Number.POSITIVE_INFINITY;
    for (const zeile of rechne({ horizontJahre: 40 }).jahre) {
      expect(zeile.restschuld).toBeLessThanOrEqual(vorher);
      vorher = zeile.restschuld;
    }
  });

  it("verschiebt das Verhältnis von Zins zu Tilgung über die Jahre", () => {
    const jahre = rechne({ horizontJahre: 20 }).jahre;
    expect(jahre[0].zins).toBeGreaterThan(jahre[0].tilgung);
    expect(jahre[19].zins).toBeLessThan(jahre[19].tilgung);
  });

  it("weist Vermögen als Wert abzüglich Restschuld aus", () => {
    for (const zeile of rechne({ wertsteigerungPercent: 2 }).jahre) {
      expect(zeile.vermoegen).toBeCloseTo(
        zeile.immobilienwert - zeile.restschuld,
        6,
      );
    }
  });
});

describe("Grenzen und Robustheit", () => {
  it("fängt negative Eingaben ab", () => {
    const result = rechne({
      kaufpreis: -400000,
      wohnflaeche: -80,
      eigenkapital: -1000,
      kaltmieteMonat: -1200,
      modernisierung: -5000,
      hausgeldMonat: -60,
    });
    expect(result.gesamtinvestition).toBe(0);
    expect(result.darlehen).toBe(0);
    expect(result.mieteJahr).toBe(0);
    expect(result.bruttomietrendite).toBe(0);
    expect(result.kaufpreisfaktor).toBe(0);
  });

  it("klemmt Prozentsätze auf sinnvolle Bereiche", () => {
    const result = rechne({ sollzinsPercent: 999, tilgungPercent: 999 });
    expect(result.monatsrate).toBeLessThan(300000);
    expect(Number.isFinite(result.restschuldZinsbindung)).toBe(true);
  });

  it("begrenzt den Betrachtungszeitraum auf 50 Jahre", () => {
    expect(rechne({ horizontJahre: 200 }).jahre.length).toBeLessThanOrEqual(50);
    expect(rechne({ horizontJahre: 200 }).horizontJahre).toBe(50);
  });

  it("liefert nirgends NaN oder Unendlich", () => {
    const faelle: Partial<ImmobilienInput>[] = [
      {},
      { kaufpreis: 0, kaltmieteMonat: 0, eigenkapital: 0, wohnflaeche: 0 },
      { modus: "eigennutzung" },
      { sollzinsPercent: 0, tilgungPercent: 0 },
      { horizontJahre: 1, zinsbindungJahre: 1 },
      { grenzsteuersatzPercent: 100, wertsteigerungPercent: -20 },
      { eigenkapital: 10000000 },
    ];

    for (const fall of faelle) {
      const result = rechne(fall);
      for (const [key, wert] of Object.entries(result)) {
        if (typeof wert === "number") {
          expect(Number.isFinite(wert), `${key} in ${JSON.stringify(fall)}`).toBe(
            true,
          );
        }
      }
      for (const zeile of result.jahre) {
        for (const [key, wert] of Object.entries(zeile)) {
          expect(Number.isFinite(wert), `Jahr ${zeile.jahr}, ${key}`).toBe(true);
        }
      }
    }
  });

  it("liefert für die Voreinstellung ein plausibles Ergebnis", () => {
    const result = calculateImmobilie(defaultInput());
    expect(result.nebenkostenQuote).toBeGreaterThan(5);
    expect(result.nebenkostenQuote).toBeLessThan(15);
    expect(result.bruttomietrendite).toBeGreaterThan(2);
    expect(result.bruttomietrendite).toBeLessThan(6);
    expect(result.volltilgungJahre!).toBeGreaterThan(20);
    expect(result.volltilgungJahre!).toBeLessThan(40);
  });
});

describe("Invarianten", () => {
  it("verteuert ein höherer Zins die Finanzierung monoton", () => {
    let vorher = Number.POSITIVE_INFINITY;
    for (const sollzinsPercent of [0, 1, 2, 3, 4, 5, 6]) {
      const result = rechne({ sollzinsPercent });
      expect(result.cashflowNachSteuerJahr).toBeLessThanOrEqual(vorher);
      vorher = result.cashflowNachSteuerJahr;
    }
  });

  it("verbessert eine höhere Miete den Cashflow monoton", () => {
    let vorher = Number.NEGATIVE_INFINITY;
    for (const kaltmieteMonat of [0, 500, 1000, 1500, 2000]) {
      const result = rechne({ kaltmieteMonat });
      expect(result.cashflowVorSteuerJahr).toBeGreaterThanOrEqual(vorher);
      vorher = result.cashflowVorSteuerJahr;
    }
  });

  it("skaliert die Nebenkosten linear mit dem Kaufpreis", () => {
    const klein = rechne({ kaufpreis: 200000 });
    const gross = rechne({ kaufpreis: 400000 });
    expect(gross.nebenkosten).toBeCloseTo(klein.nebenkosten * 2, 2);
    expect(gross.nebenkostenQuote).toBeCloseTo(klein.nebenkostenQuote, 6);
  });

  it("senkt mehr Eigenkapital die Restschuld", () => {
    const wenig = rechne({ eigenkapital: 50000 });
    const viel = rechne({ eigenkapital: 200000 });
    expect(viel.darlehen).toBeLessThan(wenig.darlehen);
    expect(viel.restschuldZinsbindung).toBeLessThan(wenig.restschuldZinsbindung);
    expect(viel.gesamtzinsen).toBeLessThan(wenig.gesamtzinsen);
  });
});
