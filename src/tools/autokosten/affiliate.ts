import type { AffiliateSlot } from "@/tools/types";
import type { AutokostenResult } from "./logic";

function versicherungAnteil(value: unknown): number {
  if (typeof value !== "object" || value === null) return 0;
  const posten = (value as Partial<AutokostenResult>).posten;
  if (!Array.isArray(posten)) return 0;
  return posten.find((p) => p.label === "Versicherung")?.anteilProzent ?? 0;
}

export const autokostenAffiliate: AffiliateSlot[] = [
  {
    // Nur relevant, wenn die Versicherung tatsächlich spürbar ins Gewicht fällt.
    when: (result) => versicherungAnteil(result) >= 8,
    headline: "Kfz-Versicherung vergleichen",
    body: "Die Beiträge unterscheiden sich je nach Anbieter oft um mehrere Hundert Euro im Jahr für denselben Schutz.",
    partner: "kfzversicherung",
    label: "Tarife vergleichen",
  },
];
