import { describe, expect, it } from "vitest";
import {
  calculateBu,
  calculateHaftpflicht,
  calculateKfz,
  defaultBuInput,
  defaultHaftpflichtInput,
  defaultKfzInput,
  type BuInput,
  type HaftpflichtInput,
  type KfzInput,
} from "./logic";

describe("Versicherungs-Vergleichsrechner – Kfz", () => {
  it("liefert bei einem Durchschnittsprofil genau den Marktdurchschnitt", () => {
    const result = calculateKfz(defaultKfzInput());
    // teilkasko-Basis: 260 + 190 = 450, alle Faktoren auf "Basis".
    expect(result.richtwert).toBe(450);
    expect(result.spanneMin).toBe(360);
    expect(result.spanneMax).toBe(540);
  });

  it("addiert Teilkasko und Vollkasko korrekt auf die Haftpflicht-Basis", () => {
    const haftpflicht = calculateKfz({
      ...defaultKfzInput(),
      deckung: "haftpflicht",
    });
    const teilkasko = calculateKfz({
      ...defaultKfzInput(),
      deckung: "teilkasko",
    });
    const vollkasko = calculateKfz({
      ...defaultKfzInput(),
      deckung: "vollkasko",
    });
    expect(haftpflicht.richtwert).toBe(260);
    expect(teilkasko.richtwert).toBe(450);
    expect(vollkasko.richtwert).toBe(590);
  });

  it("multipliziert alle Risikofaktoren am oberen Rand korrekt", () => {
    const input: KfzInput = {
      deckung: "vollkasko",
      sfKlasse: "einsteiger",
      region: "teuer",
      fahrzeug: "sport",
      fahrerAlter: "unter23",
      kmProJahr: "viel",
      eigenerBeitragJahr: 0,
    };
    const result = calculateKfz(input);
    expect(result.richtwert).toBe(4968);
    expect(result.spanneMin).toBe(3974);
    expect(result.spanneMax).toBe(5961);
  });

  it("multipliziert alle Risikofaktoren am unteren Rand korrekt", () => {
    const input: KfzInput = {
      deckung: "haftpflicht",
      sfKlasse: "maximal",
      region: "guenstig",
      fahrzeug: "klein",
      fahrerAlter: "ueber60",
      kmProJahr: "wenig",
      eigenerBeitragJahr: 0,
    };
    const result = calculateKfz(input);
    // 260 * 0,55 * 0,85 * 0,85 * 0,95 * 0,9 ≈ 88,34 -> 88 €.
    expect(result.richtwert).toBe(88);
    expect(result.richtwert).toBeLessThan(
      calculateKfz(defaultKfzInput()).richtwert,
    );
  });

  it("warnt Einsteiger vor der teuren Startklasse SF 0", () => {
    const result = calculateKfz({
      ...defaultKfzInput(),
      sfKlasse: "einsteiger",
    });
    expect(
      result.warnings.some((w) =>
        w.includes("Mitversicherung als Zweitfahrer"),
      ),
    ).toBe(true);
  });

  it("ordnet die eigene Prämie im Vergleich zur Spanne ein", () => {
    const guenstig = calculateKfz({
      ...defaultKfzInput(),
      eigenerBeitragJahr: 300,
    });
    expect(guenstig.einordnung).toBe("guenstig");

    const imRahmen = calculateKfz({
      ...defaultKfzInput(),
      eigenerBeitragJahr: 450,
    });
    expect(imRahmen.einordnung).toBe("im-rahmen");

    const erhoeht = calculateKfz({
      ...defaultKfzInput(),
      eigenerBeitragJahr: 600,
    });
    expect(erhoeht.einordnung).toBe("erhoeht");

    const deutlichErhoeht = calculateKfz({
      ...defaultKfzInput(),
      eigenerBeitragJahr: 900,
    });
    expect(deutlichErhoeht.einordnung).toBe("deutlich-erhoeht");

    const ohneAngabe = calculateKfz({
      ...defaultKfzInput(),
      eigenerBeitragJahr: 0,
    });
    expect(ohneAngabe.einordnung).toBeNull();
    expect(ohneAngabe.eigenerBeitrag).toBeNull();
  });

  it("warnt bei deutlich überhöhter eigener Prämie", () => {
    const result = calculateKfz({
      ...defaultKfzInput(),
      eigenerBeitragJahr: 900,
    });
    expect(result.warnings.some((w) => w.includes("Tarifvergleich"))).toBe(
      true,
    );
  });

  it("liefert sechs erklärende Faktoren", () => {
    const result = calculateKfz(defaultKfzInput());
    expect(result.faktoren).toHaveLength(6);
    expect(result.faktoren[0]?.label).toBe("Deckung");
  });
});

