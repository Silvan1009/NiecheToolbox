/**
 * Restanspruch-Vergleich auf der Tool-Seite selbst – Ersatz für zwei
 * SEO-Unterseiten (kindergeld-2026, kindergeld-3-kinder), die im Zuge der
 * AdSense-Konsolidierung entfernt wurden (siehe
 * docs/adsense/etappe-0-ausgangslage.md und src/lib/retiredPaths.ts).
 * kinderfreibetrag-berechnen wurde ebenfalls entfernt und leitet auf die
 * inhaltlich gleiche Schwesterseite guenstigerpruefung-kinderfreibetrag
 * weiter.
 *
 * Dieselbe Rechenfunktion wie der Rechner selbst.
 */

import { todayIso } from "@/lib/date";
import { formatEuroRounded, formatInteger } from "@/lib/format";
import type { ContentSection } from "@/tools/types";
import { calculateKindergeld, defaultInput } from "./logic";

/** Dieselben Altersstufen, die den Restanspruch am deutlichsten unterscheiden. */
const ALTER_JAHRE = [0, 5, 10, 15, 17];

export function buildUebersichtSection(): ContentSection {
  const basis = defaultInput();
  const heute = todayIso();
  const jahr = Number(heute.slice(0, 4));

  const restanspruchRows = ALTER_JAHRE.map((alter) => {
    const result = calculateKindergeld({
      ...basis,
      kinder: [{ geburtsdatum: `${jahr - alter}-06-15`, status: "regulaer" }],
      heute,
      jahr,
    });
    const kind = result.kinder[0];

    return [
      alter === 0 ? "Neugeboren" : `${alter} Jahre`,
      formatEuroRounded(result.satz),
      formatInteger(kind.restmonate),
      formatEuroRounded(kind.restanspruchC / 100),
    ];
  });

  return {
    heading: "Restanspruch nach Alter",
    blocks: [
      {
        type: "p",
        text: `Wie viele Monate Kindergeld ein Kind noch bekommt und was das in Summe ist, hängt am aktuellen Alter – ein Neugeborenes hat einen deutlich höheren Restanspruch als ein Kind kurz vor der Volljährigkeit. Gerechnet mit dem Kindergeldsatz für ${jahr} und regulärem Status ohne Ausbildung oder Studium darüber hinaus.`,
      },
      {
        type: "table",
        caption: `Restanspruch bis 18, Stand ${jahr}`,
        head: ["Alter", "Satz pro Monat", "Restmonate", "Restanspruch gesamt"],
        rows: restanspruchRows,
      },
      {
        type: "note",
        text: "Für ein Kind in Ausbildung oder Studium läuft der Anspruch bis 25 weiter, bei gemeldeter Arbeitsuche ohne Ausbildungsplatz bis 21 – beides rechnet der Rechner oben mit dem passenden Status. Bei mehreren Kindern zeigt er außerdem die Summe über alle Kinder und die Günstigerprüfung gegen den Kinderfreibetrag.",
      },
    ],
  };
}
