import type { AffiliateSlot } from "@/tools/types";
import type { ReadingResult } from "./logic";

function asResult(value: unknown): ReadingResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<ReadingResult>;
  return typeof candidate.words === "number" &&
    typeof candidate.readingSeconds === "number"
    ? (candidate as ReadingResult)
    : null;
}

export const lesezeitAffiliate: AffiliateSlot[] = [
  {
    // Ab einer halben Stunde Lesezeit ist Hören die realistischere Option.
    when: (result) => (asResult(result)?.readingSeconds ?? 0) >= 1800,
    headline: "Über eine halbe Stunde Lesezeit",
    body: "So lange Texte hört man unterwegs oft lieber, als sie zu lesen.",
    partner: "hoerbuecher",
    label: "Hörbuch-Angebote ansehen",
  },
];
