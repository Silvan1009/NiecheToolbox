import { describe, expect, it } from "vitest";
import {
  calculateParty,
  occasions,
  type Occasion,
  type PartyInput,
  type PartyResult,
} from "./logic";

const base: PartyInput = {
  adults: 10,
  children: 0,
  hours: 4,
  occasion: "grillen",
  vegetarianPercent: 0,
  alcohol: true,
  heartyEaters: false,
};

const party = (overrides: Partial<PartyInput> = {}) =>
  calculateParty({ ...base, ...overrides });

const ALL_OCCASIONS = Object.keys(occasions) as Occasion[];

const item = (result: PartyResult, key: string) =>
  [...result.food, ...result.drinks, ...result.supplies].find(
    (entry) => entry.key === key,
  );

describe("Essen", () => {
  it("rechnet 350 g Fleisch je Erwachsenem", () => {
    expect(item(party(), "fleisch")?.amount).toBe(3.5);
    expect(item(party({ adults: 20 }), "fleisch")?.amount).toBe(7);
  });

  it("zählt Kinder als halbe Portion", () => {
    const result = party({ adults: 10, children: 4 });
    expect(result.eaterUnits).toBe(12);
    expect(item(result, "fleisch")?.amount).toBe(4.2);
  });

  it("teilt Fleisch und vegetarisch nach dem Anteil auf", () => {
    const result = party({ adults: 10, vegetarianPercent: 30 });
    expect(item(result, "fleisch")?.amount).toBe(2.5); // 7 × 350 g
    expect(item(result, "vegetarisch")?.amount).toBe(0.8); // 3 × 250 g
  });

  it("lässt die vegetarische Zeile weg, wenn niemand vegetarisch isst", () => {
    expect(item(party({ vegetarianPercent: 0 }), "vegetarisch")).toBeUndefined();
    expect(item(party({ vegetarianPercent: 100 }), "vegetarisch")).toBeDefined();
    expect(item(party({ vegetarianPercent: 100 }), "fleisch")?.amount).toBe(0);
  });

  it("legt für kräftige Esser zu, aber nicht bei den Getränken", () => {
    const normal = party();
    const hearty = party({ heartyEaters: true });
    expect(item(hearty, "fleisch")!.amount).toBeGreaterThan(
      item(normal, "fleisch")!.amount,
    );
    // Getränke hängen an Personen und Dauer, nicht am Appetit.
    expect(item(hearty, "softdrinks")?.amount).toBe(
      item(normal, "softdrinks")?.amount,
    );
  });

  it("skaliert das Essen nicht mit der Dauer", () => {
    const short = party({ hours: 3 });
    const long = party({ hours: 8 });
    expect(item(long, "fleisch")?.amount).toBe(item(short, "fleisch")?.amount);
  });
});

describe("Getränke", () => {
  it("skaliert Getränke mit der Dauer", () => {
    const three = party({ hours: 3 });
    const six = party({ hours: 6 });
    expect(item(six, "softdrinks")!.amount).toBeCloseTo(
      item(three, "softdrinks")!.amount * 2,
      6,
    );
    expect(item(six, "bier")!.amount).toBeCloseTo(
      item(three, "bier")!.amount * 2,
      6,
    );
  });

  it("lässt Alkohol ganz weg, wenn er nicht angeboten wird", () => {
    const dry = party({ alcohol: false });
    expect(item(dry, "bier")).toBeUndefined();
    expect(item(dry, "wein")).toBeUndefined();
    expect(item(dry, "softdrinks")).toBeDefined();
  });

  it("rechnet Alkohol nur für Erwachsene", () => {
    const withKids = party({ adults: 10, children: 10 });
    const withoutKids = party({ adults: 10, children: 0 });
    // Bier hängt nur an den Erwachsenen – Kinder ändern daran nichts.
    expect(item(withKids, "bier")?.amount).toBe(item(withoutKids, "bier")?.amount);
    // Softdrinks steigen dagegen.
    expect(item(withKids, "softdrinks")!.amount).toBeGreaterThan(
      item(withoutKids, "softdrinks")!.amount,
    );
  });

  it("gibt es kein Bier ohne Erwachsene", () => {
    const kidsOnly = party({ adults: 0, children: 8 });
    expect(item(kidsOnly, "bier")).toBeUndefined();
    expect(item(kidsOnly, "softdrinks")!.amount).toBeGreaterThan(0);
  });
});

