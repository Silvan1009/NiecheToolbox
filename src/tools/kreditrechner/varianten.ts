/**
 * Inhalte der SEO-Unterseiten des Kreditrechners.
 *
 * Warum eigene Texte und nicht nur andere Startwerte: Varianten, die sich
 * inhaltlich nicht unterscheiden, sind aus Sicht einer AdSense-Prüfung „low
 * value content“ – und aus Sicht eines Besuchers auch. Jede Seite hier
 * beantwortet ihre eigene Frage von vorn.
 *
 * Alle Zahlenbeispiele sind mit genau diesen Voreinstellungen nachgerechnet,
 * damit ein Besucher das Gelesene auf dem Bildschirm wiederfindet.
 */

import type { VariantContent } from "@/tools/variants";

export const variantenTexte: VariantContent[] = [
  /* ----------------------------------------------------------------------- */

  {
    slug: "effektiver-jahreszins-berechnen",
    title: "Effektiven Jahreszins berechnen: Rechner nach Preisangabenverordnung",
    description:
      "Effektiver Jahreszins mit Bearbeitungsgebühr, Disagio und Restschuldversicherung – die einzige Zahl, mit der sich Kreditangebote vergleichen lassen.",
    heading: "Effektiven Jahreszins berechnen",
    params: { betrag: 10000, zins: 6.5, jahre: 5, gebuehr: 3 },
    about: [
      "Der Sollzins steht groß im Angebot, bezahlt wird der effektive Jahreszins. Der Unterschied entsteht durch zwei Dinge: die unterjährige Verzinsung und die Nebenkosten. Allein die monatliche Verrechnung hebt einen Sollzins von 6,5 Prozent auf 6,70 Prozent effektiv, ganz ohne Gebühren. Kommt eine Bearbeitungsgebühr von drei Prozent dazu, sind es 8,06 Prozent – der Kredit ist ein Viertel teurer, als der Sollzins vermuten lässt.",
      "Gerechnet wird der Effektivzins über die Barwertgleichung der Preisangabenverordnung: Gesucht ist der Zinssatz, bei dem die Summe aller abgezinsten Raten genau dem Betrag entspricht, der tatsächlich auf dem Konto ankommt. Deshalb wirken alle Posten automatisch mit, die entweder die Auszahlung mindern oder die Rate erhöhen – eine Bearbeitungsgebühr, ein Disagio, eine mitfinanzierte Restschuldversicherung. Dieser Rechner löst die Gleichung numerisch, über dieselbe Methode, mit der auch die Rendite einer Anlage bestimmt wird.",
      "Der teuerste Posten ist fast immer die Restschuldversicherung, und zwar aus einem Grund, den die Prämie nicht verrät: Sie wird mitfinanziert. Bei einem Kredit über 10.000 Euro auf fünf Jahre erhöht eine Prämie von 900 Euro die Schuld auf 10.900 Euro, während weiterhin nur 10.000 Euro ausgezahlt werden – und auf die 900 Euro fallen fünf Jahre lang Zinsen an. Der effektive Jahreszins springt dadurch von 6,70 auf 10,65 Prozent. Banken müssen die Versicherung im Effektivzins ausweisen, wenn sie Bedingung für den Kredit ist; ist sie „freiwillig“, taucht sie dort nicht auf.",
    ],
    faq: [
      {
        question: "Was ist der Unterschied zwischen Sollzins und Effektivzins?",
        answer:
          "Der Sollzins ist der reine Zinssatz auf die Restschuld. Der effektive Jahreszins enthält zusätzlich alle Kosten, die zwingend mit dem Kredit verbunden sind, sowie den Effekt der monatlichen Verrechnung – also Bearbeitungsgebühren, ein Disagio, Vermittlungsprovisionen und eine verpflichtende Restschuldversicherung. Banken müssen ihn nach der Preisangabenverordnung angeben. Vergleichbar sind Angebote nur über den Effektivzins, und auch nur bei gleicher Laufzeit.",
      },
      {
        question: "Welche Kosten stecken nicht im effektiven Jahreszins?",
        answer:
          "Einiges. Nicht enthalten sind Kontoführungsgebühren, wenn sie nicht zwingend zum Kredit gehören, Kosten für Sicherheiten wie eine Grundschuldbestellung, Schätzgebühren bei Immobilien, Verzugszinsen und Mahnkosten – und eine Restschuldversicherung, die als freiwillig deklariert ist. Gerade der letzte Punkt macht den Vergleich zweier Angebote unbrauchbar, wenn nur eines davon eine Versicherung enthält. Dieser Rechner nimmt sie deshalb ausdrücklich mit auf.",
      },
      {
        question: "Warum ist der Effektivzins bei kurzer Laufzeit höher?",
        answer:
          "Weil sich einmalige Kosten auf weniger Jahre verteilen. Eine Bearbeitungsgebühr von 300 Euro wiegt bei drei Jahren Laufzeit deutlich schwerer als bei sieben, obwohl der Betrag derselbe ist. Genau deshalb lassen sich Effektivzinsen nur bei gleicher Laufzeit und gleicher Kreditsumme vergleichen – die zwei Prozent des einen Angebots über drei Jahre können teurer sein als die 2,5 Prozent eines anderen über sieben.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "annuitaetendarlehen-berechnen",
    title: "Annuitätendarlehen berechnen: Rate, Tilgungsplan und Zinsanteil",
    description:
      "Annuitätendarlehen mit gleichbleibender Rate berechnen – mit monatsgenauem Tilgungsplan, Zinsanteil und Restschuld zu jedem Zeitpunkt.",
    heading: "Annuitätendarlehen berechnen",
    params: { betrag: 300000, zins: 3.5, modus: "laufzeit-aus-rate", rate: 1375, bindung: 10 },
    about: [
      "Beim Annuitätendarlehen bleibt die Rate über die gesamte Laufzeit gleich, ihre Zusammensetzung verschiebt sich aber laufend. Am Anfang besteht sie fast nur aus Zinsen, am Ende fast nur aus Tilgung. Bei 300.000 Euro zu 3,5 Prozent und einer Rate von 1.375 Euro gehen im ersten Monat 875 Euro an Zinsen weg und nur 500 Euro in die Tilgung. Weil die Restschuld sinkt, sinkt auch der Zinsanteil – und der frei werdende Betrag erhöht die Tilgung. Diese Selbstbeschleunigung ist der Grund, warum die Laufzeit nicht linear von der Rate abhängt.",
      "In der Baufinanzierung wird die Rate meist nicht über eine Laufzeit, sondern über Zins plus anfängliche Tilgung angegeben. Bei 3,5 Prozent Zins und 2 Prozent Anfangstilgung ergibt das eine Annuität von 5,5 Prozent der Darlehenssumme im Jahr, also 16.500 Euro oder 1.375 Euro im Monat. Daraus folgt eine Gesamtlaufzeit von 348 Monaten – 29 Jahren. Ein Prozentpunkt mehr Anfangstilgung – also 1.625 statt 1.375 Euro Rate – verkürzt sie auf 266 Monate, gut 22 Jahre, und spart 46.187 Euro Zinsen. Die Anfangstilgung ist deshalb die wichtigste Zahl im Baufinanzierungsangebot nach dem Zins selbst.",
      "Der Rechner rechnet den Tilgungsplan monatsgenau und nicht über eine Jahresnäherung. Das klingt nach Detailverliebtheit, entscheidet aber über die Restschuld: Bei diesem Beispiel stehen nach zehn Jahren Zinsbindung noch 228.284 Euro offen. Eine Jahresnäherung liegt hier um mehrere Tausend Euro daneben – und die Restschuld ist genau der Betrag, der zu einem heute unbekannten Zins anschlussfinanziert werden muss.",
    ],
    faq: [
      {
        question: "Wie berechnet man die Rate eines Annuitätendarlehens?",
        answer:
          "Über die Annuitätenformel: Rate = Darlehen × i / (1 − (1+i)^−n), wobei i der Monatszins und n die Anzahl der Monate ist. Bei 10.000 Euro, 5 Prozent und 60 Monaten ergibt das 188,72 Euro. In der Baufinanzierung wird stattdessen meist über Zins plus Anfangstilgung gerechnet: Beide Prozentsätze addiert, mal Darlehenssumme, geteilt durch zwölf. Beide Wege führen zur selben Rate, nur ist im zweiten Fall die Laufzeit das Ergebnis statt die Vorgabe.",
      },
      {
        question: "Was bedeutet anfängliche Tilgung?",
        answer:
          "Der Anteil der Darlehenssumme, der im ersten Jahr getilgt wird – „anfänglich“, weil er danach steigt. Bei 2 Prozent Anfangstilgung und 300.000 Euro Darlehen werden im ersten Jahr rund 6.000 Euro getilgt, im zehnten Jahr durch den gesunkenen Zinsanteil schon deutlich mehr. Unter 2 Prozent Anfangstilgung sollte man bei den heutigen Zinsen nicht gehen: Bei 1 Prozent läuft das Darlehen über vierzig Jahre.",
      },
      {
        question: "Was ist der Unterschied zu einem Tilgungsdarlehen?",
        answer:
          "Beim Tilgungsdarlehen ist die Tilgung konstant und die Rate sinkt, weil der Zinsanteil mit der Restschuld fällt. Insgesamt zahlt man dabei weniger Zinsen, weil früher stärker getilgt wird – dafür ist die Belastung am Anfang am höchsten, also genau dann, wenn nach einem Immobilienkauf ohnehin wenig Luft ist. In Deutschland ist deshalb das Annuitätendarlehen mit gleichbleibender Rate der Normalfall, und dieser Rechner bildet es ab.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "sondertilgung-rechner",
    title: "Sondertilgung berechnen: Wie viel Zinsen und Laufzeit sie spart",
    description:
      "Wirkung jährlicher Sondertilgungen auf Laufzeit und Zinsen berechnen – mit vollständigem Tilgungsplan und Vergleich mit und ohne.",
    heading: "Sondertilgung berechnen",
    params: { betrag: 300000, zins: 3.5, modus: "laufzeit-aus-rate", rate: 1375, sonder: 5000, bindung: 10 },
    about: [
      "Eine Sondertilgung wirkt stärker, als ihr Betrag vermuten lässt, weil sie nicht nur die Schuld senkt, sondern sämtliche künftigen Zinsen auf diesen Betrag streicht. Bei 300.000 Euro zu 3,5 Prozent und 1.375 Euro Monatsrate verkürzen jährlich 5.000 Euro Sondertilgung die Laufzeit von 348 auf 233 Monate – von 29 auf gut 19 Jahre. Gespart werden dabei 63.149 Euro Zinsen, bei einer Sondertilgungssumme von rund 95.000 Euro über die Jahre. Jeder sonder­getilgte Euro spart also etwa 66 Cent Zinsen.",
      "Entscheidend ist der Zeitpunkt. Am Anfang der Laufzeit ist die Restschuld am größten und die verbleibende Zeit am längsten – eine Sondertilgung im dritten Jahr wirkt deshalb um ein Vielfaches stärker als dieselbe Summe im zwanzigsten. Wer die Wahl hat zwischen einer höheren Anfangstilgung und einer späteren Sondertilgung, fährt mit der höheren Anfangstilgung fast immer besser, weil sie ab dem ersten Monat wirkt.",
      "Praktisch ist die Sondertilgung meist auf fünf Prozent der ursprünglichen Darlehenssumme pro Jahr begrenzt und muss im Vertrag vereinbart sein. Viele Banken räumen dieses Recht kostenlos ein – aber nur, wenn danach gefragt wird; manche verlangen einen kleinen Zinsaufschlag dafür. Ob sich der lohnt, lässt sich hier direkt gegenrechnen: Wer die Sondertilgung ohnehin nicht leisten kann, zahlt für ein Recht, das er nicht nutzt. Umgekehrt lohnt der Aufschlag fast immer, wenn regelmäßig Boni oder Erbschaften zu erwarten sind.",
    ],
    faq: [
      {
        question: "Wie viel Sondertilgung ist erlaubt?",
        answer:
          "Üblich sind 5 Prozent der ursprünglichen Darlehenssumme pro Jahr, manche Banken bieten 10 Prozent oder unbegrenzte Sondertilgung gegen einen Zinsaufschlag. Ohne vertragliche Vereinbarung besteht während der Zinsbindung kein Anspruch – die Bank kann dann eine Vorfälligkeitsentschädigung verlangen. Nach zehn Jahren ab Vollauszahlung darf jedes Darlehen nach § 489 BGB mit sechs Monaten Frist vollständig gekündigt werden, unabhängig von der vereinbarten Zinsbindung.",
      },
      {
        question: "Sondertilgen oder das Geld anlegen?",
        answer:
          "Eine reine Rechenfrage mit einem psychologischen Zusatz. Rechnerisch lohnt die Sondertilgung, wenn der Kreditzins über der Rendite liegt, die nach Steuern übrig bleibt – bei 3,5 Prozent Kreditzins müsste eine Anlage vor Steuern rund 4,3 Prozent bringen, um gleichzuziehen. Die Sondertilgung hat dabei den Vorteil, dass ihre Rendite sicher ist, während die Anlage schwanken kann. Dagegen steht, dass getilgtes Geld gebunden ist: Ein Notgroschen gehört auf das Tagesgeldkonto und nicht in die Tilgung.",
      },
      {
        question: "Wann im Jahr sollte ich sondertilgen?",
        answer:
          "So früh wie möglich, denn jeder Monat mit geringerer Restschuld spart Zinsen. Viele Verträge erlauben die Sondertilgung allerdings nur zu einem bestimmten Termin, oft zum Jahresende oder zum Zinsanpassungstermin – dann entscheidet der Vertrag. Dieser Rechner verrechnet die Sondertilgung jeweils am Jahresende und rechnet damit die vorsichtigere Variante.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "restschuld-berechnen",
    title: "Restschuld berechnen: Was am Ende der Zinsbindung offen bleibt",
    description:
      "Restschuld zum Ende der Zinsbindung monatsgenau berechnen – die Zahl, an der die Anschlussfinanzierung und das Zinsrisiko hängen.",
    heading: "Restschuld berechnen",
    params: { betrag: 300000, zins: 3.5, modus: "laufzeit-aus-rate", rate: 1375, bindung: 10 },
    about: [
      "Bei einer Baufinanzierung ist nicht die heutige Rate das Risiko, sondern die Restschuld am Ende der Zinsbindung. Sie muss zu einem Zins neu finanziert werden, den heute niemand kennt. Bei 300.000 Euro zu 3,5 Prozent und 1.375 Euro Rate sind nach zehn Jahren Zinsbindung noch 228.284 Euro offen – gut drei Viertel der ursprünglichen Summe, obwohl in dieser Zeit 165.000 Euro gezahlt wurden. Der Rest ging in Zinsen.",
      "Was dieser Betrag im schlechten Fall bedeutet, lässt sich durchrechnen. Steigt der Zins zur Anschlussfinanzierung von 3,5 auf 6 Prozent, kostet dieselbe Restschuld bei gleicher Restlaufzeit gut 308 Euro mehr im Monat – aus 1.372 werden 1.680 Euro. Genau diese Rechnung sollte vor dem Abschluss stehen und nicht danach: Wer sie bei sechs Prozent nicht mehr trägt, hat entweder zu wenig Eigenkapital, eine zu niedrige Anfangstilgung oder eine zu kurze Zinsbindung gewählt.",
      "Drei Stellschrauben senken das Risiko. Eine höhere Anfangstilgung baut die Schuld schneller ab. Eine längere Zinsbindung – fünfzehn oder zwanzig statt zehn Jahre – kostet einen Zinsaufschlag, verschiebt das Problem aber weit nach hinten und lässt die Restschuld bis dahin deutlich schrumpfen. Und ein Forward-Darlehen sichert den Zins für die Anschlussfinanzierung bis zu fünf Jahre im Voraus, gegen einen Aufschlag pro Wartemonat. Welche Variante passt, entscheidet die Restschuld – und die steht hier.",
    ],
    faq: [
      {
        question: "Wie berechnet man die Restschuld?",
        answer:
          "Über einen Tilgungsplan: Für jeden Monat werden die Zinsen auf die aktuelle Restschuld berechnet, von der Rate abgezogen und der Rest getilgt. Nach der gewünschten Anzahl Monate steht die Restschuld fest. Eine Jahresnäherung – Rate mal zwölf minus Jahreszins – liegt bei zehn Jahren um mehrere Tausend Euro daneben, weil sie den monatlich sinkenden Zinsanteil ignoriert. Dieser Rechner rechnet deshalb Monat für Monat.",
      },
      {
        question: "Welche Zinsbindung ist die richtige?",
        answer:
          "Das hängt vom Zinsniveau und von der eigenen Risikotragfähigkeit ab. Eine lange Bindung von 15 oder 20 Jahren kostet meist 0,1 bis 0,4 Prozentpunkte Aufschlag, gibt dafür Planungssicherheit und lässt die Restschuld weit schrumpfen. Sie lohnt besonders, wenn die Finanzierung ohnehin knapp kalkuliert ist. Nach zehn Jahren ab Vollauszahlung darf jedes Darlehen ohnehin gekündigt werden – eine längere Bindung ist damit eine einseitige Absicherung zugunsten des Kreditnehmers.",
      },
      {
        question: "Was ist eine Vorfälligkeitsentschädigung?",
        answer:
          "Der Betrag, den die Bank verlangt, wenn ein Darlehen während der Zinsbindung vorzeitig zurückgezahlt wird – etwa beim Verkauf der Immobilie. Sie soll den entgangenen Zinsgewinn ausgleichen und kann bei langen Restlaufzeiten und gefallenen Zinsen fünfstellig werden. Vermeiden lässt sie sich durch das Kündigungsrecht nach zehn Jahren, durch vereinbarte Sondertilgungen und durch eine Klausel, die den Verkauf der Immobilie ausdrücklich erlaubt.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "umschuldung-rechner",
    title: "Umschuldung berechnen: Was ein günstigerer Kredit spart",
    description:
      "Alten Kredit gegen einen günstigeren tauschen – Zinsersparnis, neue Rate und Laufzeit berechnen. Mit den Kosten, die dabei anfallen.",
    heading: "Umschuldung berechnen",
    params: { betrag: 15000, zins: 5.5, jahre: 5 },
    about: [
      "Umschulden heißt, eine bestehende Restschuld mit einem neuen, günstigeren Kredit abzulösen. Die Rechnung ist einfach: Restschuld als Kreditbetrag eintragen, den neuen Zins und die gewünschte Restlaufzeit – und mit den Zinsen des alten Vertrags vergleichen. Bei 15.000 Euro Restschuld über fünf Jahre kostet ein alter Dispo- oder Ratenkredit zu 9,9 Prozent 4.078 Euro Zinsen. Zu 5,5 Prozent sind es 2.191 Euro. Die Umschuldung spart in diesem Fall 1.887 Euro, bei einer um gut 31 Euro niedrigeren Monatsrate.",
      "Am größten ist der Effekt bei Dispokrediten. Zinssätze von 10 bis 13 Prozent sind dort weiterhin üblich, und weil ein Dispo nicht getilgt werden muss, bleibt er oft jahrelang stehen. Ein Ratenkredit zu 6 Prozent halbiert nicht nur den Zinssatz, er erzwingt durch die feste Rate auch die Rückführung. Wer mehrere kleine Kredite und einen Dispo zusammenlegt, gewinnt zusätzlich Übersicht – und meist einen besseren Zins, weil größere Summen günstiger sind.",
      "Zwei Kostenpunkte gehören in die Rechnung. Bei Verbraucherkrediten darf die Bank für eine vorzeitige Rückzahlung eine Vorfälligkeitsentschädigung von höchstens 1 Prozent der Restschuld verlangen, bei einer Restlaufzeit unter einem Jahr höchstens 0,5 Prozent – bei 15.000 Euro also maximal 150 Euro. Bei Immobiliendarlehen gibt es diese Deckelung nicht, dort kann die Entschädigung fünfstellig werden. Und die neue Laufzeit sollte nicht länger sein als die alte: Eine niedrigere Rate bei längerer Laufzeit fühlt sich günstiger an und kostet am Ende mehr.",
    ],
    faq: [
      {
        question: "Wann lohnt sich eine Umschuldung?",
        answer:
          "Wenn der neue Effektivzins deutlich unter dem alten liegt und die Restlaufzeit noch lang genug ist, damit sich der Wechsel gegen die Kosten rechnet. Als Faustregel: ab einem Prozentpunkt Zinsdifferenz und mehr als zwei Jahren Restlaufzeit lohnt der Aufwand meist. Bei einem Dispokredit lohnt es sich fast immer, weil die Differenz dort selten unter vier Prozentpunkten liegt. Wichtig ist der Vergleich über den Effektivzins, nicht über die Monatsrate.",
      },
      {
        question: "Was kostet die vorzeitige Ablösung eines Kredits?",
        answer:
          "Bei Verbraucherkrediten ist die Vorfälligkeitsentschädigung gesetzlich gedeckelt: höchstens 1 Prozent der vorzeitig zurückgezahlten Summe, bei einer Restlaufzeit unter zwölf Monaten höchstens 0,5 Prozent, und nie mehr als der Zinsbetrag, den der Kreditnehmer sonst gezahlt hätte. Bei Immobiliendarlehen gilt diese Grenze nicht – dort wird der entgangene Zinsgewinn der Bank berechnet, was bei langen Restlaufzeiten teuer wird.",
      },
      {
        question: "Schadet eine Umschuldung dem Schufa-Score?",
        answer:
          "Die reine Konditionenanfrage nicht: Sie wird als „Anfrage Kreditkonditionen“ gespeichert, ist für andere Banken nicht sichtbar und beeinflusst den Score nicht. Anders die „Anfrage Kredit“, die bei einem konkreten Antrag entsteht. Wer mehrere Angebote einholt, sollte deshalb darauf achten, dass die Bank eine Konditionenanfrage stellt. Ein abgelöster und ordnungsgemäß beendeter Kredit wirkt sich auf den Score in der Regel neutral bis positiv aus.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "autokredit-rechner",
    title: "Autokredit berechnen: Rate, Zinsen und der Vergleich mit Leasing",
    description:
      "Autokredit mit Anzahlung und Schlussrate berechnen – Monatsrate, Gesamtkosten und effektiver Jahreszins. Was Händlerfinanzierungen verschweigen.",
    heading: "Autokredit berechnen",
    params: { betrag: 25000, zins: 4.9, jahre: 5 },
    about: [
      "Ein Autokredit über 25.000 Euro zu 4,9 Prozent auf fünf Jahre kostet 470,64 Euro im Monat, insgesamt 28.238 Euro – davon 3.238 Euro Zinsen. Das ist die einfache Rechnung. Interessanter ist der Vergleich mit dem, was beim Händler auf dem Tisch liegt: Dort wird meist mit der Monatsrate geworben, nicht mit dem Zins, und die Rate wird über eine Schlussrate gedrückt.",
      "Die Drei-Wege-Finanzierung, auch Ballonfinanzierung, funktioniert so: kleine Anzahlung, niedrige Monatsraten, am Ende eine große Schlussrate, die dem kalkulierten Restwert entspricht. Die Monatsrate sieht dadurch günstig aus, aber die Schlussrate wird die ganze Laufzeit über mitverzinst – bezahlt wird also für Geld, das nicht getilgt wird. Wer am Ende nicht zahlen kann, verlängert zu meist schlechteren Konditionen oder gibt den Wagen zurück, oft mit Abzügen für Zustand und Mehrkilometer.",
      "Der Barzahlerrabatt ist der Posten, der die Rechnung häufig kippt. Eine Null-Prozent-Finanzierung ist nicht kostenlos, wenn bei Barzahlung drei Prozent Nachlass drin gewesen wären: Bei 25.000 Euro sind das 750 Euro, die den effektiven Preis der Finanzierung ausmachen. Sinnvoll ist deshalb, zuerst den Barpreis zu verhandeln und erst danach über die Finanzierung zu sprechen – und die Händlerfinanzierung gegen einen freien Ratenkredit zu stellen, der zusätzlich als Barzahler auftritt.",
    ],
    faq: [
      {
        question: "Autokredit oder Leasing – was ist günstiger?",
        answer:
          "Wer das Auto lange fahren will, fährt mit dem Kredit fast immer besser: Am Ende gehört das Fahrzeug ihm, und der Wertverlust ist nach den ersten Jahren deutlich geringer. Leasing lohnt eher für Gewerbetreibende, die die Raten absetzen können, und für alle, die alle zwei bis drei Jahre ein neues Auto wollen und Wartungs- sowie Restwertrisiko abgeben möchten. Für den Vergleich zählen nicht die Raten, sondern die Gesamtkosten über den geplanten Zeitraum inklusive Anzahlung, Schlussrate und Rückgabekosten.",
      },
      {
        question: "Ist eine Null-Prozent-Finanzierung wirklich kostenlos?",
        answer:
          "Nur wenn der Barpreis derselbe wäre. In der Regel ist er das nicht: Der Nachlass, der bei Barzahlung möglich gewesen wäre, ist der versteckte Preis der Finanzierung. Bei 3 Prozent Barzahlerrabatt auf 25.000 Euro entspricht das 750 Euro, über drei Jahre also einem effektiven Zins von rund 2 Prozent. Das kann immer noch günstig sein – es ist nur eben nicht null.",
      },
      {
        question: "Was ist die Schlussrate bei einer Ballonfinanzierung?",
        answer:
          "Ein großer Restbetrag am Ende der Laufzeit, der dem kalkulierten Restwert des Fahrzeugs entspricht und oft 40 bis 50 Prozent des Kaufpreises ausmacht. Er senkt die Monatsrate erheblich, wird aber über die gesamte Laufzeit mitverzinst. Am Ende gibt es drei Wege: bezahlen, anschlussfinanzieren oder das Auto zurückgeben. Die Rückgabe ist an Zustand und Kilometerstand geknüpft und endet häufig mit Nachforderungen – wer diese Option einplant, sollte die Bedingungen vorher genau lesen.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "10000-euro-kredit",
    title: "10.000 Euro Kredit: Monatsrate und Gesamtkosten berechnen",
    description:
      "Kredit über 10.000 Euro berechnen – Rate und Zinsen für 3, 5 und 7 Jahre Laufzeit, mit effektivem Jahreszins und vollständigem Tilgungsplan.",
    heading: "10.000 Euro Kredit berechnen",
    params: { betrag: 10000, zins: 6.5, jahre: 5 },
    about: [
      "Ein Kredit über 10.000 Euro zu 6,5 Prozent kostet je nach Laufzeit sehr unterschiedlich viel. Über drei Jahre sind es 306,50 Euro im Monat und 1.034 Euro Zinsen insgesamt. Über fünf Jahre sinkt die Rate auf 195,67 Euro, die Zinsen steigen auf 1.740 Euro. Über sieben Jahre sind es 148,50 Euro im Monat und 2.473 Euro Zinsen. Die Rate halbiert sich also fast, während sich die Zinsen mehr als verdoppeln – das ist der Grundkonflikt jeder Laufzeitentscheidung.",
      "Die sinnvolle Laufzeit richtet sich nach dem, wofür das Geld gebraucht wird. Eine Waschmaschine über sieben Jahre zu finanzieren heißt, sie noch abzuzahlen, wenn sie schon ersetzt ist. Die Faustregel lautet: nicht länger finanzieren, als das Angeschaffte hält. Und die Rate sollte so bemessen sein, dass sie auch in einem Monat mit unerwarteten Ausgaben tragbar bleibt – lieber etwas länger und sicher als kurz und knapp.",
      "In dieser Größenordnung sind die Nebenkosten der Hebel, nicht der Zins. Eine Restschuldversicherung von 900 Euro treibt den effektiven Jahreszins bei fünf Jahren Laufzeit von 6,70 auf 10,65 Prozent – sie kostet also mehr als eine Zinsdifferenz von drei Prozentpunkten. Angebote lassen sich nur über den Effektivzins vergleichen und nur bei gleicher Laufzeit. Wer eine Restschuldversicherung angeboten bekommt, sollte ausdrücklich nach dem Angebot ohne sie fragen.",
    ],
    faq: [
      {
        question: "Wie hoch ist die Rate für 10.000 Euro Kredit?",
        answer:
          "Bei 6,5 Prozent Sollzins: 306,50 Euro über 3 Jahre, 195,67 Euro über 5 Jahre und 148,50 Euro über 7 Jahre. Bei einem besseren Zins von 4 Prozent sinkt die Rate über 5 Jahre auf rund 184 Euro. Der tatsächlich angebotene Zins hängt von Bonität, Laufzeit und Verwendungszweck ab – Autokredite sind meist günstiger als frei verwendbare Ratenkredite, weil das Fahrzeug als Sicherheit dient.",
      },
      {
        question: "Welche Unterlagen braucht die Bank?",
        answer:
          "In der Regel Personalausweis, die letzten zwei bis drei Gehaltsabrechnungen und Kontoauszüge der vergangenen Monate; bei Selbstständigen stattdessen Steuerbescheide und betriebswirtschaftliche Auswertungen der letzten zwei bis drei Jahre. Dazu kommt eine Schufa-Abfrage, die die Bank selbst durchführt. Der Nachweis eines regelmäßigen Einkommens ist der wichtigste Punkt: Ohne ihn wird auch bei kleinen Summen abgelehnt.",
      },
      {
        question: "Kann ich den Kredit vorzeitig zurückzahlen?",
        answer:
          "Ja, das Recht auf vorzeitige Rückzahlung ist bei Verbraucherkrediten gesetzlich garantiert. Die Bank darf dafür höchstens 1 Prozent der zurückgezahlten Summe verlangen, bei weniger als zwölf Monaten Restlaufzeit höchstens 0,5 Prozent – bei 10.000 Euro also maximal 100 Euro. Zusätzlich gilt ein vierzehntägiges Widerrufsrecht ab Vertragsschluss, innerhalb dessen der Vertrag ohne Angabe von Gründen rückabgewickelt werden kann.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "20000-euro-kredit",
    title: "20.000 Euro Kredit: Rate, Laufzeit und Zinsen berechnen",
    description:
      "Kredit über 20.000 Euro berechnen – mit Wunschrate statt Laufzeit, effektivem Jahreszins und der Wirkung von Sondertilgungen.",
    heading: "20.000 Euro Kredit berechnen",
    params: { betrag: 20000, zins: 6.5, jahre: 6 },
    about: [
      "Ein Kredit über 20.000 Euro zu 6,5 Prozent auf sechs Jahre kostet 336,20 Euro im Monat. Insgesamt fließen 24.206 Euro zurück, davon 4.206 Euro Zinsen. Über sieben Jahre sinkt die Rate auf 296,99 Euro, die Zinsen steigen auf 4.947 Euro – knapp 750 Euro mehr für 60 Euro weniger Rate im Monat. Ob das ein guter Tausch ist, hängt allein davon ab, wie eng das Budget sonst wird.",
      "In dieser Größenordnung ist der umgekehrte Weg oft der ehrlichere: nicht die Laufzeit vorgeben und die Rate errechnen, sondern von der Rate ausgehen, die dauerhaft tragbar ist. Der Rechner kann beides. Bei 300 Euro Wunschrate ergibt sich für 20.000 Euro zu 6,5 Prozent eine Laufzeit von 83 Monaten, also knapp sieben Jahren, bei 4.881 Euro Zinsen. Wer so plant, landet seltener bei einer Rate, die im dritten Jahr zum Problem wird.",
      "Bei 20.000 Euro lohnt sich der Vergleich mehrerer Banken besonders, weil ein Prozentpunkt Zinsunterschied hier über die Laufzeit rund 700 Euro ausmacht. Wichtig dabei: Eine Konditionenanfrage ist schufaneutral und für andere Banken nicht sichtbar, eine Kreditanfrage nicht. Vergleichsportale stellen in der Regel automatisch Konditionenanfragen, sodass sich mehrere Angebote ohne Nachteil einholen lassen.",
    ],
    faq: [
      {
        question: "Welche Rate ist für 20.000 Euro realistisch?",
        answer:
          "Das hängt an der Laufzeit: 336,20 Euro über 6 Jahre, 296,99 Euro über 7 Jahre und 391,33 Euro über 5 Jahre, jeweils bei 6,5 Prozent Sollzins. Als Orientierung für die Tragfähigkeit gilt, dass alle Kreditraten zusammen nicht mehr als 35 bis 40 Prozent des verfügbaren Nettoeinkommens ausmachen sollten. Banken rechnen mit Haushaltspauschalen und kommen oft zu einer strengeren Grenze.",
      },
      {
        question: "Was ist bei der Kreditsumme sonst noch zu beachten?",
        answer:
          "Nur so viel aufnehmen wie nötig, aber auch nicht zu knapp: Eine Aufstockung während der Laufzeit ist meist teurer als ein von Anfang an ausreichender Kredit, weil dafür ein neuer Vertrag mit neuen Konditionen nötig wird. Umgekehrt kostet jeder überflüssige Euro Zinsen. Wenn absehbar ist, dass zwischendurch Geld frei wird – Bonus, Steuererstattung, auslaufender Vertrag –, gehört ein Sondertilgungsrecht in den Vertrag.",
      },
      {
        question: "Wie wirkt sich die Bonität auf den Zins aus?",
        answer:
          "Stark. Die beworbenen Zinssätze gelten meist nur für die besten Bonitätsklassen, angegeben als „bonitätsabhängiger Zins ab X Prozent“. Die tatsächliche Spanne reicht oft von 4 bis über 12 Prozent für dieselbe Summe. Entscheidend sind Schufa-Score, Einkommenshöhe und -stabilität, bestehende Verpflichtungen und die Beschäftigungsdauer. Ein zweiter Kreditnehmer im Vertrag verbessert die Konditionen häufig deutlich.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "50000-euro-kredit",
    title: "50.000 Euro Kredit: Rate, Zinsen und Sondertilgung berechnen",
    description:
      "Kredit über 50.000 Euro berechnen – Monatsrate, Gesamtzinsen und effektiver Jahreszins, mit Tilgungsplan und Sondertilgungsrechnung.",
    heading: "50.000 Euro Kredit berechnen",
    params: { betrag: 50000, zins: 6, jahre: 10, sonder: 2000 },
    about: [
      "Ein Kredit über 50.000 Euro zu 6 Prozent auf zehn Jahre kostet 555,11 Euro im Monat. Zurück fließen 66.612 Euro, davon 16.612 Euro Zinsen – ein Drittel der Kreditsumme. Bei dieser Größenordnung und Laufzeit ist der Zinsanteil so hoch, dass sich jede Verbesserung lohnt: Ein Prozentpunkt weniger spart über die Laufzeit knapp 3.000 Euro.",
      "Genauso wirksam ist die Sondertilgung. Wer jährlich 2.000 Euro zusätzlich tilgt, verkürzt die Laufzeit um 33 Monate und spart 4.598 Euro Zinsen – der Rechner weist beides unter dem Ergebnis aus. Bei zehnjährigen Laufzeiten sollte ein kostenloses Sondertilgungsrecht deshalb Teil der Verhandlung sein, gerade wenn regelmäßig Boni oder Steuererstattungen zu erwarten sind.",
      "Ab dieser Summe verlangen Banken meist Sicherheiten oder einen zweiten Kreditnehmer, und die Prüfung fällt gründlicher aus. Wenn das Geld in eine Immobilie fließt, ist ein grundschuldbesicherter Kredit fast immer die deutlich günstigere Variante als ein freier Ratenkredit – der Zinsunterschied liegt oft bei mehreren Prozentpunkten. Auch Förderkredite der KfW für Modernisierung, Heizungstausch oder altersgerechten Umbau sind in dieser Größenordnung eine Prüfung wert und lassen sich mit einem Bankkredit kombinieren.",
    ],
    faq: [
      {
        question: "Bekomme ich 50.000 Euro als Ratenkredit?",
        answer:
          "Viele Banken vergeben freie Ratenkredite bis 50.000 oder 75.000 Euro, einige gehen bis 100.000 Euro. Voraussetzung ist ein entsprechend hohes und sicheres Einkommen: Bei 555 Euro Monatsrate rechnen Banken meist mit einem Nettoeinkommen ab etwa 2.500 Euro, abhängig von Haushaltsgröße und bestehenden Verpflichtungen. Ein zweiter Kreditnehmer verbessert sowohl die Bewilligungschance als auch den Zins.",
      },
      {
        question: "Ratenkredit oder Immobiliendarlehen?",
        answer:
          "Wenn das Geld in eine Immobilie fließt und eine Grundschuld eingetragen werden kann, ist das Immobiliendarlehen fast immer günstiger – der Zinsunterschied beträgt oft mehrere Prozentpunkte, weil die Bank eine Sicherheit hat. Dagegen stehen die Nebenkosten der Grundschuldbestellung von etwa 0,8 bis 1 Prozent der Summe und ein aufwendigeres Verfahren. Ab etwa 30.000 Euro und längeren Laufzeiten rechnet sich das meist trotzdem.",
      },
      {
        question: "Wie lange sollte die Laufzeit sein?",
        answer:
          "So kurz, wie die Rate es dauerhaft zulässt. Jedes zusätzliche Jahr senkt die Rate weniger stark, als es die Zinsen erhöht – der Grenznutzen sinkt. Bei 50.000 Euro und 6 Prozent kostet die Verlängerung von zehn auf fünfzehn Jahre 9.335 Euro zusätzliche Zinsen und senkt die Rate um 133 Euro. Sinnvoll ist eine Laufzeit, die zur Nutzungsdauer des Finanzierten passt und einen Puffer für unerwartete Ausgaben lässt.",
      },
    ],
  },
];
