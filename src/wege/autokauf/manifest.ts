import { Car } from "lucide-react";
import type { ContentSection, FaqEntry } from "@/tools/types";
import type { WegManifest } from "../types";
import { ANTEIL_ENG, ANTEIL_KOMFORTABEL } from "./urteil";

const sections: ContentSection[] = [
  {
    heading: "Wo die Schwellen liegen",
    blocks: [
      {
        type: "table",
        caption: "Anteil der Autokosten am Nettoeinkommen",
        head: ["Anteil vom Netto", "Einordnung"],
        rows: [
          [`unter ${ANTEIL_KOMFORTABEL} %`, "komfortabel"],
          [`${ANTEIL_KOMFORTABEL}–${ANTEIL_ENG} %`, "tragbar, aber eng"],
          [`über ${ANTEIL_ENG} %`, "Vorsicht angebracht"],
        ],
      },
    ],
  },
  {
    heading: "Das Beispiel im Überblick",
    blocks: [
      {
        type: "table",
        caption: "28.000-Euro-Auto, 5.000 Euro Anzahlung, 6 Jahre Laufzeit, 6,5 % Sollzins",
        head: ["Posten", "Betrag"],
        rows: [
          ["Kreditrate", "rund 387 € / Monat"],
          ["Laufender Unterhalt inkl. Teilkasko", "rund 443 € / Monat"],
          ["Gesamtkosten", "rund 829 € / Monat"],
          ["Kosten pro Kilometer (12.000 km/Jahr)", "rund 83 Cent"],
          ["Anteil bei 2.600 € Netto", "über 30 %"],
        ],
      },
    ],
  },
  {
    heading: "Warum Leasing hier nicht abgebildet ist",
    blocks: [
      {
        type: "p",
        text: "Dieser Weg rechnet einen Kauf, finanziert oder bar bezahlt – kein Leasing. Der Grund ist strukturell: Bei einem Kauf gehört das Auto irgendwann, der Kredit endet, und der Wertverlust ist eine reine Kalkulationsgröße, die niemand als Rechnung bekommt. Bei Leasing dagegen ist die monatliche Rate der Vertrag selbst, meist mit einer Anzahlung, einer Kilometergrenze und Regelungen für Mehrkilometer oder Schäden bei Rückgabe – Größen, die von Anbieter zu Anbieter stark variieren und sich nicht aus Kaufpreis, Zins und Marktrichtwert ableiten lassen wie beim Kauf.",
      },
      {
        type: "note",
        text: "Wer ein konkretes Leasingangebot vergleichen will, kann die dort ausgewiesene monatliche Rate direkt als Ersatz für die Kreditrate in diesem Weg eintragen – Unterhalt und Versicherung bleiben davon unabhängig gültig, denn die fallen bei einem geleasten Fahrzeug genauso an.",
      },
    ],
  },
];

const about: string[] = [
  "Ein Auto kostet mehr als die Kreditrate, und die Kreditrate ist mehr als der Unterhalt. Dieser Weg rechnet drei Rechner in einem Zug durch: den Autokosten-Rechner für Wertverlust, Kraftstoff, Steuer, Wartung und Verschleiß, den Versicherungs-Vergleichsrechner für einen realistischen Marktrichtwert der Kfz-Prämie statt einer geschätzten Zahl, und den Kredit-Rechner für die monatliche Rate, die der Autokosten-Rechner bewusst ausklammert. Am Ende steht eine einzige Zahl: der Anteil, den das Auto vom Nettoeinkommen beansprucht.",
  `Am Beispiel eines 28.000-Euro-Autos mit 5.000 Euro Anzahlung, sechs Jahren Kreditlaufzeit bei 6,5 Prozent Sollzins und einer Teilkasko im mittleren Marktrichtwert: Die Kreditrate liegt bei rund 387 Euro, der laufende Unterhalt inklusive dieser Versicherung bei rund 443 Euro – zusammen rund 829 Euro im Monat, das sind knapp 83 Cent pro gefahrenem Kilometer bei 12.000 Kilometern im Jahr. Gemessen an einem Nettoeinkommen von 2.600 Euro sind das über 30 Prozent – ${ANTEIL_ENG} Prozent gelten hier bereits als eng.`,
  `Unter ${ANTEIL_KOMFORTABEL} Prozent vom Netto gilt der Anteil als komfortabel, bis ${ANTEIL_ENG} Prozent als tragbar, aber eng, darüber ist Vorsicht angebracht – dieselbe Logik wie beim Hauskauf-Weg, nur auf ein Fahrzeug statt eine Immobilie angewendet. Der Unterschied zu einer Immobilie ist die Haltedauer: Ein Auto verliert messbar an Wert, während der Kredit noch läuft, und dieser Wertverlust ist im Autokosten-Rechner bereits eingerechnet – er ist meist der größte Einzelposten, obwohl dafür nie eine Rechnung kommt.`,
  "Die Versicherungsprämie ist eine Schätzung anhand von Marktdurchschnitten, keine Offerte eines bestimmten Versicherers – trage den eigenen Beitrag ein, sobald ein echtes Angebot vorliegt, dann rechnet der Weg damit weiter. Finanzierungskosten und Unterhalt gelten unabhängig davon, ob bar bezahlt oder finanziert wird; wer bar zahlt, kann die Kreditrate im zweiten Schritt auf null setzen. Dieser Weg ist keine Finanz- oder Versicherungsberatung.",
];

