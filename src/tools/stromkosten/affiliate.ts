import type { AffiliateSlot } from "@/tools/types";
import type { PowerResult } from "./logic";

function asResult(value: unknown): PowerResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<PowerResult>;
  return typeof candidate.costPerYear === "number"
    ? (candidate as PowerResult)
    : null;
}

export const stromkostenAffiliate: AffiliateSlot[] = [
  {
    // Erst wenn es wirklich weh tut. Bei 12 Euro im Jahr wäre ein
    // Tarifwechsel-Hinweis reine Füllung.
    when: (result) => (asResult(result)?.costPerYear ?? 0) >= 120,
    headline: "Bei diesem Verbrauch zählt der Arbeitspreis",
    body: "Ein Cent Unterschied je Kilowattstunde macht hier mehrere Euro im Jahr aus. Der Vergleich ist in zwei Minuten erledigt.",
    partner: "stromvergleich",
    label: "Stromtarife vergleichen",
  },
  {
    when: (result) => {
      const power = asResult(result);
      // Wer beim Standby unsicher ist, braucht eine Messung, keinen Tarif.
      return power
        ? power.standbyShare >= 30 && power.costPerYear < 120
        : false;
    },
    headline: "Erst messen, dann rechnen",
    body: "Standby-Werte stehen selten auf dem Typenschild. Ein Messgerät für die Steckdose zeigt, was wirklich fließt.",
    partner: "strommessgeraet",
    label: "Strommessgeräte ansehen",
  },
];
