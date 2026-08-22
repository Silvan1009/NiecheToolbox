import { Hourglass } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { rentenabschlagAffiliate } from "./affiliate";

/**
 * Die vollständige Staffel nach § 235 SGB VI, Anlage 19/20 – im Fließtext
 * stehen bislang nur zwei Beispieljahrgänge (1958, 1961), hier die
 * vollständige Tabelle zum Nachschlagen des eigenen Jahrgangs.
 */
const sections: ContentSection[] = [
  {
    heading: "Regelaltersgrenze nach Geburtsjahrgang",
    blocks: [
      {
        type: "p",
        text: "Wer zwischen 1947 und 1963 geboren ist, hat eine eigene, monatsgenaue Regelaltersgrenze – hier zum Nachschlagen, ohne die persönlichen Daten in den Rechner einzutragen.",
      },
      {
        type: "table",
        caption: "Regelaltersgrenze nach § 235 SGB VI",
        head: ["Geburtsjahr", "Regelaltersgrenze"],
        rows: [
          ["1947", "65 Jahre, 1 Monat"],
          ["1948", "65 Jahre, 2 Monate"],
          ["1949", "65 Jahre, 3 Monate"],
          ["1950", "65 Jahre, 4 Monate"],
          ["1951", "65 Jahre, 5 Monate"],
          ["1952", "65 Jahre, 6 Monate"],
          ["1953", "65 Jahre, 7 Monate"],
          ["1954", "65 Jahre, 8 Monate"],
          ["1955", "65 Jahre, 9 Monate"],
          ["1956", "65 Jahre, 10 Monate"],
          ["1957", "65 Jahre, 11 Monate"],
          ["1958", "66 Jahre"],
          ["1959", "66 Jahre, 2 Monate"],
          ["1960", "66 Jahre, 4 Monate"],
          ["1961", "66 Jahre, 6 Monate"],
          ["1962", "66 Jahre, 8 Monate"],
          ["1963", "66 Jahre, 10 Monate"],
          ["ab 1964", "67 Jahre"],
        ],
      },
      {
        type: "note",
        text: "Bis 1957 stieg die Grenze jährlich um einen Monat, ab 1959 um jeweils zwei Monate je Jahrgang – der Jahrgang 1958 markiert mit genau 66 Jahren den Übergang zwischen beiden Stufen.",
      },
    ],
  },
];

const about: string[] = [
  "„Mit 67 in Rente“ gilt nur für Geburtsjahrgänge ab 1964. Zwischen 1947 und 1963 wurde die Regelaltersgrenze schrittweise von 65 auf 67 Jahre angehoben, und zwar nicht in ganzen Jahren, sondern in Ein- beziehungsweise Zweimonatsschritten je Jahrgang. Wer 1958 geboren ist, hat seine Regelaltersgrenze bei genau 66 Jahren, wer 1961 geboren ist, bei 66 Jahren und 6 Monaten. Dieser Rechner schaut das persönliche Geburtsjahr in der gesetzlichen Tabelle nach (§ 235 SGB VI), statt pauschal mit 67 Jahren zu rechnen.",
  "Der Abschlag selbst ist einfache Mathematik: 0,3 Prozent je Monat, den der Rentenbeginn vor der persönlichen Regelaltersgrenze liegt, gesetzlich gedeckelt bei 48 Monaten beziehungsweise 14,4 Prozent (§ 77 Abs. 2 SGB VI). Der frühestmögliche Rentenbeginn für die Altersrente für langjährig Versicherte liegt bei 63 Jahren, unabhängig vom Jahrgang – für Jahrgänge ab 1964 sind das die vollen 48 Monate und damit der maximale Abschlag.",
  "Entscheidend ist, dass dieser Abschlag nicht einmalig, sondern lebenslang wirkt: Er kürzt jede einzelne Rentenzahlung bis ans Lebensende, nicht nur die ersten Jahre. Genau deshalb rechnet dieser Rechner den kumulierten Effekt über eine angenommene Rentenbezugsdauer aus – erst diese Zahl macht sichtbar, was ein paar Jahre früherer Ruhestand über zwei oder drei Jahrzehnte tatsächlich kostet. Umgekehrt gilt: Wer über die Regelaltersgrenze hinaus arbeitet, erhält einen Zuschlag von 0,5 Prozent je Monat – ohne gesetzliche Obergrenze.",
  "Nicht abgebildet ist die Altersrente für besonders langjährig Versicherte (umgangssprachlich „Rente mit 63“), die bei mindestens 45 Beitragsjahren abschlagsfrei schon vor der Regelaltersgrenze möglich ist – wie viele Jahre früher, hängt ebenfalls vom Geburtsjahrgang ab. Wer 45 Versicherungsjahre erreicht oder in Kürze erreicht, sollte diese Möglichkeit vorrangig bei der Deutschen Rentenversicherung prüfen, bevor er einen Abschlag einplant. Alle Angaben sind Näherungen und keine Rentenberatung.",
];

