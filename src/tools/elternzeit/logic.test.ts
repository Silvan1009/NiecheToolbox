import { describe, expect, it } from "vitest";
import { addDays, addMonths, isValidIso } from "@/lib/date";
import {
  calculateElternzeit,
  lebensmonatEnd,
  lebensmonatStart,
  type ElternzeitInput,
} from "./logic";

const base: ElternzeitInput = {
  birthDate: "2026-06-10",
  extendedMutterschutz: false,
  singleParent: false,
  parentOne: { months: 12, startMonth: 1 },
  parentTwo: { months: 2, startMonth: 13 },
};

describe("Kalender-Hilfen", () => {
  it("addiert Monate mit Monatsende-Klemmung", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29"); // Schaltjahr
    expect(addMonths("2026-03-15", 12)).toBe("2027-03-15");
    expect(addMonths("2026-12-15", 1)).toBe("2027-01-15");
    expect(addMonths("2026-01-15", -1)).toBe("2025-12-15");
  });

  it("erkennt ungültige Datumsangaben", () => {
    expect(isValidIso("2026-06-10")).toBe(true);
    expect(isValidIso("2026-02-30")).toBe(false);
    expect(isValidIso("2026-13-01")).toBe(false);
    expect(isValidIso("10.06.2026")).toBe(false);
    expect(isValidIso("")).toBe(false);
    expect(isValidIso(undefined)).toBe(false);
  });
});

describe("Lebensmonate", () => {
  it("beginnen am Geburtstag und enden am Tag vor dem Monatsdatum", () => {
    expect(lebensmonatStart("2026-06-10", 1)).toBe("2026-06-10");
    expect(lebensmonatEnd("2026-06-10", 1)).toBe("2026-07-09");
    expect(lebensmonatStart("2026-06-10", 2)).toBe("2026-07-10");
    expect(lebensmonatEnd("2026-06-10", 12)).toBe("2027-06-09");
    expect(lebensmonatStart("2026-06-10", 13)).toBe("2027-06-10");
  });

  it("klemmen am Monatsende", () => {
    // 31.01. + 1 Monat = 28.02., der Lebensmonat endet also am 27.02.
    expect(lebensmonatStart("2026-01-31", 1)).toBe("2026-01-31");
    expect(lebensmonatEnd("2026-01-31", 1)).toBe("2026-02-27");
    expect(lebensmonatStart("2026-01-31", 2)).toBe("2026-02-28");
  });

  it("lassen keine Lücken und keine Überschneidungen", () => {
    for (const birth of [
      "2026-01-31",
      "2026-02-28",
      "2026-06-10",
      "2027-12-01",
    ]) {
      for (let month = 1; month <= 40; month += 1) {
        const end = lebensmonatEnd(birth, month);
        const nextStart = lebensmonatStart(birth, month + 1);
        expect(addDays(end, 1)).toBe(nextStart);
      }
    }
  });
});

describe("Mutterschutz", () => {
  it("liegt 6 Wochen vor und 8 Wochen nach dem Termin", () => {
    const result = calculateElternzeit(base);
    expect(result.mutterschutz.start).toBe("2026-04-29");
    expect(result.mutterschutz.end).toBe("2026-08-05");
    expect(result.mutterschutz.weeksAfter).toBe(8);
  });

  it("verlängert sich bei Mehrlings- und Frühgeburten auf 12 Wochen", () => {
    const result = calculateElternzeit({ ...base, extendedMutterschutz: true });
    expect(result.mutterschutz.start).toBe("2026-04-29");
    expect(result.mutterschutz.end).toBe("2026-09-02");
    expect(result.mutterschutz.weeksAfter).toBe(12);
  });
});

