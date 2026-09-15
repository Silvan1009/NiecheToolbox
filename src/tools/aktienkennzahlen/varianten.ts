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

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "kgv" },
    slug: "kgv-berechnen",
    title: "KGV berechnen: Rechner für das Kurs-Gewinn-Verhältnis",
    description:
      "Kurs geteilt durch Gewinn je Aktie – mit Einordnung, Gewinnrendite, PEG und fairem Wert. Alle Kennzahlen aus einem Geschäftsbericht auf einmal.",
    heading: "KGV berechnen",
    about: [
      "Das Kurs-Gewinn-Verhältnis ist die bekannteste Bewertungskennzahl und die am häufigsten falsch gelesene. Sie teilt den Kurs durch den Gewinn je Aktie: Bei 68 Euro Kurs und 3,58 Euro Gewinn je Aktie ergibt das ein KGV von 19. Anders gesagt: Wer das Unternehmen zu diesem Preis komplett kauft, hat den Kaufpreis nach neunzehn Jahren verdient – vorausgesetzt, der Gewinn bleibt konstant. Genau diese Voraussetzung trifft praktisch nie zu, und deshalb sagt ein KGV allein noch nichts über günstig oder teuer.",
      "Wichtig ist, welchen Gewinn man einsetzt. Das KGV auf den Gewinn des abgelaufenen Geschäftsjahres nennt man nachlaufend, das auf die Schätzung für das laufende oder kommende Jahr vorlaufend. Beide Zahlen können weit auseinanderliegen: Ein zyklisches Unternehmen im Abschwung hat ein optisch niedriges nachlaufendes und ein hohes vorlaufendes KGV, bei einem Wachstumsunternehmen ist es umgekehrt. Wer zwei Aktien vergleicht, muss dieselbe Variante verwenden – sonst vergleicht er zwei verschiedene Dinge. Der Rechner nimmt den Gewinn, den du eintippst; für ein vorlaufendes KGV also die Schätzung eintragen.",
      "Ein KGV wird erst durch drei Zusatzinformationen aussagekräftig: das Wachstum, die Verschuldung und die Gewinnqualität. Das Wachstum steckt im PEG-Verhältnis – ein KGV von 30 bei 30 Prozent Wachstum entspricht rechnerisch einem KGV von 10 bei 10 Prozent. Die Verschuldung fällt aus dem KGV komplett heraus, weshalb zwei Unternehmen mit identischem KGV sehr unterschiedlich teuer sein können; das zeigt erst EV/EBITDA. Und die Gewinnqualität sagt, ob der Gewinn im Nenner überhaupt als Geld eingegangen ist. Der Rechner weist alle drei mit aus, damit das KGV nicht allein dasteht.",
      "Für ganze Indizes wird häufig das Shiller-KGV zitiert, benannt nach dem Ökonomen Robert Shiller: Es teilt den Kurs nicht durch den Gewinn eines einzigen Jahres, sondern durch den inflationsbereinigten Durchschnittsgewinn der letzten zehn Jahre. Der Grund ist derselbe wie bei einer einzelnen Aktie in einem zyklischen Geschäft – ein einzelnes Rekordjahr oder ein einzelnes Krisenjahr verzerrt das gewöhnliche KGV in die eine oder andere Richtung. Über zehn Jahre gemittelt gleichen sich Boom- und Rezessionsjahre aus, und die Kennzahl wird vergleichbarer über die Zeit. Für ein einzelnes Unternehmen lässt sich dasselbe Prinzip anwenden: Wer den Gewinn der letzten drei bis fünf Jahre mittelt statt nur das letzte Jahr zu nehmen, bekommt ein KGV, das weniger an einem einzelnen guten oder schlechten Geschäftsjahr hängt.",
    ],
    faq: [
      {
        question: "Ändert ein Aktienrückkauf das KGV?",
        answer:
          "Ja, und zwar ohne dass sich am operativen Geschäft etwas ändert. Kauft ein Unternehmen eigene Aktien zurück und zieht sie ein, sinkt die Zahl der ausstehenden Aktien – derselbe Gesamtgewinn verteilt sich auf weniger Anteile, der Gewinn je Aktie steigt, und bei gleichbleibendem Kurs sinkt das KGV rein rechnerisch. Große, dauerhafte Rückkaufprogramme sind deshalb ein Grund, warum das KGV eines Unternehmens über Jahre fällt, obwohl der Gewinn in Summe stagniert. Wichtig ist der Unterschied zur Dividende: Beide geben Geld an Aktionäre zurück, aber nur der Rückkauf verändert die Kennzahl je Aktie unmittelbar.",
      },
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
      {
        question: "Warum unterscheiden sich KGVs zwischen Ländern und Börsenplätzen?",
        answer:
          "Weil das durchschnittliche KGV eines Marktes auch dessen Zinsniveau, Wachstumserwartung und Risikoeinschätzung widerspiegelt. US-Aktien werden historisch mit höheren KGVs gehandelt als europäische, unter anderem weil der US-Markt einen größeren Anteil wachstumsstarker Technologieunternehmen enthält und Anleger dort traditionell bereit sind, mehr für künftiges Wachstum zu zahlen. Schwellenländer werden oft mit niedrigeren KGVs gehandelt, weil Anleger dort einen Risikoabschlag für politische Unsicherheit, schwächere Rechtsstaatlichkeit oder Währungsrisiken verlangen. Ein KGV-Vergleich über Ländergrenzen hinweg sollte diese strukturellen Unterschiede deshalb immer mitdenken, statt eine einzelne Aktie unmittelbar gegen den Marktdurchschnitt eines anderen Landes zu stellen.",
      },
      {
        question: "Welche KGV-Variante nutzen professionelle Analysten am häufigsten?",
        answer:
          "Meist das vorlaufende KGV auf Basis der Konsensschätzung für den Gewinn der kommenden zwölf Monate, weil es die Markteinschätzung der nahen Zukunft abbildet statt der bereits bekannten Vergangenheit. Für langfristige Bewertungsvergleiche über einen ganzen Konjunkturzyklus hinweg wird dagegen oft ein über mehrere Jahre geglättetes KGV bevorzugt, das einzelne außergewöhnlich gute oder schlechte Jahre nicht überproportional gewichtet.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "kbv" },
    slug: "kurs-buchwert-verhaeltnis",
    title: "Kurs-Buchwert-Verhältnis berechnen (KBV-Rechner)",
    description:
      "Kurs geteilt durch Buchwert je Aktie – mit Eigenkapitalrendite, Eigenkapitalquote und Graham-Zahl. Warum ein KBV unter 1 kein Schnäppchen sein muss.",
    heading: "Kurs-Buchwert-Verhältnis berechnen",
    about: [
      "Das Kurs-Buchwert-Verhältnis setzt den Kurs ins Verhältnis zum bilanziellen Eigenkapital je Aktie. Bei 2.600 Millionen Euro Eigenkapital und 120 Millionen Aktien beträgt der Buchwert 21,67 Euro je Aktie; bei einem Kurs von 68 Euro ergibt das ein KBV von 3,1. Der Markt zahlt also gut drei Euro für einen Euro bilanzielles Eigenkapital. Der Buchwert ist dabei eine Bilanzgröße und kein Verkaufswert: Grundstücke stehen oft mit historischen Anschaffungskosten drin, selbst entwickelte Marken und Software überhaupt nicht.",
      "Ein KBV unter 1 heißt, dass die Börse das Unternehmen unter seinem bilanziellen Eigenkapital handelt. Das klingt nach einem Schnäppchen und ist meistens keins: Der Markt erwartet in diesen Fällen entweder weitere Verluste, die das Eigenkapital aufzehren, oder er traut den Bilanzwerten nicht – etwa bei Immobilien, die zu optimistisch bewertet sind, oder bei Firmenwerten aus teuren Übernahmen, die noch abgeschrieben werden müssen. Bei Banken ist ein KBV unter 1 seit der Finanzkrise über lange Strecken der Normalzustand gewesen.",
      "Das KBV lässt sich nur zusammen mit der Eigenkapitalrendite lesen. Beide zusammen ergeben eine einfache Probe: Ein Unternehmen, das 20 Prozent auf sein Eigenkapital verdient, ist einen Aufschlag wert; eines mit 5 Prozent nicht. Genau deshalb ist ein KBV von 3 bei 18 Prozent Eigenkapitalrendite unauffällig, dasselbe KBV bei 6 Prozent aber teuer. Der Rechner weist beide Kennzahlen nebeneinander aus und weist ausdrücklich darauf hin, wenn ein hoher Buchwertaufschlag auf eine schwache Eigenkapitalrendite trifft.",
      "Historisch stammt das KBV aus der Value-Investing-Schule von Benjamin Graham, der in den 1930er-Jahren nach Aktien suchte, die unter ihrem Netto-Umlaufvermögen notierten – damals nach den Verwerfungen der Weltwirtschaftskrise keine Seltenheit. Seitdem hat sich die Wirtschaft strukturell verschoben: Ein wachsender Anteil des Unternehmenswerts steckt in immateriellen Dingen wie Marken, Patenten, Software und Kundenbeziehungen, die nach den Bilanzierungsregeln oft gar nicht oder nur zu einem Bruchteil ihres tatsächlichen Werts aktiviert werden dürfen. Das erklärt, warum das KBV als Bewertungsmaßstab für den breiten Markt seit Jahrzehnten strukturell steigt, ohne dass die Aktien im selben Maß teurer geworden wären – der Buchwert wächst einfach langsamer als der wirtschaftliche Wert vieler Geschäftsmodelle.",
    ],
    faq: [
      {
        question: "Warum haben Technologieunternehmen fast immer ein hohes KBV?",
        answer:
          "Weil ihr wertvollstes Vermögen in der Bilanz kaum auftaucht. Software, Markenwert, ein Netzwerk aus Kundenbeziehungen oder ein Patentportfolio werden nach den Bilanzierungsregeln meist nicht oder nur zu den historischen Entwicklungskosten aktiviert – oft ein Bruchteil dessen, was sie wirtschaftlich wert sind. Ein Unternehmen mit wenig Sachanlagen, aber hohem Marktwert bekommt dadurch praktisch zwangsläufig ein hohes KBV, unabhängig davon, ob die Aktie teuer oder günstig ist. Für solche Geschäftsmodelle ist das KBV deshalb die am wenigsten aussagekräftige der klassischen Bewertungskennzahlen.",
      },
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
      {
        question: "Wer war Benjamin Graham?",
        answer:
          "Ein US-amerikanischer Ökonom und Investor, der in den 1930er-Jahren nach der Weltwirtschaftskrise die Grundlagen des Value Investing entwickelte und sie 1934 zusammen mit David Dodd im Standardwerk „Security Analysis“ veröffentlichte. Sein Kerngedanke war, den inneren Wert eines Unternehmens von dessen schwankendem Börsenkurs zu trennen und nur bei einem ausreichenden Sicherheitsabstand zwischen beiden zu kaufen. Graham lehrte an der Columbia University, wo unter anderem Warren Buffett zu seinen Studenten zählte, der die Prinzipien seines Lehrers später zu einer der erfolgreichsten Anlagestrategien der Börsengeschichte weiterentwickelte.",
      },
      {
        question: "Wie stark schwankt das KBV im Vergleich zum KGV über einen Konjunkturzyklus?",
        answer:
          "Meist deutlich weniger, weil der Buchwert eine Bestandsgröße ist und sich nur langsam verändert, während der Gewinn – die Grundlage des KGV – von Jahr zu Jahr stark schwanken kann. In einer Rezession bricht der Gewinn eines zyklischen Unternehmens oft ein oder wird sogar negativ, während das bilanzielle Eigenkapital sich nur allmählich abbaut. Deshalb bleibt das KBV in solchen Phasen oft die einzige noch sinnvoll interpretierbare klassische Bewertungskennzahl, während das KGV zeitweise gar nicht bildbar ist.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "kuv" },
    slug: "kurs-umsatz-verhaeltnis",
    title: "Kurs-Umsatz-Verhältnis berechnen (KUV-Rechner)",
    description:
      "Börsenwert geteilt durch Umsatz – die Kennzahl für Unternehmen ohne Gewinn. Mit Margen, EV/Umsatz und allen weiteren Kennzahlen.",
    heading: "Kurs-Umsatz-Verhältnis berechnen",
    about: [
      "Das Kurs-Umsatz-Verhältnis teilt den Börsenwert durch den Jahresumsatz. Bei 8.160 Millionen Euro Börsenwert und 4.800 Millionen Euro Umsatz ergibt das 1,7. Der große Vorteil: Umsatz gibt es immer, auch in einem Verlustjahr, und er lässt sich bilanziell weniger gestalten als ein Gewinn. Damit ist das KUV die einzige klassische Bewertungskennzahl, die bei jungen oder vorübergehend defizitären Unternehmen überhaupt funktioniert.",
      "Der große Nachteil folgt unmittelbar: Umsatz sagt nichts darüber, ob am Ende Geld verdient wird. Ein Lebensmittelhändler mit 2 Prozent Nettomarge und ein Softwarehaus mit 25 Prozent haben grundverschiedene Umsatzqualität – dass beide bei einem KUV von 1,7 gleich teuer wären, ist offensichtlich falsch. Deshalb gehört zum KUV immer der Blick auf die Marge. Als Näherung: Bei sonst gleichen Annahmen darf das KUV etwa so hoch sein wie die Nettomarge in Prozent, geteilt durch die Gewinnrendite, die man erwartet.",
      "Sauberer als das KUV ist EV/Umsatz, weil dort auch die Schulden eingerechnet sind. Ein Unternehmen mit 8 Milliarden Börsenwert und 1 Milliarde Nettoschulden kostet als Ganzes 9 Milliarden – wer den Umsatz kauft, übernimmt die Schulden mit. Bei Übernahmen wird deshalb fast immer in EV-Vielfachen gerechnet und nicht im KUV. Der Rechner weist beide aus und zusätzlich die Margen, an denen sich zeigt, ob das Umsatzvielfache gerechtfertigt ist.",
      "Besonders verbreitet ist das KUV bei jungen, schnell wachsenden Unternehmen kurz nach dem Börsengang, weil dort oft noch kein aussagekräftiger Gewinn existiert, der Umsatz aber schon zweistellig pro Jahr wächst. In dieser Phase wird das KUV häufig zusammen mit der Wachstumsrate betrachtet, ähnlich wie das PEG-Verhältnis das KGV mit dem Gewinnwachstum kombiniert – ein KUV von 10 bei 60 Prozent Umsatzwachstum wird von vielen Investoren anders bewertet als dasselbe KUV bei 15 Prozent Wachstum. Die Kehrseite: Sobald das Wachstum sich verlangsamt, bevor eine tragfähige Marge erreicht ist, kollabieren solche KUV-Bewertungen oft binnen weniger Quartale, weil der Markt seine Wachstumserwartung neu justiert. Das KUV allein sagt nie, ob dieser Übergang gelingt.",
    ],
    faq: [
      {
        question: "Warum werden gerade Börsengänge oft über das KUV bewertet?",
        answer:
          "Weil viele frisch an die Börse gebrachte Unternehmen noch keinen stabilen Gewinn ausweisen – hohe Ausgaben für Wachstum, Marketing und Aufbau drücken das Ergebnis bewusst nach unten. Der Umsatz ist in dieser Phase die verlässlichere Messgröße, weil er unmittelbar zeigt, wie schnell das Geschäft tatsächlich wächst. Sobald ein Unternehmen reift und beständige Gewinne erzielt, wechselt der Markt in aller Regel zu gewinnbasierten Kennzahlen wie dem KGV – ein hohes KUV ist deshalb typischerweise eine Übergangserscheinung und kein Dauerzustand.",
      },
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
      {
        question: "Wie hat sich das KUV bei der Dotcom-Blase gezeigt?",
        answer:
          "Als Warnbeispiel: In den späten 1990er-Jahren wurden zahlreiche Internetunternehmen ohne jeden Gewinn allein über das Kurs-Umsatz-Verhältnis bewertet, weil andere Kennzahlen mangels Gewinn gar nicht anwendbar waren. Einige Aktien erreichten KUVs von 50 oder mehr, gestützt allein auf die Erwartung künftigen Wachstums. Als sich diese Wachstumserwartungen nach dem Platzen der Blase 2000 nicht erfüllten, brachen die Kurse um 80 bis 90 Prozent ein. Die Lehre daraus ist nicht, dass das KUV eine schlechte Kennzahl wäre, sondern dass ein hohes KUV ohne belastbaren Plan zur künftigen Profitabilität ein Warnsignal und kein Kaufargument ist.",
      },
      {
        question: "Wie unterscheidet sich das KUV zwischen Branchen mit unterschiedlichen Margen?",
        answer:
          "Sehr stark, weil das KUV die Gewinnspanne komplett ignoriert. Ein Lebensmitteleinzelhändler mit typischerweise 1 bis 3 Prozent Nettomarge wird selten über ein KUV von 0,5 gehandelt, weil aus jedem Umsatzeuro nur wenige Cent Gewinn werden. Ein Softwareunternehmen mit 20 bis 30 Prozent Nettomarge rechtfertigt dagegen ein deutlich höheres KUV, weil derselbe Umsatzeuro am Ende viel mehr Gewinn übrig lässt. Ein KUV-Vergleich ergibt deshalb nur innerhalb derselben oder einer margentechnisch ähnlichen Branche Sinn, niemals branchenübergreifend ohne Berücksichtigung der jeweiligen Gewinnspanne.",
      },
      {
        question: "Wie berechnet man den Börsenwert für das KUV?",
        answer:
          "Aktueller Kurs multipliziert mit der Anzahl aller ausstehenden Aktien, auch Marktkapitalisierung genannt. Bei 120 Millionen Aktien und einem Kurs von 68 Euro ergibt das die im Rechner verwendeten 8.160 Millionen Euro. Wichtig ist, alle ausstehenden Aktien einzurechnen, nicht nur die frei handelbaren im Streubesitz – bei Unternehmen mit größeren Ankeraktionären unterscheiden sich beide Zahlen teils deutlich.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "peg" },
    slug: "peg-ratio",
    title: "PEG-Ratio berechnen: KGV im Verhältnis zum Wachstum",
    description:
      "KGV geteilt durch das erwartete Gewinnwachstum. Mit Kursziel, erwarteter Rendite pro Jahr und allen weiteren Kennzahlen aus dem Geschäftsbericht.",
    heading: "PEG-Ratio berechnen",
    about: [
      "Das PEG-Verhältnis beantwortet die Frage, die ein KGV offen lässt: Ist die Bewertung durch Wachstum gedeckt? Gerechnet wird KGV geteilt durch das erwartete Gewinnwachstum in Prozent. Ein KGV von 19 bei 7 Prozent Wachstum ergibt ein PEG von 2,7. Die Idee dahinter, populär gemacht von Peter Lynch: Ein Unternehmen, das mit 30 Prozent wächst, darf ein KGV von 30 haben – dann liegt das PEG bei 1 und die Aktie ist rechnerisch genauso bewertet wie ein Unternehmen mit 10 Prozent Wachstum und KGV 10.",
      "Der Haken steckt im Nenner. Das Wachstum ist eine Schätzung, und zwar eine, die sich mit jedem Quartalsbericht ändert. Wer 15 statt 10 Prozent einträgt, senkt das PEG um ein Drittel, ohne dass sich am Unternehmen etwas geändert hätte. Deshalb ist das PEG keine Kennzahl, die man einmal ausrechnet, sondern eine, die man in einer Spanne betrachtet: Was ergibt sich bei vorsichtigen 5 Prozent, was bei optimistischen 12? Liegt das PEG in beiden Fällen unter 1,5, ist die Bewertung robust. Kippt es zwischen günstig und teuer, hängt die ganze Anlageentscheidung an einer Prognose.",
      "Zwei Einschränkungen sind wichtig. Erstens funktioniert das PEG nur bei positivem Gewinn und positivem Wachstum – bei stagnierenden oder schrumpfenden Ergebnissen ist es nicht bildbar, und der Rechner lässt es dann leer. Zweitens ignoriert es die Qualität des Wachstums: Ein Gewinnwachstum, das über Zukäufe auf Kredit entsteht, ist etwas anderes als eines aus dem laufenden Geschäft. Der Blick auf Verschuldung, Kapitalrendite und Gewinnqualität steht deshalb im Rechner direkt daneben.",
      "Eine Erweiterung, die manche Analysten verwenden, ist das PEGY-Verhältnis: Es addiert zum erwarteten Gewinnwachstum noch die Dividendenrendite, bevor durch das KGV geteilt wird. Der Gedanke dahinter ist, dass eine Aktie mit 3 Prozent Wachstum und 4 Prozent Dividendenrendite einer Anlegerin insgesamt eine ähnliche Wertsteigerung liefern kann wie eine Aktie mit 7 Prozent reinem Wachstum ohne Ausschüttung – nur dass ein Teil davon bar statt über den Kurs ankommt. Für reife, dividendenstarke Unternehmen mit wenig Wachstum liefert das PEGY oft ein realistischeres Bild als das reine PEG, das solche Aktien sonst systematisch als teuer erscheinen lässt, obwohl der Gesamtertrag aus Kurssteigerung und Dividende durchaus konkurrenzfähig ist.",
    ],
    faq: [
      {
        question: "Was ist das PEGY-Verhältnis?",
        answer:
          "Eine Erweiterung des PEG, die zusätzlich zur Wachstumsrate die Dividendenrendite berücksichtigt: KGV geteilt durch die Summe aus Wachstum und Dividendenrendite in Prozent. Bei einem KGV von 15, 3 Prozent Wachstum und 4 Prozent Dividendenrendite ergibt das ein PEGY von 2,1 statt eines PEG von 5, wenn nur das Wachstum gezählt würde. Sinnvoll ist das vor allem bei reifen, ausschüttungsstarken Unternehmen, für die das reine PEG systematisch zu pessimistisch ausfällt, weil es die Dividende als Teil der Rendite ignoriert.",
      },
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
      {
        question: "Wer hat das PEG-Verhältnis bekannt gemacht?",
        answer:
          "Populär gemacht hat es der US-Fondsmanager Peter Lynch, der von 1977 bis 1990 den Fidelity Magellan Fund leitete und in dieser Zeit eine der besten Erfolgsbilanzen der Fondsgeschichte erzielte. In seinem Buch „One Up on Wall Street“ beschrieb er das PEG als einfache Faustregel für private Anleger: Ein fair bewertetes Wachstumsunternehmen sollte ein KGV haben, das ungefähr seiner erwarteten Wachstumsrate entspricht, also ein PEG nahe 1. Lynch betonte dabei ausdrücklich, dass die Kennzahl eine grobe Orientierung sei und niemals eine gründliche Analyse des Geschäftsmodells und der Wettbewerbsposition ersetzen könne.",
      },
      {
        question: "Wie geht man mit sehr unsicheren Wachstumsschätzungen beim PEG um?",
        answer:
          "Am sinnvollsten mit einer bewusst konservativen Schätzung statt der optimistischsten verfügbaren Zahl. Analystenschätzungen für das Gewinnwachstum weichen zwischen verschiedenen Häusern oft erheblich voneinander ab, besonders bei jungen oder stark zyklischen Unternehmen. Wer bei der PEG-Berechnung die niedrigste plausible Wachstumsschätzung verwendet und die Aktie auch dann noch für vertretbar bewertet hält, hat einen größeren Sicherheitsabstand, als wenn nur mit der optimistischsten Prognose gerechnet wird. Ein PEG, das nur bei der höchsten verfügbaren Wachstumsannahme unter 1 fällt, sollte eher als Warnsignal denn als Kaufargument gelesen werden.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "dividendenrendite" },
    slug: "dividendenrendite-berechnen",
    title: "Dividendenrendite berechnen: Rechner mit Ausschüttungsquote",
    description:
      "Dividende je Aktie geteilt durch den Kurs – zusammen mit Ausschüttungsquote, freiem Cashflow und Verschuldung. So erkennst du, ob die Dividende sicher ist.",
    heading: "Dividendenrendite berechnen",
    about: [
      "Die Dividendenrendite ist die Dividende je Aktie geteilt durch den Kurs. Bei 1,40 Euro Dividende und 68 Euro Kurs sind das 2,1 Prozent. Sie ist die persönlichste aller Kennzahlen, weil sie vom eigenen Einstiegskurs abhängt: Wer die Aktie vor Jahren zu 40 Euro gekauft hat, erzielt auf seinen Einstand 3,5 Prozent, während ein neuer Käufer 2,1 Prozent bekommt. Beide Zahlen sind richtig, sie beantworten nur verschiedene Fragen – für eine Kaufentscheidung zählt die Rendite auf den aktuellen Kurs.",
      "Eine hohe Dividendenrendite ist kein Qualitätsmerkmal, sondern zuerst eine Beobachtung über den Kurs. Der Nenner ist der Kurs, und der fällt, wenn der Markt Probleme sieht. Renditen über 7 Prozent bedeuten in den meisten Fällen, dass eine Kürzung erwartet wird – die Dividende der Vergangenheit steht dann im Zähler, die Skepsis über die Zukunft im Nenner. Wer nach hoher Dividendenrendite sucht, findet deshalb systematisch die Unternehmen mit den größten Problemen. Der einzige Schutz dagegen ist der Blick auf die Deckung.",
      "Drei Zahlen sagen, ob eine Dividende tragfähig ist. Die Ausschüttungsquote setzt sie ins Verhältnis zum Gewinn – über 80 Prozent wird es eng. Der freie Cashflow je Aktie sagt, ob das Geld überhaupt vorhanden ist; er ist der härtere Maßstab, weil Dividenden aus Geld und nicht aus Buchgewinnen bezahlt werden. Und die Nettoschulden zeigen, ob die Ausschüttung womöglich aus Krediten finanziert wird. Der Rechner stellt alle drei neben die Rendite und warnt, wenn die Dividende den Gewinn übersteigt.",
      "Ein Begriff, der in diesem Zusammenhang oft fällt, ist der Dividendenaristokrat: ein Unternehmen, das seine Ausschüttung über einen sehr langen Zeitraum – in den USA meist über 25 Jahre in Folge – nicht gesenkt, sondern regelmäßig erhöht hat. Eine solche Historie ist kein Zufall, sondern das Ergebnis eines Geschäftsmodells, das auch durch Rezessionen hindurch stabile Erträge liefert, und einer Unternehmensführung, die diese Kontinuität als eigenen Wert behandelt. Die Kehrseite: Der Status als Dividendenaristokrat wird in vielen Aktienscreenern eingepreist, weshalb solche Titel oft mit einem Bewertungsaufschlag gehandelt werden. Eine lange Erhöhungsserie ist ein gutes Zeichen für die Qualität des Geschäfts, aber kein Freibrief dafür, jeden Preis zu zahlen.",
    ],
    faq: [
      {
        question: "Was ist ein Dividendenaristokrat?",
        answer:
          "Ein Unternehmen, das seine Dividende über einen langen, ununterbrochenen Zeitraum jedes Jahr erhöht hat – in den USA gilt üblicherweise eine Serie von mindestens 25 Jahren als Schwelle, in Europa wird die Kategorie wegen kürzerer verlässlicher Börsenhistorien oft großzügiger gefasst. Die lange Serie ist ein Indikator für ein robustes, planbares Geschäftsmodell, weil sie auch Rezessionen und Branchenkrisen überstanden haben muss. Sie ist aber kein Kaufsignal für sich allein: Ausschüttungsquote, freier Cashflow und Verschuldung entscheiden weiterhin, ob die nächste Erhöhung tatsächlich tragfähig ist.",
      },
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
      {
        question: "Was ist eine Dividendenkürzung, und wie reagiert der Kurs darauf?",
        answer:
          "Eine Dividendenkürzung senkt die künftige Ausschüttung gegenüber dem Vorjahr, meist als Reaktion auf einen Gewinneinbruch, eine hohe Verschuldung oder eine bewusste Kurskorrektur der Unternehmensführung. Der Markt reagiert darauf häufig überproportional stark, weil eine Kürzung nicht nur weniger Bargeld bedeutet, sondern auch als Eingeständnis gelesen wird, dass die Geschäftsleitung selbst nicht mehr an eine schnelle Erholung glaubt – der Kurs kann deshalb stärker fallen, als der reine Wegfall der Dividendensumme rechnerisch erklären würde. Eine angekündigte Kürzung ist ein deutlich stärkeres Warnsignal als eine unveränderte, aber ausbleibende Erhöhung, die vom Markt meist gelassener aufgenommen wird.",
      },
      {
        question: "Was ist der Ex-Dividende-Tag?",
        answer:
          "Der Tag, ab dem eine Aktie ohne Anspruch auf die zuletzt beschlossene Dividende gehandelt wird. Wer die Aktie an diesem Tag oder danach kauft, bekommt die anstehende Ausschüttung nicht mehr, sie steht nur noch dem zu, der die Aktie am Vortag im Depot hatte. Am Ex-Tag selbst sinkt der Kurs rein rechnerisch um ungefähr den Betrag der Dividende, weil dem Unternehmen dieses Geld künftig fehlt – dieser Effekt wird häufig mit einer echten Kursbewegung verwechselt, obwohl er lediglich die Vorwegnahme der ausgezahlten Summe ist und keine Aussage über die Geschäftsentwicklung trifft.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "ausschuettungsquote" },
    slug: "ausschuettungsquote-berechnen",
    title: "Ausschüttungsquote berechnen: Ist die Dividende gedeckt?",
    description:
      "Dividende je Aktie geteilt durch den Gewinn je Aktie – mit freiem Cashflow, Verschuldung und Dividendenrendite. Der Test, ob eine Dividende trägt.",
    heading: "Ausschüttungsquote berechnen",
    about: [
      "Die Ausschüttungsquote sagt, welcher Teil des Gewinns an die Aktionäre geht. Bei 1,40 Euro Dividende und 3,58 Euro Gewinn je Aktie sind das 39 Prozent – die restlichen 61 Prozent bleiben im Unternehmen und finanzieren Investitionen, Zukäufe oder Schuldenabbau. Diese Aufteilung ist eine der wichtigsten Entscheidungen einer Unternehmensführung: Jeder ausgeschüttete Euro fehlt für das Wachstum, jeder einbehaltene Euro muss besser angelegt werden als beim Aktionär selbst.",
      "Als gesund gelten 30 bis 60 Prozent. Darunter ist die Dividende sehr sicher, aber auch nachrangig – typisch für Unternehmen, die viel Kapital ins eigene Wachstum stecken. Über 80 Prozent wird es eng: Ein Gewinnrückgang von einem Fünftel würde die Dividende schon nicht mehr decken. Über 100 Prozent wird mehr ausgeschüttet als verdient, und das lässt sich nur eine begrenzte Zeit aus der Kasse oder über Kredite finanzieren. Historisch folgen Dividendenkürzungen fast immer auf mehrere Jahre mit Quoten über 100 Prozent.",
      "Die Quote auf den Gewinn ist allerdings nur die halbe Prüfung. Bezahlt wird die Dividende aus Geld, und Gewinn ist keins: Ein Unternehmen kann 400 Millionen Euro Gewinn ausweisen und trotzdem keinen freien Cashflow haben, wenn die Investitionen den operativen Cashflow aufzehren. Deshalb lohnt zusätzlich der Vergleich der Dividende mit dem freien Cashflow je Aktie. Der Rechner weist beide Größen aus und warnt, wenn die Ausschüttung über 80 Prozent des Gewinns liegt oder der freie Cashflow negativ ist.",
      "Eine niedrige oder gar keine Ausschüttungsquote ist nicht automatisch ein schlechtes Zeichen – sie kann Ausdruck einer bewussten Kapitalallokation sein. Amazon zahlte über weite Strecken seiner Börsengeschichte keinerlei Dividende und steckte jeden verfügbaren Euro in Logistiknetze und neue Geschäftsfelder, was Aktionären über Kurssteigerung deutlich mehr brachte als eine Ausschüttung es je hätte können. Umgekehrt zahlen viele Versorger und Telekomunternehmen konstant hohe Quoten, weil ihnen kaum noch renditestarke Wachstumsprojekte offenstehen und das Geld bei den Aktionären besser aufgehoben ist als in der eigenen Bilanz. Die richtige Quote hängt deshalb weniger von einer allgemeinen Norm ab als davon, ob die Unternehmensführung intern eine höhere Rendite erzielen kann, als Aktionäre für ihr eigenes Kapital anderswo bekämen.",
    ],
    faq: [
      {
        question: "Warum zahlen manche profitable Unternehmen keine Dividende?",
        answer:
          "Weil das Management der Ansicht ist, jeden Euro besser im eigenen Geschäft reinvestieren zu können als ihn auszuschütten. Ein junges oder stark wachsendes Unternehmen mit vielen renditestarken Projekten – neue Standorte, Produktentwicklung, Übernahmen – schafft mit einbehaltenem Kapital oft mehr Wert als eine Dividende es könnte, die Aktionäre anschließend versteuern und selbst wieder anlegen müssten. Diese Logik kippt, sobald das Wachstum nachlässt: Reife Unternehmen ohne ausreichend gute interne Projekte schütten typischerweise einen wachsenden Teil ihres Gewinns aus, weil dort für das Geld intern kein besserer Zweck mehr bleibt.",
      },
      {
        question: "Was ist eine gute Ausschüttungsquote?",
        answer:
          "30 bis 60 Prozent gelten als gesund: genug für eine verlässliche Dividende, genug für Investitionen. Reife Unternehmen mit stabilen Erträgen – Versorger, Versicherer, Konsumgüterhersteller – liegen häufig bei 50 bis 70 Prozent, Wachstumsunternehmen bei 0 bis 20. Eine Quote von null ist kein Mangel: Wer sein Kapital mit 20 Prozent Rendite reinvestieren kann, sollte es nicht ausschütten.",
      },
      {
        question:
          "Kann eine Ausschüttungsquote über 100 Prozent gerechtfertigt sein?",
        answer:
          "Vorübergehend ja. Nach einem Jahr mit hohen Abschreibungen oder Sonderaufwendungen ist der ausgewiesene Gewinn niedrig, während das Geld weiterhin hereinkommt – die Dividende aus dem freien Cashflow zu zahlen ist dann vertretbar. Manche Unternehmen halten ihre Dividende bewusst stabil und nehmen einzelne Jahre über 100 Prozent in Kauf. Dauerhaft geht es nicht: Irgendwann sind Kasse und Kreditlinien aufgebraucht.",
      },
      {
        question: "Wie erkenne ich eine gefährdete Dividende?",
        answer:
          "An drei Signalen zusammen: einer Ausschüttungsquote über 80 Prozent, einer Dividende über dem freien Cashflow und steigenden Nettoschulden. Kommt eine ungewöhnlich hohe Dividendenrendite hinzu, hat der Markt die Kürzung meist schon eingepreist. Der Rechner zeigt alle vier Größen auf einer Seite, damit dieses Muster sichtbar wird.",
      },
      {
        question: "Berücksichtigt die Ausschüttungsquote auch Aktienrückkäufe?",
        answer:
          "Die klassische Ausschüttungsquote nicht – sie setzt allein die Bardividende ins Verhältnis zum Gewinn. Viele Unternehmen, besonders in den USA, geben aber einen erheblichen Teil ihres Gewinns über Aktienrückkäufe statt über Dividenden an Aktionäre zurück. Wer die vollständige Kapitalrückgabe beurteilen will, addiert deshalb Dividendensumme und Rückkaufsumme und setzt beides gemeinsam ins Verhältnis zum Gewinn – als Gesamtausschüttungsquote. Ein Unternehmen mit niedriger klassischer Ausschüttungsquote kann auf diese Weise trotzdem einen Großteil seines Gewinns an Aktionäre zurückgeben, nur eben nicht in bar auf das Konto, sondern über einen tendenziell steigenden Gewinn je verbleibender Aktie.",
      },
      {
        question: "Wie verändert sich die Ausschüttungsquote über den Lebenszyklus eines Unternehmens?",
        answer:
          "Typischerweise steigt sie mit zunehmender Reife. Ein junges Wachstumsunternehmen investiert fast den gesamten Gewinn zurück ins eigene Geschäft und schüttet wenig bis nichts aus, weil interne Projekte höhere Renditen versprechen als eine Bardividende. Mit nachlassendem Wachstumstempo und sinkendem Bedarf an neuem Kapital steigt die Quote schrittweise, bis reife Unternehmen mit begrenzten Wachstumschancen oft 50 bis 80 Prozent ihres Gewinns ausschütten. Ein plötzlicher, untypischer Anstieg der Quote bei einem eigentlich noch wachstumsstarken Unternehmen kann deshalb ein Hinweis darauf sein, dass die internen Wachstumschancen bereits nachlassen, auch wenn das noch nicht offen kommuniziert wird.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "roe" },
    slug: "eigenkapitalrendite-berechnen",
    title: "Eigenkapitalrendite berechnen (ROE-Rechner)",
    description:
      "Jahresüberschuss geteilt durch Eigenkapital – zusammen mit Eigenkapitalquote, Kapitalrendite und KBV. So erkennst du, ob eine hohe Rendite von Schulden kommt.",
    heading: "Eigenkapitalrendite berechnen",
    about: [
      "Die Eigenkapitalrendite zeigt, was das Kapital der Aktionäre im Jahr verdient. Bei 430 Millionen Euro Gewinn und 2.600 Millionen Euro Eigenkapital sind das 16,5 Prozent. Sie ist die zentrale Kennzahl für die Qualität eines Geschäfts: Ein Unternehmen, das über Jahre 20 Prozent auf sein Eigenkapital verdient und diese Gewinne zu ähnlichen Renditen wieder anlegen kann, verdoppelt seinen inneren Wert etwa alle vier Jahre. Genau darauf beruht der Zinseszinseffekt bei Aktien.",
      "Die Kennzahl hat einen eingebauten Fehler, den man kennen muss: Sie lässt sich durch Schulden verbessern. Wer das Eigenkapital halbiert und den Rest über Kredite finanziert, verdoppelt die Eigenkapitalrendite, ohne dass das Geschäft besser geworden wäre – das Risiko ist nur gestiegen. Ein Unternehmen mit 25 Prozent Eigenkapitalrendite und 15 Prozent Eigenkapitalquote ist deshalb nicht besser als eines mit 15 Prozent Rendite und 50 Prozent Quote. Aktienrückkäufe wirken in dieselbe Richtung, weil sie das Eigenkapital verringern.",
      "Deshalb gehört zur Eigenkapitalrendite immer ein zweiter Blick: auf die Eigenkapitalquote und auf die Kapitalrendite ROCE, die das gesamte eingesetzte Kapital einbezieht und sich nicht durch Verschuldung aufpolieren lässt. Liegen ROE und ROCE nah beieinander, stammt die Rendite aus dem Geschäft; klaffen sie weit auseinander, aus der Bilanzstruktur. Und wenn eine dauerhaft hohe Eigenkapitalrendite auf ein niedriges Kurs-Buchwert-Verhältnis trifft, ist das eine der wenigen Konstellationen, die einen genaueren Blick wirklich lohnen.",
      "Die drei Stellhebel der Eigenkapitalrendite lassen sich formal trennen – bekannt als DuPont-Analyse, benannt nach dem US-Chemiekonzern, der das Verfahren in den 1920er-Jahren einführte. Sie zerlegt die Eigenkapitalrendite in Nettomarge mal Kapitalumschlag mal Verschuldungsfaktor: wie viel je Umsatzeuro hängen bleibt, wie oft sich das eingesetzte Kapital im Jahr über den Umsatz umschlägt, und wie stark Fremdkapital die Eigenkapitalbasis hebelt. Zwei Unternehmen mit identischer Eigenkapitalrendite können dabei völlig verschieden aufgebaut sein: Ein Lebensmittelhändler erreicht seine Rendite über hohen Umschlag bei winziger Marge, ein Luxusgüterhersteller über hohe Marge bei niedrigem Umschlag. Erst diese Zerlegung zeigt, welcher der drei Hebel im Einzelfall die Rendite trägt – und ob er sich auch in einer schlechteren Konjunktur halten lässt.",
    ],
    faq: [
      {
        question: "Was ist die DuPont-Analyse?",
        answer:
          "Ein Verfahren, das die Eigenkapitalrendite in drei Bestandteile zerlegt: die Nettomarge (Gewinn je Umsatzeuro), den Kapitalumschlag (Umsatz je eingesetztem Euro Vermögen) und den Verschuldungsfaktor (Bilanzsumme je Euro Eigenkapital). Multipliziert ergeben die drei wieder die Eigenkapitalrendite – der Nutzen liegt darin, sichtbar zu machen, woher eine hohe Rendite tatsächlich kommt. Eine Rendite, die vor allem aus dem Verschuldungsfaktor stammt, ist empfindlicher gegenüber steigenden Zinsen und einer Kreditverknappung als eine, die aus einer starken Marge oder einem schnellen Kapitalumschlag kommt.",
      },
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
        question:
          "Warum wird bei negativem Eigenkapital keine Rendite ausgewiesen?",
        answer:
          "Weil das Ergebnis sinnlos wäre. Ein Gewinn von 100 bei einem Eigenkapital von minus 200 ergäbe minus 50 Prozent – eine Zahl, die weder Verlust noch Rendite bedeutet. Negatives Eigenkapital entsteht nach langen Verlustserien oder nach sehr großen Aktienrückkäufen und ist immer ein Anlass, sich die Verschuldung genau anzusehen. Der Rechner lässt ROE, KBV und Verschuldungsgrad in diesem Fall leer und weist im Hinweisblock darauf hin.",
      },
      {
        question: "Warum ist eine sehr hohe Eigenkapitalrendite manchmal verdächtig?",
        answer:
          "Weil sie außer aus operativer Stärke auch aus einer ungewöhnlich dünnen Eigenkapitalbasis stammen kann – etwa nach jahrelangen, aggressiven Aktienrückkäufen, die das Eigenkapital immer weiter schrumpfen lassen, während der absolute Gewinn kaum noch wächst. Ein Unternehmen mit 40 Prozent Eigenkapitalrendite, aber einer Eigenkapitalquote von nur 5 Prozent, trägt ein deutlich höheres Risiko als eines mit 20 Prozent Rendite und 40 Prozent Eigenkapitalquote, selbst wenn die reine Renditezahl beeindruckender aussieht. Wer eine hohe Eigenkapitalrendite sieht, sollte deshalb reflexartig nachschauen, wie dünn das Eigenkapital dahinter tatsächlich ist.",
      },
      {
        question: "Wie beeinflussen Sonderposten die Eigenkapitalrendite in einzelnen Jahren?",
        answer:
          "Erheblich, und oft irreführend. Ein einmaliger Buchgewinn aus dem Verkauf einer Sparte oder eine große Wertaufholung kann den Gewinn eines einzelnen Jahres stark nach oben verzerren und damit eine Eigenkapitalrendite zeigen, die im Folgejahr ohne diesen Sondereffekt deutlich niedriger ausfällt. Umgekehrt drückt eine einmalige Abschreibung oder eine Rechtsstreit-Rückstellung den Gewinn und damit die Rendite eines Jahres künstlich nach unten, obwohl das laufende Geschäft unverändert stabil läuft. Für ein belastbares Bild lohnt sich deshalb der Blick auf die bereinigte Eigenkapitalrendite über mehrere Jahre, statt sich auf den Wert eines einzelnen, möglicherweise durch Sonderposten verzerrten Geschäftsjahres zu verlassen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "evEbitda" },
    slug: "ev-ebitda-berechnen",
    title: "EV/EBITDA berechnen: Unternehmenswert zum operativen Ergebnis",
    description:
      "Börsenwert plus Nettoschulden, geteilt durch das EBITDA – die Kennzahl, mit der ganze Unternehmen bewertet werden. Mit EV/EBIT, EV/Umsatz und Verschuldung.",
    heading: "EV/EBITDA berechnen",
    about: [
      "EV/EBITDA setzt den Unternehmenswert ins Verhältnis zum operativen Ergebnis vor Abschreibungen. Der Unternehmenswert – Enterprise Value – ist der Börsenwert plus die Nettoschulden: 8.160 Millionen Euro Börsenwert plus 1.020 Millionen Euro Nettoschulden ergeben 9.180 Millionen Euro. Geteilt durch 900 Millionen Euro EBITDA sind das 10,2. Das ist der Preis für das gesamte Unternehmen, nicht nur für den Eigenkapitalanteil – so rechnet jeder, der eine Firma tatsächlich kaufen würde.",
      "Der Vorteil gegenüber dem KGV liegt in der Unabhängigkeit von der Finanzierung. Zwei Unternehmen mit identischem operativem Geschäft, aber unterschiedlicher Verschuldung haben verschiedene KGVs – das höher verschuldete zahlt mehr Zinsen und weist weniger Gewinn aus. Im EV/EBITDA verschwindet dieser Unterschied, weil sowohl der Zähler die Schulden enthält als auch der Nenner vor Zinsen gemessen wird. Auch Steuersätze und Abschreibungsregeln verschiedener Länder fallen heraus, weshalb die Kennzahl bei internationalen Vergleichen und bei Übernahmen Standard ist.",
      "Die Schwäche ist dieselbe wie beim EBITDA selbst: Abschreibungen auszublenden heißt, den Verschleiß auszublenden. Für ein Telekomunternehmen, das jedes Jahr Milliarden in Netze investieren muss, ist das EBITDA eine schöngerechnete Größe – Warren Buffett hat es deshalb wiederholt als irreführend bezeichnet. Bei kapitalintensiven Geschäften ist EV/EBIT die fairere Kennzahl, weil das EBIT nach Abschreibungen gemessen wird. Der Rechner weist beide aus, dazu EV/Umsatz und die Verschuldung, aus der der Unternehmenswert entsteht.",
      "In der Praxis der Unternehmensbewertung ist EV/EBITDA das Standardvielfache bei Übernahmen und Private-Equity-Transaktionen, gerade weil es Kapitalstruktur und Steuersätze aus dem Vergleich herausrechnet – ein Käufer, der ein Unternehmen komplett übernimmt, kann die Finanzierung ohnehin nach dem Kauf neu ordnen, und die bisherige Verschuldung ist für den Preisvergleich zwischen Zielunternehmen deshalb zweitrangig. Analysten bilden aus vergleichbaren, bereits abgeschlossenen Transaktionen in derselben Branche einen typischen EV/EBITDA-Bereich und legen ihn als Richtwert für ein neues Bewertungsziel an – ein Verfahren, das als Comparable-Transactions-Analyse bekannt ist. Für Privatanleger ist das vor allem als Kontext nützlich: Wird ein Börsenunternehmen deutlich unter dem Niveau vergleichbarer Übernahmen gehandelt, gilt es manchen Marktteilnehmern als potenzielles Übernahmeziel.",
    ],
    faq: [
      {
        question: "Warum ist EV/EBITDA bei Firmenübernahmen die Standardkennzahl?",
        answer:
          "Weil ein Käufer, der ein ganzes Unternehmen erwirbt, sowohl den Eigenkapital- als auch den Fremdkapitalanteil übernimmt und die Finanzierung danach frei neu ordnen kann – die bisherige Kapitalstruktur des Zielunternehmens ist für den fairen Preis deshalb nachrangig. EV/EBITDA rechnet Schulden und liquide Mittel bereits in den Unternehmenswert ein und ist zudem unabhängig von Steuersätzen und Abschreibungspraktiken, die sich zwischen Ländern und Bilanzierungsstandards unterscheiden. Käufer und Verkäufer verständigen sich deshalb in Verhandlungen meist zuerst auf ein EV/EBITDA-Vielfaches und leiten daraus erst den Kaufpreis je Aktie ab, nicht umgekehrt.",
      },
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
        question:
          "Warum kann der Unternehmenswert unter dem Börsenwert liegen?",
        answer:
          "Weil die Nettoschulden negativ sein können. Liegt mehr Geld in der Kasse als Schulden in der Bilanz, ist der Unternehmenswert kleiner als der Börsenwert – der Käufer bekommt die Kasse mit und muss faktisch weniger für das Geschäft zahlen. Bei sehr großen Kassenbeständen kann der Unternehmenswert sogar negativ werden; dann lässt sich kein sinnvolles Vielfaches bilden und der Rechner weist die EV-Kennzahlen nicht aus.",
      },
      {
        question: "Wie wird EV/EBITDA in Analystenberichten typischerweise genutzt?",
        answer:
          "Analysten bilden aus einer Gruppe vergleichbarer Unternehmen derselben Branche einen typischen EV/EBITDA-Bereich und legen ihn als Zielwert für das eigene Bewertungsmodell an – ein Verfahren, das als Comparable-Company-Analyse bekannt ist. Notiert eine Aktie deutlich unter diesem Branchenbereich, gilt sie manchen Analysten als unterbewertet, sofern kein struktureller Grund wie eine schwächere Wachstumsaussicht oder ein höheres Risiko dagegenspricht. Notiert sie deutlich darüber, wird oft ein besonderer Vertrauensvorschuss des Marktes unterstellt, etwa wegen einer Marktführerschaft oder eines als besonders sicher geltenden Geschäftsmodells. Die Methode ersetzt keine tiefere Analyse, liefert aber einen schnellen ersten Anhaltspunkt.",
      },
      {
        question: "Warum unterscheidet sich EV/EBITDA je nach Kapitalintensität einer Branche?",
        answer:
          "Weil das EBITDA Abschreibungen ausblendet, die bei kapitalintensiven Geschäften wie Telekommunikation, Energieversorgung oder Industrieproduktion einen wesentlichen und wiederkehrenden Kostenblock darstellen. Solche Unternehmen werden deshalb oft mit niedrigeren EV/EBITDA-Vielfachen gehandelt als kapitalleichte Geschäftsmodelle wie Beratung oder Software, weil ein Teil des ausgewiesenen EBITDA jedes Jahr wieder in Ersatzinvestitionen fließen muss und damit nicht frei verfügbar ist. Ein direkter EV/EBITDA-Vergleich zwischen einem Netzbetreiber und einem Softwareunternehmen führt deshalb in die Irre – aussagekräftig ist der Vergleich nur innerhalb ähnlich kapitalintensiver Branchen.",
      },
      {
        question: "Was bedeutet ein negatives EBITDA für die Kennzahl?",
        answer:
          "Ist das EBITDA negativ, lässt sich kein sinnvolles EV/EBITDA-Vielfaches bilden – die Kennzahl wird in diesem Fall nicht ausgewiesen. Das betrifft vor allem junge, noch stark investierende Unternehmen, bei denen selbst vor Zinsen, Steuern und Abschreibungen noch ein operativer Verlust anfällt. Für solche Fälle sind EV/Umsatz oder eine reine Wachstumsbetrachtung die brauchbareren Kennzahlen, bis ein positives, aussagekräftiges EBITDA erreicht ist.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "fcfRendite" },
    slug: "free-cashflow-rendite-berechnen",
    title: "Free-Cashflow-Rendite berechnen: Rechner mit Cashflow-Analyse",
    description:
      "Freier Cashflow je Aktie geteilt durch den Kurs – der härteste Bewertungsmaßstab. Mit Gewinnqualität, Investitionsquote und Dividendendeckung.",
    heading: "Free-Cashflow-Rendite berechnen",
    about: [
      "Der freie Cashflow ist das Geld, das nach den Investitionen übrig bleibt: operativer Cashflow minus Investitionen ins Anlagevermögen. Bei 720 Millionen Euro operativem Cashflow und 300 Millionen Euro Investitionen sind das 420 Millionen Euro, also 3,50 Euro je Aktie. Gemessen an einem Kurs von 68 Euro ergibt das eine Free-Cashflow-Rendite von 5,1 Prozent. Diese Zahl beantwortet die Frage, die einen Eigentümer wirklich interessiert: Wie viel frei verfügbares Geld erwirtschaftet das Unternehmen im Verhältnis zu dem, was es an der Börse kostet?",
      "Anders als der Gewinn lässt sich der Cashflow kaum gestalten. Der Gewinn hängt von Abschreibungsdauern, Rückstellungen, aktivierten Entwicklungskosten und der Bewertung von Vorräten ab – alles Ermessensspielräume. Der Zahlungsstrom auf dem Konto ist dagegen eine Tatsache. Deshalb ist die Free-Cashflow-Rendite für viele Investoren der härteste Bewertungsmaßstab: Sie ist gegen Bilanzkosmetik weitgehend immun und lässt sich direkt mit einer Anleiherendite vergleichen.",
      "Zwei Dinge sind bei der Auslegung wichtig. Erstens schwankt der freie Cashflow stark, weil Investitionen in Schüben kommen: Ein Jahr mit einem neuen Werk drückt ihn ins Negative, obwohl das Geschäft unverändert läuft. Sinnvoll ist deshalb der Durchschnitt über drei bis fünf Jahre. Zweitens muss man unterscheiden, ob Investitionen dem Erhalt oder dem Wachstum dienen – nur die Erhaltungsinvestitionen sind zwingend. Der Rechner zeigt zusätzlich die Gewinnqualität, also das Verhältnis von operativem Cashflow zum Gewinn: Bleibt sie über mehrere Jahre unter 80 Prozent, ist das ein ernstes Warnsignal.",
      "Warren Buffett verwendet seit Jahrzehnten eine eigene Variante dieser Idee, die er Owner Earnings nennt: operativer Cashflow minus der Investitionen, die allein nötig sind, um die bestehende Wettbewerbsposition zu erhalten – ausdrücklich ohne die zusätzlichen Investitionen, die einzig dem weiteren Wachstum dienen. Der Gedanke dahinter ist, dass ein Bilanzausweis für Investitionen nicht zwischen beidem unterscheidet, ein Eigentümer die beiden Posten aber sehr unterschiedlich bewerten sollte: Erhaltungsinvestitionen sind eine Bedingung fürs Weiterbestehen, Wachstumsinvestitionen eine freie unternehmerische Entscheidung, die sich erst noch auszahlen muss. In der Praxis lässt sich diese Trennung aus veröffentlichten Zahlen selten exakt vornehmen, weshalb der freie Cashflow als Gesamtgröße die gebräuchlichere, wenn auch etwas konservativere Näherung bleibt.",
    ],
    faq: [
      {
        question: "Was sind Owner Earnings nach Warren Buffett?",
        answer:
          "Eine von Warren Buffett geprägte Variante des freien Cashflows: operativer Cashflow abzüglich nur der Investitionen, die zwingend nötig sind, um die Wettbewerbsposition zu halten – zusätzliche Investitionen ins Wachstum bleiben unberücksichtigt. Der Gedanke ist, dass ein Eigentümer diesen Betrag theoretisch jedes Jahr entnehmen könnte, ohne die Substanz des Geschäfts zu schwächen. Weil sich Erhaltungs- und Wachstumsinvestitionen aus veröffentlichten Bilanzen kaum sauber trennen lassen, arbeiten die meisten frei verfügbaren Kennzahlen-Rechner stattdessen mit dem gesamten freien Cashflow als konservativerer, leichter nachvollziehbarer Näherung.",
      },
      {
        question: "Was ist eine gute Free-Cashflow-Rendite?",
        answer:
          "Ab 5 Prozent gilt sie als attraktiv, unter 3 Prozent als teuer. Der Vergleichsmaßstab ist die Rendite sicherer Anleihen: Liegt die Free-Cashflow-Rendite darunter, zahlt man für das Aktienrisiko einen Aufschlag statt einen zu bekommen – das kann bei stark wachsenden Unternehmen richtig sein, weil der Cashflow in Zukunft deutlich höher ausfällt, bei reifen Geschäften aber nicht.",
      },
      {
        question:
          "Was ist der Unterschied zwischen operativem und freiem Cashflow?",
        answer:
          "Der operative Cashflow ist das Geld aus dem laufenden Geschäft, vor Investitionen. Der freie Cashflow zieht davon die Investitionen ins Anlagevermögen ab und zeigt damit, was für Dividende, Aktienrückkäufe und Schuldenabbau tatsächlich zur Verfügung steht. Die Differenz ist bei kapitalintensiven Unternehmen groß: Ein Netzbetreiber kann einen hohen operativen und über Jahre keinen freien Cashflow haben.",
      },
      {
        question: "Warum ist mein freier Cashflow negativ?",
        answer:
          "Weil die Investitionen den operativen Cashflow übersteigen. Bei einem Ausbauprogramm ist das gewollt und vorübergehend – das Geld fließt in Anlagen, die künftig Erträge bringen. Bei einem reifen Geschäft ist es dagegen ein Warnsignal: Dividende und Zinsen müssen dann aus der Kasse oder von der Bank kommen. Wichtig ist der Blick über mehrere Jahre und darauf, ob die Investitionen dem Wachstum oder nur dem Erhalt dienen.",
      },
      {
        question: "Wie verlässlich ist der Cashflow im Vergleich zum Gewinn wirklich?",
        answer:
          "Deutlich verlässlicher, aber nicht völlig immun gegen Gestaltung. Der Cashflow lässt sich zwar nicht über Abschreibungsdauern oder Rückstellungen verändern, wohl aber über den Zeitpunkt von Zahlungen: Wer Lieferantenrechnungen kurz vor dem Bilanzstichtag verzögert bezahlt oder Kunden zu schnellerer Zahlung drängt, verschiebt den ausgewiesenen operativen Cashflow zwischen zwei Quartalen, ohne dass sich am zugrunde liegenden Geschäft etwas ändert. Solche Verschiebungen gleichen sich über mehrere Quartale meist wieder aus. Wer den Cashflow über einen längeren Zeitraum von drei bis fünf Jahren statt eines einzelnen Quartals betrachtet, ist gegen diese Art der kurzfristigen Glättung weitgehend abgesichert.",
      },
      {
        question: "Was ist der Unterschied zwischen Wachstums- und Erhaltungsinvestitionen?",
        answer:
          "Erhaltungsinvestitionen sind zwingend nötig, um die bestehende Wettbewerbsposition und Produktionskapazität zu erhalten, etwa der Ersatz einer verschlissenen Maschine durch eine gleichwertige. Wachstumsinvestitionen dagegen erweitern das Geschäft über den heutigen Stand hinaus, etwa der Bau einer zusätzlichen Fabrik oder die Erschließung eines neuen Markts. Veröffentlichte Bilanzen unterscheiden zwischen beiden meist nicht, sodass die Trennung in der Praxis nur grob geschätzt werden kann. Für ein reifes Unternehmen mit stagnierendem Umsatz ist es realistisch, den Großteil der ausgewiesenen Investitionen als Erhaltungsinvestitionen zu behandeln; bei einem klar erkennbaren Wachstumskurs mit steigenden Kapazitäten ist ein größerer Teil davon als freie unternehmerische Entscheidung einzuordnen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    params: { fokus: "eigenkapitalquote" },
    slug: "eigenkapitalquote-berechnen",
    title: "Eigenkapitalquote berechnen: Rechner für die Bilanzstärke",
    description:
      "Eigenkapital geteilt durch Bilanzsumme – mit Verschuldungsgrad, Nettoschulden zum EBITDA, Zinsdeckung und Liquiditätsgrad.",
    heading: "Eigenkapitalquote berechnen",
    about: [
      "Die Eigenkapitalquote ist das Eigenkapital geteilt durch die Bilanzsumme. Bei 2.600 Millionen Euro Eigenkapital und 6.100 Millionen Euro Bilanzsumme sind das 42,6 Prozent – dieser Anteil des Vermögens gehört den Aktionären, der Rest den Gläubigern. Sie ist das einfachste Maß für Krisenfestigkeit: Eigenkapital ist der Puffer, der Verluste auffängt, ohne dass jemand um Zustimmung gebeten werden muss. Ein Unternehmen mit 45 Prozent Quote kann mehrere schlechte Jahre aushalten, eines mit 12 Prozent nicht.",
      "Wie viel angemessen ist, hängt vom Geschäftsmodell ab. Im produzierenden Gewerbe gelten 30 bis 45 Prozent als solide, im Handel etwas weniger, bei Banken und Immobiliengesellschaften sind einstellige bis niedrige zweistellige Quoten strukturell normal – ihr Geschäft besteht darin, mit fremdem Geld zu arbeiten. Entscheidend ist außerdem die Art der Vermögenswerte: Eine dünne Quote bei langfristig vermieteten Immobilien ist etwas anderes als dieselbe Quote bei Vorräten in einem Modeunternehmen.",
      "Die Quote allein reicht nicht, weil sie eine Bestandsgröße ist und nichts über die Belastung sagt. Drei Kennzahlen ergänzen sie: Nettoschulden zum EBITDA zeigen, wie viele Jahresergebnisse zur Tilgung nötig wären – ab dem 3,5-Fachen wird es angespannt. Die Zinsdeckung sagt, wie oft das operative Ergebnis die Zinsen verdient; unter dem Dreifachen ist wenig Luft. Und der Liquiditätsgrad zeigt, ob das kurzfristige Vermögen die kurzfristigen Schulden deckt. Der Rechner weist alle vier zusammen aus, weil erst ihr Zusammenspiel ein Bild ergibt.",
      "In Kreditverträgen taucht die Eigenkapitalquote häufig als sogenannter Covenant wieder auf: eine vertraglich festgelegte Mindestschwelle, deren Unterschreitung der Bank ein außerordentliches Kündigungsrecht oder das Recht auf einen Zinsaufschlag einräumt. Fällt die Quote eines Unternehmens in der Nähe eines solchen Schwellenwerts, wird jede weitere Bewegung – ein Verlustjahr, eine große Abschreibung, ein teurer Zukauf auf Kredit – zu einem Ereignis, das über den bloßen Bilanzausweis hinaus reale Konsequenzen für die Finanzierungskosten und Handlungsfreiheit des Unternehmens hat. Wer die Eigenkapitalquote eines hoch verschuldeten Unternehmens beobachtet, sollte deshalb nicht nur auf die absolute Zahl schauen, sondern auch darauf, wie nah sie an den in Geschäftsberichten oft offengelegten Kreditauflagen liegt.",
    ],
    faq: [
      {
        question: "Was ist ein Covenant in einem Kreditvertrag?",
        answer:
          "Eine vertraglich vereinbarte Finanzkennzahl-Schwelle, die ein Kreditnehmer während der Laufzeit einhalten muss – etwa eine Mindest-Eigenkapitalquote oder eine Höchstgrenze für Nettoschulden zum EBITDA. Unterschreitet oder überschreitet das Unternehmen die Schwelle, kann die Bank je nach Vertrag einen Zinsaufschlag verlangen, zusätzliche Sicherheiten fordern oder im schlimmsten Fall den Kredit fällig stellen, noch bevor die reguläre Laufzeit endet. Covenants sind der Grund, warum manche Unternehmen kurz vor einem Bilanzstichtag noch gezielt Vermögenswerte verkaufen oder Kapital aufnehmen, um eine drohende Schwellenverletzung zu vermeiden.",
      },
      {
        question: "Was ist eine gute Eigenkapitalquote?",
        answer:
          "Ab 40 Prozent gilt sie als solide, unter 25 Prozent als dünn – jeweils bezogen auf Industrie, Handel und Dienstleistung. Banken arbeiten mit 5 bis 10 Prozent, Immobiliengesellschaften mit 25 bis 40, und beides ist branchenüblich. Aussagekräftiger als der absolute Wert ist die Entwicklung über mehrere Jahre: Eine fallende Quote bei gleichzeitig steigenden Schulden ist ein deutlicheres Signal als eine niedrige, aber stabile Quote.",
      },
      {
        question:
          "Was ist der Unterschied zwischen Eigenkapitalquote und Verschuldungsgrad?",
        answer:
          "Die Eigenkapitalquote misst das Eigenkapital an der Bilanzsumme, also am gesamten Vermögen. Der Verschuldungsgrad – auch Gearing – setzt die Nettofinanzschulden ins Verhältnis zum Eigenkapital und lässt Posten wie Lieferantenverbindlichkeiten und Rückstellungen außen vor. Er ist damit näher an der Frage, wie viel zinstragende Schuld auf dem Eigenkapital lastet. Ein negativer Verschuldungsgrad bedeutet Netto-Liquidität: mehr Geld in der Kasse als Schulden in der Bilanz.",
      },
      {
        question: "Warum ist eine hohe Eigenkapitalquote nicht immer besser?",
        answer:
          "Weil Eigenkapital teurer ist als Fremdkapital. Aktionäre erwarten eine höhere Rendite als Banken Zinsen verlangen, und Zinsen sind zusätzlich steuerlich abziehbar. Ein Unternehmen mit 80 Prozent Eigenkapitalquote und niedriger Kapitalrendite arbeitet ineffizient – es könnte einen Teil des Kapitals ausschütten oder investieren. Die Kunst liegt in der Balance: genug Puffer für schlechte Jahre, aber kein ungenutztes Kapital in der Bilanz.",
      },
      {
        question: "Wie hat sich die Eigenkapitalquote deutscher Unternehmen über die Zeit entwickelt?",
        answer:
          "Im langfristigen Trend gestiegen: Nach Erhebungen der Deutschen Bundesbank lag die durchschnittliche Eigenkapitalquote deutscher Unternehmen in den 1990er-Jahren noch bei rund 18 bis 20 Prozent und ist seither auf Werte deutlich über 30 Prozent gewachsen. Ein wichtiger Treiber waren die Basel-Regelwerke für Banken, die höhere Eigenkapitalpuffer bei Kreditnehmern honorieren, sowie die Lehren aus mehreren Finanz- und Wirtschaftskrisen, die Unternehmen zu vorsichtigerer Bilanzpolitik bewogen haben. Für den Vergleich einer einzelnen Aktie mit einem historischen Durchschnittswert ist deshalb wichtig, welcher Zeitraum als Referenz dient – ein Vergleich mit den 1990er-Jahren würde die heutige Norm deutlich unterschätzen.",
      },
      {
        question: "Welche Rolle spielt die Eigenkapitalquote bei einer Kreditvergabe an das Unternehmen?",
        answer:
          "Eine zentrale: Banken nutzen sie als eine der wichtigsten Kennzahlen im Rating-Prozess, weil sie unmittelbar zeigt, wie viel Verlust ein Unternehmen auffangen kann, bevor Gläubiger etwas verlieren. Eine höhere Eigenkapitalquote führt bei sonst gleichen Faktoren meist zu einem besseren internen Rating und damit zu günstigeren Kreditkonditionen, weil die Bank ein geringeres Ausfallrisiko einpreist. Unternehmen mit dünner Eigenkapitaldecke zahlen dagegen häufig einen Risikoaufschlag auf den Zins oder müssen zusätzliche Sicherheiten stellen. Dieser Zusammenhang erklärt, warum viele Unternehmen aktiv daran arbeiten, ihre Eigenkapitalquote zu stärken, auch wenn das kurzfristig auf Kosten der Eigenkapitalrendite geht.",
      },
    ],
  },
];
