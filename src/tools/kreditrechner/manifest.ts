import { Landmark } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { kreditAffiliate } from "./affiliate";
import { variantenTexte } from "./varianten";

/* ---------------------------------------------------------------------------
 * Inhalte
 * ------------------------------------------------------------------------- */

const about: string[] = [
  "Die Monatsrate ist die unwichtigste Zahl eines Kreditangebots. Sie lässt sich beliebig kleinrechnen, indem die Laufzeit verlängert oder eine Schlussrate eingebaut wird – der Kredit wird dadurch nicht günstiger, sondern teurer. Was ein Kredit wirklich kostet, steht im effektiven Jahreszins und in der Summe aller Zahlungen. Dieser Rechner weist beides aus, dazu die Restschuld zu jedem Zeitpunkt und die Wirkung von Sondertilgungen.",
  "Der effektive Jahreszins ist die einzige Zahl, mit der sich zwei Angebote vergleichen lassen. Er entsteht aus der Barwertgleichung der Preisangabenverordnung: Gesucht ist der Zinssatz, bei dem die abgezinste Summe aller Raten genau dem entspricht, was tatsächlich ausgezahlt wird. Dadurch wirken alle Posten mit, die die Auszahlung mindern oder die Rate erhöhen – Bearbeitungsgebühr, Disagio, mitfinanzierte Restschuldversicherung. Allein die monatliche Verrechnung hebt einen Sollzins von 6,5 Prozent schon auf 6,70 Prozent effektiv.",
  "Am teuersten ist fast immer die Restschuldversicherung, und die Prämie verrät nicht, warum. Sie wird mitfinanziert: Sie erhöht die Schuld, aber nicht die Auszahlung, und wird über die gesamte Laufzeit mitverzinst. Bei einem Kredit über 10.000 Euro auf fünf Jahre treibt eine Prämie von 900 Euro den effektiven Jahreszins von 6,70 auf 10,65 Prozent – sie kostet also mehr als vier Prozentpunkte Zinsdifferenz. Ist die Versicherung nicht Bedingung für den Kredit, muss die Bank sie nicht einmal im Effektivzins ausweisen.",
  "Bei einer Baufinanzierung verschiebt sich die entscheidende Frage von der Rate zur Restschuld. Wer 300.000 Euro zu 3,5 Prozent mit 1.375 Euro im Monat bedient, hat nach zehn Jahren Zinsbindung 165.000 Euro gezahlt und schuldet immer noch 228.284 Euro – der Rest ging in Zinsen. Genau dieser Betrag muss zu einem heute unbekannten Zins neu finanziert werden. Deshalb rechnet dieser Rechner den Tilgungsplan monatsgenau und nicht über eine Jahresnäherung, die hier um Tausende danebenläge.",
  "Sondertilgungen wirken stärker, als ihr Betrag vermuten lässt, weil sie sämtliche künftigen Zinsen auf den getilgten Betrag streichen. Bei der Baufinanzierung von oben verkürzen jährlich 5.000 Euro die Laufzeit von 29 auf gut 19 Jahre und sparen 63.149 Euro Zinsen. Der Effekt ist am Anfang der Laufzeit am größten, weil die Restschuld dann am höchsten und die verbleibende Zeit am längsten ist. Ein Sondertilgungsrecht ist bei vielen Banken kostenlos zu haben – aber nur, wenn danach gefragt wird.",
  "Zwei Rechte gelten bei Verbraucherkrediten unabhängig vom Vertrag. Die vorzeitige Rückzahlung ist immer möglich; die Bank darf dafür höchstens 1 Prozent der zurückgezahlten Summe verlangen, bei weniger als zwölf Monaten Restlaufzeit höchstens 0,5 Prozent. Und jeder Kreditvertrag kann innerhalb von vierzehn Tagen ohne Begründung widerrufen werden. Bei Immobiliendarlehen gilt die Deckelung der Vorfälligkeitsentschädigung nicht – dafür darf nach § 489 BGB jedes Darlehen zehn Jahre nach Vollauszahlung mit sechs Monaten Frist gekündigt werden. Dieser Rechner ist keine Rechts- oder Finanzberatung.",
];

