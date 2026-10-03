import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { publicTools } from "@/tools/registry";
import { publicWege } from "@/wege/registry";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  pageMetadata,
  pageTitle,
  STATIC_OG_PREFIX,
  TITLE_MAX,
  toolSeo,
  wegSeo,
} from "./seo";

describe("pageTitle", () => {
  it("hängt den Seitennamen an, solange der Titel kurz genug bleibt", () => {
    expect(pageTitle("Impressum")).toBe(`Impressum | ${site.name}`);
  });

  // Der Inhalt hat Vorrang: Abgeschnitten würde sonst der Teil des Titels,
  // der die Seite beschreibt, nicht der Markenname.
  it("lässt ihn weg, bevor der Titel über die Grenze läuft", () => {
    const long = "Kündigungsfrist-Rechner für Wohnung und Arbeitsvertrag";
    expect(pageTitle(long)).toBe(long);
    expect(pageTitle(long).length).toBeLessThanOrEqual(TITLE_MAX);
  });
});

describe("pageMetadata", () => {
  const meta = pageMetadata({
    title: "BMI-Rechner",
    description: "Eine Beschreibung.",
    path: "/tools/bmi/",
    image: "/og/bmi.png",
    imageAlt: "BMI-Rechner",
  });

  it("setzt den Canonical auf die Seite selbst", () => {
    expect(meta.alternates?.canonical).toBe("/tools/bmi/");
  });

  // Next ersetzt openGraph als Ganzes. Was hier fehlt, fehlt auf der Seite –
  // so verloren die Rechnerseiten früher og:site_name und og:locale.
  it("bringt ein vollständiges Open-Graph-Objekt mit", () => {
    expect(meta.openGraph).toMatchObject({
      siteName: site.name,
      locale: "de_DE",
      url: "/tools/bmi/",
      title: "BMI-Rechner",
    });
    expect(meta.openGraph?.images).toEqual([
      { url: "/og/bmi.png", width: 1200, height: 630, alt: "BMI-Rechner" },
    ]);
  });

  it("nimmt eine Seite auf Wunsch aus dem Index, ohne ihre Links zu entwerten", () => {
    const hidden = pageMetadata({
      title: "Favoriten",
      description: "…",
      path: "/favoriten/",
      image: "/og/x.png",
      imageAlt: "Favoriten",
      index: false,
    });
    expect(hidden.robots).toEqual({ index: false, follow: true });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });
});

/**
 * Titel und Beschreibung jeder Rechner-, Varianten- und Weg-Seite gegen die
 * Grenzen aus lib/seo.ts. Vor dieser Prüfung lagen 50 von 67 Titeln über 60
 * Zeichen und 24 Beschreibungen unter 110.
 */
describe("Titel und Beschreibungen", () => {
  const pages = [
    ...publicTools().flatMap((tool) => [
      { id: `tools/${tool.slug}`, ...toolSeo(tool) },
      ...(tool.getVariants?.() ?? []).map((variant) => ({
        id: `tools/${tool.slug}/${variant.slug}`,
        ...toolSeo(tool, variant),
      })),
    ]),
    ...publicWege().flatMap((weg) => [
      { id: `wege/${weg.slug}`, ...wegSeo(weg) },
      ...(weg.getVariants?.() ?? []).map((variant) => ({
        id: `wege/${weg.slug}/${variant.slug}`,
        ...wegSeo(weg, variant),
      })),
    ]),
  ];

  it("es gibt Seiten zu prüfen", () => {
    expect(pages.length).toBeGreaterThan(30);
  });

  it(`kein Titel ist länger als ${TITLE_MAX} Zeichen`, () => {
    for (const page of pages) {
      const shown = pageTitle(page.title);
      expect(
        shown.length,
        `${page.id}: „${shown}“ hat ${shown.length} Zeichen`,
      ).toBeLessThanOrEqual(TITLE_MAX);
    }
  });

  it(`jede Beschreibung hat ${DESCRIPTION_MIN} bis ${DESCRIPTION_MAX} Zeichen`, () => {
    for (const page of pages) {
      const length = page.description.length;
      expect(
        length,
        `${page.id}: Beschreibung hat ${length} Zeichen`,
      ).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
      expect(
        length,
        `${page.id}: Beschreibung hat ${length} Zeichen`,
      ).toBeLessThanOrEqual(DESCRIPTION_MAX);
    }
  });

  it("Titel und Beschreibungen sind über die ganze Seite eindeutig", () => {
    const titles = pages.map((page) => page.title);
    const descriptions = pages.map((page) => page.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("die Seitenbeschreibung hält dieselben Grenzen ein", () => {
    expect(site.description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(site.description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });
});

describe("Vorschaubilder", () => {
  // Die Bilder der Einzelseiten liegen im selben Ordner wie die der Rechner.
  // Ein Rechner mit passendem Slug überschriebe sonst eines davon.
  it("kein Slug kollidiert mit den Bildern der Einzelseiten", () => {
    for (const { slug } of [...publicTools(), ...publicWege()]) {
      expect(slug.startsWith(STATIC_OG_PREFIX), slug).toBe(false);
    }
  });
});

describe("Quellen", () => {
  it("jede Quelle ist eine vollständige https-Adresse mit Beschriftung", () => {
    for (const entry of [...publicTools(), ...publicWege()]) {
      for (const source of entry.sources ?? []) {
        expect(source.label.trim().length, entry.slug).toBeGreaterThan(5);
        expect(source.href, `${entry.slug}: ${source.href}`).toMatch(
          /^https:\/\/[a-z0-9.-]+\//,
        );
      }
    }
  });

  it("keine Quelle steht doppelt auf derselben Seite", () => {
    for (const entry of [...publicTools(), ...publicWege()]) {
      const hrefs = (entry.sources ?? []).map((source) => source.href);
      expect(new Set(hrefs).size, entry.slug).toBe(hrefs.length);
    }
  });
});
