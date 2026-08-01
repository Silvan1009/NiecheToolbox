import Script from "next/script";
import { analytics } from "@/config/site";

/**
 * Cookiefreie Reichweitenmessung. Läuft unabhängig vom Werbe-Consent, weil
 * nichts auf dem Endgerät gespeichert wird. Ohne Konfiguration: kein Script.
 */
export function Analytics() {
  if (analytics.provider === "umami") {
    const { scriptUrl, websiteId } = analytics.umami;
    if (!scriptUrl || !websiteId) return null;
    return (
      <Script
        src={scriptUrl}
        data-website-id={websiteId}
        strategy="afterInteractive"
        defer
      />
    );
  }

  if (analytics.provider === "plausible") {
    const { scriptUrl, domain } = analytics.plausible;
    if (!scriptUrl || !domain) return null;
    return (
      <Script
        src={scriptUrl}
        data-domain={domain}
        strategy="afterInteractive"
        defer
      />
    );
  }

  return null;
}
