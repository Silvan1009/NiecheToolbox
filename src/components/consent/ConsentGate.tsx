"use client";

import Link from "next/link";
import { useEffect } from "react";
import { initConsentMode, setConsent } from "@/lib/consent";
import { useHydrated } from "@/lib/useHydrated";
import { useConsentStatus } from "./useConsent";

/**
 * Einwilligungs-Banner für Werbung.
 *
 * "Ablehnen" und "Zulassen" sind gleich groß, gleich prominent und gleich
 * leicht erreichbar. Ohne Entscheidung lädt keine Werbung. Das Banner blockiert
 * die Seite nicht – die Tools sind ohne Einwilligung voll nutzbar.
 */
export function ConsentGate() {
  const status = useConsentStatus();
  const hydrated = useHydrated();

  // Consent Mode v2 mit "denied" initialisieren, bevor irgendein Google-Tag
  // laden könnte.
  useEffect(() => {
    initConsentMode();
  }, []);

  if (!hydrated || status !== "unknown") return null;

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      /* Kompakte Karte statt breitem Balken: verdeckt weniger Inhalt – und
         bleibt klein genug, um nicht das größte Element der Seite zu werden.
         Sonst würde dieses erst nach dem Hydrieren gezeichnete Banner die
         Largest-Contentful-Paint-Messung an sich ziehen. */
      className="fixed inset-x-0 bottom-0 z-40 p-3 sm:right-auto sm:max-w-sm sm:p-4"
    >
      <div className="surface-soft p-5 shadow-lift">
        <h2
          id="consent-title"
          className="font-display text-base font-semibold text-ink"
        >
          Werbung erlauben?
        </h2>
        <p id="consent-body" className="mt-2 text-sm text-muted">
          Die Rechner sind kostenlos und finanzieren sich über Anzeigen. Ohne
          deine Einwilligung laden wir keine – alles funktioniert trotzdem.{" "}
          <Link
            href="/rechtliches/datenschutz"
            className="underline decoration-line underline-offset-2 hover:text-ink"
          >
            Datenschutz
          </Link>
        </p>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="h-11 flex-1 rounded-control bg-ink px-5 text-sm font-semibold text-white transition-colors duration-(--dur-fast) hover:bg-ink/90"
          >
            Ablehnen
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="h-11 flex-1 rounded-control bg-accent px-5 text-sm font-semibold text-white transition-colors duration-(--dur-fast) hover:bg-accent-600"
          >
            Werbung zulassen
          </button>
        </div>
      </div>
    </div>
  );
}
