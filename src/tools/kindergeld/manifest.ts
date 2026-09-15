import { Users } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { kindergeldAffiliate } from "./affiliate";
import { defaultInput, encodeKinder } from "./logic";
import { buildUebersichtSection } from "./uebersicht";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Kindergeld ist ein fester Monatsbetrag je Kind – 2026 sind es 259 Euro, einheitlich für jedes Kind. Die frühere Staffelung nach Reihenfolge wurde 2023 abgeschafft. Interessanter als der Monatsbetrag ist deshalb die Restlaufzeit: Ein Kind, das im nächsten Jahr volljährig wird, hat einen Restanspruch von wenigen tausend Euro, ein neugeborenes von 55.944. Dieser Rechner weist beides aus, je Kind und in der Summe.",
  "Gezahlt wird bis einschließlich des Monats, in dem das Kind achtzehn wird. Danach nur weiter, wenn das Kind eine Ausbildung oder ein Studium absolviert – dann bis 25 – oder ohne Ausbildungsplatz bei der Arbeitsagentur gemeldet ist, dann bis 21. Anders als bis zur Volljährigkeit läuft das nicht von allein: Die Familienkasse verlangt dafür jährlich einen Nachweis.",
  "Neben dem Kindergeld steht der Kinderfreibetrag, und man bekommt nicht beides. 2026 sind das 6.828 Euro für das sächliche Existenzminimum plus 2.928 Euro für Betreuung, Erziehung und Ausbildung, zusammen 9.756 Euro je Kind für beide Elternteile. Das Finanzamt prüft von Amts wegen, welche Variante günstiger ist, und setzt sie an. Gewinnt der Freibetrag, wird das gezahlte Kindergeld gegengerechnet – übrig bleibt die Differenz.",
  "Der Umschlagpunkt liegt 2026 bei Zusammenveranlagung mit einem Kind bei rund 86.000 Euro zu versteuerndem Einkommen. Wichtig ist dabei das Wort „zu versteuernd“: Das ist nicht das Bruttogehalt, sondern was nach Werbungskosten, Vorsorgeaufwendungen und Sonderausgaben übrig bleibt. Bei mehreren Kindern verschiebt sich die Schwelle nach oben, weil die Freibeträge das Einkommen in Zonen mit niedrigerem Grenzsteuersatz ziehen, das Kindergeld aber linear wächst.",
  "Eine Feinheit, an der Standardrechner regelmäßig scheitern: Solidaritätszuschlag und Kirchensteuer bemessen sich nach § 3 Abs. 2 SolZG immer nach der Einkommensteuer mit Kinderfreibetrag – auch dann, wenn die Günstigerprüfung zugunsten des Kindergelds ausgeht. Diese Entlastung gibt es also zusätzlich und nicht statt dessen. Der Rechner weist sie deshalb getrennt aus und zählt sie zur Gesamtentlastung hinzu.",
  "Die Günstigerprüfung hier ist eine Näherung. Sie rechnet mit dem zu versteuernden Einkommen und den Kinderfreibeträgen, aber ohne Entlastungsbetrag für Alleinerziehende, ohne Kinderbetreuungskosten als Sonderausgaben und ohne die Übertragung eines Freibetragsanteils auf den anderen Elternteil. Für die Größenordnung reicht das; für den Steuerbescheid nicht. Das hier ist keine Steuerberatung – verbindliche Auskünfte geben das Finanzamt, ein Lohnsteuerhilfeverein oder eine Steuerberatung.",
];

