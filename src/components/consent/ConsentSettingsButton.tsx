"use client";

import { resetConsent } from "@/lib/consent";

/** Erlaubt jederzeit den Widerruf – öffnet das Banner erneut. */
export function ConsentSettingsButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        resetConsent();
        window.scrollTo({ top: document.body.scrollHeight });
      }}
      className={`text-left underline decoration-line underline-offset-2 transition-colors duration-(--dur-fast) hover:text-ink ${className}`}
    >
      Werbe-Einstellungen ändern
    </button>
  );
}
