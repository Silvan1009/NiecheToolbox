import { describe, expect, it } from "vitest";
import {
  calculateGeburtstermin,
  defaultInput,
  STANDARD_ZYKLUS_TAGE,
  type GeburtsterminInput,
} from "./logic";

const rechne = (overrides: Partial<GeburtsterminInput> = {}) =>
  calculateGeburtstermin({
    letzteRegel: "2026-01-01",
    zykluslaengeTage: STANDARD_ZYKLUS_TAGE,
    heute: "2026-01-01",
    ...overrides,
  });

describe("Naegele-Regel", () => {
  it("rechnet LMP + 7 Tage + 9 Monate bei Standardzyklus", () => {
    expect(rechne().errechneterTermin).toBe("2026-10-08");
  });

  it("klemmt am Monatsende korrekt (Dezember auf 31 Tage, Ziel-September hat 30)", () => {
    const result = rechne({ letzteRegel: "2025-12-24" });
    expect(result.effektiveLmp).toBe("2025-12-24");
    expect(result.errechneterTermin).toBe("2026-09-30");
  });

  it("verschiebt den Termin bei längerem Zyklus um genau die Differenz", () => {
    const standard = rechne({ zykluslaengeTage: 28 }).errechneterTermin;
    const lang = rechne({ zykluslaengeTage: 35 }).errechneterTermin;
    expect(lang).toBe("2026-10-15");
    expect(standard).toBe("2026-10-08");
  });

  it("verschiebt den Termin bei kürzerem Zyklus rückwärts", () => {
    const result = rechne({ zykluslaengeTage: 21 });
    expect(result.errechneterTermin).toBe("2026-10-01");
  });
});

describe("Schwangerschaftswoche", () => {
  it("zaehlt SSW und Tag ab der effektiven LMP", () => {
    const result = rechne({ heute: "2026-04-09" }); // 98 Tage nach LMP
    expect(result.ssw).toBe(14);
    expect(result.sswTag).toBe(0);
  });

  it("rechnet SSW 13+x als erstes Trimester", () => {
    const result = rechne({ heute: "2026-04-02" }); // 91 Tage = SSW 13
    expect(result.ssw).toBe(13);
    expect(result.trimester).toBe(1);
  });

  it("rechnet SSW 14 als zweites Trimester", () => {
    expect(rechne({ heute: "2026-04-09" }).trimester).toBe(2);
  });

  it("rechnet SSW 27 noch als zweites, SSW 28 als drittes Trimester", () => {
    // 2025-01-01 + 189 Tage (27 Wochen) = 2025-07-09.
    const woche27 = rechne({ letzteRegel: "2025-01-01", heute: "2025-07-09" });
    expect(woche27.ssw).toBe(27);
    expect(woche27.trimester).toBe(2);

    // 2025-01-01 + 196 Tage (28 Wochen) = 2025-07-16.
    const woche28 = rechne({ letzteRegel: "2025-01-01", heute: "2025-07-16" });
    expect(woche28.ssw).toBe(28);
    expect(woche28.trimester).toBe(3);
  });
});

describe("üblicher Geburtszeitraum", () => {
  it("liegt 14 Tage vor und nach dem errechneten Termin", () => {
    const result = rechne();
    expect(result.fruehesterZeitraum).toBe("2026-09-24");
    expect(result.spaetesterZeitraum).toBe("2026-10-22");
  });
});

describe("Ungültige Eingaben", () => {
  it("meldet ein fehlendes Datum statt zu rechnen", () => {
    const result = calculateGeburtstermin({
      letzteRegel: "",
      zykluslaengeTage: 28,
      heute: "2026-01-01",
    });
    expect(result.gueltig).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it("warnt bei einer letzten Periode in der Zukunft", () => {
    const result = rechne({ letzteRegel: "2026-06-01", heute: "2026-01-01" });
    expect(result.warnings.join(" ")).toContain("nach dem heutigen Datum");
  });
});

describe("Voreinstellung", () => {
  it("ergibt ein plausibles Ergebnis rund um SSW 10", () => {
    const result = calculateGeburtstermin(defaultInput());
    expect(result.gueltig).toBe(true);
    expect(result.ssw).toBe(10);
    expect(result.trimester).toBe(1);
  });
});
