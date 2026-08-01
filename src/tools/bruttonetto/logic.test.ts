import { describe, expect, it } from "vitest";
import {
  calculateBruttoNetto,
  defaultInput,
  type BruttoNettoInput,
} from "./logic";
import {
  BBG_KRANKEN,
  BBG_RENTE,
  GRUNDFREIBETRAG,
  einkommensteuer,
  kirchensteuersatz,
} from "@/lib/steuerdaten";

/**
 * Basisfall: 4.000 Euro im Monat, Steuerklasse I, Nordrhein-Westfalen,
 * kinderlos, keine Kirchensteuer, durchschnittlicher Zusatzbeitrag.
 *
 * Für genau diesen Fall weisen mehrere veröffentlichte Rechner für 2026 ein
 * Netto von 2.606 bis 2.608 Euro aus. Der Rechner hier landet bei 2.605,50 –
 * die Abweichung von unter einem Promille ist die Feinsteuerung der amtlichen
 * Programmablaufpläne, die hier bewusst fehlt.
 */
const base: BruttoNettoInput = {
  brutto: 4000,
  zeitraum: "monat",
  steuerklasse: 1,
  region: "nw",
  kirchensteuerpflichtig: false,
  kinderfreibetraege: 0,
  kinderZahl: 0,
  kinderlos: true,
  gesetzlichVersichert: true,
  zusatzbeitragPercent: 2.9,
  privatBeitragMonat: 0,
  rentenversicherungspflichtig: true,
};

const rechne = (overrides: Partial<BruttoNettoInput> = {}) =>
  calculateBruttoNetto({ ...base, ...overrides });

describe("Einkommensteuertarif § 32a EStG 2026", () => {
  it("lässt den Grundfreibetrag steuerfrei", () => {
    expect(einkommensteuer(GRUNDFREIBETRAG)).toBe(0);
    expect(einkommensteuer(12348)).toBe(0);
    expect(einkommensteuer(0)).toBe(0);
  });

  it("rechnet die erste Progressionszone", () => {
    // y = (15.000 − 12.348)/10.000 = 0,2652
    // (914,51 · 0,2652 + 1400) · 0,2652 = 435,58 → abgerundet 435
    expect(einkommensteuer(15000)).toBe(435);
  });

  it("rechnet die zweite Progressionszone", () => {
    // z = (40.000 − 17.799)/10.000 = 2,2201
    // (173,10 · 2,2201 + 2397) · 2,2201 + 1034,87
    // = (384,30 + 2397) · 2,2201 + 1034,87 = 6174,76 + 1034,87 = 7209,63 → 7209
    expect(einkommensteuer(40000)).toBe(7209);
  });

  it("rechnet die Proportionalzone mit 42 Prozent", () => {
    // 0,42 · 100.000 − 11.135,63 = 30.864,37 → 30.864
    expect(einkommensteuer(100000)).toBe(30864);
  });

  it("rechnet die Zone des Spitzensteuersatzes mit 45 Prozent", () => {
    // 0,45 · 300.000 − 19.470,38 = 115.529,62 → 115.529
    expect(einkommensteuer(300000)).toBe(115529);
  });

  it("steigt an den Zonengrenzen ohne Sprung", () => {
    for (const grenze of [12348, 17799, 69878, 277825]) {
      const davor = einkommensteuer(grenze);
      const danach = einkommensteuer(grenze + 1);
      expect(danach).toBeGreaterThanOrEqual(davor);
      // Ein Euro mehr darf nie mehr als einen Euro Steuer auslösen.
      expect(danach - davor).toBeLessThanOrEqual(1);
    }
  });
});

