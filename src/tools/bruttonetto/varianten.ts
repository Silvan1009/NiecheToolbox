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
      "Anders als die Lohnsteuer sind die Sozialabgaben nicht progressiv, sondern bis zur jeweiligen Beitragsbemessungsgrenze proportional: Ein zusätzlicher Euro Brutto kostet unterhalb der Grenze immer denselben Prozentsatz an Sozialabgaben, egal ob das Ausgangsgehalt bei 2.000 oder bei 6.000 Euro liegt. Das unterscheidet sie grundlegend von der Einkommensteuer, deren Grenzsteuersatz mit steigendem Einkommen zunimmt. Für die Grenzbelastung einer Gehaltserhöhung bedeutet das: Solange beide Beitragsbemessungsgrenzen noch nicht erreicht sind, bleibt der Sozialabgaben-Anteil an jedem zusätzlichen Euro konstant, während der Steueranteil mit dem Einkommen wächst – die Sozialabgaben sind also der stabilere, die Lohnsteuer der variablere Teil der Gesamtbelastung.",
    ],
    faq: [
      {
        question: "Warum steigen Sozialabgaben nicht progressiv wie die Lohnsteuer?",
        answer:
          "Weil sie als feste Prozentsätze auf das Bruttogehalt berechnet werden, nicht nach einem gestaffelten Tarif wie die Einkommensteuer. Bis zur jeweiligen Beitragsbemessungsgrenze kostet jeder zusätzliche Euro Brutto denselben Anteil an Sozialabgaben, unabhängig von der Gehaltshöhe. Erst oberhalb der Grenzen ändert sich das Bild: Für Kranken- und Pflegeversicherung ist bei 69.750 Euro im Jahr Schluss, für Renten- und Arbeitslosenversicherung bei 101.400 Euro – darüber sinkt der Sozialabgaben-Anteil an einem zusätzlichen Euro auf null, während der Lohnsteueranteil weiter zunimmt.",
      },
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
      {
        question: "Warum unterscheiden sich West und Ost bei der Rentenversicherung nicht mehr?",
        answer:
          "Bis 2024 gab es tatsächlich noch unterschiedliche Beitragsbemessungsgrenzen für die alten und neuen Bundesländer, ein Überbleibsel der Wiedervereinigung. Seit dem 1. Januar 2025 gilt bundesweit eine einheitliche Grenze für die Rentenversicherung, nachdem sich die Lohnentwicklung in Ost und West so weit angeglichen hatte, dass die separate Regelung entfallen konnte. Für die Kranken- und Pflegeversicherung galt ohnehin schon länger eine bundeseinheitliche Grenze, weil sie sich nicht an regionalen Lohnstatistiken, sondern an einer bundesweiten Bezugsgröße orientiert.",
      },
      {
        question: "Zahlen Minijobber auch Sozialabgaben?",
        answer:
          "Bei einem klassischen Minijob bis 556 Euro im Monat zahlt der Arbeitnehmer in der Regel keine eigenen Sozialabgaben, sofern er sich nicht ausdrücklich für die Rentenversicherungspflicht entscheidet – dann werden nur rund 3,6 Prozent für die Rentenversicherung fällig, alles andere trägt pauschal der Arbeitgeber. Diese Wahlmöglichkeit lohnt sich meist, weil sie Wartezeiten für die Rente aufbaut und den Anspruch auf Riester-Förderung erhält. Im Übergangsbereich zwischen 556 und 2.000 Euro, dem sogenannten Midijob, steigen die Arbeitnehmeranteile gleitend von nahe null bis zum vollen regulären Satz an – dieser Übergangsbereich wird von diesem Rechner nicht abgebildet, der für reguläre Beschäftigungsverhältnisse oberhalb der Midijob-Grenze gilt.",
      },
      {
        question: "Warum werden Sozialabgaben paritätisch genannt, obwohl sie unterschiedlich verteilt sind?",
        answer:
          "Der Begriff bezieht sich auf das Grundprinzip, dass Arbeitgeber und Arbeitnehmer die Beiträge je zur Hälfte tragen – bei Renten- und Arbeitslosenversicherung trifft das exakt zu. Bei der Krankenversicherung galt lange ein Arbeitgeberanteil, der niedriger war als der Arbeitnehmeranteil, weil der Zusatzbeitrag ursprünglich allein von Beschäftigten getragen wurde; seit 2019 wird auch dieser wieder paritätisch geteilt. Echte Abweichungen von der Parität bleiben der Kinderlosenzuschlag zur Pflegeversicherung, den ausschließlich der Arbeitnehmer trägt, und die sächsische Sonderregelung bei der Pflegeversicherung, bei der Arbeitnehmer einen höheren und Arbeitgeber einen entsprechend niedrigeren Anteil zahlen.",
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
      "Kirchensteuerpflichtig ist, wer Mitglied einer steuererhebungsberechtigten Religionsgemeinschaft ist – neben den beiden großen christlichen Kirchen erheben auch mehrere jüdische Kultusgemeinden und einzelne kleinere Religionsgemeinschaften eine eigene Kirchensteuer, oft mit abweichenden Sätzen. Maßgeblich für die Feststellung ist die Kirchensteuerpflicht laut den elektronischen Lohnsteuerabzugsmerkmalen, kurz ELStAM, die der Arbeitgeber beim Bundeszentralamt für Steuern automatisch abruft. Ein Wechsel der Konfession, eine Taufe oder ein Austritt wird über das jeweils zuständige Meldeamt in dieses System eingetragen und wirkt sich dann automatisch auf den nächsten Lohnabzug aus, ohne dass der Arbeitgeber selbst tätig werden muss.",
    ],
    faq: [
      {
        question: "Wer genau ist kirchensteuerpflichtig?",
        answer:
          "Mitglieder der evangelischen und katholischen Kirche sind es in jedem Bundesland, daneben erheben auch mehrere jüdische Kultusgemeinden sowie einzelne kleinere Religionsgemeinschaften eine eigene Kirchensteuer, teils mit abweichenden Sätzen. Maßgeblich ist die Eintragung in den elektronischen Lohnsteuerabzugsmerkmalen (ELStAM), die der Arbeitgeber automatisch beim Bundeszentralamt für Steuern abruft. Taufe, Kircheneintritt, Konfessionswechsel oder Austritt werden über das zuständige Meldeamt beziehungsweise Standesamt in dieses System eingetragen und wirken sich dann automatisch auf den nächsten Lohnabzug aus.",
      },
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
      {
        question: "Was passiert bei einem Wiedereintritt in die Kirche?",
        answer:
          "Die Kirchensteuerpflicht lebt ab dem Monat wieder auf, der auf den Wiedereintritt folgt – rückwirkend wird nichts nacherhoben. Der Wiedereintritt wird beim zuständigen Pfarramt oder Kirchenamt erklärt und von dort an die Meldebehörde weitergegeben, die die elektronischen Lohnsteuerabzugsmerkmale entsprechend aktualisiert. Bis diese Aktualisierung beim Arbeitgeber ankommt, können ein bis zwei Lohnabrechnungen ohne Kirchensteuerabzug vergehen; das gleicht sich spätestens mit der nächsten Steuererklärung oder einer korrigierten Lohnabrechnung wieder aus, sodass am Jahresende die korrekte Kirchensteuer für die tatsächliche Mitgliedschaftsdauer steht.",
      },
      {
        question: "Zahlen auch Selbstständige Kirchensteuer?",
        answer:
          "Ja, aber nicht über den Lohnsteuerabzug, sondern über die Einkommensteuer-Vorauszahlung und die Steuererklärung: Das Finanzamt setzt die Kirchensteuer als Prozentsatz der festgesetzten Einkommensteuer fest, in derselben Höhe wie bei Angestellten – 8 Prozent in Bayern und Baden-Württemberg, 9 Prozent in den übrigen Bundesländern. Wer schwankende Einkünfte hat, zahlt zunächst geschätzte Vorauszahlungen und erhält nach der Steuererklärung eine Nachzahlung oder Erstattung, sobald die tatsächliche Steuerschuld feststeht. Der Mechanismus ist damit derselbe wie bei der Einkommensteuer selbst, nur um den jeweiligen Kirchensteuersatz ergänzt.",
      },
      {
        question: "Gilt die Kappung der Kirchensteuer für jeden automatisch?",
        answer:
          "Nein, sie muss in den meisten Bundesländern und Landeskirchen ausdrücklich beim zuständigen Kirchensteueramt beantragt werden und wird nicht automatisch von der Lohnabrechnung berücksichtigt. Die Kappung begrenzt die Kirchensteuer bei sehr hohen Einkommen auf einen Prozentsatz des zu versteuernden Einkommens – meist zwischen 2,75 und 4 Prozent, je nach Landeskirche – statt sie unbegrenzt an die Lohnsteuer zu koppeln. Sie wirkt sich erst bei überdurchschnittlich hohen Einkommen aus, weil die reguläre Kirchensteuer darunter meist niedriger ausfällt als der gedeckelte Satz. Der Antrag läuft über die Steuererklärung oder direkt über die zuständige Landeskirche.",
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
      "International liegt Deutschland mit seinen Lohnnebenkosten im oberen Mittelfeld der Industrieländer, allerdings nicht an der Spitze: Länder wie Frankreich oder Belgien weisen traditionell noch höhere Arbeitgeberanteile aus, während angelsächsische Länder wie die USA oder Großbritannien mit deutlich niedrigeren gesetzlichen Sozialabgaben arbeiten und dafür private Kranken- und Rentenvorsorge stärker in Eigenverantwortung liegt. Dieser Unterschied erklärt einen erheblichen Teil dessen, warum internationale Gehaltsvergleiche allein über den Bruttolohn in die Irre führen: Ein niedrigeres Arbeitgeberbrutto in einem Land mit geringen gesetzlichen Nebenkosten kann für den Arbeitnehmer am Ende ähnlich viel oder sogar mehr bedeuten als ein höheres Brutto in einem Land mit hoher gesetzlicher Umlage – nur verteilt sich die Belastung anders zwischen Arbeitgeber, Arbeitnehmer und Staat.",
    ],
    faq: [
      {
        question: "Sind die deutschen Lohnnebenkosten im internationalen Vergleich hoch?",
        answer:
          "Im oberen Mittelfeld, aber nicht an der Spitze. Länder wie Frankreich oder Belgien weisen traditionell noch höhere gesetzliche Arbeitgeberanteile aus, während in den USA oder Großbritannien die gesetzlichen Sozialabgaben niedriger liegen und dafür private Kranken- und Rentenvorsorge einen größeren Teil der Eigenverantwortung trägt. Ein reiner Bruttolohn-Vergleich zwischen Ländern führt deshalb in die Irre: Entscheidend ist, wie viel am Ende beim Arbeitnehmer ankommt und welche Absicherung im Gegenzug gesetzlich mitfinanziert ist, nicht die nominale Höhe des Arbeitgeberbruttos allein.",
      },
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
      {
        question: "Warum kalkulieren Arbeitgeber oft mit einem festen Faktor auf das Brutto?",
        answer:
          "Weil sich die Lohnnebenkosten je nach Gehaltshöhe und Beitragsbemessungsgrenzen leicht unterscheiden, in der Personalplanung aber eine schnelle Überschlagsrechnung gebraucht wird. Üblich ist deshalb ein Pauschalfaktor von 1,20 bis 1,25 auf das Bruttogehalt, der neben dem gesetzlichen Sozialversicherungsanteil auch Umlagen und die branchenabhängige Unfallversicherung grob mit abdeckt. Für ein einzelnes Gehalt ist dieser Faktor eine brauchbare Näherung; für eine genaue Kalkulation, etwa bei Budgetplanungen oder Ausschreibungen, lohnt sich die exakte Berechnung mit den tatsächlichen Beitragssätzen und der branchenspezifischen Unfallversicherungs-Gefahrklasse.",
      },
      {
        question: "Wie hoch ist die Unfallversicherung, die der Arbeitgeber allein zahlt?",
        answer:
          "Das hängt stark von der Gefahrklasse der Branche ab, die von der jeweiligen Berufsgenossenschaft festgelegt wird: Ein Bürojob in der Verwaltung kann mit deutlich unter einem Prozent des Bruttolohns veranschlagt sein, ein Beruf mit hohem Unfallrisiko wie im Baugewerbe oder in der Forstwirtschaft dagegen mit mehreren Prozent. Der Beitrag wird ausschließlich vom Arbeitgeber getragen und fließt nicht über die Lohnabrechnung, sondern direkt an die zuständige Berufsgenossenschaft. Weil die Gefahrklassen je Wirtschaftszweig einzeln festgelegt werden, lässt sich kein allgemeingültiger Prozentsatz für alle Branchen angeben – dieser Rechner bildet die Unfallversicherung deshalb bewusst nicht mit ab.",
      },
      {
        question: "Was sind U1 und U2, die manchmal in Arbeitgeberkosten auftauchen?",
        answer:
          "Zwei Umlagen, mit denen sich Arbeitgeber gegen die Kosten der Entgeltfortzahlung absichern: Die U1 erstattet einen Teil des fortgezahlten Lohns bei Krankheit der Beschäftigten, die U2 übernimmt die vollen Kosten bei Mutterschutz und Beschäftigungsverboten während der Schwangerschaft. Beide werden ausschließlich vom Arbeitgeber getragen und an die zuständige Krankenkasse gezahlt, der Satz variiert je nach Kasse und liegt üblicherweise bei jeweils ein bis zwei Prozent des Bruttolohns. An der U2 müssen sich alle Arbeitgeber beteiligen, an der U1 nur Betriebe mit in der Regel nicht mehr als 30 Beschäftigten.",
      },
    ],
  },
];