describe("Anlässe", () => {
  it("liefert für jeden Anlass eine passende Hauptposition", () => {
    for (const occasion of ALL_OCCASIONS) {
      const result = party({ occasion });
      expect(result.primary).toBeDefined();
      expect(result.primary.key).toBe(occasions[occasion].primaryKey);
      expect(result.primary.amount).toBeGreaterThan(0);
    }
  });

  it("rechnet Kuchen in ganzen Stücken", () => {
    const result = party({ occasion: "kuchen", adults: 7 });
    expect(item(result, "kuchen")?.amount).toBe(14);
    expect(item(result, "kuchen")?.unit).toBe("Stück");
    expect(Number.isInteger(item(result, "kuchen")!.amount)).toBe(true);
  });

  it("bringt Kohle nur beim Grillen", () => {
    expect(item(party({ occasion: "grillen" }), "kohle")).toBeDefined();
    expect(item(party({ occasion: "buffet" }), "kohle")).toBeUndefined();
    expect(item(party({ occasion: "kuchen" }), "kohle")).toBeUndefined();
  });

  it("bringt Kaffee zum Kuchen und Sekt zum Apéro", () => {
    expect(item(party({ occasion: "kuchen" }), "kaffee")).toBeDefined();
    expect(item(party({ occasion: "apero" }), "sekt")).toBeDefined();
    expect(
      item(party({ occasion: "apero", alcohol: false }), "sekt"),
    ).toBeUndefined();
  });
});

describe("Verbrauchsmaterial", () => {
  it("rechnet Teller und Gläser großzügig", () => {
    const result = party({ adults: 10, children: 0 });
    // Anderthalb je Gast, aufgerundet – einer geht immer verloren.
    expect(item(result, "teller")?.amount).toBe(15);
    expect(item(result, "servietten")?.amount).toBe(30);
  });

  it("zählt Kinder beim Geschirr voll mit", () => {
    // Beim Essen zählen Kinder halb, beim Teller nicht.
    const result = party({ adults: 6, children: 6 });
    expect(result.guests).toBe(12);
    expect(item(result, "teller")?.amount).toBe(18);
  });
});

describe("Hinweise", () => {
  it("warnt bei großer Runde vor dem Grill als Nadelöhr", () => {
    expect(party({ adults: 30 }).warnings.join(" ")).toContain("Nadelöhr");
    expect(party({ adults: 8 }).warnings.join(" ")).not.toContain("Nadelöhr");
  });

  it("erinnert an alkoholfreie Alternativen", () => {
    expect(party({ alcohol: true }).warnings.join(" ")).toContain("alkoholfreie");
    expect(party({ alcohol: false }).warnings.join(" ")).not.toContain(
      "alkoholfreie",
    );
  });

  it("meldet fehlende Gäste", () => {
    expect(party({ adults: 0, children: 0 }).warnings.join(" ")).toContain(
      "Gäste",
    );
  });
});

describe("Invarianten", () => {
  it("liefert für jeden Anlass nur endliche, nicht negative Mengen", () => {
    for (const occasion of ALL_OCCASIONS) {
      for (const adults of [0, 1, 5, 25, 120]) {
        for (const veg of [0, 50, 100]) {
          for (const alcohol of [true, false]) {
            const result = party({ occasion, adults, vegetarianPercent: veg, alcohol });
            for (const entry of [
              ...result.food,
              ...result.drinks,
              ...result.supplies,
            ]) {
              expect(Number.isFinite(entry.amount)).toBe(true);
              expect(entry.amount).toBeGreaterThanOrEqual(0);
            }
          }
        }
      }
    }
  });

  it("wächst monoton mit der Gästezahl", () => {
    let previous = -1;
    for (let adults = 1; adults <= 60; adults += 1) {
      const amount = item(party({ adults }), "fleisch")!.amount;
      expect(amount).toBeGreaterThanOrEqual(previous);
      previous = amount;
    }
  });

  it("fängt unsinnige Eingaben ab", () => {
    const result = party({
      adults: -5,
      children: -3,
      hours: 0,
      vegetarianPercent: 500,
    });
    expect(result.guests).toBe(0);
    expect(result.eaterUnits).toBe(0);
    for (const entry of [...result.food, ...result.drinks, ...result.supplies]) {
      expect(entry.amount).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(entry.amount)).toBe(true);
    }
  });

  it("gibt Stückzahlen immer als ganze Zahl aus", () => {
    for (const occasion of ALL_OCCASIONS) {
      const result = party({ occasion, adults: 7, children: 3 });
      for (const entry of [
        ...result.food,
        ...result.drinks,
        ...result.supplies,
      ]) {
        if (entry.unit === "Stück") {
          expect(Number.isInteger(entry.amount)).toBe(true);
        }
      }
    }
  });
});