const sections: ContentSection[] = [
  {
    heading: "Bis wann Kindergeld gezahlt wird",
    blocks: [
      {
        type: "p",
        text: "Eine oft übersehene Regel betrifft die Lücke zwischen zwei Ausbildungsabschnitten, etwa zwischen Schulabschluss und Studienbeginn oder zwischen Ausbildung und Bundesfreiwilligendienst: Eine solche Übergangszeit von höchstens vier Monaten unterbricht den Kindergeldanspruch nicht (§ 32 Abs. 4 EStG), er läuft einfach weiter.",
      },
      {
        type: "note",
        text: "Dauert die Pause länger als vier Monate, entfällt der Anspruch für die überschüssige Zeit und lebt erst mit dem nächsten Ausbildungsabschnitt wieder auf.",
      },
    ],
  },
  {
    heading: "Kindergeld oder Kinderfreibetrag: die Günstigerprüfung",
    blocks: [
      {
        type: "p",
        text: "Im laufenden Jahr merken die meisten Eltern von dieser Unterscheidung nichts: Die Familienkasse zahlt das Kindergeld unabhängig davon monatlich aus. Erst der Steuerbescheid am Jahresende zeigt, ob stattdessen der Kinderfreibetrag angesetzt wurde – für viele überraschend, weil im Alltag nur die monatliche Überweisung sichtbar ist.",
      },
      {
        type: "table",
        caption: "Kinderfreibetrag 2026, je Kind für beide Elternteile",
        head: ["Bestandteil", "Betrag"],
        rows: [
          ["Sächliches Existenzminimum", "6.828 €"],
          ["Betreuung, Erziehung, Ausbildung", "2.928 €"],
          ["Summe", "9.756 €"],
        ],
      },
    ],
  },
  {
    heading: "Der Umschlagpunkt zum Freibetrag",
    blocks: [
      {
        type: "p",
        text: "Für unverheiratete Elternteile liegt der Umschlagpunkt strukturell niedriger: Ohne Zusammenveranlagung steht regulär nur der halbe Kinderfreibetrag zu, sofern er nicht ausdrücklich auf einen Elternteil übertragen wird. Wer das alleinige Sorgerecht hat oder das Kind überwiegend betreut, kann die Übertragung des anderen Elternteils beim Finanzamt beantragen.",
      },
      {
        type: "note",
        text: "Bei mehreren Kindern verschiebt sich die Schwelle nach oben, weil die Freibeträge das Einkommen in Zonen mit niedrigerem Grenzsteuersatz ziehen, das Kindergeld aber linear wächst.",
      },
    ],
  },
  {
    heading: "Soli und Kirchensteuer: eine oft übersehene Feinheit",
    blocks: [
      {
        type: "p",
        text: "Ein Beispiel macht die Feinheit greifbar: Fällt die Günstigerprüfung zugunsten des Kindergelds aus, bleibt trotzdem der Kinderfreibetrag als Rechengröße für Soli und Kirchensteuer bestehen. Bei einem zu versteuernden Einkommen, das ohne Kinderfreibetrag über der Soli-Freigrenze läge, mit Kinderfreibetrag aber knapp darunter, kann diese Regel den gesamten Solidaritätszuschlag entfallen lassen – zusätzlich zum ausgezahlten Kindergeld, nicht anstelle davon.",
      },
    ],
  },
  {
    heading: "Grenzen des Modells",
    blocks: [
      {
        type: "p",
        text: "Konkret nicht mitgerechnet ist etwa der Entlastungsbetrag für Alleinerziehende von 4.260 Euro im Jahr plus 240 Euro für jedes weitere Kind – eine eigene Steuerermäßigung, die parallel zum Kinderfreibetrag greifen kann und die Günstigerprüfung in solchen Fällen zusätzlich verschiebt.",
      },
      {
        type: "note",
        text: "Für die Größenordnung reicht die hier gezeigte Näherung; für den Steuerbescheid nicht. Das hier ist keine Steuerberatung – verbindliche Auskünfte geben das Finanzamt, ein Lohnsteuerhilfeverein oder eine Steuerberatung.",
      },
    ],
  },
  buildUebersichtSection(),
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Wie hoch ist das Kindergeld 2026?",
    answer:
      "259 Euro je Kind und Monat, einheitlich für jedes Kind. 2025 waren es 255 Euro, 2024 und 2023 jeweils 250 Euro. Für ein Kind sind das 3.108 Euro im Jahr, für zwei 6.216 und für drei 9.324 Euro.",
  },
  {
    question: "Bekomme ich Kindergeld und Kinderfreibetrag zusammen?",
    answer:
      "Nein, es gibt entweder das eine oder das andere. Das Finanzamt führt automatisch eine Günstigerprüfung durch und setzt die bessere Variante an. Gewinnt der Freibetrag, wird das gezahlte Kindergeld der Steuer wieder hinzugerechnet – du behältst die Differenz. Unabhängig davon senkt der Freibetrag immer Solidaritätszuschlag und Kirchensteuer.",
  },
  {
    question: "Bis wann wird Kindergeld gezahlt?",
    answer:
      "Bis einschließlich des Monats, in dem das Kind 18 wird. Bei Ausbildung oder Studium bis 25, bei gemeldeter Arbeitsuche ohne Ausbildungsplatz bis 21. Zwischen zwei Ausbildungsabschnitten werden bis zu vier Monate überbrückt; dauert die Lücke länger, entfällt der Anspruch für diese Monate.",
  },
  {
    question: "Was ist das zu versteuernde Einkommen?",
    answer:
      "Nicht das Bruttogehalt, sondern was davon nach Werbungskosten, Vorsorgeaufwendungen, Sonderausgaben und außergewöhnlichen Belastungen übrig bleibt. Die Zahl steht im letzten Steuerbescheid unter „zu versteuerndes Einkommen“. Bei Angestellten liegt sie oft 20 bis 30 Prozent unter dem Brutto – wer das Brutto einträgt, überschätzt den Steuervorteil deutlich.",
  },
  {
    question: "Was gilt bei getrennt lebenden Eltern?",
    answer:
      "Das Kindergeld wird in voller Höhe an den Elternteil gezahlt, bei dem das Kind lebt; der andere kann es beim Unterhalt zur Hälfte anrechnen. Der Kinderfreibetrag steht beiden je zur Hälfte zu. Deshalb rechnet dieser Rechner bei Einzelveranlagung auch nur das halbe Kindergeld gegen den halben Freibetrag – alles andere wäre kein fairer Vergleich.",
  },
  {
    question: "Rechnet das Tool auch den Kinderzuschlag?",
    answer:
      "Nein, und zwar bewusst nicht. Der Kinderzuschlag hängt vom Bürgergeld-Regelbedarf der Eltern und ihrem Anteil an der Warmmiete ab – Größen, die sich ohne die konkreten Wohnkosten nicht seriös schätzen lassen. Anspruch und Höhe klärt die Familienkasse; ein Rechner kann dort bestenfalls eine Vermutung liefern.",
  },
  {
    question: "Wo beantrage ich Kindergeld?",
    answer:
      "Bei der Familienkasse der Bundesagentur für Arbeit, online oder schriftlich. Nötig sind die Geburtsurkunde des Kindes und die Steuer-Identifikationsnummern von Kind und antragstellendem Elternteil. Wichtig ist die Frist: Rückwirkend wird nur für sechs Monate gezahlt – wer später beantragt, verliert die Monate davor endgültig.",
  },
  {
    question: "Ist das eine verbindliche Auskunft?",
    answer:
      "Nein. Der Rechner rechnet Beträge und Zeiträume aus und ersetzt keine Beratung. Die Günstigerprüfung hier lässt Entlastungsbetrag für Alleinerziehende, Betreuungskosten und Freibetragsübertragungen außen vor. Verbindlich sind allein Familienkasse und Finanzamt; steuerlich beraten dürfen Steuerberatung und Lohnsteuerhilfeverein.",
  },
];

export const kindergeld: ToolManifest = {
  slug: "kindergeld",
  name: "Kindergeld-Rechner",
  tagline:
    "Kindergeld für alle Kinder, die Restlaufzeit je Kind – und die Günstigerprüfung gegen den Kinderfreibetrag.",
  category: "familie",
  // `Baby` gehört dem Elternzeit-Planer; zwei Karten mit demselben Symbol
  // lesen sich wie ein Duplikat.
  icon: Users,
  status: "live",
  keywords: [
    "kindergeld berechnen",
    "kindergeld 2026",
    "kinderfreibetrag berechnen",
    "günstigerprüfung kinderfreibetrag",
    "kindergeld 3 kinder",
    "kindergeld studium",
    "kindergeld wie lange",
    "kinderfreibetrag 2026",
    "kindergeld anspruch",
  ],

  /*
   * Stichtag und Startkinder kommen vom Server: Beides hängt am aktuellen
   * Datum, und ein im Client berechneter Wert würde vom SSR-HTML abweichen.
   */
  getDefaultParams: () => {
    const start = defaultInput();
    return { heute: todayIso(), kinder: encodeKinder(start.kinder) };
  },
  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  sections,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: kindergeldAffiliate,
  },
};
