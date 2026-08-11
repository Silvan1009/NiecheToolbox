/**
 * Inhalte der SEO-Unterseiten des Brückentage-Optimierers – je Bundesland und
 * Jahr eine Seite.
 *
 * Anders als bei den handgeschriebenen Varianten anderer Tools entstehen diese
 * Texte aus der Rechnung selbst: Wie viele Feiertage im Jahr auf ein Wochenende
 * fallen, welcher Anlass den besten Hebel hat und wie weit fünf Urlaubstage
 * tragen, ist je Land und Jahr verschieden. Damit unterscheiden sich die 48
 * Seiten in den Fakten und nicht in der Formulierung – umgeschriebene Absätze
 * mit denselben Aussagen wären für Leser wie für eine AdSense-Prüfung wertlos.
 *
 * Jede Zahl im Text kommt aus `calculateBrueckentage()` mit genau den
 * Voreinstellungen der jeweiligen Seite. Wer den Text liest und dann auf den
 * Rechner schaut, findet dieselben Werte wieder.
 */

import {
  formatDate,
  formatLongDate,
  formatWeekdayLong,
  plural,
} from "@/lib/format";
import {
  holidaysFor,
  nationwideHolidayNames,
  partialHolidayNames,
  regions,
  type Region,
} from "@/lib/regionen";
import type { FaqEntry } from "@/tools/types";
import type { VariantContent } from "@/tools/variants";
import {
  calculateBrueckentage,
  type BridgeBlock,
  type BrueckentageResult,
} from "./logic";

/** Für wie viele Jahre programmatische Landing-Pages entstehen. */
const VARIANT_YEARS = 3;

/**
 * Urlaubsbudget, mit dem die Beispiele im Text rechnen – dieselbe
 * Voreinstellung wie im Rechner (`DEFAULT_BUDGET` in Component.tsx).
 */
const BUDGET = 5;

/* ---------------------------------------------------------------------------
 * Sprachliche Hilfen
 * ------------------------------------------------------------------------- */

