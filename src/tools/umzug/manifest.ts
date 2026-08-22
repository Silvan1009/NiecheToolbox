import { Boxes } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { umzugAffiliate } from "./affiliate";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Kartons kauft man einmal zu wenig und ärgert sich, oder einmal zu viel und schleppt sie leer mit. Der Rechner schätzt aus Wohnfläche, Personenzahl und einer ehrlichen Selbsteinschätzung, wie viele es werden – getrennt nach Standardkartons, Bücherkartons und Kleiderboxen, weil die drei völlig unterschiedlich befüllt werden.",
  "Bücher gehören in kleine Kartons. Ein Standardkarton voller Bücher wiegt schnell 40 Kilo und reißt beim Tragen aus; ein Bücherkarton mit rund 55 × 35 × 30 cm bleibt handhabbar. Als Faustregel füllt ein laufender Regalmeter genau einen Bücherkarton.",
  "Für die Fahrzeugwahl zählt nicht die Kartonzahl, sondern das Gesamtvolumen inklusive Möbel – und die machen den größten Teil aus. Ein durchschnittlicher Haushalt kommt auf etwa 0,25 m³ je Quadratmeter Wohnfläche. Eine 80-m²-Wohnung landet damit bei rund 20 m³, also mehr als ein großer Transporter in einer Fahrt schafft. Über die Zahl der Fahrten lässt sich das Fahrzeug kleiner rechnen.",
  "Alle Zahlen hier sind Erfahrungswerte, keine Messung. Wie viel jemand besitzt, lässt sich aus Quadratmetern nur annähern. Die Annahmen stehen offen unter dem Ergebnis, damit du sie gegen deine Wohnung halten kannst.",
];