describe("Sozialabgaben", () => {
  it("rechnet alle vier Zweige auf den Bruttolohn", () => {
    const result = rechne();
    // 48.000 im Jahr, alles unter beiden Bemessungsgrenzen.
    expect(result.rentenversicherungJahr).toBeCloseTo(4464, 2); // 9,3 %
    expect(result.arbeitslosenversicherungJahr).toBeCloseTo(624, 2); // 1,3 %
    expect(result.krankenversicherungJahr).toBeCloseTo(4200, 2); // 7,3 + 1,45
    expect(result.pflegeversicherungJahr).toBeCloseTo(1152, 2); // 1,8 + 0,6
    expect(result.sozialabgabenGesamtJahr).toBeCloseTo(10440, 2);
  });

  it("deckelt Kranken- und Pflegebeitrag an der Bemessungsgrenze", () => {
    const hoch = rechne({ brutto: 200000, zeitraum: "jahr" });
    // 69.750 × 8,75 % beziehungsweise × 2,4 %.
    expect(hoch.krankenversicherungJahr).toBeCloseTo(
      (BBG_KRANKEN * 8.75) / 100,
      2,
    );
    expect(hoch.pflegeversicherungJahr).toBeCloseTo((BBG_KRANKEN * 2.4) / 100, 2);
    // Und die Rente an ihrer eigenen, höheren Grenze.
    expect(hoch.rentenversicherungJahr).toBeCloseTo((BBG_RENTE * 9.3) / 100, 2);
  });

  it("erhebt den Kinderlosenzuschlag nur ohne Kinder", () => {
    const ohneKinder = rechne();
    const mitKind = rechne({ kinderlos: false, kinderZahl: 1 });
    // 0,6 Prozentpunkte auf 48.000 sind 288 Euro im Jahr.
    expect(ohneKinder.pflegeversicherungJahr - mitKind.pflegeversicherungJahr)
      .toBeCloseTo(288, 2);
  });

  it("mindert den Pflegebeitrag ab dem zweiten Kind", () => {
    const einKind = rechne({ kinderlos: false, kinderZahl: 1 });
    const dreiKinder = rechne({ kinderlos: false, kinderZahl: 3 });
    // Zwei Abschläge à 0,25 Punkte auf 48.000 sind 240 Euro.
    expect(einKind.pflegeversicherungJahr - dreiKinder.pflegeversicherungJahr)
      .toBeCloseTo(240, 2);
  });

  it("deckelt den Abschlag beim fünften Kind", () => {
    const fuenf = rechne({ kinderlos: false, kinderZahl: 5 });
    const zehn = rechne({ kinderlos: false, kinderZahl: 10 });
    expect(fuenf.pflegeversicherungJahr).toBeCloseTo(
      zehn.pflegeversicherungJahr,
      2,
    );
  });

  it("verteilt die Pflegeversicherung in Sachsen anders", () => {
    const nrw = rechne();
    const sachsen = rechne({ region: "sn" });
    // 0,5 Punkte mehr für den Arbeitnehmer: 240 Euro auf 48.000.
    expect(sachsen.pflegeversicherungJahr - nrw.pflegeversicherungJahr)
      .toBeCloseTo(240, 2);
    // Der Arbeitgeber zahlt entsprechend weniger.
    expect(sachsen.arbeitgeberAnteilJahr).toBeLessThan(nrw.arbeitgeberAnteilJahr);
  });

  it("lässt die Sozialabgaben ohne Versicherungspflicht entfallen", () => {
    const result = rechne({ rentenversicherungspflichtig: false });
    expect(result.rentenversicherungJahr).toBe(0);
    expect(result.arbeitslosenversicherungJahr).toBe(0);
  });
});

