import { describe, expect, it } from "vitest";
import { getTool } from "@/tools/registry";
import { getWeg, publicWege, wege, wegeForTool } from "./registry";

describe("wege-Registry", () => {
  it("getWeg liefert undefined für unbekannte und für draft-Slugs", () => {
    expect(getWeg("nicht-vorhanden")).toBeUndefined();

    const draft = wege.find((w) => w.status === "draft");
    if (draft) expect(getWeg(draft.slug)).toBeUndefined();
  });

  it("publicWege() schließt draft aus", () => {
    for (const weg of publicWege()) {
      expect(weg.status).not.toBe("draft");
    }
  });

  it("Slugs sind eindeutig", () => {
    const slugs = wege.map((w) => w.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("jeder sourceTools-Eintrag löst über die Tool-Registry auf und trägt beide Texte", () => {
    for (const weg of wege) {
      for (const source of weg.sourceTools) {
        expect(
          getTool(source.slug),
          `Weg "${weg.slug}" referenziert unbekanntes Tool "${source.slug}"`,
        ).toBeDefined();
        expect(source.detailEyebrow.length).toBeGreaterThan(0);
        expect(source.detailDescription.length).toBeGreaterThan(0);
        expect(source.backlinkDescription.length).toBeGreaterThan(0);
      }
    }
  });

  it("wegeForTool findet jeden Weg über seine sourceTools wieder", () => {
    for (const weg of publicWege()) {
      for (const source of weg.sourceTools) {
        const gefunden = wegeForTool(source.slug);
        expect(gefunden.map((w) => w.slug)).toContain(weg.slug);
      }
    }
  });

  it("wegeForTool liefert eine leere Liste für ein Tool ohne Weg", () => {
    expect(wegeForTool("nicht-vorhanden")).toEqual([]);
  });
});
