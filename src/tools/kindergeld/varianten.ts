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

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  {
    slug: "guenstigerpruefung-kinderfreibetrag",
    title:
      "Günstigerprüfung: Kinderfreibetrag oder Kindergeld – was ist besser?",
    description:
      "Die Günstigerprüfung des Finanzamts nachrechnen: Kinderfreibetrag gegen Kindergeld, inklusive der Wirkung auf Solidaritätszuschlag und Kirchensteuer.",
    heading: "Günstigerprüfung: Freibetrag oder Kindergeld",
    params: {
      zve: 120000,
      ver: "zusammen",
      kinder: "2019-05-10r,2022-01-20r",
    },
    about: [
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
        question:
          "Wird das Kindergeld angerechnet, wenn der Freibetrag gewinnt?",
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
    slug: "kindergeld-studium",
    title: "Kindergeld im Studium: bis 25 Jahre – Voraussetzungen und Dauer",
    description:
      "Kindergeld für Studierende und Auszubildende bis zum 25. Geburtstag: Anspruchsdauer, Zweitausbildung und was bei einem Nebenjob gilt.",
    heading: "Kindergeld im Studium",
    params: { kinder: "2005-03-15a" },
    about: [
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
