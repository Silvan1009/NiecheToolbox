import type { AffiliateSlot } from "@/tools/types";
import type { ConversionResult } from "./logic";

function asResult(value: unknown): ConversionResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<ConversionResult>;
  return typeof candidate.factor === "number"
    ? (candidate as ConversionResult)
    : null;
}

export const backformAffiliate: AffiliateSlot[] = [
  {
    // Nur wenn der Sprung groß ist: dann ist die passende Form die bessere
    // Lösung als eine krumme Umrechnung.
    when: (result) => {
      const factor = asResult(result)?.factor ?? 1;
      return factor > 1.8 || factor < 0.55;
    },
    headline: "Die passende Form spart das Umrechnen",
    body: "Bei so einem Sprung lohnt sich die im Rezept genannte Größe – Springformen gibt es in jedem Zentimeterschritt.",
    partner: "backformen",
    label: "Backformen ansehen",
  },
];
