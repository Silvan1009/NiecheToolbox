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
    title:
      "Effektiven Jahreszins berechnen: Rechner nach Preisangabenverordnung",
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
    slug: "sondertilgung-rechner",
    title: "Sondertilgung berechnen: Wie viel Zinsen und Laufzeit sie spart",
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

];
