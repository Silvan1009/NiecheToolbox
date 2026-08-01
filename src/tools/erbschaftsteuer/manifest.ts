import { Scale } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { erbschaftsteuerAffiliate } from "./affiliate";
import Component from "./Component";

const about: string[] = [
  "Anders als bei den meisten Rechnern auf dieser Seite steht hinter jeder Zahl hier eine konkrete Gesetzesnorm statt eines Marktdurchschnitts: Die Erbschaftsteuer ist im Erbschaft- und Schenkungsteuergesetz auf den Cent genau geregelt. Drei Details daraus entscheiden über einen fünf- bis sechsstelligen Betrag und werden in den meisten Überschlagsrechnungen übersehen – deshalb bildet dieser Rechner sie ab, statt nur mit einem einzelnen Steuersatz zu multiplizieren.",
  "Das erste Detail betrifft Eltern und Großeltern: Sie wechseln als einzige Verwandtschaftsgruppe je nach Anlass die Steuerklasse. Bei einer Erbschaft gehören sie zur Steuerklasse I mit 100.000 Euro Freibetrag, bei einer Schenkung zu Lebzeiten dagegen zur Steuerklasse II mit nur 20.000 Euro. Bei 150.000 Euro macht das den Unterschied zwischen 2.450 Euro Steuer im Erbfall und 26.000 Euro bei einer Schenkung – mehr als das Zehnfache für denselben übertragenen Betrag.",
  "Das zweite Detail ist der Härteausgleich. Die Erbschaftsteuer kennt keinen Grenzsteuersatz wie die Einkommensteuer: Überschreitet der steuerpflichtige Erwerb eine Wertgrenze, gilt der höhere Satz für den gesamten Betrag, nicht nur für den Teil darüber. Ohne Korrektur könnte ein einziger Euro mehr Erbe mehrere Tausend Euro mehr Steuer auslösen – der Erbe stünde mit mehr Vermögen schlechter da als ohne. Genau das verhindert § 19 Abs. 3 ErbStG: Die Steuer aus dem Sprung wird gekappt, sodass mehr Erwerb nie zu weniger netto führt. Dieser Rechner wendet den Härteausgleich automatisch an, wo er greift, und zeigt die Ersparnis als eigene Zeile.",
  "Das dritte Detail ist der zeitliche Rahmen: Jeder Freibetrag lässt sich alle zehn Jahre erneut nutzen. Wer schon einmal an dieselbe Person geschenkt hat, muss den damals genutzten Betrag hier eintragen – sonst rechnet der Rechner mit einem zu hohen verbleibenden Freibetrag. Umgekehrt ist genau das der Hebel, mit dem sich große Vermögen in mehreren zeitlich gestaffelten Schenkungen steuerfrei übertragen lassen, wo eine einzelne Übertragung längst steuerpflichtig wäre.",
  "Nicht abgebildet sind Versorgungsfreibeträge für Ehepartner und Kinder, die Steuerbefreiung für ein selbst genutztes Familienheim, Verschonungsregeln für Betriebsvermögen sowie die genaue Zusammenrechnung mehrerer Vorerwerbe bei unterschiedlichen Werten – all das hängt zu stark vom Einzelfall ab, um es in einem allgemeinen Rechner seriös abzubilden. Bei größeren oder ungewöhnlichen Vermögen ersetzt dieser Rechner keine Steuerberatung, sondern zeigt die Größenordnung, um die es geht.",
];

