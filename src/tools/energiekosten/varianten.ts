/**
 * Inhalte der SEO-Unterseiten des Energiekosten-Rechners.
 *
 * Warum eigene Texte und nicht nur andere Startwerte: Varianten, die sich
 * inhaltlich nicht unterscheiden, sind aus Sicht einer AdSense-Prüfung „low
 * value content" – und aus Sicht eines Besuchers auch. Jede Seite hier
 * beantwortet ihre eigene Frage von vorn. Der Rechner darunter ist derselbe,
 * nur anders voreingestellt.
 *
 * Alle Zahlenbeispiele sind mit genau diesen Voreinstellungen nachgerechnet,
 * damit ein Besucher das Gelesene auf dem Bildschirm wiederfindet.
 */

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  {
    slug: "abschlag-berechnen",
    title: "Abschlag berechnen: Wie hoch sollte die monatliche Zahlung sein?",
    description:
      "Den richtigen monatlichen Abschlag für Strom oder Gas aus dem Jahresverbrauch berechnen – und sehen, ob der aktuelle Abschlag zu hoch oder zu niedrig ist.",
    heading: "Abschlag berechnen",
    params: { modus: "strom", skwh: 3000, sct: 35, sgrund: 12, sab: 80 },
    about: [
      "Der Abschlag ist keine Rechnung, sondern eine Schätzung: Der Versorger teilt die erwarteten Jahreskosten auf zwölf Monate auf und zieht diesen Betrag monatlich ein. Am Jahresende wird gegengerechnet. Der richtige Abschlag ist deshalb schlicht ein Zwölftel der Jahreskosten. Bei 3.000 Kilowattstunden, 35 Cent Arbeitspreis und 12 Euro Grundpreis sind das 1.194 Euro im Jahr, also 99,50 Euro im Monat.",
      "Diese Seite ist auf 80 Euro Abschlag voreingestellt – und damit auf einen Fall, der in Deutschland Millionen Mal vorkommt. Über das Jahr kommen so 960 Euro zusammen, es fehlen 234 Euro. Die landen als Nachzahlung in der Jahresabrechnung, und zwar in einer Summe. Wer stattdessen 20 Euro mehr im Monat zahlt, hat am Jahresende nichts nachzuzahlen und im Alltag nichts gemerkt.",
      "Der Abschlag lässt sich in beide Richtungen anpassen, und zwar jederzeit und ohne Begründung. Nach oben ist das der einfachere Weg, eine Nachzahlung zu vermeiden. Nach unten hat es einen anderen Grund: Ein deutlich überhöhter Abschlag ist ein zinsloser Kredit an den Versorger. Weicht die Zahlung mehr als zehn Prozent von den tatsächlichen Kosten ab, ist eine Anpassung angebracht – nach einer Preiserhöhung ebenso wie nach dem Auszug eines Mitbewohners.",
    ],
    faq: [
      {
        question: "Wie hoch sollte mein Abschlag sein?",
        answer:
          "Ein Zwölftel der erwarteten Jahreskosten, also Verbrauch mal Arbeitspreis plus Grundpreis, geteilt durch zwölf. Bei 3.000 Kilowattstunden zu 35 Cent und 12 Euro Grundpreis sind das 99,50 Euro. Wer im laufenden Jahr eine Preiserhöhung bekommen hat, sollte mit dem neuen Preis rechnen und nicht mit dem alten Abschlag weiterlaufen.",
      },
      {
        question: "Kann ich meinen Abschlag selbst ändern?",
        answer:
          "Ja. Eine Erhöhung akzeptiert jeder Versorger ohne Rückfrage. Eine Senkung darf er ablehnen, wenn sie den erwarteten Verbrauch offensichtlich unterschreitet – ist der bisherige Abschlag aber nachweislich zu hoch, etwa weil eine Person ausgezogen ist oder die letzte Abrechnung ein deutliches Guthaben ergab, muss er sie anpassen.",
      },
      {
        question:
          "Warum ist mein Abschlag höher als ein Zwölftel der letzten Rechnung?",
        answer:
          "Weil der Versorger nicht rückwärts, sondern vorwärts schätzt. Steigen die Preise zum Jahreswechsel, steckt die Erhöhung schon im neuen Abschlag. Dazu kommt bei manchen Anbietern ein bewusst gesetzter Sicherheitszuschlag, der Nachzahlungen vermeidet – der ist zulässig, aber verhandelbar.",
      },
    ],
  },

  {
    slug: "nachzahlung-stromrechnung",
    title: "Nachzahlung Stromrechnung berechnen: Was kommt auf mich zu?",
    description:
      "Nachzahlung oder Guthaben aus Jahresverbrauch und gezahltem Abschlag berechnen – vor der Jahresabrechnung, nicht danach.",
    heading: "Nachzahlung bei der Stromrechnung berechnen",
    params: { modus: "strom", skwh: 4200, sct: 38, sgrund: 14, sab: 95 },
    about: [
      "Eine Nachzahlung entsteht nicht, weil zu viel verbraucht wurde, sondern weil zu wenig gezahlt wurde. Die Rechnung dahinter ist einfach: tatsächliche Jahreskosten minus zwölf Abschläge. Bei 4.200 Kilowattstunden, 38 Cent Arbeitspreis und 14 Euro Grundpreis kostet der Strom 1.764 Euro im Jahr. Bei 95 Euro Abschlag sind über das Jahr 1.140 Euro geflossen. Es fehlen 624 Euro – und die kommen in einer Summe.",
      "Der häufigste Grund für eine Lücke dieser Größe ist eine Preiserhöhung, die im Abschlag nicht nachgezogen wurde. Der Abschlag von 95 Euro passt zu einem Arbeitspreis von etwa 24 Cent; bei 38 Cent deckt er nur noch zwei Drittel der Kosten. Der zweite Grund ist ein gestiegener Verbrauch, etwa durch ein Kind, einen neuen Mitbewohner oder ein Homeoffice. Beides zeigt sich sofort, wenn man Kosten und Abschlag nebeneinanderlegt.",
      "Eine Nachzahlung ist zahlbar, aber nicht sofort fällig zu stemmen: Auf Anfrage gewähren Versorger in der Regel eine Ratenzahlung, und bei Zahlungsschwierigkeiten müssen sie das vor einer Sperre sogar anbieten. Wichtiger ist der zweite Schritt – den Abschlag auf 147 Euro anzupassen, also ein Zwölftel der echten Kosten. Sonst wiederholt sich dasselbe im nächsten Jahr, nur mit einer größeren Summe.",
    ],
    faq: [
      {
        question: "Wie berechne ich meine Nachzahlung?",
        answer:
          "Jahresverbrauch mal Arbeitspreis, plus Grundpreis für zwölf Monate, minus der Summe aller gezahlten Abschläge. Bei 4.200 Kilowattstunden zu 38 Cent, 14 Euro Grundpreis und 95 Euro Abschlag sind das 1.764 Euro Kosten gegen 1.140 Euro Zahlungen, also 624 Euro Nachzahlung.",
      },
      {
        question: "Kann ich eine Nachzahlung in Raten zahlen?",
        answer:
          "In der Regel ja. Versorger sind an zahlenden Kunden interessiert und bieten Ratenzahlung meist ohne Aufschlag an. Droht eine Stromsperre, ist der Versorger nach § 19 der Grundversorgungsverordnung verpflichtet, vorher eine Ratenzahlung anzubieten. Ein Anruf vor dem Fälligkeitsdatum ist deutlich einfacher als eine Klärung danach.",
      },
      {
        question: "Wie verhindere ich die nächste Nachzahlung?",
        answer:
          "Den Abschlag auf ein Zwölftel der tatsächlichen Jahreskosten setzen – hier also auf 147 Euro statt 95. Am besten direkt nach der Jahresabrechnung, weil dann der aktuelle Verbrauch und der aktuelle Preis bekannt sind. Wer zusätzlich den Tarif prüft, senkt die Kosten selbst und nicht nur die Verteilung über das Jahr.",
      },
    ],
  },
];
