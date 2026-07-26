/**
 * HTTP-Sicherheits-Header, zentral und testbar.
 *
 * Wird von `next.config.ts` importiert – deshalb **relativ** importieren und
 * ohne jede Abhängigkeit zu `react` oder `next`: der Config-Loader kennt den
 * `@/`-Alias nicht.
 *
 * Die Header werden zur Antwortzeit gesetzt. Sie verändern weder den
 * Rendering-Modus noch den Route-Cache – genau deshalb stehen sie hier und
 * nicht in `proxy.ts` (in Next 16 der neue Name für `middleware.ts`). Ein
 * CSP-Nonce bräuchte pro Anfrage einen frischen Wert, würde dynamisches
 * Rendern erzwingen und das `revalidate = 86400` der Tool-Seiten zerstören.
 */

export type CspMode = "report-only" | "enforce" | "off";

export interface SecurityHeaderOptions {
  cspMode?: CspMode;
  isProduction?: boolean;
  /** Origin der cookiefreien Reichweitenmessung, z. B. "https://plausible.io". */
  analyticsOrigin?: string | null;
}

export interface HttpHeader {
  key: string;
  value: string;
}

/* --- Googles Werbe-Origins ------------------------------------------------ */

/** Hosts, die Skripte ausliefern dürfen. */
const AD_SCRIPT_ORIGINS = [
  "https://pagead2.googlesyndication.com",
  "https://partner.googleadservices.com",
  "https://tpc.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
  "https://adservice.google.com",
  "https://adservice.google.de",
  "https://www.googletagservices.com",
  "https://www.googletagmanager.com",
  "https://fundingchoicesmessages.google.com",
  "https://ep1.adtrafficquality.google",
  "https://ep2.adtrafficquality.google",
];

/** Anzeigenmotive und Zählpixel kommen von wechselnden Subdomains. */
const AD_IMAGE_ORIGINS = [
  "https://*.googlesyndication.com",
  "https://*.g.doubleclick.net",
  "https://*.google.com",
  "https://*.google.de",
  "https://*.gstatic.com",
  "https://*.adtrafficquality.google",
];

const AD_CONNECT_ORIGINS = [
  "https://pagead2.googlesyndication.com",
  "https://googleads.g.doubleclick.net",
  "https://*.google.com",
  "https://*.adtrafficquality.google",
  "https://fundingchoicesmessages.google.com",
  "https://csi.gstatic.com",
];

/** Anzeigen und der CMP-Dialog laufen in iframes. */
const AD_FRAME_ORIGINS = [
  "https://googleads.g.doubleclick.net",
  "https://tpc.googlesyndication.com",
  "https://www.google.com",
  "https://ep1.adtrafficquality.google",
  "https://ep2.adtrafficquality.google",
  "https://fundingchoicesmessages.google.com",
];

/** Empfänger der Privacy-Sandbox-Signale. */
const SANDBOX_ORIGINS = [
  "https://googleads.g.doubleclick.net",
  "https://pagead2.googlesyndication.com",
  "https://tpc.googlesyndication.com",
  "https://td.doubleclick.net",
];

/* --- Permissions-Policy ---------------------------------------------------- */

/** Fähigkeiten, die diese Seite nie braucht. */
const DENIED_FEATURES = [
  "camera",
  "microphone",
  "geolocation",
  "payment",
  "usb",
  "midi",
  "magnetometer",
  "gyroscope",
  "accelerometer",
  "fullscreen",
];

/**
 * Privacy-Sandbox-Fähigkeiten, über die AdSense seine Anzeigen aussteuert und
 * abrechnet.
 *
 * ACHTUNG – hier nichts entfernen. Den Permissions-Policy-Header ganz
 * wegzulassen ist unproblematisch; einen restriktiven zu schreiben nicht. Ein
 * blankes `browsing-topics=()` schaltet die Signale stumm ab: keine Warnung,
 * kein Fehler, nur weniger Umsatz. Der Test in securityHeaders.test.ts steht
 * genau deswegen dort.
 */
const SANDBOX_FEATURES = [
  "browsing-topics",
  "attribution-reporting",
  "private-state-token-issuance",
  "private-state-token-redemption",
  "join-ad-interest-group",
  "run-ad-auction",
];

function permissionsPolicy(): string {
  const allowList = ["self", ...SANDBOX_ORIGINS.map((o) => `"${o}"`)].join(" ");
  return [
    ...DENIED_FEATURES.map((feature) => `${feature}=()`),
    ...SANDBOX_FEATURES.map((feature) => `${feature}=(${allowList})`),
  ].join(", ");
}

/* --- Content Security Policy ----------------------------------------------- */

/**
 * Baut die CSP.
 *
 * Ehrliche Einordnung: das ist eine **Origin-Allowlist, kein XSS-Schutz**.
 * `script-src` braucht `'unsafe-inline'`, weil Next die RSC-Payload als inline
 * `self.__next_f.push(...)` streamt und Werbe-Tags eigene Inline-Skripte
 * nachziehen. `style-src` braucht es wegen `experimental.inlineCss`, das pro
 * Seite wechselnde `<style>`-Blöcke ausgibt – Hashes müssten je Route neu
 * erzeugt werden, ein Nonce steht ohne dynamisches Rendern nicht zur Verfügung.
 *
 * Der Gewinn liegt darin, dass Skripte, Bilder, Verbindungen und Frames nur von
 * bekannten Hosts kommen dürfen.
 */
function contentSecurityPolicy(options: SecurityHeaderOptions): string {
  const { isProduction = true, analyticsOrigin } = options;
  const analytics = analyticsOrigin ? [analyticsOrigin] : [];

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      // React nutzt in der Entwicklung `eval` für bessere Fehlermeldungen.
      ...(isProduction ? [] : ["'unsafe-eval'"]),
      ...AD_SCRIPT_ORIGINS,
      ...analytics,
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", ...AD_IMAGE_ORIGINS],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", ...AD_CONNECT_ORIGINS, ...analytics],
    "frame-src": AD_FRAME_ORIGINS,
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
  };

  const policy = Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");

  return isProduction ? `${policy}; upgrade-insecure-requests` : policy;
}

/* --- Zusammenbau ----------------------------------------------------------- */

/**
 * Liefert die Header-Liste für `next.config.ts`.
 *
 * Die CSP läuft standardmäßig als `Report-Only`: Verstöße landen in der
 * Browser-Konsole, blockiert wird nichts. Anzeigen ziehen Motive von Hosts, die
 * keine Testsitzung vollständig trifft – erst nach ein paar Tagen echtem
 * Traffic mit sauberem Befund lohnt der Wechsel auf `enforce`.
 */
export function securityHeaders(
  options: SecurityHeaderOptions = {},
): HttpHeader[] {
  const { cspMode = "report-only", isProduction = true } = options;

  const headers: HttpHeader[] = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "Permissions-Policy", value: permissionsPolicy() },
  ];

  if (isProduction) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    });
  }

  if (cspMode !== "off") {
    headers.push({
      key:
        cspMode === "enforce"
          ? "Content-Security-Policy"
          : "Content-Security-Policy-Report-Only",
      value: contentSecurityPolicy(options),
    });
  }

  return headers;
}
