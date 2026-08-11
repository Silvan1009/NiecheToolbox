import { describe, expect, it } from "vitest";
import { toEuro } from "@/lib/finanzmath";
import {
  anspruchsende,
  calculateKindergeld,
  decodeKinder,
  defaultInput,
  encodeKinder,
  type KindergeldInput,
  type KindInput,
} from "./logic";

const kind = (
  geburtsdatum: string,
  status: KindInput["status"] = "regulaer",
): KindInput => ({
  geburtsdatum,
  status,
});

const base: KindergeldInput = {
  kinder: [kind("2018-05-10")],
  heute: "2026-07-01",
  jahr: 2026,
  zvE: 60000,
  veranlagung: "zusammen",
  kirchensteuer: false,
  region: "by",
};

const rechne = (overrides: Partial<KindergeldInput> = {}) =>
  calculateKindergeld({ ...base, ...overrides });

describe("Kindergeld", () => {
  it("zahlt 2026 genau 259 Euro je Kind und Monat", () => {
    const result = rechne();
    expect(result.satz).toBe(259);
    expect(toEuro(result.monatlichC)).toBeCloseTo(259, 2);
    expect(toEuro(result.jahrC)).toBeCloseTo(3108, 2);
  });

  it("summiert ueber mehrere Kinder", () => {
    const result = rechne({
      kinder: [kind("2015-04-02"), kind("2018-09-11"), kind("2021-06-30")],
    });
    expect(result.anzahlBerechtigt).toBe(3);
    expect(toEuro(result.monatlichC)).toBeCloseTo(777, 2);
  });

  it("kennt den niedrigeren Satz frueherer Jahre", () => {
    expect(rechne({ jahr: 2025 }).satz).toBe(255);
    expect(rechne({ jahr: 2024 }).satz).toBe(250);
  });

  it("meldet einen noch nicht beschlossenen Satz als extrapoliert", () => {
    const result = rechne({ jahr: 2030 });
    expect(result.satzExtrapoliert).toBe(true);
    expect(result.satz).toBe(259);
    expect(result.warnings.join(" ")).toContain("noch kein Kindergeldsatz");
  });

  it("meldet einen bekannten Satz nicht als extrapoliert", () => {
    expect(rechne({ jahr: 2026 }).satzExtrapoliert).toBe(false);
  });

  it("zahlt ohne Kind nichts", () => {
    const result = rechne({ kinder: [] });
    expect(result.monatlichC).toBe(0);
    expect(result.warnings.join(" ")).toContain("kein Kind erfasst");
  });
});

describe("Anspruchsdauer", () => {
  it("endet regulaer mit dem Monat des 18. Geburtstags", () => {
    expect(anspruchsende("2018-05-10", "regulaer")).toBe("2036-05-31");
  });

  it("verlaengert sich bei Ausbildung bis 25", () => {
    expect(anspruchsende("2018-05-10", "ausbildung")).toBe("2043-05-31");
  });

  it("verlaengert sich bei Arbeitsuche bis 21", () => {
    expect(anspruchsende("2018-05-10", "arbeitsuchend")).toBe("2039-05-31");
  });

  it("klemmt den 29. Februar auf den Monatsletzten", () => {
    // 2008 war ein Schaltjahr, 2026 ist keins.
    expect(anspruchsende("2008-02-29", "regulaer")).toBe("2026-02-28");
  });

  it("zaehlt die verbleibenden Zahlungsmonate", () => {
    // Von Juli 2026 bis Mai 2036 sind es 118 Monate.
    const result = rechne();
    expect(result.kinder[0]!.restmonate).toBe(118);
  });

  it("Gegenprobe: Restanspruch ist Restmonate mal Satz", () => {
    const result = rechne();
    const k = result.kinder[0]!;
    expect(k.restanspruchC).toBe(k.restmonate * 25900);
  });

  it("erkennt ein Kind ohne laufenden Anspruch", () => {
    const result = rechne({ kinder: [kind("1995-03-01")] });
    const k = result.kinder[0]!;
    expect(k.anspruchAktuell).toBe(false);
    expect(k.restmonate).toBe(0);
    expect(result.anzahlBerechtigt).toBe(0);
    expect(result.warnings.join(" ")).toContain("bereits abgelaufen");
  });

  it("zaehlt ein abgelaufenes Kind weder bei Zahlung noch Freibetrag", () => {
    const result = rechne({
      kinder: [kind("2018-05-10"), kind("1995-03-01")],
    });
    expect(result.anzahlBerechtigt).toBe(1);
    expect(toEuro(result.monatlichC)).toBeCloseTo(259, 2);
  });

  it("nennt das Alter in vollendeten Jahren", () => {
    expect(rechne().kinder[0]!.alter).toBe(8);
  });

  it("verwirft ein unbrauchbares Geburtsdatum", () => {
    const result = rechne({ kinder: [kind("2026-02-31"), kind("2018-05-10")] });
    expect(result.kinder).toHaveLength(1);
  });
});

