import type { AffiliateSlot } from "@/tools/types";
import type { EnergieResult } from "./logic";

function asResult(value: unknown): EnergieResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<EnergieResult>;
  return typeof candidate.jahreskostenC === "number"
    ? (candidate as EnergieResult)
    : null;
}

/** Preis je Sparte, in ct/kWh – oberhalb dessen lohnt der Vergleich wirklich. */
const teuer = (
  result: EnergieResult,
  art: "strom" | "gas",
  schwelle: number,
) => {
  const sparte = result.sparten.find((s) => s.art === art);
  if (!sparte || sparte.effektivpreisCt === null) return false;
  return sparte.effektivpreisCt > schwelle;
};

export const energiekostenAffiliate: AffiliateSlot[] = [
  {
    when: (value) => {
      const result = asResult(value);
      return result ? teuer(result, "strom", 40) : false;
    },
    headline: "Bei diesem Strompreis liegt Geld auf der Straße",
    body: "Dein Effektivpreis liegt über dem, was Neukundentarife derzeit verlangen. Der Wechsel ist der einzige Hebel, der ohne Verhaltensänderung wirkt.",
    partner: "stromvergleich",
    label: "Stromtarife vergleichen",
  },
  {
    when: (value) => {
      const result = asResult(value);
      return result ? teuer(result, "gas", 14) : false;
    },
    headline: "Der Gaspreis ist der größere Posten",
    body: "Beim Heizen geht es um ein Vielfaches der Kilowattstunden – ein Cent Unterschied wiegt hier schwerer als beim Strom.",
    partner: "gasvergleich",
    label: "Gastarife vergleichen",
  },
  {
    when: (value) => {
      const result = asResult(value);
      // Eine vierstellige Nachzahlung ist der Moment, in dem Leute anfangen,
      // ihren Verbrauch überhaupt zu messen.
      return result ? result.differenzC > 30000 : false;
    },
    headline: "Erst messen, dann sparen",
    body: "Eine Nachzahlung in dieser Höhe hat meist zwei oder drei Verursacher im Haushalt. Ein Messgerät für die Steckdose findet sie an einem Wochenende.",
    partner: "strommessgeraet",
    label: "Strommessgeräte ansehen",
  },
];
