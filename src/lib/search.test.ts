import { describe, expect, it } from "vitest";
import { filterEntries, normalize, type SearchEntry } from "./search";

describe("normalize", () => {
  it("expandiert Umlaute und ß", () => {
    expect(normalize("Kündigung")).toBe("kuendigung");
    expect(normalize("Straße")).toBe("strasse");
    expect(normalize("KGV")).toBe("kgv");
  });

  it("kollabiert Interpunktion zu Leerzeichen und trimmt", () => {
    expect(normalize("  EV/EBITDA-Rechner!! ")).toBe("ev ebitda rechner");
  });
});

const index: SearchEntry[] = [
  {
    href: "/tools/trinkgeld/",
    name: "Trinkgeld-Splitter",
    hint: "Rechnung plus Trinkgeld fair aufteilen.",
    tags: ["Trinkgeld", "Restaurant", "Rechnung teilen"],
  },
  {
    href: "/tools/umzug/",
    name: "Umzugs-Rechner",
    hint: "Kartons, Volumen und Transporter für den Umzug.",
    tags: ["Umzug", "Umzugskartons", "Kartons", "Kubikmeter"],
  },
  {
    href: "/tools/stromkosten/",
    name: "Stromkosten-Rechner",
    hint: "Was ein Gerät im Jahr an Strom kostet.",
    tags: ["Strom", "Stromkosten", "kWh"],
  },
  {
    href: "/tools/kuendigungsfrist/",
    name: "Kündigungsfrist-Rechner",
    hint: "Kündigungsfrist für Job oder Wohnung berechnen.",
    tags: ["Kündigung", "Kündigungsfrist", "Mietvertrag"],
  },
  {
    href: "/tools/aktienkennzahlen/",
    name: "Aktien-Kennzahlen-Rechner",
    hint: "Dreißig Kennzahlen aus einem Geschäftsbericht.",
    tags: ["Aktien", "Kennzahlen", "Bewertung"],
  },
  {
    href: "/tools/aktienkennzahlen/kgv-berechnen/",
    name: "KGV berechnen",
    hint: "Kurs-Gewinn-Verhältnis einer Aktie berechnen.",
    parentName: "Aktien-Kennzahlen-Rechner",
    tags: ["KGV", "Kurs-Gewinn-Verhältnis", "Bewertung"],
  },
];

describe("filterEntries", () => {
  it("liefert bei leerer oder reiner Whitespace-Query nichts", () => {
    expect(filterEntries(index, "")).toEqual([]);
    expect(filterEntries(index, "   ")).toEqual([]);
  });

  it("findet Treffer unabhängig von Umlaut-Schreibweise", () => {
    for (const query of ["kündigung", "kuendigung", "kundigung"]) {
      const hits = filterEntries(index, query);
      expect(hits[0]?.href).toBe("/tools/kuendigungsfrist/");
    }
  });

  it("verknüpft mehrere Wörter per UND", () => {
    expect(filterEntries(index, "strom kosten")[0]?.href).toBe(
      "/tools/stromkosten/",
    );
    expect(filterEntries(index, "strom bayern")).toEqual([]);
  });

  it("rankt einen Namenspräfix-Treffer nach oben", () => {
    expect(filterEntries(index, "trink")[0]?.href).toBe("/tools/trinkgeld/");
  });

  it("stellt die exakte Unterseite vor das Eltern-Tool, wenn der Tag exakt passt", () => {
    const hits = filterEntries(index, "kgv");
    expect(hits[0]?.href).toBe("/tools/aktienkennzahlen/kgv-berechnen/");
  });

  it("stellt das Eltern-Tool vor seine Unterseiten, wenn beide gleich gut passen", () => {
    const hits = filterEntries(index, "aktien");
    expect(hits[0]?.href).toBe("/tools/aktienkennzahlen/");
  });

  it("matcht über Tags, auch wenn der Name nicht passt", () => {
    expect(filterEntries(index, "kartons")[0]?.href).toBe("/tools/umzug/");
    expect(filterEntries(index, "kwh")[0]?.href).toBe("/tools/stromkosten/");
  });

  it("liefert keine Duplikate und respektiert das Limit", () => {
    const hits = filterEntries(index, "rechner", 2);
    expect(hits.length).toBeLessThanOrEqual(2);
    expect(new Set(hits.map((h) => h.href)).size).toBe(hits.length);
  });

  it("jeder Treffer hat einen Pfad mit Trailing Slash", () => {
    for (const hit of filterEntries(index, "rechner", 20)) {
      expect(hit.href.endsWith("/")).toBe(true);
    }
  });
});