describe("Vorsorgepauschale", () => {
  it("rechnet mit dem ermäßigten Krankenkassensatz", () => {
    const result = rechne();
    // Rente 4.464 + KV 48.000 × (7,0 + 1,45) % = 4.056 + PV 1.152 = 9.672.
    // Der Arbeitslosen-Teilbetrag entfällt, weil KV und PV zusammen schon
    // über 1.900 Euro liegen.
    expect(result.vorsorgepauschale).toBeCloseTo(9672, 2);
  });

  it("liegt unter den tatsächlichen Beiträgen", () => {
    // Der ermäßigte Satz von 14,0 statt 14,6 Prozent ist der ganze Grund.
    const result = rechne();
    expect(result.vorsorgepauschale).toBeLessThan(
      result.sozialabgabenGesamtJahr,
    );
  });

  it("berücksichtigt den Arbeitslosen-Teilbetrag nur bei kleinen Löhnen", () => {
    // Bei 12.000 Euro im Jahr sind KV und PV zusammen rund 1.302 Euro,
    // es bleibt also Luft bis 1.900 – der neue Teilbetrag greift.
    const klein = rechne({ brutto: 12000, zeitraum: "jahr" });
    const kvPv = klein.krankenversicherungJahr + klein.pflegeversicherungJahr;
    expect(kvPv).toBeLessThan(1900);
    // Rentenanteil plus KV/PV nach Pauschalsätzen plus etwas Arbeitslosigkeit.
    expect(klein.vorsorgepauschale).toBeGreaterThan(
      klein.rentenversicherungJahr,
    );
  });

  it("kennt in Steuerklasse VI keinen Arbeitslosen-Teilbetrag", () => {
    const fuenf = rechne({ brutto: 12000, zeitraum: "jahr", steuerklasse: 5 });
    const sechs = rechne({ brutto: 12000, zeitraum: "jahr", steuerklasse: 6 });
    expect(sechs.vorsorgepauschale).toBeLessThan(fuenf.vorsorgepauschale);
  });
});

describe("Lohnsteuer und Netto", () => {
  it("trifft den veröffentlichten Vergleichswert für 4.000 Euro", () => {
    const result = rechne();
    expect(result.zuVersteuerndesEinkommen).toBeCloseTo(37062, 2);
    expect(result.lohnsteuerJahr).toBe(6294);
    expect(result.nettoMonat).toBeCloseTo(2605.5, 2);
    // Veröffentlichte Rechner für 2026 nennen 2.606 bis 2.608 Euro.
    expect(Math.abs(result.nettoMonat - 2606)).toBeLessThan(5);
  });

  it("zieht in Steuerklasse VI keine Pauschbeträge ab", () => {
    const eins = rechne();
    const sechs = rechne({ steuerklasse: 6 });
    // 1.230 + 36 Euro mehr zu versteuern.
    expect(sechs.zuVersteuerndesEinkommen - eins.zuVersteuerndesEinkommen)
      .toBeCloseTo(1266, 2);
    expect(sechs.nettoMonat).toBeLessThan(eins.nettoMonat);
  });

  it("besteuert Steuerklasse III über den Splittingtarif", () => {
    const drei = rechne({ steuerklasse: 3 });
    const eins = rechne();
    expect(drei.lohnsteuerJahr).toBeLessThan(eins.lohnsteuerJahr);
    // Splittingtarif heißt: Steuer für das halbe Einkommen, verdoppelt.
    expect(drei.lohnsteuerJahr).toBe(
      2 * einkommensteuer(drei.zuVersteuerndesEinkommen / 2),
    );
  });

  it("belastet Steuerklasse V deutlich stärker als Klasse I", () => {
    const fuenf = rechne({ steuerklasse: 5 });
    const eins = rechne();
    expect(fuenf.lohnsteuerJahr).toBeGreaterThan(eins.lohnsteuerJahr);
  });

  it("erhebt in Klasse V Steuer ab dem ersten Euro", () => {
    // Der Grundfreibetrag liegt beim Partner in Klasse III.
    const result = rechne({ brutto: 12000, zeitraum: "jahr", steuerklasse: 5 });
    expect(result.lohnsteuerJahr).toBeGreaterThan(0);
  });

  it("gewährt in Klasse II den Entlastungsbetrag für Alleinerziehende", () => {
    const eins = rechne({ kinderlos: false, kinderZahl: 1 });
    const zwei = rechne({ steuerklasse: 2, kinderlos: false, kinderZahl: 1 });
    // 4.260 Euro weniger zu versteuern.
    expect(eins.zuVersteuerndesEinkommen - zwei.zuVersteuerndesEinkommen)
      .toBeCloseTo(4260, 2);
  });

  it("erhöht den Entlastungsbetrag je weiterem Kind", () => {
    // Der Vergleich läuft über die Steuerklasse und nicht über die Kinderzahl:
    // Mehr Kinder senken zugleich den Pflegebeitrag, das verkleinert die
    // Vorsorgepauschale und hebt das zu versteuernde Einkommen wieder an.
    // Bei gleicher Kinderzahl ist der Entlastungsbetrag der einzige
    // Unterschied zwischen Klasse I und II.
    const kinder = { kinderlos: false, kinderZahl: 3 } as const;
    const klasse1 = rechne(kinder);
    const klasse2 = rechne({ ...kinder, steuerklasse: 2 });

    // 4.260 Euro Grundbetrag plus zweimal 240 Euro für das zweite und dritte Kind.
    expect(klasse1.zuVersteuerndesEinkommen - klasse2.zuVersteuerndesEinkommen)
      .toBeCloseTo(4740, 2);
  });
});

