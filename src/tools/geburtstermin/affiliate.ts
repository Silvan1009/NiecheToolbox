import type { AffiliateSlot } from "@/tools/types";
import type { GeburtsterminResult } from "./logic";

function asResult(value: unknown): GeburtsterminResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<GeburtsterminResult>;
  return typeof candidate.gueltig === "boolean"
    ? (candidate as GeburtsterminResult)
    : null;
}

export const geburtsterminAffiliate: AffiliateSlot[] = [
  {
    when: (value) => asResult(value)?.gueltig ?? false,
    headline: "Bald ist es so weit – und dann?",
    body: "Elterngeld wird rückwirkend nur für drei Monate gezahlt. Wer sich früh informiert, verliert keine Monate durch eine späte Antragstellung.",
    partner: "elterngeldberatung",
    label: "Elterngeld-Rechner ansehen",
  },
];
