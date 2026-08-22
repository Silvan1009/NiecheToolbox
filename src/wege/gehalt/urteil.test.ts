import { describe, expect, it } from "vitest";
import { bewerteGehalt } from "./urteil";

describe("bewerteGehalt", () => {
  it("rechnet die Grenzbelastung aus Brutto-Plus und Netto-Plus", () => {
    // Nachgerechnetes Beispiel: 4.000 € Ausgangsgehalt, 3 % Erhöhung,
    // Steuerklasse I, NRW, keine Kirchensteuer, gesetzlich versichert.
    const urteil = bewerteGehalt({
      bruttoPlusMonat: 120,
      nettoPlusMonat: 64,
    });

    expect(urteil.bruttoPlusMonat).toBe(120);
    expect(urteil.nettoPlusMonat).toBe(64);
    expect(urteil.grenzbelastungProzent).not.toBeNull();
    expect(urteil.grenzbelastungProzent).toBeCloseTo(46.7, 1);
  });

  it("liefert null ohne Brutto-Plus, nicht 0", () => {
    const urteil = bewerteGehalt({ bruttoPlusMonat: 0, nettoPlusMonat: 0 });
    expect(urteil.grenzbelastungProzent).toBeNull();
  });

  it("kappt ein negatives Brutto-Plus auf 0", () => {
    const urteil = bewerteGehalt({ bruttoPlusMonat: -50, nettoPlusMonat: -30 });
    expect(urteil.bruttoPlusMonat).toBe(0);
    expect(urteil.grenzbelastungProzent).toBeNull();
  });

  it("die Grenzbelastung steigt leicht mit höherem Ausgangsgehalt (Beitragsbemessungsgrenzen bleiben außen vor)", () => {
    // Aus derselben Nachrechnung: 4.000 € Basis, 3 % vs. 15 % Erhöhung.
    const klein = bewerteGehalt({ bruttoPlusMonat: 120, nettoPlusMonat: 64 });
    const gross = bewerteGehalt({ bruttoPlusMonat: 600, nettoPlusMonat: 318 });

    expect(klein.grenzbelastungProzent).not.toBeNull();
    expect(gross.grenzbelastungProzent).not.toBeNull();
    expect(gross.grenzbelastungProzent!).toBeGreaterThan(
      klein.grenzbelastungProzent!,
    );
  });
});
