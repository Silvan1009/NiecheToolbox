import { Baby } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { FaqEntry } from "@/tools/types";
import type { WegManifest } from "../types";
import { ERSATZQUOTE_ENG, ERSATZQUOTE_KOMFORTABEL } from "./urteil";

const about: string[] = [
  "Zwischen dem errechneten Termin und der Rückkehr in den Job liegen vier Zahlen, die zusammengehören und selten zusammen gerechnet werden: der Termin selbst, das Haushaltsnetto davor, das Elterngeld während der Elternzeit und das Kindergeld, das von Anfang an dazukommt. Dieser Weg führt sie zusammen – Geburtstermin-, Brutto-Netto-, Elterngeld- und Elternzeit-Rechner in einem Zug, ergänzt um den aktuellen Kindergeldsatz – und macht daraus ein Urteil: Wie groß ist die Lücke zwischen dem, was vorher ankam, und dem, was während des Bezugs ankommt?",
  "Am Beispiel eines Haushaltsnettos von 2.713 Euro im Monat vor der Geburt, zwölf Monaten Elternzeit für Elternteil 1 und zwei weiteren für Elternteil 2: Die zwei Partnermonate verlängern das Basiselterngeld von 12 auf 14 Monate. Bei einer Ersatzrate von 65 Prozent – typisch für Einkommen über 1.200 Euro netto – zahlt das Elterngeld 1.763 Euro im Monat, dazu kommen 259 Euro Kindergeld. Zusammen 2.022 Euro gegen 2.713 Euro vorher – eine Lücke von rund 690 Euro im Monat, eine Ersatzquote von knapp 75 Prozent.",
  `Ab ${ERSATZQUOTE_KOMFORTABEL} Prozent Ersatzquote gilt der Übergang als komfortabel, ab ${ERSATZQUOTE_ENG} Prozent noch als tragbar, aber eng, darunter ist die Lücke deutlich spürbar – dieselbe Belastungslogik wie beim Hauskauf- und beim Auto-Weg, nur mit umgekehrtem Vorzeichen: Hier ist eine hohe Quote gut, nicht niedrig. Die zwei Partnermonate lohnen sich rechnerisch fast immer, wenn beide Elternteile sie nehmen können – sie bringen zwei zusätzliche Monate Elterngeld, ohne dass sich sonst etwas ändert.`,
  "Gerechnet wird mit einem Kind und dem Basiselterngeld als Vorgabe; ElterngeldPlus verdoppelt die Bezugsdauer bei halbem Monatsbetrag und lässt sich umschalten. Der Kindergeldbetrag ist der aktuelle Satz je Kind, ohne die Günstigerprüfung gegen den Kinderfreibetrag – die lohnt sich erst ab höheren Einkommen und steht im Kindergeld-Rechner einzeln zur Verfügung. Elternzeit-Monate mit einem festen Startzeitpunkt bilden den häufigsten Fall ab: Elternteil 1 direkt ab der Geburt, Elternteil 2 im Anschluss. Dieser Weg ist keine Rechts- oder Finanzberatung.",
];

