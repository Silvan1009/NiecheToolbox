import { CalendarCheck } from "lucide-react";
import { todayIso } from "@/lib/date";
import { regions } from "@/tools/brueckentage/logic";
import type { ToolManifest, ToolVariant } from "@/tools/types";
import Component from "./Component";
import { calculateWorkdays, weekPresets, yearRange } from "./logic";

/** Für wie viele Jahre programmatische Landing-Pages entstehen. */
const VARIANT_YEARS = 2;

function buildVariants(): ToolVariant[] {
  const baseYear = new Date().getUTCFullYear();
  const variants: ToolVariant[] = [];

  for (let offset = 0; offset < VARIANT_YEARS; offset += 1) {
    const year = baseYear + offset;
    for (const region of regions) {
      // Die Zahl steht schon in der Description: Wer bei Google die Frage
      // stellt, bekommt die Antwort im Suchergebnis.
      const { workdays } = calculateWorkdays({
        ...yearRange(year),
        region: region.code,
        workdays: weekPresets["5"].days,
        includePartial: false,
        daysOff: 0,
      });

      variants.push({
        slug: `${region.slug}-${year}`,
        title: `Arbeitstage ${year} in ${region.name}`,
        description: `${year} hat ${region.name} ${workdays} Arbeitstage bei einer Fünftagewoche. Mit allen Feiertagen, Monatsübersicht und beliebigem Zeitraum – kostenlos berechnet.`,
        heading: `Arbeitstage ${year} in ${region.name}`,
        params: { bl: region.code, jahr: year },
      });
    }
  }

  return variants;
}

export const arbeitstage: ToolManifest = {
  slug: "arbeitstage",
  name: "Arbeitstage-Rechner",
  tagline:
    "Wie viele Arbeitstage liegen in einem Zeitraum? Mit den Feiertagen deines Bundeslandes.",
  category: "zeit",
  icon: CalendarCheck,
  status: "live",
  keywords: [
    "arbeitstage berechnen",
    "arbeitstage 2026",
    "wie viele arbeitstage",
    "werktage berechnen",
    "arbeitstage pro monat",
    "feiertage bundesland",
    "arbeitstage rechner",
  ],

  Component,
  getVariants: buildVariants,

  // Das Standardjahr ist das laufende – erst auf dem Server bestimmt, damit
  // der erste Client-Render zum vorgerenderten HTML passt.
  getDefaultParams: () => ({ jahr: Number(todayIso().slice(0, 4)) }),

  about: [
    "Wie viele Tage muss ich eigentlich arbeiten? Die Frage stellt sich beim Kalkulieren eines Stundensatzes, beim Planen eines Projekts, beim Umrechnen eines Monatsgehalts auf den Tag – und jedes Mal steht dieselbe Rechnung an. Zeitraum eintragen, Bundesland wählen, fertig.",
    "Entscheidend ist dabei, dass nur Feiertage zählen, die auf einen Arbeitstag fallen. Der 3. Oktober 2026 ist ein Samstag: Er ist ein Feiertag, kostet aber niemanden mit Fünftagewoche einen Arbeitstag. Der Rechner trennt beides und zeigt, wie viele Feiertage im Zeitraum verpuffen.",
    "Weil die Feiertage Ländersache sind, unterscheiden sich die Arbeitstage je Bundesland um bis zu drei Tage im Jahr. Bayern und das Saarland haben die meisten Feiertage, Berlin, Bremen, Hamburg, Hessen, Niedersachsen und Schleswig-Holstein die wenigsten. Für einen Zeitraum, der über den Jahreswechsel läuft, zieht der Rechner die Feiertage beider Jahre heran.",
    "Die Feiertage berechnet er selbst: Ostern kommt aus der Gauß-Osterformel, alle beweglichen Feiertage hängen daran. Damit stimmen die Termine auch für Jahre, die weit in der Zukunft liegen.",
  ],

  faq: [
    {
      question: "Wie viele Arbeitstage hat das Jahr 2026?",
      answer:
        "Bei einer Fünftagewoche liegen 2026 insgesamt 261 Wochentage von Montag bis Freitag im Kalender. Davon gehen die Feiertage ab, die auf einen Wochentag fallen – je Bundesland zwischen acht und elf. In Nordrhein-Westfalen bleiben 253 Arbeitstage, in Bayern 252. Wähle dein Bundesland, dann steht die genaue Zahl oben.",
    },
    {
      question: "Zählt der Rechner Feiertage am Wochenende ab?",
      answer:
        "Nein, und genau das ist der Punkt. Ein Feiertag reduziert die Arbeitstage nur, wenn an diesem Wochentag ohnehin gearbeitet würde. Fällt er auf einen Samstag oder Sonntag, taucht er in der Liste auf, ist aber als „fällt auf einen freien Tag“ markiert und bleibt ohne Wirkung. Bei einer Sechstagewoche kehrt sich das für Samstage um.",
    },
    {
      question: "Was ist der Unterschied zwischen Werktagen und Arbeitstagen?",
      answer:
        "Werktage sind Montag bis Samstag ohne Feiertage – der Begriff kommt aus Gesetzen und Fristen. Arbeitstage sind die Tage, an denen du tatsächlich arbeitest, meist Montag bis Freitag. Für Fristberechnungen brauchst du Werktage, für Kalkulationen Arbeitstage. Stell die Arbeitswoche auf „Mo–Sa“, wenn du Werktage zählen willst.",
    },
    {
      question: "Warum sind regionale Feiertage nicht automatisch dabei?",
      answer:
        "Weil sie nicht im ganzen Bundesland gelten. Mariä Himmelfahrt ist in Bayern nur in überwiegend katholischen Gemeinden frei, Fronleichnam in Sachsen und Thüringen nur in einzelnen. Für die meisten Menschen im Land wäre der Abzug falsch. Wenn der Tag bei dir frei ist, aktiviere den Schalter – dann rechnet der Rechner ihn mit.",
    },
    {
      question: "Kann ich Urlaubstage abziehen?",
      answer:
        "Ja. Trage sie unter „Urlaub oder Krankheit“ ein, dann zeigt der Rechner neben den Arbeitstagen auch die Zahl, die davon übrig bleibt. Praktisch, um zu prüfen, wie viele Tage du in einem Projektzeitraum wirklich zur Verfügung hast.",
    },
  ],

  monetization: {
    adDensity: "low",
  },
};
