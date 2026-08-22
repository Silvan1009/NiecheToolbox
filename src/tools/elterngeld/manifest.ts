import { HandHeart } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { elterngeldAffiliate } from "./affiliate";

const sections: ContentSection[] = [
  {
    heading: "Die Ersatzrate-Staffel im Überblick",
    blocks: [
      {
        type: "table",
        caption: "Ersatzrate nach Nettoeinkommen vor der Geburt",
        head: ["Nettoeinkommen", "Ersatzrate"],
        rows: [
          ["bis 340 €", "100 %"],
          ["340–1.000 €", "sinkt schrittweise (Geringverdienerregelung)"],
          ["1.000–1.200 €", "67 %"],
          ["1.200–1.240 €", "sinkt schrittweise auf 65 %"],
          ["ab 1.240 €", "65 % (konstant)"],
        ],
      },
      {
        type: "note",
        text: "Die meisten Angestellten mit einem Nettoeinkommen über 1.240 Euro landen deshalb bei der konstanten unteren Grenze von 65 Prozent – die oft zitierten 67 Prozent gelten nur für ein schmales Einkommensfenster.",
      },
    ],
  },
  {
    heading: "Zuschläge auf einen Blick",
    blocks: [
      {
        type: "ul",
        items: [
          "Geschwisterbonus: 10 % des errechneten Elterngeldes, mindestens 75 € im Monat.",
          "Mehrlingszuschlag: 300 € zusätzlich für jedes weitere Kind derselben Geburt.",
        ],
      },
      {
        type: "note",
        text: "Beide Zuschläge werden automatisch für die gesamte Bezugsdauer gezahlt, nicht nur einmalig, und lassen sich miteinander kombinieren.",
      },
    ],
  },
];

const about: string[] = [
  "„67 Prozent vom letzten Netto“ ist die Zahl, die zum Elterngeld am häufigsten kursiert – und sie stimmt nur für ein Nettoeinkommen zwischen 1.000 und 1.200 Euro im Monat. Darunter greift die Geringverdienerregelung und die Ersatzrate steigt schrittweise bis auf 100 Prozent bei 340 Euro oder weniger. Darüber sinkt sie schrittweise bis auf 65 Prozent, erreicht bei rund 1.240 Euro Netto und ab dort unverändert – wer 4.000 Euro netto verdient hat, bekommt also nicht 67, sondern 65 Prozent davon. Dieser Rechner bildet die volle Staffel ab, nicht nur die Mitte.",
  "Der Geschwisterbonus und der Mehrlingszuschlag werden oft übersehen, obwohl sie das Ergebnis spürbar verändern. Der Geschwisterbonus erhöht das Elterngeld um 10 Prozent, mindestens aber um 75 Euro im Monat – und zwar, sobald ein weiteres Kind unter 3 Jahren oder zwei weitere Kinder unter 6 Jahren im Haushalt leben. Bei Mehrlingen kommen zusätzlich 300 Euro für jedes weitere Kind einer Geburt oben drauf, unabhängig vom Einkommen.",
  "Die Wahl zwischen Basiselterngeld und ElterngeldPlus verändert am reinen Gesamtbetrag zunächst nichts: ElterngeldPlus zahlt die Hälfte des Monatsbetrags über die doppelte Anzahl an Monaten – in Summe kommt ohne eigenes Einkommen während des Bezugs dasselbe heraus. Der eigentliche Vorteil von ElterngeldPlus zeigt sich erst, wenn während des Bezugs in Teilzeit gearbeitet wird: Das Teilzeiteinkommen wird dort günstiger angerechnet als beim Basiselterngeld, wodurch Plus in diesem Fall über die gesamte Bezugszeit tatsächlich mehr auszahlen kann. Dieser Rechner bildet den einfachen Fall ohne Einkommen während des Bezugs ab – für die Teilzeit-Kombination sind die individuellen Regeln zu vielfältig für eine allgemeine Formel.",
  "Alle Angaben sind Näherungen und keine Rechtsberatung. Nicht abgebildet sind der Partnerschaftsbonus für gemeinsame Teilzeit beider Elternteile, die genaue Ermittlung des Bemessungszeitraums bei Selbstständigen oder bei Einkommensschwankungen im Jahr vor der Geburt sowie Sonderfälle wie Mutterschaftsgeld-Anrechnung. Für die konkrete Antragstellung bei der Elterngeldstelle zählt am Ende immer die individuelle Einkommensbescheinigung.",
];

