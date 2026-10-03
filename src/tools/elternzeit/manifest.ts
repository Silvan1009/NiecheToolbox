import { Baby } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { ContentSection, ToolManifest } from "@/tools/types";
import { elternzeitAffiliate } from "./affiliate";

const sections: ContentSection[] = [
  {
    heading: "Alle Fristen auf einen Blick",
    blocks: [
      {
        type: "table",
        caption: "Fristen rund um Geburt, Mutterschutz und Elternzeit",
        head: ["Frist", "Zeitpunkt"],
        rows: [
          [
            "Mutterschutz vor der Geburt",
            "6 Wochen vor dem errechneten Termin",
          ],
          [
            "Mutterschutz nach der Geburt",
            "8 Wochen (12 bei Mehrlings-/Frühgeburt)",
          ],
          [
            "Anmeldung Elternzeit (bis 3. Geburtstag)",
            "spätestens 7 Wochen vor Beginn",
          ],
          [
            "Anmeldung Elternzeit (ab 3. Geburtstag)",
            "spätestens 13 Wochen vor Beginn",
          ],
          ["Rückwirkender Elterngeld-Antrag", "höchstens 3 Monate"],
        ],
      },
    ],
  },
  {
    heading: "Kündigungsschutz während der Elternzeit",
    blocks: [
      {
        type: "p",
        text: "Der besondere Kündigungsschutz nach § 18 BEEG beginnt nicht erst mit der Elternzeit selbst, sondern schon mit deren Anmeldung – frühestens acht Wochen vor dem geplanten Beginn. Bei Elternzeit zwischen dem dritten und dem achten Geburtstag des Kindes verlängert sich dieser Vorlauf auf vierzehn Wochen.",
      },
      {
        type: "note",
        text: "Der Schutz gilt bis zum Ende der Elternzeit und schließt an den Mutterschutz nahtlos an, wenn beide Zeiträume direkt aufeinanderfolgen. Eine Kündigung durch den Arbeitgeber ist in dieser Zeit nur in eng begrenzten Ausnahmefällen möglich, etwa bei einer Betriebsstilllegung.",
      },
    ],
  },
  {
    heading: "Teilzeit während der Elternzeit",
    blocks: [
      {
        type: "p",
        text: "Elternzeit bedeutet nicht zwingend, vollständig zu pausieren: Nach § 15 Abs. 5 bis 7 BEEG besteht in Betrieben mit mehr als 15 Beschäftigten ein Anspruch auf Teilzeitarbeit während der Elternzeit, in der Regel zwischen 15 und 32 Wochenstunden. Der Antrag muss spätestens sieben Wochen vor dem gewünschten Beginn gestellt werden – dieselbe Frist wie für die Elternzeit selbst.",
      },
      {
        type: "note",
        text: "Wird während des Elterngeldbezugs in Teilzeit gearbeitet, wird das Einkommen auf das Elterngeld angerechnet – bei ElterngeldPlus günstiger als beim Basiselterngeld. Der Arbeitgeber kann den Teilzeitwunsch nur aus dringenden betrieblichen Gründen ablehnen, muss das aber schriftlich innerhalb von vier Wochen begründen.",
      },
    ],
  },
  {
    heading: "Gleichzeitig oder nacheinander: die Wahl beider Elternteile",
    blocks: [
      {
        type: "p",
        text: "Beide Elternteile können Elternzeit gleichzeitig nehmen, nacheinander, oder sich abwechseln – gesetzlich vorgeschrieben ist keine bestimmte Reihenfolge. Für die zwei zusätzlichen Partnermonate beim Elterngeld reicht es bereits, wenn ein Elternteil in dieser Zeit sein Einkommen reduziert, unabhängig davon, ob beide gleichzeitig zu Hause sind. Wer die volle Bezugsdauer von vierzehn Monaten ausschöpfen will, muss also nicht zwingend zeitgleich pausieren – oft ist ein versetztes Modell finanziell und organisatorisch günstiger, etwa wenn ein Elternteil in Teilzeit weiterarbeitet, während der andere die Betreuung übernimmt.",
      },
      {
        type: "note",
        text: "Bei einer weiteren Schwangerschaft während laufender Elternzeit für ein älteres Geschwisterkind gilt ein eigener Mutterschutz für das neue Kind, unabhängig vom Elternzeitstatus für das ältere Kind. Die beiden Elternzeit-Ansprüche laufen dann parallel und werden bei der Anmeldung beim Arbeitgeber getrennt betrachtet.",
      },
    ],
  },
];

