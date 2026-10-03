import { Calculator } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VariantList } from "./VariantList";
import type { ToolManifest, ToolVariant } from "@/tools/types";

const variant = (
  slug: string,
  extra: Partial<ToolVariant> = {},
): ToolVariant => ({
  slug,
  title: `Titel ${slug}`,
  description: `Beschreibung ${slug}`,
  params: {},
  ...extra,
});

const toolWith = (variants: ToolVariant[]): ToolManifest => ({
  slug: "beispiel",
  name: "Beispielrechner",
  tagline: "Ein Satz.",
  seoTitle: "Beispielrechner",
  metaDescription: "Eine Beschreibung.",
  category: "alltag",
  icon: Calculator,
  keywords: [],
  status: "live",
  getVariants: () => variants,
});

const render = (tool: ToolManifest, currentSlug?: string) =>
  renderToStaticMarkup(<VariantList tool={tool} currentSlug={currentSlug} />);

/**
 * Ohne den Next-Build-Kontext lässt `next/link` den abschließenden
 * Schrägstrich weg, den `variantPath()` mitgibt – `trailingSlash: true` aus
 * next.config.ts greift erst im Export. Im ausgelieferten HTML steht der
 * Schrägstrich (nachgeprüft auf der Live-Seite), hier nicht. Die Zusicherungen
 * enden deshalb vor ihm.
 */
const linkTo = (path: string) => `href="${path}`;

describe("VariantList", () => {
  it("rendert nichts, wenn das Tool keine Varianten hat", () => {
    const tool = toolWith([]);
    expect(render(tool)).toBe("");

    const ohneGetVariants = { ...tool, getVariants: undefined };
    expect(render(ohneGetVariants)).toBe("");
  });

  it("verlinkt jede Variante unter /tools/<tool>/<variante>/", () => {
    const html = render(toolWith([variant("a"), variant("b")]));

    expect(html).toContain(linkTo("/tools/beispiel/a"));
    expect(html).toContain(linkTo("/tools/beispiel/b"));
  });

  it("zeigt die offene Variante ohne Link, aber weiterhin in der Liste", () => {
    const html = render(toolWith([variant("a"), variant("b")]), "a");

    // Ein Link auf die Seite, auf der man schon steht, ist eine Sackgasse –
    // weglassen darf man den Eintrag trotzdem nicht, sonst springt die Liste
    // von Seite zu Seite.
    expect(html).not.toContain(linkTo("/tools/beispiel/a"));
    expect(html).toContain('aria-current="page"');
    expect(html).toContain(linkTo("/tools/beispiel/b"));
  });

  it("bevorzugt listLabel vor heading und title", () => {
    const html = render(
      toolWith([
        variant("a", { listLabel: "Bayern", heading: "Lange Überschrift" }),
        variant("b", { heading: "Nur Überschrift" }),
        variant("c"),
      ]),
    );

    expect(html).toContain(">Bayern<");
    expect(html).toContain(">Nur Überschrift<");
    expect(html).toContain(">Titel c<");
    expect(html).not.toContain("Lange Überschrift");
  });

  it("gruppiert erst, sobald eine Variante eine Gruppe nennt", () => {
    const ohne = render(toolWith([variant("a"), variant("b")]));
    expect(ohne).not.toContain("<h3");

    const mit = render(
      toolWith([
        variant("a", { listGroup: "2026" }),
        variant("b", { listGroup: "2027" }),
        variant("c", { listGroup: "2026" }),
      ]),
    );
    expect(mit.match(/<h3/g)).toHaveLength(2);
    expect(mit).toContain(">2026<");
    expect(mit).toContain(">2027<");
  });

  it("hält die Reihenfolge der Gruppen und sammelt Nachzügler ein", () => {
    const html = render(
      toolWith([
        variant("a", { listGroup: "2026" }),
        variant("b", { listGroup: "2027" }),
        variant("c", { listGroup: "2026" }),
      ]),
    );

    // 2026 zuerst, weil dort die erste Variante steht – und "c" landet in
    // derselben Gruppe, obwohl 2027 dazwischenliegt.
    expect(html.indexOf(">2026<")).toBeLessThan(html.indexOf(">2027<"));
    expect(html.indexOf(linkTo("/tools/beispiel/c"))).toBeLessThan(
      html.indexOf(linkTo("/tools/beispiel/b")),
    );
  });

  it("nennt die Anzahl der Unterseiten", () => {
    const html = render(toolWith([variant("a"), variant("b"), variant("c")]));
    expect(html).toContain("3 fertig eingestellte Seiten");
  });
});
