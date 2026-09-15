/**
 * Sicherheitsnetz für die AdSense-Konsolidierung (siehe
 * docs/adsense/etappe-0-ausgangslage.md): 151 Variantenseiten wurden in ihre
 * Elternseite eingeschmolzen. Dieser Test hält zwei Dinge fest, die beide
 * NICHT stillschweigend falsch werden dürfen:
 *
 * 1. Kein `from` aus retiredPaths.ts darf noch von der Registry erzeugt
 *    werden – sonst wäre eine lebende Seite plötzlich unerreichbar
 *    (`generateStaticParams` würde sie gar nicht mehr bauen, aber ein alter
 *    Link oder Google-Index-Eintrag würde noch dorthin zeigen).
 * 2. Jedes `to` muss eine tatsächlich lebende Seite sein – ein Redirect ins
 *    Leere wäre für Besucher wie für Google dasselbe Problem wie vorher.
 *
 * Direkt nach dem Anlegen dieser Liste (Etappe 1) schlägt Prüfung 1 absichtlich
 * fehl: Die 151 Varianten existieren zu diesem Zeitpunkt noch, ihr Wegfall
 * folgt erst in den Etappen 2–4. Der Test ist grün, sobald diese Etappen
 * abgeschlossen sind – vorher zeigt er verlässlich, wie viele Altlasten noch
 * offen sind.
 */
import { describe, expect, it } from "vitest";
import { retiredPaths } from "./retiredPaths";
import { toolPath, variantPath, wegPath, wegVariantPath } from "./seo";
import { publicTools } from "@/tools/registry";
import { publicWege } from "@/wege/registry";

function livePaths(): Set<string> {
  const paths = new Set<string>();

  for (const tool of publicTools()) {
    paths.add(toolPath(tool.slug));
    for (const variant of tool.getVariants?.() ?? []) {
      paths.add(variantPath(tool.slug, variant.slug));
    }
  }

  for (const weg of publicWege()) {
    paths.add(wegPath(weg.slug));
    for (const variant of weg.getVariants?.() ?? []) {
      paths.add(wegVariantPath(weg.slug, variant.slug));
    }
  }

  paths.add("/");
  paths.add("/rechner/");
  paths.add("/wege/");
  paths.add("/ueber/");
  paths.add("/rechtliches/impressum/");
  paths.add("/rechtliches/datenschutz/");

  return paths;
}

describe("retiredPaths", () => {
  it("enthält keine Duplikate", () => {
    const seen = new Set<string>();
    for (const { from } of retiredPaths) {
      expect(seen.has(from), `"${from}" steht doppelt in retiredPaths`).toBe(
        false,
      );
      seen.add(from);
    }
  });

  it("leitet auf eine tatsächlich lebende Seite weiter", () => {
    const live = livePaths();
    for (const { from, to } of retiredPaths) {
      expect(live.has(to), `Ziel "${to}" von "${from}" existiert nicht`).toBe(
        true,
      );
    }
  });

  it("führt keine URL, die noch von der Registry erzeugt wird", () => {
    const live = livePaths();
    const stillLive = retiredPaths.filter(({ from }) => live.has(from));
    expect(
      stillLive.map((p) => p.from),
      "Diese URLs stehen in retiredPaths, werden aber noch von der Registry " +
        "erzeugt – entweder die Variante ist noch nicht entfernt (Etappen " +
        "2–4 laufen noch), oder der Eintrag gehört nicht in retiredPaths.",
    ).toEqual([]);
  });

  it("keine From-URL zeigt auf sich selbst", () => {
    for (const { from, to } of retiredPaths) {
      expect(from).not.toBe(to);
    }
  });
});
