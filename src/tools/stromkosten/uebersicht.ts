/**
 * Geräte-Vergleich auf der Tool-Seite selbst – Ersatz für die 6
 * SEO-Unterseiten (je ein Gerät), die im Zuge der AdSense-Konsolidierung
 * entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md und
 * src/lib/retiredPaths.ts).
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, mit denselben
 * Voreinstellungen wie die entfernten Seiten (35 Cent je Kilowattstunde).
 */

import { formatEuroRounded, formatInteger } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculatePower, devicePresets } from "./logic";

const PREIS_CENT = 35;

/** Dieselben sechs Geräte, die vorher je eine eigene Seite hatten. */
const GERAETE = [
  "trockner",
  "kuehlschrank",
  "heizluefter",
  "gaming",
  "klimageraet",
  "waschmaschine",
] as const;

export function buildUebersichtSection(): ContentSection {
  const rows = GERAETE.map((id) => {
    const preset = devicePresets.find((device) => device.id === id);
    if (!preset) throw new Error(`Unbekanntes Gerät: ${id}`);

    const ergebnis = calculatePower({
      watts: preset.watts,
      pattern: preset.pattern,
      usage: preset.usage,
      kwhPerCycle: preset.kwhPerCycle,
      standbyWatts: preset.standbyWatts,
      pricePerKwhCents: PREIS_CENT,
    });

    return [
      preset.label,
      `${formatInteger(ergebnis.totalKwh)} kWh`,
      formatEuroRounded(ergebnis.costPerYear),
      `${formatInteger(ergebnis.co2KgPerYear)} kg`,
    ];
  });

  return {
    heading: "Geräte im Vergleich",
    blocks: [
      {
        type: "p",
        text: `Jahreskosten bei ${PREIS_CENT} Cent je Kilowattstunde und typischer Nutzung – Trockner drei Ladungen pro Woche, Kühlschrank rund um die Uhr, Heizlüfter und Klimagerät mit täglichem Betrieb übers ganze Jahr gerechnet (für die reine Saison rechnet der Rechner oben mit deinen eigenen Tagen). Wähle dein Gerät und deine Werte oben, um die genaue Zahl für deinen Fall zu bekommen.`,
      },
      {
        type: "table",
        caption: `Jahreskosten bei ${PREIS_CENT} Cent je Kilowattstunde`,
        head: ["Gerät", "Verbrauch pro Jahr", "Kosten pro Jahr", "CO₂ pro Jahr"],
        rows,
      },
      {
        type: "note",
        text: "Heizlüfter und Klimagerät sind hier absichtlich mit ganzjährigem Betrieb gerechnet, obwohl beide nur saisonal laufen – das macht sie in dieser einen Tabelle direkt mit den Dauerläufern vergleichbar. Die tatsächliche Saisonrechnung mit deinen eigenen Einsatztagen liefert der Rechner oben.",
      },
    ],
  };
}
