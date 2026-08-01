/**
 * Inhalte der SEO-Unterseiten – eine je Kennzahl, nach der wirklich gesucht
 * wird.
 *
 * Warum eigene Texte und nicht nur eine andere Überschrift: Varianten, die
 * sich inhaltlich nicht unterscheiden, sind aus Sicht einer AdSense-Prüfung
 * „low value content“ – und aus Sicht eines Besuchers auch. Jede Seite hier
 * erklärt ihre Kennzahl von vorn: was sie misst, wo sie in die Irre führt und
 * womit sie zusammen gelesen werden muss. Der Rechner darunter ist derselbe,
 * nur mit dieser Kennzahl im Fokus.
 *
 * Die Zahlenbeispiele beziehen sich auf die Voreinstellungen des Rechners
 * (Kurs 68 Euro, 120 Mio. Aktien, 430 Mio. Euro Gewinn), damit ein Besucher
 * das Gelesene auf dem Bildschirm nachvollziehen kann.
 */

import type { FaqEntry } from "@/tools/types";
import type { KennzahlKey } from "./kennzahlen";

export interface VariantenText {
  key: KennzahlKey;
  /** URL-Segment unter /tools/aktienkennzahlen/ */
  slug: string;
  titel: string;
  beschreibung: string;
  heading: string;
  /** Drei eigene Absätze; der allgemeine Erklärtext folgt danach. */
  absaetze: string[];
  faq: FaqEntry[];
}

