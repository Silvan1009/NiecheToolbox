import type { AffiliateSlot } from "@/tools/types";
import type { AktienResult } from "./logic";

function asResult(value: unknown): AktienResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<AktienResult>;
  return typeof candidate.marktkapitalisierungMio === "number"
    ? (candidate as AktienResult)
    : null;
}

export const aktienAffiliate: AffiliateSlot[] = [
  {
    // Wer eine Dividende einträgt, hält oder plant eine Position – dann sind
    // die Ordergebühren und die Verwahrung des Depots ein echtes Thema.
    when: (result) => (asResult(result)?.dividendenrendite ?? 0) > 0,
    headline: "Ordergebühren kosten mehr Rendite als die meisten glauben",
    body: "Bei einer Sparrate von 300 Euro im Monat macht ein Prozentpunkt Gebührenunterschied über zwanzig Jahre einen fünfstelligen Betrag aus. Ein Depotvergleich ist in zehn Minuten erledigt.",
    partner: "depotvergleich",
    label: "Depots vergleichen",
  },
  {
    when: (result) => {
      const aktie = asResult(result);
      // Wenn der Gewinn nicht als Geld ankommt oder die Verschuldung hoch ist,
      // reicht ein Kennzahlenblick nicht – dann lohnt der Griff zu den Zahlen
      // hinter den Zahlen.
      if (!aktie) return false;
      const qualitaet = aktie.gewinnqualitaet;
      const schulden = aktie.nettoschuldenEbitda;
      return (qualitaet !== null && qualitaet < 80) || (schulden !== null && schulden > 3.5);
    },
    headline: "Diese Bilanz verdient einen zweiten Blick",
    body: "Ein Gewinn, der nicht als Geld ankommt, oder eine hohe Schuldenlast lässt sich mit Kennzahlen allein nicht beurteilen. Der Geschäftsbericht und eine Branchenanalyse sagen mehr.",
    partner: "aktienanalyse",
    label: "Aktienanalysen ansehen",
  },
];