describe("Versicherungs-Vergleichsrechner – Privathaftpflicht", () => {
  it("liefert die recherchierten Richtwerte je Personenkreis", () => {
    const single = calculateHaftpflicht({
      personenkreis: "single",
      mitSelbstbeteiligung: false,
      eigenerBeitragJahr: 0,
    });
    expect(single.richtwert).toBe(35);
    expect(single.spanneMin).toBe(20);
    expect(single.spanneMax).toBe(70);

    const paar = calculateHaftpflicht({
      personenkreis: "paar",
      mitSelbstbeteiligung: false,
      eigenerBeitragJahr: 0,
    });
    expect(paar.richtwert).toBe(45);

    const familie = calculateHaftpflicht({
      personenkreis: "familie",
      mitSelbstbeteiligung: false,
      eigenerBeitragJahr: 0,
    });
    expect(familie.richtwert).toBe(60);
  });

  it("senkt die Schätzung mit Selbstbeteiligung um 10 Prozent", () => {
    const ohne = calculateHaftpflicht({
      ...defaultHaftpflichtInput(),
      mitSelbstbeteiligung: false,
    });
    const mit = calculateHaftpflicht({
      ...defaultHaftpflichtInput(),
      mitSelbstbeteiligung: true,
    });
    expect(mit.richtwert).toBeCloseTo(ohne.richtwert * 0.9, 0);
  });

  it("empfiehlt eine Selbstbeteiligung nur, wenn noch keine vereinbart ist", () => {
    const ohne = calculateHaftpflicht({
      ...defaultHaftpflichtInput(),
      mitSelbstbeteiligung: false,
    });
    expect(ohne.warnings.some((w) => w.includes("Selbstbeteiligung"))).toBe(
      true,
    );

    const mit = calculateHaftpflicht({
      ...defaultHaftpflichtInput(),
      mitSelbstbeteiligung: true,
    });
    expect(mit.warnings.some((w) => w.includes("Selbstbeteiligung"))).toBe(
      false,
    );
  });

  it("ordnet die eigene Prämie korrekt ein", () => {
    const input: HaftpflichtInput = {
      personenkreis: "familie",
      mitSelbstbeteiligung: false,
      eigenerBeitragJahr: 200,
    };
    const result = calculateHaftpflicht(input);
    expect(result.einordnung).toBe("deutlich-erhoeht");
  });
});

describe("Versicherungs-Vergleichsrechner – Berufsunfähigkeit", () => {
  it("trifft die veröffentlichte Beispielrechnung für einen Ingenieur", () => {
    const result = calculateBu({
      alterBeiEintritt: 30,
      buRenteMonat: 1000,
      risikogruppe: "niedrig",
      eigenerBeitragMonat: 0,
    });
    expect(result.richtwert).toBe(30);
  });

  it("trifft die veröffentlichte Beispielrechnung für einen Dachdecker", () => {
    const result = calculateBu({
      alterBeiEintritt: 30,
      buRenteMonat: 1000,
      risikogruppe: "hoch",
      eigenerBeitragMonat: 0,
    });
    expect(result.richtwert).toBeCloseTo(99, 0);
    // Mehr als das Dreifache eines vergleichbaren Bürojobs.
    const niedrig = calculateBu({
      alterBeiEintritt: 30,
      buRenteMonat: 1000,
      risikogruppe: "niedrig",
      eigenerBeitragMonat: 0,
    });
    expect(result.richtwert / niedrig.richtwert).toBeCloseTo(3.3, 1);
  });

  it("skaliert den Beitrag proportional zur BU-Rente", () => {
    const rente1000 = calculateBu({
      alterBeiEintritt: 30,
      buRenteMonat: 1000,
      risikogruppe: "niedrig",
      eigenerBeitragMonat: 0,
    });
    const rente2000 = calculateBu({
      alterBeiEintritt: 30,
      buRenteMonat: 2000,
      risikogruppe: "niedrig",
      eigenerBeitragMonat: 0,
    });
    expect(rente2000.richtwert).toBeCloseTo(rente1000.richtwert * 2, 0);
  });

  it("steigt mit dem Eintrittsalter deutlich an", () => {
    const jung = calculateBu({
      alterBeiEintritt: 25,
      buRenteMonat: 1500,
      risikogruppe: "mittel",
      eigenerBeitragMonat: 0,
    });
    const alt = calculateBu({
      alterBeiEintritt: 55,
      buRenteMonat: 1500,
      risikogruppe: "mittel",
      eigenerBeitragMonat: 0,
    });
    expect(alt.richtwert).toBeGreaterThan(jung.richtwert * 2);
  });

  it("berechnet die Voreinstellung korrekt", () => {
    const result = calculateBu(defaultBuInput());
    expect(result.richtwert).toBe(77);
    expect(result.spanneMin).toBe(54);
    expect(result.spanneMax).toBe(107);
  });

  it("enthält immer den Hinweis auf die individuelle Risikoprüfung", () => {
    const result = calculateBu(defaultBuInput());
    expect(result.warnings.some((w) => w.includes("Risikoprüfung"))).toBe(true);
  });

  it("warnt zusätzlich bei hoher Risikogruppe", () => {
    const hoch = calculateBu({ ...defaultBuInput(), risikogruppe: "hoch" });
    expect(hoch.warnings.length).toBeGreaterThanOrEqual(2);

    const niedrig = calculateBu({
      ...defaultBuInput(),
      risikogruppe: "niedrig",
    });
    expect(niedrig.warnings).toHaveLength(1);
  });

  it("hält Alter und BU-Rente in sinnvollen Grenzen", () => {
    const input: BuInput = {
      alterBeiEintritt: -5,
      buRenteMonat: 999999,
      risikogruppe: "mittel",
      eigenerBeitragMonat: 0,
    };
    const result = calculateBu(input);
    expect(Number.isFinite(result.richtwert)).toBe(true);
    expect(result.richtwert).toBeGreaterThan(0);
  });
});
