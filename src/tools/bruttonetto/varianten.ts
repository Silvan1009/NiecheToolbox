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

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  /* ----------------------------------------------------------------------- */

  {
    slug: "sozialabgaben-berechnen",
    title: "Sozialabgaben berechnen 2026: Alle vier Zweige mit Grenzen",
    description:
      "Renten-, Arbeitslosen-, Kranken- und Pflegeversicherung berechnen – mit Beitragsbemessungsgrenzen 2026 und Arbeitgeberanteil.",
    heading: "Sozialabgaben berechnen",
    params: { brutto: 4000, klasse: 1 },
    about: [
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
    title: "Kirchensteuer berechnen: 8 oder 9 Prozent der Lohnsteuer",
    description:
      "Kirchensteuer vom Gehalt berechnen – 8 Prozent in Bayern und Baden-Württemberg, 9 Prozent in den übrigen Ländern, mit Austrittsrechnung.",
    heading: "Kirchensteuer berechnen",
    params: { brutto: 4000, klasse: 1, kirche: 1, land: "nw" },
    about: [
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
    title: "Arbeitgeberkosten berechnen: Was eine Stelle wirklich kostet",
    description:
      "Arbeitgeberbrutto und Lohnnebenkosten berechnen – Arbeitgeberanteil zur Sozialversicherung, Gesamtkosten und der Abstand zum Netto.",
    heading: "Arbeitgeberkosten berechnen",
    params: { brutto: 4000, klasse: 1 },
    about: [
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

];
