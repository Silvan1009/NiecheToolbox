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
    params: { start: 10000, rate: 0, jahre: 30, rendite: 7, kosten: 0, steuern: 0 },
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
    slug: "etf-sparplan-rechner",
    title: "ETF-Sparplan-Rechner: Endkapital mit Kosten und Steuern berechnen",
    description:
      "ETF-Sparplan berechnen mit TER, Teilfreistellung, Vorabpauschale und Inflation – nicht nur der Bruttowert, sondern was am Ende wirklich ankommt.",
    heading: "ETF-Sparplan berechnen",
    params: { start: 0, rate: 250, jahre: 30, rendite: 7, kosten: 0.2 },
    about: [
      "Ein ETF-Sparplan über 250 Euro im Monat, dreißig Jahre lang, bei sieben Prozent Rendite und 0,2 Prozent laufenden Kosten: eingezahlt werden 90.000 Euro, am Ende stehen 274.853 Euro im Depot, nach Steuern bleiben 252.397 Euro. Gut zwei Drittel des Endbetrags stammen damit aus Erträgen und nur ein Drittel aus eigenem Geld. Das ist die eigentliche Rechnung hinter dem ETF-Sparplan – und sie funktioniert nur, wenn man dreißig Jahre lang nicht daran rührt.",
      "Der wichtigste Hebel neben der Laufzeit sind die Kosten, und zwar aus einem Grund, der selten ausgesprochen wird: Die Gebühr wird nicht auf die Einzahlung berechnet, sondern jedes Jahr auf den gesamten Bestand. Sie wächst also mit. Derselbe Sparplan mit 1,5 statt 0,2 Prozent laufender Kosten – der Unterschied zwischen einem breiten ETF und einem aktiv gemanagten Fonds – endet bei 214.496 statt 274.853 Euro. Das sind 60.357 Euro, also zwei Drittel der gesamten Einzahlungen, für eine Differenz von 1,3 Prozentpunkten im Jahr.",
      "Steuerlich ist ein Aktien-ETF günstiger, als die 26,375 Prozent Abgeltungsteuer vermuten lassen. Bei Fonds mit mindestens 51 Prozent Aktienanteil bleiben 30 Prozent des Ertrags über die Teilfreistellung steuerfrei, die effektive Belastung sinkt dadurch auf rund 18,5 Prozent des Gewinns. Dafür wird seit 2018 auch während der Laufzeit besteuert: Die Vorabpauschale greift jedes Jahr auf einen kleinen Teil der Wertsteigerung zu. Der Rechner bildet beides ab und rechnet die bereits gezahlte Vorabpauschale am Ende gegen die Verkaufssteuer, damit derselbe Ertrag nicht zweimal besteuert wird.",
    ],
    faq: [
      {
        question: "Welche Rendite sollte ich für einen ETF-Sparplan annehmen?",
        answer:
          "Ein breit streuender Aktienindex wie der MSCI World hat langfristig rund 7 Prozent pro Jahr vor Inflation gebracht. Diese Zahl ist ein Durchschnitt über Jahrzehnte, kein Versprechen: Einzelne Jahre lagen bei plus 30 und bei minus 40 Prozent, und es gab Zeiträume von über zehn Jahren ohne Gewinn. Für eine Planung ist es sinnvoll, mit 5 bis 7 Prozent zu rechnen und die Rechnung zusätzlich mit 4 Prozent zu prüfen – wenn der Plan auch dann noch trägt, ist er belastbar.",
      },
      {
        question: "Was bedeutet die TER bei einem ETF?",
        answer:
          "Die Total Expense Ratio ist die laufende Kostenquote des Fonds, angegeben in Prozent pro Jahr des angelegten Vermögens. Sie wird nicht abgebucht, sondern täglich anteilig aus dem Fondsvermögen entnommen – man sieht sie also nie auf dem Kontoauszug, sondern nur an einer leicht schlechteren Wertentwicklung. Breite ETFs liegen bei 0,1 bis 0,3 Prozent, aktiv gemanagte Fonds bei 1,5 bis 2 Prozent. Nicht enthalten sind Ordergebühren des Brokers und die Handelskosten innerhalb des Fonds.",
      },
      {
        question: "Thesaurierend oder ausschüttend – was ist besser?",
        answer:
          "Für den reinen Vermögensaufbau ist ein thesaurierender ETF bequemer, weil die Erträge automatisch wieder angelegt werden und der Zinseszins ohne Zutun läuft. Steuerlich nehmen sich beide seit 2018 wenig: Beim thesaurierenden greift die Vorabpauschale, beim ausschüttenden wird die Ausschüttung direkt besteuert. Ausschüttende ETFs haben einen praktischen Vorteil, wenn der Sparerpauschbetrag von 1.000 Euro sonst ungenutzt bliebe – dann sind die Ausschüttungen bis zu dieser Grenze steuerfrei.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "100-euro-sparplan",
    title: "100 Euro im Monat sparen: Was daraus in 10, 20 und 30 Jahren wird",
    description:
      "100 Euro monatlich anlegen – Endkapital nach Kosten, Steuern und Inflation. Mit Jahrestabelle und der Rechnung, was zehn Jahre früher anfangen bringt.",
    heading: "100 Euro im Monat sparen",
    params: { start: 0, rate: 100, jahre: 30, rendite: 7 },
    about: [
      "Hundert Euro im Monat klingen nach zu wenig, um etwas zu bewegen. Über dreißig Jahre bei sieben Prozent Rendite werden daraus 112.412 Euro, von denen nur 36.000 Euro aus der eigenen Tasche stammen – 68 Prozent des Endbetrags sind Ertrag. Nach Steuern bleiben 103.180 Euro. Der Betrag ist deshalb so hoch, weil hundert Euro dreißig Jahre lang jeden Monat neu anfangen zu arbeiten: Die erste Rate hat dreißig Jahre Zeit, die letzte einen Monat.",
      "Wie stark die Zeit wiegt, zeigt der Vergleich der Laufzeiten. Zehn Jahre mehr, also vierzig statt dreißig Jahre bei gleicher Rate, ergeben 228.719 statt 112.412 Euro. Die zusätzlichen zehn Jahre kosten 12.000 Euro Einzahlung und bringen 116.307 Euro mehr heraus – mehr als der komplette Ertrag der ersten dreißig Jahre. Wer mit zwanzig statt mit dreißig anfängt, muss deshalb nicht doppelt so viel sparen, um doppelt so weit zu kommen.",
      "Umgekehrt gilt: Wer später anfängt, muss deutlich mehr aufwenden. Um dieselben rund 103.000 Euro nach Steuern in zwanzig statt dreißig Jahren zu erreichen, braucht es bei sieben Prozent 222 Euro im Monat statt hundert. Die Rate mehr als verdoppelt sich für dieselbe Summe. Das ist keine Mahnung, sondern eine schlichte Eigenschaft der Zinseszinsformel – und ein guter Grund, lieber mit einem kleinen Betrag früh zu beginnen als auf den perfekten Zeitpunkt und die perfekte Rate zu warten.",
    ],
    faq: [
      {
        question: "Lohnt sich ein Sparplan mit 100 Euro überhaupt?",
        answer:
          "Ja, und zwar aus zwei Gründen. Rechnerisch, weil über dreißig Jahre gut 112.000 Euro entstehen, von denen zwei Drittel nicht aus eigenem Geld stammen. Praktisch, weil eine kleine Rate durchgehalten wird: Ein Sparplan, den man in einem schlechten Monat nicht aussetzen muss, läuft weiter – und Durchhalten ist bei dieser Rechnung wichtiger als die Höhe der Rate. Aufstocken lässt sich später jederzeit, verlorene Jahre nicht.",
      },
      {
        question: "Wie viel sind 100 Euro im Monat in 30 Jahren real wert?",
        answer:
          "Bei 2 Prozent Inflation entsprechen die 112.412 Euro einer heutigen Kaufkraft von rund 57.000 Euro. Das ist immer noch deutlich mehr als die eingezahlten 36.000 Euro, aber eben nur die Hälfte des Nominalbetrags. Deshalb weist der Rechner beide Zahlen aus: Der Nominalwert steht auf dem Depotauszug, mit dem Realwert geht man einkaufen.",
      },
      {
        question: "Sollte ich die Sparrate jährlich erhöhen?",
        answer:
          "Wenn das Einkommen mitwächst, ja – sonst sinkt der reale Sparbeitrag jedes Jahr um die Inflation. Der Rechner hat dafür das Feld Dynamik: Drei Prozent jährliche Erhöhung bedeuten, dass aus 100 Euro nach dreißig Jahren rund 236 Euro werden. Wichtig ist, im Blick zu behalten, wohin die Rate am Ende der Laufzeit läuft – bei hohen Dynamikwerten wird sie schnell größer, als man dauerhaft tragen möchte. Der Rechner nennt die Rate des letzten Jahres deshalb ausdrücklich.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "500-euro-monatlich-sparen",
    title: "500 Euro monatlich anlegen: Endkapital in 20 und 30 Jahren",
    description:
      "500 Euro im Monat sparen – mit Kosten, Abgeltungsteuer und Inflation gerechnet. Inklusive der monatlichen Entnahme, die daraus später möglich ist.",
    heading: "500 Euro monatlich anlegen",
    params: { start: 0, rate: 500, jahre: 20, rendite: 7 },
    about: [
      "Fünfhundert Euro im Monat über zwanzig Jahre bei sieben Prozent ergeben 244.623 Euro, nach Steuern 229.424 Euro. Eingezahlt wurden davon 120.000 Euro. Die Verteilung ist bei zwanzig Jahren noch ausgeglichen – etwa die Hälfte Einzahlung, die Hälfte Ertrag. Bei dreißig Jahren kippt sie deutlich: Dann stehen 540.668 Euro im Depot bei 180.000 Euro Einzahlung, der Ertragsanteil steigt auf 67 Prozent.",
      "In dieser Größenordnung wird die Vorabpauschale spürbar. Sobald der Depotwert so weit gewachsen ist, dass der Basisertrag den Sparerpauschbetrag von 1.000 Euro übersteigt, zieht die Bank jedes Jahr im Januar Steuer vom Verrechnungskonto ein. Bei einem Aktien-ETF passiert das etwa ab einem Bestand von 64.000 Euro – vorher bleibt alles im Freibetrag. Auf dem Verrechnungskonto sollte dann Geld liegen, sonst verkauft die Bank Anteile, um die Steuer zu bedienen.",
      "Interessanter als das Endkapital ist bei dieser Summe die Frage, was davon später monatlich entnommen werden kann. Aus 229.424 Euro lassen sich bei fünf Prozent Rendite dreißig Jahre lang 1.216 Euro im Monat entnehmen, bis das Kapital aufgebraucht ist. Wer die Substanz nicht antasten will, kommt auf 935 Euro im Monat – dauerhaft, ohne Ende. Der Unterschied zwischen beiden Zahlen ist die Entscheidung, ob am Ende noch etwas übrig bleiben soll.",
    ],
    faq: [
      {
        question: "Wie viel Vermögen habe ich mit 500 Euro im Monat nach 30 Jahren?",
        answer:
          "Bei 7 Prozent Rendite und 0,2 Prozent Kosten sind es 540.668 Euro vor Steuern und 496.895 Euro nach Steuern. In heutiger Kaufkraft, also bei 2 Prozent Inflation, entspricht das etwa 274.000 Euro. Bei 5 Prozent Rendite statt 7 wären es 379.283 Euro – die Renditeannahme ist der mit Abstand empfindlichste Wert in dieser Rechnung, deutlich empfindlicher als die Sparrate.",
      },
      {
        question: "Ab wann fällt bei einem Sparplan Vorabpauschale an?",
        answer:
          "Sobald der Basisertrag den Sparerpauschbetrag übersteigt. Der Basisertrag ist der Depotwert zum Jahresanfang mal Basiszins mal 0,7 – für 2026 also 2,24 Prozent des Depotwerts. Bei einem Aktien-ETF mit 30 Prozent Teilfreistellung bleiben davon 70 Prozent steuerpflichtig. Rechnerisch wird der Freibetrag von 1.000 Euro damit ab rund 64.000 Euro Depotwert überschritten (1.000 geteilt durch 2,24 Prozent mal 0,7). Mit einem Freistellungsauftrag verrechnet die Bank das automatisch.",
      },
      {
        question: "Was passiert, wenn ich den Sparplan zwischendurch pausiere?",
        answer:
          "Das bereits angelegte Kapital verzinst sich weiter, nur kommt nichts Neues hinzu. Der Schaden ist kleiner, als viele befürchten, wenn die Pause früh liegt und kurz ist – und größer als gedacht, wenn sie spät liegt: Eine Rate im letzten Jahr hat kaum noch Zeit zu wachsen, aber der Bestand, auf den sie fehlt, ist groß. Wer die Wahl hat, senkt die Rate lieber, als den Plan ganz auszusetzen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "sparplan-1-million",
    title: "Eine Million sparen: Welche Sparrate dafür nötig ist",
    description:
      "Wie viel muss ich monatlich sparen, um Millionär zu werden? Rechner mit Laufzeit, Rendite, Steuern und Inflation – inklusive Realwert der Million.",
    heading: "Eine Million sparen",
    params: { modus: "sparrate", start: 0, ziel: 1000000, jahre: 30, rendite: 7 },
    about: [
      "Eine Million Euro nach Steuern, in dreißig Jahren, bei sieben Prozent Rendite: Dafür braucht es 1.018 Euro im Monat. Eingezahlt werden dabei 366.581 Euro – der Rest von 720.792 Euro kommt aus Erträgen. Bei vierzig Jahren Laufzeit halbiert sich die nötige Rate auf 507 Euro, und die Einzahlung sinkt auf 243.202 Euro. Zehn Jahre mehr Zeit ersetzen also gut 123.000 Euro eigenes Geld.",
      "Die Rechnung reagiert extrem empfindlich auf die Renditeannahme. Bei fünf statt sieben Prozent steigt die nötige Rate über dreißig Jahre von 1.018 auf 1.410 Euro. Ein Unterschied von zwei Prozentpunkten in der Annahme verschiebt die Rate also um gut ein Drittel. Wer diese Rechnung zur Lebensplanung benutzt, sollte sie deshalb mit mehreren Renditen durchspielen und nicht mit der optimistischsten planen – und die laufenden Kosten niedrig halten, weil sie direkt von der Rendite abgehen.",
      "Der unbequeme Teil ist die Inflation. Eine Million Euro in dreißig Jahren hat bei zwei Prozent Geldentwertung die Kaufkraft von heute 552.071 Euro. Wer sich unter „Millionär“ das vorstellt, was eine Million heute kauft, muss entsprechend auf rund 1,8 Millionen zielen. Der Rechner weist die Kaufkraft deshalb immer mit aus – nicht um zu entmutigen, sondern weil eine Zielzahl ohne Zeitbezug keine Zielzahl ist.",
    ],
    faq: [
      {
        question: "Wie lange dauert es, mit 500 Euro im Monat Millionär zu werden?",
        answer:
          "Bei 7 Prozent Rendite und 0,2 Prozent Kosten dauert es 41 Jahre, bis nach Steuern eine Million erreicht ist. Mit 1.000 Euro im Monat sind es 31 Jahre, mit 2.000 Euro 22 Jahre. Die Laufzeit verkürzt sich also nicht proportional zur Rate: Eine Verdopplung der Sparrate spart nicht die Hälfte der Zeit, sondern nur etwa ein Viertel – weil der Zinseszins Zeit braucht und nicht durch Geld zu ersetzen ist.",
      },
      {
        question: "Rechnet der Rechner die Steuern beim Zielbetrag mit?",
        answer:
          "Ja. Der Zielbetrag ist das, was nach Abgeltungsteuer, Teilfreistellung und Vorabpauschale übrig bleibt – also das Geld, über das tatsächlich verfügt werden kann. Deshalb liegt die nötige Sparrate höher als bei Rechnern, die den Bruttowert als Ziel nehmen: 1.018 statt 885 Euro im Monat, ein Unterschied von 133 Euro.",
      },
      {
        question: "Ist eine Million ein sinnvolles Sparziel?",
        answer:
          "Als runde Zahl ist sie vor allem eingängig. Sinnvoller ist es, vom Bedarf her zu rechnen: Wer im Ruhestand 2.000 Euro im Monat aus dem Depot entnehmen will und dabei die Substanz nicht antasten möchte, braucht bei 4 Prozent Entnahme rund 600.000 Euro. Soll das Kapital über dreißig Jahre aufgebraucht werden, reichen 422.563 Euro. Der Rechner zeigt beide Entnahmebeträge unter dem Ergebnis an, damit aus der Zielzahl eine Bedarfszahl werden kann.",
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
    params: { modus: "sparrate", start: 0, ziel: 100000, jahre: 20, rendite: 6 },
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
        question: "Was passiert, wenn kein Geld auf dem Verrechnungskonto liegt?",
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
    params: { start: 500000, rate: 0, jahre: 1, rendite: 5, entnahme: 30, steuern: 0, kosten: 0 },
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
