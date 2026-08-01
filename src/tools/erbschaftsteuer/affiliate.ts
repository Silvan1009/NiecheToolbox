import type { AffiliateSlot } from "@/tools/types";
import type { ErbschaftResult } from "./logic";

function steuerVon(value: unknown): number {
  if (typeof value !== "object" || value === null) return 0;
  const steuer = (value as Partial<ErbschaftResult>).steuer;
  return typeof steuer === "number" ? steuer : 0;
}

export const erbschaftsteuerAffiliate: AffiliateSlot[] = [
  {
    // Nur relevant, wenn tatsächlich eine Erbschaftsteuererklärung fällig wird.
    when: (result) => steuerVon(result) > 0,
    headline: "Die Steuererklärung dafür einreichen",
    body: "Sobald Erbschaft- oder Schenkungsteuer anfällt, verlangt das Finanzamt eine eigene Steuererklärung dafür.",
    partner: "steuersoftware",
    label: "Steuersoftware vergleichen",
  },
];
