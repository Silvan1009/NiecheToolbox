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
    slug: "gaskosten-berechnen",
    title: "Gaskosten berechnen: Jahresrechnung mit Grundpreis und Abschlag",
    description:
      "Gaskosten für das Jahr aus Verbrauch, Arbeitspreis und Grundpreis – mit Effektivpreis je kWh und der Nachzahlung, die daraus folgt. Kostenlos und ohne Anmeldung.",
    heading: "Gaskosten berechnen",
    params: { modus: "gas", gkwh: 18000, gct: 11, ggrund: 12 },
    about: [
      "Gas wird in Kubikmetern gemessen und in Kilowattstunden abgerechnet. Auf der Rechnung steht deshalb beides, und nur die Kilowattstunden gehören in einen Rechner. Der Umrechnungsfaktor dazwischen heißt Brennwert und liegt je nach Netzgebiet zwischen 9,8 und 11,5 – multipliziert mit der sogenannten Zustandszahl von etwa 0,95 ergibt das rund 10 Kilowattstunden je Kubikmeter. Wer nur den Zählerstand kennt, rechnet mit diesem Faktor und liegt damit selten mehr als fünf Prozent daneben.",
      "Mit 18.000 Kilowattstunden, 11 Cent Arbeitspreis und 12 Euro Grundpreis im Monat kostet das Gas 2.124 Euro im Jahr: 1.980 Euro für die verbrauchte Energie und 144 Euro allein dafür, dass der Zähler hängt. Das sind 177 Euro im Monat. Der Effektivpreis, also Arbeits- und Grundpreis zusammen auf die Kilowattstunden verteilt, liegt bei 11,8 Cent – und genau diese Zahl ist die, mit der sich Angebote vergleichen lassen.",
      "18.000 Kilowattstunden entsprechen einem teilsanierten Haus mit etwa 120 Quadratmetern. Wer deutlich darüber liegt, hat es fast immer mit einem von drei Dingen zu tun: einer Heizung, die zu heiß fährt, unzureichender Dämmung an Dach oder Kellerdecke, oder einem hydraulisch nicht abgeglichenen System, bei dem einzelne Räume überversorgt werden und andere kalt bleiben. Ein hydraulischer Abgleich kostet einige hundert Euro und spart erfahrungsgemäß fünf bis fünfzehn Prozent.",
    ],
    faq: [
      {
        question: "Wie rechne ich Kubikmeter Gas in Kilowattstunden um?",
        answer:
          "Kubikmeter mal Brennwert mal Zustandszahl. Beide Werte stehen auf der Jahresabrechnung; typisch sind ein Brennwert um 11 und eine Zustandszahl um 0,95, zusammen also etwa 10,4 Kilowattstunden je Kubikmeter. Als Näherung ohne Rechnung zur Hand: Kubikmeter mal 10.",
      },
      {
        question: "Was ist ein normaler Gasverbrauch?",
        answer:
          "Als Größenordnung 150 Kilowattstunden je Quadratmeter und Jahr bei einem teilsanierten Gebäude, 200 bei einem unsanierten, 100 bei einem sanierten und 60 im Neubau. Für 120 Quadratmeter teilsaniert sind das die 18.000 Kilowattstunden, mit denen diese Seite rechnet. Enthält der Verbrauch auch das Warmwasser, kommen je Person 500 bis 800 Kilowattstunden dazu.",
      },
      {
        question: "Warum zahle ich Grundpreis, obwohl ich kaum heize?",
        answer:
          "Der Grundpreis deckt Zähler, Ablesung und Netzanschluss ab und fällt unabhängig vom Verbrauch an. Bei kleinen Verbräuchen verschiebt er das Ergebnis erheblich: 144 Euro Grundpreis sind bei 18.000 Kilowattstunden weniger als ein Cent je Einheit, bei 3.000 Kilowattstunden fast fünf. Deshalb gewinnt bei niedrigem Verbrauch oft der Tarif mit dem höheren Arbeitspreis.",
      },
    ],
  },

  {
    slug: "stromkosten-haushalt-berechnen",
    title: "Stromkosten für den Haushalt berechnen: Jahresrechnung und Abschlag",
    description:
      "Stromkosten des ganzen Haushalts aus Jahresverbrauch, Arbeitspreis und Grundpreis – mit Effektivpreis, Vergleichsverbrauch und Nachzahlung.",
    heading: "Stromkosten für den Haushalt berechnen",
    params: { modus: "strom", skwh: 3000, sct: 35, sgrund: 12 },
    about: [
      "Die Stromrechnung besteht aus zwei Teilen, und nur einer davon hängt am Verbrauch. Bei 3.000 Kilowattstunden, 35 Cent Arbeitspreis und 12 Euro Grundpreis im Monat sind das 1.050 Euro für den Strom und 144 Euro für den Zähler, zusammen 1.194 Euro im Jahr oder 99,50 Euro im Monat. Der Effektivpreis liegt damit bei 39,80 Cent je Kilowattstunde und nicht bei den 35, die im Tarif stehen.",
      "Dieser Unterschied ist der Grund, warum Tarifvergleiche über den Arbeitspreis allein in die Irre führen. Ein Angebot mit 32 Cent Arbeitspreis und 20 Euro Grundpreis kostet bei diesem Verbrauch 1.200 Euro – also mehr als der teurere Tarif. Erst ab etwa 3.600 Kilowattstunden dreht sich das Verhältnis. Wer wenig verbraucht, sollte auf den Grundpreis schauen; wer viel verbraucht, auf den Arbeitspreis.",
      "3.000 Kilowattstunden passen zu einem Zwei- bis Dreipersonenhaushalt ohne elektrische Warmwasserbereitung. Kommt das Warmwasser aus einem Durchlauferhitzer, sind 500 bis 600 Kilowattstunden je Person zusätzlich normal – bei drei Personen also fast 5.000 insgesamt. Dieser Posten ist der einzige im Haushalt, der die Verbrauchsspanne so stark verschiebt, dass ein Vergleich ohne ihn nichts aussagt.",
    ],
    faq: [
      {
        question: "Wo finde ich meinen Jahresverbrauch?",
        answer:
          "Auf der Jahresabrechnung, meist im oberen Drittel neben dem Abrechnungszeitraum. Steht dort ein Zeitraum von weniger als zwölf Monaten, muss der Wert erst auf ein Jahr hochgerechnet werden. Wer die Abrechnung nicht zur Hand hat, kann den aktuellen Zählerstand notieren und in vier Wochen erneut ablesen – das Zwölffache der Differenz ist eine brauchbare Näherung, solange keine Heizperiode dazwischenliegt.",
      },
      {
        question: "Was ist der Unterschied zwischen Arbeitspreis und Effektivpreis?",
        answer:
          "Der Arbeitspreis ist der Preis je Kilowattstunde, der Effektivpreis rechnet den Grundpreis mit ein. Bei 3.000 Kilowattstunden und 144 Euro Grundpreis liegen 4,80 Cent Unterschied dazwischen. Nur der Effektivpreis ist vergleichbar, weil er beide Preisbestandteile in einer Zahl zusammenfasst.",
      },
      {
        question: "Lohnt sich ein Stromwechsel überhaupt noch?",
        answer:
          "Bei einem Effektivpreis über 40 Cent fast immer, weil Neukundentarife derzeit deutlich darunter liegen. Der Unterschied zwischen Grundversorgung und günstigem Anbieter beträgt bei 3.000 Kilowattstunden häufig 200 bis 300 Euro im Jahr. Der Wechsel ändert nichts an der Versorgungssicherheit: Fällt ein Anbieter aus, springt automatisch der Grundversorger ein.",
      },
    ],
  },

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
        question: "Warum ist mein Abschlag höher als ein Zwölftel der letzten Rechnung?",
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

  {
    slug: "stromverbrauch-4-personen-haushalt",
    title: "Stromverbrauch 4-Personen-Haushalt: Normalwert und Kosten",
    description:
      "Wie viel Strom eine vierköpfige Familie verbraucht, was das im Jahr kostet und ab wann der eigene Verbrauch auffällig hoch ist.",
    heading: "Stromverbrauch im 4-Personen-Haushalt",
    params: { modus: "strom", skwh: 4200, sct: 35, sgrund: 12, personen: 4 },
    about: [
      "Ein Vierpersonenhaushalt verbraucht ohne elektrische Warmwasserbereitung typischerweise rund 4.200 Kilowattstunden im Jahr. Der Wert entsteht nicht linear: Die erste Person bringt etwa 1.500 Kilowattstunden mit, jede weitere rund 900. Kühlschrank, Router, Heizungspumpe und Beleuchtung laufen nämlich unabhängig davon, wie viele Menschen im Haushalt wohnen – nur Waschmaschine, Trockner, Herd und Unterhaltung skalieren mit den Köpfen.",
      "Bei 35 Cent Arbeitspreis und 12 Euro Grundpreis kostet dieser Verbrauch 1.614 Euro im Jahr, also 134,50 Euro im Monat. Der Effektivpreis liegt bei 38,43 Cent je Kilowattstunde. Wer stattdessen über einen Durchlauferhitzer duscht, muss mit 500 bis 600 Kilowattstunden je Person zusätzlich rechnen – bei vier Personen also mit etwa 6.400 Kilowattstunden und rund 2.380 Euro.",
      "Deutlich über 6.000 Kilowattstunden ohne elektrisches Warmwasser sind ein Hinweis, dem sich nachgehen lohnt. Die üblichen Verursacher sind in dieser Reihenfolge: ein Wäschetrockner ohne Wärmepumpe, ein Kühl- oder Gefriergerät älter als fünfzehn Jahre, ein Gaming-PC oder Server im Dauerbetrieb, und eine alte Umwälzpumpe der Heizung. Jeder einzelne dieser Posten kann mehrere hundert Kilowattstunden im Jahr ausmachen.",
    ],
    faq: [
      {
        question: "Wie viel Strom verbraucht eine Familie mit zwei Kindern?",
        answer:
          "Etwa 4.000 bis 4.500 Kilowattstunden im Jahr ohne elektrisches Warmwasser, mit Durchlauferhitzer 6.000 bis 7.000. Die Spanne ist groß, weil einzelne Geräte stark ins Gewicht fallen: Ein Trockner mit drei Durchgängen pro Woche kostet allein 300 bis 400 Kilowattstunden.",
      },
      {
        question: "Ist mein Verbrauch zu hoch?",
        answer:
          "Der Rechner zeigt neben dem eingetragenen Verbrauch immer den Erwartungswert für die eingestellte Haushaltsgröße. Liegt der eigene Wert mehr als die Hälfte darüber, weist er ausdrücklich darauf hin. Bis etwa zwanzig Prozent Abweichung ist alles normale Streuung durch Wohnsituation und Gewohnheiten.",
      },
      {
        question: "Wo spare ich im großen Haushalt am meisten?",
        answer:
          "Bei den Geräten, die viel und lange laufen: Trockner, Gefriergerät, Kühlschrank. Wäsche auf der Leine statt im Trockner spart bei drei Ladungen pro Woche rund 130 Euro im Jahr. Danach kommt der Tarif – ein Wechsel bringt bei 4.200 Kilowattstunden schnell 200 Euro, und zwar ohne dass sich im Alltag irgendetwas ändert.",
      },
    ],
  },

  {
    slug: "gasverbrauch-einfamilienhaus",
    title: "Gasverbrauch Einfamilienhaus: Normalwert und Heizkosten im Jahr",
    description:
      "Wie viel Gas ein Einfamilienhaus verbraucht, was das Heizen im Jahr kostet und woran ein zu hoher Verbrauch liegt.",
    heading: "Gasverbrauch im Einfamilienhaus",
    params: {
      modus: "gas",
      gkwh: 22500,
      gct: 11,
      ggrund: 14,
      qm: 150,
      standard: "teilsaniert",
    },
    about: [
      "Der Gasverbrauch eines Hauses hängt fast ausschließlich an zwei Größen: Wohnfläche und Dämmzustand. Ein teilsaniertes Einfamilienhaus mit 150 Quadratmetern braucht rund 150 Kilowattstunden je Quadratmeter und Jahr, insgesamt also etwa 22.500 Kilowattstunden. Unsaniert wären es 200 je Quadratmeter und damit 30.000, im Neubaustandard 60 und damit 9.000. Zwischen dem schlechtesten und dem besten Fall liegt bei gleicher Fläche also der Faktor drei.",
      "Bei 11 Cent Arbeitspreis und 14 Euro Grundpreis kosten die 22.500 Kilowattstunden 2.643 Euro im Jahr: 2.475 Euro Energie und 168 Euro Grundpreis. Das sind 220,25 Euro im Monat und ein Effektivpreis von 11,75 Cent je Kilowattstunde. Weil beim Heizen so viele Kilowattstunden zusammenkommen, wiegt ein Cent Preisunterschied hier schwer – ein Cent weniger sind 225 Euro im Jahr.",
      "Wer deutlich über dem Erwartungswert liegt, sollte in dieser Reihenfolge prüfen: die Vorlauftemperatur der Heizung, die bei vielen Anlagen unnötig hoch eingestellt ist; die Dämmung der obersten Geschossdecke, die günstigste Maßnahme überhaupt; den hydraulischen Abgleich, damit entfernte Räume nicht über eine höhere Pumpenleistung mitversorgt werden müssen; und schließlich die Fenster. Die Reihenfolge ist nach Kosten je gesparter Kilowattstunde sortiert, nicht nach Aufwand.",
    ],
    faq: [
      {
        question: "Wie viel Gas verbraucht ein Einfamilienhaus im Jahr?",
        answer:
          "Bei 150 Quadratmetern rund 22.500 Kilowattstunden im teilsanierten Zustand, 30.000 unsaniert und 15.000 nach einer vollständigen Sanierung. Ist das Warmwasser mit dabei, kommen je Person 500 bis 800 Kilowattstunden hinzu.",
      },
      {
        question: "Was kostet Heizen mit Gas pro Quadratmeter?",
        answer:
          "Bei 150 Kilowattstunden je Quadratmeter und 11 Cent Arbeitspreis etwa 16,50 Euro je Quadratmeter und Jahr, zuzüglich Grundpreis. Für 150 Quadratmeter sind das die 2.643 Euro, mit denen diese Seite rechnet. Im Neubaustandard sinkt der Wert auf rund 6,60 Euro je Quadratmeter.",
      },
      {
        question: "Lohnt sich der Wechsel zur Wärmepumpe?",
        answer:
          "Rechnerisch dann, wenn das Haus mit niedriger Vorlauftemperatur warm wird – also bei guter Dämmung oder Flächenheizung. Eine Wärmepumpe mit Jahresarbeitszahl 3,5 braucht für die 22.500 Kilowattstunden Wärme etwa 6.400 Kilowattstunden Strom; zu 30 Cent sind das 1.920 Euro gegen 2.643 Euro Gas. Diese Rechnung kippt schnell, wenn die Anlage im unsanierten Bestand mit hoher Vorlauftemperatur laufen muss. Der Rechner hier vergleicht keine Heizsysteme, sondern rechnet den Ist-Zustand durch.",
      },
    ],
  },
];
