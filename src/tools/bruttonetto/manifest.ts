import { Wallet } from "lucide-react";
import type { ContentSection, FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { bruttonettoAffiliate } from "./affiliate";
import { formatEuroRounded } from "@/lib/format";
import { BBG_KRANKEN, BBG_RENTE, STEUERJAHR } from "@/lib/steuerdaten";
import { buildUebersichtSection } from "./uebersicht";
import { variantenTexte } from "./varianten";

/* ---------------------------------------------------------------------------
 * Inhalte
 * ------------------------------------------------------------------------- */

const about: string[] = [
  `Zwischen Bruttolohn und Kontostand liegen sieben Posten: vier Sozialversicherungszweige, die Lohnsteuer, der Solidaritätszuschlag und gegebenenfalls die Kirchensteuer. Dieser Rechner weist jeden einzeln aus, mit den Rechengrößen für ${STEUERJAHR}. Bei 4.000 Euro brutto in Steuerklasse I bleiben rund 2.606 Euro – 870 Euro gehen an die Sozialversicherung, rund 524 Euro an Lohnsteuer. In dieser Gehaltsklasse sind die Sozialabgaben also der größere Brocken, nicht die Steuer.`,
  "Der Rechenweg folgt § 39b EStG. Vom Bruttojahreslohn gehen der Arbeitnehmer-Pauschbetrag von 1.230 Euro, der Sonderausgaben-Pauschbetrag von 36 Euro und die Vorsorgepauschale ab; auf den Rest wird der Einkommensteuertarif angewendet. In Steuerklasse III gilt dabei der Splittingtarif, in den Klassen V und VI eine eigene Formel mit einem Mindestsatz von 14 Prozent – dort fällt Steuer ab dem ersten Euro an, weil die Freibeträge beim Partner oder im ersten Dienstverhältnis liegen.",
  "Die Vorsorgepauschale wurde zum 1. Januar 2026 umgebaut, und das ist die wichtigste Änderung des Jahres für den Lohnsteuerabzug. Die frühere Mindestvorsorgepauschale ist entfallen; stattdessen gibt es erstmals einen Teilbetrag für die Arbeitslosenversicherung, der allerdings nur greift, solange er zusammen mit den Teilbeträgen für Kranken- und Pflegeversicherung unter 1.900 Euro bleibt – praktisch also nur bei niedrigen Löhnen. Für die Krankenversicherung rechnet die Pauschale außerdem mit dem ermäßigten Beitragssatz von 14,0 statt 14,6 Prozent, liegt damit unter den tatsächlich gezahlten Beiträgen.",
  "Zwei Beitragsbemessungsgrenzen prägen den Verlauf der Abgabenquote. Für Renten- und Arbeitslosenversicherung liegt sie 2026 bei 101.400 Euro im Jahr, für Kranken- und Pflegeversicherung bei 69.750 Euro. Oberhalb dieser Grenzen steigen die jeweiligen Beiträge nicht weiter. Deshalb sinkt die Grenzbelastung bei hohen Einkommen wieder: Von hundert Euro mehr Brutto bleiben bei 5.000 Euro Monatsgehalt rund 51 Euro, bei 12.500 Euro dagegen wieder rund 56 Euro.",
  "Kinderfreibeträge wirken im Lohnsteuerabzug anders, als der Name vermuten lässt: Sie mindern nicht die Lohnsteuer, sondern nur die Bemessungsgrundlage für Solidaritätszuschlag und Kirchensteuer. Für die Lohnsteuer gibt es stattdessen Kindergeld. Erst mit der Steuererklärung prüft das Finanzamt automatisch, was günstiger war – bei höheren Einkommen der Freibetrag, dann wird die Differenz erstattet. Der Kinderlosenzuschlag zur Pflegeversicherung von 0,6 Prozentpunkten hingegen wirkt sofort und wird vom Arbeitnehmer allein getragen.",
  `Das Ergebnis ist eine Schätzung und keine Lohnabrechnung. Nicht abgebildet sind Freibeträge aus den ELStAM, der Altersentlastungsbetrag, geldwerte Vorteile wie ein Dienstwagen, betriebliche Altersvorsorge, vermögenswirksame Leistungen, Einmalzahlungen wie Urlaubs- und Weihnachtsgeld sowie der Übergangsbereich für Midijobs. Die Steuerklassen V und VI folgen der Grundformel des Gesetzes ohne die zusätzlichen Stützstellen der amtlichen Programmablaufpläne. Für den Regelfall in den Klassen I bis IV liegt der Rechner im Bereich weniger Euro an den veröffentlichten Vergleichswerten für ${STEUERJAHR}. Dieser Rechner ist keine Steuerberatung.`,
];

const sections: ContentSection[] = [
  {
    heading: "Der Rechenweg nach § 39b EStG",
    blocks: [
      {
        type: "p",
        text: "§ 39b EStG regelt ausdrücklich nur den monatlichen Lohnsteuerabzug durch den Arbeitgeber – eine vorläufige Schätzung, die auf zwölf Monate hochrechnet, was übers Jahr gleichmäßig verdient wird. Die endgültige Steuerschuld wird erst mit der Steuererklärung nach § 32a EStG auf das tatsächliche Jahreseinkommen ermittelt.",
      },
      {
        type: "note",
        text: "Deshalb weichen Lohnsteuerabzug und tatsächliche Steuerlast oft voneinander ab – am stärksten bei schwankendem Einkommen, Jobwechsel unterjährig oder einer Gehaltserhöhung mitten im Jahr. Die Differenz gleicht die Steuererklärung aus, als Nachzahlung oder Erstattung.",
      },
    ],
  },
  {
    heading: "Die Vorsorgepauschale 2026",
    blocks: [
      {
        type: "p",
        text: "Sinn der Vorsorgepauschale ist es, schon beim monatlichen Lohnsteuerabzug ungefähr das zu berücksichtigen, was tatsächlich in die Sozialversicherung fließt – ohne die realen Beiträge im Einzelnen abzufragen. Ohne sie würde der Lohnsteuerabzug systematisch zu hoch ausfallen und erst über die Steuererklärung wieder ausgeglichen, ein Jahr oder länger nach dem eigentlichen Verdienst.",
      },
    ],
  },
  {
    heading: "Beitragsbemessungsgrenzen 2026",
    blocks: [
      {
        type: "p",
        text: "Die Beitragsbemessungsgrenzen werden jährlich per Rechtsverordnung an die bundesweite Lohnentwicklung des Vorjahres angepasst, nicht durch ein einzelnes Gesetz mit festem Datum. Oberhalb dieser Grenzen steigen die jeweiligen Beiträge nicht weiter. Deshalb sinkt die Grenzbelastung bei hohen Einkommen wieder: Von hundert Euro mehr Brutto bleiben bei 5.000 Euro Monatsgehalt rund 51 Euro, bei 12.500 Euro dagegen wieder rund 56 Euro.",
      },
      {
        type: "table",
        caption: `Beitragsbemessungsgrenzen ${STEUERJAHR}, jährlich`,
        head: ["Versicherungszweig", "Grenze"],
        rows: [
          ["Renten- und Arbeitslosenversicherung", formatEuroRounded(BBG_RENTE)],
          ["Kranken- und Pflegeversicherung", formatEuroRounded(BBG_KRANKEN)],
        ],
      },
    ],
  },
  {
    heading: "Kinderfreibetrag im Lohnsteuerabzug",
    blocks: [
      {
        type: "p",
        text: "Kindergeld ist rechtlich eine laufende Vorauszahlung auf den Kinderfreibetrag, kein eigenständiger Anspruch daneben. Deshalb zahlt die Familienkasse monatlich einen festen Betrag aus, während der eigentliche Freibetrag erst bei der jährlichen Steuererklärung zum Tragen kommt – und auch nur, wenn er günstiger ist als das bereits erhaltene Kindergeld.",
      },
      {
        type: "note",
        text: "Der Kinderlosenzuschlag zur Pflegeversicherung von 0,6 Prozentpunkten hingegen wirkt sofort im Lohnsteuerabzug und wird vom Arbeitnehmer allein getragen, unabhängig von der Kinderfreibetrag-Frage.",
      },
    ],
  },
  {
    heading: "Grenzen des Modells",
    blocks: [
      {
        type: "p",
        text: "Konkret nicht abgebildet sind etwa ein beim Finanzamt eingetragener Freibetrag für außergewöhnlich hohe Werbungskosten oder Kinderbetreuungskosten, der laufende geldwerte Vorteil eines Dienstwagens nach der Ein-Prozent-Regel, sowie vermögenswirksame Leistungen des Arbeitgebers. Die Steuerklassen V und VI folgen der Grundformel des Gesetzes ohne die zusätzlichen Stützstellen der amtlichen Programmablaufpläne.",
      },
      {
        type: "note",
        text: `Für den Regelfall in den Klassen I bis IV liegt der Rechner im Bereich weniger Euro an den veröffentlichten Vergleichswerten für ${STEUERJAHR}. Dieser Rechner ist keine Steuerberatung.`,
      },
    ],
  },
  buildUebersichtSection(),
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Warum weicht mein tatsächliches Netto ab?",
    answer:
      "Der häufigste Grund ist der Zusatzbeitrag der Krankenkasse: Er liegt 2026 zwischen unter 2,2 und über 4,3 Prozent, was bei 4.000 Euro brutto rund 35 Euro im Monat ausmacht. Weitere Gründe sind eingetragene Freibeträge aus den ELStAM, betriebliche Altersvorsorge, vermögenswirksame Leistungen, geldwerte Vorteile wie ein Dienstwagen und Einmalzahlungen, die nach einem eigenen Verfahren besteuert werden. Prüf zuerst den Zusatzbeitrag auf deiner Abrechnung und trag ihn hier ein.",
  },
  {
    question: "Welche Steuerklassenkombination ist die richtige?",
    answer:
      "Bei ähnlichen Einkommen IV/IV, bei deutlich unterschiedlichen – Faustregel ab 60 zu 40 – bringt III/V monatlich mehr Netto im Haushalt, führt aber regelmäßig zu Nachzahlungen und macht die Steuererklärung zur Pflicht. Das Faktorverfahren IV/IV mit Faktor verteilt die Steuer nach dem tatsächlichen Verhältnis der Einkommen und vermeidet beides. Über das ganze Jahr gerechnet ändert die Wahl an der Steuerschuld nichts – sie verschiebt nur, wann gezahlt wird.",
  },
  {
    question: "Was ist die Beitragsbemessungsgrenze?",
    answer:
      "Die Einkommenshöhe, bis zu der Sozialversicherungsbeiträge erhoben werden. 2026 liegt sie bei 101.400 Euro im Jahr für Renten- und Arbeitslosenversicherung und bei 69.750 Euro für Kranken- und Pflegeversicherung. Jeder Euro darüber ist in diesem Zweig beitragsfrei. Nicht zu verwechseln mit der Versicherungspflichtgrenze von 77.400 Euro – ab diesem Einkommen ist der Wechsel in die private Krankenversicherung möglich.",
  },
  {
    question: "Warum zahle ich als Kinderloser mehr Pflegeversicherung?",
    answer:
      "Seit einem Urteil des Bundesverfassungsgerichts zahlen Kinderlose ab 23 Jahren einen Zuschlag von 0,6 Prozentpunkten, den sie allein tragen – bei 4.000 Euro brutto sind das 24 Euro im Monat. Umgekehrt sinkt der Beitrag ab dem zweiten Kind um je 0,25 Punkte bis zum fünften Kind, solange die Kinder unter 25 sind. Der Nachweis läuft über das Verfahren zur digitalen Kinderberücksichtigung; fehlt er, zieht die Kasse den höheren Satz.",
  },
  {
    question: "Wie hoch ist die Grenzbelastung bei einer Gehaltserhöhung?",
    answer:
      "Von 100 Euro mehr Brutto bleiben in Steuerklasse I ohne Kirchensteuer rund 56 Euro bei 3.000 Euro Ausgangsgehalt, rund 54 Euro bei 4.000 Euro und rund 51 Euro bei 5.000 Euro. Oberhalb der Beitragsbemessungsgrenze steigt der Anteil wieder, weil dort keine Kranken- und Pflegebeiträge mehr anfallen. Der Rechner weist diesen Wert unter dem Ergebnis aus – er ist für Gehaltsverhandlungen die relevante Zahl, nicht der Durchschnittssatz.",
  },
  {
    question: "Lohnt sich ein Kirchenaustritt finanziell?",
    answer:
      "Die Kirchensteuer beträgt 8 Prozent der Lohnsteuer in Bayern und Baden-Württemberg und 9 Prozent in den übrigen Ländern – bei 4.000 Euro brutto in Steuerklasse I also rund 47 Euro im Monat in Nordrhein-Westfalen. Die tatsächliche Ersparnis ist kleiner, weil die Kirchensteuer als Sonderausgabe abziehbar ist: Bei einem Grenzsteuersatz von 35 Prozent bleiben rund zwei Drittel davon übrig. Der Austritt wird beim Standesamt oder Amtsgericht erklärt.",
  },
  {
    question: "Was kostet mein Arbeitsplatz den Arbeitgeber?",
    answer:
      "Rund 21 Prozent mehr als das Bruttogehalt, weil der Arbeitgeber die gleiche Hälfte der Sozialversicherungsbeiträge trägt – bei 4.000 Euro brutto also etwa 4.846 Euro im Monat. Hinzu kommen Umlagen für Lohnfortzahlung und Mutterschaft, die Insolvenzgeldumlage und die gesetzliche Unfallversicherung, die der Arbeitgeber allein zahlt; zusammen noch einmal etwa 1,5 bis 4 Prozent. Der Rechner weist die Arbeitgeberkosten ohne diese Zusatzposten aus.",
  },
  {
    question: "Ersetzt der Rechner die Lohnabrechnung?",
    answer:
      "Nein. Er bildet den Regelfall nach den Rechengrößen für 2026 ab und trifft ihn in den Steuerklassen I bis IV auf wenige Euro genau. Er kennt aber weder deine ELStAM-Freibeträge noch betriebliche Besonderheiten, Einmalzahlungen, geldwerte Vorteile oder den Midijob-Übergangsbereich. Für verbindliche Zahlen ist die Abrechnung des Arbeitgebers maßgeblich, für steuerliche Gestaltung eine Steuerberatung oder ein Lohnsteuerhilfeverein. Dieser Rechner ist keine Steuerberatung.",
  },
];

/* ---------------------------------------------------------------------------
 * Varianten
 * ------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
 * Manifest
 * ------------------------------------------------------------------------- */

export const bruttonetto: ToolManifest = {
  slug: "bruttonetto",
  name: "Brutto-Netto-Rechner",
  tagline: `Was vom Gehalt übrig bleibt: Lohnsteuer, Soli, Kirchensteuer und alle vier Sozialversicherungszweige einzeln – mit den Rechengrößen für ${STEUERJAHR}.`,
  category: "geld",
  icon: Wallet,
  status: "live",
  keywords: [
    "brutto netto rechner",
    "gehaltsrechner",
    "lohnrechner",
    "lohnsteuer berechnen",
    "sozialabgaben berechnen",
    "netto vom brutto berechnen",
    "steuerklasse 1 netto",
    "kirchensteuer berechnen",
    "arbeitgeberkosten berechnen",
    "gehaltserhöhung netto",
  ],

  getVariants: () => buildVariants(variantenTexte),

  about,
  sections,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: bruttonettoAffiliate,
  },
};