/** ["A", "B", "C"] -> "A, B und C" */
function aufzaehlung(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

const tage = (n: number) =>
  `${n === 1 ? "ein" : n} ${plural(n, "Tag", "Tage")}`;

/** Nominativ: "ein Urlaubstag", "5 Urlaubstage" */
const urlaubstage = (n: number) =>
  n === 1 ? "ein Urlaubstag" : `${n} Urlaubstage`;

/** Dativ: "mit einem Urlaubstag", "mit 5 Urlaubstagen" */
const urlaubstagen = (n: number) =>
  n === 1 ? "einem Urlaubstag" : `${n} Urlaubstagen`;

/** "vom 30.05.2026 bis zum 02.06.2026" – die Spanne einer freien Zeit. */
const spanne = (block: BridgeBlock) =>
  `vom ${formatDate(block.freeStart)} bis zum ${formatDate(block.freeEnd)}`;

/** Die Feiertage eines Blocks als Aufzählung ihrer Namen. */
const anlass = (block: BridgeBlock) =>
  aufzaehlung(block.holidays.map((h) => h.name));

/** "Neujahr (Samstag, 01.01.2028)" – Feiertag mit Wochentag und Datum. */
const mitDatum = (holiday: { name: string; date: string }) =>
  `${holiday.name} (${formatWeekdayLong(holiday.date)}, ${formatDate(holiday.date)})`;

/* ---------------------------------------------------------------------------
 * Fakten, die sich je Land und Jahr unterscheiden
 * ------------------------------------------------------------------------- */

/** Werktags-Feiertage je Bundesland – die Zahl, die den Vergleich trägt. */
function werktagsFeiertageProLand(year: number): Map<string, number> {
  return new Map(
    regions.map((region) => [
      region.code,
      holidaysFor(year, region.code).filter(
        (holiday) => !holiday.partial && !holiday.onWeekend,
      ).length,
    ]),
  );
}

interface Fakten {
  result: BrueckentageResult;
  /** Die Feiertage, die in allen 16 Ländern gelten. */
  bundesweit: Set<string>;
  /** Landesweit geltende Feiertage des Jahres. */
  anzahlFeiertage: number;
  /** Davon auf einem Werktag – nur die lassen sich verlängern. */
  werktags: number;
  /** Feiertage, die auf Samstag oder Sonntag fallen. */
  amWochenende: { name: string; date: string }[];
  /** Feiertage über die bundesweit geltenden hinaus. */
  zusaetzlich: string[];
  /** Feiertage, die im Land nur regional gelten (Bayern, Sachsen, Thüringen). */
  regional: string[];
  /** Rang unter den 16 Ländern nach nutzbaren Feiertagen, 1 = die meisten. */
  rang: number;
  /** Wie viele Länder denselben Wert haben. */
  gleichauf: number;
  bestesLand: number;
  schwaechstesLand: number;
}

function faktenFor(region: Region, year: number): Fakten {
  const result = calculateBrueckentage({
    year,
    region: region.code,
    budget: BUDGET,
  });

  const gezaehlt = result.holidays.filter((holiday) => !holiday.partial);
  const bundesweit = nationwideHolidayNames(year);
  const proLand = werktagsFeiertageProLand(year);
  const werktags = result.holidaysOnWorkday;
  const werte = [...proLand.values()];

  return {
    result,
    bundesweit,
    anzahlFeiertage: gezaehlt.length,
    werktags,
    amWochenende: gezaehlt
      .filter((holiday) => holiday.onWeekend)
      .map((holiday) => ({ name: holiday.name, date: holiday.date })),
    zusaetzlich: gezaehlt
      .map((holiday) => holiday.name)
      .filter((name) => !bundesweit.has(name)),
    regional: partialHolidayNames(region.code),
    rang: werte.filter((wert) => wert > werktags).length + 1,
    gleichauf: werte.filter((wert) => wert === werktags).length,
    bestesLand: Math.max(...werte),
    schwaechstesLand: Math.min(...werte),
  };
}

/* ---------------------------------------------------------------------------
 * Sätze aus den Fakten
 * ------------------------------------------------------------------------- */

/** "Drei Feiertage verpuffen am Wochenende: Neujahr (Samstag, 01.01.2028) …" */
function wochenendSatz(fakten: Fakten, year: number): string {
  const verloren = fakten.amWochenende;

  if (verloren.length === 0) {
    return `Kein einziger Feiertag fällt ${year} auf ein Wochenende – das ist der Idealfall, denn ein Feiertag am Samstag oder Sonntag bringt niemandem einen freien Tag.`;
  }

  const liste = aufzaehlung(verloren.map(mitDatum));

  return verloren.length === 1
    ? `Ein Feiertag verpufft dagegen am Wochenende: ${liste}. Er kostet niemanden einen Arbeitstag und lässt sich auch nicht mit Urlaub verlängern.`
    : `${verloren.length} Feiertage verpuffen dagegen am Wochenende: ${liste}. Diese Tage kosten niemanden einen Arbeitstag – und lassen sich auch nicht verlängern.`;
}

/** Der stärkste Hebel des Jahres, als Satz. */
function hebelSatz(block: BridgeBlock): string {
  const kosten = block.vacationDays.length;
  const auftakt = `Der stärkste Hebel des Jahres liegt rund um ${anlass(block)}:`;

  if (kosten === 1) {
    return `${auftakt} Ein einziger Urlaubstag am ${formatLongDate(block.vacationDays[0])} ergibt ${tage(block.freeDays)} am Stück frei, ${spanne(block)}.`;
  }

  return `${auftakt} Mit ${urlaubstagen(kosten)} entstehen dort ${tage(block.freeDays)} am Stück frei, ${spanne(block)} – also ${block.ratio.toFixed(1).replace(".", ",")} freie Tage je eingesetztem Urlaubstag.`;
}

/** Was fünf Urlaubstage im Jahr bringen. */
function planSatz(result: BrueckentageResult, region: Region): string {
  const { blocks, vacationDaysUsed, freeDays } = result.plan;

  if (blocks.length === 0) {
    return `Ein Jahresplan lässt sich hier nicht bilden: In ${region.name} liegt ${result.year} kein Feiertag so, dass sich mit Urlaub eine längere Spanne bauen ließe.`;
  }

  const liste = aufzaehlung(
    blocks.map(
      (block) => `${anlass(block)} (${tage(block.freeDays)}, ${spanne(block)})`,
    ),
  );

  return `Wer ${urlaubstage(vacationDaysUsed)} gezielt einsetzt, kommt in ${region.name} auf ${tage(freeDays)} in ${blocks.length} ${plural(blocks.length, "Block", "Blöcken")}: ${liste}.`;
}

/**
 * Die Anlässe, die auf einem landeseigenen Feiertag beruhen.
 *
 * Der Jahresplan sieht in vielen Ländern gleich aus, weil die bundesweiten
 * Feiertage um Ostern und Pfingsten überall das beste Verhältnis liefern.
 * Was ein Land wirklich unterscheidet, sind die Anlässe, die es anderswo gar
 * nicht gibt – deshalb stehen sie hier eigens im Text.
 */
function eigeneAnlaesseSatz(
  fakten: Fakten,
  region: Region,
  year: number,
): string | null {
  if (fakten.zusaetzlich.length === 0) return null;

  // Derselbe Landesfeiertag taucht in mehreren Anlässen auf – einmal für sich,
  // einmal zusammen mit einem Nachbarfeiertag. Für den Text zählt je Feiertag
  // nur der Vorschlag mit dem besten Verhältnis.
  const genannt = new Set<string>();
  const eigene = [...fakten.result.occasions]
    .sort((a, b) => b.recommended.ratio - a.recommended.ratio)
    .filter((occasion) => {
      const landeseigen = occasion.holidays
        .map((holiday) => holiday.name)
        .filter((name) => !fakten.bundesweit.has(name));
      if (landeseigen.length === 0) return false;
      if (landeseigen.every((name) => genannt.has(name))) return false;
      for (const name of landeseigen) genannt.add(name);
      return true;
    });

  if (eigene.length === 0) {
    return `Die Feiertage, die ${region.name} über den Bund hinaus hat, tragen ${year} allerdings nichts bei: Sie fallen aufs Wochenende oder liegen so, dass sich mit Urlaub nichts gewinnen lässt.`;
  }

  const liste = aufzaehlung(
    eigene
      .slice(0, 3)
      .map(
        (occasion) =>
          `${anlass(occasion.recommended)} (${urlaubstage(occasion.recommended.vacationDays.length)} für ${tage(occasion.recommended.freeDays)})`,
      ),
  );

  return eigene.length === 1
    ? `Landestypisch ist dazu ein Anlass, den es in den meisten anderen Bundesländern gar nicht gibt: ${liste}.`
    : `Landestypisch sind dazu ${eigene.length} Anlässe, die es in den meisten anderen Bundesländern gar nicht gibt: ${liste}.`;
}

/** Was dieses Bundesland von den anderen unterscheidet. */
function landSatz(fakten: Fakten, region: Region, year: number): string {
  const teile: string[] = [];

  teile.push(
    fakten.zusaetzlich.length > 0
      ? `Über die bundesweit geltenden Feiertage hinaus gelten in ${region.name} zusätzlich: ${aufzaehlung(fakten.zusaetzlich)}.`
      : `Eigene Feiertage über die bundesweit geltenden hinaus hat ${region.name} nicht – das ist der Grund, warum hier weniger zu holen ist als im Süden.`,
  );

  const weitere = fakten.gleichauf - 1;
  const vergleich =
    fakten.werktags === fakten.bestesLand
      ? `Mit ${fakten.werktags} nutzbaren Feiertagen liegt das Land ${year} an der Spitze${weitere > 0 ? ` – zusammen mit ${weitere === 1 ? "einem weiteren Bundesland" : `${weitere} weiteren Bundesländern`}` : ", und zwar allein"}.`
      : fakten.werktags === fakten.schwaechstesLand
        ? `Mit ${fakten.werktags} nutzbaren Feiertagen liegt das Land ${year} am unteren Ende; im besten Bundesland sind es ${fakten.bestesLand}.`
        : `Mit ${fakten.werktags} nutzbaren Feiertagen liegt das Land ${year} auf Rang ${fakten.rang} der 16 Bundesländer – bundesweit reicht die Spanne von ${fakten.schwaechstesLand} bis ${fakten.bestesLand}.`;

  teile.push(vergleich);

  if (fakten.regional.length > 0) {
    teile.push(
      `Dazu kommt ${aufzaehlung(fakten.regional)}: Der Tag gilt in ${region.name} nur in einem Teil der Gemeinden und zählt deshalb erst mit, wenn du im Rechner die regionalen Feiertage ausdrücklich aktivierst.`,
    );
  }

  return teile.join(" ");
}

/* ---------------------------------------------------------------------------
 * Seiteninhalt
 * ------------------------------------------------------------------------- */

function about(fakten: Fakten, region: Region, year: number): string[] {
  const { result } = fakten;

  const ersterAbsatz = [
    `${year} gelten in ${region.name} ${fakten.anzahlFeiertage} gesetzliche Feiertage. ${fakten.werktags} davon fallen auf einen Werktag – nur diese lassen sich mit Urlaub zu einer längeren freien Spanne ausbauen.`,
    wochenendSatz(fakten, year),
  ].join(" ");

  const zweiterAbsatz = [
    result.mostEfficient ? hebelSatz(result.mostEfficient) : null,
    `Insgesamt findet der Rechner ${result.occasions.length} ${plural(result.occasions.length, "Anlass", "Anlässe")}, an denen sich Urlaub ${year} überdurchschnittlich auszahlt.`,
    planSatz(result, region),
    eigeneAnlaesseSatz(fakten, region, year),
  ]
    .filter(Boolean)
    .join(" ");

  return [ersterAbsatz, zweiterAbsatz, landSatz(fakten, region, year)];
}

function faq(fakten: Fakten, region: Region, year: number): FaqEntry[] {
  const { result } = fakten;
  const eintraege: FaqEntry[] = [];

  eintraege.push({
    question: `Wie viele Brückentage gibt es ${year} in ${region.name}?`,
    answer: [
      `Der Rechner findet ${result.occasions.length} ${plural(result.occasions.length, "Anlass", "Anlässe")}, an denen sich Urlaub überdurchschnittlich auszahlt – ausgehend von ${fakten.werktags} Feiertagen, die ${year} in ${region.name} auf einen Werktag fallen.`,
      result.mostEfficient
        ? `Am meisten bringt der Zeitraum um ${anlass(result.mostEfficient)}: Mit ${urlaubstagen(result.mostEfficient.vacationDays.length)} entstehen dort ${tage(result.mostEfficient.freeDays)} am Stück frei.`
        : null,
      "Wie viele davon zu dir passen, hängt vom Budget ab, das du oben einträgst.",
    ]
      .filter(Boolean)
      .join(" "),
  });

  eintraege.push({
    question: `Wie viele Tage frei bekomme ich ${year} in ${region.name} mit ${BUDGET} Urlaubstagen?`,
    answer:
      result.plan.blocks.length > 0
        ? [
            `In ${region.name} sind es ${tage(result.plan.freeDays)} in ${result.plan.blocks.length} ${plural(result.plan.blocks.length, "Block", "Blöcken")}, verteilt über das Jahr – ${
              result.plan.vacationDaysUsed < BUDGET
                ? `dafür reichen sogar ${urlaubstage(result.plan.vacationDaysUsed)}, weil sich die übrigen Anlässe zeitlich überschneiden`
                : `und dafür ist das Budget genau aufgebraucht`
            }.`,
            "Der Jahresplan wählt die Anlässe mit dem besten Verhältnis, die nebeneinander bestehen können.",
            result.best
              ? `Wer stattdessen alles auf eine Karte setzt, kommt mit demselben Budget auf ${tage(result.best.freeDays)} am Stück, ${spanne(result.best)}.`
              : null,
            `Gerechnet ist das mit ${fakten.anzahlFeiertage} gesetzlichen Feiertagen, von denen ${fakten.werktags} auf einen Werktag fallen.`,
          ]
            .filter(Boolean)
            .join(" ")
        : `In ${region.name} liegen die Feiertage ${year} so ungünstig, dass sich mit Urlaub keine längere Spanne bauen lässt. Das ist selten, kommt aber vor, wenn viele Feiertage auf ein Wochenende fallen.`,
  });

  eintraege.push({
    question:
      fakten.amWochenende.length > 0
        ? `Welche Feiertage fallen ${year} in ${region.name} auf ein Wochenende?`
        : `Fällt ${year} in ${region.name} ein Feiertag auf ein Wochenende?`,
    answer:
      fakten.amWochenende.length > 0
        ? `${year} sind es in ${region.name} ${fakten.amWochenende.length}: ${aufzaehlung(fakten.amWochenende.map(mitDatum))}. Einen Ersatzruhetag gibt es in Deutschland nicht – ein Feiertag am Samstag oder Sonntag ist ersatzlos verschenkt. Planen lässt sich deshalb nur mit den ${fakten.werktags} Feiertagen, die auf einen Werktag fallen.`
        : `Nein – ${year} fällt in ${region.name} kein gesetzlicher Feiertag auf einen Samstag oder Sonntag. Alle ${fakten.anzahlFeiertage} Feiertage bringen also tatsächlich einen freien Tag, und alle lassen sich mit Urlaub verlängern.`,
  });

  return eintraege;
}

/* ---------------------------------------------------------------------------
 * Aufbau
 * ------------------------------------------------------------------------- */

function baueTexte(baseYear: number): VariantContent[] {
  const texte: VariantContent[] = [];

  for (let offset = 0; offset < VARIANT_YEARS; offset += 1) {
    const year = baseYear + offset;

    for (const region of regions) {
      const fakten = faktenFor(region, year);
      const { plan } = fakten.result;

      // Die Antwort steht schon im Suchergebnis, nicht erst auf der Seite.
      const description =
        plan.blocks.length > 0
          ? `Alle Brückentage ${year} in ${region.name}: ${tage(plan.freeDays)} frei mit nur ${urlaubstagen(plan.vacationDaysUsed)}. Mit allen ${fakten.anzahlFeiertage} Feiertagen des Jahres und fertigem Jahresplan.`
          : `Alle Feiertage ${year} in ${region.name} auf einen Blick – mit Brückentage-Optimierer, Jahresplan und Kalenderansicht. Kostenlos und ohne Anmeldung.`;

      texte.push({
        slug: `${region.slug}-${year}`,
        title: `Brückentage ${year} in ${region.name}`,
        description,
        heading: `Brückentage ${year} in ${region.name}`,
        params: { bl: region.code, jahr: year, basisJahr: baseYear },
        about: about(fakten, region, year),
        faq: faq(fakten, region, year),
      });
    }
  }

  return texte;
}

/**
 * Die Texte werden je Basisjahr einmal gerechnet und dann behalten.
 *
 * `getVariants()` wird pro Build mehrfach aufgerufen – von der Sitemap, von
 * `generateStaticParams()`, beim Rendern jeder Seite und vom OG-Skript. Ohne
 * Zwischenspeicher liefe der Optimierer dabei jedes Mal 48-mal durch ein
 * ganzes Jahr.
 */
let cache: { baseYear: number; texte: VariantContent[] } | null = null;

export function variantenTexte(): VariantContent[] {
  const baseYear = new Date().getUTCFullYear();
  if (cache?.baseYear !== baseYear) {
    cache = { baseYear, texte: baueTexte(baseYear) };
  }
  return cache.texte;
}
