import { Baby } from "lucide-react";
import { todayIso } from "@/lib/date";
import type { ToolManifest } from "@/tools/types";
import { elternzeitAffiliate } from "./affiliate";
import Component from "./Component";

export const elternzeit: ToolManifest = {
  slug: "elternzeit",
  name: "Elternzeit-Planer",
  tagline:
    "Lebensmonate, Mutterschutz und Anmeldefristen als ein Zeitstrahl – vom errechneten Termin an.",
  category: "familie",
  icon: Baby,
  status: "beta",
  keywords: [
    "elternzeit planen",
    "elternzeit rechner",
    "lebensmonate",
    "mutterschutz",
    "elterngeld monate",
    "partnermonate",
    "anmeldefrist elternzeit",
  ],

  Component,
  getDefaultParams: () => ({ heute: todayIso() }),

  about: [
    "Elternzeit wird in Lebensmonaten des Kindes gerechnet, nicht in Kalendermonaten: Der erste Lebensmonat beginnt am Geburtstag und endet am Tag vor dem gleichen Datum im Folgemonat. Genau danach richten sich Elterngeld-Monate und Anmeldefristen – deshalb rechnet der Planer alles aus dem Geburtstermin heraus.",
    "Drei Fristen entscheiden über Geld und Planbarkeit: Der Mutterschutz beginnt sechs Wochen vor dem errechneten Termin und endet acht Wochen nach der Geburt (zwölf bei Mehrlings- und Frühgeburten). Elternzeit muss dem Arbeitgeber spätestens sieben Wochen vor Beginn schriftlich mitgeteilt werden – für Zeiträume ab dem dritten Geburtstag sind es dreizehn Wochen. Und Elterngeld wird rückwirkend nur für drei Monate gezahlt: Wer zu spät beantragt, verliert die ersten Monate endgültig.",
    "Basiselterngeld gibt es für zwölf Lebensmonate. Zwei weitere Partnermonate kommen dazu, wenn beide Elternteile mindestens zwei Monate nehmen; Alleinerziehende bekommen die vierzehn Monate ohne diese Bedingung. Elternzeit selbst ist deutlich länger möglich – bis zu 36 Monate je Elternteil, davon bis zu 24 Monate zwischen dem dritten und dem achten Geburtstag. Diese Monate sind dann unbezahlt, sofern nicht ElterngeldPlus greift.",
    "Der Planer zeigt Zeiträume und Termine, er prüft keinen Einzelfall und berechnet keine Beträge. Wie hoch dein Elterngeld ausfällt, hängt vom Netto-Einkommen der letzten zwölf Monate ab – das klärt die Elterngeldstelle.",
  ],

  faq: [
    {
      question: "Was ist ein Lebensmonat?",
      answer:
        "Der erste Lebensmonat beginnt am Geburtstag des Kindes und endet am Tag vor demselben Datum im nächsten Monat. Ein Kind, das am 10. Juni geboren wird, hat den ersten Lebensmonat vom 10. Juni bis 9. Juli. Fällt der Geburtstag auf den 31., endet der Lebensmonat am letzten Tag des kürzeren Folgemonats.",
    },
    {
      question: "Wie lange dauert der Mutterschutz?",
      answer:
        "Sechs Wochen vor dem errechneten Termin und acht Wochen nach der Geburt. Bei Mehrlings- und Frühgeburten sind es zwölf Wochen danach. Die Schutzfrist nach der Geburt wird auf die Elternzeit angerechnet.",
    },
    {
      question: "Wann muss ich Elternzeit anmelden?",
      answer:
        "Spätestens sieben Wochen vor Beginn, schriftlich beim Arbeitgeber – und verbindlich für die ersten zwei Jahre. Für Zeiträume, die ab dem dritten Geburtstag liegen, beträgt die Frist dreizehn Wochen; dort kann der Arbeitgeber aus dringenden betrieblichen Gründen ablehnen.",
    },
    {
      question: "Wie viele Monate Elterngeld gibt es?",
      answer:
        "Basiselterngeld für zwölf Lebensmonate, plus zwei Partnermonate, wenn beide Elternteile mindestens zwei Monate nehmen – zusammen also vierzehn. Alleinerziehende erhalten die vierzehn Monate ohne diese Bedingung. ElterngeldPlus verdoppelt die Bezugsdauer bei halbem monatlichen Betrag.",
    },
    {
      question: "Kann ich Elternzeit nach dem dritten Geburtstag nehmen?",
      answer:
        "Ja, bis zu 24 der 36 Monate lassen sich auf die Zeit zwischen dem dritten und dem achten Geburtstag verschieben. Diese Monate sind unbezahlt und brauchen eine Anmeldung dreizehn Wochen vorher.",
    },
    {
      question: "Ist das eine verbindliche Auskunft?",
      answer:
        "Nein. Der Planer rechnet Zeiträume und Fristen aus und ersetzt keine Beratung. Verbindliche Auskünfte geben die Elterngeldstelle, dein Arbeitgeber oder eine Rechtsberatung.",
    },
  ],

  monetization: {
    adDensity: "low",
    affiliate: elternzeitAffiliate,
  },
};
