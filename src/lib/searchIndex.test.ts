/**
 * Drift-Wächter: searchIndex.ts ist handgepflegt (siehe Kommentar dort) und
 * muss deshalb aktiv gegen die Registry abgeglichen werden. Wer ein Tool
 * hinzufügt oder eine Aktienkennzahl-Variante ändert, bekommt hier einen
 * roten Test statt einer stillen Lücke im Suchfeld.
 */
import { describe, expect, it } from "vitest";
import { toolPath, variantPath } from "./seo";
import { searchIndex } from "./searchIndex";
import { TOOLS_MIT_INDIZIERTEN_VARIANTEN } from "@/tools/groups";
import { publicTools } from "@/tools/registry";

describe("searchIndex", () => {
  it("enthält genau einen Eintrag pro öffentlichem Tool, mit passendem Pfad und Namen", () => {
    for (const tool of publicTools()) {
      const matches = searchIndex.filter(
        (entry) => !entry.parentName && entry.href === toolPath(tool.slug),
      );
      expect(matches, `Tool "${tool.slug}" fehlt im Suchindex`).toHaveLength(1);
      expect(matches[0]?.name).toBe(tool.name);
    }
  });

  it("führt keine Tool-Einträge ohne Registry-Gegenstück", () => {
    const toolHrefs = new Set(publicTools().map((t) => toolPath(t.slug)));
    for (const entry of searchIndex) {
      if (entry.parentName) continue;
      expect(toolHrefs.has(entry.href), `verwaister Eintrag: ${entry.href}`).toBe(true);
    }
  });

  it("bildet die Varianten der Themen-Tools ab und keine anderen", () => {
    for (const slug of TOOLS_MIT_INDIZIERTEN_VARIANTEN) {
      const tool = publicTools().find((t) => t.slug === slug);
      expect(tool, `Tool "${slug}" fehlt in der Registry`).toBeDefined();

      const variants = tool?.getVariants?.() ?? [];
      expect(variants.length).toBeGreaterThan(0);

      for (const variant of variants) {
        const match = searchIndex.find(
          (entry) => entry.href === variantPath(slug, variant.slug),
        );
        expect(
          match,
          `Variante "${slug}/${variant.slug}" fehlt im Suchindex`,
        ).toBeDefined();
        expect(match?.parentName).toBe(tool?.name);
      }
    }

    // Keine Varianten der übrigen Tools (Bundesland×Jahr, Regionen,
    // Backform-Paare …) – die würden das Suchfeld mit Dutzenden fast
    // gleichlautender Treffer fluten.
    const uebrige = publicTools().filter(
      (t) => !TOOLS_MIT_INDIZIERTEN_VARIANTEN.includes(t.slug),
    );
    for (const tool of uebrige) {
      const variantHrefs = new Set(
        (tool.getVariants?.() ?? []).map((v) => variantPath(tool.slug, v.slug)),
      );
      for (const entry of searchIndex) {
        expect(
          variantHrefs.has(entry.href),
          `Variante von "${tool.slug}" gehört nicht in den Index: ${entry.href}`,
        ).toBe(false);
      }
    }
  });

  it("hat eindeutige Pfade, mindestens einen Tag je Eintrag und kurze Hinweise", () => {
    const hrefs = searchIndex.map((entry) => entry.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);

    for (const entry of searchIndex) {
      expect(entry.href.endsWith("/")).toBe(true);
      expect(entry.tags.length).toBeGreaterThan(0);
      expect(entry.hint.length).toBeLessThanOrEqual(60);
    }
  });
});
