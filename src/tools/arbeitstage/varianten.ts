/**
 * Inhalte der SEO-Unterseiten des Arbeitstage-Rechners – je Bundesland und
 * Jahr eine Seite.
 *
 * Die Texte entstehen aus der Rechnung selbst: Arbeitstage, verpuffte
 * Feiertage, der stärkste und der schwächste Monat sind je Land und Jahr
 * verschieden. Damit unterscheiden sich die 32 Seiten in den Fakten und nicht
 * nur in der Überschrift.
 *
 * Jede Zahl im Text kommt aus `calculateWorkdays()` mit genau den
 * Voreinstellungen der jeweiligen Seite: ganzes Kalenderjahr, Fünftagewoche,
 * ohne die nur regional geltenden Feiertage.
 */

import {
  formatAmount,
  formatDate,
  formatWeekdayLong,
  plural,
} from "@/lib/format";
import {
  nationwideHolidayNames,
  partialHolidayNames,
  regions,
  type Region,
} from "@/lib/regionen";
import type { FaqEntry } from "@/tools/types";
import type { VariantContent } from "@/tools/variants";
import {
  MONTH_NAMES,
  calculateWorkdays,
  monthlyBreakdown,
  weekPresets,
  yearRange,
  type WorkdaysResult,
} from "./logic";

/** Für wie viele Jahre programmatische Landing-Pages entstehen. */
const VARIANT_YEARS = 2;

/* ---------------------------------------------------------------------------
 * Sprachliche Hilfen
 * ------------------------------------------------------------------------- */

