import { TrendingUp } from "lucide-react";
import type { FaqEntry } from "@/tools/types";
import { buildVariants } from "@/tools/variants";
import type { WegManifest } from "../types";
import { SPARHORIZONT_JAHRE_STANDARD } from "./urteil";
import { variantenTexte } from "./varianten";

const about: string[] = [
  `Eine Gehaltserhöhung wird fast immer in Brutto verhandelt, aber nur das Netto landet auf dem Konto. Dieser Weg rechnet beides durch: den Prozentrechner für die Erhöhung selbst, den Brutto-Netto-Rechner zweimal – einmal mit dem aktuellen, einmal mit dem erhöhten Gehalt – und zeigt aus der Differenz die Grenzbelastung: den Anteil der Erhöhung, der an Steuer und Sozialabgaben geht.`,
  "Die Grenzbelastung liegt für die meisten Angestellten zwischen 40 und 48 Prozent – deutlich über dem Durchschnittssteuersatz, der oft bei nur 30 bis 35 Prozent liegt. Der Unterschied erklärt sich aus der Progression: Der höhere Satz gilt nur für den zusätzlichen Teil des Einkommens, nicht für das gesamte Gehalt. Wer mit dem Durchschnittssatz rechnet, überschätzt systematisch, was von einer Erhöhung ankommt.",
  `Der dritte Schritt zeigt, was aus der Differenz wird, wenn sie nicht im laufenden Konsum aufgeht: ${SPARHORIZONT_JAHRE_STANDARD} Jahre mit den Standardannahmen des Sparplan-Rechners angelegt – 7 Prozent Rendite, 0,2 Prozent laufende Kosten, Abgeltungsteuer. Aus einer monatlichen Differenz von wenigen hundert Euro wird über diesen Zeitraum ein Betrag im fünf- bis sechsstelligen Bereich, allein durch Zinseszins auf das, was sonst versickert wäre.`,
  "Gerechnet wird mit einem Einkommen und den vollen Angaben aus dem Brutto-Netto-Rechner – Steuerklasse, Bundesland, Kirchensteuer, Kinder und Krankenversicherung wirken alle auf das Ergebnis. Die Sparplan-Projektion unterstellt eine gleichbleibende Rendite, die es an der Börse nicht gibt; sie ist eine Orientierung, keine Zusage. Dieser Weg ist keine Steuer- oder Anlageberatung.",
];

const faq: FaqEntry[] = [
  {
    question: "Warum ist die Grenzbelastung höher als mein Steuersatz?",
    answer:
      "Weil der Durchschnittssteuersatz alle Einkommensteile mittelt, während die Grenzbelastung nur den zusätzlichen Teil betrifft – und der liegt im Steuertarif weiter oben. Dazu kommen die Sozialabgaben, die bei den meisten Gehältern noch nicht an einer Beitragsbemessungsgrenze enden. Beides zusammen ergibt eine Grenzbelastung, die für die meisten Angestellten zwischen 40 und 48 Prozent liegt, während der Durchschnittssatz oft bei 30 bis 35 Prozent liegt.",
  },
  {
    question: "Steigt die Grenzbelastung mit einem höheren Ausgangsgehalt?",
    answer:
      "Leicht, ja – solange keine Beitragsbemessungsgrenze überschritten wird. Oberhalb der Grenzen für Renten-, Arbeitslosen-, Kranken- und Pflegeversicherung fallen auf den übersteigenden Teil keine weiteren Sozialabgaben mehr an, wodurch die Grenzbelastung dort wieder sinkt. Für die meisten Gehälter im mittleren Bereich bewegt sie sich aber in einer engen Bandbreite um 46 bis 47 Prozent.",
  },
  {
    question:
      "Warum wird die Erhöhung nicht einfach als Eurobetrag eingegeben?",
    answer:
      "Weil Gehaltsverhandlungen fast immer in Prozent geführt werden – Tarifrunden, individuelle Erhöhungen und Inflationsausgleiche werden so kommuniziert. Der erste Schritt nutzt deshalb den Prozentrechner, um aus dem Prozentsatz den Eurobetrag zu machen, bevor der Brutto-Netto-Rechner ihn verarbeitet.",
  },
  {
    question:
      "Was, wenn ich die Erhöhung nicht anlegen, sondern ausgeben will?",
    answer:
      "Dann zeigt der zweite Schritt trotzdem, was tatsächlich verfügbar ist – die Netto-Differenz allein ist bereits das vollständige Ergebnis. Die Sparplan-Projektion im dritten Schritt ist eine zusätzliche Perspektive, keine Voraussetzung: Sie beantwortet die Frage, was diese Differenz langfristig wert wäre, wenn sie nicht in den laufenden Ausgaben aufgeht.",
  },
  {
    question: "Warum ist der Anlagehorizont fest auf 20 Jahre gesetzt?",
    answer:
      "Er ist ein Startwert, kein fester Wert – der Rechner lässt sich auf jeden Zeitraum zwischen einem und sechzig Jahren einstellen. 20 Jahre sind gewählt, weil sie einen typischen Abstand bis zum Ruhestand oder ein anderes langfristiges Sparziel abbilden, ohne die Rechnung auf eine einzelne Lebenssituation festzulegen.",
  },
];

export const gehalt: WegManifest = {
  slug: "gehalt",
  name: "Gehaltserhöhungs-Weg",
  tagline:
    "Brutto-Plus, Netto-Plus und Grenzbelastung einer Gehaltserhöhung in einem Zug – plus die Wirkung über die Jahre angelegt.",
  category: "geld",
  icon: TrendingUp,
  status: "live",
  keywords: [
    "gehaltserhöhung netto rechner",
    "was bringt gehaltserhöhung",
    "gehaltserhöhung berechnen",
    "grenzbelastung gehalt",
    "gehaltserhöhung prozent netto",
    "wie viel netto bei gehaltserhöhung",
    "gehaltserhöhung sparen",
  ],

  sourceTools: [
    {
      slug: "prozentrechner",
      detailEyebrow: "Jede Prozentfrage im Alltag",
      detailDescription:
        "Anteil, Grundwert, Prozentsatz oder Veränderung frei berechnen.",
      backlinkDescription:
        "Eine Prozentrechnung direkt zu Brutto-Netto und Sparplan weiterdenken: was bringt die Erhöhung wirklich?",
    },
    {
      slug: "bruttonetto",
      detailEyebrow: "Alle Angaben zum Einkommen",
      detailDescription: "Jeder Abzug einzeln, mit Steuerklassen-Vergleich.",
      backlinkDescription:
        "Dieses Netto vor und nach einer Gehaltserhöhung vergleichen: die Grenzbelastung in Prozent.",
    },
    {
      slug: "sparplan",
      detailEyebrow: "Frei wählbare Sparrate und Laufzeit",
      detailDescription:
        "Zinseszins, Fondskosten, Steuern und Inflation im Detail.",
      backlinkDescription:
        "Die Netto-Differenz einer Gehaltserhöhung als Sparrate durchrechnen – mit eigener Rendite und Laufzeit.",
    },
  ],

  getVariants: () => buildVariants(variantenTexte, about, faq),

  about,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
