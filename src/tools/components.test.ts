import { describe, expect, it } from "vitest";
import { toolComponents } from "./components";
import { publicTools, tools } from "./registry";

/**
 * Component und Manifest liegen bewusst in getrennten Dateien (siehe
 * components.tsx). Der Preis dafür ist, dass beide auseinanderlaufen können –
 * ohne diesen Test würde ein neu registriertes Tool erst beim Aufruf seiner
 * Seite als leere Stelle auffallen.
 */
describe("toolComponents", () => {
  it("jedes erreichbare Tool hat eine Component", () => {
    for (const tool of publicTools()) {
      expect(
        toolComponents[tool.slug],
        `Tool "${tool.slug}" fehlt in tools/components.tsx`,
      ).toBeDefined();
    }
  });

  it("keine Component ohne Tool in der Registry", () => {
    const slugs = new Set(tools.map((tool) => tool.slug));
    for (const slug of Object.keys(toolComponents)) {
      expect(
        slugs.has(slug),
        `"${slug}" steht in tools/components.tsx, aber in keinem Manifest`,
      ).toBe(true);
    }
  });
});
