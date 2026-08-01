import { Users } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { kindergeldAffiliate } from "./affiliate";
import Component from "./Component";
import { defaultInput, encodeKinder } from "./logic";
import { variantenTexte } from "./varianten";

const about: string[] = [
  "Kindergeld ist ein fester Monatsbetrag je Kind – 2026 sind es 259 Euro, einheitlich für jedes Kind. Die frühere Staffelung nach Reihenfolge wurde 2023 abgeschafft. Interessanter als der Monatsbetrag ist deshalb die Restlaufzeit: Ein Kind, das im nächsten Jahr volljährig wird, hat einen Restanspruch von wenigen tausend Euro, ein neugeborenes von 55.944. Dieser Rechner weist beides aus, je Kind und in der Summe.",
  "Gezahlt wird bis einschließlich des Monats, in dem das Kind achtzehn wird. Danach nur weiter, wenn das Kind eine Ausbildung oder ein Studium absolviert – dann bis 25 – oder ohne Ausbildungsplatz bei der Arbeitsagentur gemeldet ist, dann bis 21. Anders als bis zur Volljährigkeit läuft das nicht von allein: Die Familienkasse verlangt dafür jährlich einen Nachweis.",
  "Neben dem Kindergeld steht der Kinderfreibetrag, und man bekommt nicht beides. 2026 sind das 6.828 Euro für das sächliche Existenzminimum plus 2.928 Euro für Betreuung, Erziehung und Ausbildung, zusammen 9.756 Euro je Kind für beide Elternteile. Das Finanzamt prüft von Amts wegen, welche Variante günstiger ist, und setzt sie an. Gewinnt der Freibetrag, wird das gezahlte Kindergeld gegengerechnet – übrig bleibt die Differenz.",
  "Der Umschlagpunkt liegt 2026 bei Zusammenveranlagung mit einem Kind bei rund 86.000 Euro zu versteuerndem Einkommen. Wichtig ist dabei das Wort „zu versteuernd“: Das ist nicht das Bruttogehalt, sondern was nach Werbungskosten, Vorsorgeaufwendungen und Sonderausgaben übrig bleibt. Bei mehreren Kindern verschiebt sich die Schwelle nach oben, weil die Freibeträge das Einkommen in Zonen mit niedrigerem Grenzsteuersatz ziehen, das Kindergeld aber linear wächst.",
  "Eine Feinheit, an der Standardrechner regelmäßig scheitern: Solidaritätszuschlag und Kirchensteuer bemessen sich nach § 3 Abs. 2 SolZG immer nach der Einkommensteuer mit Kinderfreibetrag – auch dann, wenn die Günstigerprüfung zugunsten des Kindergelds ausgeht. Diese Entlastung gibt es also zusätzlich und nicht statt dessen. Der Rechner weist sie deshalb getrennt aus und zählt sie zur Gesamtentlastung hinzu.",
  "Die Günstigerprüfung hier ist eine Näherung. Sie rechnet mit dem zu versteuernden Einkommen und den Kinderfreibeträgen, aber ohne Entlastungsbetrag für Alleinerziehende, ohne Kinderbetreuungskosten als Sonderausgaben und ohne die Übertragung eines Freibetragsanteils auf den anderen Elternteil. Für die Größenordnung reicht das; für den Steuerbescheid nicht. Das hier ist keine Steuerberatung – verbindliche Auskünfte geben das Finanzamt, ein Lohnsteuerhilfeverein oder eine Steuerberatung.",
];

const allgemeineFaq: FaqEntry[] = [
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

  Component,
  /*
   * Stichtag und Startkinder kommen vom Server: Beides hängt am aktuellen
   * Datum, und ein im Client berechneter Wert würde vom SSR-HTML abweichen.
   */
  getDefaultParams: () => {
    const start = defaultInput();
    return { heute: todayIso(), kinder: encodeKinder(start.kinder) };
  },
  getVariants: () => buildVariants(variantenTexte, about, allgemeineFaq),

  about,
  faq: allgemeineFaq,

  monetization: {
    adDensity: "medium",
    affiliate: kindergeldAffiliate,
  },
};
