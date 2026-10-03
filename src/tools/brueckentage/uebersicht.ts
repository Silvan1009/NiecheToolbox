/**
 * Bundesländer-Vergleich auf der Tool-Seite selbst – Ersatz für die 48
 * SEO-Unterseiten (16 Länder × 3 Jahre), die im Zuge der AdSense-
 * Konsolidierung entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md
 * und src/lib/retiredPaths.ts).
 *
 * Die einzelnen Landing-Pages unterschieden sich vor allem im Ländernamen:
 * Bremen, Hamburg, Niedersachsen und Schleswig-Holstein haben identische
 * Feiertage, ihre Texte waren laut content-audit.ts bis zu 90,7 % deckungsgleich.
 * Eine Vergleichstabelle sagt in einem Blick, was 16 fast gleichlautende
 * Absätze vorher einzeln sagen mussten – und der Rechner selbst bleibt für
 * jede Kombination aus Bundesland und Jahr weiter live nutzbar.
 *
 * Jede Zahl kommt aus `calculateBrueckentage()`, derselben Funktion, die auch
 * der Rechner aufruft – keine zweite, unabhängige Berechnung.
 */

import { plural } from "@/lib/format";
import { holidaysFor, regions, type Region, type RegionCode } from "@/lib/regionen";
import type { ContentSection, FaqEntry } from "@/tools/types";
import { calculateBrueckentage, type BrueckentageResult } from "./logic";

/** Wie viele Jahre die Vergleichstabelle zeigt – deckt sich mit dem, was der Rechner als Vorauswahl anbietet. */
const UEBERSICHT_YEARS = 3;

/** Dasselbe Urlaubsbudget wie die Vorbelegung des Rechners (DEFAULT_BUDGET in Component.tsx). */
const BUDGET = 5;

const tage = (n: number) =>
  `${n === 1 ? "ein" : n} ${plural(n, "Tag", "Tage")}`;

