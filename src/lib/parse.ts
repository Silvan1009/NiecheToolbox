/** Zahlen, die von außen kommen: aus der URL oder einem Eingabefeld. Das Gegenstück zu format.ts. */

/**
 * Leerer String heißt: Schlüssel aus der URL entfernen.
 *
 * Bewusst nur Abweichungen vom Default landen in der Query – sonst wäre ein
 * geteilter Link bei vielen Feldern schnell unleserlich lang.
 */
export const urlValue = (
  value: string | number,
  fallback: string | number,
): string => (value === fallback ? "" : String(value));
