import { describe, expect, it } from "vitest";
import { bewerteNachwuchs } from "./urteil";

describe("bewerteNachwuchs", () => {
  it("stuft eine deutliche Lücke als eng ein", () => {
    // Nachgerechnetes Beispiel: 4.200 € Brutto, Steuerklasse 1, NRW; 12+2
    // Monate Elternzeit, Basiselterngeld, ein Kind.
    const urteil = bewerteNachwuchs({
      nettoVorGeburtMonat: 2712.58,
      elterngeldPlusKindergeldMonat: 2022.18,
    });

    expect(urteil.deltaMonat).toBeCloseTo(-690.4, 1);
    expect(urteil.ersatzquoteProzent).not.toBeNull();
    expect(urteil.ersatzquoteProzent).toBeCloseTo(74.5, 1);
    expect(urteil.einstufung).toBe("tragbar");
  });

  it("stuft eine volle Deckung als komfortabel ein", () => {
    const urteil = bewerteNachwuchs({
      nettoVorGeburtMonat: 2000,
      elterngeldPlusKindergeldMonat: 1900,
    });

    expect(urteil.ersatzquoteProzent).toBe(95);
    expect(urteil.einstufung).toBe("komfortabel");
  });

  it("stuft eine sehr niedrige Quote als eng ein", () => {
    const urteil = bewerteNachwuchs({
      nettoVorGeburtMonat: 3000,
      elterngeldPlusKindergeldMonat: 1500,
    });

    expect(urteil.ersatzquoteProzent).toBe(50);
    expect(urteil.einstufung).toBe("eng");
  });

  it("liefert null und eng ohne Netto vor der Geburt, nicht 0", () => {
    const urteil = bewerteNachwuchs({
      nettoVorGeburtMonat: 0,
      elterngeldPlusKindergeldMonat: 500,
    });
    expect(urteil.ersatzquoteProzent).toBeNull();
    expect(urteil.einstufung).toBe("eng");
  });
});