describe("Guenstigerpruefung", () => {
  it("laesst bei mittlerem Einkommen das Kindergeld gewinnen", () => {
    const result = rechne({ zvE: 60000 });
    expect(result.guenstiger).toBe("kindergeld");
    expect(result.steuervorteilC).toBeLessThan(result.jahrC);
  });

  it("laesst bei hohem Einkommen den Freibetrag gewinnen", () => {
    const result = rechne({ zvE: 150000 });
    expect(result.guenstiger).toBe("freibetrag");
    expect(result.steuervorteilC).toBeGreaterThan(result.jahrC);
  });

  it("hat einen Umschlagpunkt zwischen beiden Einkommen", () => {
    const niedrig = rechne({ zvE: 60000 });
    const hoch = rechne({ zvE: 150000 });
    expect(niedrig.guenstiger).not.toBe(hoch.guenstiger);
  });

  it("der Steuervorteil waechst monoton mit dem Einkommen", () => {
    const werte = [40000, 70000, 100000, 200000].map(
      (zvE) => rechne({ zvE }).steuervorteilC,
    );
    for (let i = 1; i < werte.length; i++) {
      expect(werte[i]!).toBeGreaterThanOrEqual(werte[i - 1]!);
    }
  });

  it("gibt den Abstand zur schlechteren Variante an", () => {
    const result = rechne({ zvE: 60000 });
    expect(result.vorteilC).toBe(
      Math.abs(result.steuervorteilC - result.jahrC),
    );
  });

  it("bringt unterhalb des Grundfreibetrags keinen Steuervorteil", () => {
    const result = rechne({ zvE: 10000 });
    expect(result.steuervorteilC).toBe(0);
    expect(result.guenstiger).toBe("kindergeld");
    expect(result.warnings.join(" ")).toContain("Grundfreibetrag");
  });

  it("weist immer auf die Grenzen der Naeherung hin", () => {
    expect(rechne().warnings.join(" ")).toContain("keine Steuerberatung");
  });
});

