import { describe, expect, it } from "vitest";
import { calculateElterngeld, defaultInput, type ElterngeldInput } from "./logic";

describe("Elterngeld-Rechner", () => {
  it("berechnet die Voreinstellung: 2.200 € Netto, 65 % Ersatzrate", () => {
    const result = calculateElterngeld(defaultInput());
    expect(result.ersatzrate).toBe(65);
    expect(result.basisbetragMonat).toBe(1430);
    expect(result.gesamtbetrag).toBe(17_160);
  });

  it("hält die Ersatzrate zwischen 1.000 und 1.200 € bei genau 67 %", () => {
    const result = calculateElterngeld({
      ...defaultInput(),
      nettoEinkommenVorGeburt: 1_100,
    });
    expect(result.ersatzrate).toBe(67);
    expect(result.basisbetragMonat).toBe(737);
  });

  it("erhöht die Ersatzrate über die Geringverdienerregelung bis 100 %", () => {
    const result = calculateElterngeld({
      ...defaultInput(),
      nettoEinkommenVorGeburt: 340,
    });
    expect(result.ersatzrate).toBe(100);
    expect(result.basisbetragMonat).toBe(340);
    expect(result.warnings.some((w) => w.includes("Geringverdienerregelung"))).toBe(true);
  });

  it("deckelt die Ersatzrate ab 1.240 € bei 65 %", () => {
    const knapp = calculateElterngeld({ ...defaultInput(), nettoEinkommenVorGeburt: 1_240 });
    const hoch = calculateElterngeld({ ...defaultInput(), nettoEinkommenVorGeburt: 5_000 });
    expect(knapp.ersatzrate).toBe(65);
    expect(hoch.ersatzrate).toBe(65);
    expect(hoch.warnings.some((w) => w.includes("nicht weiter"))).toBe(true);
  });

  it("zahlt mindestens den Mindestbetrag von 300 € ohne Einkommen", () => {
    const result = calculateElterngeld({ ...defaultInput(), nettoEinkommenVorGeburt: 0 });
    expect(result.basisbetragMonat).toBe(300);
    expect(result.warnings.some((w) => w.includes("Mindestbetrag"))).toBe(true);
  });

  it("deckelt den Monatsbetrag beim Höchstbetrag von 1.800 €", () => {
    const result = calculateElterngeld({
      ...defaultInput(),
      nettoEinkommenVorGeburt: 10_000,
    });
    expect(result.basisbetragMonat).toBe(1_800);
    expect(result.warnings.some((w) => w.includes("Höchstbetrag"))).toBe(true);
  });

  it("berechnet den Geschwisterbonus als 10 % oder mindestens 75 €", () => {
    const hoch = calculateElterngeld({ ...defaultInput(), geschwisterbonus: true });
    expect(hoch.geschwisterbonusMonat).toBe(143); // 10 % von 1.430 €
    expect(hoch.vollerMonatsbetrag).toBe(1_573);

    const niedrig = calculateElterngeld({
      ...defaultInput(),
      nettoEinkommenVorGeburt: 500,
      geschwisterbonus: true,
    });
    expect(niedrig.geschwisterbonusMonat).toBe(75); // Mindestbetrag greift
  });

  it("addiert 300 € Mehrlingszuschlag je zusätzlichem Kind", () => {
    const zwillinge = calculateElterngeld({ ...defaultInput(), mehrlingsKinder: 1 });
    expect(zwillinge.mehrlingszuschlagMonat).toBe(300);
    expect(zwillinge.vollerMonatsbetrag).toBe(1_730);

    const drillinge = calculateElterngeld({ ...defaultInput(), mehrlingsKinder: 2 });
    expect(drillinge.mehrlingszuschlagMonat).toBe(600);
  });

  it("zahlt bei ElterngeldPlus die Hälfte über die doppelte Anzahl Monate aus", () => {
    const basis = calculateElterngeld({ ...defaultInput(), modus: "basis", bezugsmonate: 12 });
    const plus = calculateElterngeld({ ...defaultInput(), modus: "plus", bezugsmonate: 12 });

    expect(plus.ausgezahlterMonatsbetrag).toBeCloseTo(basis.ausgezahlterMonatsbetrag / 2, 6);
    expect(plus.bezugsmonateEffektiv).toBe(24);
    expect(basis.bezugsmonateEffektiv).toBe(12);
    // In Summe zahlen beide Varianten denselben Gesamtbetrag aus.
    expect(plus.gesamtbetrag).toBeCloseTo(basis.gesamtbetrag, 6);
  });

  it("warnt bei mehr als 12 Basismonaten vor der Partnermonate-Voraussetzung", () => {
    const result = calculateElterngeld({ ...defaultInput(), bezugsmonate: 14 });
    expect(result.warnings.some((w) => w.includes("Partnermonate"))).toBe(true);

    const zwoelf = calculateElterngeld({ ...defaultInput(), bezugsmonate: 12 });
    expect(zwoelf.warnings.some((w) => w.includes("Partnermonate"))).toBe(false);
  });

  it("hält Bezugsmonate im gültigen Bereich von 1 bis 14", () => {
    const input: ElterngeldInput = { ...defaultInput(), bezugsmonate: 30 };
    const result = calculateElterngeld(input);
    expect(result.bezugsmonateEffektiv).toBeLessThanOrEqual(28);
  });

  it("fängt negative und unsinnige Eingaben ab", () => {
    const result = calculateElterngeld({
      ...defaultInput(),
      nettoEinkommenVorGeburt: -500,
      mehrlingsKinder: -3,
    });
    expect(result.basisbetragMonat).toBe(300);
    expect(result.mehrlingszuschlagMonat).toBe(0);
    expect(Number.isFinite(result.gesamtbetrag)).toBe(true);
  });
});
