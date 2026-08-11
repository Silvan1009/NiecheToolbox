import { Flame } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";

const about: string[] = [
  "Der Kalorienbedarf setzt sich aus zwei Größen zusammen: dem Grundumsatz, den der Körper allein für Atmung, Kreislauf und Zellstoffwechsel in völliger Ruhe braucht, und dem Aktivitätsanteil, der aus Bewegung und Alltag dazukommt. Der Grundumsatz wird hier nach der Mifflin-St-Jeor-Formel berechnet – aus Gewicht, Größe, Alter und Geschlecht, dem Faktor, der bei gleichem Gewicht und gleicher Größe die Konstante ändert.",
  "Mifflin-St Jeor gilt heute als treffsicherer als die ältere Harris-Benedict-Formel aus den 1920er-Jahren und wird von der US-amerikanischen Fachgesellschaft für Ernährung empfohlen. Beide Formeln sind für Erwachsene entwickelt und validiert – bei Kindern, in der Schwangerschaft oder Stillzeit gelten andere Bedarfswerte.",
  "Der Aktivitätsfaktor (PAL, Physical Activity Level) übersetzt den Alltag in eine Zahl zwischen 1,2 für überwiegend sitzende Tätigkeit und 1,9 für Leistungssport oder körperlich fordernde Berufe. Grundumsatz mal PAL ergibt den Gesamtumsatz – die Kalorienzahl, die nötig ist, um das Gewicht zu halten.",
  "Der Rechner endet bewusst beim Gesamtumsatz. Eine Empfehlung für ein Kaloriendefizit oder einen Kalorienüberschuss zum Ab- oder Zunehmen wäre kein reiner Rechenwert mehr, sondern eine Ernährungsempfehlung – und die hängt von mehr ab als diesen fünf Eingaben.",
];

const faq: FaqEntry[] = [
  {
    question: "Was ist der Unterschied zwischen Grundumsatz und Gesamtumsatz?",
    answer:
      "Der Grundumsatz ist der Kalorienbedarf in völliger Ruhe, allein für Atmung, Kreislauf und Zellstoffwechsel. Der Gesamtumsatz kommt dazu, wenn der Aktivitätsfaktor (PAL) draufmultipliziert wird – er bildet ab, wie viel zusätzlich durch Bewegung und Alltag verbraucht wird.",
  },
  {
    question: "Warum Mifflin-St Jeor statt Harris-Benedict?",
    answer:
      "Mifflin-St Jeor stammt aus den 1990er-Jahren und schätzt den Grundumsatz nach heutigem Kenntnisstand genauer als die ältere Harris-Benedict-Formel von 1919. Sie gilt deshalb als Standardempfehlung für Erwachsene.",
  },
  {
    question: "Wie genau ist die Formel?",
    answer:
      "Als Schätzung liegt sie meist innerhalb von etwa 10 Prozent des tatsächlichen Werts – abhängig von Muskelanteil, Stoffwechsel und individuellen Unterschieden, die keine Formel aus nur vier Eingaben abbilden kann.",
  },
  {
    question: "Was bedeuten die PAL-Stufen?",
    answer:
      "PAL steht für Physical Activity Level und multipliziert den Grundumsatz zum Gesamtumsatz. 1,2 steht für kaum Bewegung im Alltag, 1,9 für Leistungssport oder einen körperlich sehr fordernden Beruf. Die meisten Menschen mit Bürojob und etwas Sport liegen zwischen 1,375 und 1,55.",
  },
  {
    question: "Gilt das auch in der Schwangerschaft oder bei Kindern?",
    answer:
      "Nein. Mifflin-St Jeor ist ausschließlich für Erwachsene validiert. In Schwangerschaft und Stillzeit steigt der Energiebedarf zusätzlich, und bei Kindern hängt er vom Wachstum ab – beides bildet diese Formel nicht ab.",
  },
  {
    question: "Ist das eine Ernährungsberatung?",
    answer:
      "Nein. Der Rechner schätzt einen Zahlenwert aus Gewicht, Größe, Alter, Geschlecht und Aktivität und ersetzt keine Ernährungsberatung. Für ein Ernährungsziel mit Kaloriendefizit oder -überschuss ist eine individuelle Beratung die verlässlichere Grundlage.",
  },
];

export const kalorienbedarf: ToolManifest = {
  slug: "kalorienbedarf",
  name: "Kalorienbedarf-Rechner",
  tagline:
    "Grundumsatz nach Mifflin-St Jeor und Gesamtumsatz über dein Aktivitätslevel – in Kalorien pro Tag.",
  category: "gesundheit",
  icon: Flame,
  status: "live",
  keywords: [
    "kalorienbedarf berechnen",
    "grundumsatz berechnen",
    "kalorienbedarf rechner",
    "wie viele kalorien pro tag",
    "gesamtumsatz berechnen",
    "mifflin st jeor",
    "kalorienrechner",
    "pal wert",
    "kalorien grundumsatz",
  ],

  about,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
