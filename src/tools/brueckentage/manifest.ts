import { CalendarRange } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { brueckentageAffiliate } from "./affiliate";
import { buildUebersichtSection, brueckentageFaq } from "./uebersicht";

const about: string[] = [
  "Ein Brückentag ist ein einzelner Arbeitstag zwischen einem Feiertag und dem Wochenende. Wer ihn als Urlaubstag nimmt, verbindet beides zu einer langen freien Spanne. Aus einem eingesetzten Urlaubstag werden so schnell vier freie Tage – manchmal mehr.",
  "Der Rechner kennt alle gesetzlichen Feiertage der 16 Bundesländer und berechnet sie selbst: Ostern kommt aus der Gauß-Osterformel, alle beweglichen Feiertage hängen daran. Für jeden Feiertag prüft er, wie viele freie Tage entstehen, wenn du die umliegenden Arbeitstage frei nimmst, und sortiert die Vorschläge nach dem Verhältnis freie Tage pro Urlaubstag.",
  "Weil die Feiertage je Bundesland unterschiedlich sind, lohnt sich der Blick auf das eigene: Bayern und das Saarland haben die meisten, Berlin, Bremen, Hamburg, Hessen, Niedersachsen und Schleswig-Holstein die wenigsten. Feiertage, die auf ein Wochenende fallen, sind für alle verschenkt – der Rechner zeigt dir, wie viele das im gewählten Jahr sind.",
];

const sections: ContentSection[] = [
  {
    heading: "Wie die Vorschläge sortiert werden",
    blocks: [
      {
        type: "p",
        text: "Maßgeblich ist nicht die absolute Zahl freier Tage, sondern das Verhältnis zum eingesetzten Urlaub: Ein Vorschlag mit vier freien Tagen für einen Urlaubstag steht deshalb über einem mit sechs freien Tagen für zwei Urlaubstagen, obwohl der zweite in Summe mehr freie Tage bringt. Diese Rangfolge ändert sich mit jedem Jahr neu, weil sich verschiebt, auf welchen Wochentag ein Feiertag fällt.",
      },
      {
        type: "note",
        text: "Ein Feiertag, der auf einen Dienstag oder Donnerstag fällt, bringt bei nur einem Urlaubstag schon ein verlängertes Wochenende. Liegt er auf einem Mittwoch, braucht es zwei Urlaubstage für dieselbe lange Spanne – der Rechner zeigt beide Fälle mit ihrem jeweiligen Verhältnis.",
      },
    ],
  },
  {
    heading: "Welche Feiertage nur in bestimmten Bundesländern gelten",
    blocks: [
      {
        type: "p",
        text: "Neun Feiertage gelten bundesweit gleich: Neujahr, Karfreitag, Ostermontag, Tag der Arbeit, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit sowie beide Weihnachtstage. Alle übrigen sind Ländersache – genau diese Unterschiede entscheiden, wie viele Brückentage ein Bundesland in einem bestimmten Jahr hergibt.",
      },
      {
        type: "table",
        caption: "Feiertage, die nicht bundesweit gelten",
        head: ["Feiertag", "Gilt in"],
        rows: [
          [
            "Heilige Drei Könige (6. Jan.)",
            "Baden-Württemberg, Bayern, Sachsen-Anhalt",
          ],
          [
            "Internationaler Frauentag (8. März)",
            "Berlin, Mecklenburg-Vorpommern",
          ],
          [
            "Fronleichnam",
            "Baden-Württemberg, Bayern, Hessen, Nordrhein-Westfalen, Rheinland-Pfalz, Saarland – regional auch Sachsen und Thüringen",
          ],
          ["Mariä Himmelfahrt (15. Aug.)", "Saarland – regional auch Bayern"],
          ["Weltkindertag (20. Sep.)", "Thüringen"],
          [
            "Reformationstag (31. Okt.)",
            "Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen",
          ],
          [
            "Allerheiligen (1. Nov.)",
            "Baden-Württemberg, Bayern, Nordrhein-Westfalen, Rheinland-Pfalz, Saarland",
          ],
          ["Buß- und Bettag", "Sachsen"],
        ],
      },
      {
        type: "note",
        text: "„Regional“ bedeutet: gesetzlicher Feiertag nur in einzelnen Gemeinden, meist mit überwiegend katholischer Bevölkerung – nicht im ganzen Bundesland. Der Rechner zählt diese Tage erst mit, wenn du sie ausdrücklich aktivierst.",
      },
    ],
  },
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Was ist ein Brückentag genau?",
    answer:
      "Ein Arbeitstag, der zwischen einem Feiertag und dem Wochenende liegt. Fällt ein Feiertag zum Beispiel auf einen Donnerstag, ist der Freitag danach ein Brückentag: Ein Urlaubstag verbindet Feiertag und Wochenende zu vier freien Tagen am Stück.",
  },
  {
    question: "Warum unterscheiden sich die Ergebnisse je Bundesland?",
    answer:
      "Außer Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit und den beiden Weihnachtstagen sind alle Feiertage Ländersache. Fronleichnam gilt zum Beispiel in Bayern, aber nicht in Berlin; der Buß- und Bettag nur in Sachsen.",
  },
  {
    question:
      "Sind Mariä Himmelfahrt und Fronleichnam überall im Land Feiertage?",
    answer:
      "Nicht überall. Mariä Himmelfahrt ist in Bayern nur in Gemeinden mit überwiegend katholischer Bevölkerung frei – das sind die meisten, aber nicht alle. Fronleichnam gilt in Sachsen und Thüringen ebenfalls nur in einzelnen Gemeinden. Diese Tage sind im Rechner als „nur regional“ gekennzeichnet und zählen erst mit, wenn du sie ausdrücklich aktivierst.",
  },
  {
    question: "Wie berechnet der Rechner die Feiertage?",
    answer:
      "Vollständig rechnerisch, ohne externe Datenquelle. Der Ostersonntag ergibt sich aus der Gauß-Osterformel, Karfreitag, Christi Himmelfahrt, Pfingsten und Fronleichnam sind fixe Abstände dazu. Der Buß- und Bettag ist der letzte Mittwoch vor dem 23. November. Alle festen Feiertage stehen mit ihrer Bundesland-Zuordnung in einer Tabelle. Damit stimmen die Termine auch für weit entfernte Jahre.",
  },
  {
    question: "Zählt der Rechner meinen Urlaubsanspruch mit?",
    answer:
      "Nein. Du gibst an, wie viele Urlaubstage du fürs Brückentage-Nutzen einsetzen willst; der Rest deines Urlaubs bleibt unberührt. Der Jahresplan wählt daraus die Vorschläge mit dem besten Verhältnis, die sich zeitlich nicht überschneiden.",
  },
  {
    question: "Kann ich das Ergebnis teilen?",
    answer:
      "Ja. Bundesland, Jahr und Budget stehen in der Adresszeile – wer den Link öffnet, sieht genau dein Ergebnis. Der Button „Link kopieren“ unter dem Ergebnis übernimmt das für dich.",
  },
];

