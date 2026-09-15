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
      "Der Umschlagpunkt, ab dem der Freibetrag das Kindergeld übertrifft, liegt nicht bei einer festen Einkommensgrenze, sondern verschiebt sich mit der Zahl der Kinder und der Veranlagungsart. Bei einem Kind und Zusammenveranlagung liegt er 2026 bei einem zu versteuernden Einkommen von rund 86.000 Euro; bei zwei Kindern verschiebt er sich wegen der doppelten Freibetragswirkung auf ein niedrigeres Einkommen je Kind, weil beide Freibeträge gemeinsam schneller in eine höhere Progressionsstufe hineinwirken. Bei Einzelveranlagung ohne Übertragung des halben Freibetrags liegt die Schwelle wiederum deutlich höher, weil nur der halbe Freibetrag zur Verfügung steht. Wer nahe an dieser Schwelle liegt, für den lohnt sich die Steuererklärung besonders genau nachzurechnen, weil dort schon kleine Einkommensschwankungen darüber entscheiden können, welche Variante gewinnt.",
    ],
    faq: [
      {
        question: "Bei welchem Einkommen gewinnt der Kinderfreibetrag?",
        answer:
          "Es gibt keine einzelne feste Grenze – der Umschlagpunkt hängt von der Kinderzahl und der Veranlagungsart ab. Bei Zusammenveranlagung und einem Kind liegt er 2026 bei rund 86.000 Euro zu versteuerndem Einkommen, bei mehreren Kindern verschiebt er sich, weil zusätzliche Freibeträge zusammen schneller in eine höhere Progressionsstufe wirken. Bei Einzelveranlagung ohne übertragenen halben Freibetrag liegt die Schwelle deutlich höher, weil pro Elternteil nur der halbe Freibetrag zählt. In der Nähe dieser Grenze entscheidet oft schon eine kleine Einkommensschwankung darüber, welche Variante das Finanzamt ansetzt.",
      },
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
      {
        question: "Muss ich die Günstigerprüfung selbst beantragen?",
        answer:
          "Nein, sie läuft automatisch bei jeder abgegebenen Einkommensteuererklärung, in der Kinder eingetragen sind – ein gesonderter Antrag ist nicht nötig und in den Steuerformularen auch nicht vorgesehen. Voraussetzung ist allein, dass überhaupt eine Steuererklärung abgegeben wird: Wer als Angestellter dazu nicht verpflichtet ist und keine freiwillige Erklärung einreicht, bekommt die Prüfung nicht und damit im Zweifel weniger, als ihm zustünde. Gerade bei höheren Einkommen mit mehreren Kindern lohnt sich deshalb eine freiwillige Steuererklärung allein wegen dieser automatischen Prüfung, selbst wenn sonst keine steuerliche Pflicht dazu besteht.",
      },
      {
        question: "Was passiert bei drei oder mehr Kindern mit der Günstigerprüfung?",
        answer:
          "Die Freibeträge summieren sich linear mit der Kinderzahl, das Kindergeld ebenfalls seit der Abschaffung der Staffelung nach Geschwisterreihenfolge – trotzdem verschiebt sich der Umschlagpunkt zugunsten des Freibetrags mit jedem weiteren Kind tendenziell nach unten. Der Grund liegt in der Steuerprogression: Mehrere Freibeträge zusammen mindern das zu versteuernde Einkommen stärker und wirken damit häufiger auch auf höhere Grenzsteuersätze, während das Kindergeld je Kind unverändert bleibt. Bei drei oder mehr Kindern lohnt sich die genaue Nachrechnung deshalb besonders, weil der Vorteil des Freibetrags gegenüber wenigen Kindern spürbar zunehmen kann.",
      },
      {
        question: "Wie wirkt sich die Günstigerprüfung bei getrennter Veranlagung aus?",
        answer:
          "Bei Einzelveranlagung steht jedem Elternteil regulär nur der halbe Kinderfreibetrag zu, was den Umschlagpunkt zugunsten des Freibetrags gegenüber der Zusammenveranlagung nach oben verschiebt – es braucht ein höheres Einkommen, bis sich der halbe Freibetrag gegenüber dem hälftigen Kindergeldanspruch lohnt. Lebt ein Elternteil im Ausland oder zahlt keinen Unterhalt, kann der volle Freibetrag auf Antrag auf den anderen Elternteil übertragen werden, wodurch sich die Rechnung wieder der bei Zusammenveranlagung annähert. Diese Übertragung muss beim Finanzamt gesondert beantragt werden und geschieht nicht automatisch.",
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
      "Ein häufiger Sonderfall ist ein Auslandsstudium oder ein Auslandssemester: Der Kindergeldanspruch bleibt grundsätzlich bestehen, solange das Kind weiterhin an einer deutschen Hochschule eingeschrieben ist oder das Auslandsstudium als gleichwertig anerkannt wird und innerhalb der EU beziehungsweise des EWR stattfindet. Bei einem Studium außerhalb der EU wird zusätzlich geprüft, ob noch ein Inlandswohnsitz besteht – etwa das Kinderzimmer bei den Eltern, das während des Auslandsaufenthalts weiter genutzt wird. Fehlt dieser Bezug zum Inland vollständig und ist auch keine deutsche Immatrikulation mehr vorhanden, kann der Anspruch für die Dauer des Auslandsaufenthalts entfallen. Wer einen mehrsemestrigen Auslandsaufenthalt plant, sollte das vorab mit der Familienkasse klären, statt es nachträglich zu korrigieren.",
    ],
    faq: [
      {
        question: "Gibt es Kindergeld während eines Auslandssemesters?",
        answer:
          "In der Regel ja, solange die Immatrikulation an einer deutschen Hochschule bestehen bleibt oder das Auslandsstudium als gleichwertig anerkannt ist und innerhalb der EU beziehungsweise des EWR stattfindet. Bei einem Studium außerhalb der EU prüft die Familienkasse zusätzlich, ob noch ein Inlandswohnsitz besteht, etwa das Kinderzimmer bei den Eltern. Fehlt sowohl die deutsche Immatrikulation als auch ein Inlandsbezug vollständig, kann der Anspruch für die Auslandszeit entfallen. Bei mehrsemestrigen Auslandsaufenthalten empfiehlt sich eine vorherige Rückfrage bei der zuständigen Familienkasse, um Überraschungen bei der nächsten Nachweisprüfung zu vermeiden.",
      },
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
      {
        question: "Welche Nachweise verlangt die Familienkasse während des Studiums?",
        answer:
          "In der Regel jährlich eine aktuelle Immatrikulationsbescheinigung der Hochschule, manchmal ergänzt um einen Nachweis der bisherigen Studiendauer oder eine Erklärung zum Ausbildungsstand. Ohne fristgerecht eingereichten Nachweis stellt die Familienkasse die Zahlung vorübergehend ein, bis die Unterlagen nachgereicht sind – rückwirkend wird dann aber in der Regel nachgezahlt, sofern die Voraussetzungen tatsächlich vorlagen. Bei einem Wechsel der Hochschule, einer Unterbrechung oder einem Fachwechsel ist es sinnvoll, die Familienkasse von sich aus zu informieren, statt auf die nächste turnusmäßige Nachweisanforderung zu warten.",
      },
      {
        question: "Wer bekommt das Kindergeld ausgezahlt, wenn das Kind volljährig ist?",
        answer:
          "Grundsätzlich weiterhin der antragstellende Elternteil, bei dem das Kind gemeldet ist oder überwiegend lebt – die Volljährigkeit ändert daran nichts Automatisches. Zieht das Kind während des Studiums aus, etwa in eine eigene Wohnung oder ein Wohnheim am Studienort, bleibt der Anspruch beim Elternteil bestehen, solange das Kind wirtschaftlich noch nicht auf eigenen Füßen steht. Auf Antrag des volljährigen Kindes kann die Familienkasse das Kindergeld aber auch direkt an das Kind selbst auszahlen, insbesondere wenn der bisherige Berechtigte seiner Unterhaltspflicht nicht angemessen nachkommt.",
      },
      {
        question: "Zählt ein Urlaubssemester als Unterbrechung des Kindergeldanspruchs?",
        answer:
          "Ein Urlaubssemester wegen Krankheit, Schwangerschaft oder eines Auslandsaufenthalts unterbricht den Anspruch in der Regel nicht, solange die Immatrikulation formal bestehen bleibt. Ein Urlaubssemester allein zur freien Verfügung ohne anerkannten Grund kann dagegen als Unterbrechung der Ausbildung gewertet werden, mit der Folge, dass für diese Zeit kein Kindergeld gezahlt wird. Die Familienkasse prüft dabei den konkreten Grund, nicht allein die formale Immatrikulation – ein Nachweis über den Anlass des Urlaubssemesters ist deshalb ratsam.",
      },
      {
        question: "Wirkt sich ein Urlaubssemester auf die Höchstdauer bis 25 Jahre aus?",
        answer:
          "Nein, die Altersgrenze von 25 Jahren bleibt unverändert – ein anerkanntes Urlaubssemester verlängert sie nicht, verkürzt sie aber auch nicht. Es zählt lediglich als Zeit ohne Kindergeldanspruch, falls es nicht als Fortsetzung der Ausbildung anerkannt wird, während die Frist bis zum 25. Geburtstag unbeeinflusst weiterläuft.",
      },
    ],
  },
];
