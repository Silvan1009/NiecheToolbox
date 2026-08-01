import { describe, expect, it } from "vitest";
import { fromIso } from "./date";
import {
  bussUndBettag,
  easterSunday,
  holidaysFor,
  regions,
  type RegionCode,
} from "./regionen";

const ALL_CODES = regions.map((r) => r.code);
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2035];

const weekday = (iso: string) => new Date(fromIso(iso)).getUTCDay();
const isWeekendIso = (iso: string) => weekday(iso) === 0 || weekday(iso) === 6;

describe("Gauß-Osterformel", () => {
  // Belegte Ostersonntage, inklusive der beiden Ausnahmefälle der Formel.
  const known: Record<number, string> = {
    1954: "1954-04-18", // Ausnahme 2 (d=28, e=6)
    1981: "1981-04-19", // Ausnahme 1 (d=29, e=6)
    2000: "2000-04-23",
    2005: "2005-03-27",
    2008: "2008-03-23",
    2011: "2011-04-24",
    2024: "2024-03-31",
    2025: "2025-04-20",
    2026: "2026-04-05",
    2027: "2027-03-28",
    2028: "2028-04-16",
    2029: "2029-04-01",
    2030: "2030-04-21",
    2031: "2031-04-13",
    2032: "2032-03-28",
    2033: "2033-04-17",
    2034: "2034-04-09",
    2035: "2035-03-25",
    2038: "2038-04-25", // spätestmöglicher Ostertermin, ohne Ausnahmeregel
    2049: "2049-04-18", // Ausnahme 2
    2076: "2076-04-19", // Ausnahme 1
  };

  for (const [year, date] of Object.entries(known)) {
    it(`Ostersonntag ${year} ist der ${date}`, () => {
      expect(easterSunday(Number(year))).toBe(date);
    });
  }

  it("liegt immer auf einem Sonntag und zwischen 22.03. und 25.04.", () => {
    for (let year = 1900; year <= 2200; year += 1) {
      const easter = easterSunday(year);
      expect(weekday(easter)).toBe(0);
      expect(easter >= `${year}-03-22`).toBe(true);
      expect(easter <= `${year}-04-25`).toBe(true);
    }
  });
});

describe("Buß- und Bettag", () => {
  it("trifft die belegten Termine", () => {
    expect(bussUndBettag(2024)).toBe("2024-11-20");
    expect(bussUndBettag(2025)).toBe("2025-11-19");
    expect(bussUndBettag(2026)).toBe("2026-11-18");
    expect(bussUndBettag(2027)).toBe("2027-11-17");
  });

  it("ist immer der letzte Mittwoch vor dem 23. November", () => {
    for (let year = 2000; year <= 2100; year += 1) {
      const date = bussUndBettag(year);
      expect(weekday(date)).toBe(3);
      expect(date >= `${year}-11-16`).toBe(true);
      expect(date <= `${year}-11-22`).toBe(true);
    }
  });
});

