"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { ads } from "@/config/site";
import { useConsentStatus } from "./consent/useConsent";
import type { ToolMonetization } from "@/tools/types";

type Placement = "below-result" | "below-content";

interface AdsWindow extends Window {
  adsbygoogle?: unknown[];
}

/**
 * Werbeplatz. Rendert nichts, solange keine Einwilligung vorliegt – kein
 * Script, kein Pixel, kein Platzhalter-Request.
 *
 * Platzierung nur unter dem Ergebnis bzw. unter dem Erklärtext, nie über dem
 * Tool und nie zwischen Eingabefeldern.
 */
export function AdSlot({
  placement,
  density = "low",
}: {
  placement: Placement;
  density?: NonNullable<ToolMonetization["adDensity"]>;
}) {
  const status = useConsentStatus();
  const pushed = useRef(false);

  const slotId =
    placement === "below-result"
      ? ads.slots.belowResult
      : ads.slots.belowContent;

  const configured = ads.enabled && Boolean(ads.clientId) && Boolean(slotId);
  const allowed =
    density !== "none" && (placement === "below-result" || density === "medium");

  useEffect(() => {
    if (!allowed || !configured || status !== "granted" || pushed.current) return;
    pushed.current = true;
    const w = window as AdsWindow;
    w.adsbygoogle = w.adsbygoogle ?? [];
    w.adsbygoogle.push({});
  }, [allowed, configured, status]);

  if (!allowed) return null;

  // Noch keine AdSense-Freischaltung: im Dev-Modus die Fläche sichtbar machen,
  // damit das Layout stimmt. In Produktion bleibt der Platz leer.
  if (!configured) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div className="rounded-card border border-dashed border-line p-6 text-center text-[13px] text-muted">
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
    <div>
      <p className="mb-1.5 text-center text-[11px] tracking-wide text-muted uppercase">
        Anzeige
      </p>
      <Script
        id="adsense-loader"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.clientId}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ads.clientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
