import { describe, expect, it } from "vitest";
import { calculateRentenluecke, defaultInput, type RentenlueckeInput } from "./logic";

describe("Rentenlücken-Rechner", () => {
  it("rechnet die Voreinstellung ohne Fehler durch", () => {
    const result = calculateRentenluecke(defaultInput());
    expect(result.jahreBisRente).toBe(32);
    expect(result.jahreRentenbezug).toBe(18);
    expect(result.gewuenschtesEinkommen).toBeCloseTo(2400, 6);
    expect(result.erwarteteRente).toBe(1400);
    expect(result.monatlicheLuecke).toBeCloseTo(1000, 6);
    expect(result.kapitalbedarf).toBeGreaterThan(0);
    expect(result.projiziertesKapital).toBeGreaterThan(0);
  });

  it("berechnet die monatliche Lücke aus Wunscheinkommen minus erwarteter Rente", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      einkommenModus: "fest",
      gewuenschtesEinkommenFest: 2500,
      gesetzlicheRente: 1400,
      weitereRenten: 100,
    };
    const result = calculateRentenluecke(input);
    expect(result.gewuenschtesEinkommen).toBe(2500);
    expect(result.erwarteteRente).toBe(1500);
    expect(result.monatlicheLuecke).toBeCloseTo(1000, 6);
  });

  it("setzt die Lücke auf null, wenn die erwartete Rente das Wunscheinkommen deckt", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      einkommenModus: "fest",
      gewuenschtesEinkommenFest: 2000,
      gesetzlicheRente: 1800,
      weitereRenten: 500,
    };
    const result = calculateRentenluecke(input);
    expect(result.monatlicheLuecke).toBe(0);
    expect(result.kapitalbedarf).toBe(0);
    expect(result.kapitalLuecke).toBe(0);
    expect(result.zielErreichbar).toBe(true);
    expect(
      result.warnings.some((w) => w.includes("deckt das Wunscheinkommen bereits")),
    ).toBe(true);
  });

  it("rechnet das Versorgungsniveau als Prozentsatz vom Nettoeinkommen", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      einkommenModus: "prozent",
      nettoEinkommen: 4000,
      versorgungsniveauPercent: 75,
    };
    const result = calculateRentenluecke(input);
    expect(result.gewuenschtesEinkommen).toBeCloseTo(3000, 6);
  });

  it("berechnet den Kapitalbedarf als Barwert einer Rente über die Rentenbezugsdauer", () => {
    // Realrendite in der Rentenphase aus 5 % nominal und 2 % Inflation: ≈ 2,9412 %.
    // Barwert einer nachschüssigen Rente von 800 €/Monat über 240 Monate: 145.529,32 €.
    const input: RentenlueckeInput = {
      ...defaultInput(),
      aktuellesAlter: 67,
      renteneintrittsalter: 67,
      lebenserwartung: 87,
      einkommenModus: "fest",
      gewuenschtesEinkommenFest: 800,
      gesetzlicheRente: 0,
      weitereRenten: 0,
      renditeRentenphasePercent: 5,
      inflationPercent: 2,
      vorhandenesVermoegen: 0,
      monatlicheSparrate: 0,
    };
    const result = calculateRentenluecke(input);
    expect(result.jahreBisRente).toBe(0);
    expect(result.jahreRentenbezug).toBe(20);
    expect(result.kapitalbedarf).toBeCloseTo(145529.32, 1);
  });

  it("rechnet den Kapitalbedarf ohne Rundung, wenn die Realrendite in der Rentenphase null ist", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      aktuellesAlter: 67,
      renteneintrittsalter: 67,
      lebenserwartung: 87,
      einkommenModus: "fest",
      gewuenschtesEinkommenFest: 1000,
      gesetzlicheRente: 0,
      weitereRenten: 0,
      renditeRentenphasePercent: 2,
      inflationPercent: 2,
    };
    const result = calculateRentenluecke(input);
    // Reale Rendite 0 % -> Kapitalbedarf ist schlicht Monatsrate mal Monate.
    expect(result.kapitalbedarf).toBeCloseTo(1000 * 20 * 12, 6);
  });

  it("projiziert das Kapital aus vorhandenem Vermögen und Sparrate über die Ansparphase", () => {
    // Realrendite in der Ansparphase aus 6 % nominal und 2 % Inflation: ≈ 3,9216 %.
    // 10.000 € vorhanden, 200 €/Monat über 120 Monate -> 44.007,50 €.
    const input: RentenlueckeInput = {
      ...defaultInput(),
      aktuellesAlter: 57,
      renteneintrittsalter: 67,
      vorhandenesVermoegen: 10000,
      monatlicheSparrate: 200,
      renditeAnsparphasePercent: 6,
      inflationPercent: 2,
    };
    const result = calculateRentenluecke(input);
    expect(result.jahreBisRente).toBe(10);
    expect(result.projiziertesKapital).toBeCloseTo(44007.5, 1);
    expect(result.jahre).toHaveLength(10);
    expect(result.jahre[9]?.kapitalEnde).toBeCloseTo(44007.5, 1);
  });

  it("schließt die Kapitallücke tatsächlich, wenn die zusätzliche Sparrate angewendet wird", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      aktuellesAlter: 40,
      renteneintrittsalter: 67,
      vorhandenesVermoegen: 5000,
      monatlicheSparrate: 50,
    };
    const result = calculateRentenluecke(input);
    expect(result.kapitalLuecke).toBeGreaterThan(0);
    expect(result.zusaetzlicheSparrateNoetig).toBeGreaterThan(0);
    expect(result.sparrateGesamtNoetig).toBeCloseTo(
      input.monatlicheSparrate + result.zusaetzlicheSparrateNoetig,
      6,
    );

    // Wer die insgesamt nötige Rate spart, erreicht das Zielkapital tatsächlich.
    const geschlossen = calculateRentenluecke({
      ...input,
      monatlicheSparrate: result.sparrateGesamtNoetig,
    });
    expect(geschlossen.projiziertesKapital).toBeGreaterThanOrEqual(
      geschlossen.kapitalbedarf - 1,
    );
    expect(geschlossen.kapitalLuecke).toBeLessThanOrEqual(1);
  });

  it("markiert das Ziel als erreichbar, wenn vorhandenes Kapital und Sparrate ausreichen", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      aktuellesAlter: 60,
      renteneintrittsalter: 67,
      vorhandenesVermoegen: 500000,
      monatlicheSparrate: 500,
    };
    const result = calculateRentenluecke(input);
    expect(result.kapitalLuecke).toBe(0);
    expect(result.zusaetzlicheSparrateNoetig).toBe(0);
    expect(result.zielErreichbar).toBe(true);
  });

  it("kann eine zusätzliche Sparrate nicht mehr vorschlagen, wenn der Ruhestand schon begonnen hat", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      aktuellesAlter: 70,
      renteneintrittsalter: 67,
      vorhandenesVermoegen: 0,
      monatlicheSparrate: 0,
    };
    const result = calculateRentenluecke(input);
    expect(result.jahreBisRente).toBe(0);
    expect(result.kapitalLuecke).toBeGreaterThan(0);
    expect(result.zusaetzlicheSparrateNoetig).toBe(0);
    expect(
      result.warnings.some((w) => w.includes("nicht mehr in der Zukunft")),
    ).toBe(true);
  });

  it("fängt negative und unsinnige Eingaben ab", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      nettoEinkommen: -1000,
      gesetzlicheRente: -500,
      weitereRenten: -100,
      vorhandenesVermoegen: -5000,
      monatlicheSparrate: -50,
    };
    const result = calculateRentenluecke(input);
    expect(result.erwarteteRente).toBe(0);
    expect(result.projiziertesKapital).toBe(0);
    expect(result.eingezahltGesamt).toBe(0);
    expect(Number.isFinite(result.kapitalbedarf)).toBe(true);
  });

  it("hält jahreRentenbezug bei mindestens einem Jahr, auch bei niedriger Lebenserwartung", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      renteneintrittsalter: 67,
      lebenserwartung: 60,
    };
    const result = calculateRentenluecke(input);
    expect(result.jahreRentenbezug).toBeGreaterThanOrEqual(1);
  });

  it("liefert die reale Rendite konsistent mit der Fisher-Gleichung", () => {
    const input: RentenlueckeInput = {
      ...defaultInput(),
      renditeAnsparphasePercent: 7,
      renditeRentenphasePercent: 4,
      inflationPercent: 2,
    };
    const result = calculateRentenluecke(input);
    expect(result.realeRenditeAnsparphase).toBeCloseTo(
      ((1.07 / 1.02 - 1) * 100),
      6,
    );
    expect(result.realeRenditeRentenphase).toBeCloseTo(
      ((1.04 / 1.02 - 1) * 100),
      6,
    );
  });
});
