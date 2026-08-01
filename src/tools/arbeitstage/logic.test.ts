import { describe, expect, it } from "vitest";
import { regions, type RegionCode } from "@/lib/regionen";
import {
  calculateWorkdays,
  isoWeekdayOf,
  monthRange,
  monthlyBreakdown,
  quarterRange,
  weekPresets,
  yearRange,
  type IsoWeekday,
} from "./logic";

const MO_FR = weekPresets["5"].days;

const forYear = (
  year: number,
  region: RegionCode,
  workdays: IsoWeekday[] = MO_FR,
  includePartial = false,
) =>
  calculateWorkdays({
    ...yearRange(year),
    region,
    workdays,
    includePartial,
    daysOff: 0,
  });

describe("Wochentage", () => {
  it("dreht den JS-Wochentag auf die ISO-Zählung", () => {
    expect(isoWeekdayOf("2026-01-01")).toBe(4); // Donnerstag
    expect(isoWeekdayOf("2026-01-04")).toBe(7); // Sonntag
    expect(isoWeekdayOf("2026-01-05")).toBe(1); // Montag
  });
});

describe("Arbeitstage im Jahr", () => {
  it("zählt 2026 in Nordrhein-Westfalen 253 Arbeitstage", () => {
    const result = forYear(2026, "nw");
    expect(result.calendarDays).toBe(365);
    // 2026 beginnt an einem Donnerstag: 52 volle Wochen plus ein Donnerstag.
    expect(result.scheduledDays).toBe(261);
    // Acht der elf Feiertage fallen auf Montag bis Freitag.
    expect(result.lostToHolidays).toBe(8);
    expect(result.wastedHolidays).toBe(3);
    expect(result.workdays).toBe(253);
  });

  it("zählt in Bayern einen Tag weniger – wegen Heilige Drei Könige", () => {
    const bayern = forYear(2026, "by");
    const nrw = forYear(2026, "nw");
    expect(bayern.workdays).toBe(252);
    expect(nrw.workdays - bayern.workdays).toBe(1);
  });

  it("ignoriert Feiertage, die aufs Wochenende fallen", () => {
    // 03.10.2026 ist ein Samstag und kostet deshalb keinen Arbeitstag.
    const einheit = forYear(2026, "nw").holidays.find(
      (h) => h.date === "2026-10-03",
    );
    expect(einheit?.weekday).toBe(6);
    expect(einheit?.countsAsLoss).toBe(false);
  });

  it("summiert die Monatsübersicht zum Jahreswert", () => {
    const months = monthlyBreakdown(2026, "nw", MO_FR, false);
    expect(months).toHaveLength(12);
    const total = months.reduce((sum, month) => sum + month.workdays, 0);
    expect(total).toBe(forYear(2026, "nw").workdays);
  });
});

describe("Zeiträume", () => {
  it("rechnet beide Enddaten mit", () => {
    const result = calculateWorkdays({
      from: "2026-03-02",
      to: "2026-03-06",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 0,
    });
    expect(result.calendarDays).toBe(5);
    expect(result.workdays).toBe(5);
  });

  it("kommt mit einem einzelnen Tag klar", () => {
    const workday = calculateWorkdays({
      from: "2026-03-04",
      to: "2026-03-04",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 0,
    });
    expect(workday.calendarDays).toBe(1);
    expect(workday.workdays).toBe(1);

    const sunday = calculateWorkdays({
      from: "2026-03-08",
      to: "2026-03-08",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 0,
    });
    expect(sunday.workdays).toBe(0);
  });

  it("dreht vertauschte Daten still um", () => {
    const result = calculateWorkdays({
      from: "2026-03-31",
      to: "2026-03-01",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 0,
    });
    expect(result.swapped).toBe(true);
    expect(result.from).toBe("2026-03-01");
    expect(result.to).toBe("2026-03-31");
    expect(result.workdays).toBeGreaterThan(0);
  });

  it("läuft über Jahresgrenzen hinweg", () => {
    const result = calculateWorkdays({
      from: "2026-12-24",
      to: "2027-01-04",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 0,
    });
    expect(result.calendarDays).toBe(12);
    // Feiertage aus beiden Jahren müssen auftauchen.
    const dates = result.holidays.map((h) => h.date);
    expect(dates).toContain("2026-12-25");
    expect(dates).toContain("2027-01-01");
  });

  it("liefert saubere Monats- und Quartalsgrenzen", () => {
    expect(monthRange(2026, 2)).toEqual({ from: "2026-02-01", to: "2026-02-28" });
    expect(monthRange(2028, 2)).toEqual({ from: "2028-02-01", to: "2028-02-29" });
    expect(quarterRange(2026, 1)).toEqual({
      from: "2026-01-01",
      to: "2026-03-31",
    });
    expect(quarterRange(2026, 4)).toEqual({
      from: "2026-10-01",
      to: "2026-12-31",
    });
  });
});