const faq: FaqEntry[] = [
  {
    question: "Bekomme ich wirklich immer 67 Prozent meines Nettoeinkommens?",
    answer:
      "Nur, wenn das Nettoeinkommen vor der Geburt zwischen 1.000 und 1.200 Euro im Monat lag. Darunter steigt die Ersatzrate über die Geringverdienerregelung bis auf 100 Prozent, darüber sinkt sie bis auf 65 Prozent – erreicht bei etwa 1.240 Euro Netto und ab dort konstant, egal wie viel mehr verdient wurde. Bei einem typischen Angestellteneinkommen von 2.000 bis 3.000 Euro netto sind es also fast immer 65 Prozent, nicht 67.",
  },
  {
    question: "Was zählt als Nettoeinkommen vor der Geburt?",
    answer:
      "Der Durchschnitt der zwölf Kalendermonate vor dem Monat der Geburt, in denen tatsächlich Erwerbseinkommen erzielt wurde – bei Selbstständigen das letzte abgeschlossene Steuerjahr. Monate mit Mutterschutz, mit Elterngeldbezug für ein älteres Kind oder ohne Einkommen werden bei der Ermittlung des Bemessungszeitraums ausgeklammert und durch frühere Monate ersetzt. Für eine erste Einschätzung reicht ein grober Monatsdurchschnitt.",
  },
  {
    question: "Wann bekomme ich den Geschwisterbonus?",
    answer:
      "Sobald neben dem Kind, für das Elterngeld beantragt wird, mindestens ein weiteres Kind unter 3 Jahren im Haushalt lebt – oder mindestens zwei weitere Kinder unter 6 Jahren. Der Bonus beträgt 10 Prozent des errechneten Elterngeldes, mindestens aber 75 Euro im Monat, auch wenn 10 Prozent weniger wären. Er wird automatisch für die gesamte Bezugsdauer gezahlt, nicht nur einmalig.",
  },
  {
    question: "Basiselterngeld oder ElterngeldPlus – was bringt mehr?",
    answer:
      "Ohne eigenes Einkommen während des Bezugs macht es rechnerisch keinen Unterschied: Beide Varianten zahlen in Summe denselben Betrag, nur unterschiedlich verteilt – Basis konzentriert, Plus über die doppelte Zeit gestreckt. Der Unterschied entsteht erst, wenn während des Bezugs in Teilzeit gearbeitet wird: Beim Basiselterngeld wird das Teilzeiteinkommen härter angerechnet und kann den Anspruch stark senken, bei ElterngeldPlus deutlich moderater. Wer plant, früh wieder Teilzeit zu arbeiten, fährt mit Plus meist besser.",
  },
  {
    question: "Wie viele Monate stehen mir zu?",
    answer:
      "Ein Elternteil allein kann maximal 12 Basismonate nutzen. 14 Monate stehen dem Paar zusammen nur zu, wenn der andere Elternteil mindestens 2 Partnermonate übernimmt – ebenso bei Alleinerziehenden mit alleinigem Sorge- oder Aufenthaltsbestimmungsrecht, die die Partnermonate dann selbst beanspruchen dürfen. Jeder Basismonat lässt sich einzeln in zwei ElterngeldPlus-Monate umwandeln.",
  },
  {
    question: "Wird das Elterngeld versteuert?",
    answer:
      "Nicht direkt – es ist steuerfrei ausgezahltes Einkommen. Es unterliegt aber dem Progressionsvorbehalt: Es wird bei der Steuererklärung zum übrigen zu versteuernden Einkommen hinzugerechnet, um den Steuersatz für dieses Einkommen zu bestimmen, und erhöht dadurch häufig die Steuerlast auf das restliche Jahreseinkommen. Eine Steuererklärung ist im Bezugsjahr deshalb in aller Regel Pflicht.",
  },
];

export const elterngeld: ToolManifest = {
  slug: "elterngeld",
  name: "Elterngeld-Rechner",
  tagline:
    "Ersatzrate, Mindest- und Höchstbetrag, Geschwisterbonus und Mehrlingszuschlag nach dem BEEG – Basis und ElterngeldPlus im Vergleich.",
  category: "familie",
  icon: HandHeart,
  status: "live",
  keywords: [
    "elterngeld berechnen",
    "elterngeld rechner",
    "elterngeld ersatzrate",
    "elterngeldplus berechnen",
    "geschwisterbonus elterngeld",
    "mehrlingszuschlag elterngeld",
    "basiselterngeld oder elterngeldplus",
    "elterngeld höhe",
  ],

  sections,

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: elterngeldAffiliate,
  },
};