function aufzaehlung(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

const feiertage = (n: number) =>
  `${n === 1 ? "ein" : n} ${plural(n, "Feiertag", "Feiertage")}`;

/** Nominativ und Akkusativ: "252 Arbeitstage" */
const arbeitstage = (n: number) =>
  `${n} ${plural(n, "Arbeitstag", "Arbeitstage")}`;

/** Dativ: "mit 23 Arbeitstagen" */
const arbeitstagen = (n: number) =>
  `${n} ${plural(n, "Arbeitstag", "Arbeitstagen")}`;

/** "Neujahr (Donnerstag, 01.01.2026)" */
const mitDatum = (holiday: { name: string; date: string }) =>
  `${holiday.name} (${formatWeekdayLong(holiday.date)}, ${formatDate(holiday.date)})`;

/* ---------------------------------------------------------------------------
 * Fakten je Land und Jahr
 * ------------------------------------------------------------------------- */

/** Ganzes Kalenderjahr in der gewünschten Arbeitswoche. */
function jahresRechnung(
  year: number,
  region: Region,
  woche: "5" | "6",
): WorkdaysResult {
  return calculateWorkdays({
    ...yearRange(year),
    region: region.code,
    workdays: weekPresets[woche].days,
    includePartial: false,
    daysOff: 0,
  });
}

interface Monat {
  name: string;
  workdays: number;
  holidays: number;
}

interface Fakten {
  /** Fünftagewoche – die Voreinstellung der Seite. */
  jahr: WorkdaysResult;
  /** Sechstagewoche – die Werktage, nach denen Fristen zählen. */
  werktage: number;
  monate: Monat[];
  staerkster: Monat;
  schwaechster: Monat;
  /** Monate, in denen kein Feiertag liegt. */
  ohneFeiertag: string[];
  /** Feiertage, die aufs Wochenende fallen. */
  amWochenende: { name: string; date: string }[];
  /** Feiertage über die bundesweit geltenden hinaus. */
  zusaetzlich: string[];
  /** Feiertage, die im Land nur in einzelnen Gemeinden gelten. */
  regional: string[];
  /** Arbeitstage je Bundesland – für den Vergleich. */
  proLand: number[];
  bestesLand: number;
  schwaechstesLand: number;
}

function faktenFor(region: Region, year: number): Fakten {
  const jahr = jahresRechnung(year, region, "5");
  const bundesweit = nationwideHolidayNames(year);

  const monate: Monat[] = monthlyBreakdown(
    year,
    region.code,
    weekPresets["5"].days,
    false,
  ).map((eintrag) => ({
    name: MONTH_NAMES[eintrag.month - 1],
    workdays: eintrag.workdays,
    holidays: eintrag.holidays,
  }));

  const proLand = regions.map(
    (anderes) => jahresRechnung(year, anderes, "5").workdays,
  );

  return {
    jahr,
    werktage: jahresRechnung(year, region, "6").workdays,
    monate,
    staerkster: monate.reduce((a, b) => (b.workdays > a.workdays ? b : a)),
    schwaechster: monate.reduce((a, b) => (b.workdays < a.workdays ? b : a)),
    ohneFeiertag: monate
      .filter((monat) => monat.holidays === 0)
      .map((monat) => monat.name),
    amWochenende: jahr.holidays
      .filter((holiday) => !holiday.countsAsLoss)
      .map((holiday) => ({ name: holiday.name, date: holiday.date })),
    zusaetzlich: jahr.holidays
      .map((holiday) => holiday.name)
      .filter((name) => !bundesweit.has(name)),
    regional: partialHolidayNames(region.code),
    proLand,
    bestesLand: Math.max(...proLand),
    schwaechstesLand: Math.min(...proLand),
  };
}

/* ---------------------------------------------------------------------------
 * Sätze aus den Fakten
 * ------------------------------------------------------------------------- */

/** Wie sich die Zahl aus Wochentagen und Feiertagen ergibt. */
function herleitungSatz(fakten: Fakten, region: Region, year: number): string {
  const { jahr } = fakten;

  return `${year} hat ${region.name} ${arbeitstage(jahr.workdays)} bei einer Fünftagewoche. Die Zahl ergibt sich aus ${jahr.scheduledDays} Wochentagen von Montag bis Freitag, von denen ${feiertage(jahr.lostToHolidays)} abgehen – nämlich die, die nicht ohnehin auf ein Wochenende fallen.`;
}

/** Was die Feiertage am Wochenende kosten. */
function wochenendSatz(fakten: Fakten, year: number): string {
  const verloren = fakten.amWochenende;

  if (verloren.length === 0) {
    return `${year} fällt kein einziger Feiertag auf einen Samstag oder Sonntag – jeder gesetzliche Feiertag bringt also tatsächlich einen freien Tag. Das ist der seltene Idealfall; meist verpuffen zwei bis vier Tage im Jahr.`;
  }

  const liste = aufzaehlung(verloren.map(mitDatum));

  return verloren.length === 1
    ? `Ein Feiertag verpufft: ${liste}. Einen Ersatzruhetag gibt es in Deutschland nicht, der Tag ist damit ersatzlos weg.`
    : `${verloren.length} Feiertage verpuffen am Wochenende: ${liste}. Einen Ersatzruhetag kennt das deutsche Recht nicht – diese Tage sind ersatzlos weg.`;
}

/** Die Verteilung über das Jahr. */
function monatsSatz(fakten: Fakten): string {
  const { staerkster, schwaechster, monate } = fakten;

  const gleichStark = monate.filter(
    (monat) => monat.workdays === staerkster.workdays,
  );
  const gleichSchwach = monate.filter(
    (monat) => monat.workdays === schwaechster.workdays,
  );

  const stark =
    gleichStark.length === 1
      ? `Am meisten zu tun ist im ${staerkster.name} mit ${arbeitstagen(staerkster.workdays)}`
      : `Am meisten zu tun ist in ${aufzaehlung(gleichStark.map((m) => m.name))} mit je ${arbeitstagen(staerkster.workdays)}`;

  const schwach =
    gleichSchwach.length === 1
      ? `am wenigsten im ${schwaechster.name} mit ${schwaechster.workdays}`
      : `am wenigsten in ${aufzaehlung(gleichSchwach.map((m) => m.name))} mit je ${schwaechster.workdays}`;

  const spanne = staerkster.workdays - schwaechster.workdays;

  return `Über das Jahr verteilt sich das ungleich: ${stark}, ${schwach}. Zwischen dem stärksten und dem schwächsten Monat liegen ${spanne} ${plural(spanne, "Arbeitstag", "Arbeitstage")} – bei einem Monatsgehalt sind das ${spanne === 1 ? "ein Tag" : `${spanne} Tage`}, die im ${schwaechster.name} genauso bezahlt werden wie im ${staerkster.name}.`;
}

/** Werktage statt Arbeitstage – die zweite Zahl, nach der gesucht wird. */
function werktageSatz(fakten: Fakten, region: Region, year: number): string {
  const unterschied = fakten.werktage - fakten.jahr.workdays;

  return `Wer statt Arbeitstagen Werktage braucht – die Zählweise, nach der Fristen und Lieferzeiten laufen –, rechnet Montag bis Samstag: Das sind ${year} in ${region.name} ${fakten.werktage} Werktage, also ${unterschied} mehr.`;
}

/** Wo das Land im Vergleich steht. */
function vergleichSatz(fakten: Fakten, region: Region, year: number): string {
  const eigene = fakten.jahr.workdays;
  const teile: string[] = [];

  if (eigene === fakten.schwaechstesLand && eigene === fakten.bestesLand) {
    teile.push(
      `${year} haben ausnahmsweise alle 16 Bundesländer dieselbe Zahl an Arbeitstagen – die Feiertage, die sonst den Unterschied machen, fallen dieses Jahr sämtlich auf ein Wochenende.`,
    );
  } else if (eigene === fakten.schwaechstesLand) {
    teile.push(
      `Damit hat ${region.name} ${year} die wenigsten Arbeitstage aller Bundesländer; im Land mit den meisten sind es ${fakten.bestesLand}.`,
    );
  } else if (eigene === fakten.bestesLand) {
    teile.push(
      `Damit hat ${region.name} ${year} die meisten Arbeitstage aller Bundesländer – im Land mit den wenigsten sind es ${fakten.schwaechstesLand}.`,
    );
  } else {
    teile.push(
      `Bundesweit reicht die Spanne ${year} von ${fakten.schwaechstesLand} bis ${fakten.bestesLand} Arbeitstagen; ${region.name} liegt mit ${eigene} dazwischen.`,
    );
  }

  teile.push(
    fakten.zusaetzlich.length > 0
      ? `Den Unterschied zwischen den Ländern machen die Feiertage, die nur einzelne Länder kennen – in ${region.name} ${plural(fakten.zusaetzlich.length, "ist das", "sind das")}: ${aufzaehlung(fakten.zusaetzlich)}.`
      : `${region.name} hat keine Feiertage über die bundesweit geltenden hinaus und liegt deshalb strukturell am oberen Ende der Arbeitstage.`,
  );

  if (fakten.regional.length > 0) {
    teile.push(
      `${aufzaehlung(fakten.regional)} zählt hier nicht mit: Der Tag gilt in ${region.name} nur in einzelnen Gemeinden. Wenn er bei dir frei ist, schalte im Rechner die regionalen Feiertage dazu – dann sinkt die Zahl entsprechend.`,
    );
  }

  return teile.join(" ");
}

/* ---------------------------------------------------------------------------
 * Seiteninhalt
 * ------------------------------------------------------------------------- */

function about(fakten: Fakten, region: Region, year: number): string[] {
  return [
    `${herleitungSatz(fakten, region, year)} ${wochenendSatz(fakten, year)}`,
    `${monatsSatz(fakten)} ${
      fakten.ohneFeiertag.length > 0
        ? `Ganz ohne Feiertag ${plural(fakten.ohneFeiertag.length, "bleibt", "bleiben")} ${aufzaehlung(fakten.ohneFeiertag)}.`
        : "In jedem Monat des Jahres liegt mindestens ein Feiertag – das ist ungewöhnlich."
    } ${werktageSatz(fakten, region, year)}`,
    vergleichSatz(fakten, region, year),
  ];
}

function faq(fakten: Fakten, region: Region, year: number): FaqEntry[] {
  const { jahr } = fakten;

  return [
    {
      question: `Wie viele Arbeitstage hat ${region.name} ${year}?`,
      answer: `${region.name} hat ${year} ${arbeitstage(jahr.workdays)} bei einer Fünftagewoche von Montag bis Freitag. Gerechnet wird so: ${jahr.calendarDays} Kalendertage, davon ${jahr.scheduledDays} an einem Wochentag, minus ${feiertage(jahr.lostToHolidays)}, die auf einen Wochentag fallen. Für einen kürzeren Zeitraum – ein Quartal, einen Monat, einen Projektabschnitt – trage die Daten oben direkt ein.`,
    },
    {
      question: `Wie viele Werktage hat ${region.name} ${year}?`,
      answer: `In ${region.name} sind es ${year} ${fakten.werktage}, also ${fakten.werktage - jahr.workdays} mehr als die ${arbeitstage(jahr.workdays)} der Fünftagewoche: Werktage zählen Montag bis Samstag, Arbeitstage üblicherweise nur Montag bis Freitag. Der Unterschied ist kein Detail – gesetzliche Fristen, Kündigungsfristen und Lieferzusagen rechnen fast immer in Werktagen, Gehalts- und Projektkalkulationen in Arbeitstagen. Stell die Arbeitswoche im Rechner auf „Mo–Sa“, wenn du Werktage brauchst.`,
    },
    {
      question: `Welcher Monat hat ${year} in ${region.name} die meisten Arbeitstage?`,
      answer: `In ${region.name} der ${fakten.staerkster.name} mit ${arbeitstagen(fakten.staerkster.workdays)}, am wenigsten hat der ${fakten.schwaechster.name} mit ${fakten.schwaechster.workdays}. Im Durchschnitt sind es ${formatAmount(jahr.workdays / 12)} Arbeitstage pro Monat, und ganz ohne Feiertag ${plural(fakten.ohneFeiertag.length, "bleibt", "bleiben")} ${fakten.ohneFeiertag.length > 0 ? aufzaehlung(fakten.ohneFeiertag) : "kein Monat"}. Die vollständige Monatsübersicht steht im Rechner unter dem Ergebnis.`,
    },
    {
      question:
        fakten.amWochenende.length > 0
          ? `Welche Feiertage fallen ${year} in ${region.name} auf ein Wochenende?`
          : `Verpufft ${year} in ${region.name} ein Feiertag am Wochenende?`,
      answer:
        fakten.amWochenende.length > 0
          ? `${aufzaehlung(fakten.amWochenende.map(mitDatum))}. Diese Tage senken die Arbeitstage nicht, weil an ihnen ohnehin nicht gearbeitet worden wäre. Wären sie stattdessen auf einen Wochentag gefallen, hätte ${region.name} ${year} nur ${arbeitstage(jahr.workdays - fakten.amWochenende.length)}.`
          : `Nein, ${year} liegt jeder gesetzliche Feiertag in ${region.name} auf einem Wochentag. Alle ${feiertage(jahr.lostToHolidays)} senken die Arbeitstage also tatsächlich.`,
    },
  ];
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

      texte.push({
        slug: `${region.slug}-${year}`,
        title: `Arbeitstage ${year} in ${region.name}`,
        // Die Zahl steht schon in der Description: Wer bei Google die Frage
        // stellt, bekommt die Antwort im Suchergebnis.
        description: `${year} hat ${region.name} ${fakten.jahr.workdays} Arbeitstage bei einer Fünftagewoche und ${fakten.werktage} Werktage. Mit allen Feiertagen, Monatsübersicht und beliebigem Zeitraum.`,
        heading: `Arbeitstage ${year} in ${region.name}`,
        listLabel: region.name,
        listGroup: String(year),
        params: { bl: region.code, jahr: year },
        about: about(fakten, region, year),
        faq: faq(fakten, region, year),
      });
    }
  }

  return texte;
}

/**
 * Je Basisjahr einmal gerechnet. `getVariants()` läuft pro Build mehrfach –
 * Sitemap, `generateStaticParams()`, jede Seite, das OG-Skript –, und je Seite
 * werden 16 Bundesländer für den Vergleich mitgerechnet.
 */
let cache: { baseYear: number; texte: VariantContent[] } | null = null;

export function variantenTexte(): VariantContent[] {
  const baseYear = new Date().getUTCFullYear();
  if (cache?.baseYear !== baseYear) {
    cache = { baseYear, texte: baueTexte(baseYear) };
  }
  return cache.texte;
}
