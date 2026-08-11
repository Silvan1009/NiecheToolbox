import { Weight } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";

const about: string[] = [
  "Der Body-Mass-Index setzt Gewicht und Größe zueinander ins Verhältnis: Gewicht in Kilogramm geteilt durch die Körpergröße in Metern zum Quadrat. Die WHO-Kategorien – Untergewicht, Normalgewicht, Übergewicht und drei Adipositas-Grade – gelten für Erwachsene unabhängig vom Geschlecht. Ein eigenes Feld dafür würde am Ergebnis nichts ändern, deshalb fragt dieser Rechner es auch nicht ab.",
  "Der BMI ist eine grobe Kennzahl. Er unterscheidet nicht zwischen Muskel- und Fettmasse: Wer viel trainiert, kann rechnerisch „übergewichtig“ sein, obwohl der Körperfettanteil niedrig ist. Im Alter verschiebt sich zudem das Verhältnis von Muskel- zu Fettmasse, ohne dass sich das Gewicht selbst ändern muss.",
  "Für Kinder und Jugendliche gilt der Erwachsenen-BMI ausdrücklich nicht. Dort entscheiden alters- und geschlechtsspezifische Perzentilkurven, die eine Kinder- oder Jugendärztin beurteilt – eine andere Datengrundlage als eine angepasste Formel. Trägst du ein Alter unter 18 ein, zeigt der Rechner deshalb nur einen Hinweis statt einer Kategorie.",
  "Neben dem reinen Index zeigt der Rechner die Normalgewichtsspanne für die eingegebene Größe – die Gewichtsspanne in Kilogramm, die einem BMI von 18,5 bis 24,9 entspricht. Für ein konkretes Ziel ist das oft die nützlichere Zahl als der Index selbst.",
];

const faq: FaqEntry[] = [
  {
    question: "Wie wird der BMI berechnet?",
    answer:
      "Gewicht in Kilogramm geteilt durch die Körpergröße in Metern zum Quadrat. Bei 75 kg und 1,78 m ergibt das einen BMI von rund 23,7 – Normalgewicht nach der WHO-Einteilung.",
  },
  {
    question: "Ist der BMI für Männer und Frauen gleich?",
    answer:
      "Ja. Die WHO-Kategorien unterscheiden nicht nach Geschlecht, deshalb fragt dieser Rechner es auch nicht ab. Andere Kennzahlen wie der Körperfettanteil berücksichtigen den Unterschied, der BMI selbst nicht.",
  },
  {
    question: "Gilt der BMI auch für Kinder?",
    answer:
      "Nein. Bei Kindern und Jugendlichen verändert sich der Körperbau mit dem Wachstum ständig, deshalb gelten alters- und geschlechtsspezifische Perzentilkurven statt fester Grenzwerte. Trägst du ein Alter unter 18 ein, zeigt der Rechner nur einen Hinweis, keine Kategorie.",
  },
  {
    question: "Was zeigt der BMI nicht?",
    answer:
      "Er unterscheidet nicht zwischen Muskel- und Fettmasse und sagt nichts über die Fettverteilung im Körper. Muskulöse Menschen können einen hohen BMI haben, ohne übergewichtig zu sein; im Alter kann ein rechnerisch normaler BMI trotzdem wenig Muskelmasse verbergen.",
  },
  {
    question: "Was bedeutet die Normalgewichtsspanne?",
    answer:
      "Die Gewichtsspanne in Kilogramm, die für die eingegebene Größe einem BMI zwischen 18,5 und 24,9 entspricht – also der WHO-Kategorie Normalgewicht. Sie ist oft hilfreicher als der reine Index, weil sie direkt in Kilogramm angibt, wo dieser Bereich liegt.",
  },
  {
    question: "Ist das eine medizinische Beratung?",
    answer:
      "Nein. Der Rechner ordnet Gewicht und Größe rein rechnerisch einer WHO-Kategorie zu und ersetzt keine ärztliche Beratung. Für eine Einschätzung von Körperfettanteil, Muskelmasse oder gesundheitlichen Risiken ist eine ärztliche Untersuchung nötig.",
  },
];

export const bmi: ToolManifest = {
  slug: "bmi",
  name: "BMI-Rechner",
  tagline:
    "Body-Mass-Index aus Gewicht und Größe – mit WHO-Kategorie und Normalgewichtsspanne in Kilogramm.",
  category: "gesundheit",
  icon: Weight,
  status: "live",
  keywords: [
    "bmi rechner",
    "bmi berechnen",
    "body mass index",
    "bmi tabelle",
    "normalgewicht berechnen",
    "idealgewicht berechnen",
    "bmi frauen",
    "bmi männer",
    "übergewicht berechnen",
  ],

  about,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