describe("Zeiträume", () => {
  it("legt die Elternzeit auf ganze Lebensmonate", () => {
    const result = calculateElternzeit(base);
    expect(result.periods).toHaveLength(2);

    const [one, two] = result.periods;
    expect(one.label).toBe("Elternteil 1");
    expect(one.start).toBe("2026-06-10");
    expect(one.end).toBe("2027-06-09");
    expect(one.months).toBe(12);
    expect(one.note).toContain("Mutterschutz");

    expect(two.start).toBe("2027-06-10");
    expect(two.end).toBe("2027-08-09");
    expect(two.months).toBe(2);
    expect(two.note).toBeUndefined();
  });

  it("lässt einen Elternteil ohne Elternzeit weg", () => {
    const result = calculateElternzeit({
      ...base,
      parentTwo: { months: 0, startMonth: 13 },
    });
    expect(result.periods).toHaveLength(1);
    expect(result.totalMonths).toBe(12);
  });

  it("berechnet den 3. und 8. Geburtstag", () => {
    const result = calculateElternzeit(base);
    expect(result.thirdBirthday).toBe("2029-06-10");
    expect(result.eighthBirthday).toBe("2034-06-10");
  });
});

describe("Fristen", () => {
  it("liegen 7 Wochen vor Beginn", () => {
    const result = calculateElternzeit(base);
    const frist = result.milestones.find((m) =>
      m.title.startsWith("Elternteil 1: Elternzeit anmelden"),
    );
    // 7 Wochen vor dem 10.06.2026
    expect(frist?.date).toBe("2026-04-22");
    expect(frist?.kind).toBe("frist");
  });

  it("liegen 13 Wochen vor Beginn, wenn es nach dem 3. Geburtstag losgeht", () => {
    const result = calculateElternzeit({
      ...base,
      parentTwo: { months: 2, startMonth: 40 },
    });
    const frist = result.milestones.find((m) =>
      m.title.startsWith("Elternteil 2: Elternzeit anmelden"),
    );
    // Lebensmonat 40 beginnt am 10.09.2029, 13 Wochen davor:
    expect(frist?.date).toBe("2029-06-11");
    expect(frist?.detail).toContain("13 Wochen");
  });

  it("weist auf die Elterngeld-Rückwirkung von 3 Monaten hin", () => {
    const result = calculateElternzeit(base);
    const frist = result.milestones.find((m) =>
      m.title.includes("Elterngeld spätestens"),
    );
    expect(frist?.date).toBe("2026-09-10");
  });

  it("sortiert alle Meilensteine chronologisch", () => {
    const result = calculateElternzeit({
      ...base,
      parentTwo: { months: 3, startMonth: 8 },
    });
    for (let i = 1; i < result.milestones.length; i += 1) {
      expect(result.milestones[i].date >= result.milestones[i - 1].date).toBe(
        true,
      );
    }
  });

  it("stellt am selben Tag die Geburt vor den Elternzeit-Beginn", () => {
    const result = calculateElternzeit(base);
    const sameDay = result.milestones.filter((m) => m.date === base.birthDate);
    expect(sameDay.map((m) => m.title)).toEqual([
      "Geburt (errechneter Termin)",
      "Elternteil 1: Elternzeit beginnt",
    ]);
  });

  it("stellt bei der Übergabe das Ende vor den nächsten Beginn", () => {
    const result = calculateElternzeit(base);
    // Elternteil 1 ist am 10.06.2027 zurück, Elternteil 2 startet am selben Tag.
    const sameDay = result.milestones.filter((m) => m.date === "2027-06-10");
    expect(sameDay.map((m) => m.kind)).toEqual(["ende", "start"]);
    expect(sameDay.map((m) => m.title)).toEqual([
      "Elternteil 1: zurück im Job",
      "Elternteil 2: Elternzeit beginnt",
    ]);
  });
});