const sections: ContentSection[] = [
  {
    heading: "Der effektive Jahreszins",
    blocks: [
      {
        type: "p",
        text: "Gesetzlich vorgeschrieben ist die Angabe des effektiven Jahreszinses in jeder Werbung, die einen Zinssatz oder eine Zahl zu den Kreditkosten nennt (§ 6a PAngV) – ein reiner Sollzins ohne Effektivzins daneben darf in der Werbung nicht stehen. Trotzdem bleibt Spielraum: Kontoführungsgebühren für das Darlehenskonto zählen nur mit hinein, wenn die Kontoführung nicht unabhängig vom Kredit wählbar ist.",
      },
      {
        type: "note",
        text: "Auch die Laufzeit selbst verändert den Effektivzins bei sonst gleichen Konditionen leicht: Bei fester Bearbeitungsgebühr verteilt sich ihr Effekt über mehr oder weniger Jahre und verschiebt die Differenz zum Sollzins entsprechend.",
      },
    ],
  },
  {
    heading: "Restschuldversicherung: teuer und leicht zu übersehen",
    blocks: [
      {
        type: "p",
        text: "Häufig wird die Restschuldversicherung direkt am Verkaufsort mitangeboten, oft als vorausgefüllte Option im Vertrag – wer sie nicht ausdrücklich abwählt, zahlt automatisch mit. Ein genereller Zwang zum Abschluss besteht rechtlich nicht, außer die Bank macht ihn zur ausdrücklichen Bedingung für die Kreditvergabe.",
      },
      {
        type: "table",
        caption: "Beispiel: 10.000 Euro Kredit über fünf Jahre",
        head: ["", "Effektiver Jahreszins"],
        rows: [
          ["Ohne Restschuldversicherung", "6,70 %"],
          ["Mit 900 Euro mitfinanzierter Prämie", "10,65 %"],
        ],
      },
    ],
  },
  {
    heading: "Baufinanzierung: von der Rate zur Restschuld",
    blocks: [
      {
        type: "p",
        text: "Zum Ende der Zinsbindung stehen grundsätzlich zwei Wege offen: eine Anschlussfinanzierung bei der bisherigen Bank oder ein Wechsel zu einem neuen Anbieter, der die Restschuld ablöst. Wer sich früh festlegen will, kann ein Forward-Darlehen abschließen – bis zu fünf Jahre vor Ablauf der aktuellen Zinsbindung, gegen einen Zinsaufschlag für die Wartezeit.",
      },
      {
        type: "note",
        text: "Ein Bankwechsel bei der Anschlussfinanzierung ist rechtlich unkompliziert: Die neue Bank löst die Restschuld direkt bei der alten ab, ohne dass sich am Grundbuch mehr ändert als der Gläubiger der eingetragenen Grundschuld.",
      },
    ],
  },
  {
    heading: "Wirkung von Sondertilgungen",
    blocks: [
      {
        type: "p",
        text: "Üblich vereinbart ist ein kostenloses Sondertilgungsrecht von bis zu 5 Prozent der ursprünglichen Darlehenssumme pro Jahr – bei 300.000 Euro Darlehen also bis zu 15.000 Euro jährlich, ohne dass die Bank dafür eine Vorfälligkeitsentschädigung verlangen darf. Höhere Sondertilgungen sind oft ebenfalls möglich, aber Verhandlungssache und nicht automatisch im Standardvertrag enthalten.",
      },
    ],
  },
  {
    heading: "Gesetzliche Rechte bei Krediten",
    blocks: [
      {
        type: "ul",
        items: [
          "Vor jeder Kreditvergabe muss die Bank die Kreditwürdigkeit prüfen (§ 505a BGB) – ein Darlehen ohne jede Bonitätsprüfung ist in Deutschland nicht zulässig.",
          "Der Kreditvertrag muss den effektiven Jahreszins, die Gesamtkosten und den Tilgungsplan in verständlicher Form ausweisen, nicht nur die Monatsrate.",
          "Bei Immobiliendarlehen gilt die Deckelung der Vorfälligkeitsentschädigung nicht – dafür darf nach § 489 BGB jedes Darlehen zehn Jahre nach Vollauszahlung mit sechs Monaten Frist gekündigt werden.",
        ],
      },
      {
        type: "note",
        text: "Dieser Rechner ist keine Rechts- oder Finanzberatung.",
      },
    ],
  },
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie hoch darf meine Kreditrate sein?",
    answer:
      "Als Orientierung gilt, dass alle Kreditraten zusammen nicht mehr als 35 bis 40 Prozent des verfügbaren Nettoeinkommens ausmachen sollten. Banken rechnen strenger und setzen Haushaltspauschalen an, die je nach Region und Haushaltsgröße 700 bis 1.200 Euro betragen. Wichtiger als jede Faustregel ist die eigene Rechnung: Die Rate sollte auch in einem Monat mit Autoreparatur und Nebenkostennachzahlung tragbar bleiben.",
  },
  {
    question: "Warum ist der angebotene Zins höher als beworben?",
    answer:
      "Weil die meisten Angebote bonitätsabhängig sind, erkennbar an der Formulierung „ab X Prozent“. Der beworbene Satz gilt nur für die beste Bonitätsklasse; die tatsächliche Spanne reicht bei derselben Summe oft von 4 bis über 12 Prozent. Einfluss haben Schufa-Score, Höhe und Sicherheit des Einkommens, Beschäftigungsdauer und bestehende Verpflichtungen. Ein zweiter Kreditnehmer verbessert die Konditionen häufig deutlich, ebenso ein Verwendungszweck mit Sicherheit wie beim Autokredit.",
  },
  {
    question: "Was ist der Unterschied zwischen Sollzins und Effektivzins?",
    answer:
      "Der Sollzins ist der reine Zinssatz auf die Restschuld. Der effektive Jahreszins enthält zusätzlich alle zwingend mit dem Kredit verbundenen Kosten und den Effekt der monatlichen Verrechnung – also Bearbeitungsgebühren, Disagio, Vermittlungsprovisionen und eine verpflichtende Restschuldversicherung. Vergleichen lassen sich Angebote nur über den Effektivzins, und auch nur bei gleicher Laufzeit und gleicher Summe.",
  },
  {
    question: "Kann ich einen Kredit jederzeit vorzeitig zurückzahlen?",
    answer:
      "Bei Verbraucherkrediten ja, das Recht ist gesetzlich garantiert. Die Vorfälligkeitsentschädigung ist dabei gedeckelt auf 1 Prozent der zurückgezahlten Summe, bei einer Restlaufzeit unter zwölf Monaten auf 0,5 Prozent, und sie darf nie höher sein als die Zinsen, die sonst noch angefallen wären. Bei Immobiliendarlehen gilt diese Grenze nicht – dort wird der entgangene Zinsgewinn der Bank berechnet, was bei langen Restlaufzeiten fünfstellig werden kann.",
  },
  {
    question: "Schadet eine Kreditanfrage meinem Schufa-Score?",
    answer:
      "Es kommt auf die Art der Anfrage an. Eine „Anfrage Kreditkonditionen“ ist für andere Banken nicht sichtbar und beeinflusst den Score nicht – so lassen sich beliebig viele Angebote einholen. Eine „Anfrage Kredit“ dagegen wird gespeichert und ist zwölf Monate für andere Banken sichtbar. Seriöse Vergleichsportale stellen ausschließlich Konditionenanfragen; im Zweifel ausdrücklich danach fragen.",
  },
  {
    question: "Lohnt sich eine Restschuldversicherung?",
    answer:
      "In den meisten Fällen nicht. Sie ist teuer, die Leistungsfälle sind eng definiert, und Selbstständige sowie Menschen mit Vorerkrankungen sind oft faktisch ausgeschlossen. Wer den Todesfall absichern will, fährt mit einer Risikolebensversicherung fast immer günstiger und flexibler, weil sie nicht an einen einzelnen Kredit gebunden ist. Bei sehr großen Summen und alleinverdienenden Familien kann eine Absicherung sinnvoll sein – dann aber getrennt vom Kredit abgeschlossen und verglichen.",
  },
  {
    question: "Was ist eine Umschuldung und wann lohnt sie sich?",
    answer:
      "Eine Umschuldung löst einen bestehenden Kredit durch einen neuen, günstigeren ab. Sie lohnt sich, wenn der neue Effektivzins deutlich unter dem alten liegt und die Restlaufzeit lang genug ist – als Faustregel ab einem Prozentpunkt Differenz und mehr als zwei Jahren Restlaufzeit. Bei Dispokrediten lohnt sie fast immer, weil dort weiterhin 10 bis 13 Prozent üblich sind. Wichtig: die neue Laufzeit nicht länger wählen als die alte, sonst frisst die Verlängerung die Zinsersparnis auf.",
  },
  {
    question: "Ersetzt der Rechner ein Angebot der Bank?",
    answer:
      "Nein. Er rechnet exakt das Szenario durch, das du eingibst, und macht sichtbar, was einzelne Posten kosten. Er kennt weder deine Bonität noch die Konditionen, die eine konkrete Bank dir anbietet, und er bildet keine Bereitstellungszinsen, Kontogebühren oder Kosten für Sicherheiten ab. Für den Vergleich echter Angebote gilt: immer über den effektiven Jahreszins, bei gleicher Summe und gleicher Laufzeit. Dieser Rechner ist keine Finanzberatung.",
  },
];

/* ---------------------------------------------------------------------------
 * Manifest
 * ------------------------------------------------------------------------- */

export const kreditrechner: ToolManifest = {
  slug: "kreditrechner",
  name: "Kredit-Rechner",
  tagline:
    "Rate, Laufzeit und Tilgungsplan eines Kredits – mit effektivem Jahreszins nach PAngV, Restschuld zur Zinsbindung und der Wirkung von Sondertilgungen.",
  category: "geld",
  icon: Landmark,
  status: "live",
  keywords: [
    "kreditrechner",
    "ratenkredit rechner",
    "tilgungsplan berechnen",
    "effektiver jahreszins berechnen",
    "annuitätendarlehen berechnen",
    "restschuld berechnen",
    "sondertilgung rechner",
    "umschuldung rechner",
    "autokredit rechner",
    "monatsrate kredit berechnen",
  ],

  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  sections,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: kreditAffiliate,
  },
};
