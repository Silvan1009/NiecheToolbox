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
    title: "Zinseszinsrechner: Kapital und Sparrate über die Jahre",
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
      "Albert Einstein soll den Zinseszins einmal als achtes Weltwunder bezeichnet haben – belegt ist das Zitat nicht, aber die Beobachtung dahinter stimmt: Der Effekt wirkt in beide Richtungen gleich stark, nur meistens unbemerkt. Wer statt zu sparen einen Kredit zu sieben Prozent über dreißig Jahre nicht bedient, sieht genau dieselbe Kurve – nur als wachsende Schuld statt als wachsendes Vermögen. Aus zehntausend Euro Schulden würden auf dieselbe Weise 76.123 Euro, wenn nie etwas zurückgezahlt wird. Das ist der Grund, warum ein Dispokredit mit zehn oder elf Prozent so gefährlich ist: Derselbe Mechanismus, der ein Vermögen über Jahrzehnte wachsen lässt, lässt eine unbediente Schuld genauso wachsen – nur meist über einen viel kürzeren, dafür schmerzhafteren Zeitraum.",
    ],
    faq: [
      {
        question:
          "Stimmt es, dass Einstein den Zinseszins als Weltwunder bezeichnet hat?",
        answer:
          "Das Zitat ist populär, aber nicht zweifelsfrei belegt – es findet sich in keiner autorisierten Quelle aus Einsteins eigener Feder. Unabhängig von der Urheberschaft beschreibt es den Effekt zutreffend: Weil Erträge selbst wieder Erträge bringen, wächst ein Kapital nicht linear, sondern exponentiell. Der Effekt ist mathematisch nichts Besonderes, wirkt aber gegen die menschliche Intuition, die eher in linearen Schritten denkt – genau deshalb wird ein zehn oder zwanzig Jahre laufender Sparplan im ersten Drittel oft unterschätzt und im letzten Drittel überrascht.",
      },
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
      {
        question: "Wer hat die Zinseszinsformel entwickelt?",
        answer:
          "Die mathematischen Grundlagen reichen bis ins Babylon des 2. Jahrtausends vor Christus zurück, wo bereits Tontafeln mit Zinsberechnungen für Kredite gefunden wurden. In der heute gebräuchlichen Form geht die Formel auf die Entwicklung der Finanzmathematik im Italien der Renaissance zurück, unter anderem durch den Mathematiker Luca Pacioli, der Ende des 15. Jahrhunderts als Erster systematisch über Zins und Zinseszins schrieb. Der Kern der Formel – Startkapital mal Zinsfaktor hoch Anzahl der Perioden – ist seither unverändert geblieben; verändert hat sich nur, wie leicht sie sich heute mit einem Taschenrechner oder eben einem Online-Rechner auswerten lässt.",
      },
      {
        question:
          "Gibt es eine einfache Faustregel für den Zinseszinseffekt ohne Rechner?",
        answer:
          "Ja, die bereits erwähnte 72er-Regel: 72 geteilt durch den Zinssatz ergibt näherungsweise die Jahre bis zur Verdopplung. Für die Verdreifachung eines Kapitals gibt es eine ähnliche, weniger bekannte Regel mit dem Faktor 114, für die Verzehnfachung mit dem Faktor 240. Diese Faustregeln sind für Zinssätze zwischen etwa 2 und 15 Prozent erstaunlich genau und eignen sich gut für eine schnelle Kopfrechnung, ersetzen für eine belastbare Planung mit Sparraten, Kosten und Steuern aber keinen echten Rechner.",
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
      "Ein Nebeneffekt des Zielmodus lohnt einen eigenen Blick: die Empfindlichkeit gegenüber der Renditeannahme. Bei 100.000 Euro Ziel in zwanzig Jahren sinkt die nötige Rate von 238 Euro bei sechs Prozent auf 197 Euro bei sieben Prozent – ein einziger Prozentpunkt mehr Rendite spart über die Laufzeit gut 41 Euro Sparrate im Monat, also fast zehntausend Euro Einzahlung insgesamt. Diese Empfindlichkeit ist der eigentliche Grund, weshalb Fondskosten in der Zielrechnung nicht vernachlässigt werden dürfen: Ein Prozentpunkt Gebühr wirkt hier genauso stark wie ein Prozentpunkt weniger Marktrendite, nur dass die Gebühr sicher anfällt und die Rendite nicht.",
    ],
    faq: [
      {
        question:
          "Wie stark verändert ein Prozentpunkt mehr Rendite die nötige Sparrate?",
        answer:
          "Deutlich mehr, als die kleine Zahl vermuten lässt. Für 100.000 Euro in zwanzig Jahren sinkt die Rate von 238 Euro bei 6 Prozent auf 197 Euro bei 7 Prozent – ein Rückgang von rund 17 Prozent für einen einzigen zusätzlichen Prozentpunkt. Der Effekt wächst mit der Laufzeit: Bei dreißig Jahren macht derselbe eine Prozentpunkt einen noch größeren relativen Unterschied. Das ist zugleich eine Warnung: Wer die nötige Rate mit einer zu optimistischen Renditeannahme berechnet, spart am Ende zu wenig für das gesteckte Ziel.",
      },
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
      {
        question:
          "Was passiert, wenn ich mehr einzahle als die errechnete Rate?",
        answer:
          "Das Ziel wird entweder früher erreicht oder am Ende steht mehr Kapital als geplant – beides ist unproblematisch, weil die Rate im Zielmodus nur die Mindestrate für das eingegebene Ziel und die eingegebene Laufzeit ist, keine Obergrenze. Wer regelmäßig mehr einzahlen kann, etwa durch eine Gehaltserhöhung, profitiert überproportional stark, wenn die zusätzlichen Beträge früh in der Laufzeit eingezahlt werden statt erst gegen Ende, weil sie dann länger vom Zinseszins profitieren. Am einfachsten lässt sich das im Rechner selbst durchspielen, indem eine höhere Rate direkt im Modus „Endkapital“ statt „Sparrate“ eingegeben wird.",
      },
      {
        question:
          "Sollte das Sparziel in heutigen Euro oder in künftiger Kaufkraft angegeben werden?",
        answer:
          "Das hängt davon ab, was tatsächlich gemeint ist. Wird ein Betrag angestrebt, der in zwanzig Jahren dieselbe Kaufkraft hat wie 100.000 Euro heute, muss das Ziel um die erwartete Inflation nach oben angepasst werden, bevor es in den Rechner eingetragen wird – bei 2 Prozent Inflation über zwanzig Jahre wären das rund 149.000 Euro nominal. Wird dagegen ein fester nominaler Betrag angestrebt, etwa weil ein konkreter Kaufpreis feststeht, genügt die direkte Eingabe. Der Rechner selbst weist unabhängig davon zusätzlich aus, was das Endkapital in heutiger Kaufkraft wert wäre, damit der Unterschied sichtbar bleibt.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "vorabpauschale-berechnen",
    title: "Vorabpauschale 2026 berechnen: Rechner mit Basiszins 3,20 %",
    description:
      "Vorabpauschale für thesaurierende ETFs berechnen – mit Basiszins 2026, Teilfreistellung und Sparerpauschbetrag. Was die Bank im Januar einzieht.",
    heading: "Vorabpauschale berechnen",
    params: { start: 100000, rate: 0, jahre: 10, rendite: 7, steuern: 1 },
    about: [
      "Die Vorabpauschale ist die Steuer auf einen Gewinn, den es noch gar nicht in bar gibt. Seit der Investmentsteuerreform 2018 will der Staat auch bei thesaurierenden Fonds nicht bis zum Verkauf warten, sondern jedes Jahr einen Mindestertrag besteuern. Berechnet wird sie so: Fondswert am 2. Januar mal Basiszins mal 0,7. Der Basiszins für 2026 beträgt 3,20 Prozent, macht also 2,24 Prozent des Depotwerts als Basisertrag. Gedeckelt ist das Ganze auf die tatsächliche Wertsteigerung des Jahres – wer Verlust macht, zahlt keine Vorabpauschale.",
      "Ein Beispiel mit 100.000 Euro im Depot: Der Basisertrag beträgt 2.240 Euro. Bei einem Aktien-ETF bleiben davon 30 Prozent über die Teilfreistellung steuerfrei, es verbleiben 1.568 Euro. Davon geht der Sparerpauschbetrag von 1.000 Euro ab, steuerpflichtig sind also 568 Euro. Darauf 26,375 Prozent Abgeltungsteuer und Soli ergeben 149,81 Euro, die im Januar vom Verrechnungskonto eingezogen werden. Das ist wenig – aber es muss dort liegen, sonst verkauft die Bank Anteile.",
      "Doppelt besteuert wird nichts. Alle über die Jahre gezahlten Vorabpauschalen werden beim späteren Verkauf vom steuerpflichtigen Gewinn abgezogen, sodass am Ende genau einmal Steuer auf denselben Ertrag anfällt. Wirtschaftlich ist die Vorabpauschale deshalb keine zusätzliche Steuer, sondern eine Vorverlegung: Geld, das sonst weiter im Depot mitgearbeitet hätte, wird früher abgeführt. Der Rechner zieht sie jedes Jahr ab und rechnet sie am Ende wieder an, damit dieser Effekt im Ergebnis sichtbar wird.",
      "Der Basiszins selbst ist keine feste Größe, sondern wird jährlich neu vom Bundesfinanzministerium aus der Zinsstrukturkurve der Deutschen Bundesbank abgeleitet und jeweils zu Jahresbeginn per Schreiben veröffentlicht. In Jahren mit sehr niedrigem Zinsniveau kann er sogar bei null oder knapp darüber liegen – dann entfällt die Vorabpauschale faktisch, weil der Basisertrag gegen null geht. Steigt das allgemeine Zinsniveau, wie zuletzt seit 2022 geschehen, steigt auch der Basiszins und damit die Vorabpauschale spürbar mit, selbst wenn sich am eigentlichen Depotwert oder der gewählten Anlagestrategie nichts geändert hat. Wer die Steuer für das kommende Jahr grob abschätzen will, sollte deshalb nicht mit dem Vorjahreswert rechnen, sondern das aktuelle BMF-Schreiben zum Basiszins prüfen.",
    ],
    faq: [
      {
        question: "Woher kommt der Basiszins für die Vorabpauschale?",
        answer:
          "Er wird jährlich vom Bundesfinanzministerium aus der Zinsstrukturkurve der Deutschen Bundesbank abgeleitet, die die Rendite öffentlicher Anleihen über verschiedene Laufzeiten abbildet, und jeweils zu Jahresbeginn in einem BMF-Schreiben veröffentlicht. Der Basiszins folgt damit mit Verzögerung dem allgemeinen Zinsniveau: Bei sehr niedrigen Zinsen kann er nahe null liegen und die Vorabpauschale faktisch entfallen, bei steigendem Zinsniveau zieht er entsprechend an. Für die eigene Steuerplanung ist deshalb der aktuelle, jährlich neu veröffentlichte Wert maßgeblich, nicht der des Vorjahres.",
      },
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
      {
        question: "Gilt die Vorabpauschale auch für ausschüttende Fonds?",
        answer:
          "Ja, aber ihre praktische Wirkung ist dort meist geringer. Bei einem ausschüttenden Fonds wird die tatsächliche Ausschüttung zunächst normal besteuert; die Vorabpauschale fällt zusätzlich nur an, wenn der Basisertrag die bereits erhaltene Ausschüttung übersteigt – bei den meisten ausschüttenden Aktienfonds ist das selten der Fall, weil die Ausschüttung den Basisertrag in der Regel bereits abdeckt oder übersteigt. Bei thesaurierenden Fonds gibt es dagegen keine Ausschüttung, gegen die der Basisertrag verrechnet werden könnte, weshalb dort die Vorabpauschale die einzige laufende Besteuerung während der Haltedauer ist.",
      },
      {
        question: "Wann genau wird die Vorabpauschale vom Konto abgebucht?",
        answer:
          "In der Regel am ersten Bankarbeitstag des neuen Jahres, weil sich der Basisertrag auf den Fondswert zum 2. Januar bezieht und die Bank die Steuer unmittelbar danach berechnen und einziehen muss. Wurde ein Fondsanteil erst im Laufe des Vorjahres gekauft, wird die Vorabpauschale zeitanteilig gekürzt – für einen im Oktober gekauften Anteil fällt nur ein Zwölftel der vollen Jahrespauschale an, nicht der volle Betrag. Bei einem Verkauf während des Jahres entfällt die Vorabpauschale für dieses Jahr komplett, weil dann stattdessen die reguläre Verkaufssteuer auf den tatsächlich realisierten Gewinn anfällt.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "abgeltungssteuer-berechnen",
    title: "Abgeltungssteuer berechnen: mit Soli und Kirchensteuer",
    description:
      "Abgeltungsteuer auf Kapitalerträge berechnen – mit Sparerpauschbetrag, Teilfreistellung und der korrekten Kirchensteuerformel nach § 32d EStG.",
    heading: "Abgeltungssteuer berechnen",
    params: { start: 50000, rate: 0, jahre: 15, rendite: 7, steuern: 1 },
    about: [
      "Auf Kapitalerträge fallen 25 Prozent Abgeltungsteuer an, dazu 5,5 Prozent Solidaritätszuschlag auf diese Steuer – zusammen 26,375 Prozent. Der Soli wurde für die Einkommensteuer weitgehend abgeschafft, für Kapitalerträge gilt er unverändert weiter. Vor der Steuer steht der Sparerpauschbetrag von 1.000 Euro im Jahr, bei zusammen veranlagten Ehepaaren 2.000 Euro. Wer der Bank einen Freistellungsauftrag erteilt, bekommt diesen Betrag automatisch angerechnet; ohne Auftrag wird zunächst voll besteuert und erst über die Steuererklärung zurückgeholt.",
      "Bei der Kirchensteuer rechnen die meisten falsch, und zwar zu hoch. Sie kommt nicht einfach oben drauf, denn sie ist als Sonderausgabe abziehbar – § 32d Abs. 1 Satz 4 EStG erledigt das über eine eigene Formel, nach der die Kapitalertragsteuer nicht ein Viertel des Ertrags beträgt, sondern e geteilt durch 4 plus Kirchensteuersatz. Mit neun Prozent Kirchensteuer sinkt der Steuersatz dadurch von 25 auf 24,45 Prozent, und die Gesamtbelastung liegt bei 27,996 statt bei 26,375 Prozent. Der Aufschlag beträgt also rund 1,6 Prozentpunkte, nicht neun.",
      "Bei Fonds kommt die Teilfreistellung dazu, und sie ändert das Bild deutlich. Bei Aktienfonds mit mindestens 51 Prozent Aktienanteil bleiben 30 Prozent des Ertrags steuerfrei, bei Mischfonds 15 Prozent, bei Immobilienfonds 60 Prozent. Aus den 26,375 Prozent werden bei einem Aktien-ETF damit effektiv rund 18,5 Prozent auf den Gewinn. Bei Zinsanlagen wie Tages- oder Festgeld gibt es keine Teilfreistellung – dort bleibt es beim vollen Satz.",
      "Verluste lassen sich mit der Abgeltungsteuer verrechnen, allerdings mit einer wichtigen Einschränkung seit 2021: Verluste aus Termingeschäften wie Optionen und Futures dürfen nur noch bis zu 20.000 Euro im Jahr mit Gewinnen aus Kapitalanlagen verrechnet werden, nicht verrechenbare Beträge werden auf Folgejahre vorgetragen. Für gewöhnliche Aktien- und Fondsverluste gilt diese Deckelung nicht – sie werden unbegrenzt mit Gewinnen derselben Kategorie verrechnet, entweder automatisch im laufenden Jahr bei derselben Bank über den sogenannten Verlustverrechnungstopf, oder über die Steuererklärung, wenn die Gewinne bei einer anderen Bank angefallen sind. Wer Depots bei mehreren Banken führt, muss dafür bis Jahresende eine Verlustbescheinigung bei der Bank mit den Verlusten beantragen, sonst verpufft die Verrechnung für dieses Jahr.",
    ],
    faq: [
      {
        question: "Wie werden Verluste mit der Abgeltungsteuer verrechnet?",
        answer:
          "Automatisch, solange Gewinn und Verlust bei derselben Bank anfallen – die Bank führt dafür einen laufenden Verlustverrechnungstopf und zieht die Steuer nur auf den Saldo ein. Liegen Depots bei mehreren Banken, muss bis zum 15. Dezember eine Verlustbescheinigung bei der Bank mit den Verlusten beantragt und die Verrechnung über die Steuererklärung nachgeholt werden. Eine Sonderregel gilt seit 2021 für Verluste aus Termingeschäften wie Optionen: Sie sind nur bis 20.000 Euro im Jahr verrechenbar, der Rest wird auf Folgejahre vorgetragen. Gewöhnliche Aktien- und Fondsverluste unterliegen dieser Deckelung nicht.",
      },
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
      {
        question:
          "Was ist der Sparerpauschbetrag genau, und wie beantrage ich ihn?",
        answer:
          "Ein jährlicher Steuerfreibetrag auf Kapitalerträge von 1.000 Euro für Alleinstehende und 2.000 Euro für zusammen veranlagte Ehepaare, seit 2023 in dieser Höhe gültig. Damit er automatisch bei der Steuerberechnung berücksichtigt wird, muss bei jeder depotführenden Bank ein Freistellungsauftrag eingerichtet werden – das geht meist unkompliziert online im Kundenportal der Bank. Ohne Freistellungsauftrag zieht die Bank die Steuer zunächst auf den vollen Ertrag ein, und der Freibetrag lässt sich erst über die Steuererklärung nachträglich geltend machen. Bei mehreren Banken kann der Gesamtbetrag beliebig aufgeteilt werden, solange die Summe die persönliche Höchstgrenze nicht überschreitet.",
      },
      {
        question: "Wie hoch war die Abgeltungsteuer vor ihrer Einführung 2009?",
        answer:
          "Vor 2009 wurden Kapitalerträge mit dem individuellen, oft deutlich höheren persönlichen Einkommensteuersatz besteuert, während Kursgewinne aus Aktien nach einer Haltedauer von mehr als einem Jahr komplett steuerfrei blieben – die sogenannte Spekulationsfrist. Die Abgeltungsteuer hat dieses System 2009 grundlegend verändert: Seither gilt ein einheitlicher Steuersatz unabhängig vom persönlichen Einkommen und unabhängig von der Haltedauer, dafür entfiel die vorherige Steuerfreiheit langfristig gehaltener Aktien vollständig. Für sehr lange Haltedauern ist die heutige Regelung deshalb tendenziell ungünstiger als das alte System, für kurzfristigere Anlagen und für Sparerinnen mit hohem persönlichem Steuersatz dagegen oft günstiger.",
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
        question: "Was ist das Reihenfolgerisiko bei einem Entnahmeplan?",
        answer:
          "Die Tatsache, dass nicht nur die Durchschnittsrendite über die Entnahmejahre zählt, sondern auch die Reihenfolge, in der gute und schlechte Jahre auftreten. Fällt der Kurs in den ersten Jahren der Entnahme stark, müssen bei gleichbleibender Entnahmesumme mehr Anteile verkauft werden als geplant – diese Anteile fehlen dann auch in der anschließenden Erholung. Derselbe Crash zehn oder zwanzig Jahre später, wenn das Kapital längst gewachsen ist, wirkt sich deutlich schwächer aus. Ein Cash-Puffer für die ersten zwei bis drei Entnahmejahre nimmt genau in der kritischen Anfangsphase den Zwang, in einer schlechten Marktphase verkaufen zu müssen.",
      },
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
      {
        question:
          "In welcher Reihenfolge sollten Fondsanteile beim Entnehmen verkauft werden?",
        answer:
          "Die meisten Depots verkaufen automatisch nach dem Prinzip First In, First Out: Die zuerst gekauften Anteile werden auch zuerst wieder verkauft. Das ist steuerlich meist ungünstig, weil ältere Anteile in der Regel den größten Kursgewinn und damit die höchste Steuerlast je verkauftem Anteil tragen. Manche Banken erlauben eine gezielte Auswahl einzelner Tranchen, sodass sich stattdessen Anteile mit geringerem Gewinn zuerst verkaufen lassen und die Steuerlast über die Entnahmejahre gleichmäßiger verteilt wird. Diese Möglichkeit ist nicht bei jedem Broker gegeben und lohnt einen Blick in die eigenen Depotbedingungen, bevor die Entnahmephase beginnt.",
      },
      {
        question:
          "Wie unterscheidet sich ein Entnahmeplan von einer klassischen Rentenversicherung?",
        answer:
          "Bei einem selbst verwalteten Entnahmeplan bleibt das Kapital im eigenen Depot und wird nach einer selbst gewählten Regel entnommen – flexibel anpassbar, aber ohne Garantie, dass das Geld bis zum Lebensende reicht, falls die Rendite schlechter ausfällt als angenommen oder ein sehr hohes Alter erreicht wird. Eine klassische Rentenversicherung dagegen garantiert eine lebenslange Zahlung unabhängig von der eigenen Lebenserwartung, verlangt dafür aber, das Kapital an den Versicherer abzugeben, und verzichtet meist auf die Möglichkeit, im Todesfall noch vorhandenes Restkapital an Erben weiterzugeben. Der Entnahmeplan-Rechner hier bildet nur die erste Variante ab: die flexible, aber nicht lebenslang garantierte Entnahme aus dem eigenen Depot.",
      },
    ],
  },
];
