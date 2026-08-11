import type { AffiliateSlot } from "@/tools/types";
import type { BruttoNettoResult } from "./logic";

function asResult(value: unknown): BruttoNettoResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<BruttoNettoResult>;
  return typeof candidate.nettoMonat === "number"
    ? (candidate as BruttoNettoResult)
    : null;
}

export const bruttonettoAffiliate: AffiliateSlot[] = [
  {
    when: (result) => {
      const bn = asResult(result);
      // Ab einer vierstelligen Jahressteuer lohnt der Blick auf die
      // Steuererklärung – darunter ist die mögliche Erstattung klein.
      return bn ? bn.steuernGesamtJahr >= 3000 : false;
    },
    headline: "Ein Teil davon kommt über die Steuererklärung zurück",
    body: "Werbungskosten über 1.230 Euro, Fahrtkosten, Handwerkerleistungen und Kirchensteuer mindern die Steuer nachträglich. Vier Jahre rückwirkend möglich.",
    partner: "haushaltsbuch",
    label: "Steuererklärung angehen",
  },
];
