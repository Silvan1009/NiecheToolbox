import type { AffiliateSlot } from "@/tools/types";

/** Anzahl Personen – egal ob Gesamt- oder Je-Person-Ergebnis. */
function peopleCount(value: unknown): number {
  if (typeof value !== "object" || value === null) return 0;
  const people = (value as { people?: unknown }).people;
  if (typeof people === "number") return people;
  if (Array.isArray(people)) return people.length;
  return 0;
}

export const trinkgeldAffiliate: AffiliateSlot[] = [
  {
    // Erst ab einer größeren Gruppe interessant – vorher wäre es Füllmaterial.
    when: (result) => peopleCount(result) >= 5,
    headline: "Gemeinsame Ausgaben im Blick behalten",
    body: "Bei größeren Gruppen lohnt sich eine App, die mitzählt, wer was ausgelegt hat.",
    partner: "haushaltsbuch",
    label: "Haushaltsbuch-Apps ansehen",
  },
];
