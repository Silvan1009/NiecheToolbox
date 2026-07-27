import type { AffiliateSlot } from "@/tools/types";
import type { ImmobilienResult } from "./logic";

function asResult(value: unknown): ImmobilienResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<ImmobilienResult>;
  return typeof candidate.darlehen === "number"
    ? (candidate as ImmobilienResult)
    : null;
}

export const immobilienAffiliate: AffiliateSlot[] = [
  {
    // Erst ab einer Summe, bei der ein Zehntel Prozentpunkt spürbar wird.
    // Bei 50.000 Euro Darlehen wären das rund 50 Euro im Jahr – zu wenig,
    // um dafür einen Vergleich zu empfehlen.
    when: (result) => (asResult(result)?.darlehen ?? 0) >= 100000,
    headline: "Ein Zehntel Prozentpunkt entscheidet über Tausende Euro",
    body: "Bei dieser Darlehenssumme macht schon ein kleiner Zinsunterschied über die Zinsbindung einen vierstelligen Betrag aus. Ein Vergleich mehrerer Banken kostet nichts.",
    partner: "baufinanzierung",
    label: "Baufinanzierung vergleichen",
  },
  {
    when: (result) => {
      const immo = asResult(result);
      // Wer teuer kauft und wenig finanziert, hat kein Zins- sondern ein
      // Preisproblem. Dann hilft eine Bewertung mehr als ein Kreditvergleich.
      return immo ? immo.kaufpreisfaktor >= 28 && immo.darlehen < 100000 : false;
    },
    headline: "Zu diesem Preis muss die Lage stimmen",
    body: "Der Kaufpreis liegt beim 28-Fachen der Jahresmiete oder darüber. Eine unabhängige Bewertung zeigt, ob der Preis zum Objekt passt.",
    partner: "immobilienbewertung",
    label: "Immobilie bewerten lassen",
  },
];
