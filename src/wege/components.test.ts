import { describe, expect, it } from "vitest";
import { wegComponents } from "./components";
import { publicWege, wege } from "./registry";

/**
 * Component und Manifest liegen bewusst in getrennten Dateien (siehe
 * components.ts). Der Preis dafür ist, dass beide auseinanderlaufen können –
 * ohne diesen Test würde ein neu registrierter Weg erst beim Aufruf seiner
 * Seite als leere Stelle auffallen.
 */
describe("wegComponents", () => {
  it("jeder erreichbare Weg hat eine Component", () => {
    for (const weg of publicWege()) {
      expect(
        wegComponents[weg.slug],
        `Weg "${weg.slug}" fehlt in wege/components.ts`,
      ).toBeDefined();
    }
  });

  it("keine Component ohne Weg in der Registry", () => {
    const slugs = new Set(wege.map((weg) => weg.slug));
    for (const slug of Object.keys(wegComponents)) {
      expect(
        slugs.has(slug),
        `"${slug}" steht in wege/components.ts, aber in keinem Manifest`,
      ).toBe(true);
    }
  });
});
