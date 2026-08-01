/**
 * Inhalte der SEO-Unterseiten des Brutto-Netto-Rechners.
 *
 * Warum eigene Texte und nicht nur andere Startwerte: Varianten, die sich
 * inhaltlich nicht unterscheiden, sind aus Sicht einer AdSense-Prüfung „low
 * value content“ – und aus Sicht eines Besuchers auch. Jede Seite hier
 * beantwortet ihre eigene Frage von vorn.
 *
 * Alle Zahlenbeispiele sind mit den Rechengrößen für 2026 und genau diesen
 * Voreinstellungen nachgerechnet. Sie gelten für Nordrhein-Westfalen, ohne
 * Kirchensteuer, mit dem durchschnittlichen Zusatzbeitrag von 2,9 Prozent.
 */

import type { FaqEntry, ToolParams } from "@/tools/types";

export interface VariantenText {
  /** URL-Segment unter /tools/bruttonetto/ */
  slug: string;
  titel: string;
  beschreibung: string;
  heading: string;
  /** Startwerte des Rechners auf dieser Seite. */
  params: ToolParams;
  /** Drei eigene Absätze; der allgemeine Erklärtext folgt danach. */
  absaetze: string[];
  faq: FaqEntry[];
}

export const variantenTexte: VariantenText[] = [
  /* ----------------------------------------------------------------------- */

  {
    slug: "steuerklasse-1",
    titel: "Steuerklasse 1: Brutto-Netto-Rechner 2026 für Ledige",
    beschreibung:
      "Netto in Steuerklasse I berechnen – mit Sozialabgaben, Lohnsteuer und Kirchensteuer nach den Rechengrößen für 2026.",
    heading: "Netto in Steuerklasse 1 berechnen",
    params: { klasse: 1, brutto: 4000 },
    absaetze: [
      "Steuerklasse I gilt für Ledige, Verwitwete und Geschiedene ohne Kind im Haushalt – es ist die häufigste Klasse und zugleich die, an der sich der Steuertarif am klarsten zeigt. Von 4.000 Euro brutto im Monat bleiben in Nordrhein-Westfalen ohne Kirchensteuer rund 2.606 Euro netto. Davon gehen 870 Euro an Sozialabgaben und gut 524 Euro an Lohnsteuer weg – die Sozialabgaben sind in dieser Gehaltsklasse also der größere Brocken.",
      "Die Abgabenquote steigt mit dem Einkommen, aber nicht gleichmäßig. Bei 3.000 Euro brutto liegt sie bei rund 31,5 Prozent, bei 4.000 Euro bei knapp 35 Prozent, bei 5.000 Euro bei gut 37 Prozent. Oberhalb der Beitragsbemessungsgrenze von 69.750 Euro im Jahr kehrt sich die Bewegung teilweise um: Kranken- und Pflegebeiträge steigen dann nicht weiter, sodass von jedem zusätzlichen Euro mehr übrig bleibt als vorher.",
      "Interessanter als der Durchschnitt ist die Grenzbelastung – was von hundert Euro mehr Brutto tatsächlich ankommt. Bei 4.000 Euro brutto sind das rund 54 Euro. Wer über eine Gehaltserhöhung, Überstunden oder einen Nebenjob nachdenkt, sollte mit dieser Zahl rechnen und nicht mit dem Durchschnittssatz. Der Rechner weist sie unter dem Ergebnis aus.",
    ],
    faq: [
      {
        question: "Wer wird in Steuerklasse 1 eingestuft?",
        answer:
          "Ledige, Verwitwete nach dem Trauerjahr und Geschiedene, jeweils ohne Kind im eigenen Haushalt. Auch Verheiratete kommen in Klasse I, wenn der Partner dauerhaft im Ausland lebt oder die Eheleute dauerhaft getrennt leben. Wer als Alleinerziehender Anspruch auf den Entlastungsbetrag hat, gehört dagegen in Klasse II und sollte den Wechsel beantragen – er bringt monatlich spürbar mehr netto.",
      },
      {
        question: "Wie viel netto bleiben von 3.000, 4.000 und 5.000 Euro?",
        answer:
          "In Steuerklasse I, Nordrhein-Westfalen, ohne Kirchensteuer und mit durchschnittlichem Zusatzbeitrag: von 3.000 Euro brutto rund 2.054 Euro netto, von 4.000 Euro rund 2.606 Euro und von 5.000 Euro rund 3.130 Euro. Die Werte gelten für kinderlose Arbeitnehmer – wer Kinder hat, zahlt einen geringeren Pflegebeitrag und kommt entsprechend höher heraus.",
      },
      {
        question: "Warum unterscheidet sich mein Netto von diesem Ergebnis?",
        answer:
          "Meistens wegen des Zusatzbeitrags der Krankenkasse, der 2026 zwischen unter 2,2 und über 4,3 Prozent liegt – das macht bei 4.000 Euro brutto rund 35 Euro im Monat aus. Weitere Gründe sind eingetragene Freibeträge aus den ELStAM, betriebliche Altersvorsorge, geldwerte Vorteile wie ein Dienstwagen, vermögenswirksame Leistungen und Einmalzahlungen wie Urlaubs- oder Weihnachtsgeld, die anders besteuert werden als laufender Lohn.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "steuerklasse-3",
    titel: "Steuerklasse 3: Netto berechnen und der Vergleich mit 4/4",
    beschreibung:
      "Netto in Steuerklasse III mit Splittingtarif berechnen – und warum die Kombination III/V nur verschiebt, was am Jahresende ohnehin fällig wird.",
    heading: "Netto in Steuerklasse 3 berechnen",
    params: { klasse: 3, brutto: 5000 },
    absaetze: [
      "Steuerklasse III ist die günstigste, aber sie ist keine Steuerersparnis. Sie rechnet mit dem Splittingtarif, also mit dem doppelten Grundfreibetrag, weil der Partner in Klasse V praktisch ohne Freibeträge dasteht. Von 5.000 Euro brutto bleiben in Klasse III rund 3.511 Euro netto statt 3.130 Euro in Klasse I – ein Plus von gut 380 Euro im Monat, das der Partner in Klasse V an anderer Stelle wieder verliert.",
      "Sinnvoll ist die Kombination III/V nur bei deutlich unterschiedlichen Einkommen; als Faustregel ab einem Verhältnis von etwa 60 zu 40. Bei ähnlichen Einkommen ist IV/IV besser, weil dort keine großen Nachzahlungen entstehen. Wer die monatliche Verteilung genauer treffen will, kann das Faktorverfahren IV/IV mit Faktor wählen: Es verteilt die Steuer nach dem tatsächlichen Verhältnis der Einkommen und vermeidet dadurch beides – die Überzahlung des einen und die Nachzahlung des anderen.",
      "Ein Punkt wird regelmäßig übersehen: Bei der Kombination III/V ist die Steuererklärung Pflicht, und sie endet häufig mit einer Nachzahlung. Der Grund ist genau der Vorteil, den Klasse III monatlich bringt – er ist nur vorgezogen. Wichtig ist die Klassenwahl trotzdem, denn Lohnersatzleistungen wie Elterngeld, Krankengeld und Arbeitslosengeld bemessen sich am Netto. Wer Nachwuchs plant, sollte rechtzeitig prüfen, ob ein Wechsel in Klasse III sinnvoll ist.",
    ],
    faq: [
      {
        question: "Lohnt sich Steuerklasse 3 wirklich?",
        answer:
          "Über das Jahr gerechnet ändert die Klassenwahl an der Steuerschuld nichts – sie verteilt nur, wann gezahlt wird. Ein echter Vorteil entsteht an zwei Stellen: Erstens beim Liquiditätseffekt, weil unterjährig mehr Geld zur Verfügung steht. Zweitens bei Lohnersatzleistungen, die sich am Nettoentgelt bemessen: Elterngeld, Krankengeld, Arbeitslosengeld und Mutterschaftsgeld fallen in Klasse III höher aus. Für den Elterngeldbezug sollte der Wechsel spätestens sieben Monate vor Beginn des Mutterschutzes erfolgen.",
      },
      {
        question: "Steuerklasse 3/5 oder 4/4 mit Faktor?",
        answer:
          "Das Faktorverfahren verteilt die Lohnsteuer im Verhältnis der tatsächlichen Bruttolöhne. Es vermeidet die typische Nachzahlung der Kombination III/V und die Überzahlung des Partners in Klasse V, bringt monatlich aber weniger Netto im Haushalt als III/V. Sinnvoll ist es besonders, wenn beide Partner ähnlich verdienen oder wenn Nachzahlungen vermieden werden sollen. Auch beim Faktorverfahren ist die Steuererklärung Pflicht.",
      },
      {
        question: "Wie oft kann man die Steuerklasse wechseln?",
        answer:
          "Seit 2020 beliebig oft im Jahr. Der Antrag läuft über das Finanzamt oder online über Elster; die neue Klasse gilt ab dem Folgemonat. Nach einer Heirat werden beide Partner automatisch in Klasse IV eingestuft, ein Wechsel zu III/V muss ausdrücklich beantragt werden. Bei geplantem Elterngeld- oder Arbeitslosengeldbezug lohnt es sich, die Fristen vorher zu prüfen – dort gelten Mindestzeiträume, bevor die neue Klasse sich auf die Leistung auswirkt.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "steuerklasse-4",
    titel: "Steuerklasse 4: Brutto-Netto-Rechner für Verheiratete",
    beschreibung:
      "Netto in Steuerklasse IV berechnen – mit Kinderfreibeträgen und dem Vergleich zum Faktorverfahren und zur Kombination III/V.",
    heading: "Netto in Steuerklasse 4 berechnen",
    params: { klasse: 4, brutto: 4000, kinder: 2, freibetraege: 1 },
    absaetze: [
      "Steuerklasse IV ist die Voreinstellung nach der Heirat und rechnet steuerlich genau wie Klasse I: derselbe Grundtarif, dieselben Pauschbeträge. Der Unterschied liegt in den Kinderfreibeträgen, die hier eingetragen werden können, und in der Möglichkeit des Faktorverfahrens. Bei 4.000 Euro brutto und einem Kinderfreibetrag bleiben rund 2.629 Euro netto.",
      "Sinnvoll ist IV/IV, wenn beide Partner ähnlich viel verdienen. Dann zahlt jeder ungefähr das, was am Jahresende auch wirklich fällig wird, und es gibt weder große Erstattungen noch Nachzahlungen. Weichen die Einkommen deutlich voneinander ab – als Faustregel ab einem Verhältnis von 60 zu 40 –, bringt die Kombination III/V monatlich mehr Netto im Haushalt, verlagert dafür aber Steuer ins Folgejahr.",
      "Die Kinderfreibeträge wirken im Lohnsteuerabzug anders, als viele erwarten: Sie mindern nicht die Lohnsteuer, sondern nur die Bemessungsgrundlage für Solidaritätszuschlag und Kirchensteuer. Für die Lohnsteuer selbst gibt es stattdessen Kindergeld. Erst das Finanzamt prüft bei der Steuererklärung automatisch, ob die Freibeträge günstiger gewesen wären als das Kindergeld – bei höheren Einkommen ist das der Fall, und die Differenz wird dann erstattet.",
    ],
    faq: [
      {
        question: "Was ist das Faktorverfahren?",
        answer:
          "Eine Variante von IV/IV, bei der das Finanzamt einen Faktor kleiner als 1 einträgt. Er verteilt die voraussichtliche Jahressteuer im Verhältnis der tatsächlichen Bruttolöhne auf beide Partner. Das Ergebnis kommt der endgültigen Steuerschuld sehr nahe, sodass Nachzahlungen weitgehend entfallen – anders als bei III/V, wo der Partner in Klasse V regelmäßig zu viel und der in Klasse III zu wenig zahlt. Der Faktor muss beim Finanzamt beantragt werden und gilt bis zu zwei Jahre.",
      },
      {
        question: "Wie wirken sich Kinderfreibeträge auf das Netto aus?",
        answer:
          "Im laufenden Lohnsteuerabzug nur wenig: Sie mindern Solidaritätszuschlag und Kirchensteuer, nicht aber die Lohnsteuer selbst. Bei einem Kirchensteuerpflichtigen mit 4.000 Euro brutto sind das wenige Euro im Monat. Der eigentliche Effekt kommt über die Steuererklärung: Dort führt das Finanzamt die Günstigerprüfung durch und rechnet Kinderfreibetrag gegen Kindergeld – wer viel verdient, bekommt die Differenz erstattet.",
      },
      {
        question: "Sollten wir nach der Hochzeit die Klasse wechseln?",
        answer:
          "Nicht zwingend. Bei ähnlichen Einkommen ist IV/IV die unkomplizierteste Wahl. Ein Wechsel lohnt sich, wenn die Einkommen deutlich auseinanderliegen, wenn Elterngeld oder eine andere Lohnersatzleistung ansteht – dann sollte der künftig beziehende Partner rechtzeitig in Klasse III wechseln – oder wenn Nachzahlungen aus III/V vermieden werden sollen, wofür das Faktorverfahren gedacht ist.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "steuerklasse-5",
    titel: "Steuerklasse 5: Warum so wenig netto übrig bleibt",
    beschreibung:
      "Netto in Steuerklasse V berechnen – mit der Erklärung, warum die Abzüge so hoch sind und wann sich der Wechsel lohnt.",
    heading: "Netto in Steuerklasse 5 berechnen",
    params: { klasse: 5, brutto: 2500 },
    absaetze: [
      "Steuerklasse V hat die höchsten Abzüge aller Klassen für Verheiratete, und dafür gibt es einen einfachen Grund: Der Grundfreibetrag, der Arbeitnehmer-Pauschbetrag und der Sonderausgaben-Pauschbetrag sind vollständig dem Partner in Klasse III zugeordnet. In Klasse V fällt deshalb ab dem ersten Euro Lohnsteuer an. Von 2.500 Euro brutto bleiben so rund 1.472 Euro netto – die Abgabenquote liegt bei gut 41 Prozent, obwohl das Einkommen niedrig ist.",
      "Das wirkt ungerecht, ist aber nur die Kehrseite der Klasse III beim Partner. Über das Jahr gerechnet zahlt das Paar zusammen genau so viel, wie sich aus dem gemeinsamen Einkommen ergibt – die Aufteilung auf die Monate ist eine andere. Deshalb ist bei der Kombination III/V die Steuererklärung Pflicht: Erst dort wird richtiggestellt, was der Lohnsteuerabzug nur näherungsweise trifft.",
      "Praktisch problematisch wird Klasse V an einer anderen Stelle: Lohnersatzleistungen bemessen sich am Nettoentgelt. Wer in Klasse V steht und Elterngeld, Krankengeld oder Arbeitslosengeld beziehen wird, bekommt deutlich weniger als in Klasse III oder IV. Wer eine solche Leistung erwartet, sollte den Wechsel rechtzeitig prüfen – beim Elterngeld spätestens sieben Monate vor Beginn des Mutterschutzes, weil der Bemessungszeitraum zurückreicht.",
    ],
    faq: [
      {
        question: "Warum sind die Abzüge in Steuerklasse 5 so hoch?",
        answer:
          "Weil sämtliche Freibeträge beim Partner in Klasse III liegen. In Klasse V gibt es weder Grundfreibetrag noch Arbeitnehmer-Pauschbetrag, deshalb wird ab dem ersten Euro Lohnsteuer fällig, und zwar nach einer eigenen Formel mit einem Mindestsatz von 14 Prozent. Das ist keine Strafe, sondern das Gegenstück zum niedrigen Abzug des Partners – gemeinsam betrachtet zahlt das Paar denselben Betrag wie bei jeder anderen Kombination.",
      },
      {
        question: "Wann sollte ich aus Steuerklasse 5 wechseln?",
        answer:
          "Wenn die Einkommen sich angeglichen haben, ist IV/IV oder das Faktorverfahren fast immer die bessere Wahl. Ebenso, wenn eine Lohnersatzleistung ansteht: Elterngeld, Krankengeld und Arbeitslosengeld richten sich nach dem Netto, und in Klasse V fällt es am niedrigsten aus. Und wenn die jährliche Nachzahlung aus III/V regelmäßig zum Problem wird, löst das Faktorverfahren genau das.",
      },
      {
        question: "Bekomme ich in Steuerklasse 5 Geld zurück?",
        answer:
          "Als Paar häufig nicht – die Kombination III/V führt in der Summe eher zu Nachzahlungen, weil in Klasse III zu wenig einbehalten wird. Der Partner in Klasse V hat für sich betrachtet zwar zu viel gezahlt, aber die gemeinsame Veranlagung rechnet beides zusammen. Wer getrennt veranlagt wird, kann dagegen mit einer Erstattung rechnen; ob das günstiger ist, prüft das Finanzamt auf Antrag.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "lohnsteuer-berechnen",
    titel: "Lohnsteuer berechnen 2026: Tarif, Freibeträge und Rechenweg",
    beschreibung:
      "Lohnsteuer nach § 39b EStG berechnen – mit Vorsorgepauschale, Einkommensteuertarif 2026 und Solidaritätszuschlag.",
    heading: "Lohnsteuer berechnen",
    params: { brutto: 5000, klasse: 1 },
    absaetze: [
      "Die Lohnsteuer ist keine eigene Steuerart, sondern eine Vorauszahlung auf die Einkommensteuer. Der Rechenweg nach § 39b EStG geht so: Vom Bruttojahreslohn werden der Arbeitnehmer-Pauschbetrag von 1.230 Euro, der Sonderausgaben-Pauschbetrag von 36 Euro und die Vorsorgepauschale abgezogen. Was übrig bleibt, ist der zu versteuernde Jahresbetrag, auf den der Einkommensteuertarif angewendet wird. Bei 5.000 Euro brutto im Monat sind das 46.644 Euro und daraus 9.389 Euro Lohnsteuer im Jahr.",
      "Der Tarif selbst besteht 2026 aus fünf Zonen. Bis zum Grundfreibetrag von 12.348 Euro fällt keine Steuer an. Darüber steigt der Grenzsteuersatz von 14 Prozent zunächst steil, dann flacher an, bis er ab 69.878 Euro konstant 42 Prozent beträgt; ab 277.826 Euro sind es 45 Prozent. Wichtig ist der Unterschied zwischen Grenz- und Durchschnittssteuersatz: Der Spitzensteuersatz gilt immer nur für den Teil des Einkommens oberhalb der Grenze, nie für das ganze Einkommen.",
      "Die Vorsorgepauschale ist der Posten, der am wenigsten bekannt ist und am meisten bewirkt. Sie ersetzt im Lohnsteuerabzug die tatsächlichen Vorsorgeaufwendungen und rechnet mit eigenen Sätzen – bei der Krankenversicherung etwa mit dem ermäßigten Beitragssatz von 14,0 statt 14,6 Prozent. Zum 1. Januar 2026 wurde sie umgebaut: Die Mindestvorsorgepauschale ist entfallen, dafür gibt es erstmals einen Teilbetrag für die Arbeitslosenversicherung, der allerdings nur bei niedrigen Löhnen wirksam wird.",
    ],
    faq: [
      {
        question: "Was ist der Unterschied zwischen Lohnsteuer und Einkommensteuer?",
        answer:
          "Die Lohnsteuer ist die Erhebungsform der Einkommensteuer bei Arbeitnehmern: Der Arbeitgeber behält sie ein und führt sie ab. Die endgültige Steuer wird erst mit der Einkommensteuererklärung ermittelt, unter Berücksichtigung aller Einkünfte, Werbungskosten über 1.230 Euro, Sonderausgaben und außergewöhnlichen Belastungen. Die bereits gezahlte Lohnsteuer wird dabei angerechnet – daraus ergibt sich die Erstattung oder Nachzahlung.",
      },
      {
        question: "Was ist der Grenzsteuersatz?",
        answer:
          "Der Satz, mit dem der nächste verdiente Euro besteuert wird – nicht der Durchschnitt. Bei einem zu versteuernden Einkommen von 46.644 Euro liegt der Grenzsteuersatz bei rund 35 Prozent, der Durchschnittssatz aber nur bei etwa 20 Prozent. Deshalb ist die Sorge unbegründet, eine Gehaltserhöhung könne sich „nicht lohnen“: Der höhere Satz gilt immer nur für den zusätzlichen Teil. Der Rechner zeigt unter dem Ergebnis, was von hundert Euro mehr Brutto tatsächlich übrig bleibt.",
      },
      {
        question: "Wann muss ich eine Steuererklärung abgeben?",
        answer:
          "Pflicht ist sie unter anderem bei der Steuerklassenkombination III/V und beim Faktorverfahren, bei mehreren Arbeitsverhältnissen mit Steuerklasse VI, bei eingetragenen Freibeträgen, bei Lohnersatzleistungen über 410 Euro wie Kurzarbeiter- oder Elterngeld und bei Nebeneinkünften über 410 Euro. Freiwillig lohnt sie sich fast immer: Bei hohen Werbungskosten, Handwerkerleistungen oder Fahrtkosten kommt regelmäßig eine vierstellige Erstattung heraus. Die freiwillige Erklärung ist vier Jahre rückwirkend möglich.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "sozialabgaben-berechnen",
    titel: "Sozialabgaben berechnen 2026: Alle vier Zweige mit Grenzen",
    beschreibung:
      "Renten-, Arbeitslosen-, Kranken- und Pflegeversicherung berechnen – mit Beitragsbemessungsgrenzen 2026 und Arbeitgeberanteil.",
    heading: "Sozialabgaben berechnen",
    params: { brutto: 4000, klasse: 1 },
    absaetze: [
      "Die Sozialabgaben verteilen sich auf vier Zweige mit zusammen rund 21 Prozent Arbeitnehmeranteil: Rentenversicherung 9,3 Prozent, Krankenversicherung 7,3 Prozent plus die Hälfte des Zusatzbeitrags, Pflegeversicherung 1,8 Prozent und Arbeitslosenversicherung 1,3 Prozent. Bei 4.000 Euro brutto im Monat sind das zusammen 870 Euro – deutlich mehr als die Lohnsteuer in derselben Gehaltsklasse.",
      "Entscheidend sind die beiden Beitragsbemessungsgrenzen, denn oberhalb davon steigen die Beiträge nicht weiter. Für Renten- und Arbeitslosenversicherung liegt sie 2026 bei 101.400 Euro im Jahr, für Kranken- und Pflegeversicherung deutlich niedriger bei 69.750 Euro. Wer mehr verdient, zahlt auf den übersteigenden Teil keine Kranken- und Pflegebeiträge mehr. Genau deshalb sinkt die Abgabenquote bei hohen Einkommen wieder, obwohl der Steuersatz steigt.",
      "Zwei Sonderregeln fallen auf. Kinderlose ab 23 zahlen 0,6 Prozentpunkte mehr Pflegeversicherung, und diesen Zuschlag trägt der Arbeitnehmer allein – bei 4.000 Euro brutto sind das 24 Euro im Monat. Umgekehrt sinkt der Beitrag ab dem zweiten Kind um je 0,25 Punkte bis zum fünften Kind. Und Sachsen verteilt die Pflegeversicherung anders: Weil dort der Buß- und Bettag Feiertag blieb, zahlen Arbeitnehmer 0,5 Punkte mehr und Arbeitgeber entsprechend weniger.",
    ],
    faq: [
      {
        question: "Wie hoch sind die Sozialabgaben 2026 insgesamt?",
        answer:
          "Der Gesamtbeitrag liegt bei rund 42 Prozent, den sich Arbeitnehmer und Arbeitgeber weitgehend teilen: Rentenversicherung 18,6 Prozent, Krankenversicherung 14,6 Prozent plus durchschnittlich 2,9 Prozent Zusatzbeitrag, Pflegeversicherung 3,6 Prozent und Arbeitslosenversicherung 2,6 Prozent. Für den Arbeitnehmer bleiben davon etwa 21 Prozent, für Kinderlose 21,6 Prozent. Nicht paritätisch sind der Kinderlosenzuschlag und die Sachsen-Regelung.",
      },
      {
        question: "Was zahlt der Arbeitgeber zusätzlich?",
        answer:
          "Ungefähr denselben Betrag wie der Arbeitnehmer, bei 4.000 Euro brutto also rund 846 Euro im Monat. Die tatsächlichen Kosten einer Stelle liegen damit gut 21 Prozent über dem Bruttolohn. Hinzu kommen Umlagen für Lohnfortzahlung und Mutterschaft sowie die Beiträge zur gesetzlichen Unfallversicherung, die der Arbeitgeber allein trägt – die sind in diesem Rechner nicht enthalten.",
      },
      {
        question: "Was ist die Beitragsbemessungsgrenze?",
        answer:
          "Die Einkommenshöhe, bis zu der Beiträge erhoben werden. 2026 liegt sie bei 101.400 Euro im Jahr für Renten- und Arbeitslosenversicherung und bei 69.750 Euro für Kranken- und Pflegeversicherung. Jeder Euro darüber ist beitragsfrei. Davon zu unterscheiden ist die Versicherungspflichtgrenze von 77.400 Euro: Ab diesem Einkommen ist ein Wechsel in die private Krankenversicherung möglich.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "kirchensteuer-berechnen",
    titel: "Kirchensteuer berechnen: 8 oder 9 Prozent der Lohnsteuer",
    beschreibung:
      "Kirchensteuer vom Gehalt berechnen – 8 Prozent in Bayern und Baden-Württemberg, 9 Prozent in den übrigen Ländern, mit Austrittsrechnung.",
    heading: "Kirchensteuer berechnen",
    params: { brutto: 4000, klasse: 1, kirche: 1, land: "nw" },
    absaetze: [
      "Die Kirchensteuer bemisst sich nicht am Bruttolohn, sondern an der Lohnsteuer: 8 Prozent davon in Bayern und Baden-Württemberg, 9 Prozent in allen übrigen Bundesländern. Bei 4.000 Euro brutto in Steuerklasse I und rund 6.294 Euro Jahreslohnsteuer sind das in Nordrhein-Westfalen etwa 566 Euro im Jahr oder 47 Euro im Monat, in Bayern 504 Euro im Jahr.",
      "Weil die Bemessungsgrundlage die Lohnsteuer ist, wächst die Kirchensteuer überproportional mit dem Einkommen – sie folgt der Progression des Steuertarifs. Bei 3.000 Euro brutto sind es rund 26 Euro im Monat, bei 6.000 Euro schon rund 96 Euro. Gemindert wird sie durch Kinderfreibeträge: Anders als bei der Lohnsteuer wirken diese auf die Bemessungsgrundlage der Kirchensteuer voll durch.",
      "Ein Detail, das die Belastung dämpft: Die Kirchensteuer ist als Sonderausgabe vollständig von der Einkommensteuer abziehbar. Wer 566 Euro Kirchensteuer zahlt und einen Grenzsteuersatz von 35 Prozent hat, bekommt über die Steuererklärung rund 198 Euro zurück – die tatsächliche Belastung liegt damit bei etwa 368 Euro. Bei Kapitalerträgen läuft dieser Abzug automatisch über eine eigene Formel, weshalb dort aus 9 Prozent Kirchensteuer nur rund 1,6 Prozentpunkte zusätzliche Gesamtbelastung werden.",
    ],
    faq: [
      {
        question: "Wie hoch ist die Kirchensteuer?",
        answer:
          "8 Prozent der Lohnsteuer in Bayern und Baden-Württemberg, 9 Prozent in allen anderen Bundesländern. Maßgeblich ist der Ort der Betriebsstätte des Arbeitgebers, nicht der Wohnort. Einige Landeskirchen kappen die Kirchensteuer bei sehr hohen Einkommen auf einen Prozentsatz des zu versteuernden Einkommens – diese Kappung muss meist beantragt werden und ist in diesem Rechner nicht enthalten.",
      },
      {
        question: "Was spare ich durch einen Kirchenaustritt?",
        answer:
          "Bei 4.000 Euro brutto in Steuerklasse I rund 566 Euro im Jahr in Nordrhein-Westfalen. Netto ist die Ersparnis kleiner, weil die Kirchensteuer als Sonderausgabe abziehbar ist: Bei einem Grenzsteuersatz von 35 Prozent bleiben effektiv rund 368 Euro. Der Austritt wird beim Standesamt oder Amtsgericht erklärt und kostet je nach Bundesland zwischen null und 60 Euro; er wirkt in der Regel ab dem Folgemonat.",
      },
      {
        question: "Zahle ich Kirchensteuer auch auf Kapitalerträge?",
        answer:
          "Ja, sie wird zusammen mit der Abgeltungsteuer automatisch von der Bank einbehalten, sofern kein Sperrvermerk beim Bundeszentralamt für Steuern eingetragen ist. Dabei gilt eine eigene Formel nach § 32d EStG, die den Sonderausgabenabzug schon berücksichtigt: Die Kapitalertragsteuer sinkt von 25 auf 24,45 Prozent, die Gesamtbelastung steigt von 26,375 auf 27,996 Prozent. Der Aufschlag beträgt also rund 1,6 Prozentpunkte, nicht 9.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "arbeitgeberkosten-berechnen",
    titel: "Arbeitgeberkosten berechnen: Was eine Stelle wirklich kostet",
    beschreibung:
      "Arbeitgeberbrutto und Lohnnebenkosten berechnen – Arbeitgeberanteil zur Sozialversicherung, Gesamtkosten und der Abstand zum Netto.",
    heading: "Arbeitgeberkosten berechnen",
    params: { brutto: 4000, klasse: 1 },
    absaetze: [
      "Zwischen dem, was eine Stelle kostet, und dem, was auf dem Konto ankommt, liegt ungefähr der Faktor zwei. Bei 4.000 Euro Bruttolohn zahlt der Arbeitgeber rund 846 Euro Sozialversicherungsanteil obendrauf, die Stelle kostet also etwa 4.846 Euro im Monat. Beim Arbeitnehmer kommen davon rund 2.606 Euro an. Von jedem Euro Arbeitgeberkosten landen damit knapp 54 Cent im Portemonnaie.",
      "Der Arbeitgeberanteil entspricht weitgehend dem des Arbeitnehmers, weil die Sozialversicherung paritätisch finanziert ist: je 9,3 Prozent Rentenversicherung, je 1,3 Prozent Arbeitslosenversicherung, je die Hälfte des Krankenkassenbeitrags samt Zusatzbeitrag und je 1,8 Prozent Pflegeversicherung. Nicht geteilt werden der Kinderlosenzuschlag, den der Arbeitnehmer allein trägt, und die sächsische Sonderverteilung bei der Pflegeversicherung.",
      "Nicht in dieser Rechnung enthalten sind die Umlagen U1 für Lohnfortzahlung im Krankheitsfall und U2 für Mutterschaftsaufwendungen, die Insolvenzgeldumlage sowie die Beiträge zur gesetzlichen Unfallversicherung – letztere trägt der Arbeitgeber allein, und ihre Höhe hängt von der Gefahrklasse der Branche ab. Zusammen machen diese Posten je nach Betrieb noch einmal etwa 1,5 bis 4 Prozent des Bruttolohns aus.",
    ],
    faq: [
      {
        question: "Wie hoch sind die Lohnnebenkosten in Deutschland?",
        answer:
          "Der gesetzliche Arbeitgeberanteil zur Sozialversicherung liegt bei rund 21 Prozent des Bruttolohns. Hinzu kommen Umlagen und die Unfallversicherung mit noch einmal etwa 1,5 bis 4 Prozent. Als Faustregel rechnen Arbeitgeber mit Gesamtkosten von 122 bis 125 Prozent des Bruttolohns. Weitere Kosten wie Urlaubsanspruch, Lohnfortzahlung, Arbeitsplatz und Weiterbildung sind darin noch nicht enthalten.",
      },
      {
        question: "Warum bleibt vom Arbeitgeberbrutto so wenig übrig?",
        answer:
          "Weil auf dem Weg zwei Mal abgezogen wird: erst der Arbeitgeberanteil zur Sozialversicherung, dann beim Arbeitnehmer noch einmal Sozialabgaben, Lohnsteuer und gegebenenfalls Kirchensteuer. Bei 4.846 Euro Arbeitgeberkosten kommen so rund 2.606 Euro netto an. Der Abstand wächst mit dem Einkommen, solange die Beitragsbemessungsgrenzen nicht erreicht sind – darüber wird er wieder kleiner.",
      },
      {
        question: "Was bringt eine Gehaltserhöhung dem Arbeitgeber und mir?",
        answer:
          "Eine Erhöhung um 100 Euro brutto kostet den Arbeitgeber rund 121 Euro und bringt dem Arbeitnehmer bei 4.000 Euro Ausgangsgehalt rund 54 Euro netto. Deshalb sind steuerfreie oder pauschal besteuerte Zuwendungen oft effizienter: Sachbezüge bis 50 Euro im Monat, das Deutschlandticket, betriebliche Altersvorsorge aus dem Bruttolohn oder Zuschüsse zur Kinderbetreuung kommen ungeschmälert oder deutlich weniger belastet an.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "gehaltserhoehung-netto",
    titel: "Gehaltserhöhung netto berechnen: Was von 100 Euro übrig bleibt",
    beschreibung:
      "Netto-Effekt einer Gehaltserhöhung berechnen – mit Grenzbelastung, Beitragsbemessungsgrenzen und dem Vergleich zu steuerfreien Extras.",
    heading: "Gehaltserhöhung netto berechnen",
    params: { brutto: 4000, klasse: 1 },
    absaetze: [
      "Von hundert Euro mehr Brutto bleiben bei 4.000 Euro Ausgangsgehalt in Steuerklasse I rund 54 Euro netto. Diese Zahl – die Grenzbelastung – ist die einzige, die bei einer Gehaltsverhandlung zählt, und sie ist deutlich schlechter als der Durchschnittssatz von knapp 35 Prozent vermuten lässt. Der Rechner weist sie unter dem Ergebnis aus, indem er die gesamte Rechnung ein zweites Mal mit hundert Euro mehr durchführt.",
      "Der Verlauf ist nicht gleichmäßig. Bei 3.000 Euro brutto bleiben von hundert Euro noch rund 56 Euro, bei 5.000 Euro rund 51 Euro – und oberhalb der Beitragsbemessungsgrenze von 69.750 Euro im Jahr steigt der Wert wieder, weil Kranken- und Pflegebeiträge dort nicht weiter wachsen. Bei 12.500 Euro brutto im Monat bleiben deshalb wieder rund 56 Euro von hundert übrig – mehr als bei 5.000 Euro, obwohl der Steuersatz dort niedriger ist.",
      "Weil die Grenzbelastung so hoch ist, sind steuerfreie oder begünstigte Bestandteile oft mehr wert als mehr Brutto. Ein Sachbezug bis 50 Euro im Monat, das Deutschlandticket als Jobticket, ein steuerfreier Zuschuss zur Kinderbetreuung, Beiträge zur betrieblichen Altersvorsorge aus dem Bruttolohn oder die Inflationsausgleichs- und Erholungsbeihilfen kommen ganz oder überwiegend beim Arbeitnehmer an. Fünfzig Euro Sachbezug sind netto ungefähr so viel wert wie hundert Euro mehr Gehalt.",
    ],
    faq: [
      {
        question: "Wie viel netto bleibt von einer Gehaltserhöhung?",
        answer:
          "Ungefähr die Hälfte. In Steuerklasse I ohne Kirchensteuer bleiben von 100 Euro mehr Brutto rund 56 Euro bei einem Ausgangsgehalt von 3.000 Euro, rund 54 Euro bei 4.000 Euro und rund 51 Euro bei 5.000 Euro. Mit Kirchensteuer sind es jeweils zwei bis drei Euro weniger. Oberhalb der Beitragsbemessungsgrenze steigt der Anteil wieder, weil dort keine Kranken- und Pflegebeiträge mehr anfallen.",
      },
      {
        question: "Kann sich eine Gehaltserhöhung überhaupt nicht lohnen?",
        answer:
          "Beim Steuertarif nie – der höhere Grenzsteuersatz gilt immer nur für den zusätzlichen Teil, netto bleibt also stets mehr. Echte Sprungstellen gibt es außerhalb des Steuerrechts: beim Überschreiten der Midijob-Grenze, beim Wegfall einkommensabhängiger Leistungen wie Wohngeld, Kinderzuschlag oder BAföG und bei Sozialtarifen. Dort kann ein kleiner Brutto-Zuwachs tatsächlich netto weniger bedeuten.",
      },
      {
        question: "Was ist besser als mehr Brutto?",
        answer:
          "Alles, was steuer- und beitragsfrei ist, weil es die Grenzbelastung von rund 46 Prozent umgeht. Sachbezüge bis 50 Euro im Monat, das Jobticket, Zuschüsse zur Kinderbetreuung für nicht schulpflichtige Kinder, betriebliches Gesundheitsmanagement bis 600 Euro im Jahr und die Entgeltumwandlung in die betriebliche Altersvorsorge. Bei Letzterer ist zu beachten, dass sie die spätere gesetzliche Rente mindert und die Auszahlung im Alter verbeitragt wird.",
      },
    ],
  },
];
