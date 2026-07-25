import { describe, expect, it } from "vitest";
import {
  DAY_MS,
  bussUndBettag,
  calculateBrueckentage,
  easterSunday,
  fromIso,
  holidaysFor,
  regions,
  toIso,
  type RegionCode,
} from "./logic";

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

describe("Brückentage-Optimierer", () => {
  it("empfiehlt für Christi Himmelfahrt den Freitag danach: 1 Urlaubstag, 4 freie Tage", () => {
    for (const code of ALL_CODES) {
      const result = calculateBrueckentage({ year: 2026, region: code, budget: 5 });
      const occasion = result.occasions.find((entry) =>
        entry.holidays.some((h) => h.name === "Christi Himmelfahrt"),
      );
      expect(occasion, `${code} ohne Christi-Himmelfahrt-Anlass`).toBeDefined();
      expect(occasion!.recommended.vacationDays).toEqual(["2026-05-15"]);
      expect(occasion!.recommended.freeStart).toBe("2026-05-14");
      expect(occasion!.recommended.freeEnd).toBe("2026-05-17");
      expect(occasion!.recommended.freeDays).toBe(4);
      expect(occasion!.recommended.ratio).toBe(4);
    }
  });

  it("liefert für jeden Werktags-Feiertag mindestens einen Anlass", () => {
    const result = calculateBrueckentage({ year: 2026, region: "nw", budget: 5 });
    const workdayHolidays = result.holidays.filter(
      (h) => !h.onWeekend && !h.partial,
    );
    for (const holiday of workdayHolidays) {
      const covered = result.occasions.some((occasion) =>
        occasion.holidays.some((h) => h.date === holiday.date),
      );
      expect(covered, `${holiday.name} (${holiday.date}) fehlt`).toBe(true);
    }
  });

  it("zählt regional geltende Feiertage nur mit includePartial", () => {
    const without = calculateBrueckentage({
      year: 2026,
      region: "by",
      budget: 5,
    });
    const withPartial = calculateBrueckentage({
      year: 2026,
      region: "by",
      budget: 5,
      includePartial: true,
    });

    const hasMariae = (result: typeof without) =>
      result.occasions.some((occasion) =>
        occasion.holidays.some((h) => h.name === "Mariä Himmelfahrt"),
      );

    // 15.08.2026 ist ein Samstag – der Tag bringt so oder so keine Brücke,
    // aber er darf nur mit includePartial überhaupt als frei gelten.
    expect(holidaysFor(2026, "by").find((h) => h.name === "Mariä Himmelfahrt")
      ?.onWeekend).toBe(true);
    expect(hasMariae(without)).toBe(false);
    expect(hasMariae(withPartial)).toBe(false);

    // 2027 fällt Mariä Himmelfahrt auf einen Sonntag, 2028 auf einen Dienstag.
    const by2028 = calculateBrueckentage({
      year: 2028,
      region: "by",
      budget: 5,
      includePartial: true,
    });
    expect(
      by2028.occasions.some((occasion) =>
        occasion.holidays.some((h) => h.name === "Mariä Himmelfahrt"),
      ),
    ).toBe(true);
    expect(
      calculateBrueckentage({ year: 2028, region: "by", budget: 5 }).occasions.some(
        (occasion) =>
          occasion.holidays.some((h) => h.name === "Mariä Himmelfahrt"),
      ),
    ).toBe(false);
  });

  it("respektiert das Budget", () => {
    for (const budget of [1, 2, 3, 5, 10, 20]) {
      const result = calculateBrueckentage({
        year: 2027,
        region: "bw",
        budget,
      });
      expect(result.plan.vacationDaysUsed).toBeLessThanOrEqual(budget);
      expect(result.best?.vacationDays.length ?? 0).toBeLessThanOrEqual(budget);
      for (const occasion of result.occasions) {
        expect(occasion.recommended.vacationDays.length).toBeLessThanOrEqual(
          Math.min(5, budget),
        );
      }
    }
  });

  it("bietet bei größerem Budget längere Spannen an", () => {
    const small = calculateBrueckentage({ year: 2026, region: "by", budget: 1 });
    const large = calculateBrueckentage({ year: 2026, region: "by", budget: 5 });
    expect(large.best!.freeDays).toBeGreaterThan(small.best!.freeDays);
    // Das beste Verhältnis ist budgetunabhängig – ein einzelner Brückentag.
    expect(large.mostEfficient!.ratio).toBe(small.mostEfficient!.ratio);
  });

  it("wirft bei unbekanntem Bundesland", () => {
    expect(() =>
      calculateBrueckentage({
        year: 2026,
        region: "xx" as RegionCode,
        budget: 3,
      }),
    ).toThrow(/Unbekanntes Bundesland/);
  });
});

