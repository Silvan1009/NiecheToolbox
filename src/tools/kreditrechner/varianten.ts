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
    title: "Effektiven Jahreszins berechnen: Rechner nach PAngV",
    description:
      "Effektiver Jahreszins mit Bearbeitungsgebühr, Disagio und Restschuldversicherung – die einzige Zahl, mit der sich Kreditangebote vergleichen lassen.",
    heading: "Effektiven Jahreszins berechnen",
    params: { betrag: 10000, zins: 6.5, jahre: 5, gebuehr: 3 },
    about: [
      "Der Sollzins steht groß im Angebot, bezahlt wird der effektive Jahreszins. Der Unterschied entsteht durch zwei Dinge: die unterjährige Verzinsung und die Nebenkosten. Allein die monatliche Verrechnung hebt einen Sollzins von 6,5 Prozent auf 6,70 Prozent effektiv, ganz ohne Gebühren. Kommt eine Bearbeitungsgebühr von drei Prozent dazu, sind es 8,06 Prozent – der Kredit ist ein Viertel teurer, als der Sollzins vermuten lässt.",
      "Gerechnet wird der Effektivzins über die Barwertgleichung der Preisangabenverordnung: Gesucht ist der Zinssatz, bei dem die Summe aller abgezinsten Raten genau dem Betrag entspricht, der tatsächlich auf dem Konto ankommt. Deshalb wirken alle Posten automatisch mit, die entweder die Auszahlung mindern oder die Rate erhöhen – eine Bearbeitungsgebühr, ein Disagio, eine mitfinanzierte Restschuldversicherung. Dieser Rechner löst die Gleichung numerisch, über dieselbe Methode, mit der auch die Rendite einer Anlage bestimmt wird.",
      "Der teuerste Posten ist fast immer die Restschuldversicherung, und zwar aus einem Grund, den die Prämie nicht verrät: Sie wird mitfinanziert. Bei einem Kredit über 10.000 Euro auf fünf Jahre erhöht eine Prämie von 900 Euro die Schuld auf 10.900 Euro, während weiterhin nur 10.000 Euro ausgezahlt werden – und auf die 900 Euro fallen fünf Jahre lang Zinsen an. Der effektive Jahreszins springt dadurch von 6,70 auf 10,65 Prozent. Banken müssen die Versicherung im Effektivzins ausweisen, wenn sie Bedingung für den Kredit ist; ist sie „freiwillig“, taucht sie dort nicht auf.",
      "Seit der EU-Verbraucherkreditrichtlinie ist der effektive Jahreszins die gesetzlich vorgeschriebene Vergleichsgröße in jeder Werbung, die einen Zins oder eine Kreditkondition nennt – ein reiner Sollzins ohne begleitenden Effektivzins darf dort nicht mehr genannt werden, genau damit Angebote nicht allein über die kleinere Zahl beworben werden können. Trotzdem bleibt beim Vergleich zweier Angebote Vorsicht nötig: Die Preisangabenverordnung schreibt zwar vor, was zwingend in den Effektivzins einfließen muss, lässt aber Spielraum bei Nebenkosten, die nicht direkt mit der Kreditvergabe verbunden sind, etwa eine Kontoführungsgebühr für ein Konto, das theoretisch auch unabhängig vom Kredit eröffnet werden könnte. Zwei Angebote mit identischem ausgewiesenem Effektivzins können deshalb in der Praxis trotzdem unterschiedlich teuer sein, wenn ein Anbieter solche Randkosten geschickt außerhalb der gesetzlichen Berechnungsgrundlage platziert.",
    ],
    faq: [
      {
        question: "Muss der effektive Jahreszins in jeder Werbung stehen?",
        answer:
          "Ja, sobald die Werbung überhaupt einen Zinssatz oder eine sonstige Zahl zu den Kreditkosten nennt, schreibt § 6a der Preisangabenverordnung die gleichzeitige Angabe des effektiven Jahreszinses vor – ein reiner Sollzins ohne begleitenden Effektivzins ist in der Werbung nicht zulässig. Diese Pflicht soll verhindern, dass Anbieter allein mit der kleineren, aber unvollständigen Zahl werben. Trotzdem lohnt der eigene Blick ins Kleingedruckte, weil nicht jede Randkosten-Position zwingend in die gesetzliche Effektivzins-Berechnung einfließen muss.",
      },
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
      {
        question:
          "Wie wird der effektive Jahreszins mathematisch genau ermittelt?",
        answer:
          "Über die interne Zinsfußmethode, dasselbe Verfahren, mit dem auch die Rendite einer Kapitalanlage berechnet wird. Gesucht ist der Zinssatz, bei dem der Barwert aller künftigen Raten – also jede Rate, abgezinst auf den heutigen Tag – exakt der tatsächlichen Auszahlungssumme entspricht. Weil sich diese Gleichung nicht direkt nach dem Zinssatz auflösen lässt, wird sie numerisch gelöst: Ein Rechenverfahren probiert iterativ verschiedene Zinssätze durch, bis die Gleichung bis auf eine sehr kleine Abweichung aufgeht. Banken sind gesetzlich verpflichtet, dieses in der Preisangabenverordnung festgelegte Verfahren zu verwenden, damit der ausgewiesene Effektivzins zwischen verschiedenen Anbietern tatsächlich vergleichbar ist.",
      },
      {
        question:
          "Warum unterscheidet sich der deutsche Effektivzins vom amerikanischen APR?",
        answer:
          "Beide verfolgen dasselbe Ziel – die Gesamtkosten eines Kredits in einer vergleichbaren Jahreszahl auszudrücken –, unterscheiden sich aber in Details der Berechnungsmethode und darin, welche Kostenarten zwingend einzurechnen sind. Der US-amerikanische Annual Percentage Rate (APR) verwendet teils andere Rundungs- und Zinsberechnungskonventionen als die europäische, in der Verbraucherkreditrichtlinie festgelegte Methode. Für einen internationalen Kreditvergleich reicht es deshalb nicht, die beiden ausgewiesenen Prozentsätze einfach nebeneinanderzulegen – sie folgen unterschiedlichen gesetzlichen Rechenvorschriften und sind streng genommen nicht eins zu eins vergleichbar.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "sondertilgung-rechner",
    title: "Sondertilgung berechnen: Ersparnis bei Zinsen und Laufzeit",
    description:
      "Wirkung jährlicher Sondertilgungen auf Laufzeit und Zinsen berechnen – mit vollständigem Tilgungsplan und Vergleich mit und ohne.",
    heading: "Sondertilgung berechnen",
    params: {
      betrag: 300000,
      zins: 3.5,
      modus: "laufzeit-aus-rate",
      rate: 1375,
      sonder: 5000,
      bindung: 10,
    },
    about: [
      "Eine Sondertilgung wirkt stärker, als ihr Betrag vermuten lässt, weil sie nicht nur die Schuld senkt, sondern sämtliche künftigen Zinsen auf diesen Betrag streicht. Bei 300.000 Euro zu 3,5 Prozent und 1.375 Euro Monatsrate verkürzen jährlich 5.000 Euro Sondertilgung die Laufzeit von 348 auf 233 Monate – von 29 auf gut 19 Jahre. Gespart werden dabei 63.149 Euro Zinsen, bei einer Sondertilgungssumme von rund 95.000 Euro über die Jahre. Jeder sonder­getilgte Euro spart also etwa 66 Cent Zinsen.",
      "Entscheidend ist der Zeitpunkt. Am Anfang der Laufzeit ist die Restschuld am größten und die verbleibende Zeit am längsten – eine Sondertilgung im dritten Jahr wirkt deshalb um ein Vielfaches stärker als dieselbe Summe im zwanzigsten. Wer die Wahl hat zwischen einer höheren Anfangstilgung und einer späteren Sondertilgung, fährt mit der höheren Anfangstilgung fast immer besser, weil sie ab dem ersten Monat wirkt.",
      "Praktisch ist die Sondertilgung meist auf fünf Prozent der ursprünglichen Darlehenssumme pro Jahr begrenzt und muss im Vertrag vereinbart sein. Viele Banken räumen dieses Recht kostenlos ein – aber nur, wenn danach gefragt wird; manche verlangen einen kleinen Zinsaufschlag dafür. Ob sich der lohnt, lässt sich hier direkt gegenrechnen: Wer die Sondertilgung ohnehin nicht leisten kann, zahlt für ein Recht, das er nicht nutzt. Umgekehrt lohnt der Aufschlag fast immer, wenn regelmäßig Boni oder Erbschaften zu erwarten sind.",
      "Eine Sondertilgung wirkt anders als eine dauerhaft höhere Rate, obwohl beide dieselbe Zinsersparnis pro getilgtem Euro bringen: Die Sondertilgung bleibt eine einmalige, freiwillige Entscheidung im jeweiligen Jahr, während eine höhere Anfangstilgung die monatliche Belastung dauerhaft festlegt. Wer sich nicht sicher ist, ob künftige Boni oder Sonderzahlungen zuverlässig fließen, fährt deshalb mit der niedrigeren Rate plus flexibler Sondertilgung sicherer als mit einer knapp kalkulierten hohen Rate, die im schlechten Fall zur echten Belastung wird. Der Nachteil der Flexibilität ist der Bequemlichkeitseffekt: Wer die Sondertilgung nicht diszipliniert Jahr für Jahr tatsächlich leistet, sondern das Geld anderweitig ausgibt, bekommt am Ende genau die längere Laufzeit und die höheren Gesamtzinsen, die eine feste hohe Rate von vornherein vermieden hätte.",
    ],
    faq: [
      {
        question:
          "Sondertilgung oder gleich eine höhere Anfangstilgung vereinbaren?",
        answer:
          "Rechnerisch bringt beides dieselbe Zinsersparnis pro getilgtem Euro. Der Unterschied liegt in der Verbindlichkeit: Eine höhere Anfangstilgung legt die monatliche Belastung von Anfang an fest und wirkt garantiert, eine Sondertilgung bleibt eine freiwillige Jahresentscheidung, die nur wirkt, wenn sie tatsächlich geleistet wird. Wer sichere, regelmäßige Zusatzeinnahmen erwartet – etwa einen jährlichen Bonus –, kann mit der niedrigeren Rate und der flexiblen Option gut fahren. Wer eher dazu neigt, verfügbares Geld doch anderweitig auszugeben, ist mit der höheren, fest vereinbarten Anfangstilgung besser beraten, weil sie diesen Bequemlichkeitseffekt gar nicht erst zulässt.",
      },
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
      {
        question:
          "Verkürzt eine Sondertilgung die Laufzeit oder senkt sie die Rate?",
        answer:
          "Das hängt von der vertraglichen Vereinbarung ab, und die meisten Banken bieten beides zur Wahl an. Bleibt die Rate unverändert, verkürzt sich die Laufzeit, weil dieselbe Rate eine kleinere Restschuld schneller abträgt – das bringt insgesamt die größere Zinsersparnis, weil die Zinsen über weniger Monate anfallen. Wird stattdessen die Rate gesenkt und die ursprüngliche Laufzeit beibehalten, sinkt die monatliche Belastung sofort spürbar, die Gesamtzinsersparnis fällt aber kleiner aus. Wer finanziell Luft hat, fährt mit der Laufzeitverkürzung besser; wer die monatliche Belastung senken muss, etwa nach einem Einkommensrückgang, wählt die Ratensenkung.",
      },
      {
        question:
          "Kann ich eine Sondertilgung nachträglich in den Vertrag aufnehmen?",
        answer:
          "In der Regel nicht ohne Weiteres, wenn der Kredit bereits läuft und im ursprünglichen Vertrag kein Sondertilgungsrecht vorgesehen war – eine nachträgliche Änderung braucht die Zustimmung der Bank und wird oft mit einem Zinsaufschlag verbunden, wenn sie überhaupt angeboten wird. Deshalb lohnt es sich, das Sondertilgungsrecht bereits beim Abschluss eines Kredits ausdrücklich zu verhandeln, selbst wenn aktuell keine konkrete Sondertilgung geplant ist – die Option kostet meist wenig bis nichts und lässt sich später nutzen, falls unerwartet Geld frei wird. Wurde sie nicht vereinbart und die Bank verweigert eine spätere Nachrüstung, bleibt oft nur die vollständige vorzeitige Ablösung des Kredits gegen Vorfälligkeitsentschädigung.",
      },
    ],
  },

  /* ----------------------------------------------------------------------- */

  {
    slug: "restschuld-berechnen",
    title: "Restschuld berechnen: Was nach der Zinsbindung offen bleibt",
    description:
      "Restschuld zum Ende der Zinsbindung monatsgenau berechnen – die Zahl, an der die Anschlussfinanzierung und das Zinsrisiko hängen.",
    heading: "Restschuld berechnen",
    params: {
      betrag: 300000,
      zins: 3.5,
      modus: "laufzeit-aus-rate",
      rate: 1375,
      bindung: 10,
    },
    about: [
      "Bei einer Baufinanzierung ist nicht die heutige Rate das Risiko, sondern die Restschuld am Ende der Zinsbindung. Sie muss zu einem Zins neu finanziert werden, den heute niemand kennt. Bei 300.000 Euro zu 3,5 Prozent und 1.375 Euro Rate sind nach zehn Jahren Zinsbindung noch 228.284 Euro offen – gut drei Viertel der ursprünglichen Summe, obwohl in dieser Zeit 165.000 Euro gezahlt wurden. Der Rest ging in Zinsen.",
      "Was dieser Betrag im schlechten Fall bedeutet, lässt sich durchrechnen. Steigt der Zins zur Anschlussfinanzierung von 3,5 auf 6 Prozent, kostet dieselbe Restschuld bei gleicher Restlaufzeit gut 308 Euro mehr im Monat – aus 1.372 werden 1.680 Euro. Genau diese Rechnung sollte vor dem Abschluss stehen und nicht danach: Wer sie bei sechs Prozent nicht mehr trägt, hat entweder zu wenig Eigenkapital, eine zu niedrige Anfangstilgung oder eine zu kurze Zinsbindung gewählt.",
      "Drei Stellschrauben senken das Risiko. Eine höhere Anfangstilgung baut die Schuld schneller ab. Eine längere Zinsbindung – fünfzehn oder zwanzig statt zehn Jahre – kostet einen Zinsaufschlag, verschiebt das Problem aber weit nach hinten und lässt die Restschuld bis dahin deutlich schrumpfen. Und ein Forward-Darlehen sichert den Zins für die Anschlussfinanzierung bis zu fünf Jahre im Voraus, gegen einen Aufschlag pro Wartemonat. Welche Variante passt, entscheidet die Restschuld – und die steht hier.",
      "Ein Forward-Darlehen verdient einen genaueren Blick, weil es das einzige der drei Instrumente ist, das sich erst kurz vor Ende der laufenden Zinsbindung einsetzen lässt und trotzdem schon Jahre vorher abgeschlossen werden muss. Die Bank garantiert dabei heute einen Zinssatz für ein Darlehen, das erst in ein bis fünf Jahren ausgezahlt wird, und verlangt dafür üblicherweise einen Aufschlag von etwa 0,01 bis 0,03 Prozentpunkten je Monat Vorlaufzeit auf den aktuellen Zins. Der Vertrag bindet in beide Richtungen: Steigt der Marktzins bis zur Auszahlung, hat sich die Absicherung gelohnt; fällt er, zahlt der Kreditnehmer trotzdem den vereinbarten, höheren Satz und kann nicht kostenfrei aussteigen. Ein Forward-Darlehen ist damit eine Wette gegen steigende Zinsen, keine kostenlose Versicherung – sinnvoll vor allem für alle, die eine steigende Zinsbelastung schlicht nicht verkraften könnten.",
    ],
    faq: [
      {
        question: "Wie funktioniert ein Forward-Darlehen?",
        answer:
          "Die Bank sichert heute einen Zinssatz für ein Darlehen zu, das erst ein bis fünf Jahre später ausgezahlt wird – meist zur Anschlussfinanzierung nach Ablauf der aktuellen Zinsbindung. Dafür verlangt sie üblicherweise einen Aufschlag von rund 0,01 bis 0,03 Prozentpunkten je Monat Vorlaufzeit auf den zum Abschlusszeitpunkt geltenden Zins. Die Zusage gilt fest in beide Richtungen: Steigen die Zinsen bis zur Auszahlung, war die Absicherung günstig; fallen sie, muss trotzdem der vereinbarte, dann zu hohe Satz gezahlt werden. Es ist deshalb eine Zinswette, kein Gratis-Schutz, und lohnt sich vor allem, wenn eine steigende Belastung das eigene Budget wirklich sprengen würde.",
      },
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
      {
        question:
          "Wie wird die Restschuld bei einer Anschlussfinanzierung übernommen?",
        answer:
          "Entweder als Prolongation bei der bisherigen Bank, die die Restschuld einfach zu neuen Konditionen weiterführt, oder als Umschuldung zu einem neuen Anbieter, der die Restschuld ablöst und ein eigenes Darlehen einräumt. Rechtlich ist ein Bankwechsel unkompliziert: Die neue Bank zahlt die Restschuld an die alte Bank aus, im Grundbuch ändert sich nur der Gläubiger der eingetragenen Grundschuld, nicht deren Rang oder Höhe. Es lohnt sich fast immer, rechtzeitig vor Ablauf der Zinsbindung Angebote mehrerer Banken einzuholen, statt das Prolongationsangebot der bisherigen Bank ungeprüft anzunehmen – Hausbanken kalkulieren bei bestehenden Kunden nicht automatisch den günstigsten Zins.",
      },
      {
        question:
          "Wie früh sollte ich mich um die Anschlussfinanzierung kümmern?",
        answer:
          "Etwa ein bis drei Jahre vor Ablauf der Zinsbindung ist ein guter Zeitpunkt für die ersten Vergleiche, spätestens jedoch sechs Monate davor sollte die Entscheidung feststehen. Wer sich Zeit für einen Vergleich mehrerer Angebote nimmt, hat bessere Verhandlungsposition als jemand, der kurz vor Ablauf unter Zeitdruck das erstbeste Angebot der Hausbank annimmt. Bei erwarteten Zinssteigerungen kann sich zusätzlich ein Forward-Darlehen lohnen, das den heutigen Zins bis zu fünf Jahre im Voraus für die Anschlussfinanzierung sichert – dieser Zeitraum sollte deshalb bereits früh mitgedacht werden, auch wenn die eigentliche Ablösung noch weit entfernt ist.",
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
      "Bei mehreren kleinen Krediten und einem Dispo lohnt sich vor der reinen Zinsrechnung noch ein Blick auf die Übersicht: Wer drei laufende Kredite mit unterschiedlichen Raten und Fälligkeiten hat, verliert leicht den Überblick darüber, wie viel insgesamt monatlich gebunden ist – und läuft eher Gefahr, eine Rate zu verpassen, was zusätzliche Mahngebühren und einen negativen Schufa-Eintrag nach sich ziehen kann. Eine Umschuldung, die mehrere Verbindlichkeiten zu einem einzigen Kredit mit einer einzigen Rate zusammenfasst, schafft diese Übersicht unabhängig davon, ob am Ende auch der Zinssatz sinkt. Banken bewerten eine größere, gebündelte Kreditsumme zudem häufig mit einem besseren Zins als mehrere kleine Einzelkredite, weil der Bearbeitungsaufwand pro finanziertem Euro sinkt.",
    ],
    faq: [
      {
        question:
          "Lohnt sich die Zusammenlegung mehrerer Kredite auch ohne Zinsvorteil?",
        answer:
          "Oft ja, allein wegen der Übersicht. Wer mehrere Kredite mit unterschiedlichen Raten und Fälligkeitsterminen parallel bedient, verliert leichter den Überblick und läuft eher Gefahr, eine Rate zu verpassen – mit Mahngebühren und einem möglichen negativen Schufa-Eintrag als Folge. Eine einzige zusammengefasste Rate reduziert dieses Risiko unabhängig vom Zinssatz. Hinzu kommt: Banken bewerten eine größere, gebündelte Kreditsumme häufig mit einem etwas günstigeren Zins als mehrere kleine Einzelkredite, weil der Bearbeitungs- und Prüfaufwand pro finanziertem Euro sinkt – ein Zinsvorteil ergibt sich also oft ganz von selbst.",
      },
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
      {
        question: "Wie läuft eine Umschuldung praktisch ab?",
        answer:
          "Zuerst wird bei der bisherigen Bank die genaue Restschuld zum geplanten Ablösetermin erfragt, meist als schriftliche Ablösebestätigung. Parallel werden Angebote bei anderen Banken eingeholt, idealerweise über Konditionenanfragen statt konkreter Kreditanträge. Fällt die Wahl auf einen neuen Anbieter, zahlt dieser die Restschuld direkt an die alte Bank aus und übernimmt die weitere Bedienung des Kredits – für den Kreditnehmer ändert sich außer der neuen Rate und dem neuen Ansprechpartner nichts Wesentliches. Bei einem laufenden Ratenkredit ohne Grundschuld ist der gesamte Vorgang meist innerhalb weniger Wochen abgeschlossen, bei einem Immobiliendarlehen mit Grundschuldwechsel kann es je nach Grundbuchamt etwas länger dauern.",
      },
      {
        question: "Fallen bei einer Umschuldung zusätzliche Gebühren an?",
        answer:
          "Neben der gegebenenfalls anfallenden Vorfälligkeitsentschädigung können weitere Posten dazukommen: eine Bearbeitungsgebühr des neuen Kredits, sofern vereinbart, sowie bei einem Immobiliendarlehen die Kosten für die Übertragung oder Neueintragung der Grundschuld beim Grundbuchamt und Notar, üblicherweise rund 0,2 Prozent der Grundschuldsumme. Bei einem reinen Ratenkredit ohne Grundschuld fallen diese Posten meist weg, sodass die Umschuldung dort in der Regel deutlich günstiger und unkomplizierter ist als bei einer Immobilienfinanzierung. Vor der Entscheidung lohnt sich deshalb eine vollständige Kostenaufstellung, nicht nur der Vergleich der reinen Zinssätze.",
      },
    ],
  },
];
