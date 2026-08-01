import type { AffiliateSlot } from "@/tools/types";
import type { KreditResult } from "./logic";

function asResult(value: unknown): KreditResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<KreditResult>;
  return typeof candidate.monatsrate === "number"
    ? (candidate as KreditResult)
    : null;
}

export const kreditAffiliate: AffiliateSlot[] = [
  {
    when: (result) => {
      const kredit = asResult(result);
      // Ab einem zweistelligen Zinssatz ist der Vergleich kein Feilschen um
      // Nachkommastellen mehr, sondern spart über die Laufzeit vierstellig.
      return kredit ? (kredit.effektiverJahreszins ?? 0) >= 9 : false;
    },
    headline: "Zu diesem Zins geht es fast immer günstiger",
    body: "Ein zweistelliger Effektivzins ist bei guter Bonität selten nötig. Schon zwei Prozentpunkte weniger sparen über die Laufzeit einen vierstelligen Betrag.",
    partner: "umschuldung",
    label: "Umschuldung prüfen",
  },
  {
    when: (result) => {
      const kredit = asResult(result);
      // Erst ab einer Summe, bei der ein halber Prozentpunkt spürbar wird.
      return kredit ? kredit.darlehen >= 10000 : false;
    },
    headline: "Ein Prozentpunkt entscheidet hier über Hunderte Euro",
    body: "Der beworbene Zins gilt meist nur für die beste Bonitätsklasse. Eine Konditionenanfrage ist schufaneutral und zeigt, was du tatsächlich bekommst.",
    partner: "kreditvergleich",
    label: "Kreditangebote vergleichen",
  },
];
