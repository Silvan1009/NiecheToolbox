import { describe, expect, it } from "vitest";
import { adSlotAllowed, type AdDensity, type AdPlacement } from "./adPlacement";

describe("adSlotAllowed", () => {
  // Die vollständige Matrix – das ist die Platzierungsregel der Seite und
  // soll sich nicht unbemerkt verschieben.
  const cases: Array<[AdPlacement, AdDensity, boolean]> = [
    ["below-result", "none", false],
    ["below-result", "low", true],
    ["below-result", "medium", true],
    ["below-content", "none", false],
    ["below-content", "low", false],
    ["below-content", "medium", true],
  ];

  for (const [placement, density, expected] of cases) {
    it(`${placement} bei ${density} → ${expected ? "erlaubt" : "kein Slot"}`, () => {
      expect(adSlotAllowed(placement, density)).toBe(expected);
    });
  }

  it("schaltet bei 'none' jede Platzierung ab", () => {
    const placements: AdPlacement[] = ["below-result", "below-content"];
    expect(placements.every((p) => !adSlotAllowed(p, "none"))).toBe(true);
  });

  it("gibt den zweiten Slot erst bei 'medium' frei", () => {
    expect(adSlotAllowed("below-content", "low")).toBe(false);
    expect(adSlotAllowed("below-content", "medium")).toBe(true);
  });
});