describe("Feiertage je Bundesland", () => {
  // Anzahl landesweit gesetzlicher Feiertage 2026 (ohne nur regional geltende).
  const expectedCounts: Record<RegionCode, number> = {
    bw: 12,
    by: 12, // ohne Mariä Himmelfahrt, das nur regional gilt
    be: 10,
    bb: 12, // inkl. Oster- und Pfingstsonntag
    hb: 10,
    hh: 10,
    he: 10,
    mv: 11,
    ni: 10,
    nw: 11,
    rp: 11,
    sl: 12,
    sn: 11,
    st: 11,
    sh: 10,
    th: 11,
  };

  for (const code of ALL_CODES) {
    it(`${code}: ${expectedCounts[code]} landesweite Feiertage 2026`, () => {
      const counted = holidaysFor(2026, code).filter((h) => !h.partial);
      expect(counted).toHaveLength(expectedCounts[code]);
    });
  }

  it("ordnet regionale Besonderheiten korrekt zu", () => {
    const names = (code: RegionCode, year = 2026) =>
      holidaysFor(year, code).map((h) => h.name);

    expect(names("sn")).toContain("Buß- und Bettag");
    expect(names("by")).not.toContain("Buß- und Bettag");

    expect(names("nw")).toContain("Fronleichnam");
    expect(names("be")).not.toContain("Fronleichnam");

    expect(names("by")).not.toContain("Reformationstag");
    expect(names("th")).toContain("Reformationstag");

    expect(names("bw")).toContain("Heilige Drei Könige");
    expect(names("nw")).not.toContain("Heilige Drei Könige");
  });

  it("markiert nur regional geltende Feiertage als partial", () => {
    const bayern = holidaysFor(2026, "by");
    const mariae = bayern.find((h) => h.name === "Mariä Himmelfahrt");
    expect(mariae?.partial).toBe(true);

    const saarland = holidaysFor(2026, "sl");
    expect(
      saarland.find((h) => h.name === "Mariä Himmelfahrt")?.partial,
    ).toBe(false);

    const sachsen = holidaysFor(2026, "sn");
    expect(sachsen.find((h) => h.name === "Fronleichnam")?.partial).toBe(true);
  });

  it("berücksichtigt, ab wann ein Feiertag gilt", () => {
    // Frauentag: Berlin ab 2019, Mecklenburg-Vorpommern ab 2023.
    expect(holidaysFor(2018, "be").map((h) => h.name)).not.toContain(
      "Internationaler Frauentag",
    );
    expect(holidaysFor(2019, "be").map((h) => h.name)).toContain(
      "Internationaler Frauentag",
    );
    expect(holidaysFor(2022, "mv").map((h) => h.name)).not.toContain(
      "Internationaler Frauentag",
    );
    expect(holidaysFor(2023, "mv").map((h) => h.name)).toContain(
      "Internationaler Frauentag",
    );

    // Reformationstag im Norden erst ab 2018.
    expect(holidaysFor(2017, "hh").map((h) => h.name)).not.toContain(
      "Reformationstag",
    );
    expect(holidaysFor(2018, "hh").map((h) => h.name)).toContain(
      "Reformationstag",
    );
  });

  it("berücksichtigt, bis wann ein Feiertag gilt", () => {
    // Der 75. Jahrestag des Volksaufstands gilt einmalig 2028 in Berlin.
    const jahrestag = "75. Jahrestag des Volksaufstands vom 17. Juni 1953";

    expect(holidaysFor(2027, "be").map((h) => h.name)).not.toContain(jahrestag);
    expect(holidaysFor(2029, "be").map((h) => h.name)).not.toContain(jahrestag);

    const tag = holidaysFor(2028, "be").find((h) => h.name === jahrestag);
    expect(tag?.date).toBe("2028-06-17");
    // Ein Samstag – bringt also keinen zusätzlichen freien Tag.
    expect(tag?.onWeekend).toBe(true);

    // Nur Berlin, kein anderes Bundesland.
    expect(holidaysFor(2028, "bb").map((h) => h.name)).not.toContain(jahrestag);
  });

  it("liefert die Feiertage chronologisch und mit korrektem Wochentag", () => {
    const list = holidaysFor(2026, "by");
    for (let i = 1; i < list.length; i += 1) {
      expect(list[i].date >= list[i - 1].date).toBe(true);
    }
    for (const holiday of list) {
      expect(holiday.weekday).toBe(weekday(holiday.date));
      expect(holiday.onWeekend).toBe(isWeekendIso(holiday.date));
    }
  });

  it("bestätigt bekannte Wochentage in 2026", () => {
    const byDate = new Map(holidaysFor(2026, "by").map((h) => [h.name, h]));
    expect(byDate.get("Neujahr")?.date).toBe("2026-01-01");
    expect(byDate.get("Neujahr")?.weekday).toBe(4); // Donnerstag
    expect(byDate.get("Christi Himmelfahrt")?.date).toBe("2026-05-14");
    expect(byDate.get("Christi Himmelfahrt")?.weekday).toBe(4);
    // Der 3. Oktober 2026 fällt auf einen Samstag – ein verschenkter Feiertag.
    expect(byDate.get("Tag der Deutschen Einheit")?.onWeekend).toBe(true);
    expect(byDate.get("1. Weihnachtstag")?.weekday).toBe(5); // Freitag
  });

  it("legt Christi Himmelfahrt immer auf einen Donnerstag, Pfingstmontag auf einen Montag", () => {
    for (const year of YEARS) {
      const list = holidaysFor(year, "nw");
      expect(list.find((h) => h.name === "Christi Himmelfahrt")?.weekday).toBe(4);
      expect(list.find((h) => h.name === "Pfingstmontag")?.weekday).toBe(1);
      expect(list.find((h) => h.name === "Karfreitag")?.weekday).toBe(5);
      expect(list.find((h) => h.name === "Ostermontag")?.weekday).toBe(1);
    }
  });
});
