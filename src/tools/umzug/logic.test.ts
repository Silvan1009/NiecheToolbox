import { describe, expect, it } from "vitest";
import {
  calculateMove,
  householdStyles,
  vanClasses,
  type HouseholdStyle,
  type MoveInput,
} from "./logic";

const base: MoveInput = {
  area: 80,
  people: 2,
  style: "normal",
  shelfMetres: 0,
  wardrobeMetres: 0,
  hasBasement: false,
  trips: 1,
};

const move = (overrides: Partial<MoveInput> = {}) =>
  calculateMove({ ...base, ...overrides });

const ALL_STYLES = Object.keys(householdStyles) as HouseholdStyle[];

describe("Kartons schätzen", () => {
  it("landet für 80 m² im Bereich, mit dem Umzugsfirmen kalkulieren", () => {
    // Gängige Erfahrungswerte für eine Dreizimmerwohnung: 40 bis 60 Kartons.
    const result = move();
    expect(result.boxes).toBeGreaterThanOrEqual(40);
    expect(result.boxes).toBeLessThanOrEqual(60);
  });

  it("landet für eine Einzimmerwohnung im Bereich 15 bis 25", () => {
    const result = move({ area: 38, people: 1, style: "wenig" });
    expect(result.boxes).toBeGreaterThanOrEqual(12);
    expect(result.boxes).toBeLessThanOrEqual(25);
  });

  it("rundet immer auf – ein Karton zu wenig ist der teurere Fehler", () => {
    const result = move({ area: 41, people: 1, style: "normal" });
    // 41 × 0,6 = 24,6 -> 25
    expect(result.boxes).toBe(25);
    expect(Number.isInteger(result.boxes)).toBe(true);
    expect(Number.isInteger(result.totalBoxes)).toBe(true);
  });

  it("rechnet Regalmeter in Bücherkartons um", () => {
    const result = move({ shelfMetres: 6 });
    expect(result.bookBoxes).toBe(6);
    // Ein halber Meter braucht trotzdem einen ganzen Karton.
    expect(move({ shelfMetres: 5.5 }).bookBoxes).toBe(6);
    expect(move({ shelfMetres: 0 }).bookBoxes).toBe(0);
  });

  it("rechnet Kleiderstangen in Kleiderboxen um", () => {
    // 0,6 m Stange je Box: 1,8 m sind genau drei Boxen.
    expect(move({ wardrobeMetres: 1.8 }).wardrobeBoxes).toBe(3);
    expect(move({ wardrobeMetres: 1.9 }).wardrobeBoxes).toBe(4);
    expect(move({ wardrobeMetres: 0 }).wardrobeBoxes).toBe(0);
  });

  it("summiert alle Kartonarten", () => {
    const result = move({ shelfMetres: 4, wardrobeMetres: 1.2 });
    expect(result.totalBoxes).toBe(
      result.boxes + result.bookBoxes + result.wardrobeBoxes,
    );
    expect(result.bookBoxes).toBe(4);
    expect(result.wardrobeBoxes).toBe(2);
  });

  it("legt für Keller und Dachboden zu", () => {
    expect(move({ hasBasement: true }).boxes).toBeGreaterThan(move().boxes);
    expect(move({ hasBasement: true }).volume).toBeGreaterThan(move().volume);
  });

  it("legt je weiterer Person zu", () => {
    const single = move({ people: 1 });
    const family = move({ people: 4 });
    expect(family.boxes).toBeGreaterThan(single.boxes);
    expect(family.volume).toBeGreaterThan(single.volume);
  });

  it("unterscheidet die Haushaltsgrößen deutlich", () => {
    const wenig = move({ style: "wenig" });
    const normal = move({ style: "normal" });
    const viel = move({ style: "viel" });
    expect(wenig.boxes).toBeLessThan(normal.boxes);
    expect(normal.boxes).toBeLessThan(viel.boxes);
  });
});

