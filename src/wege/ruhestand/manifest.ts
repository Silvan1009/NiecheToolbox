import { Landmark } from "lucide-react";
import type { ContentSection, FaqEntry } from "@/tools/types";
import type { WegManifest } from "../types";

const sections: ContentSection[] = [
  {
    heading: "Das Beispiel im Überblick",
    blocks: [
      {
        type: "table",
        caption: "40-Jährige/r, Renteneintritt mit 63 statt Regelaltersgrenze 67",
        head: ["Kennzahl", "Wert"],
        rows: [
          ["Rentenabschlag (48 Monate × 0,3 %)", "14,4 %"],
          ["Rente nach Abschlag", "1.455 € statt 1.700 €"],
          ["Kumulierter Effekt über 22 Jahre Rentenbezug", "rund 64.600 €"],
          ["Ansparzeit bis Renteneintritt", "23 statt 27 Jahre"],
          ["Projiziertes Kapital bei 250 €/Monat", "rund 159.600 €"],
          ["Kapitalbedarf für das Wunscheinkommen", "rund 262.400 €"],
          ["Fehlbetrag", "rund 102.800 €"],
        ],
      },
    ],
  },
  {
    heading: "Drei Stellschrauben gegen den Fehlbetrag",
    blocks: [
      {
        type: "ul",
        items: [
          "Eine höhere monatliche Sparrate: Schon 50 Euro mehr im Monat schlagen sich über 20 oder mehr Jahre Ansparzeit spürbar im projizierten Kapital nieder, dank Zinseszins stärker als eine reine Vervielfachung vermuten lässt.",
          "Ein späterer Renteneintritt: wirkt doppelt, weil er gleichzeitig den Abschlag verkleinert und mehr Zeit zum Sparen lässt – deshalb lohnt es sich, diesen Hebel im Rechner zuerst durchzuspielen.",
          "Ein niedrigeres Wunscheinkommen im Ruhestand: Schon ein kleiner Abschlag beim gewünschten Lebensstandard senkt den Kapitalbedarf überproportional, weil er sich über die gesamte Rentenbezugsdauer multipliziert.",
        ],
      },
      {
        type: "note",
        text: "Die drei Stellschrauben schließen sich nicht gegenseitig aus: Oft reicht schon eine moderate Kombination aus allen dreien – etwas mehr sparen, ein Jahr später aufhören, ein leicht niedrigeres Wunscheinkommen ansetzen –, um denselben Fehlbetrag zu schließen, den eine einzelne Stellschraube allein kaum auffangen könnte.",
      },
    ],
  },
  {
    heading: "Die andere Richtung: Zuschlag statt Abschlag",
    blocks: [
      {
        type: "p",
        text: "Wer über die Regelaltersgrenze hinaus arbeitet, bekommt keinen Abschlag, sondern einen Zuschlag von 0,5 Prozent je Monat – ohne gesetzliche Obergrenze nach oben. Bei derselben Beispielrente von 1.700 Euro ergäbe ein Jahr Aufschub, also zwölf Monate, einen Zuschlag von 6 Prozent: rund 1.802 Euro statt 1.700 Euro, und zwar lebenslang.",
      },
      {
        type: "note",
        text: "Der Zuschlag ist damit gut anderthalbmal so hoch wie der Abschlag pro Monat – 0,5 statt 0,3 Prozent. Wer zwischen einem Jahr früher und einem Jahr später schwankt, sollte diesen Unterschied kennen, bevor er sich für die eine oder andere Richtung entscheidet.",
      },
    ],
  },
];

const about: string[] = [
  "Wer früher in Rente geht, verliert doppelt: einen lebenslangen Abschlag auf die gesetzliche Rente – 0,3 Prozent je Monat vor der persönlichen Regelaltersgrenze – und ein kürzeres Zeitfenster, um privat vorzusorgen. Dieser Weg rechnet beides zusammen: den Rentenabschlags-Rechner für die tatsächliche Rentenhöhe, den Rentenlücken-Rechner für den Kapitalbedarf und den Sparplan-Rechner für das, was die aktuelle Sparrate bis dahin tatsächlich aufbaut.",
  "Am Beispiel eines 40-Jährigen mit Renteneintritt mit 63 statt der Regelaltersgrenze 67: 14,4 Prozent Abschlag – der gesetzliche Höchstwert – drücken eine Regelrente von 1.700 Euro auf 1.455 Euro, macht über 22 Jahre Rentenbezug einen kumulierten Effekt von rund 64.600 Euro. Jedes einzelne Jahr früher kostet dabei zusätzlich rund 18.000 Euro lebenslang – der Abschlag wächst nicht linear mit den fehlenden Jahren, sondern mit den fehlenden Monaten, und die Rentenbezugsdauer bleibt dabei gleich lang.",
  "Die niedrigere Rente vergrößert wiederum die Lücke zum Wunscheinkommen, und die kürzere Ansparzeit lässt weniger Kapital entstehen, um diese Lücke zu schließen. Im selben Beispiel bleiben bis zum Renteneintritt nur 23 statt 27 Jahre – bei 250 Euro monatlicher Sparrate ein projiziertes Kapital von rund 159.600 Euro gegenüber einem Kapitalbedarf von rund 262.400 Euro. Der Fehlbetrag von rund 102.800 Euro ist die Zahl, die am Ende zählt: Sie zeigt, ob der frühere Ruhestand mit der aktuellen Sparrate überhaupt finanzierbar ist.",
  "Gerechnet wird in heutiger Kaufkraft, mit den Methoden der beiden Quell-Rechner: der Abschlag nach § 77 Abs. 2 SGB VI, die Lücke über eine um die Inflation bereinigte reale Rendite. Weder die künftige Rentenanpassung noch eine Rendite über Jahrzehnte lassen sich vorhersagen, nur durchspielen. Dieser Weg ist keine Renten- oder Anlageberatung.",
];

