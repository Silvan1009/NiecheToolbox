import { CalendarCheck } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Wie viele Tage muss ich eigentlich arbeiten? Die Frage stellt sich beim Kalkulieren eines Stundensatzes, beim Planen eines Projekts, beim Umrechnen eines Monatsgehalts auf den Tag – und jedes Mal steht dieselbe Rechnung an. Zeitraum eintragen, Bundesland wählen, fertig.",
  "Entscheidend ist dabei, dass nur Feiertage zählen, die auf einen Arbeitstag fallen. Fällt der Tag der Deutschen Einheit auf einen Samstag, bleibt er ein Feiertag – kostet aber niemanden mit Fünftagewoche einen Arbeitstag. Der Rechner trennt beides und zeigt, wie viele Feiertage im Zeitraum verpuffen.",
  "Weil die Feiertage Ländersache sind, unterscheiden sich die Arbeitstage je Bundesland um bis zu drei Tage im Jahr. Bayern und das Saarland haben die meisten Feiertage, Berlin, Bremen, Hamburg, Hessen, Niedersachsen und Schleswig-Holstein die wenigsten. Für einen Zeitraum, der über den Jahreswechsel läuft, zieht der Rechner die Feiertage beider Jahre heran.",
  "Die Feiertage berechnet er selbst: Ostern kommt aus der Gauß-Osterformel, alle beweglichen Feiertage hängen daran. Damit stimmen die Termine auch für Jahre, die weit in der Zukunft liegen.",
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie viele Arbeitstage hat ein Jahr?",
    answer:
      "Ein Kalenderjahr enthält 260 oder 261 Wochentage von Montag bis Freitag – je nachdem, auf welchen Wochentag der 1. Januar fällt und ob es ein Schaltjahr ist. Davon gehen die Feiertage ab, die auf einen Wochentag fallen: je Bundesland und Jahr zwischen sechs und elf. Es bleiben also grob 250 bis 254 Arbeitstage. Wähle Jahr und Bundesland, dann steht die genaue Zahl oben.",
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
];

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

  getVariants: () => buildVariants(variantenTexte(), about, sharedFaq),

  // Das Standardjahr ist das laufende – erst auf dem Server bestimmt, damit
  // der erste Client-Render zum vorgerenderten HTML passt.
  getDefaultParams: () => ({ jahr: Number(todayIso().slice(0, 4)) }),

  about,
  faq: sharedFaq,

  monetization: {
    adDensity: "low",
  },
};
