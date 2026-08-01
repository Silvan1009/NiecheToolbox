import { describe, expect, it } from "vitest";
import { toolGroups } from "./groups";
import { publicTools } from "./registry";

describe("toolGroups", () => {
  const knownSlugs = new Set(publicTools().map((t) => t.slug));

  it("jeder öffentliche Rechner steckt in mindestens einer Gruppe", () => {
    for (const slug of knownSlugs) {
      const inAnyGroup = toolGroups.some((group) => group.tools.includes(slug));
      expect(inAnyGroup, `Tool "${slug}" ist in keiner Gruppe`).toBe(true);
    }
  });

  it("jeder in einer Gruppe referenzierte Slug existiert in der Registry", () => {
    for (const group of toolGroups) {
      for (const slug of group.tools) {
        expect(
          knownSlugs.has(slug),
          `Gruppe "${group.slug}" referenziert unbekanntes Tool "${slug}"`,
        ).toBe(true);
      }
    }
  });

  it("Gruppen-Slugs sind eindeutig und URL-tauglich", () => {
    const slugs = toolGroups.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("keine Gruppe hat weniger als drei Rechner", () => {
    for (const group of toolGroups) {
      expect(
        group.tools.length,
        `Gruppe "${group.slug}" hat zu wenige Tools`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("jede Gruppe hat einen eigenen Hinweistext", () => {
    for (const group of toolGroups) {
      expect(group.hint.length).toBeGreaterThan(0);
    }
  });
});
