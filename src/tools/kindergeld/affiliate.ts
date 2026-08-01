import type { AffiliateSlot } from "@/tools/types";
import type { KindergeldResult } from "./logic";

function asResult(value: unknown): KindergeldResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<KindergeldResult>;
  return typeof candidate.monatlichC === "number"
    ? (candidate as KindergeldResult)
    : null;
}

export const kindergeldAffiliate: AffiliateSlot[] = [
  {
    when: (value) => {
      const result = asResult(value);
      // Gewinnt der Freibetrag, entsteht der Vorteil erst in der
      // Steuererklärung – vorher passiert nichts von allein.
      return result ? result.guenstiger === "freibetrag" : false;
    },
    headline: "Diesen Vorteil gibt es nur mit Steuererklärung",
    body: "Das Finanzamt prüft den Kinderfreibetrag von Amts wegen – aber nur, wenn eine Erklärung vorliegt. Ohne sie bleibt es beim Kindergeld.",
    partner: "steuersoftware",
    label: "Steuersoftware vergleichen",
  },
  {
    when: (value) => {
      const result = asResult(value);
      // Ein sehr junges Kind heißt: fast der volle Anspruch liegt noch vorn.
      return result ? result.restanspruchGesamtC > 4000000 : false;
    },
    headline: "Über 40.000 Euro liegen noch vor dir",
    body: "Kindergeld ist über die Jahre eine der größten planbaren Einnahmen einer Familie. Wer es getrennt führt, sieht, was tatsächlich davon bleibt.",
    partner: "haushaltsbuch",
    label: "Haushaltsbuch ansehen",
  },
  {
    when: (value) => {
      const result = asResult(value);
      if (!result) return false;
      // Ein Kind unter einem Jahr: hier stehen Elterngeld und Anträge an.
      return result.kinder.some((kind) => kind.alter < 1);
    },
    headline: "Neben dem Kindergeld läuft die Elterngeld-Frist",
    body: "Elterngeld wird rückwirkend nur für drei Monate gezahlt. Wer zu spät beantragt, verliert die ersten Monate endgültig.",
    partner: "elterngeldberatung",
    label: "Elterngeld-Beratung ansehen",
  },
];
