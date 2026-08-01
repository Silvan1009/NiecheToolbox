import type { AffiliateSlot } from "@/tools/types";
import type { PartyResult } from "./logic";

function asResult(value: unknown): PartyResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<PartyResult>;
  return typeof candidate.guests === "number"
    ? (candidate as PartyResult)
    : null;
}

/** Getränke in Litern über alle Zeilen zusammen. */
function totalDrinkLitres(result: PartyResult): number {
  return result.drinks
    .filter((item) => item.unit === "l")
    .reduce((sum, item) => sum + item.amount, 0);
}

export const partymengenAffiliate: AffiliateSlot[] = [
  {
    // Ab etwa 40 Litern trägt man das nicht mehr selbst aus dem Markt.
    when: (result) => {
      const party = asResult(result);
      return party ? totalDrinkLitres(party) >= 40 : false;
    },
    headline: "Getränke liefern lassen spart das Schleppen",
    body: "Bei dieser Menge kommen mehrere Kisten zusammen. Lieferdienste nehmen leere Kisten meist gleich wieder mit.",
    partner: "getraenkelieferung",
    label: "Getränkelieferung ansehen",
  },
];
