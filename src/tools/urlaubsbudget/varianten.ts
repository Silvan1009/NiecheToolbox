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
    title: "Urlaubskasse: Monatliche Sparrate für den Urlaub berechnen",
    description:
      "Aus dem Reisebudget die monatliche Sparrate bis zur Abreise berechnen – mit vorhandener Rücklage und realistischem Puffer.",
    heading: "Für den Urlaub sparen",
    params: { monate: 10, naechte: 7, erw: 2 },
    about: [
      "Eine Urlaubskasse funktioniert wie jeder andere Sparplan mit festem Ziel: Man kennt den Betrag und das Datum, gesucht ist die Rate. Für eine Woche zu zweit mit Flug, Mittelklassehotel und normalem Essen sind das hier 2.271,50 Euro. Verteilt auf zehn Monate bis zur Abreise ergibt das 227,15 Euro im Monat – ein Betrag, der sich als Dauerauftrag einrichten lässt und danach nicht mehr auffällt.",
      "Der entscheidende Unterschied zu einem Sparplan auf Rendite: Hier wird nicht verzinst gerechnet. Zehn Monate auf einem Tagesgeldkonto bringen bei zwei Prozent etwa 20 Euro – weniger, als der Wechselkurs am Reisetag ausmacht. Wer die Zinsen einrechnet, täuscht eine Genauigkeit vor, die es nicht gibt. Deshalb teilt dieser Rechner schlicht und rundet dabei auf, damit die Kasse am Ende nicht knapp danebenliegt.",
      "Sinnvoll ist ein eigenes Konto, von dem sonst nichts abgeht. Der Grund ist kein finanzieller, sondern ein praktischer: Geld auf dem Girokonto wird ausgegeben, ohne dass jemand eine Entscheidung trifft. Ein separates Tagesgeldkonto mit Dauerauftrag am Tag nach dem Gehaltseingang löst das Problem vollständig – und macht nebenbei sichtbar, ob die Rate wirklich tragbar ist oder das Konto am Monatsende regelmäßig leer läuft.",
      "Ein Dauerauftrag direkt nach dem Gehaltseingang ist wirksamer als der Vorsatz, am Monatsende zu sparen, was übrig bleibt – ein Prinzip, das in der Verhaltensökonomie als „pay yourself first“ bekannt ist. Wer das Sparen an den Anfang des Monats stellt, behandelt die Urlaubskasse wie eine fixe Ausgabe neben Miete und Versicherung, statt sie von der unsicheren Größe abhängig zu machen, die am Monatsende noch übrig ist. Der psychologische Unterschied ist real: In Monaten mit knappem Budget wird zuerst bei variablen Posten gespart, und ein „Rest fürs Sparen“ ist typischerweise genau der Posten, der als Erstes gestrichen wird. Ein automatisierter, fester Dauerauftrag entzieht diese Entscheidung dem monatlichen Abwägen und macht das Erreichen der Sparrate weitgehend unabhängig von Willenskraft.",
    ],
    faq: [
      {
        question:
          "Warum direkt nach dem Gehaltseingang sparen statt am Monatsende?",
        answer:
          "Weil sich sonst systematisch zu wenig ansammelt. Wird das Sparen an den Monatsanfang gestellt, gilt die Urlaubskasse als feste Ausgabe wie die Miete – unabhängig davon, was später im Monat passiert. Wird stattdessen erst am Monatsende gespart, was übrig bleibt, ist die Urlaubskasse der erste Posten, der in einem knappen Monat gestrichen wird. Dieses Prinzip, in der Verhaltensökonomie als „pay yourself first“ bekannt, lässt sich am einfachsten über einen automatischen Dauerauftrag umsetzen, der direkt am Tag des Gehaltseingangs ausgeführt wird.",
      },
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
      {
        question: "Sollte ich schon vor der Buchung mit dem Sparen anfangen?",
        answer:
          "Ja, unbedingt – aus zwei Gründen. Erstens verlängert ein früherer Start die Zahl der Monate bis zur Abreise und senkt damit die nötige Monatsrate, ganz ohne dass sich am Gesamtbudget etwas ändert. Zweitens steigt der Preis für Flug und Unterkunft in den meisten Fällen, je näher der Reisetermin rückt, besonders in den Schulferien. Wer schon vor der eigentlichen Buchung mit einer groben Kostenschätzung zu sparen beginnt, hat bei der eigentlichen Buchung nicht nur das Geld zusammen, sondern oft auch die größere Auswahl an noch verfügbaren, günstigeren Terminen.",
      },
      {
        question:
          "Wie gehe ich mit unerwarteten Zusatzkosten während der Reise um?",
        answer:
          "Am zuverlässigsten mit dem eingeplanten Puffer, der genau für diesen Fall da ist: eine spontane Aktivität, ein teureres Abendessen, ein Taxi bei Regen. Reicht der Puffer nicht, ist die zweite Verteidigungslinie das Tagesbudget vor Ort – ein Tag mit bewusst günstigerem Essen gleicht einen teureren vorher meist aus, ohne dass die Gesamtkasse gesprengt wird. Wichtig ist, Zusatzkosten laufend im Blick zu behalten statt erst am Ende der Reise nachzurechnen: Wer nach der Hälfte der Zeit merkt, dass mehr als die Hälfte des Tagesbudgets weg ist, kann für die restlichen Tage bewusst gegensteuern, statt am letzten Tag von einem leeren Konto überrascht zu werden.",
      },
      {
        question:
          "Lohnt sich ein Dauerauftrag auch bei schwankendem Einkommen?",
        answer:
          "Ja, dann aber am besten mit einer vorsichtig niedrig angesetzten Rate, die auch in einem schwächeren Monat sicher aufgebracht werden kann, statt mit dem Durchschnitt guter und schlechter Monate zu kalkulieren. Ein niedrigerer, aber garantiert durchgehaltener Dauerauftrag baut die Urlaubskasse zuverlässiger auf als ein ambitionierter Betrag, der in mageren Monaten ausgesetzt und dann oft ganz vergessen wird. In besonders guten Monaten lässt sich zusätzlich manuell aufstocken, ohne den automatischen Betrag selbst anzupassen.",
      },
    ],
  },
];