function aufzaehlung(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

function anlass(block: { holidays: { name: string }[] }): string {
  return aufzaehlung(block.holidays.map((h) => h.name));
}

interface Zeile {
  region: Region;
  feiertageGesamt: number;
  werktags: number;
  besterAnlass: string;
  freieTageMitBudget: string;
}

function zeileFor(region: Region, year: number): Zeile {
  const result: BrueckentageResult = calculateBrueckentage({
    year,
    region: region.code,
    budget: BUDGET,
  });
  const gezaehlt = result.holidays.filter((h) => !h.partial);

  return {
    region,
    feiertageGesamt: gezaehlt.length,
    werktags: result.holidaysOnWorkday,
    besterAnlass: result.mostEfficient
      ? `${anlass(result.mostEfficient)} (${tage(result.mostEfficient.freeDays)})`
      : "–",
    freieTageMitBudget:
      result.plan.blocks.length > 0 ? tage(result.plan.freeDays) : "–",
  };
}

function tableFor(year: number): ContentSection["blocks"][number] {
  const rows = regions.map((region) => {
    const z = zeileFor(region, year);
    return [
      z.region.name,
      String(z.feiertageGesamt),
      String(z.werktags),
      z.besterAnlass,
      z.freieTageMitBudget,
    ];
  });

  return {
    type: "table" as const,
    caption: String(year),
    head: [
      "Bundesland",
      "Feiertage gesamt",
      "davon nutzbar",
      "bester Anlass",
      `frei mit ${BUDGET} Urlaubstagen`,
    ],
    rows,
  };
}

/** Bundesländer, deren Feiertagskalender sich in einem Jahr nicht unterscheidet. */
function gleicheKalenderSatz(baseYear: number): string {
  const schluessel = (code: RegionCode) =>
    holidaysFor(baseYear, code)
      .filter((h) => !h.partial)
      .map((h) => h.name)
      .sort()
      .join("|");

  const gruppen = new Map<string, string[]>();
  for (const region of regions) {
    const key = schluessel(region.code);
    gruppen.set(key, [...(gruppen.get(key) ?? []), region.name]);
  }

  const mehrfach = [...gruppen.values()].filter((names) => names.length > 1);
  if (mehrfach.length === 0) {
    return `${baseYear} hat jedes Bundesland eine eigene Kombination aus Feiertagen – kein Land teilt sich seinen Kalender vollständig mit einem anderen.`;
  }

  const saetze = mehrfach.map(
    (names) => `${aufzaehlung(names)} haben ${baseYear} exakt denselben Feiertagskalender`,
  );
  return `${saetze.join("; ")} – für diese Länder unterscheidet sich in der Tabelle oben nichts außer dem Namen.`;
}

export function buildUebersichtSection(baseYear: number): ContentSection[] {
  const jahre = Array.from({ length: UEBERSICHT_YEARS }, (_, i) => baseYear + i);

  return [
    {
      heading: "Brückentage je Bundesland im Vergleich",
      blocks: [
        {
          type: "p",
          text: `Wie viele Feiertage ${jahre[0]} bis ${jahre[jahre.length - 1]} in jedem Bundesland auf einen Werktag fallen, welcher Anlass den besten Hebel bietet und wie weit ${BUDGET} Urlaubstage dort tragen – für alle 16 Länder auf einen Blick. Wer nur das eigene Bundesland braucht, findet es unten im Rechner mit Jahresplan und Kalenderansicht.`,
        },
        ...jahre.map((year) => tableFor(year)),
        {
          type: "note",
          text: gleicheKalenderSatz(baseYear),
        },
      ],
    },
    {
      heading: "Den Bundesländervergleich richtig lesen",
      blocks: [
        {
          type: "p",
          text: "Die Tabelle vergleicht drei Jahre für alle 16 Bundesländer. „Feiertage gesamt“ zählt die im jeweiligen Bundesland landesweit geltenden Feiertage; „davon nutzbar“ zeigt, wie viele davon auf einen Werktag fallen. Feiertage am Wochenende stehen in der Gesamtzahl, schaffen aber keinen zusätzlichen freien Arbeitstag.",
        },
        {
          type: "p",
          text: "Regional geltende Feiertage sind in diesem standardisierten Vergleich nicht eingerechnet. Im Rechner kannst du sie über „gilt bei mir“ berücksichtigen, wenn sie an deinem Ort tatsächlich gelten.",
        },
        {
          type: "p",
          text: `Die beiden Planungsspalten verwenden ein einheitliches Budget von ${BUDGET} Urlaubstagen: „bester Anlass“ zeigt den einzelnen Anlass mit dem besten Verhältnis von freien Tagen zu Urlaubstagen; „frei mit ${BUDGET} Urlaubstagen“ fasst passende, nicht überlappende Vorschläge im Jahresplan zusammen. Im Rechner kannst du ein eigenes Budget einstellen.`,
        },
      ],
    },
  ];
}

export const brueckentageFaq: FaqEntry[] = [
  {
    question:
      "Warum bringen mehr Feiertage nicht automatisch mehr Brückentage?",
    answer:
      "Entscheidend ist, auf welche Wochentage die Feiertage fallen und wie sie an Wochenenden anschließen. Ein Feiertag am Samstag oder Sonntag verlängert die freie Zeit für eine übliche Montag-bis-Freitag-Woche nicht. Deshalb kann ein Bundesland mit weniger Feiertagen mehr nutzbare Brückentage haben – und Länder mit denselben Feiertagsdaten erhalten dieselben Ergebnisse.",
  },
  {
    question:
      "Kann ich den Bundesländervergleich auf mein Urlaubsbudget abstimmen?",
    answer:
      "Die Tabelle verwendet für alle Länder ein einheitliches Budget von fünf Urlaubstagen, damit die Ergebnisse vergleichbar bleiben. Im Rechner kannst du dein Budget ändern; die Vorschläge und der Jahresplan werden dann für deine Auswahl neu berechnet.",
  },
  {
    question:
      "Berücksichtigt der Rechner Teilzeit, Schichtarbeit oder Betriebsferien?",
    answer:
      "Nein. Die Berechnung behandelt Montag bis Freitag als mögliche Arbeitstage und Samstag und Sonntag als Wochenende. Individuelle Dienstpläne, betriebliche Schließtage, Schulferien und bereits genehmigter Urlaub sind nicht hinterlegt. Prüfe die Vorschläge deshalb gegen deinen eigenen Arbeitskalender.",
  },
];
