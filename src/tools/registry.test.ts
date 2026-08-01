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
