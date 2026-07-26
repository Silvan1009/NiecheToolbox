import { ads } from "@/config/site";
import { buildAdsBootstrap } from "@/lib/adsBootstrap";

/**
 * Setzt Consent Mode v2 auf „verweigert" und lädt danach die zertifizierte CMP.
 *
 * Gehört als erstes Kind in `<body>`. Die Reihenfolge ist der Zweck der
 * Übung: die Defaults müssen stehen, bevor irgendein Google-Tag lädt.
 *
 * Bewusst ein rohes `<script>` statt `next/script`: React rendert es an genau
 * dieser Stelle in den Dokumentenstrom und führt es beim Parsen synchron aus.
 * Es landet damit im statischen HTML, kostet keine Laufzeit und wird beim
 * Hydrieren nicht erneut ausgeführt. `next/script` mit `beforeInteractive`
 * gibt diese Garantie für Inline-Code im App Router nicht.
 *
 * Ohne konfigurierte IDs: kein Skript, keine CMP, kein Request.
 */
export function AdsBootstrap() {
  if (!ads.enabled || !ads.clientId) return null;

  const script = buildAdsBootstrap(ads.clientId);
  if (!script) return null;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
