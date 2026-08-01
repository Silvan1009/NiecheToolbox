import type { AffiliateSlot } from "@/tools/types";
import type { AbfindungResult } from "./logic";

function abfindungssteuerVon(value: unknown): number {
  if (typeof value !== "object" || value === null) return 0;
  const steuer = (value as Partial<AbfindungResult>).steuerAufAbfindungFuenftel;
  return typeof steuer === "number" ? steuer : 0;
}

export const abfindungAffiliate: AffiliateSlot[] = [
  {
    when: (result) => abfindungssteuerVon(result) > 0,
    headline: "Die Steuererklärung für das Abfindungsjahr machen",
    body: "Der Arbeitgeber kennt beim Lohnsteuerabzug selten das restliche Jahreseinkommen genau – über die Steuererklärung lässt sich zu viel gezahlte Steuer zurückholen.",
    partner: "steuersoftware",
    label: "Steuersoftware vergleichen",
  },
];
