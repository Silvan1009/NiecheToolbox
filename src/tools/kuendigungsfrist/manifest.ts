import { FileClock } from "lucide-react";
import { addDays, todayIso } from "@/lib/date";
import type { ToolManifest } from "@/tools/types";
import { kuendigungsfristAffiliate } from "./affiliate";
import Component from "./Component";

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

  Component,

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
      question: "Gilt für mich die längere Frist des Arbeitgebers auch, wenn ich selbst kündige?",
      answer:
        "Von Gesetzes wegen nicht: Die gestaffelten Fristen nach Betriebszugehörigkeit gelten nur für Kündigungen durch den Arbeitgeber. Für Arbeitnehmer bleibt es bei vier Wochen zum 15. oder zum Monatsende. Der Arbeitsvertrag kann aber eine längere Frist vereinbaren, die dann für beide Seiten gleich lang sein muss. Steht im Vertrag mehr, gilt der Vertrag.",
    },
    {
      question: "Kann mein Mietvertrag eine längere Kündigungsfrist vorschreiben?",
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
