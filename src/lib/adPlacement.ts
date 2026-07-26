/**
 * Die Platzierungsregel der Seite – an einer Stelle, testbar.
 *
 * Nie über dem Tool, nie zwischen Eingabefeldern. Ein Slot unter dem Ergebnis,
 * ein zweiter nur dort, wo der Erklärtext lang genug ist, um ihn zu tragen.
 * Das ist eine Produktentscheidung und keine Formalie: sie ist der Grund, warum
 * die Rechner auch mit Werbung noch benutzbar sind.
 */

export type AdPlacement = "below-result" | "below-content";

/** Voreinstellung ist `low`; `none` schaltet ein Tool ganz werbefrei. */
export type AdDensity = "none" | "low" | "medium";

/**
 * Darf an dieser Stelle bei dieser Dichte ein Werbeplatz stehen?
 *
 * `below-result` ist die Hauptplatzierung und läuft ab `low`.
 * `below-content` kommt erst bei `medium` dazu – also nur bei den Tools mit
 * ausführlichem Erklärtext, wo der zweite Slot nicht direkt auf den ersten
 * folgt.
 */
export function adSlotAllowed(
  placement: AdPlacement,
  density: AdDensity,
): boolean {
  if (density === "none") return false;
  if (placement === "below-result") return true;
  return density === "medium";
}
