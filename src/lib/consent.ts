/**
 * Einwilligungs-Verwaltung für Werbung.
 *
 * Grundsatz: Werbung lädt erst NACH aktiver Einwilligung. "Ablehnen" ist
 * gleichwertig erreichbar, und Nicht-Entscheiden zählt als Ablehnung
 * (Datenschutz-Default). Google Consent Mode v2 wird mit "denied" als
 * Default initialisiert und erst bei Einwilligung aktualisiert.
 *
 * Bewusst frei von React – der Hook liegt in components/consent/useConsent.ts.
 *
 * Analytics ist davon unabhängig: Umami/Plausible arbeiten cookiefrei und
 * legen nichts auf dem Endgerät ab, brauchen also keine Einwilligung nach
 * § 25 TDDDG.
 */

export type ConsentDecision = "granted" | "denied";

/** "unknown" = noch nicht entschieden. Verhält sich wie "denied". */
export type ConsentStatus = ConsentDecision | "unknown";

export interface ConsentRecord {
  version: number;
  /** ISO-Zeitstempel der Entscheidung – Nachweisbarkeit. */
  decidedAt: string;
  /** Deckt ad_storage, ad_user_data und ad_personalization ab. */
  ads: ConsentDecision;
}

export const CONSENT_VERSION = 1;
const STORAGE_KEY = "nuetzlich.consent.v1";

type Listener = (status: ConsentStatus) => void;
const listeners = new Set<Listener>();

/* --- Google Consent Mode v2 ---------------------------------------------- */

type GtagArgs = [string, ...unknown[]];

interface ConsentWindow extends Window {
  dataLayer?: GtagArgs[];
  gtag?: (...args: unknown[]) => void;
}

function gtag(...args: unknown[]): void {
  if (typeof window === "undefined") return;
  const w = window as ConsentWindow;
  w.dataLayer = w.dataLayer ?? [];
  // Google erwartet echte `arguments`-Objekte im dataLayer.
  w.dataLayer.push(args as unknown as GtagArgs);
}

let defaultsInitialised = false;

/**
 * Muss laufen, bevor irgendein Google-Tag lädt. Setzt alle werbebezogenen
 * Signale auf "denied".
 */
export function initConsentMode(): void {
  if (typeof window === "undefined" || defaultsInitialised) return;
  defaultsInitialised = true;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });

  const record = readConsent();
  if (record) applyToConsentMode(record.ads);
}

function applyToConsentMode(decision: ConsentDecision): void {
  gtag("consent", "update", {
    ad_storage: decision,
    ad_user_data: decision,
    ad_personalization: decision,
  });
}

/* --- Persistenz ----------------------------------------------------------- */

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.version !== CONSENT_VERSION) return null;
    if (parsed.ads !== "granted" && parsed.ads !== "denied") return null;
    return {
      version: CONSENT_VERSION,
      decidedAt: parsed.decidedAt ?? new Date().toISOString(),
      ads: parsed.ads,
    };
  } catch {
    // Privater Modus / Storage blockiert -> wie "nicht entschieden".
    return null;
  }
}

export function getConsentStatus(): ConsentStatus {
  return readConsent()?.ads ?? "unknown";
}

export function setConsent(decision: ConsentDecision): void {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    ads: decision,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* Entscheidung gilt für diese Sitzung, auch wenn sie nicht persistiert. */
  }
  applyToConsentMode(decision);
  notify(decision);
}

/** Setzt die Entscheidung zurück, damit der Banner erneut erscheint. */
export function resetConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignorieren */
  }
  applyToConsentMode("denied");
  notify("unknown");
}

/* --- Abonnement (für useSyncExternalStore) -------------------------------- */

function notify(status: ConsentStatus): void {
  for (const listener of listeners) listener(status);
}

export function subscribeConsent(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
