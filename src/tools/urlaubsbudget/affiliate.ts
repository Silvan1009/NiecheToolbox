import type { AffiliateSlot } from "@/tools/types";
import type { UrlaubResult } from "./logic";

function asResult(value: unknown): UrlaubResult | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Partial<UrlaubResult>;
  return typeof candidate.gesamtC === "number"
    ? (candidate as UrlaubResult)
    : null;
}

const posten = (result: UrlaubResult, label: string) =>
  result.posten.find((p) => p.label === label)?.betragC ?? 0;

export const urlaubsbudgetAffiliate: AffiliateSlot[] = [
  {
    when: (value) => {
      const result = asResult(value);
      // Die Unterkunft ist bei den meisten Reisen der größte Einzelposten –
      // dort lohnt der Vergleich am ehesten.
      return result ? posten(result, "Unterkunft") > 50000 : false;
    },
    headline: "Die Unterkunft ist dein größter Posten",
    body: "Bei mehreren Nächten entscheidet der Zimmerpreis über das halbe Budget. Ein Vergleich vor der Buchung bringt hier mehr als jedes Sparen vor Ort.",
    partner: "hotels",
    label: "Unterkünfte vergleichen",
  },
  {
    when: (value) => {
      const result = asResult(value);
      return result ? posten(result, "Transport vor Ort") > 20000 : false;
    },
    headline: "Mietwagen früh buchen zahlt sich aus",
    body: "Die Preise ziehen in den letzten Wochen vor der Reise am stärksten an – gerade in der Hauptsaison und auf Inseln.",
    partner: "mietwagen",
    label: "Mietwagen vergleichen",
  },
  {
    when: (value) => {
      const result = asResult(value);
      // Ab dieser Größenordnung ist der Reisepreis das Risiko, nicht die
      // Prämie: eine Stornierung kostet dann mehr als die Versicherung.
      return result ? result.gesamtC > 250000 : false;
    },
    headline: "Ab dieser Summe wird Stornoschutz zum Thema",
    body: "Eine Reiserücktrittsversicherung kostet meist drei bis fünf Prozent des Reisepreises. Bei einem Budget dieser Größe ist das die günstigere Seite des Risikos.",
    partner: "reiseversicherung",
    label: "Reiseversicherungen ansehen",
  },
];
