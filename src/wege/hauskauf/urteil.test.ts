import { describe, expect, it } from "vitest";
import {
  BELASTUNGSQUOTE_ENG,
  BELASTUNGSQUOTE_KOMFORTABEL,
  bewerteHauskauf,
  RESTSCHULD_RISIKO_ANTEIL,
  type HauskaufUrteilInput,
} from "./urteil";

const base: HauskaufUrteilInput = {
  belastungMonat: 1000,
  nettoMonat: 4000,
  darlehen: 300000,
  restschuldZinsbindung: 200000,
};

const bewerte = (overrides: Partial<HauskaufUrteilInput> = {}) =>
  bewerteHauskauf({ ...base, ...overrides });

describe("Belastungsquote und Einstufung", () => {
  it("komfortabel unter 30 Prozent", () => {
    const urteil = bewerte({ belastungMonat: 1000, nettoMonat: 4000 }); // 25 %
    expect(urteil.belastungsquote).toBeCloseTo(25, 5);
    expect(urteil.einstufung).toBe("komfortabel");
  });

  it("tragbar an der Untergrenze von 30 Prozent – < ist strikt, nicht mehr komfortabel", () => {
    const urteil = bewerte({ belastungMonat: 1200, nettoMonat: 4000 }); // 30 %
    expect(urteil.belastungsquote).toBeCloseTo(BELASTUNGSQUOTE_KOMFORTABEL, 5);
    expect(urteil.einstufung).toBe("tragbar");
  });

  it("tragbar in der Mitte", () => {
    const urteil = bewerte({ belastungMonat: 1500, nettoMonat: 4000 }); // 37,5 %
    expect(urteil.belastungsquote).toBeCloseTo(37.5, 5);
    expect(urteil.einstufung).toBe("tragbar");
  });

  it("tragbar an der Obergrenze von 40 Prozent – <= ist inklusiv", () => {
    const urteil = bewerte({ belastungMonat: 1600, nettoMonat: 4000 }); // 40 %
    expect(urteil.belastungsquote).toBeCloseTo(BELASTUNGSQUOTE_ENG, 5);
    expect(urteil.einstufung).toBe("tragbar");
  });

  it("eng über 40 Prozent", () => {
    const urteil = bewerte({ belastungMonat: 1700, nettoMonat: 4000 }); // 42,5 %
    expect(urteil.belastungsquote).toBeCloseTo(42.5, 5);
    expect(urteil.einstufung).toBe("eng");
  });

  it("ohne Nettoeinkommen: Quote null, erzwungen eng, nie 0 % oder komfortabel", () => {
    const urteil = bewerte({ nettoMonat: 0 });
    expect(urteil.belastungsquote).toBeNull();
    expect(urteil.einstufung).toBe("eng");
  });
});

describe("Liquiditätspuffer", () => {
  it("ist die Differenz aus Netto und Belastung, auch negativ", () => {
    const urteil = bewerte({ nettoMonat: 4000, belastungMonat: 4500 });
    expect(urteil.liquiditaetspuffer).toBeCloseTo(-500, 5);
  });

  it("ist positiv, wenn die Belastung klein ist", () => {
    const urteil = bewerte({ nettoMonat: 4000, belastungMonat: 1000 });
    expect(urteil.liquiditaetspuffer).toBeCloseTo(3000, 5);
  });
});

describe("Restschuld-Risiko", () => {
  it("greift über 70 Prozent der Darlehenssumme", () => {
    const urteil = bewerte({ darlehen: 300000, restschuldZinsbindung: 230000 }); // 76,67 %
    expect(urteil.restschuldQuote).toBeCloseTo(76.67, 1);
    expect(urteil.restschuldRisiko).toBe(true);
  });

  it("greift nicht unter 70 Prozent", () => {
    const urteil = bewerte({ darlehen: 300000, restschuldZinsbindung: 200000 }); // 66,67 %
    expect(urteil.restschuldQuote).toBeCloseTo(66.67, 1);
    expect(urteil.restschuldRisiko).toBe(false);
  });

  it("greift nicht genau an der Grenze von 70 Prozent – strikt >", () => {
    const urteil = bewerte({ darlehen: 300000, restschuldZinsbindung: 210000 }); // genau 70 %
    expect(urteil.restschuldQuote).toBeCloseTo(RESTSCHULD_RISIKO_ANTEIL, 5);
    expect(urteil.restschuldRisiko).toBe(false);
  });

  it("ohne Darlehen: Quote null, kein Risiko – Barkauf", () => {
    const urteil = bewerte({ darlehen: 0, restschuldZinsbindung: 0 });
    expect(urteil.restschuldQuote).toBeNull();
    expect(urteil.restschuldRisiko).toBe(false);
  });
});
