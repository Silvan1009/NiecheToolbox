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
      heading: "Was jedes Bundesland an Brückentagen besonders macht",
      blocks: [
        {
          type: "ul",
          items: regions.map(
            (region) => `${region.name}: ${reiseKontext[region.code]}`,
          ),
        },
      ],
    },
  ];
}

/**
 * Ein Absatz je Land, unabhängig von Jahr und Feiertagsrechnung.
 *
 * Bremen, Hamburg, Niedersachsen und Schleswig-Holstein haben exakt dieselben
 * Feiertage (die neun bundesweiten plus seit 2018 den Reformationstag), und
 * Nordrhein-Westfalen teilt sich Fronleichnam und Allerheiligen wortgleich
 * mit Rheinland-Pfalz. Dieser Absatz gibt jedem Land trotzdem einen Fakt, der
 * von der Rechnung unabhängig ist.
 */
export const reiseKontext: Record<RegionCode, string> = {
  bw: "Baden-Württemberg hat mit Heilige Drei Könige, Fronleichnam und Allerheiligen drei zusätzliche Feiertage – dieselben drei wie Bayern. Regional unterscheidet sich das Land trotzdem deutlich: Schwarzwald und Bodensee im Süden sind touristisch stark nachgefragt, an Brückentagen sind Unterkünfte dort oft früh ausgebucht.",
  by: "Bayern hat mit Heilige Drei Könige, Fronleichnam und Allerheiligen dieselben drei zusätzlichen Feiertage wie Baden-Württemberg, dazu regional Mariä Himmelfahrt in katholisch geprägten Gemeinden. Als flächenmäßig größtes Bundesland reicht die Auswahl an Brückentage-Zielen von den Alpen bis nach Franken.",
  be: "Berlin hat seit 2019 den Internationalen Frauentag als eigenen Feiertag – bundesweit teilt sich das nur mit Mecklenburg-Vorpommern. Als Stadtstaat ohne Umland liegt für ein langes Wochenende meist eine Städtereise näher als ein Ausflug ins Grüne.",
  bb: "Brandenburg ist das einzige Bundesland mit Ostersonntag und Pfingstsonntag als eigenen gesetzlichen Feiertagen – die fallen aber ohnehin auf einen Sonntag und bringen deshalb keinen zusätzlichen freien Tag. Praktisch relevanter ist die Nähe zu Berlin: Ein Kurztrip in die Hauptstadt liegt von hier aus näher als aus jedem anderen Bundesland.",
  hb: "Bremen teilt sich mit Hamburg, Niedersachsen und Schleswig-Holstein denselben einen zusätzlichen Feiertag, den Reformationstag seit 2018 – die vier Länder haben damit ein identisches Feiertagsjahr. Als kleinster Flächenstaat der vier liegt die Nordseeküste trotzdem in besonders kurzer Fahrzeit.",
  hh: "Hamburg teilt sich mit Bremen, Niedersachsen und Schleswig-Holstein denselben einen zusätzlichen Feiertag, den Reformationstag seit 2018. Als größte Stadt der vier ist Hamburg selbst häufig eher Ausgangspunkt als Ziel eines langen Wochenendes – mit guten Zuganbindungen an Nord- und Ostsee.",
  he: "Hessen hat mit Fronleichnam einen zusätzlichen Feiertag – mit Frankfurt liegt zugleich einer der größten Verkehrsknotenpunkte Deutschlands im Land, was Fernreisen an Brückentagen leichter planbar macht, aber auch für spürbar mehr Andrang sorgt.",
  mv: "Mecklenburg-Vorpommern hat mit dem Reformationstag und seit 2023 dem Internationalen Frauentag zwei zusätzliche Feiertage – beim Frauentag teilt sich das Land das bundesweit nur mit Berlin. Die Ostseeküste ist an Brückentagen besonders gefragt, mit entsprechend früh ausgebuchten Unterkünften.",
  ni: "Niedersachsen teilt sich mit Bremen, Hamburg und Schleswig-Holstein denselben einen zusätzlichen Feiertag, den Reformationstag seit 2018. Flächenmäßig ist es mit Abstand das größte der vier Länder und reicht von der Nordseeküste bis in den Harz – entsprechend groß ist die Auswahl an Zielen für ein langes Wochenende.",
  nw: "Nordrhein-Westfalen hat mit Fronleichnam und Allerheiligen dieselben beiden zusätzlichen Feiertage wie Rheinland-Pfalz. Als bevölkerungsreichstes Bundesland unterscheiden sich die möglichen Ziele innerhalb des Landes stark: vom Rheinland über das Ruhrgebiet bis zur Eifel.",
  rp: "Rheinland-Pfalz hat mit Fronleichnam und Allerheiligen dieselben beiden zusätzlichen Feiertage wie Nordrhein-Westfalen. Die Weinregionen an Mosel und Rhein liegen hier für ein langes Wochenende besonders nah, dazu die Grenze zu Frankreich und Luxemburg.",
  sl: "Das Saarland hat mit Fronleichnam, Allerheiligen und Mariä Himmelfahrt drei zusätzliche Feiertage – als einziges Bundesland, in dem Mariä Himmelfahrt landesweit gilt und nicht nur regional wie in Bayern. Als kleinstes Flächenland liegen Frankreich und Luxemburg für einen Kurztrip näher als jedes andere deutsche Reiseziel.",
  sn: "Sachsen hat mit dem Reformationstag und dem Buß- und Bettag zwei zusätzliche Feiertage – den Buß- und Bettag als einziges Bundesland, seit er 1995 in allen anderen abgeschafft wurde. Dresden und Leipzig sind an Brückentagen die naheliegendsten Ziele im Land.",
  st: "Sachsen-Anhalt hat mit Heilige Drei Könige und dem Reformationstag zwei zusätzliche Feiertage – diese Kombination aus katholisch und protestantisch geprägtem Feiertag gibt es sonst in keinem anderen Bundesland. Die Lutherstädte Wittenberg und Eisleben machen den Reformationstag hier auch inhaltlich naheliegend.",
  sh: "Schleswig-Holstein teilt sich mit Bremen, Hamburg und Niedersachsen denselben einen zusätzlichen Feiertag, den Reformationstag seit 2018. Mit Nord- und Ostseeküste zugleich ist es an Brückentagen eines der meistgefragten Reiseziele überhaupt – Unterkünfte sind an langen Wochenenden oft früh ausgebucht.",
  th: "Thüringen hat mit dem Reformationstag und seit 2019 dem Weltkindertag zwei zusätzliche Feiertage – den Weltkindertag als einziges Bundesland. Die zentrale Lage macht das Land von fast jedem anderen Bundesland aus in wenigen Stunden erreichbar.",
};

