/**
 * Reisedauer-Vergleich auf der Tool-Seite selbst – Ersatz für drei
 * SEO-Unterseiten (budget-2-wochen-urlaub, familienurlaub-kosten,
 * tagesbudget-urlaub), die im Zuge der AdSense-Konsolidierung entfernt
 * wurden (siehe docs/adsense/etappe-0-ausgangslage.md und
 * src/lib/retiredPaths.ts).
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst, mit denselben
 * Voreinstellungen (defaultInput) bis auf Personenzahl und Nächte.
 */

import { formatEuroRounded } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculateUrlaub, defaultInput, type UrlaubInput } from "./logic";

/** Dieselben Reiseprofile, die vorher je eine eigene Seite hatten. */
const REISEN: { label: string; input: Partial<UrlaubInput> }[] = [
  { label: "Wochenende, 2 Erwachsene", input: { naechte: 3 } },
  { label: "1 Woche, 2 Erwachsene", input: { naechte: 7 } },
  { label: "2 Wochen, 2 Erwachsene", input: { naechte: 14 } },
  {
    label: "1 Woche, Familie (2 Erw. + 2 Kinder)",
    input: { naechte: 7, kinder: 2 },
  },
];

export function buildUebersichtSection(): ContentSection {
  const basis = defaultInput();

  const rows = REISEN.map(({ label, input }) => {
    const r = calculateUrlaub({ ...basis, ...input });
    return [
      label,
      formatEuroRounded(r.gesamtC / 100),
      formatEuroRounded(r.tagesbudgetVorOrtC / 100),
      r.sparrateC !== null ? `${formatEuroRounded(r.sparrateC / 100)} / Monat` : "–",
    ];
  });

  return {
    heading: "Reisedauer im Vergleich",
    blocks: [
      {
        type: "p",
        text: `Gesamtbudget, Tagesbudget vor Ort und monatliche Sparrate für vier typische Reiseprofile – mit denselben Voreinstellungen wie der Planer oben (Mittelklassehotel, ${formatEuroRounded(basis.anreiseProPerson)} Anreise pro Person, ${basis.monateBisAbreise} Monate bis zur Abreise). Für die eigene Reise rechnet der Planer oben mit den tatsächlichen Werten.`,
      },
      {
        type: "table",
        caption: "Mit den Standardannahmen des Planers",
        head: ["Reise", "Gesamtbudget", "Tagesbudget vor Ort", "Sparrate"],
        rows,
      },
    ],
  };
}
