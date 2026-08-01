/**
 * Inhalte der SEO-Unterseiten des Kindergeld-Rechners.
 *
 * Warum eigene Texte und nicht nur andere Startwerte: Varianten, die sich
 * inhaltlich nicht unterscheiden, sind aus Sicht einer AdSense-Prüfung „low
 * value content" – und aus Sicht eines Besuchers auch. Jede Seite hier
 * beantwortet ihre eigene Frage von vorn.
 *
 * Alle Zahlenbeispiele sind mit genau diesen Voreinstellungen gegen den
 * Einkommensteuertarif 2026 nachgerechnet. Bewusst genannt werden nur
 * zeitstabile Größen: Beträge, die vom heutigen Datum abhängen – etwa der
 * verbleibende Restanspruch eines bestimmten Kindes – veralten zwischen
 * Redaktion und Abruf und stehen deshalb nicht im Text.
 */

import type { FaqEntry, ToolParams } from "@/tools/types";

export interface VariantenText {
  slug: string;
  titel: string;
  beschreibung: string;
  heading: string;
  params: ToolParams;
  /** Drei eigene Absätze; der allgemeine Erklärtext folgt danach. */
  absaetze: string[];
  faq: FaqEntry[];
}

export const variantenTexte: VariantenText[] = [
  {
    slug: "kindergeld-2026",
    titel: "Kindergeld 2026: 259 Euro pro Kind – Höhe, Dauer und Anspruch",
    beschreibung:
      "Kindergeld 2026 beträgt 259 Euro je Kind und Monat. Rechner für alle Kinder, die Restlaufzeit je Kind und die Summe bis zum Ende des Anspruchs.",
    heading: "Kindergeld 2026",
    params: { jahr: 2026, kinder: "2019-05-10r" },
    absaetze: [
      "Zum 1. Januar 2026 ist das Kindergeld von 255 auf 259 Euro je Kind und Monat gestiegen. Der Betrag gilt einheitlich für jedes Kind – die früheren Staffelungen nach Reihenfolge sind seit 2023 abgeschafft. Für ein Kind sind das 3.108 Euro im Jahr, und über die vollen achtzehn Jahre bis zur Volljährigkeit summiert sich der Anspruch auf 55.944 Euro. Damit ist Kindergeld für die meisten Familien die größte planbare Einnahme überhaupt.",
      "Die Erhöhung erfolgt automatisch. Wer bereits Kindergeld bezieht, muss nichts tun und bekommt ab Januar den höheren Betrag überwiesen – ein neuer Antrag ist ausdrücklich nicht nötig. Ausgezahlt wird von der Familienkasse der Bundesagentur für Arbeit, bei Beschäftigten im öffentlichen Dienst teils von der eigenen Bezügestelle.",
      "Interessanter als der Monatsbetrag ist bei einem laufenden Anspruch die Restlaufzeit. Gezahlt wird bis einschließlich des Monats, in dem das Kind achtzehn wird – bei Ausbildung oder Studium bis 25, bei gemeldeter Arbeitsuche bis 21. Der Rechner weist deshalb je Kind aus, bis wann der Anspruch läuft, wie viele Zahlungsmonate das noch sind und welche Summe daraus folgt.",
    ],
    faq: [
      {
        question: "Wie hoch ist das Kindergeld 2026?",
        answer:
          "259 Euro je Kind und Monat, einheitlich für jedes Kind. 2025 waren es 255 Euro, 2024 und 2023 jeweils 250 Euro. Für ein Kind ergeben sich 3.108 Euro im Jahr, für zwei Kinder 6.216 Euro und für drei Kinder 9.324 Euro.",
      },
      {
        question: "Muss ich einen neuen Antrag stellen?",
        answer:
          "Nein. Die Erhöhung wird von der Familienkasse automatisch umgesetzt. Ein Antrag ist nur bei der Geburt eines Kindes nötig sowie dann, wenn ein volljähriges Kind weiter berücksichtigt werden soll – dafür braucht die Familienkasse einen Nachweis über Ausbildung, Studium oder Arbeitsuche.",
      },
      {
        question: "Bis wann wird Kindergeld gezahlt?",
        answer:
          "Grundsätzlich bis einschließlich des Monats, in dem das Kind 18 wird. Danach nur weiter, wenn das Kind eine Ausbildung oder ein Studium absolviert – dann bis 25 – oder ohne Ausbildungsplatz bei der Arbeitsagentur gemeldet ist, dann bis 21. Eine Übergangszeit zwischen zwei Ausbildungsabschnitten wird bis zu vier Monate überbrückt.",
      },
    ],
  },

  {
    slug: "kinderfreibetrag-berechnen",
    titel: "Kinderfreibetrag 2026 berechnen: 9.756 Euro und was sie bringen",
    beschreibung:
      "Kinderfreibetrag 2026 berechnen: 6.828 Euro plus 2.928 Euro Betreuungsfreibetrag. Mit Steuervorteil, Günstigerprüfung und Wirkung auf Soli und Kirchensteuer.",
    heading: "Kinderfreibetrag berechnen",
    params: { zve: 90000, ver: "zusammen", kinder: "2019-05-10r" },
    absaetze: [
      "Der Kinderfreibetrag besteht 2026 aus zwei Teilen: 6.828 Euro für das sächliche Existenzminimum des Kindes und 2.928 Euro für Betreuung, Erziehung und Ausbildung. Zusammen sind das 9.756 Euro je Kind für beide Elternteile. Bei Einzelveranlagung steht jedem Elternteil die Hälfte zu, also 4.878 Euro. Der Freibetrag mindert nicht die Auszahlung, sondern das zu versteuernde Einkommen – seine Wirkung hängt deshalb vom Steuersatz ab.",
      "Bei 90.000 Euro zu versteuerndem Einkommen und Zusammenveranlagung sieht die Rechnung so aus: ohne Freibetrag 17.670 Euro Einkommensteuer, mit Freibetrag 14.496 Euro. Der Steuervorteil beträgt damit 3.174 Euro – gerade eben mehr als die 3.108 Euro Kindergeld. Das Finanzamt setzt hier also den Freibetrag an und rechnet das gezahlte Kindergeld gegen; unterm Strich bleiben 66 Euro mehr im Jahr.",
      "Dieses Beispiel liegt fast genau auf dem Umschlagpunkt, der 2026 bei Zusammenveranlagung mit einem Kind bei rund 86.000 Euro zu versteuerndem Einkommen liegt. Darunter gewinnt das Kindergeld, darüber der Freibetrag – und je weiter darüber, desto deutlicher, weil der Grenzsteuersatz steigt. Wichtig dabei: Das ist zu versteuerndes Einkommen, nicht Bruttogehalt. Zwischen beiden liegen Werbungskosten, Vorsorgeaufwendungen und Sonderausgaben, bei Angestellten typischerweise ein gutes Stück.",
    ],
    faq: [
      {
        question: "Wie hoch ist der Kinderfreibetrag 2026?",
        answer:
          "9.756 Euro je Kind für beide Elternteile zusammen: 6.828 Euro Kinderfreibetrag plus 2.928 Euro Freibetrag für Betreuung, Erziehung und Ausbildung. Bei Einzelveranlagung erhält jeder Elternteil die Hälfte, also 4.878 Euro.",
      },
      {
        question: "Bekomme ich Kindergeld und Kinderfreibetrag zusammen?",
        answer:
          "Nein, es gibt entweder das eine oder das andere. Das Finanzamt führt von Amts wegen eine Günstigerprüfung durch und setzt die für dich bessere Variante an. Fällt sie zugunsten des Freibetrags aus, wird das bereits gezahlte Kindergeld der Steuer wieder hinzugerechnet – du behältst also nur die Differenz.",
      },
      {
        question: "Ab welchem Einkommen lohnt sich der Kinderfreibetrag?",
        answer:
          "2026 bei Zusammenveranlagung mit einem Kind ab rund 86.000 Euro zu versteuerndem Einkommen. Mit zwei Kindern liegt die Schwelle etwas höher, weil sich Freibetrag und Kindergeld gemeinsam verdoppeln, der Grenzsteuersatz aber nicht. Bei Einzelveranlagung liegt sie deutlich tiefer, weil dort beide Seiten halbiert werden.",
      },
    ],
  },

  {
    slug: "guenstigerpruefung-kinderfreibetrag",
    titel: "Günstigerprüfung: Kinderfreibetrag oder Kindergeld – was ist besser?",
    beschreibung:
      "Die Günstigerprüfung des Finanzamts nachrechnen: Kinderfreibetrag gegen Kindergeld, inklusive der Wirkung auf Solidaritätszuschlag und Kirchensteuer.",
    heading: "Günstigerprüfung: Freibetrag oder Kindergeld",
    params: {
      zve: 120000,
      ver: "zusammen",
      kinder: "2019-05-10r,2022-01-20r",
    },
    absaetze: [
      "Die Günstigerprüfung ist kein Antrag, sondern ein Automatismus: Das Finanzamt rechnet bei jeder Steuererklärung beide Varianten durch und setzt die bessere an. Verglichen wird der Steuervorteil aus dem Kinderfreibetrag mit dem Anspruch auf Kindergeld – nicht mit dem tatsächlich Gezahlten. Wer Kindergeld zu beantragen vergessen hat, verliert deshalb doppelt: Das Geld fließt nicht, wird aber trotzdem gegengerechnet.",
      "Für zwei Kinder und 120.000 Euro zu versteuerndes Einkommen bei Zusammenveranlagung ergibt sich: Freibeträge von zusammen 19.512 Euro senken die Einkommensteuer von 28.466 auf 21.268 Euro, also um 7.198 Euro. Dem stehen 6.216 Euro Kindergeld für zwei Kinder gegenüber. Der Freibetrag gewinnt hier um 982 Euro im Jahr – ein Betrag, der ohne Steuererklärung schlicht verfällt.",
      "Eine Feinheit, an der viele Rechner scheitern: Solidaritätszuschlag und Kirchensteuer bemessen sich nach § 3 Abs. 2 SolZG immer nach der Steuer mit Kinderfreibetrag – unabhängig davon, wie die Günstigerprüfung ausgeht. Diese Entlastung kommt also zum Kindergeld hinzu und nicht statt dessen. Sie fällt allerdings erst ins Gewicht, wenn die Einkommensteuer die Soli-Freigrenze überschreitet, die bei Zusammenveranlagung bei 40.700 Euro Steuer liegt. Bei der Kirchensteuer wirkt sie dagegen ab dem ersten Euro.",
    ],
    faq: [
      {
        question: "Was ist die Günstigerprüfung?",
        answer:
          "Der automatische Vergleich des Finanzamts zwischen dem Steuervorteil aus dem Kinderfreibetrag und dem Anspruch auf Kindergeld. Die günstigere Variante wird angesetzt. Du musst dafür nichts beantragen – wohl aber eine Steuererklärung abgeben, sonst findet die Prüfung gar nicht statt.",
      },
      {
        question: "Wird das Kindergeld angerechnet, wenn der Freibetrag gewinnt?",
        answer:
          "Ja. Fällt die Prüfung zugunsten des Freibetrags aus, erhöht das Finanzamt die festgesetzte Einkommensteuer um den Kindergeldanspruch. Im Ergebnis bleibt dir nur die Differenz zwischen beiden – in diesem Beispiel 982 Euro. Angerechnet wird immer der Anspruch, auch wenn tatsächlich kein Kindergeld geflossen ist.",
      },
      {
        question: "Senkt der Kinderfreibetrag auch Soli und Kirchensteuer?",
        answer:
          "Ja, und zwar immer – auch dann, wenn das Kindergeld die Günstigerprüfung gewinnt. Bemessungsgrundlage für beide ist stets die Einkommensteuer mit Kinderfreibetrag. Bei der Kirchensteuer wirkt das ab dem ersten Euro, beim Solidaritätszuschlag erst oberhalb der Freigrenze von 20.350 Euro Steuer, bei Zusammenveranlagung 40.700 Euro.",
      },
    ],
  },

  {
    slug: "kindergeld-3-kinder",
    titel: "Kindergeld für 3 Kinder: 777 Euro im Monat – Höhe und Freibeträge",
    beschreibung:
      "Kindergeld für drei Kinder berechnen: 777 Euro im Monat, 9.324 Euro im Jahr. Mit Günstigerprüfung gegen den dreifachen Kinderfreibetrag.",
    heading: "Kindergeld für 3 Kinder",
    params: { kinder: "2015-04-02r,2018-09-11r,2021-06-30r" },
    absaetze: [
      "Seit 2023 ist das Kindergeld für alle Kinder gleich hoch – die frühere Staffelung, bei der das dritte Kind mehr brachte als das erste, gibt es nicht mehr. Für drei Kinder sind das 2026 dreimal 259 Euro, also 777 Euro im Monat und 9.324 Euro im Jahr. Weil die Kinder unterschiedlich alt sind, endet der Anspruch gestaffelt: Der Rechner weist deshalb je Kind aus, bis wann gezahlt wird und welche Summe für dieses Kind noch aussteht.",
      "Bei der Günstigerprüfung dreht die Kinderzahl das Ergebnis zugunsten des Kindergelds. Der Grund ist der progressive Tarif: Drei Freibeträge von zusammen 29.268 Euro schieben das zu versteuernde Einkommen weit nach unten, in Zonen mit niedrigerem Grenzsteuersatz – der Vorteil je Freibetrag sinkt also mit jedem weiteren. Das Kindergeld dagegen wächst linear. Bei 60.000 Euro zu versteuerndem Einkommen und Zusammenveranlagung stehen 7.424 Euro Steuervorteil gegen 9.324 Euro Kindergeld: Das Kindergeld gewinnt um 1.900 Euro.",
      "Ab drei Kindern kommen Leistungen in Betracht, die dieser Rechner bewusst nicht abbildet, weil sie von Wohnkosten und Einkommen im Einzelfall abhängen: der Kinderzuschlag für Familien mit kleinem Erwerbseinkommen, das Bildungs- und Teilhabepaket sowie in einigen Bundesländern eigene Familienleistungen. Wer nahe an den jeweiligen Einkommensgrenzen liegt, sollte sie prüfen lassen – die Familienkasse berät dazu kostenfrei.",
    ],
    faq: [
      {
        question: "Wie viel Kindergeld gibt es für 3 Kinder?",
        answer:
          "777 Euro im Monat und 9.324 Euro im Jahr – dreimal 259 Euro. Seit 2023 ist der Betrag für jedes Kind gleich; die frühere Staffelung nach Reihenfolge wurde abgeschafft.",
      },
      {
        question: "Gibt es für das dritte Kind mehr Geld?",
        answer:
          "Nein, nicht mehr. Bis 2022 stieg das Kindergeld ab dem dritten Kind, seit 2023 gilt für alle Kinder derselbe Betrag. Wer mehrere Kinder hat, profitiert dafür in der Günstigerprüfung meist stärker vom Kindergeld als vom Freibetrag.",
      },
      {
        question: "Ab wann lohnt sich der Freibetrag bei drei Kindern?",
        answer:
          "Deutlich später als bei einem Kind. Drei Freibeträge senken das zu versteuernde Einkommen um 29.268 Euro und ziehen es damit in Tarifzonen mit niedrigerem Grenzsteuersatz – der Vorteil je Kind sinkt also. Bei 60.000 Euro zu versteuerndem Einkommen gewinnt das Kindergeld hier klar; die Schwelle liegt bei drei Kindern erst im sechsstelligen Bereich.",
      },
    ],
  },

  {
    slug: "kindergeld-studium",
    titel: "Kindergeld im Studium: bis 25 Jahre – Voraussetzungen und Dauer",
    beschreibung:
      "Kindergeld für Studierende und Auszubildende bis zum 25. Geburtstag: Anspruchsdauer, Zweitausbildung und was bei einem Nebenjob gilt.",
    heading: "Kindergeld im Studium",
    params: { kinder: "2005-03-15a" },
    absaetze: [
      "Für ein Kind in Ausbildung oder Studium wird Kindergeld bis einschließlich des Monats gezahlt, in dem es 25 Jahre alt wird. Das sind gegenüber der regulären Grenze von 18 sieben zusätzliche Jahre und damit 21.756 Euro. Anders als bis zur Volljährigkeit läuft das nicht automatisch: Die Familienkasse braucht einen Nachweis – die Immatrikulationsbescheinigung oder den Ausbildungsvertrag – und fordert ihn in der Regel jährlich erneut an.",
      "Als Ausbildung zählt jede Maßnahme, die auf einen Beruf vorbereitet: Studium, betriebliche Ausbildung, Schule, Fachschule, aber auch ein freiwilliges soziales oder ökologisches Jahr und der Bundesfreiwilligendienst. Zwischen zwei Ausbildungsabschnitten überbrückt die Familienkasse bis zu vier Monate. Wird diese Lücke länger – etwa durch ein Wartesemester –, entfällt der Anspruch für die dazwischenliegenden Monate und lebt danach wieder auf.",
      "Ein Nebenjob ist während der ersten Ausbildung unschädlich, unabhängig vom Verdienst. Nach einem abgeschlossenen Erststudium oder einer abgeschlossenen Erstausbildung wird es strenger: Dann darf die Erwerbstätigkeit 20 Wochenstunden nicht dauerhaft überschreiten, sonst entfällt der Anspruch. Ausbildungsdienstverhältnisse und Minijobs bleiben dabei außen vor. Ein Masterstudium, das auf den Bachelor aufbaut, gilt in der Regel noch als Teil der Erstausbildung – diese Einordnung entscheidet über mehrere tausend Euro und lohnt die genaue Prüfung.",
    ],
    faq: [
      {
        question: "Wie lange gibt es Kindergeld im Studium?",
        answer:
          "Bis einschließlich des Monats, in dem das Kind 25 Jahre alt wird. Eine Verlängerung darüber hinaus gibt es nur für Zeiten eines geleisteten Wehr- oder Zivildienstes; das freiwillige soziale Jahr verlängert nicht, wird aber selbst als Ausbildungszeit anerkannt.",
      },
      {
        question: "Darf mein Kind neben dem Studium arbeiten?",
        answer:
          "Während der ersten Ausbildung oder des Erststudiums ja, ohne Verdienstgrenze. Nach einem abgeschlossenen Erstabschluss darf die Erwerbstätigkeit dauerhaft nicht mehr als 20 Wochenstunden betragen, sonst entfällt der Anspruch. Ausbildungsdienstverhältnisse und geringfügige Beschäftigungen zählen nicht mit.",
      },
      {
        question: "Gilt der Master noch als Erstausbildung?",
        answer:
          "In der Regel ja, wenn er inhaltlich auf dem Bachelor aufbaut und zeitlich unmittelbar folgt – dann bleibt ein Nebenjob unschädlich. Wird zwischen beiden längere Zeit gearbeitet oder ein fachfremder Master begonnen, wertet die Familienkasse ihn als Zweitausbildung mit der 20-Stunden-Grenze.",
      },
    ],
  },
];
