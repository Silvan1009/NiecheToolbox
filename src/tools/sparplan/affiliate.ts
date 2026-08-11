import type { AffiliateSlot } from "@/tools/types";
import type { SparplanResult } from "./logic";

function asResult(value: unknown): SparplanResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<SparplanResult>;
  return typeof candidate.endkapital === "number"
    ? (candidate as SparplanResult)
    : null;
}

export const sparplanAffiliate: AffiliateSlot[] = [
  {
    // Erst ab einer Summe, bei der ein Zehntelprozentpunkt Gebühr spürbar
    // wird. Bei 20.000 Euro Endkapital wären das ein paar Euro im Jahr –
    // dafür lohnt kein Depotwechsel.
    when: (result) => (asResult(result)?.endkapital ?? 0) >= 50000,
    headline: "Ein Zehntelprozent Gebühr entscheidet über Tausende Euro",
    body: "Die laufenden Kosten wirken jedes Jahr auf den gesamten Bestand, nicht auf die Einzahlung. Über die Laufzeit dieses Sparplans macht das einen vierstelligen Unterschied.",
    partner: "depotvergleich",
    label: "Depots und Sparplan-Gebühren vergleichen",
  },
  {
    when: (result) => {
      const plan = asResult(result);
      // Wer laufende Vorabpauschale zahlt, hat ein Depot in einer
      // Größenordnung, in der die Ordergebühren des Brokers ins Gewicht fallen.
      return plan ? plan.steuerLaufend > 0 : false;
    },
    headline: "Ab dieser Depotgröße zahlst du jedes Jahr Vorabpauschale",
    body: "Die Bank zieht sie im Januar vom Verrechnungskonto ein. Ein Broker mit kostenlosen Sparplanausführungen und einem verzinsten Verrechnungskonto spart hier doppelt.",
    partner: "depotvergleich",
    label: "Broker vergleichen",
  },
];