describe("Freibetrag", () => {
  it("gilt zusammenveranlagt in voller Hoehe je Kind", () => {
    const result = rechne();
    // 6.828 Kinderfreibetrag + 2.928 Betreuungsfreibetrag
    expect(toEuro(result.freibetragGesamtC)).toBeCloseTo(9756, 2);
  });

  it("gibt einzelveranlagt genau die Haelfte", () => {
    const zusammen = rechne({ veranlagung: "zusammen" }).freibetragGesamtC;
    const einzeln = rechne({ veranlagung: "einzeln" }).freibetragGesamtC;
    expect(einzeln * 2).toBe(zusammen);
  });

  it("vervielfacht sich mit der Zahl der Kinder", () => {
    const result = rechne({
      kinder: [kind("2015-04-02"), kind("2018-09-11")],
    });
    expect(toEuro(result.freibetragGesamtC)).toBeCloseTo(19512, 2);
  });

  it("vergleicht einzelveranlagt gegen das halbe Kindergeld", () => {
    // Halber Freibetrag darf nur gegen halbes Kindergeld antreten – sonst
    // koennte der Freibetrag bei Einzelveranlagung nie gewinnen.
    const result = rechne({ veranlagung: "einzeln" });
    expect(result.kindergeldVergleichC * 2).toBe(result.jahrC);
  });

  it("rechnet zusammenveranlagt gegen das volle Kindergeld", () => {
    const result = rechne({ veranlagung: "zusammen" });
    expect(result.kindergeldVergleichC).toBe(result.jahrC);
  });

  it("laesst den Freibetrag einzelveranlagt frueher gewinnen", () => {
    // Beide Seiten halbiert – die Schwelle liegt deutlich unter der von
    // Zusammenveranlagten.
    expect(rechne({ zvE: 60000, veranlagung: "einzeln" }).guenstiger).toBe(
      "freibetrag",
    );
    expect(rechne({ zvE: 60000, veranlagung: "zusammen" }).guenstiger).toBe(
      "kindergeld",
    );
  });

  it("weist Einzelveranlagte auf die Halbierung hin", () => {
    const result = rechne({ veranlagung: "einzeln" });
    expect(result.warnings.join(" ")).toContain("halbe Kindergeld");
  });

  it("senkt die Steuer gegenueber der Rechnung ohne Kinder", () => {
    const result = rechne({ zvE: 90000 });
    expect(result.steuerMitC).toBeLessThan(result.steuerOhneC);
    expect(result.steuervorteilC).toBe(result.steuerOhneC - result.steuerMitC);
  });
});

describe("Soli und Kirchensteuer", () => {
  it("bemisst den Soli nach der Steuer mit Kinderfreibetrag", () => {
    /*
     * § 3 Abs. 2 SolZG: Bemessungsgrundlage ist immer die Steuer *mit*
     * Kinderfreibetrag, unabhängig vom Ausgang der Günstigerprüfung.
     * Der Freibetrag senkt den Soli also selbst dort, wo er für die
     * Einkommensteuer selbst gar nicht angesetzt würde.
     */
    const result = rechne({ zvE: 150000, veranlagung: "zusammen" });
    expect(result.soliEntlastungC).toBeGreaterThan(0);
  });

  it("faellt unterhalb der Freigrenze nicht an", () => {
    const result = rechne({ zvE: 40000, veranlagung: "zusammen" });
    expect(result.soliEntlastungC).toBe(0);
  });

  it("nutzt zusammenveranlagt die doppelte Freigrenze", () => {
    const einzeln = rechne({ zvE: 90000, veranlagung: "einzeln" });
    const zusammen = rechne({ zvE: 90000, veranlagung: "zusammen" });
    expect(einzeln.soliEntlastungC).toBeGreaterThan(zusammen.soliEntlastungC);
  });

  it("rechnet Kirchensteuer nur auf Wunsch", () => {
    expect(
      rechne({ zvE: 90000, kirchensteuer: false }).kirchensteuerEntlastungC,
    ).toBe(0);
    expect(
      rechne({ zvE: 90000, kirchensteuer: true }).kirchensteuerEntlastungC,
    ).toBeGreaterThan(0);
  });

  it("nutzt in Bayern acht statt neun Prozent", () => {
    const bayern = rechne({ zvE: 90000, kirchensteuer: true, region: "by" });
    const hessen = rechne({ zvE: 90000, kirchensteuer: true, region: "he" });
    expect(bayern.kirchensteuerEntlastungC).toBeLessThan(
      hessen.kirchensteuerEntlastungC,
    );
  });

  it("zaehlt die Kirchensteuerentlastung zum Kindergeld hinzu", () => {
    const result = rechne({ zvE: 60000, kirchensteuer: true });
    expect(result.guenstiger).toBe("kindergeld");
    // Kindergeld *plus* Entlastung, nicht statt dessen.
    expect(result.kirchensteuerEntlastungC).toBeGreaterThan(0);
    expect(result.gesamtentlastungC).toBe(
      result.kindergeldVergleichC +
        result.soliEntlastungC +
        result.kirchensteuerEntlastungC,
    );
    expect(result.gesamtentlastungC).toBeGreaterThan(result.jahrC);
  });

  it("rechnet bei gewinnendem Freibetrag mit dem Steuervorteil", () => {
    const result = rechne({ zvE: 150000, kirchensteuer: true });
    expect(result.guenstiger).toBe("freibetrag");
    expect(result.gesamtentlastungC).toBe(
      result.steuervorteilC +
        result.soliEntlastungC +
        result.kirchensteuerEntlastungC,
    );
  });
});

