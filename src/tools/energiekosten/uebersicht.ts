/**
 * Gasverbrauch-Vergleich auf der Tool-Seite selbst – Ersatz für vier
 * SEO-Unterseiten (gaskosten-berechnen, stromkosten-haushalt-berechnen,
 * stromverbrauch-4-personen-haushalt, gasverbrauch-einfamilienhaus), die im
 * Zuge der AdSense-Konsolidierung entfernt wurden (siehe
 * docs/adsense/etappe-0-ausgangslage.md und src/lib/retiredPaths.ts).
 *
 * Der Stromverbrauch nach Haushaltsgröße steht schon als Tabelle im
 * bestehenden Abschnitt „Erwartungswert für Strom und Gas“ (manifest.ts) –
 * das deckt stromverbrauch-4-personen-haushalt und stromkosten-haushalt-
 * berechnen inhaltlich ab. Was fehlt, ist die Gas-Seite dieser Tabelle:
 * derselbe Erwartungswert nach Dämmstandard, mit derselben Rechenfunktion
 * wie der Rechner selbst.
 */

import { formatEuroRounded, formatInteger } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import {
  KWH_PRO_QM,
  gebaeudestandardLabels,
  schaetzeGasverbrauch,
  type Gebaeudestandard,
} from "./logic";

/** Dieselbe Wohnfläche wie die entfernte gasverbrauch-einfamilienhaus-Seite. */
const WOHNFLAECHE_M2 = 150;
/** Dieselben Preise wie die Voreinstellung des Rechners (defaultInput). */
const ARBEITSPREIS_CT = 11;
const GRUNDPREIS_MONAT = 13;

const STANDARDS: Gebaeudestandard[] = [
  "unsaniert",
  "teilsaniert",
  "saniert",
  "neubau",
];

export function buildUebersichtSection(): ContentSection {
  const rows = STANDARDS.map((standard) => {
    const kwh = schaetzeGasverbrauch(WOHNFLAECHE_M2, standard);
    const kostenEuro =
      (kwh * ARBEITSPREIS_CT) / 100 + GRUNDPREIS_MONAT * 12;

    return [
      gebaeudestandardLabels[standard],
      `${formatInteger(KWH_PRO_QM[standard])} kWh/m²`,
      `${formatInteger(kwh)} kWh`,
      formatEuroRounded(kostenEuro),
    ];
  });

  return {
    heading: "Gasverbrauch nach Dämmstandard",
    blocks: [
      {
        type: "p",
        text: `Für ein Haus mit ${WOHNFLAECHE_M2} Quadratmetern, gerechnet mit ${ARBEITSPREIS_CT} Cent Arbeitspreis und ${formatEuroRounded(GRUNDPREIS_MONAT)} Grundpreis im Monat – zwischen dem schlechtesten und dem besten Dämmstandard liegt bei gleicher Fläche mehr als der Faktor drei. Für die eigene Wohnfläche und Preise rechnet der Rechner oben.`,
      },
      {
        type: "table",
        caption: `Bei ${WOHNFLAECHE_M2} m² Wohnfläche`,
        head: ["Dämmstandard", "Bedarf je m²", "Verbrauch im Jahr", "Kosten im Jahr"],
        rows,
      },
    ],
  };
}
