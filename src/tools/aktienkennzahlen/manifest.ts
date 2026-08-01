import { ChartCandlestick } from "lucide-react";
import type { FaqEntry, ToolManifest } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import { aktienAffiliate } from "./affiliate";
import Component from "./Component";
import { variantenTexte } from "./varianten";

/* ---------------------------------------------------------------------------
 * Inhalte
 * ------------------------------------------------------------------------- */

const about: string[] = [
  "Eine einzelne Kennzahl entscheidet nichts. Ein KGV von 12 kann günstig sein oder das Vorzeichen einer schrumpfenden Branche, eine Eigenkapitalrendite von 25 Prozent kann Qualität bedeuten oder nur hohe Verschuldung, und eine Dividendenrendite von 8 Prozent ist meistens die Ankündigung einer Kürzung. Aussagekräftig wird eine Zahl erst neben den anderen: Bewertung neben Wachstum, Rentabilität neben Bilanz, Gewinn neben Cashflow. Genau deshalb rechnet dieser Rechner nicht eine Kennzahl, sondern dreißig auf einmal – aus denselben Angaben, die in jedem Geschäftsbericht auf wenigen Seiten stehen.",
  "Alle Eingaben stehen in drei Kapiteln des Geschäftsberichts. Umsatz, EBITDA, EBIT und Jahresüberschuss stehen in der Gewinn- und Verlustrechnung; das EBITDA ist dort nicht immer ausgewiesen, ergibt sich aber aus dem EBIT plus den Abschreibungen. Eigenkapital, Bilanzsumme, Finanzschulden und liquide Mittel stehen in der Bilanz, wobei nur zinstragende Schulden gemeint sind – Lieferantenverbindlichkeiten und Rückstellungen gehören nicht dazu. Operativer Cashflow und Investitionen stehen in der Kapitalflussrechnung. Die Aktienanzahl findet sich im Anhang beim Ergebnis je Aktie. Alle Beträge in Millionen Euro eintragen, dann passen sie zur Aktienanzahl in Millionen Stück.",
  "Der Unternehmenswert ist der wichtigste Unterschied zu einem reinen KGV-Rechner. Wer eine Aktie kauft, kauft einen Anteil am Eigenkapital – wer ein Unternehmen kauft, übernimmt die Schulden mit und bekommt die Kasse dazu. Deshalb rechnet der Enterprise Value den Börsenwert plus Nettoschulden. Zwei Unternehmen mit identischem KGV können hier weit auseinanderliegen: Das eine ist schuldenfrei, das andere hat die Hälfte seines Vermögens auf Kredit finanziert. EV/EBITDA und EV/EBIT sind gegen diesen Effekt immun und deshalb die Kennzahlen, mit denen Käufer ganze Firmen bewerten.",
  "Die zweite Zahl, die selten nachgerechnet wird, ist die Gewinnqualität: der operative Cashflow im Verhältnis zum ausgewiesenen Gewinn. Werte über 100 Prozent sind der Normalfall, weil Abschreibungen den Gewinn mindern, aber kein Geld kosten. Bleibt der Cashflow dagegen über mehrere Jahre deutlich unter dem Gewinn, steckt der Gewinn in Forderungen oder Vorräten statt auf dem Konto – ein Muster, das den meisten Bilanzskandalen vorausgeht. Der Rechner weist die Kennzahl aus und meldet sich, wenn sie unter 80 Prozent fällt.",
  "Der faire Wert wird mit drei Verfahren gerechnet, die absichtlich verschieden vorgehen: das KGV-Modell bewertet den Gewinn mit dem Vielfachen, das du dem Unternehmen zutraust; die Graham-Zahl bindet die Bewertung zusätzlich an die Substanz; das Dividendenmodell diskontiert die künftigen Ausschüttungen. Weichen die drei Ergebnisse stark voneinander ab, ist genau das die Information – dann hängt die Bewertung an einer einzelnen Annahme. Zusätzlich rechnet der Rechner die Erwartung über den Anlagehorizont: Gewinn und Dividende wachsen mit der eingetragenen Rate, am Ende gilt das faire KGV, und daraus ergibt sich eine Rendite pro Jahr.",
  "Alle Kennzahlen sind Näherungen und keine Anlageberatung. Sondereffekte, Minderheitenanteile, Pensions- und Leasingverpflichtungen, Aktienrückkäufe, Währungseffekte und Steuern auf Kursgewinne bleiben außen vor. Die Faustwerte für die Einordnung sind bewusst branchenblind: Ein KGV von 25 ist bei Software normal und bei einem Stahlwerk teuer, eine Eigenkapitalquote von 10 Prozent bei einer Bank unauffällig und in der Industrie alarmierend. Wer eine Kennzahl ernst nimmt, vergleicht sie mit der Historie desselben Unternehmens und mit direkten Wettbewerbern – nicht mit einer Tabelle.",
];

