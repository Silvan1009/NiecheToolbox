/**
 * Größen-Vergleich auf der Tool-Seite selbst – Ersatz für die 5
 * SEO-Unterseiten (je eine Wohnungsgröße), die im Zuge der AdSense-
 * Konsolidierung entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md
 * und src/lib/retiredPaths.ts).
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, mit denselben
 * Voreinstellungen wie die entfernten Seiten.
 */

import { formatAmount, formatInteger, plural } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculateMove } from "./logic";

/** Dieselben fünf Wohnungsgrößen, die vorher je eine eigene Seite hatten. */
const GROESSEN: { area: number; people: number; label: string }[] = [
  { area: 30, people: 1, label: "30 m² (1-Zimmer-Wohnung)" },
  { area: 50, people: 1, label: "50 m² (2-Zimmer-Wohnung)" },
  { area: 70, people: 2, label: "70 m² (3-Zimmer-Wohnung)" },
  { area: 90, people: 3, label: "90 m² (4-Zimmer-Wohnung)" },
  { area: 120, people: 4, label: "120 m² (Haus)" },
];

export function buildUebersichtSection(): ContentSection {
  const rows = GROESSEN.map(({ area, people, label }) => {
    const result = calculateMove({
      area,
      people,
      style: "normal",
      shelfMetres: 6,
      wardrobeMetres: 1.5,
      hasBasement: true,
      trips: 1,
    });

    return [
      label,
      String(result.totalBoxes),
      `${formatAmount(result.volume)} m³`,
      `${result.van.label} (${formatInteger(result.van.volume)} m³)`,
      `${formatInteger(result.packingHours)} ${plural(result.packingHours, "Stunde", "Stunden")}`,
    ];
  });

  return {
    heading: "Umzugsgröße im Vergleich",
    blocks: [
      {
        type: "p",
        text: "Kartonzahl, Volumen, Transporter und Packzeit für fünf typische Wohnungsgrößen, gerechnet mit durchschnittlicher Einrichtung und Keller. Für die eigene Wohnung mit den tatsächlichen Werten rechnet der Planer oben.",
      },
      {
        type: "table",
        caption: "Geschätzter Bedarf bei durchschnittlicher Einrichtung, eine Fahrt",
        head: ["Wohnfläche", "Kartons gesamt", "Volumen", "Transporter", "Packzeit"],
        rows,
      },
      {
        type: "note",
        text: "Ab 70 Quadratmetern reicht ein Transporter für eine Fahrt oft nur noch mit einem 7,5-Tonner – und der braucht einen Führerschein der Klasse C1. Mit zwei Fahrten genügt meist ein kleineres Fahrzeug mit dem normalen Autoführerschein: Stell die Zahl der Fahrten im Rechner oben ein, dann rechnet er die Fahrzeugklasse entsprechend kleiner.",
      },
    ],
  };
}
