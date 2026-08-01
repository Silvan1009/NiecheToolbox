import { describe, expect, it } from "vitest";
import { holidaysFor, regions, type RegionCode } from "@/lib/regionen";
import { DAY_MS, calculateBrueckentage, fromIso, toIso } from "./logic";

const ALL_CODES = regions.map((r) => r.code);
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2035];

const weekday = (iso: string) => new Date(fromIso(iso)).getUTCDay();
const isWeekendIso = (iso: string) => weekday(iso) === 0 || weekday(iso) === 6;

describe("Brückentage-Optimierer", () => {
  it("empfiehlt für Christi Himmelfahrt den Freitag danach: 1 Urlaubstag, 4 freie Tage", () => {
    for (const code of ALL_CODES) {
      const result = calculateBrueckentage({
        year: 2026,
        region: code,
        budget: 5,
      });
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
    const result = calculateBrueckentage({
      year: 2026,
      region: "nw",
      budget: 5,
    });
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
    expect(
      holidaysFor(2026, "by").find((h) => h.name === "Mariä Himmelfahrt")
        ?.onWeekend,
    ).toBe(true);
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
      calculateBrueckentage({
        year: 2028,
        region: "by",
        budget: 5,
      }).occasions.some((occasion) =>
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
    const small = calculateBrueckentage({
      year: 2026,
      region: "by",
      budget: 1,
    });
    const large = calculateBrueckentage({
      year: 2026,
      region: "by",
      budget: 5,
    });
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
            expect(occasion.options[i].vacationDays.length).toBeGreaterThan(
              occasion.options[i - 1].vacationDays.length,
            );
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
            result.plan.blocks[i].freeStart > result.plan.blocks[i - 1].freeEnd,
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
