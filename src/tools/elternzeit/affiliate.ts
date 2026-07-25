import type { AffiliateSlot } from "@/tools/types";
import type { ElternzeitResult } from "./logic";

function asResult(value: unknown): ElternzeitResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<ElternzeitResult>;
  return typeof candidate.totalMonths === "number" && candidate.elterngeld
    ? (candidate as ElternzeitResult)
    : null;
}

export const elternzeitAffiliate: AffiliateSlot[] = [
  {
    // Nur wenn Monate unbezahlt bleiben – dann lohnt sich eine Beratung wirklich.
    when: (result) => (asResult(result)?.elterngeld.uncoveredMonths ?? 0) > 0,
    headline: "Mehr Monate als Elterngeld – ElterngeldPlus prüfen",
    body: "ElterngeldPlus verdoppelt die Bezugsdauer bei halbem Betrag. Ob sich das rechnet, hängt vom Einkommen ab.",
    partner: "elterngeldberatung",
    label: "Elterngeld-Rechner ansehen",
  },
];