/**
 * Eine FAQ je Land, aus den 48 entfernten Landing-Pages übernommen. Greift
 * denselben Fakt wie `reiseKontext` auf, aber aus einer eigenen Frage heraus
 * – und bleibt damit auch bei Ländern mit identischem Feiertagskalender
 * (Bremen, Hamburg, Niedersachsen, Schleswig-Holstein) eigenständig, weil sie
 * nicht vom Jahr abhängt.
 */
export const reiseFaq: Record<RegionCode, FaqEntry> = {
  bw: {
    question:
      "Welches sind die beliebtesten Ausflugsziele in Baden-Württemberg an Brückentagen?",
    answer:
      "Vor allem Schwarzwald und Bodensee im Süden des Landes – beide sind touristisch stark nachgefragt, an langen Wochenenden sind Unterkünfte dort oft schon Wochen vorher ausgebucht. Wer flexibel ist, plant früh oder weicht auf weniger bekannte Regionen wie die Schwäbische Alb aus.",
  },
  by: {
    question: "Welche Feiertage hat Bayern, die es woanders nicht gibt?",
    answer:
      "Heilige Drei Könige, Fronleichnam und Allerheiligen – dieselben drei wie in Baden-Württemberg, dazu regional Mariä Himmelfahrt in katholisch geprägten Gemeinden. Als flächenmäßig größtes Bundesland reicht die Auswahl an Ausflugszielen von den Alpen bis nach Franken.",
  },
  be: {
    question: "Wohin fährt man von Berlin aus an einem langen Wochenende?",
    answer:
      "Als Stadtstaat ohne eigenes Umland bietet sich meist entweder eine weitere Städtereise an oder ein Ausflug ins angrenzende Brandenburg mit seinen Seen und Wäldern. Berlin hat außerdem seit 2019 den Internationalen Frauentag als eigenen Feiertag – bundesweit nur mit Mecklenburg-Vorpommern geteilt.",
  },
  bb: {
    question:
      "Warum bringen Ostersonntag und Pfingstsonntag in Brandenburg keinen zusätzlichen freien Tag?",
    answer:
      "Weil beide ohnehin auf einen Sonntag fallen – Brandenburg ist das einzige Land, das sie trotzdem als eigene gesetzliche Feiertage führt. Praktisch nutzbarer ist die Nähe zu Berlin: Ein Kurztrip in die Hauptstadt liegt von hier aus näher als aus jedem anderen Bundesland.",
  },
  hb: {
    question:
      "Warum sind die Brückentage-Ergebnisse für Bremen, Hamburg, Niedersachsen und Schleswig-Holstein identisch?",
    answer:
      "Weil alle vier Länder exakt dieselben Feiertage haben: die neun bundesweiten plus seit 2018 den Reformationstag. Unterscheiden tun sie sich vor allem in der Größe – Bremen ist mit Abstand der kleinste Flächenstaat der vier, mit entsprechend kurzen Wegen zur Nordseeküste.",
  },
  hh: {
    question:
      "Warum sind die Brückentage-Ergebnisse für Hamburg, Bremen, Niedersachsen und Schleswig-Holstein identisch?",
    answer:
      "Weil alle vier Länder exakt dieselben Feiertage haben: die neun bundesweiten plus seit 2018 den Reformationstag. Hamburg ist als größte Stadt der vier oft eher Ausgangspunkt als Ziel eines langen Wochenendes, mit guten Zugverbindungen an Nord- und Ostsee.",
  },
  he: {
    question:
      "Warum ist Reiseplanung an hessischen Brückentagen besonders eng getaktet?",
    answer:
      "Mit Frankfurt liegt einer der größten Verkehrsknotenpunkte Deutschlands im Land – das macht Fernreisen an Brückentagen leichter planbar, sorgt an langen Wochenenden aber auch für spürbar mehr Andrang an Flughafen und Bahnhof. Hessen hat außerdem mit Fronleichnam einen zusätzlichen Feiertag.",
  },
  mv: {
    question:
      "Warum sollte man Unterkünfte in Mecklenburg-Vorpommern früh buchen?",
    answer:
      "Weil die Ostseeküste an Brückentagen zu den gefragtesten Reisezielen Deutschlands zählt – Unterkünfte sind oft schon Wochen vorher ausgebucht. Das Land hat zudem seit 2023 den Internationalen Frauentag als zusätzlichen Feiertag, bundesweit nur mit Berlin geteilt.",
  },
  ni: {
    question:
      "Warum ist die Zielauswahl in Niedersachsen an Brückentagen so groß?",
    answer:
      "Weil Niedersachsen nach Bayern das zweitgrößte Flächenland ist und von der Nordseeküste bis in den Harz reicht. Die Feiertage sind dabei identisch mit denen in Bremen, Hamburg und Schleswig-Holstein: die neun bundesweiten plus seit 2018 den Reformationstag.",
  },
  nw: {
    question: "Warum ähneln sich die Brückentage-Ergebnisse für NRW und Rheinland-Pfalz?",
    answer:
      "Weil beide Länder dieselben zwei zusätzlichen Feiertage haben, Fronleichnam und Allerheiligen. Innerhalb von Nordrhein-Westfalen unterscheiden sich die möglichen Ausflugsziele als bevölkerungsreichstem Bundesland trotzdem stark: vom Rheinland über das Ruhrgebiet bis zur Eifel.",
  },
  rp: {
    question: "Warum ähneln sich die Brückentage-Ergebnisse für Rheinland-Pfalz und NRW?",
    answer:
      "Weil beide Länder dieselben zwei zusätzlichen Feiertage haben, Fronleichnam und Allerheiligen. Für ein langes Wochenende liegen in Rheinland-Pfalz die Weinregionen an Mosel und Rhein besonders nah, dazu die Grenze zu Frankreich und Luxemburg.",
  },
  sl: {
    question: "Was macht das Saarland für Brückentage-Kurztrips interessant?",
    answer:
      "Als kleinstes Flächenland liegen Frankreich und Luxemburg näher als jedes andere deutsche Reiseziel. Mit Fronleichnam, Allerheiligen und Mariä Himmelfahrt hat das Saarland zudem drei zusätzliche Feiertage – als einziges Bundesland, in dem Mariä Himmelfahrt landesweit gilt und nicht nur regional wie in Bayern.",
  },
  sn: {
    question: "Was ist der Buß- und Bettag, und warum gibt es ihn nur noch in Sachsen?",
    answer:
      "Ein evangelischer Buß- und Bettag, der 1995 in allen anderen Bundesländern abgeschafft wurde, um die Pflegeversicherung mitzufinanzieren – nur Sachsen hat ihn seither behalten. Dresden und Leipzig sind an Brückentagen die naheliegendsten Ziele im Land.",
  },
  st: {
    question: "Warum hat Sachsen-Anhalt eine ungewöhnliche Feiertagskombination?",
    answer:
      "Weil es mit Heilige Drei Könige und dem Reformationstag zwei zusätzliche Feiertage hat – eine Kombination aus katholisch und protestantisch geprägtem Feiertag, die es sonst in keinem anderen Bundesland gibt. Die Lutherstädte Wittenberg und Eisleben machen den Reformationstag hier auch inhaltlich naheliegend.",
  },
  sh: {
    question:
      "Warum sind die Brückentage-Ergebnisse für Schleswig-Holstein, Bremen, Hamburg und Niedersachsen identisch?",
    answer:
      "Weil alle vier Länder exakt dieselben Feiertage haben: die neun bundesweiten plus seit 2018 den Reformationstag. Mit Nord- und Ostseeküste zugleich zählt Schleswig-Holstein trotzdem zu den gefragtesten Brückentage-Zielen überhaupt – Unterkünfte sind entsprechend früh ausgebucht.",
  },
  th: {
    question: "Was ist der Weltkindertag, und warum gibt es ihn nur in Thüringen?",
    answer:
      "Thüringen hat den Weltkindertag 2019 als bislang einziges Bundesland zum gesetzlichen Feiertag erklärt, zusätzlich zum Reformationstag. Die zentrale Lage macht das Land von fast jedem anderen Bundesland aus in wenigen Stunden erreichbar.",
  },
};
