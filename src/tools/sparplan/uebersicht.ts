/**
 * Sparraten-Vergleich auf der Tool-Seite selbst – Ersatz für vier
 * SEO-Unterseiten (etf-sparplan-rechner, 100-euro-sparplan,
 * 500-euro-monatlich-sparen, sparplan-1-million), die im Zuge der
 * AdSense-Konsolidierung entfernt wurden (siehe
 * docs/adsense/etappe-0-ausgangslage.md und src/lib/retiredPaths.ts).
 *
 * Die vier Seiten beantworteten im Kern dieselbe Frage mit anderer Zahl: was
 * eine feste Monatsrate über 20 beziehungsweise 30 Jahre wird. Eine Tabelle
 * beantwortet sie für mehrere Raten auf einen Blick – mit derselben
 * Rechenfunktion und denselben Standardannahmen (7 % Rendite, 0,2 % Kosten)
 * wie der Rechner selbst.
 */

import { formatEuroRounded } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculateSparplan, defaultInput } from "./logic";

/** Die vier Raten, die vorher je eine eigene Seite hatten (100/250/500) plus 1.000 als vierte Vergleichsgröße. */
const RATEN = [100, 250, 500, 1000];
const LAUFZEITEN = [20, 30];

export function buildUebersichtSection(): ContentSection {
  const basis = defaultInput();

  const rows = RATEN.map((rate) => {
    const zeile = [`${formatEuroRounded(rate)} / Monat`];
    for (const jahre of LAUFZEITEN) {
      const ergebnis = calculateSparplan({
        ...basis,
        modus: "endkapital",
        startkapital: 0,
        sparrateMonat: rate,
        laufzeitJahre: jahre,
      });
      zeile.push(formatEuroRounded(ergebnis.endkapitalNachSteuer));
    }
    return zeile;
  });

  return {
    heading: "Sparraten im Vergleich",
    blocks: [
      {
        type: "p",
        text: "Endkapital nach Steuern bei 7 Prozent Rendite und 0,2 Prozent laufenden Kosten – für vier gängige Monatsraten über 20 und 30 Jahre. Für die eigene Rate, Rendite und Laufzeit rechnet der Sparplan-Rechner oben.",
      },
      {
        type: "table",
        caption: "Endkapital nach Steuern bei 7 % Rendite, 0,2 % Kosten",
        head: ["Monatliche Rate", "nach 20 Jahren", "nach 30 Jahren"],
        rows,
      },
      {
        type: "note",
        text: "Wer stattdessen weiß, welches Endkapital erreicht werden soll, gibt im Rechner oben den Zielbetrag ein – im Modus „Sparrate“ rechnet er dann die dafür nötige Monatsrate aus, etwa für ein Ziel wie eine Million Euro.",
      },
    ],
  };
}