describe("Kodierung fuer die URL", () => {
  it("ist verlustfrei hin und zurueck", () => {
    const kinder = [
      kind("2018-03-14", "regulaer"),
      kind("2005-07-02", "ausbildung"),
      kind("2004-01-20", "arbeitsuchend"),
    ];
    expect(decodeKinder(encodeKinder(kinder), [])).toEqual(kinder);
  });

  it("schreibt ein kurzes, lesbares Format", () => {
    expect(encodeKinder([kind("2018-03-14")])).toBe("2018-03-14r");
    expect(encodeKinder([kind("2005-07-02", "ausbildung")])).toBe(
      "2005-07-02a",
    );
  });

  it("faellt bei Muell auf den Fallback zurueck", () => {
    const fallback = [kind("2018-05-10")];
    expect(decodeKinder("kaputt", fallback)).toEqual(fallback);
    expect(decodeKinder("", fallback)).toEqual(fallback);
    expect(decodeKinder(null, fallback)).toEqual(fallback);
    expect(decodeKinder(undefined, fallback)).toEqual(fallback);
  });

  it("verwirft einzelne kaputte Eintraege und behaelt die guten", () => {
    const result = decodeKinder("2018-03-14r,unsinn,2021-06-30a", []);
    expect(result).toEqual([
      kind("2018-03-14", "regulaer"),
      kind("2021-06-30", "ausbildung"),
    ]);
  });

  it("verwirft ein unbekanntes Statuszeichen", () => {
    expect(decodeKinder("2018-03-14x", [])).toEqual([]);
  });
});

describe("Robustheit", () => {
  it("klemmt unsinnige Eingaben statt NaN zu liefern", () => {
    const result = rechne({
      zvE: Number.NaN,
      jahr: Number.POSITIVE_INFINITY,
      heute: "kein Datum",
      kinder: [kind("nicht real"), kind("2018-05-10")],
    });

    expect(Number.isFinite(result.monatlichC)).toBe(true);
    expect(Number.isFinite(result.steuervorteilC)).toBe(true);
    expect(Number.isFinite(result.gesamtentlastungC)).toBe(true);
    expect(result.kinder).toHaveLength(1);
  });

  it("bleibt bei negativem Einkommen bei null Steuer", () => {
    const result = rechne({ zvE: -50000 });
    expect(result.steuerOhneC).toBe(0);
    expect(result.steuervorteilC).toBe(0);
  });

  it("verkraftet sehr viele Kinder", () => {
    const viele = Array.from({ length: 20 }, () => kind("2018-05-10"));
    const result = rechne({ kinder: viele });
    expect(result.kinder.length).toBeLessThanOrEqual(12);
    expect(Number.isFinite(result.jahrC)).toBe(true);
  });
});

describe("Voreinstellung", () => {
  it("ergibt ein plausibles Ergebnis", () => {
    const result = calculateKindergeld(defaultInput());
    expect(result.anzahlBerechtigt).toBe(1);
    expect(toEuro(result.monatlichC)).toBeGreaterThan(200);
    expect(result.kinder[0]!.alter).toBe(8);
  });

  it("startet mit einem Kind, das noch lange Anspruch hat", () => {
    const result = calculateKindergeld(defaultInput());
    expect(result.kinder[0]!.anspruchAktuell).toBe(true);
    expect(result.kinder[0]!.restmonate).toBeGreaterThan(100);
  });
});
