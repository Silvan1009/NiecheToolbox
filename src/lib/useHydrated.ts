"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/**
 * `false` beim Server-Rendern und im Hydrate-Durchlauf, danach `true`.
 *
 * Für alles, was nicht im vorgerenderten HTML stehen darf – etwa das
 * Einwilligungs-Banner: die Tool-Seiten sind statisch und liegen im CDN, dort
 * dürfte ein Banner sonst auch für Leute im HTML stehen, die längst
 * entschieden haben.
 *
 * Bewusst über `useSyncExternalStore` statt über `useState` + `useEffect`:
 * kein setState im Effekt, keine Kaskaden-Renders.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
}