export const elternzeit: ToolManifest = {
  slug: "elternzeit",
  name: "Elternzeit-Planer",
  tagline:
    "Lebensmonate, Mutterschutz und Anmeldefristen als ein Zeitstrahl – vom errechneten Termin an.",
  seoTitle: "Elternzeit-Planer: Monate, Mutterschutz und Fristen",
  metaDescription:
    "Elternzeit ab dem errechneten Geburtstermin planen: Lebensmonate, Mutterschutz, Partnermonate und die Anmeldefristen beim Arbeitgeber auf einem Zeitstrahl.",
  sources: [
    {
      label: "§ 15 BEEG – Anspruch auf Elternzeit",
      href: "https://www.gesetze-im-internet.de/beeg/__15.html",
    },
    {
      label: "§ 16 BEEG – Inanspruchnahme der Elternzeit",
      href: "https://www.gesetze-im-internet.de/beeg/__16.html",
      note: "die Anmeldefristen gegenüber dem Arbeitgeber",
    },
    {
      label: "§ 4 BEEG – Bezugsdauer, Anspruchsumfang",
      href: "https://www.gesetze-im-internet.de/beeg/__4.html",
      note: "Lebensmonate und Partnermonate beim Elterngeld",
    },
    {
      label: "§ 3 MuSchG – Schutzfristen vor und nach der Entbindung",
      href: "https://www.gesetze-im-internet.de/muschg_2018/__3.html",
    },
  ],
  category: "familie",
  icon: Baby,
  status: "beta",
  keywords: [
    "elternzeit planen",
    "elternzeit rechner",
    "lebensmonate",
    "mutterschutz",
    "elterngeld monate",
    "partnermonate",
    "anmeldefrist elternzeit",
  ],

  getDefaultParams: () => ({ heute: todayIso() }),

  sections,

  about: [
    "Elternzeit wird in Lebensmonaten des Kindes gerechnet, nicht in Kalendermonaten: Der erste Lebensmonat beginnt am Geburtstag und endet am Tag vor dem gleichen Datum im Folgemonat. Genau danach richten sich Elterngeld-Monate und Anmeldefristen – deshalb rechnet der Planer alles aus dem Geburtstermin heraus.",
    "Drei Fristen entscheiden über Geld und Planbarkeit: Der Mutterschutz beginnt sechs Wochen vor dem errechneten Termin und endet acht Wochen nach der Geburt (zwölf bei Mehrlings- und Frühgeburten). Elternzeit muss dem Arbeitgeber spätestens sieben Wochen vor Beginn schriftlich mitgeteilt werden – für Zeiträume ab dem dritten Geburtstag sind es dreizehn Wochen. Und Elterngeld wird rückwirkend nur für drei Monate gezahlt: Wer zu spät beantragt, verliert die ersten Monate endgültig.",
    "Basiselterngeld gibt es für zwölf Lebensmonate. Zwei weitere Partnermonate kommen dazu, wenn beide Elternteile mindestens zwei Monate nehmen; Alleinerziehende bekommen die vierzehn Monate ohne diese Bedingung. Elternzeit selbst ist deutlich länger möglich – bis zu 36 Monate je Elternteil, davon bis zu 24 Monate zwischen dem dritten und dem achten Geburtstag. Diese Monate sind dann unbezahlt, sofern nicht ElterngeldPlus greift.",
    "Der Planer zeigt Zeiträume und Termine, er prüft keinen Einzelfall und berechnet keine Beträge. Wie hoch dein Elterngeld ausfällt, hängt vom Netto-Einkommen der letzten zwölf Monate ab – das klärt die Elterngeldstelle.",
  ],

  faq: [
    {
      question: "Was ist ein Lebensmonat?",
      answer:
        "Der erste Lebensmonat beginnt am Geburtstag des Kindes und endet am Tag vor demselben Datum im nächsten Monat. Ein Kind, das am 10. Juni geboren wird, hat den ersten Lebensmonat vom 10. Juni bis 9. Juli. Fällt der Geburtstag auf den 31., endet der Lebensmonat am letzten Tag des kürzeren Folgemonats.",
    },
    {
      question: "Wie lange dauert der Mutterschutz?",
      answer:
        "Sechs Wochen vor dem errechneten Termin und acht Wochen nach der Geburt. Bei Mehrlings- und Frühgeburten sind es zwölf Wochen danach. Die Schutzfrist nach der Geburt wird auf die Elternzeit angerechnet.",
    },
    {
      question: "Wann muss ich Elternzeit anmelden?",
      answer:
        "Spätestens sieben Wochen vor Beginn, schriftlich beim Arbeitgeber – und verbindlich für die ersten zwei Jahre. Für Zeiträume, die ab dem dritten Geburtstag liegen, beträgt die Frist dreizehn Wochen; dort kann der Arbeitgeber aus dringenden betrieblichen Gründen ablehnen.",
    },
    {
      question: "Wie viele Monate Elterngeld gibt es?",
      answer:
        "Basiselterngeld für zwölf Lebensmonate, plus zwei Partnermonate, wenn beide Elternteile mindestens zwei Monate nehmen – zusammen also vierzehn. Alleinerziehende erhalten die vierzehn Monate ohne diese Bedingung. ElterngeldPlus verdoppelt die Bezugsdauer bei halbem monatlichen Betrag.",
    },
    {
      question: "Kann ich Elternzeit nach dem dritten Geburtstag nehmen?",
      answer:
        "Ja, bis zu 24 der 36 Monate lassen sich auf die Zeit zwischen dem dritten und dem achten Geburtstag verschieben. Diese Monate sind unbezahlt und brauchen eine Anmeldung dreizehn Wochen vorher.",
    },
    {
      question: "Ist das eine verbindliche Auskunft?",
      answer:
        "Nein. Der Planer rechnet Zeiträume und Fristen aus und ersetzt keine Beratung. Verbindliche Auskünfte geben die Elterngeldstelle, dein Arbeitgeber oder eine Rechtsberatung.",
    },
  ],

  monetization: {
    adDensity: "low",
    affiliate: elternzeitAffiliate,
  },
};
