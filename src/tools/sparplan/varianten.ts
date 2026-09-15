/**
 * Inhalte der SEO-Unterseiten des Sparplan-Rechners.
 *
 * Warum eigene Texte und nicht nur andere Startwerte: Varianten, die sich
 * inhaltlich nicht unterscheiden, sind aus Sicht einer AdSense-Prüfung „low
 * value content“ – und aus Sicht eines Besuchers auch. Jede Seite hier
 * beantwortet ihre eigene Frage von vorn. Der Rechner darunter ist derselbe,
 * nur anders voreingestellt.
 *
 * Alle Zahlenbeispiele sind mit genau diesen Voreinstellungen nachgerechnet,
 * damit ein Besucher das Gelesene auf dem Bildschirm wiederfindet.
 */

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  /* ----------------------------------------------------------------------- */

  {
    slug: "zinseszinsrechner",
    title: "Zinseszinsrechner: Kapital und Sparrate über die Jahre berechnen",
    description:
      "Zinseszins für Einmalanlage und monatliche Sparrate – mit Kosten, Steuern, Inflation und Verdopplungsdauer. Kostenlos und ohne Anmeldung.",
    heading: "Zinseszins berechnen",
    params: {
      start: 10000,
      rate: 0,
      jahre: 30,
      rendite: 7,
      kosten: 0,
      steuern: 0,
    },
    about: [
      "Der Zinseszins ist der Effekt, dass Erträge selbst wieder Erträge bringen. Zehntausend Euro zu sieben Prozent werden im ersten Jahr um siebenhundert Euro mehr, im zweiten Jahr aber schon um 749 Euro – weil die siebenhundert aus dem Vorjahr mitverdienen. Über dreißig Jahre werden aus den zehntausend Euro so 76.123 Euro, ohne dass ein einziger Euro nachgelegt wird. Von diesem Endbetrag stammen 66.123 Euro aus Erträgen und nur zehntausend aus der eigenen Einzahlung. Genau das ist der Grund, warum bei der Geldanlage die Zeit wichtiger ist als der Betrag.",
      "Die Formel dahinter ist kurz: Endkapital gleich Startkapital mal eins plus Zinssatz, hoch die Anzahl der Jahre. Was sie so schwer greifbar macht, ist ihr exponentieller Verlauf. Die ersten Jahre sehen enttäuschend aus, die letzten spektakulär: Im dreißigsten Jahr wächst dasselbe Kapital um 4.980 Euro, im ersten um siebenhundert. Wer einen Sparplan nach fünf Jahren abbricht, weil „nicht viel passiert“, steigt genau vor dem Teil aus, für den er die fünf Jahre gewartet hat.",
      "Für die Verdopplungsdauer kursiert die 72er-Regel: 72 geteilt durch den Zinssatz ergibt ungefähr die Jahre bis zur Verdopplung. Bei sieben Prozent sind das gut zehn Jahre, genau gerechnet 10,24. Der Rechner schätzt hier nicht, sondern nimmt den Logarithmus – und zieht die laufenden Kosten vorher ab, weil ein Fonds mit einem Prozent Gebühr eben nicht mit sieben, sondern mit sechs Prozent verdoppelt. Aus 10,24 Jahren werden dadurch 11,90.",
    ],
    faq: [
      {
        question: "Wie berechnet man den Zinseszins?",
        answer:
          "Endkapital = Startkapital × (1 + Zinssatz)^Jahre. Bei 10.000 Euro, 7 Prozent und 30 Jahren also 10.000 × 1,07^30 = 76.123 Euro. Dieser Rechner arbeitet monatlich, kommt aber auf denselben Wert, weil er den Monatszins als zwölfte Wurzel bildet und nicht als Zwölftel – sonst wären es 7,229 statt 7 Prozent im Jahr und rund 5.000 Euro zu viel. Kommt eine monatliche Sparrate dazu, wird aus der Formel eine Rentenformel, weil jede Rate unterschiedlich lange mitverzinst wird.",
      },
      {
        question: "Was ist der Unterschied zwischen Zins und Zinseszins?",
        answer:
          "Beim einfachen Zins wird der Ertrag jedes Jahr ausgezahlt und arbeitet nicht weiter: 10.000 Euro zu 7 Prozent bringen dreißig Jahre lang je 700 Euro, macht 21.000 Euro Ertrag. Beim Zinseszins bleibt der Ertrag im Depot und verzinst sich mit: derselbe Zeitraum bringt 66.123 Euro. Der Unterschied von mehr als dem Dreifachen entsteht allein dadurch, dass nichts entnommen wird.",
      },
      {
        question: "Wie wirkt sich die Inflation auf den Zinseszins aus?",
        answer:
          "Sie frisst ihn von der anderen Seite an. Bei 2 Prozent Inflation haben 76.123 Euro in dreißig Jahren die Kaufkraft von heute 42.025 Euro. Entscheidend ist deshalb nicht der Zinssatz, sondern der Abstand zwischen Rendite und Inflation – die Realrendite. Bei 7 Prozent Rendite und 2 Prozent Inflation sind das etwa 5 Prozent. Der Rechner weist das Endkapital deshalb immer auch in heutiger Kaufkraft aus.",
      },
    ],
  },


  /* ----------------------------------------------------------------------- */

  {
    slug: "sparrate-berechnen",
    title: "Sparrate berechnen: Wie viel muss ich monatlich sparen?",
    description:
      "Sparziel eingeben, nötige Monatsrate erhalten – mit Startkapital, Rendite, Laufzeit, Kosten und Steuern. Für Auto, Eigenkapital oder Rücklage.",
    heading: "Sparrate berechnen",
    params: {
      modus: "sparrate",
      start: 0,
      ziel: 100000,
      jahre: 20,
      rendite: 6,
    },
    about: [
      "Der Zielmodus dreht die übliche Rechnung um: Statt zu fragen, was aus einer Rate wird, gibst du den Betrag vor, der am Ende dastehen soll – der Rechner sucht die passende Monatsrate. Für 100.000 Euro nach Steuern in zwanzig Jahren bei sechs Prozent Rendite sind das 238 Euro im Monat. Eingezahlt werden dabei 57.019 Euro, der Rest entsteht durch Erträge. Vorhandenes Startkapital wird angerechnet und senkt die nötige Rate entsprechend.",
      "Gesucht wird die Rate nicht über eine umgestellte Formel, sondern durch schrittweise Annäherung. Der Grund sind die Steuern: Sparerpauschbetrag und Teilfreistellung machen den Zusammenhang zwischen Rate und Endkapital abschnittsweise linear, aber eben nicht durchgehend – eine geschlossene Formel gäbe es nur für den steuerfreien Fall. Die Annäherung liefert dafür ein Ergebnis, das auch mit Steuern auf den Euro genau passt.",
      "Wichtig ist die Wahl der Rendite, und die hängt am Zeitraum. Für ein Ziel in zwei bis drei Jahren – Auto, Kaution, Urlaub – gehört das Geld auf Tagesgeld, und die realistische Annahme sind zwei bis drei Prozent ohne Kursrisiko. Für ein Ziel in fünfzehn oder zwanzig Jahren ist ein breiter Aktien-ETF sinnvoll, mit fünf bis sieben Prozent Erwartung und der ausdrücklichen Möglichkeit, zwischendurch dreißig Prozent im Minus zu stehen. Wer für ein kurzfristiges Ziel mit sieben Prozent plant, plant sich in ein Risiko hinein, das er zu diesem Termin nicht aussitzen kann.",
    ],
    faq: [
      {
        question: "Wie viel muss ich monatlich sparen für 100.000 Euro?",
        answer:
          "Das hängt vor allem an der Laufzeit. Bei 6 Prozent Rendite und ohne Startkapital sind es über 10 Jahre 638 Euro im Monat, über 20 Jahre 238 Euro und über 30 Jahre 114 Euro. Die Rate halbiert sich also nicht, wenn sich die Zeit verdoppelt – sie fällt deutlich stärker, weil der Zinseszins den größeren Teil übernimmt.",
      },
      {
        question: "Wird vorhandenes Startkapital berücksichtigt?",
        answer:
          "Ja, und es wirkt stärker, als man denkt. 10.000 Euro Startkapital senken bei 20 Jahren und 6 Prozent die nötige Rate für 100.000 Euro von 238 auf 170 Euro – die 10.000 Euro ersetzen also über die Laufzeit gut 16.000 Euro an Einzahlungen. Der Grund ist, dass das Startkapital die volle Laufzeit mitarbeitet, während eine Rate im Schnitt nur die halbe Zeit hat.",
      },
      {
        question: "Was, wenn ich die errechnete Rate nicht aufbringen kann?",
        answer:
          "Dann sind drei Stellschrauben da, und die Laufzeit ist die wirksamste. Fünf Jahre mehr senken die Rate stärker als jede realistische Renditeverbesserung. Die zweite ist das Ziel selbst – oft ist die runde Zahl nur geschätzt und der tatsächliche Bedarf niedriger. Die dritte ist die Dynamik: Wer heute nicht die volle Rate aufbringt, kann mit einer jährlichen Erhöhung starten, die zum erwarteten Einkommensverlauf passt.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "vorabpauschale-berechnen",
    title: "Vorabpauschale berechnen 2026: Rechner mit Basiszins 3,20 Prozent",
    description:
      "Vorabpauschale für thesaurierende ETFs berechnen – mit Basiszins 2026, Teilfreistellung und Sparerpauschbetrag. Was die Bank im Januar einzieht.",
    heading: "Vorabpauschale berechnen",
    params: { start: 100000, rate: 0, jahre: 10, rendite: 7, steuern: 1 },
    about: [
      "Die Vorabpauschale ist die Steuer auf einen Gewinn, den es noch gar nicht in bar gibt. Seit der Investmentsteuerreform 2018 will der Staat auch bei thesaurierenden Fonds nicht bis zum Verkauf warten, sondern jedes Jahr einen Mindestertrag besteuern. Berechnet wird sie so: Fondswert am 2. Januar mal Basiszins mal 0,7. Der Basiszins für 2026 beträgt 3,20 Prozent, macht also 2,24 Prozent des Depotwerts als Basisertrag. Gedeckelt ist das Ganze auf die tatsächliche Wertsteigerung des Jahres – wer Verlust macht, zahlt keine Vorabpauschale.",
      "Ein Beispiel mit 100.000 Euro im Depot: Der Basisertrag beträgt 2.240 Euro. Bei einem Aktien-ETF bleiben davon 30 Prozent über die Teilfreistellung steuerfrei, es verbleiben 1.568 Euro. Davon geht der Sparerpauschbetrag von 1.000 Euro ab, steuerpflichtig sind also 568 Euro. Darauf 26,375 Prozent Abgeltungsteuer und Soli ergeben 149,81 Euro, die im Januar vom Verrechnungskonto eingezogen werden. Das ist wenig – aber es muss dort liegen, sonst verkauft die Bank Anteile.",
      "Doppelt besteuert wird nichts. Alle über die Jahre gezahlten Vorabpauschalen werden beim späteren Verkauf vom steuerpflichtigen Gewinn abgezogen, sodass am Ende genau einmal Steuer auf denselben Ertrag anfällt. Wirtschaftlich ist die Vorabpauschale deshalb keine zusätzliche Steuer, sondern eine Vorverlegung: Geld, das sonst weiter im Depot mitgearbeitet hätte, wird früher abgeführt. Der Rechner zieht sie jedes Jahr ab und rechnet sie am Ende wieder an, damit dieser Effekt im Ergebnis sichtbar wird.",
    ],
    faq: [
      {
        question: "Wie hoch ist die Vorabpauschale 2026?",
        answer:
          "Der Basiszins zum 2. Januar 2026 beträgt 3,20 Prozent, festgelegt im BMF-Schreiben vom 13. Januar 2026. Da nur 70 Prozent davon angesetzt werden, ergibt sich ein Basisertrag von 2,24 Prozent des Fondswerts zum Jahresanfang. Bei einem Aktienfonds mit 30 Prozent Teilfreistellung bleiben davon 1,568 Prozent steuerpflichtig – bis zum Sparerpauschbetrag von 1.000 Euro fällt aber gar nichts an.",
      },
      {
        question: "Ab welchem Depotwert muss ich Vorabpauschale zahlen?",
        answer:
          "Bei einem Aktien-ETF und vollem Sparerpauschbetrag ab etwa 64.000 Euro Depotwert: 64.000 × 2,24 Prozent × 70 Prozent ergibt rund 1.003 Euro und übersteigt damit knapp die 1.000 Euro Freibetrag. Bei Zinsanlagen ohne Teilfreistellung ist die Grenze niedriger, bei rund 45.000 Euro. Voraussetzung ist jeweils, dass keine anderen Kapitalerträge den Freibetrag schon verbrauchen.",
      },
      {
        question:
          "Was passiert, wenn kein Geld auf dem Verrechnungskonto liegt?",
        answer:
          "Die Bank ist gesetzlich verpflichtet, die Steuer abzuführen. Reicht das Guthaben nicht, verkauft sie im Zweifel Fondsanteile oder bucht das Konto ins Minus – beides ist unangenehm, weil ein erzwungener Verkauf zu einem beliebigen Kurs stattfindet und zusätzlich einen steuerpflichtigen Gewinn auslöst. Es genügt, Anfang Januar einen kleinen Betrag auf dem Verrechnungskonto zu lassen; die Größenordnung nennt der Rechner in den Hinweisen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "abgeltungssteuer-berechnen",
    title: "Abgeltungssteuer berechnen: 25 Prozent, Soli und Kirchensteuer",
    description:
      "Abgeltungsteuer auf Kapitalerträge berechnen – mit Sparerpauschbetrag, Teilfreistellung und der korrekten Kirchensteuerformel nach § 32d EStG.",
    heading: "Abgeltungssteuer berechnen",
    params: { start: 50000, rate: 0, jahre: 15, rendite: 7, steuern: 1 },
    about: [
      "Auf Kapitalerträge fallen 25 Prozent Abgeltungsteuer an, dazu 5,5 Prozent Solidaritätszuschlag auf diese Steuer – zusammen 26,375 Prozent. Der Soli wurde für die Einkommensteuer weitgehend abgeschafft, für Kapitalerträge gilt er unverändert weiter. Vor der Steuer steht der Sparerpauschbetrag von 1.000 Euro im Jahr, bei zusammen veranlagten Ehepaaren 2.000 Euro. Wer der Bank einen Freistellungsauftrag erteilt, bekommt diesen Betrag automatisch angerechnet; ohne Auftrag wird zunächst voll besteuert und erst über die Steuererklärung zurückgeholt.",
      "Bei der Kirchensteuer rechnen die meisten falsch, und zwar zu hoch. Sie kommt nicht einfach oben drauf, denn sie ist als Sonderausgabe abziehbar – § 32d Abs. 1 Satz 4 EStG erledigt das über eine eigene Formel, nach der die Kapitalertragsteuer nicht ein Viertel des Ertrags beträgt, sondern e geteilt durch 4 plus Kirchensteuersatz. Mit neun Prozent Kirchensteuer sinkt der Steuersatz dadurch von 25 auf 24,45 Prozent, und die Gesamtbelastung liegt bei 27,996 statt bei 26,375 Prozent. Der Aufschlag beträgt also rund 1,6 Prozentpunkte, nicht neun.",
      "Bei Fonds kommt die Teilfreistellung dazu, und sie ändert das Bild deutlich. Bei Aktienfonds mit mindestens 51 Prozent Aktienanteil bleiben 30 Prozent des Ertrags steuerfrei, bei Mischfonds 15 Prozent, bei Immobilienfonds 60 Prozent. Aus den 26,375 Prozent werden bei einem Aktien-ETF damit effektiv rund 18,5 Prozent auf den Gewinn. Bei Zinsanlagen wie Tages- oder Festgeld gibt es keine Teilfreistellung – dort bleibt es beim vollen Satz.",
    ],
    faq: [
      {
        question: "Wie hoch ist die Abgeltungssteuer wirklich?",
        answer:
          "Ohne Kirchensteuer 26,375 Prozent, mit 8 Prozent Kirchensteuer 27,82 Prozent und mit 9 Prozent 27,996 Prozent. Bei einem Aktienfonds sinkt die effektive Belastung durch die 30-prozentige Teilfreistellung auf rund 18,5 Prozent des Gewinns. Und die ersten 1.000 Euro Kapitalertrag im Jahr bleiben durch den Sparerpauschbetrag ohnehin steuerfrei.",
      },
      {
        question: "Wann lohnt sich die Günstigerprüfung?",
        answer:
          "Wenn der persönliche Grenzsteuersatz unter 25 Prozent liegt, was bei einem zu versteuernden Einkommen bis rund 20.000 Euro der Fall ist. Dann kann in der Steuererklärung die Günstigerprüfung nach § 32d Abs. 6 EStG beantragt werden: Das Finanzamt rechnet die Kapitalerträge zum normalen Einkommen und wendet den niedrigeren Tarifsatz an. Das lohnt sich vor allem für Studierende, Rentner mit kleiner Rente und in Jahren ohne volles Erwerbseinkommen.",
      },
      {
        question: "Muss ich Kapitalerträge in der Steuererklärung angeben?",
        answer:
          "In der Regel nicht: Die deutsche Bank führt die Steuer direkt ab, damit ist sie abgegolten – daher der Name. Angeben muss man sie unter anderem bei Depots im Ausland, wenn der Sparerpauschbetrag über mehrere Banken hinweg nicht optimal verteilt wurde, wenn Verluste aus einem anderen Depot verrechnet werden sollen oder wenn die Günstigerprüfung beantragt wird. Auch die Kirchensteuer lässt sich über die Erklärung nachträglich korrigieren.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "entnahmeplan-rechner",
    title: "Entnahmeplan-Rechner: Wie lange reicht mein Kapital?",
    description:
      "Monatliche Entnahme aus einem Vermögen berechnen – befristet oder dauerhaft aus den Erträgen. Mit Rendite, Laufzeit und Kaufkraftverlust.",
    heading: "Entnahmeplan berechnen",
    params: {
      start: 500000,
      rate: 0,
      jahre: 1,
      rendite: 5,
      entnahme: 30,
      steuern: 0,
      kosten: 0,
    },
    about: [
      "Ein Entnahmeplan ist mathematisch ein Kredit mit vertauschten Rollen: Statt eine Schuld mit Raten abzutragen, wird ein Kapital mit Entnahmen abgebaut, und beide Male verzinst sich der Rest weiter. Deshalb steckt hinter der Entnahme dieselbe Annuitätenformel wie hinter der Kreditrate. Aus 500.000 Euro lassen sich bei fünf Prozent Rendite dreißig Jahre lang 2.650 Euro im Monat entnehmen – am Ende ist das Kapital genau aufgebraucht.",
      "Wer die Substanz nicht antasten will, entnimmt nur die Erträge. Bei denselben 500.000 Euro und fünf Prozent sind das 2.037 Euro im Monat, dafür ohne zeitliche Begrenzung und mit dem vollen Kapital für die Erben. Die Differenz von gut 600 Euro im Monat ist der Preis dafür, dass am Ende noch etwas übrig bleibt. Bekannt ist diese Größenordnung als Vier-Prozent-Regel, die aus historischen US-Daten stammt und für dreißig Jahre Entnahme kalkuliert war – sie ist eine Faustregel und keine Garantie.",
      "Der Rechner lässt das Kapital vor der Entnahme noch ein Jahr laufen, weil die Ansparphase mindestens ein Jahr umfasst: Aus 500.000 Euro werden dadurch 525.000, und die Entnahme steigt entsprechend auf 2.783 beziehungsweise 2.139 Euro. Wer die reine Entnahme ohne dieses Jahr rechnen will, trägt einfach den Betrag ein, der nach Abzug eines Jahres Verzinsung übrig bleibt.",
      "Zwei Dinge fehlen in jeder einfachen Entnahmerechnung und gehören mitgedacht. Erstens die Inflation: 2.783 Euro im Monat haben in zwanzig Jahren bei zwei Prozent noch die Kaufkraft von heute 1.873 Euro. Wer die Kaufkraft halten will, muss die Entnahme jährlich erhöhen und kommt damit anfangs auf einen deutlich niedrigeren Betrag. Zweitens das Reihenfolgerisiko: Ein Börsencrash in den ersten Entnahmejahren wirkt viel stärker als derselbe Crash zwanzig Jahre später, weil in der schlechten Phase Anteile verkauft werden müssen. Ein Puffer aus Tagesgeld für zwei bis drei Jahre Entnahme entschärft genau das.",
    ],
    faq: [
      {
        question: "Wie viel kann ich monatlich aus 500.000 Euro entnehmen?",
        answer:
          "Bei 5 Prozent Rendite sind es 2.650 Euro im Monat, wenn das Kapital über 30 Jahre aufgebraucht werden soll, und 2.037 Euro, wenn nur die Erträge entnommen werden und das Kapital erhalten bleibt. Bei 4 Prozent sind es 2.367 beziehungsweise 1.637 Euro, bei 3 Prozent 2.097 und 1.233 Euro. Zu beachten ist, dass auf die entnommenen Gewinnanteile noch Abgeltungsteuer anfällt – der Nettobetrag liegt also darunter.",
      },
      {
        question: "Was ist die 4-Prozent-Regel?",
        answer:
          "Eine Faustregel aus einer US-Studie der 1990er Jahre: Wer im ersten Ruhestandsjahr 4 Prozent des Vermögens entnimmt und diesen Betrag danach nur an die Inflation anpasst, kam in den untersuchten historischen Zeiträumen 30 Jahre lang aus. Übertragen auf 500.000 Euro wären das 20.000 Euro im Jahr oder rund 1.667 Euro im Monat. Die Regel unterstellt einen hohen Aktienanteil, US-Renditen und keine Steuern – für deutsche Verhältnisse ist sie eher eine Obergrenze als eine Empfehlung.",
      },
      {
        question: "Wird die Steuer bei der Entnahme berücksichtigt?",
        answer:
          "Der Entnahmebetrag im Rechner ist ein Bruttobetrag. Bei einem Verkauf von Fondsanteilen ist immer nur der enthaltene Gewinnanteil steuerpflichtig, nicht die gesamte Entnahme – wie hoch dieser Anteil ist, hängt davon ab, wie stark das Depot gewachsen ist. Als Näherung: Bei einem Depot, das sich verdoppelt hat, ist etwa die Hälfte jeder Entnahme Gewinn, und darauf fallen bei einem Aktien-ETF rund 18,5 Prozent an. Der Sparerpauschbetrag von 1.000 Euro im Jahr gilt auch in der Entnahmephase.",
      },
    ],
  },
];