describe("Elterngeld-Übersicht", () => {
  it("gibt 14 Monate, wenn beide mindestens 2 Monate nehmen", () => {
    const result = calculateElternzeit(base);
    expect(result.elterngeld.partnerBonus).toBe(true);
    expect(result.elterngeld.maxMonths).toBe(14);
    expect(result.elterngeld.coveredMonths).toBe(14);
    expect(result.elterngeld.uncoveredMonths).toBe(0);
  });

  it("gibt nur 12 Monate ohne Partnermonate", () => {
    const result = calculateElternzeit({
      ...base,
      parentOne: { months: 14, startMonth: 1 },
      parentTwo: { months: 1, startMonth: 15 },
    });
    expect(result.elterngeld.partnerBonus).toBe(false);
    expect(result.elterngeld.maxMonths).toBe(12);
    expect(result.elterngeld.uncoveredMonths).toBe(3);
    expect(result.warnings.join(" ")).toContain("Partnermonate");
  });

  it("gibt Alleinerziehenden 14 Monate ohne zweiten Elternteil", () => {
    const result = calculateElternzeit({
      ...base,
      singleParent: true,
      parentOne: { months: 14, startMonth: 1 },
      parentTwo: { months: 0, startMonth: 1 },
    });
    expect(result.elterngeld.maxMonths).toBe(14);
    expect(result.elterngeld.uncoveredMonths).toBe(0);
  });

  it("warnt, wenn mehr Elternzeit geplant ist als Elterngeld gezahlt wird", () => {
    const result = calculateElternzeit({
      ...base,
      parentOne: { months: 24, startMonth: 1 },
      parentTwo: { months: 4, startMonth: 25 },
    });
    expect(result.totalMonths).toBe(28);
    expect(result.elterngeld.coveredMonths).toBe(14);
    expect(result.elterngeld.uncoveredMonths).toBe(14);
    expect(result.warnings.join(" ")).toContain("unbezahlt");
  });
});

describe("Hinweise und Grenzen", () => {
  it("weist auf Zeiträume nach dem 3. Geburtstag hin", () => {
    const result = calculateElternzeit({
      ...base,
      parentOne: { months: 12, startMonth: 1 },
      parentTwo: { months: 6, startMonth: 34 },
    });
    expect(result.warnings.join(" ")).toContain("3. Geburtstag");
  });

  it("meldet einen leeren Plan", () => {
    const result = calculateElternzeit({
      ...base,
      parentOne: { months: 0, startMonth: 1 },
      parentTwo: { months: 0, startMonth: 1 },
    });
    expect(result.totalMonths).toBe(0);
    expect(result.periods).toHaveLength(0);
    expect(result.warnings.join(" ")).toContain("keine Elternzeit geplant");
  });

  it("begrenzt unsinnige Eingaben statt zu rechnen", () => {
    const result = calculateElternzeit({
      ...base,
      parentOne: { months: 999, startMonth: -5 },
      parentTwo: { months: -3, startMonth: 0 },
    });
    expect(result.periods[0].months).toBe(36);
    expect(result.periods[0].startMonth).toBe(1);
    expect(result.totalMonths).toBe(36);
  });

  it("wirft bei ungültigem Geburtsdatum", () => {
    expect(() =>
      calculateElternzeit({ ...base, birthDate: "2026-02-30" }),
    ).toThrow(/Ungültiges Datum/);
    expect(() => calculateElternzeit({ ...base, birthDate: "" })).toThrow();
  });

  it("hält Zeiträume und Meilensteine konsistent", () => {
    for (const birthDate of ["2026-01-31", "2026-06-10", "2027-02-28"]) {
      for (const startMonth of [1, 3, 13, 25]) {
        for (const months of [1, 2, 6, 12, 24]) {
          const result = calculateElternzeit({
            birthDate,
            extendedMutterschutz: false,
            singleParent: false,
            parentOne: { months, startMonth },
            parentTwo: { months: 0, startMonth: 1 },
          });

          const period = result.periods[0];
          expect(period.start <= period.end).toBe(true);
          expect(period.endMonth - period.startMonth + 1).toBe(months);
          expect(period.start).toBe(lebensmonatStart(birthDate, startMonth));
          expect(period.end).toBe(lebensmonatEnd(birthDate, period.endMonth));

          // Anmeldefrist liegt immer vor dem Beginn.
          const frist = result.milestones.find((m) =>
            m.title.includes("anmelden"),
          );
          expect(frist!.date < period.start).toBe(true);
        }
      }
    }
  });
});
