/**
 * Baut das Inline-Skript, das ganz am Anfang von `<body>` steht.
 *
 * Es erledigt genau zwei Dinge, und zwar in dieser Reihenfolge:
 *
 *   1. Google Consent Mode v2 auf „alles verweigert" vorbelegen.
 *   2. Die zertifizierte CMP (Google Funding Choices) nachladen.
 *
 * Die Reihenfolge ist der ganze Grund für dieses Modul. Die Defaults müssen
 * stehen, *bevor* irgendein Google-Tag lädt – sonst zählt der erste Treffer als
 * unbestimmt und die CMP kann ihn nicht mehr einfangen. Deshalb wird der
 * CMP-Tag aus diesem Skript heraus injiziert und nicht als eigenes
 * `<script async src>` gerendert: React hebt solche Tags in den `<head>` und
 * könnte sie bei warmem Cache vor diesem Skript ausführen lassen.
 *
 * Reine Zeichenketten-Erzeugung, kein `window`-Zugriff – damit die
 * Reihenfolge-Garantie testbar bleibt.
 */

/** `ca-pub-` plus Ziffern. Alles andere wird verworfen. */
const CLIENT_ID_PATTERN = /^ca-pub-\d+$/;

/**
 * Liefert das Bootstrap-Skript als Zeichenkette – oder `""`, wenn keine
 * gültige Publisher-ID vorliegt. Dann rendert die Komponente nichts.
 */
export function buildAdsBootstrap(clientId: string): string {
  if (!CLIENT_ID_PATTERN.test(clientId)) return "";

  // Die CMP kennt den Publisher ohne das `ca-`-Präfix.
  const publisherId = clientId.slice("ca-".length);

  return [
    "(function(){",
    // Echtes `arguments`-Objekt: Google wertet die dataLayer-Einträge als
    // solche aus, ein Array kommt in Consent Mode nicht richtig an.
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){window.dataLayer.push(arguments)}",
    "gtag('consent','default',{",
    "'ad_storage':'denied',",
    "'ad_user_data':'denied',",
    "'ad_personalization':'denied',",
    "'analytics_storage':'denied',",
    // Gibt der CMP ein halbe Sekunde Zeit, den gespeicherten Zustand
    // nachzureichen, bevor Google die Defaults als endgültig nimmt.
    "'wait_for_update':500",
    "});",
    // Signalisiert Funding Choices, dass die Seite die CMP erwartet.
    "function s(){",
    "if(window.frames['googlefcPresent'])return;",
    "if(!document.body){setTimeout(s,0);return}",
    "var f=document.createElement('iframe');",
    "f.style.cssText='width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;display:none';",
    "f.name='googlefcPresent';",
    "document.body.appendChild(f);",
    "}",
    "s();",
    // Erst jetzt – nach den Defaults – die CMP selbst.
    "var t=document.createElement('script');",
    "t.async=true;",
    `t.src='https://fundingchoicesmessages.google.com/i/${publisherId}?ers=1';`,
    "document.head.appendChild(t);",
    "})();",
  ].join("");
}
