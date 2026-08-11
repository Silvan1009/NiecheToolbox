import type { AffiliateSlot } from "@/tools/types";
import type { HauskaufUrteil } from "./urteil";

function asUrteil(value: unknown): HauskaufUrteil | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<HauskaufUrteil>;
  return typeof candidate.einstufung === "string"
    ? (candidate as HauskaufUrteil)
    : null;
}

export const hauskaufAffiliate: AffiliateSlot[] = [
  {
    // Ein Finanzierungsvergleich lohnt sich, wenn der Kauf überhaupt tragbar
    // aussieht. Bei "eng" ist die Baufinanzierung nicht das eigentliche
    // Problem – da hilft ein anderer Kaufpreis oder mehr Eigenkapital mehr
    // als ein Zehntel Prozentpunkt.
    when: (result) => {
      const einstufung = asUrteil(result)?.einstufung;
      return einstufung === "komfortabel" || einstufung === "tragbar";
    },
    headline: "Auch bei einer tragbaren Rate lohnt sich der Vergleich",
    body: "Ein Zehntel Prozentpunkt macht über die Zinsbindung schnell einen vierstelligen Unterschied. Ein Vergleich mehrerer Banken kostet nichts.",
    partner: "baufinanzierung",
    label: "Baufinanzierung vergleichen",
  },
];
