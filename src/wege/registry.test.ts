import { describe, expect, it } from "vitest";
import { getTool } from "@/tools/registry";
import { getWeg, publicWege, wege } from "./registry";

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

  it("jeder sourceTools-Eintrag löst über die Tool-Registry auf", () => {
    for (const weg of wege) {
      for (const slug of weg.sourceTools) {
        expect(
          getTool(slug),
          `Weg "${weg.slug}" referenziert unbekanntes Tool "${slug}"`,
        ).toBeDefined();
      }
    }
  });
});