const faq: FaqEntry[] = [
  {
    question: "Warum verlängern die Partnermonate das Elterngeld?",
    answer:
      "Weil das Gesetz zwei zusätzliche Basiselterngeld-Monate vorsieht, wenn beide Elternteile mindestens zwei Monate Elternzeit nehmen (§ 4 Abs. 3 BEEG) – aus 12 werden 14 Monate. Bei Alleinerziehenden mit alleinigem Sorgerecht gelten die 14 Monate ohne diese Bedingung. Nimmt nur ein Elternteil Elternzeit, bleibt es bei 12 Monaten.",
  },
  {
    question: "Warum liegt die Ersatzrate bei 65 und nicht bei 67 Prozent?",
    answer:
      "Weil 67 Prozent nur zwischen 1.000 und 1.200 Euro Nettoeinkommen gelten. Darüber sinkt die Rate um 0,1 Punkte je 2 Euro Differenz, gedeckelt bei 65 Prozent – wer 2.700 Euro netto verdient hat, landet deshalb bei 65 Prozent, nicht bei 67. Darunter steigt die Rate über die Geringverdienerregelung sogar bis auf 100 Prozent.",
  },
  {
    question: "Ist die Kindergeld-Günstigerprüfung hier mit eingerechnet?",
    answer:
      "Nein, bewusst nicht. Die Günstigerprüfung gegen den Kinderfreibetrag lohnt sich erst ab einem zu versteuernden Einkommen von rund 86.000 Euro bei Zusammenveranlagung – für die meisten Haushalte in der Familiengründungsphase bleibt es beim Kindergeld. Wer in diesem Einkommensbereich liegt, findet die vollständige Rechnung im Kindergeld-Rechner.",
  },
  {
    question: "Was, wenn nur ein Elternteil Elternzeit nimmt?",
    answer:
      "Dann die Monate von Elternteil 2 auf null setzen. Ohne Partnermonate bleibt es bei 12 Basiselterngeld-Monaten statt 14, und die Ersatzquote in diesem Weg sinkt entsprechend, sobald Elternteil 1 länger als 12 Monate zu Hause bleibt, weil die zusätzliche Zeit dann unbezahlt ist.",
  },
];

export const nachwuchs: WegManifest = {
  slug: "nachwuchs",
  name: "Nachwuchs-Weg",
  tagline:
    "Termin, Einkommen, Elterngeld und Elternzeit in einem Urteil: wie groß ist die Lücke während des Bezugs?",
  category: "familie",
  icon: Baby,
  status: "beta",
  keywords: [
    "elterngeld netto rechner",
    "was bringt elterngeld",
    "elternzeit planen rechner",
    "kindergeld und elterngeld zusammen",
    "haushaltsnetto elternzeit",
    "elterngeld lücke berechnen",
    "geburtstermin elternzeit planen",
  ],

  sourceTools: [
    {
      slug: "geburtstermin",
      detailEyebrow: "Termin und Schwangerschaftswoche im Detail",
      detailDescription:
        "Errechneter Termin und aktuelle SSW nach der Naegele-Regel.",
      backlinkDescription:
        "Diesen Termin direkt mit Einkommen, Elterngeld und Elternzeit weiterplanen.",
    },
    {
      slug: "bruttonetto",
      detailEyebrow: "Alle Angaben zum Einkommen",
      detailDescription: "Jeder Abzug einzeln, mit Steuerklassen-Vergleich.",
      backlinkDescription:
        "Dieses Netto mit Elterngeld und Kindergeld während der Elternzeit vergleichen.",
    },
    {
      slug: "elterngeld",
      detailEyebrow: "Basis und ElterngeldPlus im Vergleich",
      detailDescription:
        "Ersatzrate, Geschwisterbonus und Mehrlingszuschlag im Detail.",
      backlinkDescription:
        "Dieses Elterngeld mit dem Haushaltsnetto und dem Kindergeld zusammenrechnen.",
    },
    {
      slug: "kindergeld",
      detailEyebrow: "Alle Kinder und die Günstigerprüfung",
      detailDescription:
        "Kindergeld für mehrere Kinder und der Vergleich zum Kinderfreibetrag.",
      backlinkDescription:
        "Dieses Kindergeld mit Elterngeld und Haushaltsnetto während der Elternzeit zusammenrechnen.",
    },
    {
      slug: "elternzeit",
      detailEyebrow: "Fristen und Zeitstrahl im Detail",
      detailDescription:
        "Mutterschutz, Anmeldefristen und Lebensmonate frei einstellbar.",
      backlinkDescription:
        "Diesen Elternzeit-Plan mit Einkommen, Elterngeld und Kindergeld zusammenrechnen.",
    },
  ],

  getDefaultParams: () => ({ heute: todayIso() }),

  about,
  faq,

  monetization: {
    adDensity: "medium",
  },
};