const faq: FaqEntry[] = [
  {
    question: "Warum ändert sich bei Eltern und Großeltern die Steuerklasse?",
    answer:
      "Weil der Gesetzgeber Erbschaft und Schenkung an dieser einen Stelle unterschiedlich behandelt (§§ 15, 16 ErbStG). Bei allen anderen Verwandtschaftsgraden bleiben Steuerklasse und Freibetrag gleich, ob zu Lebzeiten verschenkt oder vererbt wird. Nur Eltern und Großeltern gehören bei einer Erbschaft zur günstigeren Steuerklasse I, bei einer Schenkung zu Lebzeiten aber zur Steuerklasse II. Wer die Wahl hat, sollte diesen Unterschied kennen, bevor er sich für eine Schenkung entscheidet.",
  },
  {
    question: "Was ist der Härteausgleich und wann greift er?",
    answer:
      "Er verhindert, dass das Überschreiten einer Wertgrenze mehr Steuer kostet, als überhaupt hinzugekommen ist. Weil die Erbschaftsteuer den gesamten Erwerb zum jeweils gültigen Satz besteuert statt nur den Teil oberhalb der Grenze, würde ein Erwerb knapp über einer Wertgrenze sonst überproportional stark besteuert. Der Härteausgleich (§ 19 Abs. 3 ErbStG) kappt diesen Sprung: Er greift automatisch, sobald ein steuerpflichtiger Erwerb eine der sieben Wertgrenzen nur um einen kleinen Betrag überschreitet, und wird in diesem Rechner als eigene Zeile ausgewiesen.",
  },
  {
    question: "Wie oft lässt sich der Freibetrag nutzen?",
    answer:
      "Alle zehn Jahre erneut, pro Schenker-Empfänger-Paar (§ 14 ErbStG). Schenkungen, die innerhalb dieser zehn Jahre an dieselbe Person gehen, werden zusammengerechnet und zehren denselben Freibetrag auf – erst danach steht er wieder in voller Höhe zur Verfügung. Das ist der Grund, warum größere Vermögensübertragungen oft über mehrere zeitlich gestaffelte Schenkungen laufen: Bei einem Kind mit 400.000 Euro Freibetrag lassen sich so über zwanzig Jahre 800.000 Euro steuerfrei übertragen, die auf einmal geschenkt längst steuerpflichtig wären.",
  },
  {
    question: "Was ist die Erbfallkostenpauschale?",
    answer:
      "Ein pauschaler Abzug von 15.000 Euro (seit 1. Januar 2025, zuvor 10.300 Euro) für Kosten, die typischerweise mit einem Erbfall zusammenhängen – etwa Bestattung, Grabstein oder Nachlassregelung. Sie wird ohne Einzelnachweis abgezogen und steht pro Erbfall einmal zur Verfügung, bei mehreren Erben aufgeteilt. Bei einer Schenkung zu Lebzeiten gibt es sie nicht, weil kein Erbfall vorliegt – dafür lassen sich dort tatsächlich entstandene Kosten in der Regel nicht pauschal absetzen.",
  },
  {
    question: "Warum wird der steuerpflichtige Erwerb auf 100 Euro abgerundet?",
    answer:
      "Weil § 10 Abs. 1 Satz 6 ErbStG das so vorschreibt – eine reine Vereinfachungsregel, die den Betrag vor der Anwendung des Steuersatzes auf volle 100 Euro nach unten rundet. In der Praxis bedeutet das: Ein Erwerb, der den Freibetrag nur um wenige Euro übersteigt, kann dadurch sogar vollständig steuerfrei bleiben.",
  },
  {
    question: "Sind Schulden und Bestattungskosten schon berücksichtigt?",
    answer:
      "Die Erbfallkostenpauschale von 15.000 Euro wird bei einer Erbschaft automatisch abgezogen, ohne dass sie eingetragen werden muss. Darüber hinausgehende Nachlassverbindlichkeiten – etwa noch offene Kredite des Erblassers, Pflichtteilsansprüche oder Kosten, die die Pauschale übersteigen – lassen sich zusätzlich im Feld „Nachlassverbindlichkeiten“ eintragen und mindern den steuerpflichtigen Erwerb in voller Höhe.",
  },
  {
    question: "Gilt die Steuerbefreiung fürs Familienheim hier schon?",
    answer:
      "Nein. Der überlebende Ehepartner und Kinder können eine selbst genutzte Immobilie unter bestimmten Voraussetzungen – vor allem eine mindestens zehnjährige Selbstnutzung danach – komplett steuerfrei erben (§ 13 Abs. 1 Nr. 4b und 4c ErbStG), unabhängig vom sonstigen Freibetrag. Das ist ein Sonderfall mit eigenen, strengen Bedingungen und deshalb hier nicht eingerechnet. Wer eine selbst genutzte Immobilie erbt, sollte diese Steuerbefreiung gesondert prüfen, bevor er sich auf das Ergebnis dieses Rechners verlässt.",
  },
];

export const erbschaftsteuer: ToolManifest = {
  slug: "erbschaftsteuer",
  name: "Erbschaft- und Schenkungsteuer-Rechner",
  tagline:
    "Freibetrag, Steuerklasse, Stufentarif und Härteausgleich nach dem ErbStG – mit dem Fallstrick bei Eltern und Großeltern.",
  category: "geld",
  icon: Scale,
  status: "live",
  keywords: [
    "erbschaftsteuer berechnen",
    "erbschaftsteuer rechner",
    "schenkungsteuer berechnen",
    "erbschaftsteuer freibetrag",
    "erbschaftsteuer steuerklasse",
    "härteausgleich erbschaftsteuer",
    "schenkung steuerfrei",
    "erbschaftsteuer tabelle",
  ],

  Component,

  about,
  faq,

  monetization: {
    adDensity: "medium",
    affiliate: erbschaftsteuerAffiliate,
  },
};
