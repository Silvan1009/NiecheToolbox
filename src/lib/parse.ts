/** Zahlen, die von außen kommen: aus der URL oder einem Eingabefeld. Das Gegenstück zu format.ts. */

/**
 * Deutsches Dezimalkomma erlauben; alles Unbrauchbare fällt auf `fallback`.
 *
 * Der fehlende Wert muss ausdrücklich abgefangen werden: `URLSearchParams.get`
 * liefert `null`, wenn ein Schlüssel nicht in der URL steht, und `Number(null)`
 * ist 0 – ohne diese Prüfung würde ein von Hand gekürzter Link jedes nicht
 * enthaltene Feld auf null setzen. Da bewusst nur Abweichungen vom Default in
 * der URL landen, wäre das der Normalfall und nicht die Ausnahme.
 *
 * Negative Werte werden verworfen: Jedes Feld, das diese Funktion füttert, ist
 * ein Betrag, eine Stückzahl, ein Jahr oder ein Satz. Ein Kaufpreis von -5 ist
 * kein Sonderfall, den man durchrechnet, sondern ein Tippfehler. Wo ein
 * Vorzeichen sinnvoll ist – ein Verlust in der Bilanz –, steht parseNumberInput.
 */
export function toNumber(value: unknown, fallback: number): number {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed =
    typeof value === "string" ? Number(value.replace(",", ".")) : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

/**
 * Wie `toNumber`, aber mit Vorzeichen und mit Tausenderpunkten – und `null`
 * statt eines Fallbacks, solange noch keine lesbare Zahl dasteht.
 *
 * `null` heißt „der Nutzer tippt noch": nach dem ersten Minuszeichen steht
 * keine Zahl da, und ein Fallback an dieser Stelle würde das Zeichen sofort
 * wieder verwerfen. Ein Verlust ist bei Bilanzkennzahlen kein Eingabefehler,
 * sondern der Gegenstand: Verlustjahre, negatives Eigenkapital und
 * schrumpfende Gewinne gehören zur Aktienanalyse dazu.
 */
export function parseNumberInput(text: string): number | null {
  const roh = text.trim().replace(/[\s€%]/g, "");
  if (roh === "") return null;

  const normalisiert = roh.includes(",")
    ? roh.replace(/\./g, "").replace(",", ".")
    : /^-?\d{1,3}(\.\d{3})+$/.test(roh)
      ? roh.replace(/\./g, "")
      : roh;

  if (!/^-?\d*\.?\d*$/.test(normalisiert)) return null;
  const parsed = Number(normalisiert);
  return Number.isFinite(parsed) ? parsed : null;
}

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
