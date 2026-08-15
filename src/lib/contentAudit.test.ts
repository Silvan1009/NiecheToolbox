import { describe, expect, it } from "vitest";
import {
  countWords,
  decodeEntities,
  extractProse,
  jaccard,
  normalizeWords,
  shinglesOf,
} from "./contentAudit";

describe("extractProse", () => {
  it("nimmt nur markierte Abschnitte, nicht den Rahmen", () => {
    const html = `
      <header>Kopfzeile mit Navigation</header>
      <section data-prose><p>Der eigentliche Text.</p></section>
      <footer>Fußzeile mit allen Rechnern</footer>`;

    expect(extractProse(html)).toBe("Der eigentliche Text.");
  });

  it("liest verschachtelte <section> vollständig aus", () => {
    // Genau der Fall, an dem die erste Fassung scheiterte: LegalPage.tsx
    // rendert mehrere <section> innerhalb des markierten Bereichs.
    const html = `
      <section data-prose>
        <section><h2>Erstens</h2><p>Erster Absatz.</p></section>
        <section><h2>Zweitens</h2><p>Zweiter Absatz.</p></section>
      </section>
      <nav>Nicht mitzählen</nav>`;

    const text = extractProse(html);
    expect(text).toContain("Erster Absatz.");
    expect(text).toContain("Zweiter Absatz.");
    expect(text).not.toContain("Nicht mitzählen");
  });

  it("zählt verschachtelte Markierungen nicht doppelt", () => {
    const html = `
      <section data-prose>
        <section data-prose><p>Einmal.</p></section>
      </section>`;

    expect(countWords(extractProse(html))).toBe(1);
  });

  it("sammelt mehrere getrennte Abschnitte ein", () => {
    const html = `
      <section data-prose><p>Eins.</p></section>
      <div>Dazwischen</div>
      <section data-prose><p>Zwei.</p></section>`;

    expect(extractProse(html)).toBe("Eins. Zwei.");
  });

  it("verschmilzt keine Wörter über Blockgrenzen hinweg", () => {
    const html = `<section data-prose><p>Ende</p><p>Anfang</p></section>`;
    expect(extractProse(html)).toBe("Ende Anfang");
  });

  it("liefert leeren Text, wenn nichts markiert ist", () => {
    expect(extractProse("<div><p>Ohne Markierung</p></div>")).toBe("");
  });

  it("überspringt einen unabgeschlossenen Abschnitt, statt abzustürzen", () => {
    const html = `<section data-prose><p>Kein Ende in Sicht.</p>`;
    expect(extractProse(html)).toBe("");
  });
});

describe("decodeEntities", () => {
  it("löst benannte und numerische Entities auf", () => {
    expect(decodeEntities("Gr&ouml;&szlig;e")).toBe("Größe");
    expect(decodeEntities("5&nbsp;&euro;")).toBe("5 €");
    expect(decodeEntities("&#8211;")).toBe("–");
    expect(decodeEntities("&#x27;")).toBe("'");
  });
});

describe("normalizeWords", () => {
  it("wirft Satzzeichen weg und schreibt klein", () => {
    expect(normalizeWords("Der Preis: 350.000 Euro!")).toEqual([
      "der",
      "preis",
      "350",
      "000",
      "euro",
    ]);
  });

  it("behält Umlaute als Buchstaben", () => {
    expect(normalizeWords("Größe Übergewicht")).toEqual([
      "größe",
      "übergewicht",
    ]);
  });
});

describe("shinglesOf", () => {
  it("bildet überlappende Vierergruppen", () => {
    expect([...shinglesOf("eins zwei drei vier fünf")]).toEqual([
      "eins zwei drei vier",
      "zwei drei vier fünf",
    ]);
  });

  it("liefert nichts unterhalb der Fenstergröße", () => {
    expect(shinglesOf("eins zwei drei").size).toBe(0);
  });
});

describe("jaccard", () => {
  it("ist 1 bei gleichem und 0 bei verschiedenem Text", () => {
    const a = shinglesOf("der schnelle braune fuchs springt");
    expect(jaccard(a, new Set(a))).toBe(1);
    expect(jaccard(a, shinglesOf("ganz andere wörter stehen hier"))).toBe(0);
  });

  it("misst teilweise Überlappung symmetrisch", () => {
    const a = shinglesOf("eins zwei drei vier fünf");
    const b = shinglesOf("eins zwei drei vier sechs");
    expect(jaccard(a, b)).toBeCloseTo(1 / 3, 5);
    expect(jaccard(a, b)).toBe(jaccard(b, a));
  });

  it("ist 0, sobald eine Seite keinen Text hat", () => {
    expect(jaccard(new Set(), shinglesOf("eins zwei drei vier"))).toBe(0);
  });
});