const faq: FaqEntry[] = [
  {
    question: "Warum zählt die Kreditrate zu den Autokosten dazu?",
    answer:
      "Weil sie im Alltag genauso vom Konto abgeht wie Kraftstoff oder Versicherung, auch wenn sie rechnerisch eine Finanzierungsfrage ist, keine Unterhaltsfrage. Der Autokosten-Rechner klammert sie bewusst aus, um Unterhalt und Bezahlung getrennt zu halten – dieser Weg führt beide wieder zusammen, weil für die Frage „was kostet mich das Auto im Monat“ beides zählt.",
  },
  {
    question: "Woher kommt der Versicherungsrichtwert?",
    answer:
      "Aus Marktdurchschnitten für Kfz-Versicherungen, angepasst um Schadenfreiheitsklasse, Region, Fahrzeugklasse, Alter der fahrenden Person und Fahrleistung. Es ist eine Einordnung, keine Offerte – die tatsächliche Prämie legt jeder Versicherer nach eigenen, nicht veröffentlichten Tarifwerken fest. Liegt ein echtes Angebot vor, ersetzt der eigene Beitrag den Richtwert in der Rechnung.",
  },
  {
    question: "Was, wenn ich bar bezahle statt zu finanzieren?",
    answer:
      "Dann die Anzahlung im zweiten Schritt auf den vollen Kaufpreis setzen – die Kreditrate wird dann null, und die Gesamtkosten bestehen nur noch aus dem laufenden Unterhalt. Der Wertverlust bleibt trotzdem in der Rechnung, denn er entsteht unabhängig von der Bezahlart.",
  },
  {
    question:
      "Warum wird die Fahrzeug- und Kilometerklasse nicht extra abgefragt?",
    answer:
      "Um die Eingabe kurz zu halten, leitet der Weg beides aus bereits eingegebenen Werten ab: die Fahrzeugklasse für die Versicherung aus dem Kaufpreis, die Kilometerklasse aus der jährlichen Fahrleistung. Das ist eine grobe Einordnung – für eine genauere Versicherungsschätzung mit allen Reglern steht der Versicherungs-Vergleichsrechner einzeln zur Verfügung.",
  },
  {
    question: "Rechnet der Weg auch für einen Gebrauchtwagen?",
    answer:
      "Ja, ohne Unterschied in der Bedienung – einfach den tatsächlichen Kaufpreis des gebrauchten Fahrzeugs eintragen. Der Wertverlust im Autokosten-Rechner ist prozentual gerechnet und passt sich damit automatisch an einen niedrigeren Kaufpreis an, fällt bei einem günstigeren Gebrauchtwagen also auch in Euro entsprechend kleiner aus. Ein Unterschied bleibt beim Kreditzins: Für Gebrauchtwagen verlangen Banken teils einen kleinen Aufschlag gegenüber einem Neuwagenkredit, den im Kreditrechner-Feld für den Sollzins direkt berücksichtigen kann, wer ein konkretes Finanzierungsangebot vorliegen hat.",
  },
];

export const autokauf: WegManifest = {
  slug: "autokauf",
  name: "Check: Auto",
  tagline:
    "Kreditrate, Unterhalt und Versicherung eines Autos in einem Urteil: welcher Anteil vom Netto geht dafür drauf?",
  category: "geld",
  icon: Car,
  status: "live",
  keywords: [
    "autokauf rechner",
    "was kostet ein auto wirklich",
    "auto finanzieren rechner",
    "autokosten rate rechner",
    "kann ich mir das auto leisten",
    "auto leasing oder kaufen rechner",
    "gesamtkosten auto berechnen",
  ],

  sourceTools: [
    {
      slug: "kreditrechner",
      detailEyebrow: "Tilgungsplan und Sondertilgung im Detail",
      detailDescription:
        "Rate, Effektivzins und Restschuld für jede Finanzierung.",
      backlinkDescription:
        "Diese Kreditrate mit Unterhalt, Versicherung und dem eigenen Netto zusammenrechnen: wie viel Auto ist drin?",
    },
    {
      slug: "autokosten",
      detailEyebrow: "Jeder Kostenposten einzeln",
      detailDescription:
        "Wertverlust, Kraftstoff, Steuer, Wartung und Verschleiß im Detail.",
      backlinkDescription:
        "Diese Unterhaltskosten mit Finanzierung und Netto zusammenrechnen: welcher Anteil vom Gehalt geht drauf?",
    },
    {
      slug: "versicherungsvergleich",
      detailEyebrow: "Marktrichtwert mit allen Reglern",
      detailDescription:
        "Kfz-, Haftpflicht- und BU-Prämie einzeln gegen den Markt einordnen.",
      backlinkDescription:
        "Diesen Versicherungsrichtwert direkt in die Gesamtkosten eines Autokaufs einrechnen.",
    },
    {
      slug: "bruttonetto",
      detailEyebrow: "Alle Angaben zum Einkommen",
      detailDescription: "Jeder Abzug einzeln, mit Steuerklassen-Vergleich.",
      backlinkDescription:
        "Dieses Netto gegen die Gesamtkosten eines Autos halten: komfortabel, tragbar oder eng?",
    },
  ],

  about,
  sections,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
