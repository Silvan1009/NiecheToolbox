import { describe, expect, it } from "vitest";
import { publicTools } from "./registry";

describe("Varianten", () => {
  it("jede Variantenseite hat eindeutige FAQ-Fragen – Faq.tsx schlüsselt nach dem Text", () => {
    for (const tool of publicTools()) {
      for (const variant of tool.getVariants?.() ?? []) {
        const faq = variant.faq ?? tool.faq ?? [];
        const questions = faq.map((entry) => entry.question);
        expect(
          new Set(questions).size,
          `${tool.slug}/${variant.slug} hat doppelte FAQ-Fragen`,
        ).toBe(questions.length);
      }
    }
  });

  it("Variantenslugs sind je Tool eindeutig", () => {
    for (const tool of publicTools()) {
      const slugs = (tool.getVariants?.() ?? []).map((v) => v.slug);
      expect(
        new Set(slugs).size,
        `Tool "${tool.slug}" hat doppelte Variantenslugs`,
      ).toBe(slugs.length);
    }
  });

  it("jede Variante hat einen nicht-leeren Erklärtext", () => {
    for (const tool of publicTools()) {
      for (const variant of tool.getVariants?.() ?? []) {
        const about = variant.about ?? tool.about ?? [];
        expect(
          about.length,
          `${tool.slug}/${variant.slug} hat keinen Erklärtext`,
        ).toBeGreaterThan(0);
      }
    }
  });

  /**
   * Eine Variante, die nur andere Startwerte setzt, ist aus Sicht einer Suche
   * wie einer AdSense-Prüfung eine Dublette der Tool-Seite – "low value
   * content". Jede Variantenseite muss deshalb eigenen Text mitbringen, nicht
   * den des Tools erben.
   */
  it("jede Variante bringt eigenen Text und eigene Fragen mit", () => {
    for (const tool of publicTools()) {
      for (const variant of tool.getVariants?.() ?? []) {
        const wo = `${tool.slug}/${variant.slug}`;

        expect(
          variant.about?.length ?? 0,
          `${wo} erbt den Erklärtext des Tools`,
        ).toBeGreaterThan(0);
        expect(
          variant.faq?.length ?? 0,
          `${wo} erbt die FAQ des Tools`,
        ).toBeGreaterThan(0);

        // Der erste Absatz trägt die Seite – er darf nicht der des Tools sein.
        expect(variant.about?.[0], `${wo} beginnt mit dem Tool-Text`).not.toBe(
          tool.about?.[0],
        );

        const eigene = (variant.faq ?? []).filter(
          (entry) =>
            !(tool.faq ?? []).some(
              (geteilt) => geteilt.answer === entry.answer,
            ),
        );
        expect(
          eigene.length,
          `${wo} hat keine eigene Frage, nur die des Tools`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("Titel und Description sind je Tool eindeutig", () => {
    for (const tool of publicTools()) {
      const varianten = tool.getVariants?.() ?? [];
      for (const feld of ["title", "description"] as const) {
        const werte = varianten.map((variant) => variant[feld]);
        expect(
          new Set(werte).size,
          `Tool "${tool.slug}" hat doppelte Variant-${feld}`,
        ).toBe(werte.length);
      }
    }
  });

  it("getVariants() liefert bei zwei Aufrufen dieselbe Anzahl – kein zeitabhängiger Zustand", () => {
    for (const tool of publicTools()) {
      if (!tool.getVariants) continue;
      const first = tool.getVariants().length;
      const second = tool.getVariants().length;
      expect(
        second,
        `Tool "${tool.slug}" liefert bei erneutem Aufruf eine andere Anzahl`,
      ).toBe(first);
    }
  });
});
