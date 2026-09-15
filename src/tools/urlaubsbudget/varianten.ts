/**
 * Inhalte der SEO-Unterseiten des Urlaubsbudget-Planers.
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
    slug: "urlaubskasse-sparen",
    title: "Urlaubskasse: Wie viel muss ich monatlich für den Urlaub sparen?",
    description:
      "Aus dem Reisebudget die monatliche Sparrate bis zur Abreise berechnen – mit vorhandener Rücklage und realistischem Puffer.",
    heading: "Für den Urlaub sparen",
    params: { monate: 10, naechte: 7, erw: 2 },
    about: [
      "Eine Urlaubskasse funktioniert wie jeder andere Sparplan mit festem Ziel: Man kennt den Betrag und das Datum, gesucht ist die Rate. Für eine Woche zu zweit mit Flug, Mittelklassehotel und normalem Essen sind das hier 2.271,50 Euro. Verteilt auf zehn Monate bis zur Abreise ergibt das 227,15 Euro im Monat – ein Betrag, der sich als Dauerauftrag einrichten lässt und danach nicht mehr auffällt.",
      "Der entscheidende Unterschied zu einem Sparplan auf Rendite: Hier wird nicht verzinst gerechnet. Zehn Monate auf einem Tagesgeldkonto bringen bei zwei Prozent etwa 20 Euro – weniger, als der Wechselkurs am Reisetag ausmacht. Wer die Zinsen einrechnet, täuscht eine Genauigkeit vor, die es nicht gibt. Deshalb teilt dieser Rechner schlicht und rundet dabei auf, damit die Kasse am Ende nicht knapp danebenliegt.",
      "Sinnvoll ist ein eigenes Konto, von dem sonst nichts abgeht. Der Grund ist kein finanzieller, sondern ein praktischer: Geld auf dem Girokonto wird ausgegeben, ohne dass jemand eine Entscheidung trifft. Ein separates Tagesgeldkonto mit Dauerauftrag am Tag nach dem Gehaltseingang löst das Problem vollständig – und macht nebenbei sichtbar, ob die Rate wirklich tragbar ist oder das Konto am Monatsende regelmäßig leer läuft.",
    ],
    faq: [
      {
        question: "Wie viel sollte ich monatlich für den Urlaub zurücklegen?",
        answer:
          "Das Reisebudget geteilt durch die Monate bis zur Abreise, abzüglich dessen, was schon da ist. Bei 2.271,50 Euro und zehn Monaten sind das 227,15 Euro. Wer keine konkrete Reise plant, fährt mit einem festen Anteil des Nettoeinkommens gut – fünf Prozent im Monat ergeben nach einem Jahr etwa zwei Nettomonatsgehälter Reisebudget.",
      },
      {
        question: "Sollte ich das Urlaubsgeld auf ein eigenes Konto legen?",
        answer:
          "Ja, aber nicht wegen der Zinsen. Ein separates Konto verhindert, dass das Geld nebenbei für etwas anderes draufgeht, und macht den Fortschritt sichtbar. Ein Tagesgeldkonto ist dafür richtig: täglich verfügbar, keine Kursschwankungen, kein Kursrisiko am Reisetag.",
      },
      {
        question: "Was, wenn ich die Sparrate nicht schaffe?",
        answer:
          "Dann sind drei Stellschrauben da, und zwar in dieser Reihenfolge: die Reisedauer, die Unterkunftsklasse und die Anreise. Eine Nacht weniger spart hier 95 Euro Zimmer plus 70 Euro Verpflegung. Erst danach lohnt es sich, am Tagesbudget vor Ort zu drehen – das ist der Posten, der den Urlaub tatsächlich zum Urlaub macht.",
      },
    ],
  },

];
