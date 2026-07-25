import type { AffiliateSlot } from "@/tools/types";
import type { MoveResult } from "./logic";

function asResult(value: unknown): MoveResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<MoveResult>;
  return typeof candidate.totalBoxes === "number"
    ? (candidate as MoveResult)
    : null;
}

export const umzugAffiliate: AffiliateSlot[] = [
  {
    // Ab einem Lkw wird Selbermachen unrealistisch: Führerschein, Rampe,
    // Haftung. Dann ist die Firma der ehrlichere Hinweis als Kartons.
    when: (result) => (asResult(result)?.van.volume ?? 0) >= 40,
    headline: "Bei dieser Menge lohnt sich ein Angebot",
    body: "Ab 7,5 Tonnen braucht es einen C1-Führerschein. Mehrere Angebote zu vergleichen kostet nichts.",
    partner: "umzugsfirma",
    label: "Umzugsangebote vergleichen",
  },
  {
    when: (result) => {
      const boxes = asResult(result)?.totalBoxes ?? 0;
      const van = asResult(result)?.van.volume ?? 0;
      // Sonst: die Kartons, die der Rechner gerade ausgezählt hat.
      return boxes >= 10 && van < 40;
    },
    headline: "Kartons im Set sind deutlich günstiger",
    body: "Einzeln gekauft kostet ein Umzugskarton das Doppelte. Bücherkartons ruhig separat dazunehmen.",
    partner: "umzugskartons",
    label: "Umzugskartons ansehen",
  },
];
