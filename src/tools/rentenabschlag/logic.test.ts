import { describe, expect, it } from "vitest";
import { calculateRentenabschlag, defaultInput, type RentenabschlagInput } from "./logic";

describe("Rentenabschlags-Rechner", () => {
  it("berechnet die Voreinstellung: Jahrgang 1985, Renteneintritt mit 63", () => {
    const result = calculateRentenabschlag(defaultInput());
    expect(result.regelaltersgrenzeJahre).toBe(67);
    expect(result.regelaltersgrenzeMonate).toBe(0);
    expect(result.differenzMonate).toBe(-48);
    expect(result.abschlagProzent).toBeCloseTo(14.4, 6);
    expect(result.zuschlagProzent).toBe(0);
    expect(result.renteMitAnpassung).toBeCloseTo(1_369.6, 2);
    expect(result.differenzMonatlich).toBeCloseTo(-230.4, 2);
    expect(result.kumulierterEffekt).toBeCloseTo(-60_825.6, 1);
  });

  it("liefert die gestaffelte Regelaltersgrenze für ältere Jahrgänge korrekt", () => {
    const j1947 = calculateRentenabschlag({ ...defaultInput(), geburtsjahr: 1947 });
    expect(j1947.regelaltersgrenzeJahre).toBe(65);
    expect(j1947.regelaltersgrenzeMonate).toBe(1);

    const j1955 = calculateRentenabschlag({ ...defaultInput(), geburtsjahr: 1955 });
    expect(j1955.regelaltersgrenzeJahre).toBe(65);
    expect(j1955.regelaltersgrenzeMonate).toBe(9);

    const j1958 = calculateRentenabschlag({ ...defaultInput(), geburtsjahr: 1958 });
    expect(j1958.regelaltersgrenzeJahre).toBe(66);
    expect(j1958.regelaltersgrenzeMonate).toBe(0);

    const j1960 = calculateRentenabschlag({ ...defaultInput(), geburtsjahr: 1960 });
    expect(j1960.regelaltersgrenzeJahre).toBe(66);
    expect(j1960.regelaltersgrenzeMonate).toBe(4);

    const j1964 = calculateRentenabschlag({ ...defaultInput(), geburtsjahr: 1964 });
    expect(j1964.regelaltersgrenzeJahre).toBe(67);
    expect(j1964.regelaltersgrenzeMonate).toBe(0);
  });

  it("berechnet weder Abschlag noch Zuschlag bei Renteneintritt zur Regelaltersgrenze", () => {
    const result = calculateRentenabschlag({
      ...defaultInput(),
      geburtsjahr: 1985,
      geplantesAlterJahre: 67,
      geplantesAlterMonate: 0,
    });
    expect(result.differenzMonate).toBe(0);
    expect(result.abschlagProzent).toBe(0);
    expect(result.zuschlagProzent).toBe(0);
    expect(result.renteMitAnpassung).toBeCloseTo(result.differenzMonatlich + 1_600, 2);
    expect(result.differenzMonatlich).toBe(0);
    expect(
      result.warnings.some((w) => w.includes("weder Abschlag noch Zuschlag")),
    ).toBe(true);
  });

  it("berechnet den Zuschlag für einen späteren Renteneintritt ohne Deckelung", () => {
    const result = calculateRentenabschlag({
      ...defaultInput(),
      geburtsjahr: 1985,
      geplantesAlterJahre: 69,
      geplantesAlterMonate: 0,
    });
    expect(result.differenzMonate).toBe(24);
    expect(result.zuschlagProzent).toBe(12);
    expect(result.abschlagProzent).toBe(0);
    expect(result.renteMitAnpassung).toBeCloseTo(1_792, 2);
    expect(result.warnings.some((w) => w.includes("keine gesetzliche Obergrenze"))).toBe(true);
  });

  it("deckelt den Abschlag bei 48 Monaten auf 14,4 Prozent", () => {
    const result = calculateRentenabschlag({
      ...defaultInput(),
      geburtsjahr: 1985,
      geplantesAlterJahre: 60,
      geplantesAlterMonate: 0,
    });
    // 84 Monate früher als die Regelaltersgrenze, gedeckelt auf 48 Monate.
    expect(result.abschlagProzent).toBeCloseTo(14.4, 6);
    expect(
      result.warnings.some((w) => w.includes("gesetzlich auf 14,4 Prozent gedeckelt")),
    ).toBe(true);
  });

  it("berechnet den kumulierten Effekt über die Rentenbezugsdauer", () => {
    const result = calculateRentenabschlag({
      ...defaultInput(),
      geplantesAlterJahre: 63,
      lebenserwartung: 85,
    });
    expect(result.jahreRentenbezug).toBe(22);
    expect(result.kumulierterEffekt).toBeCloseTo(result.differenzMonatlich * 12 * 22, 1);
  });

  it("warnt lebenslang über den kumulierten Effekt, wenn ein Abschlag besteht", () => {
    const result = calculateRentenabschlag(defaultInput());
    expect(result.warnings.some((w) => w.includes("lebenslang"))).toBe(true);
  });

  it("hält die Rentenbezugsdauer bei mindestens null Jahren", () => {
    const result = calculateRentenabschlag({
      ...defaultInput(),
      geplantesAlterJahre: 70,
      lebenserwartung: 71,
    });
    expect(result.jahreRentenbezug).toBeGreaterThanOrEqual(0);
  });

  it("fängt negative und unsinnige Eingaben ab", () => {
    const input: RentenabschlagInput = {
      geburtsjahr: 1985,
      geplantesAlterJahre: 63,
      geplantesAlterMonate: 0,
      erwarteteRegelrente: -500,
      lebenserwartung: 85,
    };
    const result = calculateRentenabschlag(input);
    expect(result.renteMitAnpassung).toBe(0);
    expect(Number.isFinite(result.kumulierterEffekt)).toBe(true);
  });

  it("hält das geplante Renteneintrittsalter in einem plausiblen Bereich", () => {
    const zuFrueh = calculateRentenabschlag({ ...defaultInput(), geplantesAlterJahre: 10 });
    const zuSpaet = calculateRentenabschlag({ ...defaultInput(), geplantesAlterJahre: 200 });
    expect(Number.isFinite(zuFrueh.abschlagProzent)).toBe(true);
    expect(Number.isFinite(zuSpaet.zuschlagProzent)).toBe(true);
  });
});
