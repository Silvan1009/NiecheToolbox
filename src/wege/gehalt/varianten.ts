/**
 * Inhalte der SEO-Unterseiten des Gehaltserhöhungs-Wegs – eine Seite je
 * gängiger Erhöhungsgröße. Alle Zahlenbeispiele sind mit 4.000 Euro
 * Ausgangsgehalt, Steuerklasse I, Nordrhein-Westfalen, ohne Kirchensteuer,
 * kinderlos, gesetzlich versichert mit dem durchschnittlichen Zusatzbeitrag
 * nachgerechnet (Rechengrößen 2026) – und mit den Sparplan-Voreinstellungen
 * (7 % Rendite, 0,2 % Kosten, 2 % Inflation) über 20 Jahre projiziert.
 */

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  /* ----------------------------------------------------------------------- */

  {
    slug: "3-prozent",
    title: "3 Prozent mehr Gehalt: Was netto ankommt",
    description:
      "3 Prozent Gehaltserhöhung: Brutto-Plus, Netto-Plus und Grenzbelastung berechnen – plus 20 Jahre gespart.",
    heading: "3 Prozent mehr Gehalt – was bleibt netto?",
    params: { erhoehung: 3 },
    about: [
      "3 Prozent auf 4.000 Euro sind 120 Euro brutto mehr im Monat. Netto bleiben davon rund 64 Euro – eine Grenzbelastung von etwa 46 Prozent. Das liegt über dem Durchschnittssteuersatz von rund 35 Prozent, weil ein Steuersatz von 46 Prozent nur auf den zusätzlichen Teil wirkt, nicht auf das ganze Gehalt.",
      "Über eine Erhöhungsrunde hinweg wirkt eine 3-Prozent-Erhöhung klein, meist unter der Inflationsrate. Wer sie trotzdem konsequent anlegt, sieht den Unterschied erst über Jahre: 64 Euro monatlich, 20 Jahre lang mit 7 Prozent Rendite verzinst, ergeben nach Kosten und Steuern rund 30.250 Euro – bei eingezahlten 15.460 Euro also mehr als das Doppelte.",
      "Realistischer als eine isolierte 3-Prozent-Erhöhung ist häufig eine Kombination: ein tariflicher oder inflationsbedingter Sockel plus eine individuelle Komponente. Wer verhandelt, sollte trotzdem mit der Grenzbelastung rechnen, nicht mit dem Bruttobetrag – die Zahl, die am Ende zählt, ist immer kleiner als die auf dem Papier.",
    ],
    faq: [
      {
        question: "Was bringen 3 Prozent mehr Gehalt netto?",
        answer:
          "Bei 4.000 Euro Ausgangsgehalt in Steuerklasse I sind 3 Prozent 120 Euro brutto, davon kommen rund 64 Euro netto an – eine Grenzbelastung von etwa 46 Prozent. Bei einem höheren Ausgangsgehalt ist die Grenzbelastung minimal höher, bei einem niedrigeren minimal niedriger.",
      },
      {
        question: "Lohnt sich eine so kleine Erhöhung überhaupt?",
        answer:
          "Einzeln betrachtet wenig, kontinuierlich angelegt spürbar mehr: 64 Euro im Monat werden über 20 Jahre bei 7 Prozent Rendite zu rund 30.250 Euro nach Steuern, bei eingezahlten 15.460 Euro. Der Zinseszinseffekt macht aus einer kleinen monatlichen Differenz über die Zeit einen großen Betrag.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "5-prozent",
    title: "5 Prozent mehr Gehalt: Was netto ankommt",
    description:
      "5 Prozent Gehaltserhöhung: Brutto-Plus, Netto-Plus und Grenzbelastung berechnen – plus 20 Jahre gespart.",
    heading: "5 Prozent mehr Gehalt – was bleibt netto?",
    params: { erhoehung: 5 },
    about: [
      "5 Prozent auf 4.000 Euro sind 200 Euro brutto mehr im Monat, netto kommen davon rund 107 Euro an. Die Grenzbelastung liegt bei etwa 46,5 Prozent – minimal höher als bei einer 3-Prozent-Erhöhung, weil der Steuertarif progressiv ist und der zusätzliche Betrag in einer Zone mit etwas höherem Grenzsteuersatz landet.",
      "5 Prozent gelten oft als spürbare Erhöhung, weil sie über der üblichen Inflationsrate liegt. Trotzdem bleibt real weniger als die Hälfte des Bruttobetrags übrig – ein Punkt, der in Gehaltsverhandlungen häufig übersehen wird, weil dort meist in Brutto- statt in Nettozahlen gedacht wird.",
      "107 Euro monatlich, 20 Jahre lang angelegt mit den Standardannahmen des Sparplan-Rechners, ergeben nach Kosten und Steuern rund 50.120 Euro bei 25.700 Euro Einzahlung. Das ist der Betrag, den allein diese eine Gehaltserhöhung über zwei Jahrzehnte an zusätzlichem Vermögen ermöglicht, wenn sie konsequent zur Seite gelegt wird statt im laufenden Konsum aufzugehen.",
    ],
    faq: [
      {
        question: "Was bringen 5 Prozent mehr Gehalt netto?",
        answer:
          "Bei 4.000 Euro Ausgangsgehalt in Steuerklasse I sind 5 Prozent 200 Euro brutto, davon kommen rund 107 Euro netto an – eine Grenzbelastung von etwa 46,5 Prozent. Mit Kirchensteuer oder in einer höheren Steuerklasse fällt der Netto-Anteil etwas geringer aus.",
      },
      {
        question: "Was wird aus 107 Euro mehr im Monat über 20 Jahre?",
        answer:
          "Mit den Standardannahmen des Sparplan-Rechners – 7 Prozent Rendite, 0,2 Prozent laufende Kosten, Abgeltungsteuer – wachsen 107 Euro monatlich über 20 Jahre auf rund 50.120 Euro nach Steuern an, bei 25.700 Euro Einzahlung. Eine höhere oder niedrigere Rendite verschiebt das Ergebnis deutlich; der Rechner lässt sich dafür anpassen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "10-prozent",
    title: "10 Prozent mehr Gehalt: Was netto ankommt",
    description:
      "10 Prozent Gehaltserhöhung: Brutto-Plus, Netto-Plus und Grenzbelastung berechnen – plus 20 Jahre gespart.",
    heading: "10 Prozent mehr Gehalt – was bleibt netto?",
    params: { erhoehung: 10 },
    about: [
      "10 Prozent auf 4.000 Euro sind 400 Euro brutto mehr im Monat, netto kommen davon rund 213 Euro an – eine Grenzbelastung von knapp 47 Prozent. Eine Erhöhung dieser Größenordnung entsteht meist nicht in einer einzigen Verhandlungsrunde, sondern durch einen Stellenwechsel, eine Beförderung oder mehrere Erhöhungsschritte, die zusammengerechnet werden.",
      "Bei dieser Größenordnung lohnt sich der Blick auf Alternativen zum reinen Bruttogehalt: Ein steuerfreier Sachbezug, das Deutschlandticket als Jobticket oder eine Entgeltumwandlung in die betriebliche Altersvorsorge kommen ganz oder größtenteils an – ohne die Grenzbelastung von rund 47 Prozent zu durchlaufen. Bei einem Stellenwechsel lässt sich das gleich mitverhandeln.",
      "213 Euro monatlich, 20 Jahre lang mit den Sparplan-Standardannahmen angelegt, ergeben nach Kosten und Steuern rund 99.140 Euro bei 51.120 Euro Einzahlung – fast die Verdopplung des eingezahlten Betrags allein durch Zinseszins auf die Differenz einer einzigen Gehaltserhöhung.",
    ],
    faq: [
      {
        question: "Was bringen 10 Prozent mehr Gehalt netto?",
        answer:
          "Bei 4.000 Euro Ausgangsgehalt in Steuerklasse I sind 10 Prozent 400 Euro brutto, davon kommen rund 213 Euro netto an – eine Grenzbelastung von knapp 47 Prozent. Je höher das Ausgangsgehalt, desto größer der Anteil, der an Steuer und Sozialabgaben geht.",
      },
      {
        question: "Ist eine Sachleistung besser als 10 Prozent mehr Brutto?",
        answer:
          "Für einen Teilbetrag oft ja: Steuerfreie Sachbezüge bis 50 Euro im Monat, das Jobticket oder eine betriebliche Altersvorsorge aus dem Bruttolohn kommen ganz oder überwiegend an, während vom restlichen Bruttogehalt nur rund 53 Prozent übrig bleiben. Beides zu kombinieren – ein Teil Sachleistung, ein Teil Gehalt – bringt meist mehr netto als 400 Euro reines Brutto.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "15-prozent",
    title: "15 Prozent mehr Gehalt: Was netto ankommt",
    description:
      "15 Prozent Gehaltserhöhung: Brutto-Plus, Netto-Plus und Grenzbelastung berechnen – plus 20 Jahre gespart.",
    heading: "15 Prozent mehr Gehalt – was bleibt netto?",
    params: { erhoehung: 15 },
    about: [
      "15 Prozent auf 4.000 Euro sind 600 Euro brutto mehr im Monat, netto kommen davon rund 318 Euro an – eine Grenzbelastung von etwa 47 Prozent. Eine Erhöhung dieser Größenordnung ist meist ein Jobwechsel oder eine Beförderung mit neuer Verantwortung, seltener eine einzelne Gehaltsrunde im bestehenden Vertrag.",
      "Bei so einem Sprung lohnt sich ein zweiter Blick auf die Steuerklasse und – bei Verheirateten – auf die Kombination beider Einkommen: Eine ungünstige Steuerklassenwahl kostet an dieser Stelle spürbar mehr als bei einer kleinen Erhöhung, weil die absolute Differenz größer ist. Der Brutto-Netto-Rechner zeigt die Klassen im direkten Vergleich.",
      "318 Euro monatlich, 20 Jahre lang mit den Sparplan-Standardannahmen angelegt, ergeben nach Kosten und Steuern rund 147.000 Euro bei 76.300 Euro Einzahlung. Wer diesen Betrag konsequent anlegt statt den Lebensstandard in gleichem Maß anzuheben, baut daraus über zwei Jahrzehnte einen erheblichen Teil einer privaten Altersvorsorge auf.",
    ],
    faq: [
      {
        question: "Was bringen 15 Prozent mehr Gehalt netto?",
        answer:
          "Bei 4.000 Euro Ausgangsgehalt in Steuerklasse I sind 15 Prozent 600 Euro brutto, davon kommen rund 318 Euro netto an – eine Grenzbelastung von etwa 47 Prozent. Mit Kirchensteuer oder höherem Ausgangsgehalt verschiebt sich der Wert leicht.",
      },
      {
        question: "Was wird aus 318 Euro mehr im Monat über 20 Jahre?",
        answer:
          "Mit den Standardannahmen des Sparplan-Rechners – 7 Prozent Rendite, 0,2 Prozent laufende Kosten, Abgeltungsteuer – wachsen 318 Euro monatlich über 20 Jahre auf rund 147.000 Euro nach Steuern an, bei 76.300 Euro Einzahlung. Das ist kein Ersatz für eine Finanzberatung, sondern eine Orientierung mit den Standardannahmen des Sparplan-Rechners.",
      },
    ],
  },
];
