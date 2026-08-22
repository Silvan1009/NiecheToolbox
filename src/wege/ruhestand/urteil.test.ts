import { describe, expect, it } from "vitest";
import { bewerteRuhestand } from "./urteil";

describe("bewerteRuhestand", () => {
  it("erkennt einen Fehlbetrag", () => {
    // Nachgerechnetes Beispiel: 40 Jahre, Renteneintritt mit 63, Regelrente
    // 1.700 €, 80 % Versorgungsniveau bei 3.200 € Netto.
    const urteil = bewerteRuhestand({
      kapitalbedarf: 262384,
      projiziertesKapital: 159551,
    });

    expect(urteil.differenz).toBe(-102833);
    expect(urteil.gedeckt).toBe(false);
  });

  it("erkennt einen Überschuss", () => {
    const urteil = bewerteRuhestand({
      kapitalbedarf: 100000,
      projiziertesKapital: 120000,
    });

    expect(urteil.differenz).toBe(20000);
    expect(urteil.gedeckt).toBe(true);
  });

  it("ist bei exakt gedecktem Kapital ein Überschuss von 0", () => {
    const urteil = bewerteRuhestand({
      kapitalbedarf: 50000,
      projiziertesKapital: 50000,
    });

    expect(urteil.differenz).toBe(0);
    expect(urteil.gedeckt).toBe(true);
  });

  it("kappt negative Eingaben auf 0", () => {
    const urteil = bewerteRuhestand({
      kapitalbedarf: -10,
      projiziertesKapital: -5,
    });

    expect(urteil.kapitalbedarf).toBe(0);
    expect(urteil.projiziertesKapital).toBe(0);
    expect(urteil.differenz).toBe(0);
    expect(urteil.gedeckt).toBe(true);
  });
});