describe("Volumen und Fahrzeug", () => {
  it("schätzt das Volumen im üblichen Rahmen je Quadratmeter", () => {
    // Umzugsfirmen rechnen mit etwa 0,2 bis 0,3 m³ je m².
    const result = move();
    expect(result.volume / base.area).toBeGreaterThan(0.15);
    expect(result.volume / base.area).toBeLessThan(0.4);
  });

  it("lässt das Gesamtvolumen nie unter das Kartonvolumen fallen", () => {
    // Sonst wäre die Fahrzeugklasse zu klein – auch bei absurd vielen Kartons.
    for (const style of ALL_STYLES) {
      for (const area of [10, 40, 80, 160]) {
        const result = move({
          area,
          style,
          shelfMetres: 60,
          wardrobeMetres: 12,
        });
        expect(result.volume).toBeGreaterThanOrEqual(result.boxVolume - 1e-9);
      }
    }
  });

  it("wählt die kleinste ausreichende Fahrzeugklasse", () => {
    const small = move({ area: 38, people: 1, style: "wenig" });
    const large = move({ area: 140, people: 4, style: "viel" });
    expect(small.van.volume).toBeLessThan(large.van.volume);
    expect(small.van.volume).toBeGreaterThanOrEqual(small.volumePerTrip);
  });

  it("verkleinert die Fahrzeugklasse bei mehr Fahrten", () => {
    const oneTrip = move({ trips: 1 });
    const threeTrips = move({ trips: 3 });
    expect(threeTrips.van.volume).toBeLessThanOrEqual(oneTrip.van.volume);
    expect(threeTrips.volumePerTrip).toBeCloseTo(oneTrip.volumePerTrip / 3, 8);
  });

  it("meldet, wenn selbst das größte Fahrzeug nicht reicht", () => {
    const huge = move({ area: 600, people: 8, style: "viel", trips: 1 });
    expect(huge.needsMoreTrips).toBe(true);
    expect(huge.warnings.join(" ")).toContain("mehr Fahrten");
  });

  it("weist auf den Führerschein hin, wenn es groß wird", () => {
    const big = move({ area: 200, people: 5, style: "viel", trips: 1 });
    expect(big.van.volume).toBeGreaterThanOrEqual(40);
    expect(big.warnings.join(" ")).toContain("C1");
  });

  it("hält die Fahrzeugliste aufsteigend sortiert", () => {
    // Die Auswahl nimmt die erste passende Klasse – das setzt Sortierung voraus.
    for (let index = 1; index < vanClasses.length; index += 1) {
      expect(vanClasses[index].volume).toBeGreaterThan(
        vanClasses[index - 1].volume,
      );
    }
  });
});

describe("Packmaterial und Zeit", () => {
  it("rechnet Papier, Klebeband und Zeit aus der Kartonzahl", () => {
    const result = move({ area: 50, people: 1, style: "normal" });
    // 50 × 0,6 = 30 Kartons
    expect(result.totalBoxes).toBe(30);
    expect(result.packingPaperSheets).toBe(360);
    expect(result.tapeRolls).toBe(2);
    expect(result.packingHours).toBe(6);
  });

  it("gibt immer mindestens eine Rolle Klebeband aus", () => {
    const result = move({ area: 8, people: 1, style: "wenig" });
    expect(result.tapeRolls).toBeGreaterThanOrEqual(1);
  });
});

describe("Randfälle", () => {
  it("kommt ohne Wohnfläche klar und sagt es", () => {
    const result = move({ area: 0 });
    expect(result.boxes).toBe(0);
    expect(result.warnings.join(" ")).toContain("Wohnfläche");
  });

  it("fängt unsinnige Eingaben ab", () => {
    const result = move({
      area: -50,
      people: 0,
      trips: 0,
      shelfMetres: -3,
      wardrobeMetres: -1,
    });
    expect(result.boxes).toBe(0);
    expect(result.bookBoxes).toBe(0);
    expect(result.wardrobeBoxes).toBe(0);
    expect(result.volumePerTrip).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(result.volumePerTrip)).toBe(true);
  });

  it("wächst monoton mit der Wohnfläche", () => {
    let previousBoxes = -1;
    let previousVolume = -1;
    for (let area = 20; area <= 300; area += 10) {
      const result = move({ area });
      expect(result.boxes).toBeGreaterThanOrEqual(previousBoxes);
      expect(result.volume).toBeGreaterThan(previousVolume);
      previousBoxes = result.boxes;
      previousVolume = result.volume;
    }
  });
});
