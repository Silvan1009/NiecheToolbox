import type { AffiliateSlot } from "@/tools/types";
import type { NoticeResult } from "./logic";

function asResult(value: unknown): NoticeResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<NoticeResult>;
  return typeof candidate.end === "string" && typeof candidate.party === "string"
    ? (candidate as NoticeResult)
    : null;
}

export const kuendigungsfristAffiliate: AffiliateSlot[] = [
  {
    // Nur bei einer Kündigung durch die Gegenseite: dort steht wirklich etwas
    // auf dem Spiel. Wer selbst kündigt, braucht keinen Rechtsschutz-Hinweis.
    when: (result) => asResult(result)?.party === "vermieter",
    headline: "Kündigung erhalten und Zweifel am Grund?",
    body: "Eine Vermieterkündigung braucht einen gesetzlichen Grund. Eine Erstberatung klärt, ob er hier trägt.",
    partner: "mietrechtsschutz",
    label: "Mietrechtsberatung ansehen",
  },
];
