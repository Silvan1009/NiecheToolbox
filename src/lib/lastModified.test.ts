import { describe, expect, it } from "vitest";
import { formatGermanDate, isIsoDate, lastModifiedKey } from "./lastModified";

describe("formatGermanDate", () => {
  it("schreibt das Datum deutsch aus", () => {
    expect(formatGermanDate("2026-10-02")).toBe("2. Oktober 2026");
    expect(formatGermanDate("2027-03-31")).toBe("31. März 2027");
  });

  // Über `Intl` und ein Date-Objekt wäre der 1. Januar auf einer Maschine
  // westlich von UTC der 31. Dezember des Vorjahres.
  it("verschiebt den Tag nicht über eine Zeitzone", () => {
    expect(formatGermanDate("2027-01-01")).toBe("1. Januar 2027");
  });
});

describe("isIsoDate", () => {
  it("lässt nur ein reines Datum durch", () => {
    expect(isIsoDate("2026-10-02")).toBe(true);
    expect(isIsoDate("2026-10-02T12:00:00Z")).toBe(false);
    expect(isIsoDate("")).toBe(false);
    expect(isIsoDate(undefined)).toBe(false);
  });
});

describe("lastModifiedKey", () => {
  it("trennt Tools, Wege und Einzelseiten", () => {
    expect(lastModifiedKey.tool("bmi")).toBe("tools/bmi");
    expect(lastModifiedKey.weg("hauskauf")).toBe("wege/hauskauf");
    expect(lastModifiedKey.page("ueber")).toBe("seite/ueber");
  });
});
