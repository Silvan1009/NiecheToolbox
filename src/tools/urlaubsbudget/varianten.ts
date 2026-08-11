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

  {
    slug: "budget-2-wochen-urlaub",
    title: "Budget für 2 Wochen Urlaub: Was kostet eine zweiwöchige Reise?",
    description:
      "Kosten für zwei Wochen Urlaub zu zweit berechnen – Anreise, Unterkunft, Verpflegung und Tagesbudget vor Ort, mit Puffer.",
    heading: "Budget für zwei Wochen Urlaub",
    params: { naechte: 14, erw: 2, nacht: 90, essen: 35 },
    about: [
      "Zwei Wochen kosten nicht das Doppelte einer Woche. Die Anreise fällt nur einmal an, und genau das macht die längere Reise pro Tag günstiger. Für zwei Personen, vierzehn Nächte zu 90 Euro und 35 Euro Verpflegung je Person und Tag ergibt sich hier ein Budget von 3.696 Euro – also 1.848 Euro pro Person und 246,40 Euro pro Tag. Bei einer Woche unter sonst gleichen Bedingungen liegt der Tagessatz spürbar höher, weil sich die 440 Euro Flug auf halb so viele Tage verteilen.",
      "Vierzehn Nächte bedeuten fünfzehn Tage, an denen gegessen wird – der Anreisetag zählt mit. Das klingt nach einer Kleinigkeit, macht bei zwei Personen und 35 Euro aber 70 Euro aus, und dieselbe Verwechslung steckt in fast jedem selbst gebauten Reisebudget. Der Rechner unterscheidet deshalb konsequent zwischen Nächten für die Unterkunft und Tagen für alles, was vor Ort ausgegeben wird.",
      "Der Puffer von zehn Prozent, hier 336 Euro, ist bei langen Reisen wichtiger als bei kurzen. Nicht weil mehr schiefgeht, sondern weil mehr Gelegenheiten entstehen: der Tagesausflug, der sich erst vor Ort ergibt, das teurere Restaurant am letzten Abend, die zweite Runde Mitbringsel. Ein Budget ohne Puffer wird an genau diesen Stellen gerissen – und dann fühlt sich der Urlaub nach Verzicht an, obwohl das Geld eigentlich da war.",
    ],
    faq: [
      {
        question: "Was kosten zwei Wochen Urlaub für zwei Personen?",
        answer:
          "Mit Flug für 220 Euro je Person, 90 Euro Unterkunft pro Nacht und 35 Euro Verpflegung je Person und Tag kommen 3.696 Euro zusammen, Puffer eingerechnet. Das sind 1.848 Euro pro Person. Ohne Flug und mit Ferienwohnung statt Hotel sinkt der Betrag schnell unter 2.500 Euro, mit Fernreise und Vollpension liegt er leicht beim Doppelten.",
      },
      {
        question: "Sind zwei Wochen günstiger als zweimal eine Woche?",
        answer:
          "Deutlich. Die Anreise fällt nur einmal an statt zweimal, hier also 440 statt 880 Euro. Dazu kommen bei vielen Unterkünften Wochenrabatte ab der zweiten Woche. Pro Urlaubstag ist die lange Reise fast immer die günstigere, sofern der Flug ein nennenswerter Posten ist.",
      },
      {
        question: "Wie viel Geld brauche ich pro Tag vor Ort?",
        answer:
          "In diesem Beispiel 108 Euro für zwei Personen, also 54 Euro je Person und Tag – Verpflegung, Aktivitäten und Nahverkehr zusammen, ohne Unterkunft. In Südeuropa reicht das gut, in Skandinavien oder der Schweiz sind eher 80 bis 100 Euro je Person realistisch, in Südostasien die Hälfte.",
      },
    ],
  },

  {
    slug: "familienurlaub-kosten",
    title: "Familienurlaub Kosten: Was kostet Urlaub mit zwei Kindern?",
    description:
      "Urlaubskosten für eine vierköpfige Familie berechnen – mit anteiliger Rechnung für Kinder bei Verpflegung und Aktivitäten.",
    heading: "Familienurlaub: die Kosten",
    params: { erw: 2, kind: 2, naechte: 7, nacht: 140, essen: 30 },
    about: [
      "Bei einer Familie geht die einfache Multiplikation mit der Kopfzahl schief, weil Kinder nicht überall gleich viel kosten. Beim Flug zahlen sie ab zwei Jahren fast den vollen Preis, beim Essen und bei Eintritten deutlich weniger, und im Familienzimmer kosten sie oft gar nichts extra. Dieser Rechner trennt das: Die Anreise zählt jeden Kopf voll, Verpflegung und Aktivitäten nur zu 60 Prozent, und die Unterkunft läuft ohnehin pro Nacht statt pro Person.",
      "Für zwei Erwachsene und zwei Kinder, sieben Nächte im Familienzimmer zu 140 Euro und 30 Euro Verpflegung je Person und Tag ergibt das 3.489,20 Euro – 872,30 Euro pro Kopf. Der größte Posten ist mit 980 Euro die Unterkunft, dicht gefolgt von 880 Euro Anreise. Die 60-Prozent-Regel für die Kinder senkt die Verpflegung von 960 auf 768 Euro; wer mit Teenagern reist, sollte den Faktor auf 90 oder 100 Prozent stellen.",
      "Der Zeitpunkt entscheidet bei Familien stärker über den Preis als bei allen anderen. Wer an Ferientermine gebunden ist, zahlt für dieselbe Woche regelmäßig 30 bis 50 Prozent mehr – bei diesem Budget also bis zu 1.700 Euro Aufschlag. Die einzigen echten Hebel dagegen sind die erste und die letzte Ferienwoche, Ziele mit abweichenden Schulferien und eine Buchung mehr als ein halbes Jahr im Voraus. Alle drei wirken deutlich stärker als jedes Sparen vor Ort.",
    ],
    faq: [
      {
        question: "Was kostet Urlaub für eine vierköpfige Familie?",
        answer:
          "Eine Woche mit Familienzimmer für 140 Euro pro Nacht, Flug für 220 Euro je Person und 30 Euro Verpflegung je Person und Tag kostet 3.489,20 Euro, Puffer eingerechnet. Ohne Flug, mit Ferienwohnung und Selbstverpflegung liegt dieselbe Woche bei etwa der Hälfte.",
      },
      {
        question: "Wie stark zählen Kinder im Reisebudget?",
        answer:
          "Bei Verpflegung und Aktivitäten voreingestellt zu 60 Prozent, was für Grundschulkinder gut passt. Kleinkinder liegen eher bei 30 bis 40 Prozent, Teenager bei 90 bis 100. Bei Flug und Bahn zählen Kinder ab zwei Jahren dagegen fast voll – deshalb rechnet der Rechner die Anreise bewusst pro Kopf ohne Abschlag.",
      },
      {
        question: "Wo spart eine Familie am meisten?",
        answer:
          "Am Reisezeitpunkt, sofern es einen Spielraum gibt: Die erste oder letzte Ferienwoche kostet oft ein Drittel weniger als die Wochen dazwischen. Danach kommt die Unterkunftsform – eine Ferienwohnung mit Küche senkt nicht nur den Zimmerpreis, sondern auch die Verpflegung um die Hälfte, weil Frühstück und ein Teil der Abendessen wegfallen.",
      },
    ],
  },

  {
    slug: "tagesbudget-urlaub",
    title: "Tagesbudget im Urlaub berechnen: Wie viel Geld pro Tag?",
    description:
      "Wie viel Geld pro Tag im Urlaub eingeplant werden sollte – Verpflegung, Aktivitäten und Nahverkehr, ohne Anreise und Unterkunft.",
    heading: "Tagesbudget im Urlaub",
    params: {
      erw: 1,
      naechte: 7,
      essen: 40,
      aktiv: 20,
      anreisepp: 0,
      nacht: 0,
      transport: 60,
      vers: 0,
    },
    about: [
      "Das Tagesbudget ist nicht das Gesamtbudget geteilt durch die Tage. Anreise und Unterkunft sind vorab bezahlt und liegen nicht mehr in der Geldbörse – sie gehören deshalb nicht in die Zahl, an der man sich vor Ort orientiert. Diese Seite blendet beides aus und zeigt nur, was tatsächlich täglich ausgegeben wird: Verpflegung, Aktivitäten und Nahverkehr. Für eine Person mit 40 Euro Essen und 20 Euro Aktivitäten am Tag sind das 67,50 Euro.",
      "Sieben Nächte bedeuten acht Tage. Diese Unterscheidung ist der häufigste Fehler in selbst gerechneten Reisebudgets, und sie geht immer in dieselbe Richtung: Wer mit den Nächten multipliziert, plant einen ganzen Tag Verpflegung zu wenig ein. Bei 60 Euro am Tag fehlen so 60 Euro – genug für den letzten Abend, an dem man üblicherweise essen geht.",
      "Als Größenordnung für Europa: 50 bis 70 Euro je Person und Tag in Süd- und Osteuropa, 80 bis 110 in Skandinavien, der Schweiz und Island, 60 bis 90 in Frankreich, Italien und Spanien außerhalb der Touristenzentren. Diese Spannen gelten für Selbstverpflegung am Morgen und ein Restaurantessen am Tag. Wer dreimal täglich auswärts isst, landet am oberen Rand oder darüber – und wer ein All-inclusive-Hotel gebucht hat, braucht vor Ort fast nichts und sollte hier nur die Ausflüge eintragen.",
    ],
    faq: [
      {
        question: "Wie viel Geld pro Tag brauche ich im Urlaub?",
        answer:
          "In Europa 50 bis 90 Euro je Person und Tag für Verpflegung, Aktivitäten und Nahverkehr, je nach Land und Essgewohnheiten. Die Voreinstellung dieser Seite liegt mit 67,50 Euro mittendrin. Unterkunft und Anreise sind darin bewusst nicht enthalten, weil sie vorab bezahlt werden.",
      },
      {
        question:
          "Warum rechnet der Rechner mit acht Tagen bei sieben Nächten?",
        answer:
          "Weil der Anreisetag mitgegessen wird. Wer am Samstag anreist und am Samstag darauf zurückfliegt, hat sieben Übernachtungen, aber acht Tage mit Frühstück, Mittag und Abendessen. Die Unterkunft rechnet der Planer deshalb nach Nächten, alles Übrige nach Tagen.",
      },
      {
        question: "Wie viel Bargeld sollte ich dabeihaben?",
        answer:
          "Ein bis zwei Tagesbudgets als Reserve, hier also 70 bis 140 Euro, plus Karte für alles Übrige. In Südeuropa und auf Märkten wird häufiger bar gezahlt als in Deutschland, in Skandinavien praktisch gar nicht mehr. Große Beträge lohnt es sich nicht zu tauschen: Der Kurs am Flughafen ist regelmäßig der schlechteste des ganzen Urlaubs.",
      },
    ],
  },
];
