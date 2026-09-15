/**
 * Formpaar-Vergleich auf der Tool-Seite selbst – Ersatz für die 10
 * SEO-Unterseiten (je ein Formpaar), die im Zuge der AdSense-Konsolidierung
 * entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md und
 * src/lib/retiredPaths.ts).
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, am selben Beispielrezept
 * wie die entfernten Seiten.
 */

import { formatRate } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { convertForm } from "./logic";

/** Dieselben zehn Formpaare, die vorher je eine eigene Seite hatten. */
const COMMON_PAIRS: [number, number][] = [
  [26, 20],
  [26, 18],
  [26, 24],
  [26, 28],
  [24, 20],
  [24, 26],
  [22, 26],
  [20, 26],
  [18, 26],
  [28, 26],
];

/** Dasselbe Beispielrezept wie bei den entfernten Seiten: ein Rührteig. */
const BEISPIEL = [
  "250 g Mehl",
  "200 g Zucker",
  "200 g weiche Butter",
  "4 Eier",
  "1 Pck Backpulver",
  "100 ml Milch",
].join("\n");

export function buildUebersichtSection(): ContentSection {
  const rows = COMMON_PAIRS.map(([von, zu]) => {
    const ergebnis = convertForm({
      source: { kind: "rund", a: von, b: 0, count: 0 },
      target: { kind: "rund", a: zu, b: 0, count: 0 },
      ingredients: BEISPIEL,
    });

    const prozent = Math.round(Math.abs(ergebnis.percentDelta));
    const kleiner = ergebnis.factor < 1;
    const mehlZeile = ergebnis.ingredients[0]?.text ?? "–";

    return [
      `Ø ${von} cm → Ø ${zu} cm`,
      formatRate(ergebnis.factor),
      kleiner ? `−${prozent} %` : `+${prozent} %`,
      mehlZeile,
    ];
  });

  return {
    heading: "Formpaare im Vergleich",
    blocks: [
      {
        type: "p",
        text: "Faktor und Mengenänderung für die zehn häufigsten Umrechnungen, am selben Beispielrezept vorgeführt: 250 g Mehl, 200 g Zucker, 200 g weiche Butter, 4 Eier, 1 Päckchen Backpulver, 100 ml Milch. Für die eigene Zutatenliste rechnet der Umrechner oben – Rezept einfügen, Formen einstellen, fertig.",
      },
      {
        type: "table",
        caption: "Faktor und Mehlmenge am Beispielrezept (250 g Mehl)",
        head: ["Formpaar", "Faktor", "Änderung", "250 g Mehl werden zu"],
        rows,
      },
    ],
  };
}