describe("Arbeitswoche und Urlaub", () => {
  it("zählt den Samstag bei einer Sechstagewoche mit", () => {
    const five = forYear(2026, "nw", weekPresets["5"].days);
    const six = forYear(2026, "nw", weekPresets["6"].days);
    expect(six.workdays).toBeGreaterThan(five.workdays);
    // Der 03.10. und der 26.12. fallen 2026 auf einen Samstag und kosten
    // in der Sechstagewoche nun doch je einen Arbeitstag.
    expect(six.lostToHolidays).toBe(five.lostToHolidays + 2);
  });

  it("zieht Urlaubstage ab, ohne negativ zu werden", () => {
    const result = calculateWorkdays({
      from: "2026-03-02",
      to: "2026-03-06",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 2,
    });
    expect(result.workdays).toBe(5);
    expect(result.netWorkdays).toBe(3);

    const overdrawn = calculateWorkdays({
      from: "2026-03-02",
      to: "2026-03-06",
      region: "nw",
      workdays: MO_FR,
      includePartial: false,
      daysOff: 99,
    });
    expect(overdrawn.netWorkdays).toBe(0);
  });

  it("berücksichtigt regionale Feiertage nur auf Wunsch", () => {
    // Mariä Himmelfahrt und das Augsburger Friedensfest fallen 2025 auf
    // einen Freitag – ohne Opt-in dürfen sie nichts abziehen.
    const without = forYear(2025, "by", MO_FR, false);
    const withPartial = forYear(2025, "by", MO_FR, true);

    const extra = withPartial.holidays.filter(
      (h) => h.partial && h.countsAsLoss,
    ).length;
    expect(extra).toBeGreaterThan(0);
    expect(without.workdays - withPartial.workdays).toBe(extra);
  });
});

describe("Invarianten", () => {
  it("hält die Bilanz für alle Bundesländer und Jahre", () => {
    for (const region of regions) {
      for (let year = 2024; year <= 2030; year += 1) {
        for (const preset of ["5", "6", "7"] as const) {
          const result = forYear(year, region.code, weekPresets[preset].days);

          // Jeder Kalendertag ist entweder verplant oder frei.
          expect(result.scheduledDays + result.offDays).toBe(result.calendarDays);
          // Arbeitstage sind die verplanten Tage minus die Feiertage darauf.
          expect(result.workdays + result.lostToHolidays).toBe(
            result.scheduledDays,
          );
          // Jeder Feiertag ist entweder ein Verlust oder verpufft.
          expect(result.lostToHolidays + result.wastedHolidays).toBe(
            result.holidays.length,
          );
          expect(result.workdays).toBeGreaterThan(0);
          expect(result.workdays).toBeLessThanOrEqual(result.scheduledDays);
        }
      }
    }
  });

  it("meldet jeden Feiertag genau einmal", () => {
    for (const region of regions) {
      const result = forYear(2027, region.code);
      const dates = result.holidays.map((h) => h.date);
      expect(new Set(dates).size).toBe(dates.length);
    }
  });
});
