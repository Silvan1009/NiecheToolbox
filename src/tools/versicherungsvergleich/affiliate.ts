import type { AffiliateSlot } from "@/tools/types";
import type { SchaetzungResult, VersicherungsArt } from "./logic";

function artVon(value: unknown): VersicherungsArt | null {
  if (typeof value !== "object" || value === null) return null;
  const art = (value as Partial<SchaetzungResult>).art;
  return art ?? null;
}

export const versicherungsvergleichAffiliate: AffiliateSlot[] = [
  {
    when: (result) => artVon(result) === "kfz",
    headline: "Kfz-Versicherung vergleichen",
    body: "Bei gleicher Deckung unterscheiden sich die Beiträge zwischen Anbietern oft um mehrere Hundert Euro im Jahr.",
    partner: "kfzversicherung",
    label: "Tarife vergleichen",
  },
  {
    when: (result) => artVon(result) === "haftpflicht",
    headline: "Privathaftpflicht vergleichen",
    body: "Gute Tarife mit Forderungsausfalldeckung gibt es oft für weniger als den hier geschätzten Richtwert.",
    partner: "haftpflichtversicherung",
    label: "Tarife vergleichen",
  },
  {
    when: (result) => artVon(result) === "bu",
    headline: "BU-Beitrag mit einer echten Risikoprüfung klären",
    body: "Nur ein Versicherer kann anhand von Gesundheitsfragen und dem tatsächlichen Beruf einen verbindlichen Beitrag nennen.",
    partner: "berufsunfaehigkeitsversicherung",
    label: "Beratung finden",
  },
];
