import { describe, expect, it } from "vitest";
import { addDays } from "@/lib/date";
import {
  calculateNotice,
  endForZugang,
  isWerktag,
  latestZugangFor,
  thirdWerktag,
  type ContractKind,
  type NoticeInput,
  type Party,
} from "./logic";

const base: NoticeInput = {
  contract: "wohnung",
  party: "mieter",
  direction: "vorwaerts",
  zugang: "2026-01-02",
  wunschende: "2026-06-30",
  since: "2020-01-01",
  region: "nw",
  probezeit: false,
};

const input = (overrides: Partial<NoticeInput> = {}): NoticeInput => ({
  ...base,
  ...overrides,
});

describe("Werktage", () => {
  it("zählt Samstag mit, Sonntag nicht", () => {
    expect(isWerktag("2026-01-03", "nw")).toBe(true); // Samstag
    expect(isWerktag("2026-01-04", "nw")).toBe(false); // Sonntag
  });

  it("schließt gesetzliche Feiertage aus", () => {
    expect(isWerktag("2026-01-01", "nw")).toBe(false); // Neujahr, Donnerstag
    expect(isWerktag("2026-04-03", "nw")).toBe(false); // Karfreitag
  });

  it("unterscheidet nach Bundesland", () => {
    // Heilige Drei Könige: in Bayern Feiertag, in NRW nicht.
    expect(isWerktag("2026-01-06", "by")).toBe(false);
    expect(isWerktag("2026-01-06", "nw")).toBe(true);
  });

  it("findet den dritten Werktag über Feiertage hinweg", () => {
    // Januar 2026: 1. = Neujahr (Do), 2. Fr, 3. Sa, 4. So, 5. Mo
    expect(thirdWerktag("2026-01-20", "nw")).toBe("2026-01-05");
    // Mai 2026: 1. = Tag der Arbeit (Fr), 2. Sa, 3. So, 4. Mo, 5. Di
    expect(thirdWerktag("2026-05-14", "nw")).toBe("2026-05-05");
    // April 2026: 1. Mi, 2. Do, 3. = Karfreitag, 4. Sa
    expect(thirdWerktag("2026-04-30", "nw")).toBe("2026-04-04");
  });
});

describe("Wohnraummiete (§ 573c BGB)", () => {
  it("endet nach drei Monaten, wenn die Kündigung in der Karenzzeit zugeht", () => {
    const result = calculateNotice(input({ zugang: "2026-01-02" }));
    expect(result.withinKarenz).toBe(true);
    expect(result.karenzDeadline).toBe("2026-01-05");
    expect(result.end).toBe("2026-03-31");
    expect(result.frist).toEqual({ unit: "monate", value: 3, termin: "karenz" });
  });

  it("verschiebt um einen Monat, wenn die Karenzzeit verpasst ist", () => {
    const result = calculateNotice(input({ zugang: "2026-01-06" }));
    expect(result.withinKarenz).toBe(false);
    expect(result.end).toBe("2026-04-30");
  });

  it("zählt den dritten Werktag selbst noch mit", () => {
    expect(calculateNotice(input({ zugang: "2026-01-05" })).end).toBe(
      "2026-03-31",
    );
  });

  it("staffelt die Vermieterfrist nach 5 und 8 Jahren", () => {
    const short = calculateNotice(
      input({ party: "vermieter", since: "2024-01-01", zugang: "2026-02-02" }),
    );
    expect(short.frist.value).toBe(3);
    expect(short.end).toBe("2026-04-30");

    const mid = calculateNotice(
      input({ party: "vermieter", since: "2019-01-01", zugang: "2026-02-02" }),
    );
    expect(mid.frist.value).toBe(6);
    expect(mid.end).toBe("2026-07-31");

    const long = calculateNotice(
      input({ party: "vermieter", since: "2015-01-01", zugang: "2026-02-02" }),
    );
    expect(long.frist.value).toBe(9);
    expect(long.end).toBe("2026-10-31");
  });

  it("lässt die Mieterfrist unabhängig von der Wohndauer bei drei Monaten", () => {
    const long = calculateNotice(input({ since: "2001-01-01" }));
    expect(long.frist.value).toBe(3);
    expect(long.end).toBe("2026-03-31");
  });
});

