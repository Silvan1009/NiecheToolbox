"use client";

import { ads } from "@/config/site";
import { openConsentSettings } from "@/lib/consent";

/**
 * Widerruf jederzeit – öffnet den Dialog der zertifizierten CMP erneut.
 *
 * Rendert nichts, solange keine Werbung konfiguriert ist: dann gibt es auch
 * nichts zu widerrufen, und ein Knopf ins Leere wäre schlechter als keiner.
 */
export function ConsentSettingsButton({
  className = "",
}: {
  className?: string;
}) {
  if (!ads.enabled || !ads.clientId) return null;

  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className={`text-left underline decoration-line underline-offset-2 transition-colors duration-(--dur-fast) hover:text-ink ${className}`}
    >
      Einwilligung für Werbung ändern
    </button>
  );
}