describe("Invarianten über alle Bundesländer und Jahre", () => {
  for (const year of YEARS) {
    for (const code of ALL_CODES) {
      it(`${code} ${year}: Vorschläge sind in sich konsistent`, () => {
        const result = calculateBrueckentage({ year, region: code, budget: 6 });

        // Freie Tage: Wochenenden + gezählte Feiertage der Nachbarjahre.
        const freeSet = new Set<number>();
        for (const y of [year - 1, year, year + 1]) {
          for (const holiday of holidaysFor(y, code)) {
            if (holiday.partial) continue;
            freeSet.add(fromIso(holiday.date));
          }
        }
        const isWorkday = (ms: number) =>
          !isWeekendIso(toIso(ms)) && !freeSet.has(ms);

        const blocks = result.occasions.flatMap((o) => o.options);
        expect(blocks.length).toBeGreaterThan(0);

        for (const block of blocks) {
          const vacation = new Set(block.vacationDays.map(fromIso));

          // 1. Urlaub wird nie auf einen ohnehin freien Tag gelegt.
          for (const ms of vacation) expect(isWorkday(ms)).toBe(true);

          // 2. Die Urlaubstage liegen in der freien Spanne.
          expect(block.freeStart <= block.vacationStart).toBe(true);
          expect(block.vacationEnd <= block.freeEnd).toBe(true);

          // 3. freeDays entspricht der Spanne.
          const start = fromIso(block.freeStart);
          const end = fromIso(block.freeEnd);
          expect(block.freeDays).toBe((end - start) / DAY_MS + 1);
          expect(block.ratio).toBeCloseTo(
            block.freeDays / block.vacationDays.length,
            10,
          );

          // 4. Innerhalb der Spanne gibt es keinen Arbeitstag ohne Urlaub.
          for (let ms = start; ms <= end; ms += DAY_MS) {
            if (isWorkday(ms)) expect(vacation.has(ms)).toBe(true);
          }

          // 5. Die Spanne ist maximal: davor und danach wird gearbeitet.
          expect(isWorkday(start - DAY_MS)).toBe(true);
          expect(isWorkday(end + DAY_MS)).toBe(true);

          // 6. Ein Brückentag braucht einen Werktags-Feiertag.
          expect(block.holidays.length).toBeGreaterThan(0);
          for (const holiday of block.holidays) {
            expect(isWeekendIso(holiday.date)).toBe(false);
            expect(freeSet.has(fromIso(holiday.date))).toBe(true);
          }

          // 7. Es lohnt sich: mehr freie Tage als eingesetzte Urlaubstage.
          expect(block.ratio).toBeGreaterThan(1);
        }

        // Varianten je Anlass sind Pareto-optimal und aufsteigend sortiert.
        for (const occasion of result.occasions) {
          for (let i = 1; i < occasion.options.length; i += 1) {
            expect(
              occasion.options[i].vacationDays.length,
            ).toBeGreaterThan(occasion.options[i - 1].vacationDays.length);
            expect(occasion.options[i].freeDays).toBeGreaterThan(
              occasion.options[i - 1].freeDays,
            );
          }
          expect(occasion.options).toContain(occasion.recommended);
        }

        // Anlässe sind chronologisch.
        for (let i = 1; i < result.occasions.length; i += 1) {
          expect(
            result.occasions[i].recommended.freeStart >=
              result.occasions[i - 1].recommended.freeStart,
          ).toBe(true);
        }

        // Jahresplan: kein Budgetüberschreiten, keine Überlappung.
        expect(result.plan.vacationDaysUsed).toBe(
          result.plan.blocks.reduce((n, b) => n + b.vacationDays.length, 0),
        );
        expect(result.plan.vacationDaysUsed).toBeLessThanOrEqual(6);
        for (let i = 1; i < result.plan.blocks.length; i += 1) {
          expect(
            result.plan.blocks[i].freeStart >
              result.plan.blocks[i - 1].freeEnd,
          ).toBe(true);
        }
        expect(result.plan.freeDays).toBe(
          result.plan.blocks.reduce((n, b) => n + b.freeDays, 0),
        );

        // Zählung der Feiertage stimmt mit der Liste überein.
        const counted = result.holidays.filter((h) => !h.partial);
        expect(result.holidaysOnWeekend + result.holidaysOnWorkday).toBe(
          counted.length,
        );
      });
    }
  }
});