const faq: FaqEntry[] = [
  {
    question: "Warum ist meine Regelaltersgrenze nicht einfach 67 Jahre?",
    answer:
      "Weil die Anhebung von 65 auf 67 Jahre in kleinen Schritten über siebzehn Geburtsjahrgänge verteilt wurde, nicht auf einen Schlag. Für 1947 Geborene stieg sie um einen Monat, für jeden folgenden Jahrgang bis 1958 um einen weiteren Monat, dann bis 1964 um jeweils zwei Monate je Jahrgang. Erst ab Jahrgang 1964 stehen die vollen 67 Jahre fest. Dazwischen hat praktisch jeder Jahrgang seine eigene, monatsgenaue Regelaltersgrenze.",
  },
  {
    question: "Ab wann kann ich frühestens mit Abschlag in Rente gehen?",
    answer:
      "Für die Altersrente für langjährig Versicherte, die mindestens 35 Versicherungsjahre voraussetzt, ist der früheste Zeitpunkt 63 Jahre – unabhängig vom Geburtsjahrgang. Bei einer Regelaltersgrenze von 67 Jahren entspricht das den vollen 48 Monaten und damit dem gesetzlichen Höchstabschlag von 14,4 Prozent. Bei älteren Jahrgängen mit niedrigerer Regelaltersgrenze fällt der Abschlag entsprechend kleiner aus, weil weniger Monate zwischen 63 und der persönlichen Regelaltersgrenze liegen.",
  },
  {
    question:
      "Warum wirkt sich ein kleiner Abschlag über die Jahre so stark aus?",
    answer:
      "Weil er nicht einmalig abgezogen wird, sondern jeden einzelnen Monat der Rente kürzt, von der ersten bis zur letzten Zahlung. Ein Abschlag von 200 Euro im Monat klingt überschaubar, summiert sich über zwanzig Jahre Rentenbezug aber auf 48.000 Euro. Genau dieser kumulierte Betrag steht im Ergebnis, weil die monatliche Zahl allein die Tragweite der Entscheidung meist unterschätzen lässt.",
  },
  {
    question:
      "Gibt es eine Möglichkeit, ohne Abschlag früher in Rente zu gehen?",
    answer:
      "Ja, über die Altersrente für besonders langjährig Versicherte – bekannt als „Rente mit 63“ – bei mindestens 45 Beitragsjahren, zu denen unter anderem Pflichtbeiträge, Kindererziehungszeiten und bestimmte Zeiten der Arbeitslosigkeit zählen. Wie viele Jahre vor der Regelaltersgrenze das abschlagsfrei möglich ist, hängt ebenfalls vom Geburtsjahrgang ab und wird schrittweise enger. Dieser Rechner bildet nur die Altersrente für langjährig Versicherte mit Abschlag ab – wer nah an 45 Jahren liegt, sollte die abschlagsfreie Variante vorrangig prüfen.",
  },
  {
    question: "Kann ich den Abschlag später ausgleichen?",
    answer:
      "Ja, über eine Ausgleichszahlung an die Deutsche Rentenversicherung, mit der sich der Abschlag ganz oder teilweise zurückkaufen lässt – möglich frühestens ab 50 Jahren. Die Höhe der nötigen Einzahlung berechnet ausschließlich die Rentenversicherung individuell, weil sie vom bisherigen Versicherungsverlauf abhängt. Alternativ lässt sich ein absehbarer Abschlag auch durch privates Sparen auffangen, das über die Rentenbezugsdauer denselben Betrag ausgleicht.",
  },
  {
    question:
      "Fällt seit 2023 eine Hinzuverdienstgrenze bei vorgezogener Rente an?",
    answer:
      "Nein. Seit Januar 2023 ist die Hinzuverdienstgrenze für vorgezogene Altersrenten komplett entfallen – wer eine Rente mit Abschlag bezieht, darf unbegrenzt dazuverdienen, ohne dass die Rente gekürzt wird. Das war vorher anders und ist bei älteren Berechnungen oder Ratschlägen manchmal noch nicht berücksichtigt.",
  },
];

export const rentenabschlag: ToolManifest = {
  slug: "rentenabschlag",
  name: "Rentenabschlags-Rechner",
  tagline:
    "Regelaltersgrenze nach Geburtsjahrgang, Abschlag bei früherem und Zuschlag bei späterem Renteneintritt – mit dem lebenslangen Effekt in Euro.",
  category: "geld",
  icon: Hourglass,
  status: "live",
  keywords: [
    "rentenabschlag berechnen",
    "rentenabschlag rechner",
    "regelaltersgrenze rechner",
    "früher in rente abschlag",
    "rente mit 63 abschlag",
    "renteneintritt vorziehen",
    "rentenzuschlag berechnen",
    "regelaltersgrenze geburtsjahrgang",
  ],

  sections,

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: rentenabschlagAffiliate,
  },
};
