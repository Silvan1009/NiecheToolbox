/**
 * Erzeugt den Inhalt von /ads.txt.
 *
 * Die Datei sagt Anzeigen-Einkäufern, wer die Werbeplätze dieser Domain
 * verkaufen darf. Ohne sie kaufen viele Nachfragequellen gar nicht erst ein –
 * und Domain-Spoofing wird leichter.
 *
 * Spezifikation: IAB Tech Lab, ads.txt 1.1.
 */

/** Googles feste Kennung in der ads.txt-Spezifikation. */
const GOOGLE_TAG_ID = "f08c47fec0942fa0";

const CLIENT_ID_PATTERN = /^ca-pub-\d+$/;

/**
 * Liefert den Datensatz – oder `null`, wenn keine gültige Publisher-ID
 * vorliegt. `null` führt zu einer 404, nicht zu einer leeren Datei: eine
 * ads.txt ohne Einträge lesen manche Prüfer als „autorisiert niemanden" und
 * damit als aktive Absage an alle Einkäufer.
 */
export function buildAdsTxt(clientId: string): string | null {
  if (!CLIENT_ID_PATTERN.test(clientId)) return null;

  // In der ads.txt steht die Publisher-ID ohne `ca-`-Präfix.
  const publisherId = clientId.slice("ca-".length);

  return `google.com, ${publisherId}, DIRECT, ${GOOGLE_TAG_ID}\n`;
}
