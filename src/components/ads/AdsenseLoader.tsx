"use client";

import Script from "next/script";
import { ads } from "@/config/site";
import { useConsentStatus } from "@/components/consent/useConsent";

/**
 * Lädt adsbygoogle.js – genau einmal pro Dokument und erst nach Einwilligung.
 *
 * Vorher hing dieses Script an jedem einzelnen AdSlot. Das funktionierte, weil
 * Next über die `id` dedupliziert, koppelte den Loader aber an das Rendern
 * eines Slots. Hier im Layout ist er unabhängig davon, wie viele Werbeplätze
 * eine Seite hat – und die Slots kümmern sich nur noch um ihre eigene Fläche.
 *
 * `afterInteractive` ist ausreichend: die Komponente hängt sich ohnehin erst
 * nach der Zustimmung ein, also lange nach dem Hydrieren.
 */
export function AdsenseLoader() {
  const status = useConsentStatus();

  if (!ads.enabled || !ads.clientId || status !== "granted") return null;

  return (
    <Script
      id="adsense-loader"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ads.clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
