import type { AffiliateSlot } from "@/tools/types";
import type { RentenlueckeResult } from "./logic";

function kapitalLuecke(value: unknown): number {
  if (typeof value !== "object" || value === null) return 0;
  const luecke = (value as Partial<RentenlueckeResult>).kapitalLuecke;
  return typeof luecke === "number" ? luecke : 0;
}

export const rentenlueckeAffiliate: AffiliateSlot[] = [
  {
    // Erst relevant, wenn tatsächlich noch Kapital fehlt – sonst wäre der
    // Hinweis Werbung ohne Bezug zum eigenen Ergebnis.
    when: (result) => kapitalLuecke(result) > 0,
    headline: "Die zusätzliche Sparrate anlegen",
    body: "Um die Kapitallücke zu schließen, braucht es ein Depot, das die zusätzliche Sparrate über Jahrzehnte trägt.",
    partner: "depotvergleich",
    label: "Depots vergleichen",
  },
];
