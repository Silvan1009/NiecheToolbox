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
      "Ein Sonderfall verdient einen eigenen Blick: der erste Abschlag in einer neuen Wohnung. Ohne eigene Verbrauchshistorie schätzt der Versorger meist nach Wohnfläche und Haushaltsgröße oder übernimmt den Verbrauch der Vormieter – beides kann erheblich danebenliegen, wenn die neue Wohnung anders gedämmt ist, ein Elektroherd statt Gas installiert wurde oder schlicht andere Nutzungsgewohnheiten herrschen. Wer in den ersten Monaten den Zählerstand selbst abliest und mit dem hochgerechneten Jahresverbrauch vergleicht, kann den Abschlag schon nach dem ersten oder zweiten Monat korrigieren, statt ein ganzes Jahr lang auf eine möglicherweise deutlich falsche Schätzung zu vertrauen und am Ende von einer großen Nachzahlung oder einem unnötig hohen Guthaben überrascht zu werden.",
    ],
    faq: [
      {
        question: "Wie wird der erste Abschlag in einer neuen Wohnung festgelegt?",
        answer:
          "Meist anhand von Wohnfläche und Haushaltsgröße oder anhand des Verbrauchs der Vormieter, weil dem Versorger noch keine eigene Verbrauchshistorie vorliegt. Beide Schätzgrundlagen können erheblich danebenliegen, etwa wenn die neue Wohnung anders gedämmt ist oder andere Geräte genutzt werden als vorher. Ein eigener Zählerstand-Check nach den ersten ein bis zwei Monaten, hochgerechnet auf zwölf Monate, zeigt früh, ob der voreingestellte Abschlag realistisch ist – so lässt sich noch im laufenden Jahr nachjustieren, statt am Jahresende von einer großen Nachzahlung überrascht zu werden.",
      },
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
      {
        question: "Wie oft passt der Versorger den Abschlag von sich aus an?",
        answer:
          "In der Regel einmal im Jahr, direkt nach der Jahresabrechnung – dann rechnet er den neuen Abschlag aus dem zuletzt gemessenen Verbrauch und dem aktuell gültigen Preis. Zwischen zwei Jahresabrechnungen ändert sich der Abschlag von sich aus meist nur bei einer offiziellen Preisanpassung, die der Versorger mit Vorlauf ankündigen muss. Wer während des Jahres eine deutliche Verbrauchsänderung erwartet – etwa durch ein neues Elektrogerät, einen Umzug innerhalb der Wohnung oder einen veränderten Haushalt –, sollte die Anpassung selbst aktiv beim Versorger anstoßen, statt auf die nächste turnusmäßige Abrechnung zu warten.",
      },
      {
        question: "Gibt es einen gesetzlichen Höchstwert für den Abschlag?",
        answer:
          "Eine feste Obergrenze gibt es nicht, wohl aber eine allgemeine Angemessenheitspflicht: Der Abschlag muss sich an den tatsächlich zu erwartenden Kosten orientieren und darf nicht willkürlich hoch angesetzt werden, um dem Versorger faktisch ein zinsloses Darlehen zu verschaffen. Weicht ein vom Versorger einseitig erhöhter Abschlag offensichtlich und deutlich von der realistischen Kostenschätzung ab, kann dagegen widersprochen werden. In der Praxis orientieren sich seriöse Versorger an der letzten Jahresabrechnung zuzüglich einer moderaten Preisanpassung, sodass überzogene Abschläge eher die Ausnahme als die Regel sind.",
      },
      {
        question: "Sollte der Abschlag lieber etwas höher als exakt passend gewählt werden?",
        answer:
          "Ein kleiner Puffer nach oben ist meist sinnvoller als eine exakte Punktlandung, weil Verbrauch und Preise übers Jahr schwanken können – etwa durch einen kälteren Winter, einen neuen Mitbewohner oder eine unerwartete Preiserhöhung mitten im Abrechnungsjahr. Ein Abschlag, der fünf bis zehn Euro über der reinen Zwölftel-Rechnung liegt, führt im schlechtesten Fall zu einem kleinen Guthaben am Jahresende statt zu einer unangenehmen Nachzahlung. Wer stattdessen ganz genau plant, sollte den Abschlag konsequent nach jeder Preisänderung sofort anpassen, statt bis zur nächsten Jahresabrechnung zu warten.",
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
      "Bevor die Nachzahlung überwiesen wird, lohnt ein kurzer Prüfblick auf die Abrechnung selbst: Stimmt der abgerechnete Zeitraum mit zwölf Monaten überein oder liegt ein verkürzter oder verlängerter Zeitraum zugrunde, etwa wegen eines Umzugs oder eines Anbieterwechsels mitten im Jahr? Wurde ein Preiswechsel korrekt zu dem Datum berücksichtigt, ab dem er tatsächlich galt, und nicht rückwirkend auf den ganzen Zeitraum angewendet? Und stimmt der abgelesene oder geschätzte Zählerstand mit den eigenen Notizen überein, falls welche gemacht wurden? Fehler in Jahresabrechnungen sind keine Seltenheit, gerade bei einem Versorgerwechsel oder einem Umzug innerhalb des Abrechnungsjahres, und ein falscher Zeitraum oder ein falsch datierter Preiswechsel wirkt sich unmittelbar auf die Höhe der Nachzahlung aus.",
    ],
    faq: [
      {
        question: "Was sollte ich vor dem Bezahlen einer Nachzahlung prüfen?",
        answer:
          "Drei Dinge: ob der Abrechnungszeitraum tatsächlich zwölf Monate umfasst oder wegen eines Umzugs beziehungsweise Anbieterwechsels verkürzt beziehungsweise verlängert ist, ob ein Preiswechsel mit dem richtigen Datum angesetzt wurde und nicht rückwirkend auf den gesamten Zeitraum, und ob der abgerechnete Zählerstand mit den eigenen Ablesungen übereinstimmt, falls vorhanden. Gerade bei einem Versorgerwechsel oder Umzug mitten im Jahr passieren hier häufiger Fehler als bei einer durchgehenden Belieferung, und ein falsch angesetzter Zeitraum oder Preiswechseltermin schlägt sich direkt in der Nachzahlungshöhe nieder.",
      },
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
      {
        question: "Kann ich gegen eine Nachzahlung Widerspruch einlegen?",
        answer:
          "Ein formloser Widerspruch ist möglich, wenn die Abrechnung nachweislich fehlerhaft ist – etwa ein falscher Zählerstand, ein falsch angesetzter Abrechnungszeitraum oder ein Preis, der nicht dem tatsächlich vereinbarten Tarif entspricht. Ein bloßes Gefühl, die Summe sei zu hoch, reicht dafür nicht; nötig ist ein konkreter, benennbarer Fehler. Der Versorger muss den Widerspruch prüfen und die Abrechnung bei berechtigten Einwänden korrigieren. Bleibt der Streit ungeklärt, hilft die Schlichtungsstelle Energie als kostenlose außergerichtliche Anlaufstelle, bevor der Rechtsweg beschritten werden muss.",
      },
      {
        question: "Verjährt eine Nachforderung des Versorgers irgendwann?",
        answer:
          "Ja, nach der regulären zivilrechtlichen Verjährungsfrist von drei Jahren, die mit dem Ende des Jahres beginnt, in dem die Forderung entstanden und dem Versorger bekannt geworden ist. Stellt ein Versorger also erst nach mehreren Jahren fest, dass er zu wenig abgerechnet hat, kann eine daraus resultierende Nachforderung je nach Zeitpunkt bereits ganz oder teilweise verjährt sein. Diese Frist gilt unabhängig davon, ob der Fehler beim Versorger oder beim Kunden lag – entscheidend ist allein, wann die Forderung entstanden ist und wann der Versorger davon Kenntnis hatte oder hätte haben müssen.",
      },
      {
        question: "Was tun, wenn die Nachzahlung wirtschaftlich gar nicht zu stemmen ist?",
        answer:
          "Zuerst frühzeitig und proaktiv mit dem Versorger Kontakt aufnehmen, statt die Zahlungsfrist verstreichen zu lassen – Versorger sind an einer Lösung interessiert und bieten in aller Regel unkompliziert eine Ratenzahlung an. Bei akuter finanzieller Notlage helfen zusätzlich Beratungsstellen der Verbraucherzentralen, die auch bei der Kommunikation mit dem Versorger unterstützen können, sowie unter Umständen kommunale Härtefallfonds für Energiekosten. Wichtig ist, nicht einfach nicht zu zahlen: Eine unangekündigte Nichtzahlung kann schneller zur Sperrandrohung führen als eine aktiv angefragte, vom Versorger genehmigte Ratenzahlung.",
      },
    ],
  },
];