describe("Arbeitsvertrag (§ 622 BGB)", () => {
  it("rechnet vier Wochen – nicht einen Monat – zum 15. oder Monatsende", () => {
    const early = calculateNotice(
      input({ contract: "arbeit", party: "arbeitnehmer", zugang: "2026-03-05" }),
    );
    // 5. März + 28 Tage = 2. April -> nächster Termin ist der 15. April
    expect(early.end).toBe("2026-04-15");

    const late = calculateNotice(
      input({ contract: "arbeit", party: "arbeitnehmer", zugang: "2026-03-20" }),
    );
    // 20. März + 28 Tage = 17. April -> Monatsende
    expect(late.end).toBe("2026-04-30");
  });

  it("landet nicht beim Monatsende, wenn der 15. reicht", () => {
    const result = calculateNotice(
      input({ contract: "arbeit", party: "arbeitnehmer", zugang: "2026-02-01" }),
    );
    // 1. Februar + 28 Tage = 1. März. Eine Monatsfrist ergäbe den 31. März.
    expect(result.end).toBe("2026-03-15");
  });

  it("kürzt in der Probezeit auf zwei Wochen zu jedem Tag", () => {
    const result = calculateNotice(
      input({
        contract: "arbeit",
        party: "arbeitnehmer",
        probezeit: true,
        since: "2026-01-15",
        zugang: "2026-03-10",
      }),
    );
    expect(result.end).toBe("2026-03-24");
    expect(result.frist).toEqual({ unit: "wochen", value: 2, termin: "beliebig" });
  });

  it("staffelt die Arbeitgeberfrist nach Betriebszugehörigkeit", () => {
    const result = calculateNotice(
      input({
        contract: "arbeit",
        party: "arbeitgeber",
        since: "2020-01-01",
        zugang: "2026-03-15",
      }),
    );
    expect(result.years).toBe(6);
    expect(result.frist).toEqual({ unit: "monate", value: 2, termin: "monatsende" });
    expect(result.end).toBe("2026-05-31");
  });

  it("berücksichtigt einen Dienstjubiläum innerhalb der laufenden Frist", () => {
    // Acht Jahre werden erst am 05.07.2026 voll – also während der Frist.
    // Damit greift die längere Stufe, und das Ende rückt nach hinten.
    const result = calculateNotice(
      input({
        contract: "arbeit",
        party: "arbeitgeber",
        since: "2018-07-05",
        zugang: "2026-06-20",
      }),
    );
    expect(result.years).toBe(8);
    expect(result.frist.value).toBe(3);
    expect(result.end).toBe("2026-09-30");
  });

  it("lässt die Arbeitnehmerfrist von der Betriebszugehörigkeit unberührt", () => {
    const veteran = calculateNotice(
      input({
        contract: "arbeit",
        party: "arbeitnehmer",
        since: "1998-01-01",
        zugang: "2026-03-05",
      }),
    );
    expect(veteran.frist).toEqual({ unit: "wochen", value: 4, termin: "halbmonat" });
    expect(veteran.end).toBe("2026-04-15");
  });

  it("klemmt Monatsenden korrekt", () => {
    // 31. Januar + 1 Monat = 28. Februar, Monatsende bleibt der 28.
    const result = calculateNotice(
      input({
        contract: "arbeit",
        party: "arbeitgeber",
        since: "2020-01-01",
        zugang: "2026-01-31",
      }),
    );
    expect(result.frist.value).toBe(2);
    expect(result.end).toBe("2026-03-31");
  });
});

