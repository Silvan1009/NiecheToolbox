import { CalendarHeart } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { geburtsterminAffiliate } from "./affiliate";

const about: string[] = [
  "Der errechnete Geburtstermin beruht auf der Naegele-Regel: erster Tag der letzten Periode plus sieben Tage, minus drei Monate, plus ein Jahr – rechnerisch dasselbe wie plus neun Monate. Gezählt wird dabei ab dem ersten Tag der letzten Periode, nicht ab dem vermuteten Tag der Empfängnis, so wie es auch in der Geburtshilfe üblich ist.",
  "Weicht die Zykluslänge von den angenommenen 28 Tagen ab, verschiebt sich der vermutete Eisprung – und mit ihm der errechnete Termin um genau diese Differenz. Bei einem 35-tägigen Zyklus liegt der Termin deshalb eine Woche später als bei einem 28-tägigen, bei gleichem Datum der letzten Periode.",
  "Die Schwangerschaftswoche zählt ab demselben Bezugspunkt wie der Termin. SSW 14+3 bedeutet: 14 volle Wochen und 3 Tage seit dem ersten Tag der letzten Periode sind vergangen.",
  "Der errechnete Termin ist eine Schätzung, kein Fixpunkt: Nur etwa 4 bis 5 Prozent der Geburten treffen ihn exakt. Als normal gilt eine Geburt zwischen der 37. und 42. Schwangerschaftswoche – deshalb zeigt der Rechner neben dem Termin auch diesen Zeitraum. Eine Ultraschallmessung im ersten Trimester bestimmt den Termin meist genauer, besonders bei unregelmäßigem Zyklus.",
];

const faq: FaqEntry[] = [
  {
    question: "Wie wird der Geburtstermin berechnet?",
    answer:
      "Nach der Naegele-Regel: erster Tag der letzten Periode plus sieben Tage plus neun Monate. Bei einer von 28 Tagen abweichenden Zykluslänge verschiebt sich der Termin um genau die Differenz.",
  },
  {
    question: "Ab wann zählt die Schwangerschaftswoche?",
    answer:
      "Ab dem ersten Tag der letzten Periode – nicht ab dem vermuteten Tag der Empfängnis, der meist rund zwei Wochen später liegt. Das ist die in der Geburtshilfe übliche Zählweise, auch Mutterpass und Ultraschall folgen ihr.",
  },
  {
    question: "Wie zuverlässig ist der errechnete Termin?",
    answer:
      "Nur etwa 4 bis 5 Prozent der Geburten finden exakt an diesem Tag statt. Normal ist eine Geburt zwischen der 37. und 42. Schwangerschaftswoche – ein Zeitraum von rund vier Wochen um den errechneten Termin.",
  },
  {
    question: "Warum frage ich nach der Zykluslänge?",
    answer:
      "Die klassische Naegele-Regel geht von einem 28-tägigen Zyklus mit Eisprung an Tag 14 aus. Bei längeren oder kürzeren Zyklen verschiebt sich der Eisprung entsprechend – und mit ihm der errechnete Termin.",
  },
  {
    question: "Was ist genauer: dieser Rechner oder der Ultraschall?",
    answer:
      "Die Ultraschallmessung im ersten Trimester, vor allem bei unregelmäßigem Zyklus oder wenn der Zeitpunkt der letzten Periode unsicher ist. Der hier errechnete Termin ist eine erste Orientierung, bis diese Messung vorliegt.",
  },
  {
    question: "Ist das eine medizinische Beratung?",
    answer:
      "Nein. Der Rechner schätzt Termin und Schwangerschaftswoche rein rechnerisch und ersetzt keine ärztliche Untersuchung. Verbindlich ist die Einschätzung der Frauenärztin oder des Frauenarztes.",
  },
];

export const geburtstermin: ToolManifest = {
  slug: "geburtstermin",
  name: "Geburtstermin-Rechner",
  tagline:
    "Errechneter Termin und Schwangerschaftswoche ab dem ersten Tag der letzten Periode – nach der Naegele-Regel.",
  category: "gesundheit",
  icon: CalendarHeart,
  status: "live",
  keywords: [
    "geburtstermin berechnen",
    "geburtstermin rechner",
    "ssw berechnen",
    "schwangerschaftswoche berechnen",
    "errechneter termin",
    "naegele regel",
    "schwangerschaftskalender",
    "wann ist der geburtstermin",
    "mutterschutz",
    "elternzeit",
  ],

  getDefaultParams: () => ({ heute: todayIso() }),

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: geburtsterminAffiliate,
  },
};
