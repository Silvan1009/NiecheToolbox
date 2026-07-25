import type { AffiliateSlot } from "@/tools/types";
import type { BrueckentageResult } from "./logic";

/**
 * Eigenes Modul, damit Manifest (Server) und Component (Client) dieselben
 * Slots nutzen können, ohne dass ein Import-Zyklus entsteht.
 */

function asResult(value: unknown): BrueckentageResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<BrueckentageResult>;
  return typeof candidate.year === "number" && Array.isArray(candidate.occasions)
    ? (candidate as BrueckentageResult)
    : null;
}

const freeDays = (value: unknown) => asResult(value)?.best?.freeDays ?? 0;

/** Reihenfolge = Priorität: der erste passende Slot wird gezeigt. */
export const brueckentageAffiliate: AffiliateSlot[] = [
  {
    when: (result) => freeDays(result) >= 7,
    headline: "Diese Tage am Stück clever nutzen",
    body: "Ab einer Woche lohnt sich eine richtige Reise – und außerhalb der Schulferien ist es deutlich günstiger.",
    partner: "kurzreisen",
    label: "Kurzreisen ansehen",
  },
  {
    when: (result) => freeDays(result) >= 4,
    headline: "Lange Wochenenden sind perfekt für einen Städtetrip",
    body: "Vier Tage reichen für eine Stadt, die du noch nicht kennst.",
    partner: "bahn",
    label: "Bahn-Angebote ansehen",
  },
];