describe("Solidaritätszuschlag", () => {
  it("fällt unterhalb der Freigrenze nicht an", () => {
    expect(rechne().soliJahr).toBe(0);
  });

  it("fällt oberhalb der Freigrenze an", () => {
    const hoch = rechne({ brutto: 150000, zeitraum: "jahr" });
    expect(hoch.lohnsteuerJahr).toBeGreaterThan(20350);
    expect(hoch.soliJahr).toBeGreaterThan(0);
  });

  it("begrenzt den Zuschlag in der Milderungszone", () => {
    // Direkt über der Freigrenze darf der Soli nicht springen, sondern nur
    // mit 11,9 Prozent des übersteigenden Betrags ansteigen.
    const knapp = rechne({ brutto: 96000, zeitraum: "jahr" });
    if (knapp.lohnsteuerJahr > 20350) {
      const voll = (knapp.lohnsteuerJahr * 5.5) / 100;
      expect(knapp.soliJahr).toBeLessThanOrEqual(voll);
    }
  });

  it("verdoppelt die Freigrenze in Steuerklasse III", () => {
    const drei = rechne({ brutto: 150000, zeitraum: "jahr", steuerklasse: 3 });
    const eins = rechne({ brutto: 150000, zeitraum: "jahr" });
    expect(drei.soliJahr).toBeLessThan(eins.soliJahr);
  });
});

describe("Kirchensteuer", () => {
  it("fällt nur bei Kirchenzugehörigkeit an", () => {
    expect(rechne().kirchensteuerJahr).toBe(0);
    expect(rechne({ kirchensteuerpflichtig: true }).kirchensteuerJahr)
      .toBeGreaterThan(0);
  });

  it("rechnet 8 Prozent in Bayern und 9 Prozent in NRW", () => {
    expect(kirchensteuersatz("by")).toBe(8);
    expect(kirchensteuersatz("bw")).toBe(8);
    expect(kirchensteuersatz("nw")).toBe(9);

    const bayern = rechne({ region: "by", kirchensteuerpflichtig: true });
    const nrw = rechne({ region: "nw", kirchensteuerpflichtig: true });
    expect(bayern.kirchensteuerJahr).toBeCloseTo(
      (bayern.lohnsteuerJahr * 8) / 100,
      2,
    );
    expect(nrw.kirchensteuerJahr).toBeGreaterThan(bayern.kirchensteuerJahr);
  });
});

describe("Kinderfreibeträge", () => {
  it("mindern die Lohnsteuer nicht", () => {
    const ohne = rechne({ kirchensteuerpflichtig: true });
    const mit = rechne({ kirchensteuerpflichtig: true, kinderfreibetraege: 2 });
    // Für die Lohnsteuer gibt es Kindergeld statt Freibetrag.
    expect(mit.lohnsteuerJahr).toBe(ohne.lohnsteuerJahr);
  });

  it("mindern aber Solidaritätszuschlag und Kirchensteuer", () => {
    const ohne = rechne({ kirchensteuerpflichtig: true });
    const mit = rechne({ kirchensteuerpflichtig: true, kinderfreibetraege: 2 });
    expect(mit.kirchensteuerJahr).toBeLessThan(ohne.kirchensteuerJahr);
    expect(mit.nettoMonat).toBeGreaterThan(ohne.nettoMonat);
  });
});

