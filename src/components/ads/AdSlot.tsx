"use client";

import { useEffect, useRef } from "react";
import { ads } from "@/config/site";
import { useConsentStatus } from "@/components/consent/useConsent";
import { adSlotAllowed, type AdDensity, type AdPlacement } from "@/lib/adPlacement";
import { useInView } from "@/lib/useInView";

interface AdsWindow extends Window {
  adsbygoogle?: unknown[];
}

/**
 * Werbeplatz. Rendert nichts, solange keine Einwilligung vorliegt – kein
 * Script, kein Pixel, kein Platzhalter-Request.
 *
 * Platzierung nur unter dem Ergebnis bzw. unter dem Erklärtext, nie über dem
 * Tool und nie zwischen Eingabefeldern (siehe lib/adPlacement.ts).
 *
 * Die Fläche reserviert ihre Höhe, damit der einlaufende Banner den Text nicht
 * nach unten schiebt. Bleibt sie unbefüllt, klappt sie per CSS wieder zusammen
 * – die Regel dazu steht in globals.css und greift über `data-ad-status`, das
 * AdSense selbst setzt.
 *
 * Das Laden von adsbygoogle.js liegt nicht hier, sondern einmal pro Dokument
 * in components/ads/AdsenseLoader.tsx.
 */
export function AdSlot({
  placement,
  density = "low",
}: {
  placement: AdPlacement;
  density?: AdDensity;
}) {
  const status = useConsentStatus();
  const pushed = useRef(false);
  const { ref, inView } = useInView<HTMLDivElement>();

  const slotId =
    placement === "below-result"
      ? ads.slots.belowResult
      : ads.slots.belowContent;

  const configured = ads.enabled && Boolean(ads.clientId) && Boolean(slotId);
  const allowed = adSlotAllowed(placement, density);
  const active = allowed && configured && status === "granted";

  useEffect(() => {
    if (!active || !inView || pushed.current) return;
    pushed.current = true;
    const w = window as AdsWindow;
    w.adsbygoogle = w.adsbygoogle ?? [];
    w.adsbygoogle.push({});
  }, [active, inView]);

  if (!allowed) return null;

  // Noch keine AdSense-Freischaltung: im Dev-Modus die Fläche sichtbar machen,
  // damit das Layout stimmt. In Produktion bleibt der Platz leer.
  if (!configured) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className="flex min-h-[250px] flex-col justify-center rounded-card border border-dashed border-line p-6 text-center text-[13px] text-muted sm:min-h-[280px]">
        Werbeplatz „{placement}“ – noch nicht konfiguriert
        <span className="mt-1 block text-[11px]">
          NEXT_PUBLIC_ADS_ENABLED, NEXT_PUBLIC_ADSENSE_CLIENT und Slot-ID in
          .env.local setzen
        </span>
      </div>
    );
  }

  if (status !== "granted") return null;

  return (
    <div ref={ref} className="ad-shell min-h-[250px] sm:min-h-[280px]">
      <p className="mb-1.5 text-center text-[11px] tracking-wide text-muted uppercase">
        Anzeige
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ads.clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(ads.testMode ? { "data-adtest": "on" } : {})}
      />
    </div>
  );
}
