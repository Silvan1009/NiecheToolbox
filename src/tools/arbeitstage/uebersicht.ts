/**
 * Bundesländer-Vergleich auf der Tool-Seite selbst – Ersatz für die 32
 * SEO-Unterseiten (16 Länder × 2 Jahre), die im Zuge der AdSense-
 * Konsolidierung entfernt wurden (siehe docs/adsense/etappe-0-ausgangslage.md
 * und src/lib/retiredPaths.ts).
 *
 * Gegenstück zu tools/brueckentage/uebersicht.ts, mit Arbeitsmarkt- statt
 * Reisebezug. Jede Zahl kommt aus `calculateWorkdays()`, derselben Funktion,
 * die auch der Rechner aufruft.
 */

import { regions, type Region, type RegionCode } from "@/lib/regionen";
import type { ContentSection, FaqEntry } from "@/tools/types";
import {
  MONTH_NAMES,
  calculateWorkdays,
  monthlyBreakdown,
  weekPresets,
  yearRange,
} from "./logic";

/** Deckt sich mit den beiden Jahren, die der Rechner als Vorauswahl anbietet. */
const UEBERSICHT_YEARS = 2;

function aufzaehlung(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

interface Monat {
  name: string;
  workdays: number;
}

interface Zeile {
  region: Region;
  arbeitstage: number;
  werktage: number;
  staerkster: Monat;
  schwaechster: Monat;
}

function zeileFor(region: Region, year: number): Zeile {
  const range = yearRange(year);
  const fuenfTage = calculateWorkdays({
    ...range,
    region: region.code,
    workdays: weekPresets["5"].days,
    includePartial: false,
    daysOff: 0,
  });
  const sechsTage = calculateWorkdays({
    ...range,
    region: region.code,
    workdays: weekPresets["6"].days,
    includePartial: false,
    daysOff: 0,
  });
  const monate: Monat[] = monthlyBreakdown(
    year,
    region.code,
    weekPresets["5"].days,
    false,
  ).map((eintrag) => ({
    name: MONTH_NAMES[eintrag.month - 1],
    workdays: eintrag.workdays,
  }));

  return {
    region,
    arbeitstage: fuenfTage.workdays,
    werktage: sechsTage.workdays,
    staerkster: monate.reduce((a, b) => (b.workdays > a.workdays ? b : a)),
    schwaechster: monate.reduce((a, b) => (b.workdays < a.workdays ? b : a)),
  };
}

function tableFor(year: number): ContentSection["blocks"][number] {
  const rows = regions.map((region) => {
    const z = zeileFor(region, year);
    return [
      z.region.name,
      String(z.arbeitstage),
      String(z.werktage),
      `${z.staerkster.name} (${z.staerkster.workdays})`,
      `${z.schwaechster.name} (${z.schwaechster.workdays})`,
    ];
  });

  return {
    type: "table" as const,
    caption: String(year),
    head: [
      "Bundesland",
      "Arbeitstage (Mo–Fr)",
      "Werktage (Mo–Sa)",
      "stärkster Monat",
      "schwächster Monat",
    ],
    rows,
  };
}

/** Bundesländer, deren Arbeitstage sich in einem Jahr nicht unterscheiden. */
function gleicheKalenderSatz(baseYear: number): string {
  const arbeitstageJeLand = new Map(
    regions.map((region) => [region.code, zeileFor(region, baseYear).arbeitstage]),
  );

  const gruppen = new Map<number, string[]>();
  for (const region of regions) {
    const n = arbeitstageJeLand.get(region.code)!;
    gruppen.set(n, [...(gruppen.get(n) ?? []), region.name]);
  }

  const mehrfach = [...gruppen.entries()]
    .filter(([, names]) => names.length > 1)
    .sort((a, b) => b[1].length - a[1].length);

  if (mehrfach.length === 0) {
    return `${baseYear} hat jedes Bundesland eine andere Zahl an Arbeitstagen – kein Land stimmt exakt mit einem anderen überein.`;
  }

  const saetze = mehrfach.map(
    ([n, names]) => `${aufzaehlung(names)} kommen ${baseYear} auf identische ${n} Arbeitstage`,
  );
  return `${saetze.join("; ")} – nicht weil die Feiertage überall gleich wären, sondern weil sich unterschiedliche Feiertage rechnerisch zur selben Zahl summieren.`;
}

export function buildUebersichtSection(baseYear: number): ContentSection[] {
  const jahre = Array.from({ length: UEBERSICHT_YEARS }, (_, i) => baseYear + i);

  return [
    {
      heading: "Arbeitstage je Bundesland im Vergleich",
      blocks: [
        {
          type: "p",
          text: `Wie viele Arbeitstage und Werktage ${jahre.join(" und ")} in jedem Bundesland zusammenkommen und in welchem Monat am meisten beziehungsweise am wenigsten zu tun ist – für alle 16 Länder auf einen Blick. Für einen beliebigen Zeitraum – ein Quartal, einen Monat, einen Projektabschnitt – rechnet der Rechner unten direkt.`,
        },
        ...jahre.map((year) => tableFor(year)),
        {
          type: "note",
          text: gleicheKalenderSatz(baseYear),
        },
      ],
    },
    {
      heading: "Was den Arbeitsmarkt in jedem Bundesland prägt",
      blocks: [
        {
          type: "ul",
          items: regions.map(
            (region) => `${region.name}: ${arbeitsmarktKontext[region.code]}`,
          ),
        },
      ],
    },
  ];
}

/**
 * Ein Absatz je Land, unabhängig von Jahr und Feiertagsrechnung. Gegenstück
 * zu reiseKontext in tools/brueckentage/uebersicht.ts, mit Arbeitsmarkt-
 * statt Reisebezug.
 */
export const arbeitsmarktKontext: Record<RegionCode, string> = {
  bw: "Baden-Württemberg hat mit Bayern denselben Feiertagskalender – Heilige Drei Könige, Fronleichnam und Allerheiligen zusätzlich zu den bundesweiten –, deshalb stimmen die Arbeitstage in beiden Ländern für dasselbe Jahr überein. Wirtschaftlich ist das Land stark von Automobilbau und Maschinenbau geprägt, mit einer der höchsten Industriedichten und Exportquoten unter den Bundesländern.",
  by: "Bayern hat mit Baden-Württemberg denselben Feiertagskalender – Heilige Drei Könige, Fronleichnam und Allerheiligen zusätzlich zu den bundesweiten –, deshalb ergeben sich in beiden Ländern für dasselbe Jahr identische Arbeitstage. Regional reicht die Wirtschaftsstruktur von der Finanz- und Technologiebranche im Raum München bis zum industriellen Mittelstand in Franken.",
  be: "Berlin hat als einziges Bundesland faktisch keinen industriellen Schwerpunkt: Verwaltung, Wissenschaft und ein seit Jahren wachsender Dienstleistungs- und Start-up-Sektor prägen den Arbeitsmarkt stärker als in jedem anderen Land. Für freiberufliche Tagessätze und Projektkalkulationen bedeutet das eine größere Bandbreite an Branchen als anderswo.",
  bb: "Brandenburg ist wirtschaftlich eng mit Berlin verflochten: Ein großer Teil der Erwerbstätigen im Speckgürtel pendelt täglich in die Hauptstadt, während neu angesiedelte Industriebetriebe wie die Tesla-Gigafactory in Grünheide zunehmend Arbeitsplätze direkt im Land schaffen.",
  hb: "Bremen hat mit Hamburg, Niedersachsen und Schleswig-Holstein exakt denselben Feiertagskalender – die neun bundesweiten plus seit 2018 den Reformationstag –, deshalb sind die Arbeitstage in allen vier Ländern für dasselbe Jahr identisch. Wirtschaftlich prägen Hafenwirtschaft, Luft- und Raumfahrt und Stahlverarbeitung den mit Abstand kleinsten Flächenstaat der vier.",
  hh: "Hamburg hat mit Bremen, Niedersachsen und Schleswig-Holstein exakt denselben Feiertagskalender – die neun bundesweiten plus seit 2018 den Reformationstag –, deshalb sind die Arbeitstage in allen vier Ländern für dasselbe Jahr identisch. Als größter Hafenstandort Deutschlands und Sitz zahlreicher Medien- und Handelsunternehmen ist der Arbeitsmarkt hier stärker auf Außenhandel und Logistik ausgerichtet als im Rest der Gruppe.",
  he: "Hessen ist durch Frankfurt als größten Finanzplatz Kontinentaleuropas geprägt – mit der Europäischen Zentralbank, zahlreichen Banken und einem der größten Flughäfen Europas als Arbeitgeber. Nordhessische Regionen um Kassel sind dagegen deutlich industrieller und ländlicher geprägt; ein Landesdurchschnitt trifft für beide Teile des Landes selten gleich gut zu.",
  mv: "Mecklenburg-Vorpommern hat vergleichsweise wenig Industrie und ist stärker von Landwirtschaft und – besonders an der Ostseeküste – vom Tourismus geprägt, mit entsprechend ausgeprägter Saisonarbeit. Das schlägt sich auch in einer der niedrigeren Bevölkerungsdichten unter den Flächenländern nieder.",
  ni: "Niedersachsen wird wirtschaftlich stark von der Automobilindustrie geprägt – Volkswagen mit Sitz in Wolfsburg ist der größte einzelne Arbeitgeber des Landes. Mit Hamburg, Bremen und Schleswig-Holstein teilt es sich denselben Feiertagskalender, die Arbeitstage sind in allen vier Ländern für dasselbe Jahr identisch.",
  nw: "Nordrhein-Westfalen hat mit Rheinland-Pfalz denselben Feiertagskalender – Fronleichnam und Allerheiligen zusätzlich zu den bundesweiten –, deshalb stimmen die Arbeitstage beider Länder für dasselbe Jahr überein. Als bevölkerungsreichstes Bundesland reicht die Arbeitsmarktstruktur vom Strukturwandel im Ruhrgebiet bis zu den Konzernzentralen der Rheinschiene um Köln und Düsseldorf.",
  rp: "Rheinland-Pfalz hat mit Nordrhein-Westfalen denselben Feiertagskalender – Fronleichnam und Allerheiligen zusätzlich zu den bundesweiten –, deshalb ergeben sich für dasselbe Jahr identische Arbeitstage. Mit dem Chemiekonzern BASF in Ludwigshafen und dem Pharmaunternehmen Boehringer Ingelheim liegen zwei der größten deutschen Industriearbeitgeber im Land, daneben prägt der Weinbau an Mosel und Rhein viele kleinere Betriebe.",
  sl: "Das Saarland ist als kleinstes Flächenland wirtschaftlich stark vom Strukturwandel weg von Kohle und Stahl hin zu Automobilzulieferern geprägt – ein Wandel, der den regionalen Arbeitsmarkt seit Jahrzehnten begleitet. Die Nähe zu Frankreich und Luxemburg sorgt zudem für einen spürbaren Anteil an Grenzpendlern.",
  sn: "Sachsen hat sich vom traditionellen Industrieland zu einem Zentrum der Halbleiter- und Automobilindustrie entwickelt – der Großraum Dresden gilt mit zahlreichen Chipfabriken als „Silicon Saxony“, dazu kommen Automobilwerke in Leipzig und Zwickau. Der Buß- und Bettag ist hier zusätzlich zum Reformationstag als einziges Bundesland gesetzlicher Feiertag.",
  st: "Sachsen-Anhalt ist wirtschaftlich vom sogenannten Chemiedreieck um Leuna und Bitterfeld sowie zunehmend von erneuerbaren Energien geprägt. Das Land hat zugleich einen der stärksten Bevölkerungsrückgänge aller Bundesländer der letzten Jahrzehnte hinter sich, was sich auch im Arbeitsmarkt bemerkbar macht.",
  sh: "Schleswig-Holstein hat mit Bremen, Hamburg und Niedersachsen exakt denselben Feiertagskalender – die neun bundesweiten plus seit 2018 den Reformationstag –, deshalb sind die Arbeitstage in allen vier Ländern für dasselbe Jahr identisch. Wirtschaftlich prägen Windenergie, Landwirtschaft und Werften wie in Kiel den nördlichsten Flächenstaat der Gruppe.",
  th: "Thüringen liegt geografisch zentral in Deutschland und ist wirtschaftlich von einem breiten industriellen Mittelstand geprägt, darunter Optik- und Feinmechanikbetriebe in der Tradition von Zeiss in Jena sowie Automobilzulieferer. Seit 2019 ist hier zusätzlich zum Reformationstag der Weltkindertag gesetzlicher Feiertag – bundesweit einmalig.",
};

/** Eine FAQ je Land, aus den 32 entfernten Landing-Pages übernommen. */
export const arbeitsmarktFaq: Record<RegionCode, FaqEntry> = {
  bw: {
    question: "Warum haben Baden-Württemberg und Bayern an denselben Tagen frei?",
    answer:
      "Weil beide Länder exakt dieselben zusätzlichen Feiertage kennen: Heilige Drei Könige, Fronleichnam und Allerheiligen neben den bundesweiten. Arbeitstage und Werktage stimmen für dasselbe Jahr deshalb exakt überein. Wirtschaftlich zählt Baden-Württemberg dank Automobilbau und Maschinenbau zu den Ländern mit der höchsten Exportquote.",
  },
  by: {
    question: "Warum ist ein Landesdurchschnitt für Bayern wenig aussagekräftig?",
    answer:
      "Weil die Wirtschaftsstruktur stark variiert: Der Raum München ist von Finanz- und Technologieunternehmen geprägt, Franken dagegen vom industriellen Mittelstand. Beim Feiertagskalender gibt es diese Varianz nicht – er ist mit Heilige Drei Könige, Fronleichnam und Allerheiligen identisch mit Baden-Württemberg.",
  },
  be: {
    question: "Welche Branchen prägen den Berliner Arbeitsmarkt?",
    answer:
      "Vor allem Verwaltung, Wissenschaft und ein seit Jahren wachsender Dienstleistungs- und Start-up-Sektor – ein industrieller Schwerpunkt wie in den meisten Flächenländern fehlt. Für freiberufliche Tagessätze und Projektkalkulationen bedeutet das eine größere Bandbreite an Vergleichswerten als anderswo.",
  },
  bb: {
    question: "Warum zählt für viele Erwerbstätige in Brandenburg auch der Berliner Kalender?",
    answer:
      "Weil ein großer Teil der Beschäftigten aus dem Speckgürtel täglich nach Berlin pendelt. Zugleich entstehen mit Ansiedlungen wie der Tesla-Gigafactory in Grünheide zunehmend Arbeitsplätze direkt im Land, unabhängig vom Berliner Markt.",
  },
  hb: {
    question:
      "Warum unterscheidet sich der Bremer Arbeitsmarkt trotz identischem Feiertagskalender von Hamburg, Niedersachsen und Schleswig-Holstein?",
    answer:
      "Weil Feiertage und Wirtschaftsstruktur zwei getrennte Dinge sind: Alle vier Länder haben dieselben Arbeitstage, aber Bremen ist als kleinster der vier Flächenstaaten besonders von Hafenwirtschaft, Luft- und Raumfahrt sowie Stahlverarbeitung geprägt.",
  },
  hh: {
    question: "Was unterscheidet den Hamburger Arbeitsmarkt von Bremen, Niedersachsen und Schleswig-Holstein?",
    answer:
      "Die Feiertage nicht – die sind in allen vier Ländern identisch. Wirtschaftlich ist Hamburg als größter deutscher Hafenstandort und Sitz zahlreicher Medien- und Handelsunternehmen aber stärker auf Außenhandel und Logistik ausgerichtet als der Rest der Gruppe.",
  },
  he: {
    question: "Warum ist Frankfurt für den hessischen Arbeitsmarkt so entscheidend?",
    answer:
      "Als größter Finanzplatz Kontinentaleuropas mit der Europäischen Zentralbank und zahlreichen Banken prägt Frankfurt den südhessischen Arbeitsmarkt stark. Nordhessen um Kassel ist dagegen deutlich industrieller und ländlicher – ein Landeswert trifft selten auf beide Teile gleich gut zu.",
  },
  mv: {
    question: "Warum spielt Saisonarbeit in Mecklenburg-Vorpommern eine größere Rolle als anderswo?",
    answer:
      "Weil Tourismus an der Ostseeküste einer der wichtigsten Wirtschaftszweige des Landes ist, neben einer vergleichsweise industriearmen, landwirtschaftlich geprägten Struktur im Binnenland. Beides zusammen führt zu einer der niedrigeren Bevölkerungsdichten unter den Flächenländern.",
  },
  ni: {
    question: "Welcher Arbeitgeber prägt Niedersachsen am stärksten?",
    answer:
      "Volkswagen mit Sitz in Wolfsburg ist der mit Abstand größte einzelne Arbeitgeber des Landes. Beim Feiertagskalender steht Niedersachsen dagegen in einer Gruppe mit Hamburg, Bremen und Schleswig-Holstein – alle vier Länder haben für dasselbe Jahr identische Arbeitstage.",
  },
  nw: {
    question: "Warum unterscheiden sich die Arbeitsmärkte innerhalb Nordrhein-Westfalens so stark?",
    answer:
      "Weil das bevölkerungsreichste Bundesland zwei sehr unterschiedliche Wirtschaftsräume vereint: das Ruhrgebiet im Strukturwandel weg von Kohle und Stahl und die Rheinschiene um Köln und Düsseldorf mit zahlreichen Konzernzentralen. Die Feiertage sind dabei mit Rheinland-Pfalz identisch.",
  },
  rp: {
    question: "Welche Großunternehmen prägen den Arbeitsmarkt in Rheinland-Pfalz?",
    answer:
      "Vor allem der Chemiekonzern BASF in Ludwigshafen und das Pharmaunternehmen Boehringer Ingelheim – zwei der größten Industriearbeitgeber Deutschlands. Beim Feiertagskalender ist das Land mit Nordrhein-Westfalen identisch, die Arbeitstage stimmen für dasselbe Jahr exakt überein.",
  },
  sl: {
    question: "Warum hat das Saarland traditionell einen hohen Anteil an Grenzpendlern?",
    answer:
      "Weil es als kleinstes Flächenland direkt an Frankreich und Luxemburg grenzt – beide sind für viele Beschäftigte in erreichbarer Nähe. Wirtschaftlich prägt der Strukturwandel weg von Kohle und Stahl hin zu Automobilzulieferern den Arbeitsmarkt seit Jahrzehnten.",
  },
  sn: {
    question: "Was bedeutet „Silicon Saxony“?",
    answer:
      "Der Name für den Großraum Dresden, der sich mit zahlreichen Halbleiterfabriken zu einem der wichtigsten Chipstandorte Europas entwickelt hat. Dazu kommen Automobilwerke in Leipzig und Zwickau. Beim Feiertagskalender hat Sachsen mit dem Buß- und Bettag zusätzlich zum Reformationstag eine bundesweite Besonderheit.",
  },
  st: {
    question: "Was ist das Chemiedreieck in Sachsen-Anhalt?",
    answer:
      "Die Region um Leuna und Bitterfeld mit einer langen Tradition der chemischen Industrie, ergänzt um einen wachsenden Anteil erneuerbarer Energien. Das Land hat zugleich einen der stärksten Bevölkerungsrückgänge aller Bundesländer der letzten Jahrzehnte hinter sich.",
  },
  sh: {
    question: "Warum ist der Feiertagskalender in Schleswig-Holstein identisch mit Bremen, Hamburg und Niedersachsen?",
    answer:
      "Weil alle vier Länder 2018 gemeinsam den Reformationstag als zusätzlichen Feiertag eingeführt haben – zusätzlich zu den neun bundesweiten. Wirtschaftlich ist Schleswig-Holstein als nördlichster Flächenstaat besonders von Windenergie, Landwirtschaft und Werften wie in Kiel geprägt.",
  },
  th: {
    question: "Was ist an Thüringens Feiertagskalender bundesweit einzigartig?",
    answer:
      "Der Weltkindertag, den das Land 2019 zusätzlich zum Reformationstag als bislang einziges Bundesland zum gesetzlichen Feiertag erklärt hat. Wirtschaftlich ist Thüringen von einem breiten industriellen Mittelstand geprägt, darunter Optikbetriebe in der Tradition von Zeiss in Jena.",
  },
};
