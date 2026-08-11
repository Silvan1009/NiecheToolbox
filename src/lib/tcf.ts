/**
 * Übersetzung des IAB-TCF-v2.2-Signals in unseren Einwilligungsstatus.
 *
 * Die Wahrheit über den Werbe-Consent liegt seit dem Wechsel auf eine
 * zertifizierte CMP (Google Funding Choices) ausschließlich in der TCF-API –
 * nicht mehr in einem eigenen Local-Storage-Eintrag. Dieses Modul ist der
 * einzige Ort, an dem TCF-Semantik interpretiert wird.
 *
 * Bewusst frei von React und von `window`: eine reine Funktion, damit die
 * Zuordnung testbar ist. Die Anbindung an `__tcfapi` liegt in lib/consent.ts.
 */

import type { ConsentStatus } from "./consent";

/** Google Advertising Products in der Global Vendor List. */
export const GOOGLE_VENDOR_ID = "755";

/**
 * Zweck 1 – „Informationen auf einem Endgerät speichern und/oder abrufen".
 * Das ist der Tatbestand des § 25 Abs. 1 TDDDG und damit das richtige Gate für
 * die Frage, ob das Werbe-Skript überhaupt geladen werden darf.
 */
export const STORAGE_PURPOSE_ID = "1";

type ConsentMap = Record<string, boolean | undefined>;

export interface TcfData {
  cmpStatus?: "stub" | "loading" | "loaded" | "error";
  eventStatus?: "tcloaded" | "cmpuishown" | "useractioncomplete";
  /** `undefined`, solange die CMP die Region noch nicht bestimmt hat. */
  gdprApplies?: boolean;
  purpose?: { consents?: ConsentMap; legitimateInterests?: ConsentMap };
  vendor?: { consents?: ConsentMap; legitimateInterests?: ConsentMap };
}

/**
 * Bildet den TCF-Zustand auf `granted` | `denied` | `unknown` ab.
 *
 * Die Regel ist eine rechtliche Entscheidung, keine technische:
 *
 * - Solange die CMP nicht fertig geladen ist oder ihr Dialog offen steht, ist
 *   der Status `unknown` – wir warten, laden aber nichts.
 * - Ein Fehler der CMP führt zu `denied`, nicht zu einer Hängepartie:
 *   im Zweifel keine Werbung.
 * - Außerhalb des Geltungsbereichs der DSGVO (`gdprApplies === false`) gibt es
 *   keine TCF-Anforderung; dort ist Laden erlaubt.
 * - Innerhalb: nur wenn sowohl Zweck 1 als auch Google als Anbieter eine
 *   *Einwilligung* haben. Berechtigtes Interesse genügt für Zweck 1 nicht –
 *   § 25 TDDDG kennt diese Rechtsgrundlage für den Zugriff aufs Endgerät nicht.
 *
 * Auf Personalisierung (Zwecke 3 und 4) wird bewusst nicht verzweigt: Google
 * liest den TC-String selbst und schaltet eigenständig auf nicht-personalisierte
 * Anzeigen zurück. Wir entscheiden hier nur über das Laden.
 */
export function deriveConsentStatus(
  tcData: TcfData | null | undefined,
): ConsentStatus {
  if (!tcData) return "unknown";
  if (tcData.cmpStatus === "error") return "denied";
  if (tcData.cmpStatus !== "loaded") return "unknown";

  // Der Dialog steht offen – die Person hat noch nicht entschieden.
  if (tcData.eventStatus === "cmpuishown") return "unknown";

  if (tcData.gdprApplies === false) return "granted";
  // `undefined` heißt: Region noch nicht bestimmt. Nicht raten.
  if (tcData.gdprApplies !== true) return "unknown";

  const purposeOk = tcData.purpose?.consents?.[STORAGE_PURPOSE_ID] === true;
  const vendorOk = tcData.vendor?.consents?.[GOOGLE_VENDOR_ID] === true;

  return purposeOk && vendorOk ? "granted" : "denied";
}