const faq: FaqEntry[] = [
  {
    question: "Warum wird die Rente nach Abschlag in die Lücke eingesetzt?",
    answer:
      "Weil sie die Zahl ist, die tatsächlich ausgezahlt wird. Der Rentenlücken-Rechner allein fragt nach der erwarteten gesetzlichen Rente aus der Renteninformation – die gilt aber für den Renteneintritt zur Regelaltersgrenze. Wer früher aufhört, bekommt weniger, und genau diese geminderte Rente bestimmt die tatsächliche Lücke zum Wunscheinkommen.",
  },
  {
    question: "Warum wächst der Abschlag nicht gleichmäßig mit jedem Jahr?",
    answer:
      "Er wächst gleichmäßig mit jedem Monat – 0,3 Prozent je Monat vor der Regelaltersgrenze, gedeckelt bei 48 Monaten. Ein Jahr früher sind zwölf Monate, also 3,6 Prozentpunkte mehr Abschlag. Weil sich dieser Abschlag zusätzlich auf eine unveränderte Rentenbezugsdauer verteilt, steigt der kumulierte lebenslange Effekt mit jedem früheren Jahr etwas stärker als im Jahr davor.",
  },
  {
    question: "Was, wenn die aktuelle Sparrate die Lücke nicht schließt?",
    answer:
      "Dann zeigt das Urteil einen Fehlbetrag statt eines Überschusses – das ist kein Fehler, sondern die eigentliche Antwort. Drei Stellschrauben schließen ihn: eine höhere monatliche Sparrate, ein späterer Renteneintritt, der gleichzeitig den Abschlag verkleinert und mehr Zeit zum Sparen lässt, oder ein niedrigeres Wunscheinkommen im Ruhestand.",
  },
  {
    question: "Ist die Rente mit 63 ohne Abschlag hier berücksichtigt?",
    answer:
      "Nein. Die abschlagsfreie Altersrente für besonders langjährig Versicherte setzt mindestens 45 Beitragsjahre voraus und ist ein Sonderfall, kein Regelfall. Wer diese Voraussetzung erfüllt oder in Kürze erfüllt, sollte sie vorrangig bei der Deutschen Rentenversicherung prüfen – der hier gezeigte Abschlag gilt für einen Renteneintritt vor der Regelaltersgrenze ohne diese Sonderregelung.",
  },
];

export const ruhestand: WegManifest = {
  slug: "ruhestand",
  name: "Check: Ruhestand",
  tagline:
    "Rente nach Abschlag, Kapitalbedarf und projiziertes Kapital in einem Urteil: trägt die Sparrate den früheren Ruhestand?",
  category: "geld",
  icon: Landmark,
  status: "live",
  keywords: [
    "früher in rente rechner",
    "rente mit 63 rechner",
    "renteneintritt vorziehen berechnen",
    "kann ich früher in rente gehen",
    "rentenlücke früher renteneintritt",
    "rentenabschlag kapitalbedarf",
    "wann kann ich in rente gehen",
  ],

  sourceTools: [
    {
      slug: "rentenabschlag",
      detailEyebrow: "Abschlag oder Zuschlag im Detail",
      detailDescription:
        "Regelaltersgrenze nach Geburtsjahrgang und der kumulierte Effekt über die Rentenbezugsdauer.",
      backlinkDescription:
        "Diese Rente nach Abschlag mit der Rentenlücke und der eigenen Sparrate zusammenrechnen: reicht das Kapital?",
    },
    {
      slug: "rentenluecke",
      detailEyebrow: "Kapitalbedarf im Detail",
      detailDescription:
        "Wunscheinkommen, Kapitalbedarf und die ewige Entnahme im Detail.",
      backlinkDescription:
        "Diese Lücke mit einem früheren oder späteren Renteneintritt durchrechnen: was ändert der Abschlag?",
    },
    {
      slug: "sparplan",
      detailEyebrow: "Frei wählbare Sparrate und Rendite",
      detailDescription:
        "Zinseszins, Fondskosten, Steuern und Inflation im Detail.",
      backlinkDescription:
        "Die nötige Sparrate für den Ruhestand mit eigener Rendite und Laufzeit durchrechnen.",
    },
  ],

  about,
  sections,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