describe("Rückwärtsrechnung", () => {
  it("nennt den spätesten Zugang für einen Wunschtermin", () => {
    const result = calculateNotice(
      input({ direction: "rueckwaerts", wunschende: "2026-06-30" }),
    );
    expect(result.end).toBe("2026-06-30");
    expect(result.zugang).toBe("2026-04-04"); // 3. Werktag im April
    expect(result.endsEarlierThanWanted).toBe(false);
  });

  it("meldet, wenn der Wunschtermin kein zulässiges Vertragsende ist", () => {
    const result = calculateNotice(
      input({ direction: "rueckwaerts", wunschende: "2026-06-15" }),
    );
    expect(result.end).toBe("2026-05-31");
    expect(result.endsEarlierThanWanted).toBe(true);
  });

  it("findet für jeden Wunschtermin genau den letzten möglichen Tag", () => {
    const combos: { contract: ContractKind; party: Party }[] = [
      { contract: "wohnung", party: "mieter" },
      { contract: "wohnung", party: "vermieter" },
      { contract: "arbeit", party: "arbeitnehmer" },
      { contract: "arbeit", party: "arbeitgeber" },
    ];

    for (const combo of combos) {
      for (let offset = 0; offset < 60; offset += 7) {
        const wunschende = addDays("2026-05-01", offset);
        const config = input({ ...combo, direction: "rueckwaerts", wunschende });
        const latest = latestZugangFor(config, wunschende);
        expect(latest).not.toBeNull();
        if (!latest) continue;

        // Definierende Eigenschaft: der Tag passt, der Tag danach nicht mehr.
        expect(endForZugang(config, latest) <= wunschende).toBe(true);
        expect(endForZugang(config, addDays(latest, 1)) > wunschende).toBe(true);
      }
    }
  });

  it("gibt auf, wenn der Wunschtermin zu nah liegt", () => {
    const config = input({ direction: "rueckwaerts", wunschende: "2026-06-30" });
    expect(latestZugangFor(config, "2026-06-30", 5)).toBeNull();

    const result = calculateNotice({
      ...config,
      wunschende: "2026-06-30",
      direction: "rueckwaerts",
    });
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe("Invarianten", () => {
  it("liefert immer ein Ende nach dem Zugang", () => {
    const combos: { contract: ContractKind; party: Party }[] = [
      { contract: "wohnung", party: "mieter" },
      { contract: "wohnung", party: "vermieter" },
      { contract: "arbeit", party: "arbeitnehmer" },
      { contract: "arbeit", party: "arbeitgeber" },
    ];

    for (const combo of combos) {
      for (let day = 0; day < 400; day += 3) {
        const zugang = addDays("2026-01-01", day);
        const result = calculateNotice(input({ ...combo, zugang }));
        expect(result.end > zugang).toBe(true);
        expect(result.daysOfNotice).toBeGreaterThan(0);
      }
    }
  });

  it("verschiebt das Ende nie nach vorn, wenn später gekündigt wird", () => {
    // Diese Monotonie trägt die Rückwärtssuche – ohne sie wäre sie falsch.
    const combos: { contract: ContractKind; party: Party; probezeit?: boolean }[] =
      [
        { contract: "wohnung", party: "mieter" },
        { contract: "wohnung", party: "vermieter" },
        { contract: "arbeit", party: "arbeitnehmer" },
        { contract: "arbeit", party: "arbeitgeber" },
        { contract: "arbeit", party: "arbeitnehmer", probezeit: true },
      ];

    for (const combo of combos) {
      const config = input({ ...combo, probezeit: combo.probezeit ?? false });
      let previous = "0000-01-01";
      for (let day = 0; day < 500; day += 1) {
        const end = endForZugang(config, addDays("2026-01-01", day));
        expect(end >= previous).toBe(true);
        previous = end;
      }
    }
  });

  it("hält die gesetzliche Mindestfrist ein", () => {
    for (let day = 0; day < 120; day += 1) {
      const zugang = addDays("2026-01-01", day);

      const miete = calculateNotice(input({ zugang }));
      // Drei volle Monate ab Monatsbeginn: nie weniger als 84 Tage.
      expect(miete.daysOfNotice).toBeGreaterThanOrEqual(84);

      const arbeit = calculateNotice(
        input({ contract: "arbeit", party: "arbeitnehmer", zugang }),
      );
      expect(arbeit.daysOfNotice).toBeGreaterThanOrEqual(28);

      const probe = calculateNotice(
        input({ contract: "arbeit", party: "arbeitnehmer", probezeit: true, zugang }),
      );
      expect(probe.daysOfNotice).toBe(14);
    }
  });

  it("endet bei Monatsfristen immer auf einem Monatsletzten", () => {
    for (let day = 0; day < 200; day += 1) {
      const zugang = addDays("2026-01-01", day);
      const end = calculateNotice(input({ zugang })).end;
      const nextDay = addDays(end, 1);
      expect(nextDay.slice(8)).toBe("01");
    }
  });
});