const sections: ContentSection[] = [
  {
    heading: "Bücher brauchen eigene Kartons",
    blocks: [
      {
        type: "p",
        text: "Ein Bücherkarton mit 55 × 35 × 30 cm fasst rechnerisch rund 58 Liter – deutlich weniger als ein Standardkarton, aber genau deshalb tragbar, wenn er randvoll mit Büchern beladen ist. Wer noch Platz nach oben hat, füllt ihn besser mit leichteren Gegenständen wie Kissen oder Textilien auf, statt eine zweite Lage Bücher draufzulegen.",
      },
      {
        type: "note",
        text: "Als Faustregel füllt ein laufender Regalmeter genau einen Bücherkarton.",
      },
    ],
  },
  {
    heading: "Volumen statt Kartonzahl",
    blocks: [
      {
        type: "p",
        text: "Zur Einordnung: 20 Kubikmeter entsprechen etwa 20.000 Litern – umgerechnet auf einen 60-Liter-Standardkarton wären das rein rechnerisch mehr als 300 Kartons voll, obwohl ein großer Teil davon tatsächlich Möbel und keine Kartons sind. Genau deshalb zählt für die Fahrzeuggröße das Gesamtvolumen und nicht die im Rechner ausgewiesene Kartonzahl allein.",
      },
      {
        type: "table",
        caption: "Geschätztes Umzugsvolumen (0,25 m³ je m² Wohnfläche)",
        head: ["Wohnfläche", "Volumen"],
        rows: [
          ["40 m²", "10 m³"],
          ["60 m²", "15 m³"],
          ["80 m²", "20 m³"],
          ["120 m²", "30 m³"],
        ],
      },
      {
        type: "note",
        text: "Eine 80-m²-Wohnung landet damit bei rund 20 m³, also mehr als ein großer Transporter in einer Fahrt schafft. Über die Zahl der Fahrten lässt sich das Fahrzeug kleiner rechnen.",
      },
    ],
  },
  {
    heading: "Grenzen des Modells",
    blocks: [
      {
        type: "p",
        text: "Systematisch unterschätzt wird der Umzugsumfang bei Haushalten mit viel Ausrüstung außerhalb der Wohnfläche selbst – Werkstattinhalt, Fahrräder, Sportgeräte oder ein voller Keller korrelieren kaum mit den Quadratmetern der Wohnung. Überschätzt wird er dagegen häufig bei jungen, bewusst minimalistisch eingerichteten Haushalten. Die Annahmen stehen offen unter dem Ergebnis, damit du sie gegen deine Wohnung halten kannst.",
      },
    ],
  },
  {
    heading: "Wann sich Umzugskosten von der Steuer absetzen lassen",
    blocks: [
      {
        type: "p",
        text: "Ist der Umzug beruflich veranlasst – etwa durch einen neuen Arbeitsort, einen Jobwechsel oder eine deutliche Verkürzung des Arbeitswegs –, zählen die Kosten als Werbungskosten und mindern das zu versteuernde Einkommen. Nachgewiesene Ausgaben wie Spedition, Fahrtkosten oder eine doppelte Mietzahlung im Übergang lassen sich in tatsächlicher Höhe absetzen.",
      },
      {
        type: "note",
        text: "Für Kosten, die sich schlecht einzeln belegen lassen – etwa Trinkgelder für Helfer oder Kleinigkeiten –, erkennt das Finanzamt zusätzlich eine jährlich angepasste Umzugskostenpauschale ohne Einzelnachweis an. Ein rein privater Umzug, etwa in eine größere Wohnung ohne beruflichen Anlass, zählt dagegen nicht als Werbungskosten.",
      },
    ],
  },
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie viele Umzugskartons brauche ich für 80 Quadratmeter?",
    answer:
      "Bei durchschnittlicher Einrichtung sind es rund 50 Standardkartons, dazu Bücherkartons je Regalmeter und Kleiderboxen für die hängende Garderobe. Umzugsunternehmen kalkulieren für eine Dreizimmerwohnung mit 40 bis 60 Kartons – wer viel besitzt, landet darüber. Kaufe eher fünf zu viel: Leere Kartons lassen sich zurückgeben oder weiterverkaufen, ein zweiter Weg zum Baumarkt am Umzugstag kostet mehr.",
  },
  {
    question: "Wie viel Volumen hat mein Umzug in Kubikmetern?",
    answer:
      "Rechne mit etwa 0,2 bis 0,3 m³ je Quadratmeter Wohnfläche, inklusive Möbel. Eine 50-m²-Wohnung liegt damit bei 10 bis 15 m³, eine 100-m²-Wohnung bei 20 bis 30 m³. Kommen Keller, Dachboden oder Garage mit, kommt rund ein Sechstel dazu. Diese Zahl brauchst du für die Anfrage bei einer Umzugsfirma und für die Fahrzeugwahl.",
  },
  {
    question: "Welchen Transporter brauche ich?",
    answer:
      "Ein kurzer 3,5-Tonner fasst rund 8 m³, ein langer 12 m³, einer mit Hochdach bis 20 m³. Darüber wird es ein 7,5-Tonner mit 40 m³ – dafür brauchst du allerdings einen Führerschein der Klasse C1, den nur hat, wer ihn vor 1999 gemacht hat. Alternativ mehrere Fahrten mit dem großen Transporter: Stell die Zahl der Fahrten ein, dann rechnet der Rechner die Klasse entsprechend kleiner.",
  },
  {
    question: "Warum getrennte Kartons für Bücher und Kleidung?",
    answer:
      "Wegen Gewicht und Form. Bücher sind so schwer, dass ein Standardkarton unhandlich und der Boden zur Schwachstelle wird – deshalb kleinere Bücherkartons. Kleidung auf Bügeln wiegt fast nichts, braucht aber Höhe: Eine Kleiderbox mit Stange ist etwa 1,35 m hoch und nimmt rund 0,6 laufende Meter Garderobe auf. Sie spart das Bügeln danach, passt aber nicht durch jedes Treppenhaus.",
  },
  {
    question: "Wie lange dauert das Packen?",
    answer:
      "Der Rechner setzt zwölf Minuten je Karton an, Suchen, Einwickeln und Beschriften eingerechnet. Für 50 Kartons sind das etwa zehn Stunden – realistisch also mehrere Abende oder ein Wochenende. Küche und Keller dauern überproportional lange, Kleiderschränke gehen schnell.",
  },
];

export const umzug: ToolManifest = {
  slug: "umzug",
  name: "Umzugs-Rechner",
  tagline:
    "Wie viele Kartons, wie viel Volumen, welcher Transporter – geschätzt aus Wohnfläche und Haushalt.",
  category: "wohnen",
  icon: Boxes,
  status: "live",
  keywords: [
    "umzugskartons berechnen",
    "wie viele umzugskartons",
    "umzug volumen berechnen",
    "transporter größe umzug",
    "umzugsvolumen m3",
    "kubikmeter umzug",
    "umzug planen",
  ],

  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  sections,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: umzugAffiliate,
  },
};