describe("Kennzahlen", () => {
  it("rechnet die Abgabenquote auf das Brutto", () => {
    const result = rechne();
    expect(result.abgabenquoteProzent).toBeCloseTo(
      (result.abzuegeGesamtJahr / result.bruttoJahr) * 100,
      6,
    );
  });

  it("rechnet, was von 100 Euro mehr Brutto bleibt", () => {
    const result = rechne();
    expect(result.netto100Euro).toBeGreaterThan(0);
    expect(result.netto100Euro).toBeLessThan(100);
    expect(result.grenzbelastungProzent).toBeCloseTo(
      100 - result.netto100Euro,
      6,
    );
  });

  it("lässt oberhalb der Bemessungsgrenzen mehr von 100 Euro übrig", () => {
    // Über der Grenze fallen keine Kranken- und Pflegebeiträge mehr an –
    // die Grenzbelastung sinkt trotz höherem Steuersatz.
    const normal = rechne();
    const hoch = rechne({ brutto: 150000, zeitraum: "jahr" });
    expect(hoch.netto100Euro).toBeGreaterThan(normal.netto100Euro);
  });

  it("rechnet die Arbeitgeberkosten als Brutto plus Arbeitgeberanteil", () => {
    const result = rechne();
    expect(result.arbeitgeberkostenJahr).toBeCloseTo(
      result.bruttoJahr + result.arbeitgeberAnteilJahr,
      2,
    );
    expect(result.arbeitgeberkostenJahr).toBeGreaterThan(result.bruttoJahr);
  });

  it("rechnet Monats- und Jahresangaben ineinander um", () => {
    const proMonat = rechne({ brutto: 4000, zeitraum: "monat" });
    const proJahr = rechne({ brutto: 48000, zeitraum: "jahr" });
    expect(proMonat.nettoJahr).toBeCloseTo(proJahr.nettoJahr, 6);
    expect(proMonat.bruttoJahr).toBeCloseTo(48000, 6);
  });
});

describe("Randfälle", () => {
  it("liefert bei Brutto null keine NaN", () => {
    const result = rechne({ brutto: 0 });
    expect(result.nettoMonat).toBe(0);
    expect(result.abgabenquoteProzent).toBe(0);
    expect(Number.isFinite(result.steuersatzDurchschnittProzent)).toBe(true);
  });

  it("klemmt unsinnige Eingaben", () => {
    const result = rechne({
      brutto: -5000,
      zusatzbeitragPercent: Number.NaN,
      kinderZahl: Number.POSITIVE_INFINITY,
    });
    expect(Number.isFinite(result.nettoJahr)).toBe(true);
    expect(result.nettoJahr).toBe(0);
  });

  it("rechnet privat Versicherte mit ihrem Beitrag", () => {
    const privat = rechne({
      gesetzlichVersichert: false,
      privatBeitragMonat: 800,
      brutto: 100000,
      zeitraum: "jahr",
    });
    expect(privat.pflegeversicherungJahr).toBe(0);
    // Der Arbeitgeber gibt die Hälfte dazu, gedeckelt auf den GKV-Höchstsatz.
    expect(privat.krankenversicherungJahr).toBeCloseTo(9600 / 2, 2);
    expect(privat.warnings.join(" ")).not.toContain("kein Beitrag eingetragen");
  });

  it("weist immer auf den Schätzcharakter hin", () => {
    expect(rechne().warnings.join(" ")).toContain("Schätzung");
  });

  it("warnt in den Steuerklassen V und VI vor der Näherung", () => {
    expect(rechne({ steuerklasse: 5 }).warnings.join(" ")).toContain(
      "Programmablaufpläne",
    );
    expect(rechne({ steuerklasse: 6 }).warnings.join(" ")).toContain(
      "Programmablaufpläne",
    );
  });
});

describe("Voreinstellung", () => {
  it("rechnet mit den Startwerten ein plausibles Ergebnis", () => {
    const result = calculateBruttoNetto(defaultInput());
    expect(result.bruttoMonat).toBe(4000);
    expect(result.nettoMonat).toBeCloseTo(2605.5, 2);
    expect(result.abgabenquoteProzent).toBeGreaterThan(30);
    expect(result.abgabenquoteProzent).toBeLessThan(40);
  });
});
