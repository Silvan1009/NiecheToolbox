/**
 * Einwilligungs-Verwaltung für Werbung.
 *
 * Die Einwilligung erhebt eine zertifizierte Consent-Management-Plattform:
 * Google Funding Choices, nach IAB TCF v2.2 zertifiziert. Das ist keine
 * Geschmacksfrage – Google liefert AdSense im EWR und im Vereinigten Königreich
 * seit Januar 2024 nur noch an Seiten mit zertifizierter CMP aus. Ein
 * selbstgebauter Banner erfüllt die Anforderung nicht, egal wie sauber er ist.
 *
 * Die Wahrheit über den Consent liegt damit in der TCF-API (`window.__tcfapi`)
 * und nicht mehr in einem eigenen Local-Storage-Eintrag. Dieses Modul hört dort
 * zu und übersetzt das Ergebnis in einen Status, den React abonnieren kann.
 *
 * WICHTIG: Hier wird **kein** `gtag('consent','update')` gesendet. Funding
 * Choices ist selbst eine Google-CMP und schreibt Consent Mode v2 eigenständig.
 * Zwei Schreiber auf demselben Signal sind der klassische Grund dafür, dass
 * Einwilligungen scheinbar grundlos verloren gehen. Wir setzen nur die Defaults
 * (siehe lib/adsBootstrap.ts) und lesen danach ausschließlich.
 *
 * Bewusst frei von React – der Hook liegt in components/consent/useConsent.ts.
 *
 * Analytics ist davon unabhängig: Umami/Plausible arbeiten cookiefrei und legen
 * nichts auf dem Endgerät ab, brauchen also keine Einwilligung nach § 25 TDDDG.
 */

import { ads } from "@/config/site";
import { deriveConsentStatus, type TcfData } from "./tcf";

export type ConsentDecision = "granted" | "denied";

/** "unknown" = noch nicht entschieden. Verhält sich wie "denied". */
export type ConsentStatus = ConsentDecision | "unknown";

type Listener = (status: ConsentStatus) => void;
const listeners = new Set<Listener>();

/**
 * Zwischengespeicherter Status.
 *
 * `useSyncExternalStore` ruft den Snapshot bei jedem Rendern auf und vergleicht
 * ihn per Identität – deshalb muss er ein stabiler Wert sein und darf nicht bei
 * jedem Aufruf neu berechnet werden.
 */
let current: ConsentStatus = "unknown";

export function getConsentStatus(): ConsentStatus {
  return current;
}

function notify(status: ConsentStatus): void {
  for (const listener of listeners) listener(status);
}

function update(next: ConsentStatus): void {
  if (next === current) return;
  current = next;
  notify(next);
}

/* --- Anbindung an die CMP -------------------------------------------------- */

type TcfApi = (
  command: string,
  version: number,
  callback: (data: unknown, success: boolean) => void,
  parameter?: unknown,
) => void;

interface ConsentWindow extends Window {
  __tcfapi?: TcfApi;
  googlefc?: {
    callbackQueue?: Array<(() => void) | Record<string, unknown>>;
    showRevocationMessage?: () => void;
  };
}

/** Wie lange auf die CMP gewartet wird, bevor wir aufgeben. */
const POLL_INTERVAL_MS = 100;
const POLL_TIMEOUT_MS = 10_000;

let bridgeStarted = false;

/**
 * Hängt sich an die TCF-API, sobald die CMP sie bereitstellt.
 *
 * Wird faul aus dem ersten `subscribeConsent` heraus gestartet, damit im
 * Ruhezustand (keine Werbung konfiguriert) überhaupt nichts passiert.
 *
 * Kein eigener `__tcfapi`-Stub: Funding Choices bringt seinen eigenen mit, und
 * ein zweiter würde die Warteschlange der CMP zerschießen. Deshalb pollen wir.
 *
 * Läuft die Zeit ab – Adblocker, Netzwerkfehler, CMP-Ausfall –, bleibt der
 * Status `unknown` und es lädt keine Werbung. Das ist die richtige Richtung zu
 * scheitern.
 */
function ensureTcfBridge(): void {
  if (bridgeStarted || typeof window === "undefined") return;
  if (!ads.enabled || !ads.clientId) return;
  bridgeStarted = true;

  const w = window as ConsentWindow;
  const startedAt = Date.now();

  const attach = () => {
    if (typeof w.__tcfapi === "function") {
      w.__tcfapi("addEventListener", 2, (data, success) => {
        update(success ? deriveConsentStatus(data as TcfData) : "denied");
      });
      return;
    }
    if (Date.now() - startedAt >= POLL_TIMEOUT_MS) return;
    window.setTimeout(attach, POLL_INTERVAL_MS);
  };

  attach();
}

/**
 * Öffnet den Widerrufs-Dialog der CMP.
 *
 * Über die `callbackQueue` statt eines direkten Aufrufs: so funktioniert der
 * Knopf auch, wenn Funding Choices noch lädt – der Wunsch wird dann einfach
 * nachgeholt.
 */
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  const w = window as ConsentWindow;
  w.googlefc = w.googlefc ?? {};
  w.googlefc.callbackQueue = w.googlefc.callbackQueue ?? [];
  w.googlefc.callbackQueue.push(() => {
    (window as ConsentWindow).googlefc?.showRevocationMessage?.();
  });
}

/* --- Abonnement (für useSyncExternalStore) -------------------------------- */

export function subscribeConsent(listener: Listener): () => void {
  ensureTcfBridge();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
