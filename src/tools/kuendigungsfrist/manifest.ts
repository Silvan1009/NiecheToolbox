import { FileClock } from "lucide-react";
import { addDays, todayIso } from "@/lib/date";
import type { ContentSection, ToolManifest } from "@/tools/types";
import { kuendigungsfristAffiliate } from "./affiliate";

const sections: ContentSection[] = [
  {
    heading: "Kündigungsfristen des Arbeitgebers nach Betriebszugehörigkeit",
    blocks: [
      {
        type: "p",
        text: "Kündigt der Arbeitgeber, verlängert sich die gesetzliche Grundfrist von vier Wochen stufenweise nach § 622 Abs. 2 BGB. Für Arbeitnehmer selbst bleibt es unabhängig von der Betriebszugehörigkeit bei vier Wochen, sofern der Vertrag nichts anderes regelt.",
      },
      {
        type: "table",
        caption: "Kündigungsfrist des Arbeitgebers, jeweils zum Monatsende",
        head: ["Betriebszugehörigkeit", "Frist"],
        rows: [
          ["ab 2 Jahren", "1 Monat"],
          ["ab 5 Jahren", "2 Monate"],
          ["ab 8 Jahren", "3 Monate"],
          ["ab 10 Jahren", "4 Monate"],
          ["ab 12 Jahren", "5 Monate"],
          ["ab 15 Jahren", "6 Monate"],
          ["ab 20 Jahren", "7 Monate"],
        ],
      },
    ],
  },
  {
    heading: "Kündigungsfristen des Vermieters nach Wohndauer",
    blocks: [
      {
        type: "p",
        text: "Bei Wohnraum gilt die Dreimonatsfrist nur für den Mieter als Höchstgrenze. Für den Vermieter verlängert sie sich mit der Dauer des Mietverhältnisses – ein Ausgleich dafür, dass er im Gegensatz zum Mieter überhaupt nur bei berechtigtem Interesse kündigen darf, etwa Eigenbedarf.",
      },
      {
        type: "table",
        caption: "Kündigungsfrist des Vermieters nach Wohndauer (§ 573c BGB)",
        head: ["Wohndauer", "Frist"],
        rows: [
          ["bis 5 Jahre", "3 Monate"],
          ["ab 5 Jahren", "6 Monate"],
          ["ab 8 Jahren", "9 Monate"],
        ],
      },
    ],
  },
  {
    heading: "Sonderfall Probezeit",
    blocks: [
      {
        type: "p",
        text: "Während einer vereinbarten Probezeit gilt eine eigene, kürzere Frist: zwei Wochen ohne festen Endtermin, weder zum 15. noch zum Monatsende (§ 622 Abs. 3 BGB). Das gilt für beide Seiten gleichermaßen und höchstens für die ersten sechs Monate des Arbeitsverhältnisses – danach greift automatisch die reguläre Grundfrist von vier Wochen.",
      },
      {
        type: "note",
        text: "Eine Probezeit muss ausdrücklich im Arbeitsvertrag vereinbart sein; ohne diese Vereinbarung gilt von Anfang an die reguläre Frist, auch in den ersten Monaten. Für Auszubildende gilt eine eigene Regelung: Während der Probezeit im Ausbildungsverhältnis kann fristlos gekündigt werden, danach nur noch aus wichtigem Grund oder mit vierwöchiger Frist bei einer Aufgabe des Ausbildungsziels.",
      },
    ],
  },
];

