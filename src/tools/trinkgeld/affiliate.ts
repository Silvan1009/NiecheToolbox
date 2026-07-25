import type { AffiliateSlot } from "@/tools/types";
import type { TipResult } from "./logic";

function asResult(value: unknown): TipResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<TipResult>;
  return typeof candidate.perPerson === "number" &&
    typeof candidate.people === "number"
    ? (candidate as TipResult)
    : null;
}

export const trinkgeldAffiliate: AffiliateSlot[] = [
  {
    // Erst ab einer größeren Gruppe interessant – vorher wäre es Füllmaterial.
    when: (result) => (asResult(result)?.people ?? 0) >= 5,
    headline: "Gemeinsame Ausgaben im Blick behalten",
    body: "Bei größeren Gruppen lohnt sich eine App, die mitzählt, wer was ausgelegt hat.",
    partner: "haushaltsbuch",
    label: "Haushaltsbuch-Apps ansehen",
  },
];