const sharedFaq: FaqEntry[] = [
  {
    question: "Welche Kennzahlen sind bei einer Aktie wirklich wichtig?",
    answer:
      "Vier Blöcke reichen für den ersten Überblick. Bewertung: KGV oder besser EV/EBIT, dazu die Free-Cashflow-Rendite. Rentabilität: EBIT-Marge und Kapitalrendite ROCE, weil sie zeigen, ob das Geschäft überhaupt Geld verdient und wie gut das eingesetzte Kapital arbeitet. Bilanz: Nettoschulden zum EBITDA und die Zinsdeckung – daran entscheidet sich, ob ein schlechtes Jahr gefährlich wird. Und Gewinnqualität: der operative Cashflow im Verhältnis zum Gewinn. Alles andere ist Verfeinerung.",
  },
  {
    question: "Woher bekomme ich die Zahlen für den Rechner?",
    answer:
      "Aus dem Geschäftsbericht oder Quartalsbericht des Unternehmens, meist als PDF auf der Investor-Relations-Seite. Umsatz und Ergebnisgrößen stehen in der Gewinn- und Verlustrechnung, Eigenkapital und Schulden in der Bilanz, Cashflow und Investitionen in der Kapitalflussrechnung. Wer es schneller braucht: Die meisten Finanzportale zeigen dieselben Zahlen in einer Kennzahlenübersicht. Wichtig ist, dass alle Angaben aus demselben Geschäftsjahr stammen – ein Kurs von heute mit einem Gewinn von vorgestern ergibt ein schiefes Bild.",
  },
  {
    question: "Warum unterscheiden sich meine Werte von denen auf Finanzportalen?",
    answer:
      "Meist aus drei Gründen. Erstens der verwendete Gewinn: nachlaufend, vorlaufend oder um Sondereffekte bereinigt – das kann leicht 20 Prozent Unterschied machen. Zweitens die Aktienanzahl: ausgegebene, ausstehende oder verwässerte Aktien. Drittens die Definition der Schulden: manche Portale rechnen Pensions- und Leasingverpflichtungen in die Nettoschulden ein, was den Unternehmenswert erhöht. Keine der Varianten ist falsch, aber vergleichen lassen sich nur Zahlen, die gleich gerechnet wurden.",
  },
  {
    question: "Was ist ein fairer Wert und wie verlässlich ist er?",
    answer:
      "Ein fairer Wert ist eine Annahme in Zahlenform, keine Prognose. Jedes Verfahren übersetzt dieselbe Unsicherheit in eine andere Zahl: Das KGV-Modell hängt vollständig am fairen KGV, das du einträgst; die Graham-Zahl ist streng und bei substanzarmen Geschäften kaum erreichbar; das Dividendenmodell reagiert extrem auf den Abstand zwischen Renditeanspruch und Wachstum. Deshalb weist der Rechner alle drei plus die Spannweite aus. Liegen die Ergebnisse dicht zusammen, ist die Bewertung robust – klaffen sie auseinander, entscheidet eine einzelne Annahme.",
  },
  {
    question: "Kann eine günstig aussehende Aktie eine Falle sein?",
    answer:
      "Ja, und das ist der häufigste Fehler beim Arbeiten mit Kennzahlen. Ein niedriges KGV bei fallenden Gewinnen ist optisch günstig und real teuer, weil der Nenner nächstes Jahr kleiner ist. Eine hohe Dividendenrendite entsteht durch einen gefallenen Kurs. Ein KBV unter 1 bedeutet oft, dass der Markt den Bilanzwerten nicht traut. Diese Fälle erkennt man nicht an der einzelnen Zahl, sondern an der Kombination: niedrige Bewertung plus schwache Kapitalrendite plus hohe Verschuldung plus fallende Margen.",
  },
  {
    question: "Warum bleiben manche Kennzahlen leer?",
    answer:
      "Weil sie sich nicht sinnvoll bilden lassen und eine Null an dieser Stelle eine Aussage wäre, die niemand getroffen hat. Ohne Gewinn gibt es kein KGV, kein PEG und keine Ausschüttungsquote; bei negativem Eigenkapital kein KBV, keine Eigenkapitalrendite und keinen Verschuldungsgrad; ohne Wachstumsannahme kein PEG. Der Rechner zeigt in diesen Fällen einen Gedankenstrich und erklärt im Hinweisblock, welche Voraussetzung fehlt.",
  },
  {
    question: "Taugen die Faustwerte für jede Branche?",
    answer:
      "Nein, sie sind bewusst grob. Ein KGV von 25 ist bei einem Softwareunternehmen mit wiederkehrenden Erlösen normal und bei einem Automobilzulieferer hoch; eine Eigenkapitalquote von 10 Prozent ist bei einer Bank Alltag und in der Industrie ein Alarmsignal; eine Nettomarge von 2 Prozent ist im Lebensmittelhandel gut. Die Einordnung im Rechner sagt deshalb nicht „gut“ oder „schlecht“, sondern welche Zahl es wert ist, im Branchenvergleich genauer angesehen zu werden.",
  },
  {
    question: "Ersetzt der Rechner eine Anlageentscheidung?",
    answer:
      "Nein. Kennzahlen beschreiben die Vergangenheit eines Unternehmens und die Erwartung des Marktes an seine Zukunft – sie sagen nichts über Wettbewerb, Regulierung, Managementqualität oder darüber, was in einem Jahr passiert. Sie sind ein Filter, kein Urteil: Sie helfen, offensichtlich teure oder bilanziell angespannte Fälle früh zu erkennen und die eigenen Annahmen sichtbar zu machen. Dieser Rechner ist keine Anlageberatung und darf keine sein.",
  },
];

/* ---------------------------------------------------------------------------
 * Kennzahl-Varianten
 * ------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
 * Manifest
 * ------------------------------------------------------------------------- */

export const aktienkennzahlen: ToolManifest = {
  slug: "aktienkennzahlen",
  name: "Aktien-Kennzahlen-Rechner",
  tagline:
    "Dreißig Kennzahlen aus einem Geschäftsbericht: Bewertung, Rentabilität, Bilanz, Cashflow – mit fairem Wert und erwarteter Rendite.",
  category: "geld",
  icon: ChartCandlestick,
  status: "live",
  keywords: [
    "aktienkennzahlen",
    "aktien bewerten rechner",
    "kgv berechnen",
    "kurs gewinn verhältnis rechner",
    "kbv berechnen",
    "dividendenrendite berechnen",
    "ev ebitda berechnen",
    "eigenkapitalrendite berechnen",
    "fairer wert aktie berechnen",
    "free cashflow rendite",
  ],

  Component,
  getVariants: () => buildVariants(variantenTexte, about, sharedFaq),

  about,
  faq: sharedFaq,

  monetization: {
    adDensity: "medium",
    affiliate: aktienAffiliate,
  },
};
