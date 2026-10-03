import { Weight } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";

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

const sections: ContentSection[] = [
  {
    heading: "Die WHO-Kategorien im Überblick",
    blocks: [
      {
        type: "table",
        caption: "BMI-Einteilung der Weltgesundheitsorganisation (WHO)",
        head: ["BMI", "Kategorie"],
        rows: [
          ["unter 18,5", "Untergewicht"],
          ["18,5–24,9", "Normalgewicht"],
          ["25,0–29,9", "Übergewicht (Präadipositas)"],
          ["30,0–34,9", "Adipositas Grad I"],
          ["35,0–39,9", "Adipositas Grad II"],
          ["ab 40,0", "Adipositas Grad III"],
        ],
      },
      {
        type: "note",
        text: "Diese Grenzwerte gelten für Erwachsene unabhängig von Geschlecht und Alter. Für Kinder, Jugendliche und hochtrainierte Sportlerinnen und Sportler sind sie nicht geeignet – siehe die Hinweise unter „So funktioniert’s“.",
      },
    ],
  },
  {
    heading: "Herkunft des BMI",
    blocks: [
      {
        type: "p",
        text: "Die Formel geht auf den belgischen Statistiker Adolphe Quetelet zurück, der sie in den 1830er-Jahren als rein statistisches Maß für Bevölkerungsstudien entwickelte – nicht als Diagnoseinstrument für Einzelpersonen. Ursprünglich hieß sie Quetelet-Index; der heutige Name „Body-Mass-Index“ setzte sich erst ab den 1970er-Jahren durch, als er zunehmend in der Medizin verwendet wurde.",
      },
    ],
  },
  {
    heading: "Warum der BMI sich trotz seiner Schwächen hält",
    blocks: [
      {
        type: "p",
        text: "Genauere Verfahren gibt es längst: die Bioimpedanzmessung schätzt den Körperfettanteil über den elektrischen Widerstand des Gewebes, die Kalipermessung über Hautfaltendicke an mehreren Körperstellen, der Taille-Hüft-Quotient über das Verhältnis zweier Umfänge, das enger mit gesundheitlichen Risiken zusammenhängt als der BMI allein. Keines davon verdrängt den BMI in der Praxis, weil alle drei entweder ein Messgerät, geschultes Personal oder zusätzliche Messpunkte brauchen.",
      },
      {
        type: "note",
        text: "Der BMI braucht dagegen nur zwei Werte, die praktisch jeder ohne Hilfsmittel kennt oder leicht ermitteln kann: Gewicht und Größe. Das macht ihn ungenau im Einzelfall, aber unschlagbar praktisch für einen ersten Anhaltspunkt – und genau dafür ist er auch gedacht, nicht als abschließendes Urteil über die Gesundheit einer Person.",
      },
    ],
  },
  {
    heading: "Andere Grenzwerte für andere Bevölkerungsgruppen",
    blocks: [
      {
        type: "p",
        text: "Die hier verwendeten WHO-Grenzwerte wurden ursprünglich an Daten aus überwiegend europäischen und nordamerikanischen Bevölkerungen entwickelt. Für Menschen asiatischer Herkunft empfiehlt die WHO in einer separaten Leitlinie niedrigere Schwellenwerte, weil gesundheitliche Risiken wie Typ-2-Diabetes dort schon bei niedrigerem BMI messbar zunehmen – dort gilt Übergewicht teils bereits ab einem BMI von 23 statt 25. Dieser Rechner verwendet durchgehend die international gebräuchlicheren Standardgrenzwerte, weil sie den größten Teil der Besucherinnen und Besucher betreffen.",
      },
      {
        type: "note",
        text: "Auch bei Menschen über 65 Jahren wird in Teilen der Forschung ein etwas höherer Zielbereich diskutiert, weil ein leicht erhöhter BMI im höheren Alter mit einer gewissen Reserve bei Krankheit verbunden sein kann. Eine einheitliche, allgemein anerkannte Altersanpassung der WHO-Grenzwerte gibt es dafür bislang nicht.",
      },
    ],
  },
  {
    heading: "BMI als Screening-Werkzeug in der Praxis",
    blocks: [
      {
        type: "p",
        text: "In Arztpraxen dient der BMI meist als erster, schneller Anhaltspunkt, nicht als abschließende Diagnose. Liegt er deutlich außerhalb des Normalbereichs, folgen in der Regel weitere Untersuchungen – etwa Blutwerte, Blutdruck oder eine genauere Körperzusammensetzungsmessung –, bevor eine gesundheitliche Einschätzung getroffen wird. Der BMI allein löst selten eine Behandlung aus, er lenkt aber den Blick dorthin, wo ein genauerer Blick sich lohnen könnte.",
      },
    ],
  },
];

export const bmi: ToolManifest = {
  slug: "bmi",
  name: "BMI-Rechner",
  tagline:
    "Body-Mass-Index aus Gewicht und Größe – mit WHO-Kategorie und Normalgewichtsspanne in Kilogramm.",
  seoTitle: "BMI-Rechner: Body-Mass-Index nach WHO berechnen",
  metaDescription:
    "BMI aus Gewicht und Körpergröße berechnen: Einordnung nach den WHO-Kategorien für Erwachsene und die Normalgewichtsspanne in Kilogramm für deine Größe.",
  sources: [
    {
      label: "Weltgesundheitsorganisation (WHO): Obesity and overweight",
      href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
      note: "Faktenblatt in englischer Sprache mit den Grenzwerten für Übergewicht und Adipositas bei Erwachsenen",
    },
  ],
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
  sections,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
