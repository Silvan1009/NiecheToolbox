import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Prose, slugify } from "./Prose";
import type { ContentSection } from "@/tools/types";

const render = (sections?: ContentSection[]) =>
  renderToStaticMarkup(<Prose sections={sections} />);

describe("Prose", () => {
  it("rendert nichts ohne Abschnitte", () => {
    expect(render()).toBe("");
    expect(render([])).toBe("");
  });

  it("verbindet Überschrift und Abschnitt über aria-labelledby", () => {
    const html = render([
      { heading: "Wo der Rechner an Grenzen stößt", blocks: [] },
    ]);

    // Die id muss an beiden Enden dieselbe sein, sonst zeigt die
    // Verknüpfung ins Leere.
    const id = "abschnitt-wo-der-rechner-an-grenzen-stoesst";
    expect(html).toContain(`aria-labelledby="${id}"`);
    expect(html).toContain(`id="${id}"`);
    expect(html).toContain("<h2");
  });

  it("gibt jeden Blocktyp in seiner eigenen Form aus", () => {
    const html = render([
      {
        heading: "Beispiel",
        blocks: [
          { type: "p", text: "Ein Absatz." },
          { type: "ul", items: ["erster Punkt", "zweiter Punkt"] },
          { type: "ol", items: ["Schritt eins"] },
          { type: "note", text: "Ein Hinweis." },
          {
            type: "table",
            caption: "BMI-Kategorien",
            head: ["Kategorie", "Bereich"],
            rows: [["Normalgewicht", "18,5 – 24,9"]],
          },
          {
            type: "links",
            items: [
              { href: "https://example.org/quelle", label: "Die Quelle" },
            ],
          },
        ],
      },
    ]);

    expect(html).toContain("<p>Ein Absatz.</p>");
    expect(html).toContain("<li>erster Punkt</li>");
    expect(html).toContain("<ol");
    expect(html).toContain("Ein Hinweis.");
    expect(html).toContain("<caption");
    expect(html).toContain("BMI-Kategorien");
    expect(html).toContain('<th scope="col"');
    expect(html).toContain("18,5 – 24,9");
    expect(html).toContain('href="https://example.org/quelle"');
  });

  it("öffnet Quellenlinks abgekoppelt vom eigenen Kontext", () => {
    const html = render([
      {
        heading: "Quellen",
        blocks: [
          {
            type: "links",
            items: [{ href: "https://example.org", label: "Amt" }],
          },
        ],
      },
    ]);

    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it("markiert jeden Abschnitt für die Inhaltsmessung", () => {
    // scripts/content-audit.ts zählt ausschließlich, was in [data-prose]
    // steht. Fällt die Markierung weg, misst das Gate plötzlich nichts mehr
    // und wird stillschweigend grün.
    const html = render([
      { heading: "Erster", blocks: [] },
      { heading: "Zweiter", blocks: [] },
    ]);

    expect(html.match(/data-prose/g)).toHaveLength(2);
  });
});

describe("slugify", () => {
  it("löst deutsche Umlaute in Buchstabenpaare auf", () => {
    expect(slugify("Größe und Übergewicht")).toBe("groesse-und-uebergewicht");
    expect(slugify("Straße")).toBe("strasse");
  });

  it("lässt keine führenden oder folgenden Trennstriche stehen", () => {
    expect(slugify("… und jetzt?")).toBe("und-jetzt");
  });
});