export const kuendigungsfrist: ToolManifest = {
  slug: "kuendigungsfrist",
  name: "Kündigungsfrist-Rechner",
  tagline:
    "Wohnung oder Job kündigen: wann der Vertrag endet – und bis wann die Kündigung zugehen muss.",
  category: "wohnen",
  icon: FileClock,
  status: "beta",
  keywords: [
    "kündigungsfrist berechnen",
    "wohnung kündigen frist",
    "arbeitsvertrag kündigen frist",
    "kündigung mietvertrag",
    "dritter werktag",
    "622 bgb",
    "573c bgb",
    "probezeit kündigung",
  ],

  // Das Standarddatum ist "heute" – das darf erst auf dem Server entstehen,
  // sonst weicht der erste Client-Render vom vorgerenderten HTML ab.
  getDefaultParams: () => {
    const today = todayIso();
    return {
      zugang: today,
      ende: addDays(today, 120),
      beginn: addDays(today, -1095),
    };
  },

  sections,

  about: [
    "Zwei Fragen, dieselbe Rechnung: „Ich kündige heute – wann bin ich raus?“ und „Ich will zum 30. Juni raus – bis wann muss die Kündigung da sein?“ Der Rechner beantwortet beide Richtungen, für Wohnung und Arbeitsvertrag, und zeigt den Rechenweg dazu.",
    "Bei der Wohnung entscheidet die Karenzzeit: Geht die Kündigung bis zum dritten Werktag eines Monats zu, zählt dieser Monat schon mit, und es sind drei Monate bis zum Monatsende. Einen Tag später verschiebt sich alles um einen ganzen Monat. Welche Tage Werktage sind, hängt vom Bundesland ab – deshalb fragt der Rechner danach.",
    "Beim Arbeitsvertrag lautet die Grundfrist vier Wochen zum 15. oder zum Monatsende. Vier Wochen sind nicht dasselbe wie ein Monat, und der Unterschied entscheidet regelmäßig darüber, ob es der 15. oder erst der Monatsletzte wird. Kündigt der Arbeitgeber, verlängert sich die Frist mit der Betriebszugehörigkeit stufenweise auf bis zu sieben Monate.",
    "Maßgeblich ist immer der Zugang beim Empfänger, nicht das Absenden. Ein Brief, der am dritten Werktag erst in den Briefkasten geworfen wird, ist rechtzeitig; einer, der an dem Tag erst abgeschickt wird, meist nicht.",
  ],

  faq: [
    {
      question: "Zählt das Datum des Briefs oder der Tag, an dem er ankommt?",
      answer:
        "Es zählt der Zugang beim Empfänger. Eine Kündigung ist zugegangen, wenn sie so in den Machtbereich des Empfängers gelangt ist, dass er unter normalen Umständen davon Kenntnis nehmen kann – bei einem Briefkasten also mit der Leerung am selben oder nächsten Tag. Deshalb fragt der Rechner nach dem Zugang und nicht nach dem Absendedatum. Wer sicher gehen will, wirft persönlich ein und nimmt einen Zeugen mit.",
    },
    {
      question: "Was ist der „dritte Werktag“ und zählt der Samstag mit?",
      answer:
        "Werktage sind Montag bis Samstag ohne gesetzliche Feiertage. Für die Kündigung von Wohnraum zählt der Samstag nach überwiegender Ansicht mit – anders als bei der Mietzahlung, für die der Bundesgerichtshof ihn ausgenommen hat. Ganz eindeutig ist die Frage nicht. Der Rechner rechnet mit Samstag als Werktag; wer den Streit vermeiden will, stellt ein bis zwei Tage früher zu.",
    },
    {
      question: "Warum sind vier Wochen nicht dasselbe wie ein Monat?",
      answer:
        "Vier Wochen sind immer genau 28 Tage, ein Monat je nach Kalender 28 bis 31. Bei einer Kündigung am 5. März laufen die vier Wochen am 2. April ab, und der nächste zulässige Endtermin ist der 15. April. Wäre die Frist ein Monat zum Monatsende, wäre es der 30. April geworden.",
    },
    {
      question:
        "Gilt für mich die längere Frist des Arbeitgebers auch, wenn ich selbst kündige?",
      answer:
        "Von Gesetzes wegen nicht: Die gestaffelten Fristen nach Betriebszugehörigkeit gelten nur für Kündigungen durch den Arbeitgeber. Für Arbeitnehmer bleibt es bei vier Wochen zum 15. oder zum Monatsende. Der Arbeitsvertrag kann aber eine längere Frist vereinbaren, die dann für beide Seiten gleich lang sein muss. Steht im Vertrag mehr, gilt der Vertrag.",
    },
    {
      question:
        "Kann mein Mietvertrag eine längere Kündigungsfrist vorschreiben?",
      answer:
        "Für Mieter nicht. Die drei Monate sind eine Höchstfrist, längere Klauseln sind unwirksam. Etwas anderes gilt nur bei einem echten Zeitmietvertrag oder einem vereinbarten Kündigungsverzicht. Für den Vermieter verlängert sich die Frist dagegen mit der Wohndauer auf sechs Monate nach fünf und neun Monate nach acht Jahren.",
    },
    {
      question: "Ersetzt der Rechner eine Rechtsberatung?",
      answer:
        "Nein. Er rechnet die gesetzlichen Regelfristen aus und zeigt den Rechenweg, damit du das Ergebnis nachvollziehen kannst. Tarifverträge, Betriebsvereinbarungen, Zeitmietverträge, Sonderkündigungsrechte und individuelle Vertragsklauseln bildet er nicht ab. Wenn viel davon abhängt, lass die Frist von einer Beratungsstelle oder einem Anwalt prüfen.",
    },
  ],

  monetization: {
    adDensity: "low",
    affiliate: kuendigungsfristAffiliate,
  },
};
