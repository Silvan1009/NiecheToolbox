import type { AffiliateSlot } from "@/tools/types";
import type { RentenabschlagResult } from "./logic";

function abschlagVon(value: unknown): number {
  if (typeof value !== "object" || value === null) return 0;
  const abschlag = (value as Partial<RentenabschlagResult>).abschlagProzent;
  return typeof abschlag === "number" ? abschlag : 0;
}

export const rentenabschlagAffiliate: AffiliateSlot[] = [
  {
    // Nur relevant, wenn tatsächlich ein Abschlag droht, den privates Vermögen ausgleichen könnte.
    when: (result) => abschlagVon(result) > 0,
    headline: "Den Abschlag privat ausgleichen",
    body: "Wer den lebenslangen Abschlag ganz oder teilweise ausgleichen will, kann das über zusätzliches Kapital in einem ETF-Depot planen.",
    partner: "depotvergleich",
    label: "Depots vergleichen",
  },
];