// Einmal pro Build berechnet, nicht pro Anfrage – dieselbe Überlegung wie
// beim vormaligen Varianten-Cache: calculateBrueckentage() läuft für 16
// Länder × 3 Jahre, das soll nicht mehrfach passieren.
const baseYear = new Date().getUTCFullYear();

export const brueckentage: ToolManifest = {
  slug: "brueckentage",
  name: "Brückentage-Optimierer",
  tagline:
    "Finde die Tage, an denen ein Urlaubstag drei geschenkte dazu bringt – für dein Bundesland.",
  seoTitle: "Brückentage-Rechner: Urlaub clever planen je Bundesland",
  metaDescription:
    "Brückentage für dein Bundesland berechnen: Der Rechner zeigt, an welchen Tagen ein Urlaubstag die längste freie Spanne bringt – mit Jahresplan.",
  category: "zeit",
  icon: CalendarRange,
  status: "live",
  keywords: [
    "brückentage",
    "brückentage 2026",
    "feiertage",
    "urlaub planen",
    "urlaubstage",
    "lange wochenenden",
    "bundesland",
    "feiertagskalender",
  ],

  getDefaultParams: () => ({ basisJahr: baseYear }),

  about,
  sections: [...sections, ...buildUebersichtSection(baseYear)],
  faq: [...sharedFaq, ...brueckentageFaq],

  monetization: {
    adDensity: "low",
    affiliate: brueckentageAffiliate,
  },
};