export const variantenTexte: VariantenText[] = [
  /* ----------------------------------------------------------------------- */

  {
    key: "kgv",
    slug: "kgv-berechnen",
    titel: "KGV berechnen: Rechner für das Kurs-Gewinn-Verhältnis",
    beschreibung:
      "Kurs geteilt durch Gewinn je Aktie – mit Einordnung, Gewinnrendite, PEG und fairem Wert. Alle Kennzahlen aus einem Geschäftsbericht auf einmal.",
    heading: "KGV berechnen",
    absaetze: [
      "Das Kurs-Gewinn-Verhältnis ist die bekannteste Bewertungskennzahl und die am häufigsten falsch gelesene. Sie teilt den Kurs durch den Gewinn je Aktie: Bei 68 Euro Kurs und 3,58 Euro Gewinn je Aktie ergibt das ein KGV von 19. Anders gesagt: Wer das Unternehmen zu diesem Preis komplett kauft, hat den Kaufpreis nach neunzehn Jahren verdient – vorausgesetzt, der Gewinn bleibt konstant. Genau diese Voraussetzung trifft praktisch nie zu, und deshalb sagt ein KGV allein noch nichts über günstig oder teuer.",
      "Wichtig ist, welchen Gewinn man einsetzt. Das KGV auf den Gewinn des abgelaufenen Geschäftsjahres nennt man nachlaufend, das auf die Schätzung für das laufende oder kommende Jahr vorlaufend. Beide Zahlen können weit auseinanderliegen: Ein zyklisches Unternehmen im Abschwung hat ein optisch niedriges nachlaufendes und ein hohes vorlaufendes KGV, bei einem Wachstumsunternehmen ist es umgekehrt. Wer zwei Aktien vergleicht, muss dieselbe Variante verwenden – sonst vergleicht er zwei verschiedene Dinge. Der Rechner nimmt den Gewinn, den du eintippst; für ein vorlaufendes KGV also die Schätzung eintragen.",
      "Ein KGV wird erst durch drei Zusatzinformationen aussagekräftig: das Wachstum, die Verschuldung und die Gewinnqualität. Das Wachstum steckt im PEG-Verhältnis – ein KGV von 30 bei 30 Prozent Wachstum entspricht rechnerisch einem KGV von 10 bei 10 Prozent. Die Verschuldung fällt aus dem KGV komplett heraus, weshalb zwei Unternehmen mit identischem KGV sehr unterschiedlich teuer sein können; das zeigt erst EV/EBITDA. Und die Gewinnqualität sagt, ob der Gewinn im Nenner überhaupt als Geld eingegangen ist. Der Rechner weist alle drei mit aus, damit das KGV nicht allein dasteht.",
    ],
    faq: [
      {
        question: "Was ist ein gutes KGV?",
        answer:
          "Als Faustregel gilt: bis 15 günstig, 15 bis 25 normal, darüber wird Wachstum eingepreist. Diese Bandbreite ist aber branchenblind. Software- und Medizintechnikunternehmen werden seit Jahren mit KGVs über 30 gehandelt, Autohersteller und Banken oft unter 10 – nicht weil der Markt sich irrt, sondern weil Wachstum, Kapitalbedarf und Konjunkturabhängigkeit sehr unterschiedlich sind. Sinnvoll ist der Vergleich mit dem eigenen historischen KGV des Unternehmens und mit direkten Wettbewerbern.",
      },
      {
        question: "Warum hat mein Unternehmen kein KGV?",
        answer:
          "Weil es keinen Gewinn ausweist. Bei einem Verlust wäre das KGV negativ, und eine negative Kennzahl dieser Art lässt sich nicht interpretieren – ein KGV von minus 12 ist nicht günstiger als eines von minus 40. Der Rechner lässt die Kennzahl in diesem Fall bewusst leer und zeigt stattdessen Kurs-Umsatz-Verhältnis, Kurs-Buchwert-Verhältnis und die Cashflow-Vielfachen, die auch in Verlustjahren funktionieren.",
      },
      {
        question: "Was sagt die Gewinnrendite gegenüber dem KGV?",
        answer:
          "Sie ist derselbe Zusammenhang von der anderen Seite: Gewinn je Aktie geteilt durch den Kurs, in Prozent. Ein KGV von 19 entspricht 5,3 Prozent Gewinnrendite. Der Vorteil dieser Schreibweise ist die direkte Vergleichbarkeit mit Anleihen und Sparzinsen: Wenn eine zehnjährige Bundesanleihe 2,5 Prozent bringt und die Aktie 5,3 Prozent Gewinnrendite, ist der Aufschlag für das Aktienrisiko 2,8 Prozentpunkte. Anders als das KGV bleibt die Gewinnrendite auch bei Verlusten bildbar – dann eben negativ.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "kbv",
    slug: "kurs-buchwert-verhaeltnis",
    titel: "Kurs-Buchwert-Verhältnis berechnen (KBV-Rechner)",
    beschreibung:
      "Kurs geteilt durch Buchwert je Aktie – mit Eigenkapitalrendite, Eigenkapitalquote und Graham-Zahl. Warum ein KBV unter 1 kein Schnäppchen sein muss.",
    heading: "Kurs-Buchwert-Verhältnis berechnen",
    absaetze: [
      "Das Kurs-Buchwert-Verhältnis setzt den Kurs ins Verhältnis zum bilanziellen Eigenkapital je Aktie. Bei 2.600 Millionen Euro Eigenkapital und 120 Millionen Aktien beträgt der Buchwert 21,67 Euro je Aktie; bei einem Kurs von 68 Euro ergibt das ein KBV von 3,1. Der Markt zahlt also gut drei Euro für einen Euro bilanzielles Eigenkapital. Der Buchwert ist dabei eine Bilanzgröße und kein Verkaufswert: Grundstücke stehen oft mit historischen Anschaffungskosten drin, selbst entwickelte Marken und Software überhaupt nicht.",
      "Ein KBV unter 1 heißt, dass die Börse das Unternehmen unter seinem bilanziellen Eigenkapital handelt. Das klingt nach einem Schnäppchen und ist meistens keins: Der Markt erwartet in diesen Fällen entweder weitere Verluste, die das Eigenkapital aufzehren, oder er traut den Bilanzwerten nicht – etwa bei Immobilien, die zu optimistisch bewertet sind, oder bei Firmenwerten aus teuren Übernahmen, die noch abgeschrieben werden müssen. Bei Banken ist ein KBV unter 1 seit der Finanzkrise über lange Strecken der Normalzustand gewesen.",
      "Das KBV lässt sich nur zusammen mit der Eigenkapitalrendite lesen. Beide zusammen ergeben eine einfache Probe: Ein Unternehmen, das 20 Prozent auf sein Eigenkapital verdient, ist einen Aufschlag wert; eines mit 5 Prozent nicht. Genau deshalb ist ein KBV von 3 bei 18 Prozent Eigenkapitalrendite unauffällig, dasselbe KBV bei 6 Prozent aber teuer. Der Rechner weist beide Kennzahlen nebeneinander aus und weist ausdrücklich darauf hin, wenn ein hoher Buchwertaufschlag auf eine schwache Eigenkapitalrendite trifft.",
    ],
    faq: [
      {
        question: "Was ist ein gutes Kurs-Buchwert-Verhältnis?",
        answer:
          "Bis 1,5 gilt als günstig, bis 3 als normal. Entscheidend ist aber die Art des Geschäfts: Bei substanzstarken Unternehmen wie Banken, Versicherern und Immobiliengesellschaften ist das KBV eine aussagekräftige Kennzahl, weil die Bilanz das Geschäft im Wesentlichen abbildet. Bei Software-, Marken- oder Dienstleistungsunternehmen liegt der Wert dagegen in Dingen, die nicht in der Bilanz stehen – dort sind KBVs von 8 oder 15 üblich und sagen wenig über die Bewertung aus.",
      },
      {
        question: "Was ist der Unterschied zwischen Buchwert und Substanzwert?",
        answer:
          "Der Buchwert ist das Eigenkapital nach den Regeln der Rechnungslegung: Anschaffungskosten minus Abschreibungen, plus was an Bewertungen zulässig war. Der Substanzwert versucht dagegen zu schätzen, was die Vermögensgegenstände heute wirklich wert wären. Beide können weit auseinanderliegen – ein 1980 gekauftes Innenstadtgrundstück steht im Buchwert mit dem damaligen Preis. Deshalb ist ein KBV über 1 nicht automatisch ein Aufschlag auf die Substanz.",
      },
      {
        question: "Was ist die Graham-Zahl?",
        answer:
          "Ein Bewertungsmaßstab von Benjamin Graham, der Gewinn und Substanz kombiniert: die Wurzel aus dem 22,5-Fachen von Gewinn je Aktie und Buchwert je Aktie. Der Faktor 22,5 entsteht aus einem KGV von 15 mal einem KBV von 1,5. Die Zahl ist absichtlich streng und liegt bei substanzarmen Geschäftsmodellen weit unter dem Kurs – ein Softwareunternehmen ohne Anlagevermögen wird sie nie erreichen. Der Rechner weist sie als eines von drei Verfahren für den fairen Wert aus.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "kuv",
    slug: "kurs-umsatz-verhaeltnis",
    titel: "Kurs-Umsatz-Verhältnis berechnen (KUV-Rechner)",
    beschreibung:
      "Börsenwert geteilt durch Umsatz – die Kennzahl für Unternehmen ohne Gewinn. Mit Margen, EV/Umsatz und allen weiteren Kennzahlen.",
    heading: "Kurs-Umsatz-Verhältnis berechnen",
    absaetze: [
      "Das Kurs-Umsatz-Verhältnis teilt den Börsenwert durch den Jahresumsatz. Bei 8.160 Millionen Euro Börsenwert und 4.800 Millionen Euro Umsatz ergibt das 1,7. Der große Vorteil: Umsatz gibt es immer, auch in einem Verlustjahr, und er lässt sich bilanziell weniger gestalten als ein Gewinn. Damit ist das KUV die einzige klassische Bewertungskennzahl, die bei jungen oder vorübergehend defizitären Unternehmen überhaupt funktioniert.",
      "Der große Nachteil folgt unmittelbar: Umsatz sagt nichts darüber, ob am Ende Geld verdient wird. Ein Lebensmittelhändler mit 2 Prozent Nettomarge und ein Softwarehaus mit 25 Prozent haben grundverschiedene Umsatzqualität – dass beide bei einem KUV von 1,7 gleich teuer wären, ist offensichtlich falsch. Deshalb gehört zum KUV immer der Blick auf die Marge. Als Näherung: Bei sonst gleichen Annahmen darf das KUV etwa so hoch sein wie die Nettomarge in Prozent, geteilt durch die Gewinnrendite, die man erwartet.",
      "Sauberer als das KUV ist EV/Umsatz, weil dort auch die Schulden eingerechnet sind. Ein Unternehmen mit 8 Milliarden Börsenwert und 1 Milliarde Nettoschulden kostet als Ganzes 9 Milliarden – wer den Umsatz kauft, übernimmt die Schulden mit. Bei Übernahmen wird deshalb fast immer in EV-Vielfachen gerechnet und nicht im KUV. Der Rechner weist beide aus und zusätzlich die Margen, an denen sich zeigt, ob das Umsatzvielfache gerechtfertigt ist.",
    ],
    faq: [
      {
        question: "Was ist ein gutes Kurs-Umsatz-Verhältnis?",
        answer:
          "Unter 1 gilt traditionell als günstig, bis 3 als normal. Die Spanne ist aber extrem branchenabhängig: Im Handel und in der Automobilindustrie sind Werte um 0,3 üblich, bei Softwareunternehmen mit hohen wiederkehrenden Erlösen 8 bis 15. Sinnvoll ist die Kennzahl vor allem im Vergleich innerhalb einer Branche und im Vergleich mit der eigenen Historie eines Unternehmens.",
      },
      {
        question: "Wann ist das KUV besser geeignet als das KGV?",
        answer:
          "Bei Unternehmen ohne Gewinn, bei stark schwankenden Ergebnissen und in Jahren mit großen Sondereffekten. Ein Konzern, der eine Sparte abschreibt, weist einen Verlust aus, obwohl das operative Geschäft unverändert läuft – das KGV entfällt dann oder wird unbrauchbar, das KUV bleibt vergleichbar. Umgekehrt gilt: Sobald es einen belastbaren, wiederkehrenden Gewinn gibt, sind KGV, EV/EBIT und die Free-Cashflow-Rendite aussagekräftiger.",
      },
      {
        question: "Warum ist EV/Umsatz aussagekräftiger als das KUV?",
        answer:
          "Weil der Börsenwert nur den Eigenkapitalanteil abbildet. Zwei Unternehmen mit gleichem Umsatz und gleichem Börsenwert sind nicht gleich teuer, wenn eines schuldenfrei ist und das andere die Hälfte seines Vermögens über Kredite finanziert hat. EV/Umsatz rechnet die Nettoschulden hinzu und liegt deshalb bei verschuldeten Unternehmen deutlich über dem KUV – bei Netto-Liquidität darunter.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "peg",
    slug: "peg-ratio",
    titel: "PEG-Ratio berechnen: KGV im Verhältnis zum Wachstum",
    beschreibung:
      "KGV geteilt durch das erwartete Gewinnwachstum. Mit Kursziel, erwarteter Rendite pro Jahr und allen weiteren Kennzahlen aus dem Geschäftsbericht.",
    heading: "PEG-Ratio berechnen",
    absaetze: [
      "Das PEG-Verhältnis beantwortet die Frage, die ein KGV offen lässt: Ist die Bewertung durch Wachstum gedeckt? Gerechnet wird KGV geteilt durch das erwartete Gewinnwachstum in Prozent. Ein KGV von 19 bei 7 Prozent Wachstum ergibt ein PEG von 2,7. Die Idee dahinter, populär gemacht von Peter Lynch: Ein Unternehmen, das mit 30 Prozent wächst, darf ein KGV von 30 haben – dann liegt das PEG bei 1 und die Aktie ist rechnerisch genauso bewertet wie ein Unternehmen mit 10 Prozent Wachstum und KGV 10.",
      "Der Haken steckt im Nenner. Das Wachstum ist eine Schätzung, und zwar eine, die sich mit jedem Quartalsbericht ändert. Wer 15 statt 10 Prozent einträgt, senkt das PEG um ein Drittel, ohne dass sich am Unternehmen etwas geändert hätte. Deshalb ist das PEG keine Kennzahl, die man einmal ausrechnet, sondern eine, die man in einer Spanne betrachtet: Was ergibt sich bei vorsichtigen 5 Prozent, was bei optimistischen 12? Liegt das PEG in beiden Fällen unter 1,5, ist die Bewertung robust. Kippt es zwischen günstig und teuer, hängt die ganze Anlageentscheidung an einer Prognose.",
      "Zwei Einschränkungen sind wichtig. Erstens funktioniert das PEG nur bei positivem Gewinn und positivem Wachstum – bei stagnierenden oder schrumpfenden Ergebnissen ist es nicht bildbar, und der Rechner lässt es dann leer. Zweitens ignoriert es die Qualität des Wachstums: Ein Gewinnwachstum, das über Zukäufe auf Kredit entsteht, ist etwas anderes als eines aus dem laufenden Geschäft. Der Blick auf Verschuldung, Kapitalrendite und Gewinnqualität steht deshalb im Rechner direkt daneben.",
    ],
    faq: [
      {
        question: "Was ist ein gutes PEG-Verhältnis?",
        answer:
          "Bis 1 gilt als preiswert, bis 2 als vertretbar, darüber wird Wachstum bezahlt, das erst noch geliefert werden muss. Die Grenze von 1 stammt aus einer Zeit deutlich höherer Zinsen und ist heute streng – bei niedrigen Zinsen sind Anleger bereit, für langfristig verlässliches Wachstum mehr zu zahlen. Sinnvoller als die absolute Grenze ist der Vergleich innerhalb einer Branche.",
      },
      {
        question: "Welches Wachstum trägt man ein?",
        answer:
          "Das erwartete Gewinnwachstum pro Jahr für die nächsten drei bis fünf Jahre, nicht das des letzten Jahres. Anhaltspunkte sind die Prognose des Unternehmens, das durchschnittliche Wachstum der vergangenen fünf Jahre und die Schätzungen der Analysten. Wichtig ist Konsistenz: Wer ein vorlaufendes KGV verwendet, sollte auch das Wachstum ab diesem Jahr rechnen, sonst wird derselbe Wachstumsschritt zweimal gezählt.",
      },
      {
        question: "Warum ist mein PEG so hoch, obwohl das KGV normal ist?",
        answer:
          "Weil das Wachstum niedrig ist. Ein KGV von 15 bei 3 Prozent Wachstum ergibt ein PEG von 5 – rechnerisch teuer, obwohl das KGV unauffällig aussieht. Bei reifen, kaum wachsenden Unternehmen ist das der Normalfall, und dort ist das PEG die falsche Kennzahl. Aussagekräftiger sind dann Dividendenrendite, Free-Cashflow-Rendite und die Frage, ob das Geschäft seine Marktposition halten kann.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "dividendenrendite",
    slug: "dividendenrendite-berechnen",
    titel: "Dividendenrendite berechnen: Rechner mit Ausschüttungsquote",
    beschreibung:
      "Dividende je Aktie geteilt durch den Kurs – zusammen mit Ausschüttungsquote, freiem Cashflow und Verschuldung. So erkennst du, ob die Dividende sicher ist.",
    heading: "Dividendenrendite berechnen",
    absaetze: [
      "Die Dividendenrendite ist die Dividende je Aktie geteilt durch den Kurs. Bei 1,40 Euro Dividende und 68 Euro Kurs sind das 2,1 Prozent. Sie ist die persönlichste aller Kennzahlen, weil sie vom eigenen Einstiegskurs abhängt: Wer die Aktie vor Jahren zu 40 Euro gekauft hat, erzielt auf seinen Einstand 3,5 Prozent, während ein neuer Käufer 2,1 Prozent bekommt. Beide Zahlen sind richtig, sie beantworten nur verschiedene Fragen – für eine Kaufentscheidung zählt die Rendite auf den aktuellen Kurs.",
      "Eine hohe Dividendenrendite ist kein Qualitätsmerkmal, sondern zuerst eine Beobachtung über den Kurs. Der Nenner ist der Kurs, und der fällt, wenn der Markt Probleme sieht. Renditen über 7 Prozent bedeuten in den meisten Fällen, dass eine Kürzung erwartet wird – die Dividende der Vergangenheit steht dann im Zähler, die Skepsis über die Zukunft im Nenner. Wer nach hoher Dividendenrendite sucht, findet deshalb systematisch die Unternehmen mit den größten Problemen. Der einzige Schutz dagegen ist der Blick auf die Deckung.",
      "Drei Zahlen sagen, ob eine Dividende tragfähig ist. Die Ausschüttungsquote setzt sie ins Verhältnis zum Gewinn – über 80 Prozent wird es eng. Der freie Cashflow je Aktie sagt, ob das Geld überhaupt vorhanden ist; er ist der härtere Maßstab, weil Dividenden aus Geld und nicht aus Buchgewinnen bezahlt werden. Und die Nettoschulden zeigen, ob die Ausschüttung womöglich aus Krediten finanziert wird. Der Rechner stellt alle drei neben die Rendite und warnt, wenn die Dividende den Gewinn übersteigt.",
    ],
    faq: [
      {
        question: "Was ist eine gute Dividendenrendite?",
        answer:
          "Ab 3 Prozent gilt sie als ordentlich, unter 1 Prozent als nebensächlich. Im langjährigen Durchschnitt liegt die Dividendenrendite deutscher Standardwerte bei rund 3 Prozent. Über 6 bis 7 Prozent lohnt der Blick auf Ausschüttungsquote und freien Cashflow: Solche Renditen entstehen fast immer durch einen gefallenen Kurs und nicht durch eine besonders großzügige Dividende.",
      },
      {
        question: "Ist die Dividende steuerfrei?",
        answer:
          "Nein. Auf Dividenden fällt in Deutschland Abgeltungsteuer von 25 Prozent zuzüglich Solidaritätszuschlag und gegebenenfalls Kirchensteuer an, insgesamt rund 26,4 bis 28 Prozent. Der Sparerpauschbetrag von 1.000 Euro pro Person und Jahr bleibt frei. Bei ausländischen Aktien kommt Quellensteuer hinzu, die je nach Land teilweise anrechenbar ist. Der Rechner arbeitet mit Bruttodividenden – die Steuer hängt zu stark von der persönlichen Situation ab.",
      },
      {
        question: "Warum sinkt die Dividendenrendite, wenn der Kurs steigt?",
        answer:
          "Weil der Kurs im Nenner steht. Bei unveränderter Dividende von 1,40 Euro fällt die Rendite von 2,1 auf 1,4 Prozent, wenn der Kurs von 68 auf 100 Euro steigt. Für Aktionäre, die schon investiert sind, ändert das nichts: Sie bekommen weiterhin 1,40 Euro je Aktie. Für Neueinsteiger ist die Aktie als Dividendenanlage aber weniger attraktiv geworden.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "ausschuettungsquote",
    slug: "ausschuettungsquote-berechnen",
    titel: "Ausschüttungsquote berechnen: Ist die Dividende gedeckt?",
    beschreibung:
      "Dividende je Aktie geteilt durch den Gewinn je Aktie – mit freiem Cashflow, Verschuldung und Dividendenrendite. Der Test, ob eine Dividende trägt.",
    heading: "Ausschüttungsquote berechnen",
    absaetze: [
      "Die Ausschüttungsquote sagt, welcher Teil des Gewinns an die Aktionäre geht. Bei 1,40 Euro Dividende und 3,58 Euro Gewinn je Aktie sind das 39 Prozent – die restlichen 61 Prozent bleiben im Unternehmen und finanzieren Investitionen, Zukäufe oder Schuldenabbau. Diese Aufteilung ist eine der wichtigsten Entscheidungen einer Unternehmensführung: Jeder ausgeschüttete Euro fehlt für das Wachstum, jeder einbehaltene Euro muss besser angelegt werden als beim Aktionär selbst.",
      "Als gesund gelten 30 bis 60 Prozent. Darunter ist die Dividende sehr sicher, aber auch nachrangig – typisch für Unternehmen, die viel Kapital ins eigene Wachstum stecken. Über 80 Prozent wird es eng: Ein Gewinnrückgang von einem Fünftel würde die Dividende schon nicht mehr decken. Über 100 Prozent wird mehr ausgeschüttet als verdient, und das lässt sich nur eine begrenzte Zeit aus der Kasse oder über Kredite finanzieren. Historisch folgen Dividendenkürzungen fast immer auf mehrere Jahre mit Quoten über 100 Prozent.",
      "Die Quote auf den Gewinn ist allerdings nur die halbe Prüfung. Bezahlt wird die Dividende aus Geld, und Gewinn ist keins: Ein Unternehmen kann 400 Millionen Euro Gewinn ausweisen und trotzdem keinen freien Cashflow haben, wenn die Investitionen den operativen Cashflow aufzehren. Deshalb lohnt zusätzlich der Vergleich der Dividende mit dem freien Cashflow je Aktie. Der Rechner weist beide Größen aus und warnt, wenn die Ausschüttung über 80 Prozent des Gewinns liegt oder der freie Cashflow negativ ist.",
    ],
    faq: [
      {
        question: "Was ist eine gute Ausschüttungsquote?",
        answer:
          "30 bis 60 Prozent gelten als gesund: genug für eine verlässliche Dividende, genug für Investitionen. Reife Unternehmen mit stabilen Erträgen – Versorger, Versicherer, Konsumgüterhersteller – liegen häufig bei 50 bis 70 Prozent, Wachstumsunternehmen bei 0 bis 20. Eine Quote von null ist kein Mangel: Wer sein Kapital mit 20 Prozent Rendite reinvestieren kann, sollte es nicht ausschütten.",
      },
      {
        question: "Kann eine Ausschüttungsquote über 100 Prozent gerechtfertigt sein?",
        answer:
          "Vorübergehend ja. Nach einem Jahr mit hohen Abschreibungen oder Sonderaufwendungen ist der ausgewiesene Gewinn niedrig, während das Geld weiterhin hereinkommt – die Dividende aus dem freien Cashflow zu zahlen ist dann vertretbar. Manche Unternehmen halten ihre Dividende bewusst stabil und nehmen einzelne Jahre über 100 Prozent in Kauf. Dauerhaft geht es nicht: Irgendwann sind Kasse und Kreditlinien aufgebraucht.",
      },
      {
        question: "Wie erkenne ich eine gefährdete Dividende?",
        answer:
          "An drei Signalen zusammen: einer Ausschüttungsquote über 80 Prozent, einer Dividende über dem freien Cashflow und steigenden Nettoschulden. Kommt eine ungewöhnlich hohe Dividendenrendite hinzu, hat der Markt die Kürzung meist schon eingepreist. Der Rechner zeigt alle vier Größen auf einer Seite, damit dieses Muster sichtbar wird.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "roe",
    slug: "eigenkapitalrendite-berechnen",
    titel: "Eigenkapitalrendite berechnen (ROE-Rechner)",
    beschreibung:
      "Jahresüberschuss geteilt durch Eigenkapital – zusammen mit Eigenkapitalquote, Kapitalrendite und KBV. So erkennst du, ob eine hohe Rendite von Schulden kommt.",
    heading: "Eigenkapitalrendite berechnen",
    absaetze: [
      "Die Eigenkapitalrendite zeigt, was das Kapital der Aktionäre im Jahr verdient. Bei 430 Millionen Euro Gewinn und 2.600 Millionen Euro Eigenkapital sind das 16,5 Prozent. Sie ist die zentrale Kennzahl für die Qualität eines Geschäfts: Ein Unternehmen, das über Jahre 20 Prozent auf sein Eigenkapital verdient und diese Gewinne zu ähnlichen Renditen wieder anlegen kann, verdoppelt seinen inneren Wert etwa alle vier Jahre. Genau darauf beruht der Zinseszinseffekt bei Aktien.",
      "Die Kennzahl hat einen eingebauten Fehler, den man kennen muss: Sie lässt sich durch Schulden verbessern. Wer das Eigenkapital halbiert und den Rest über Kredite finanziert, verdoppelt die Eigenkapitalrendite, ohne dass das Geschäft besser geworden wäre – das Risiko ist nur gestiegen. Ein Unternehmen mit 25 Prozent Eigenkapitalrendite und 15 Prozent Eigenkapitalquote ist deshalb nicht besser als eines mit 15 Prozent Rendite und 50 Prozent Quote. Aktienrückkäufe wirken in dieselbe Richtung, weil sie das Eigenkapital verringern.",
      "Deshalb gehört zur Eigenkapitalrendite immer ein zweiter Blick: auf die Eigenkapitalquote und auf die Kapitalrendite ROCE, die das gesamte eingesetzte Kapital einbezieht und sich nicht durch Verschuldung aufpolieren lässt. Liegen ROE und ROCE nah beieinander, stammt die Rendite aus dem Geschäft; klaffen sie weit auseinander, aus der Bilanzstruktur. Und wenn eine dauerhaft hohe Eigenkapitalrendite auf ein niedriges Kurs-Buchwert-Verhältnis trifft, ist das eine der wenigen Konstellationen, die einen genaueren Blick wirklich lohnen.",
    ],
    faq: [
      {
        question: "Was ist eine gute Eigenkapitalrendite?",
        answer:
          "Ab 15 Prozent gilt sie als stark, unter 10 Prozent als schwach. Der Maßstab ist letztlich der Kapitalmarkt: Wer als Aktionär langfristig 7 bis 8 Prozent aus einem breiten Index erwarten kann, sollte für das Risiko eines einzelnen Unternehmens deutlich mehr sehen. Wichtig ist die Beständigkeit – zehn Jahre mit 15 Prozent sagen mehr aus als ein einzelnes Jahr mit 30.",
      },
      {
        question: "Was ist der Unterschied zwischen ROE, ROA und ROCE?",
        answer:
          "ROE bezieht den Gewinn auf das Eigenkapital, ROA auf die gesamte Bilanzsumme und ROCE das operative Ergebnis auf das eingesetzte Kapital, also die Bilanzsumme ohne die unverzinsten kurzfristigen Verbindlichkeiten. ROE ist die Sicht des Aktionärs, ROA die einfachste Vergleichsgröße und ROCE die aussagekräftigste für die Qualität des Geschäfts, weil sie unabhängig von der Finanzierung ist. Der Rechner weist alle drei aus.",
      },
      {
        question: "Warum wird bei negativem Eigenkapital keine Rendite ausgewiesen?",
        answer:
          "Weil das Ergebnis sinnlos wäre. Ein Gewinn von 100 bei einem Eigenkapital von minus 200 ergäbe minus 50 Prozent – eine Zahl, die weder Verlust noch Rendite bedeutet. Negatives Eigenkapital entsteht nach langen Verlustserien oder nach sehr großen Aktienrückkäufen und ist immer ein Anlass, sich die Verschuldung genau anzusehen. Der Rechner lässt ROE, KBV und Verschuldungsgrad in diesem Fall leer und weist im Hinweisblock darauf hin.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "evEbitda",
    slug: "ev-ebitda-berechnen",
    titel: "EV/EBITDA berechnen: Unternehmenswert zum operativen Ergebnis",
    beschreibung:
      "Börsenwert plus Nettoschulden, geteilt durch das EBITDA – die Kennzahl, mit der ganze Unternehmen bewertet werden. Mit EV/EBIT, EV/Umsatz und Verschuldung.",
    heading: "EV/EBITDA berechnen",
    absaetze: [
      "EV/EBITDA setzt den Unternehmenswert ins Verhältnis zum operativen Ergebnis vor Abschreibungen. Der Unternehmenswert – Enterprise Value – ist der Börsenwert plus die Nettoschulden: 8.160 Millionen Euro Börsenwert plus 1.020 Millionen Euro Nettoschulden ergeben 9.180 Millionen Euro. Geteilt durch 900 Millionen Euro EBITDA sind das 10,2. Das ist der Preis für das gesamte Unternehmen, nicht nur für den Eigenkapitalanteil – so rechnet jeder, der eine Firma tatsächlich kaufen würde.",
      "Der Vorteil gegenüber dem KGV liegt in der Unabhängigkeit von der Finanzierung. Zwei Unternehmen mit identischem operativem Geschäft, aber unterschiedlicher Verschuldung haben verschiedene KGVs – das höher verschuldete zahlt mehr Zinsen und weist weniger Gewinn aus. Im EV/EBITDA verschwindet dieser Unterschied, weil sowohl der Zähler die Schulden enthält als auch der Nenner vor Zinsen gemessen wird. Auch Steuersätze und Abschreibungsregeln verschiedener Länder fallen heraus, weshalb die Kennzahl bei internationalen Vergleichen und bei Übernahmen Standard ist.",
      "Die Schwäche ist dieselbe wie beim EBITDA selbst: Abschreibungen auszublenden heißt, den Verschleiß auszublenden. Für ein Telekomunternehmen, das jedes Jahr Milliarden in Netze investieren muss, ist das EBITDA eine schöngerechnete Größe – Warren Buffett hat es deshalb wiederholt als irreführend bezeichnet. Bei kapitalintensiven Geschäften ist EV/EBIT die fairere Kennzahl, weil das EBIT nach Abschreibungen gemessen wird. Der Rechner weist beide aus, dazu EV/Umsatz und die Verschuldung, aus der der Unternehmenswert entsteht.",
    ],
    faq: [
      {
        question: "Was ist ein gutes EV/EBITDA?",
        answer:
          "Bis 8 gilt als günstig, bis 12 als normal, darüber als teuer. Diese Spanne verschiebt sich mit dem Zinsniveau und der Branche: Software und Medizintechnik werden regelmäßig zum 15- bis 25-Fachen gehandelt, Baustoff- und Automobilzulieferer zum 4- bis 7-Fachen. Bei Übernahmen liegt das gezahlte Vielfache typischerweise über dem Börsenwert-Vielfachen, weil ein Aufschlag für die Kontrolle hinzukommt.",
      },
      {
        question: "Wie berechnet man den Enterprise Value?",
        answer:
          "Börsenwert plus Finanzschulden minus liquide Mittel. Der Gedanke: Wer das Unternehmen kauft, zahlt den Aktionären den Börsenwert, übernimmt die Schulden und bekommt die Kasse dazu. In der strengen Variante kommen Pensionsverpflichtungen, Leasingverbindlichkeiten und Minderheitenanteile hinzu und Beteiligungen werden abgezogen. Der Rechner nutzt die gebräuchliche Näherung aus Börsenwert und Nettofinanzschulden.",
      },
      {
        question: "Warum kann der Unternehmenswert unter dem Börsenwert liegen?",
        answer:
          "Weil die Nettoschulden negativ sein können. Liegt mehr Geld in der Kasse als Schulden in der Bilanz, ist der Unternehmenswert kleiner als der Börsenwert – der Käufer bekommt die Kasse mit und muss faktisch weniger für das Geschäft zahlen. Bei sehr großen Kassenbeständen kann der Unternehmenswert sogar negativ werden; dann lässt sich kein sinnvolles Vielfaches bilden und der Rechner weist die EV-Kennzahlen nicht aus.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "fcfRendite",
    slug: "free-cashflow-rendite-berechnen",
    titel: "Free-Cashflow-Rendite berechnen: Rechner mit Cashflow-Analyse",
    beschreibung:
      "Freier Cashflow je Aktie geteilt durch den Kurs – der härteste Bewertungsmaßstab. Mit Gewinnqualität, Investitionsquote und Dividendendeckung.",
    heading: "Free-Cashflow-Rendite berechnen",
    absaetze: [
      "Der freie Cashflow ist das Geld, das nach den Investitionen übrig bleibt: operativer Cashflow minus Investitionen ins Anlagevermögen. Bei 720 Millionen Euro operativem Cashflow und 300 Millionen Euro Investitionen sind das 420 Millionen Euro, also 3,50 Euro je Aktie. Gemessen an einem Kurs von 68 Euro ergibt das eine Free-Cashflow-Rendite von 5,1 Prozent. Diese Zahl beantwortet die Frage, die einen Eigentümer wirklich interessiert: Wie viel frei verfügbares Geld erwirtschaftet das Unternehmen im Verhältnis zu dem, was es an der Börse kostet?",
      "Anders als der Gewinn lässt sich der Cashflow kaum gestalten. Der Gewinn hängt von Abschreibungsdauern, Rückstellungen, aktivierten Entwicklungskosten und der Bewertung von Vorräten ab – alles Ermessensspielräume. Der Zahlungsstrom auf dem Konto ist dagegen eine Tatsache. Deshalb ist die Free-Cashflow-Rendite für viele Investoren der härteste Bewertungsmaßstab: Sie ist gegen Bilanzkosmetik weitgehend immun und lässt sich direkt mit einer Anleiherendite vergleichen.",
      "Zwei Dinge sind bei der Auslegung wichtig. Erstens schwankt der freie Cashflow stark, weil Investitionen in Schüben kommen: Ein Jahr mit einem neuen Werk drückt ihn ins Negative, obwohl das Geschäft unverändert läuft. Sinnvoll ist deshalb der Durchschnitt über drei bis fünf Jahre. Zweitens muss man unterscheiden, ob Investitionen dem Erhalt oder dem Wachstum dienen – nur die Erhaltungsinvestitionen sind zwingend. Der Rechner zeigt zusätzlich die Gewinnqualität, also das Verhältnis von operativem Cashflow zum Gewinn: Bleibt sie über mehrere Jahre unter 80 Prozent, ist das ein ernstes Warnsignal.",
    ],
    faq: [
      {
        question: "Was ist eine gute Free-Cashflow-Rendite?",
        answer:
          "Ab 5 Prozent gilt sie als attraktiv, unter 3 Prozent als teuer. Der Vergleichsmaßstab ist die Rendite sicherer Anleihen: Liegt die Free-Cashflow-Rendite darunter, zahlt man für das Aktienrisiko einen Aufschlag statt einen zu bekommen – das kann bei stark wachsenden Unternehmen richtig sein, weil der Cashflow in Zukunft deutlich höher ausfällt, bei reifen Geschäften aber nicht.",
      },
      {
        question: "Was ist der Unterschied zwischen operativem und freiem Cashflow?",
        answer:
          "Der operative Cashflow ist das Geld aus dem laufenden Geschäft, vor Investitionen. Der freie Cashflow zieht davon die Investitionen ins Anlagevermögen ab und zeigt damit, was für Dividende, Aktienrückkäufe und Schuldenabbau tatsächlich zur Verfügung steht. Die Differenz ist bei kapitalintensiven Unternehmen groß: Ein Netzbetreiber kann einen hohen operativen und über Jahre keinen freien Cashflow haben.",
      },
      {
        question: "Warum ist mein freier Cashflow negativ?",
        answer:
          "Weil die Investitionen den operativen Cashflow übersteigen. Bei einem Ausbauprogramm ist das gewollt und vorübergehend – das Geld fließt in Anlagen, die künftig Erträge bringen. Bei einem reifen Geschäft ist es dagegen ein Warnsignal: Dividende und Zinsen müssen dann aus der Kasse oder von der Bank kommen. Wichtig ist der Blick über mehrere Jahre und darauf, ob die Investitionen dem Wachstum oder nur dem Erhalt dienen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    key: "eigenkapitalquote",
    slug: "eigenkapitalquote-berechnen",
    titel: "Eigenkapitalquote berechnen: Rechner für die Bilanzstärke",
    beschreibung:
      "Eigenkapital geteilt durch Bilanzsumme – mit Verschuldungsgrad, Nettoschulden zum EBITDA, Zinsdeckung und Liquiditätsgrad.",
    heading: "Eigenkapitalquote berechnen",
    absaetze: [
      "Die Eigenkapitalquote ist das Eigenkapital geteilt durch die Bilanzsumme. Bei 2.600 Millionen Euro Eigenkapital und 6.100 Millionen Euro Bilanzsumme sind das 42,6 Prozent – dieser Anteil des Vermögens gehört den Aktionären, der Rest den Gläubigern. Sie ist das einfachste Maß für Krisenfestigkeit: Eigenkapital ist der Puffer, der Verluste auffängt, ohne dass jemand um Zustimmung gebeten werden muss. Ein Unternehmen mit 45 Prozent Quote kann mehrere schlechte Jahre aushalten, eines mit 12 Prozent nicht.",
      "Wie viel angemessen ist, hängt vom Geschäftsmodell ab. Im produzierenden Gewerbe gelten 30 bis 45 Prozent als solide, im Handel etwas weniger, bei Banken und Immobiliengesellschaften sind einstellige bis niedrige zweistellige Quoten strukturell normal – ihr Geschäft besteht darin, mit fremdem Geld zu arbeiten. Entscheidend ist außerdem die Art der Vermögenswerte: Eine dünne Quote bei langfristig vermieteten Immobilien ist etwas anderes als dieselbe Quote bei Vorräten in einem Modeunternehmen.",
      "Die Quote allein reicht nicht, weil sie eine Bestandsgröße ist und nichts über die Belastung sagt. Drei Kennzahlen ergänzen sie: Nettoschulden zum EBITDA zeigen, wie viele Jahresergebnisse zur Tilgung nötig wären – ab dem 3,5-Fachen wird es angespannt. Die Zinsdeckung sagt, wie oft das operative Ergebnis die Zinsen verdient; unter dem Dreifachen ist wenig Luft. Und der Liquiditätsgrad zeigt, ob das kurzfristige Vermögen die kurzfristigen Schulden deckt. Der Rechner weist alle vier zusammen aus, weil erst ihr Zusammenspiel ein Bild ergibt.",
    ],
    faq: [
      {
        question: "Was ist eine gute Eigenkapitalquote?",
        answer:
          "Ab 40 Prozent gilt sie als solide, unter 25 Prozent als dünn – jeweils bezogen auf Industrie, Handel und Dienstleistung. Banken arbeiten mit 5 bis 10 Prozent, Immobiliengesellschaften mit 25 bis 40, und beides ist branchenüblich. Aussagekräftiger als der absolute Wert ist die Entwicklung über mehrere Jahre: Eine fallende Quote bei gleichzeitig steigenden Schulden ist ein deutlicheres Signal als eine niedrige, aber stabile Quote.",
      },
      {
        question: "Was ist der Unterschied zwischen Eigenkapitalquote und Verschuldungsgrad?",
        answer:
          "Die Eigenkapitalquote misst das Eigenkapital an der Bilanzsumme, also am gesamten Vermögen. Der Verschuldungsgrad – auch Gearing – setzt die Nettofinanzschulden ins Verhältnis zum Eigenkapital und lässt Posten wie Lieferantenverbindlichkeiten und Rückstellungen außen vor. Er ist damit näher an der Frage, wie viel zinstragende Schuld auf dem Eigenkapital lastet. Ein negativer Verschuldungsgrad bedeutet Netto-Liquidität: mehr Geld in der Kasse als Schulden in der Bilanz.",
      },
      {
        question: "Warum ist eine hohe Eigenkapitalquote nicht immer besser?",
        answer:
          "Weil Eigenkapital teurer ist als Fremdkapital. Aktionäre erwarten eine höhere Rendite als Banken Zinsen verlangen, und Zinsen sind zusätzlich steuerlich abziehbar. Ein Unternehmen mit 80 Prozent Eigenkapitalquote und niedriger Kapitalrendite arbeitet ineffizient – es könnte einen Teil des Kapitals ausschütten oder investieren. Die Kunst liegt in der Balance: genug Puffer für schlechte Jahre, aber kein ungenutztes Kapital in der Bilanz.",
      },
    ],
  },
];
