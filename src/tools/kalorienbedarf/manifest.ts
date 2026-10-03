import { Flame } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";

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

const sections: ContentSection[] = [
  {
    heading: "PAL-Stufen im Überblick",
    blocks: [
      {
        type: "p",
        text: "Der Aktivitätsfaktor ist die am schwersten einzuschätzende Eingabe, weil er den ganzen Alltag in eine einzige Zahl übersetzt. Als Orientierung helfen fünf Stufen, die in der Ernährungswissenschaft gebräuchlich sind.",
      },
      {
        type: "table",
        caption: "Physical Activity Level (PAL) nach Alltagsbelastung",
        head: ["PAL", "Typischer Alltag"],
        rows: [
          ["1,2", "Überwiegend sitzend, kaum Bewegung"],
          ["1,375", "Sitzende Tätigkeit, leichte Bewegung 1–3 Tage pro Woche"],
          ["1,55", "Sitzende bis stehende Tätigkeit, Sport 3–5 Tage pro Woche"],
          ["1,725", "Körperlich fordernder Alltag, Sport 6–7 Tage pro Woche"],
          ["1,9", "Leistungssport oder sehr körperlich fordernder Beruf"],
        ],
      },
      {
        type: "note",
        text: "Die meisten Menschen mit Bürojob und etwas Sport landen zwischen 1,375 und 1,55 – im Zweifel eher die niedrigere Stufe wählen, denn der eigene Alltag wird beim Schätzen fast immer aktiver eingeschätzt, als er tatsächlich ist.",
      },
    ],
  },
  {
    heading: "Woher die Formel kommt",
    blocks: [
      {
        type: "p",
        text: "Die Mifflin-St-Jeor-Formel wurde 1990 im American Journal of Clinical Nutrition veröffentlicht und an einer deutlich größeren und repräsentativeren Stichprobe validiert als ihre Vorgängerin. Die Harris-Benedict-Formel von 1919 überschätzt den Grundumsatz nach heutigem Kenntnisstand systematisch, besonders bei Menschen mit höherem Körpergewicht.",
      },
    ],
  },
  {
    heading: "Die Formel im Detail",
    blocks: [
      {
        type: "p",
        text: "Ausgeschrieben lautet die Mifflin-St-Jeor-Formel für Männer: 10 mal Gewicht in Kilogramm, plus 6,25 mal Größe in Zentimetern, minus 5 mal Alter in Jahren, plus 5. Für Frauen gilt dieselbe Rechnung, nur wird am Ende 161 abgezogen statt 5 addiert.",
      },
      {
        type: "note",
        text: "Der einzige Unterschied zwischen beiden Formeln ist diese eine Konstante am Ende – sie bildet grob ab, dass der Körper bei sonst gleichem Gewicht und gleicher Größe im Schnitt einen etwas anderen Anteil an Muskel- und Fettmasse hat. Individuelle Abweichungen von diesem Durchschnitt bildet die Formel naturgemäß nicht ab.",
      },
    ],
  },
  {
    heading: "Warum der Grundumsatz mit dem Alter sinkt",
    blocks: [
      {
        type: "p",
        text: "Bei gleichem Gewicht und gleicher Größe liegt der Grundumsatz einer 25-Jährigen rechnerisch höher als der einer 65-Jährigen – die Formel zieht für jedes Lebensjahr einen festen Betrag ab. Der Hauptgrund dahinter ist der allmähliche Rückgang der Muskelmasse mit zunehmendem Alter, dem sogenannten Muskelschwund oder Sarkopenie: Muskelgewebe verbraucht im Ruhezustand deutlich mehr Energie als Fettgewebe, weshalb ein Körper mit weniger Muskelanteil bei gleichem Gesamtgewicht weniger Kalorien allein für die Grundfunktionen benötigt.",
      },
      {
        type: "note",
        text: "Regelmäßiges Krafttraining kann diesem Effekt entgegenwirken, weil erhaltene oder aufgebaute Muskelmasse den Grundumsatz gegenüber dem reinen Altersdurchschnitt anhebt – die Formel selbst kennt aber nur das Alter in Jahren, nicht den tatsächlichen Trainingszustand, und schätzt deshalb bei muskulösen älteren Menschen tendenziell zu niedrig.",
      },
    ],
  },
  {
    heading: "Warum der geschätzte Wert von Tag zu Tag schwanken darf",
    blocks: [
      {
        type: "p",
        text: "Der hier errechnete Gesamtumsatz ist ein Durchschnittswert für einen typischen Tag, keine exakte Vorgabe für jeden einzelnen Tag. Der tatsächliche Verbrauch schwankt spürbar mit Schlafqualität, Umgebungstemperatur, Stresslevel und sogar der Verdauungsarbeit für die zuletzt gegessene Mahlzeit – all das verändert den Energieumsatz um mehrere Prozent, ohne dass sich Gewicht, Größe oder Aktivitätslevel geändert hätten. Wer die eigene Zahl für eine längerfristige Planung nutzt, sollte sie deshalb als Richtwert über mehrere Wochen verstehen, nicht als exaktes Tagesbudget.",
      },
    ],
  },
];

export const kalorienbedarf: ToolManifest = {
  slug: "kalorienbedarf",
  name: "Kalorienbedarf-Rechner",
  tagline:
    "Grundumsatz nach Mifflin-St Jeor und Gesamtumsatz über dein Aktivitätslevel – in Kalorien pro Tag.",
  seoTitle: "Kalorienbedarf berechnen: Grundumsatz und Gesamtumsatz",
  metaDescription:
    "Kalorienbedarf pro Tag berechnen: Grundumsatz nach der Mifflin-St-Jeor-Formel und Gesamtumsatz passend zu deinem Aktivitätslevel.",
  sources: [
    {
      label:
        "Mifflin MD, St Jeor ST u. a. (1990): A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition",
      href: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
      note: "die Originalveröffentlichung der Formel für den Grundumsatz",
    },
  ],
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
  sections,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
