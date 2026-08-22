import { describe, expect, it } from "vitest";
import { bewerteAutokauf } from "./urteil";

describe("bewerteAutokauf", () => {
  it("stuft einen hohen Anteil als eng ein", () => {
    // Nachgerechnetes Beispiel: 28.000 € Auto, 5.000 € Anzahlung, 6 Jahre
    // Kredit, Teilkasko-Richtwert, 4.000 € Brutto/Steuerklasse 1/NRW.
    const urteil = bewerteAutokauf({
      gesamtkostenMonat: 829,
      nettoMonat: 2605.5,
    });

    expect(urteil.anteilProzent).not.toBeNull();
    expect(urteil.anteilProzent).toBeCloseTo(31.8, 1);
    expect(urteil.einstufung).toBe("eng");
  });

  it("stuft einen niedrigen Anteil als komfortabel ein", () => {
    const urteil = bewerteAutokauf({
      gesamtkostenMonat: 300,
      nettoMonat: 3000,
    });

    expect(urteil.anteilProzent).toBe(10);
    expect(urteil.einstufung).toBe("komfortabel");
  });

  it("stuft einen mittleren Anteil als tragbar ein", () => {
    const urteil = bewerteAutokauf({
      gesamtkostenMonat: 600,
      nettoMonat: 3000,
    });

    expect(urteil.anteilProzent).toBe(20);
    expect(urteil.einstufung).toBe("tragbar");
  });

  it("liefert null und eng ohne Nettoeinkommen, nicht 0", () => {
    const urteil = bewerteAutokauf({ gesamtkostenMonat: 500, nettoMonat: 0 });
    expect(urteil.anteilProzent).toBeNull();
    expect(urteil.einstufung).toBe("eng");
  });
});
