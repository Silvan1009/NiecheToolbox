"use client";

import { useSyncExternalStore } from "react";
import {
  getConsentStatus,
  subscribeConsent,
  type ConsentStatus,
} from "@/lib/consent";

/**
 * Serverseitig und beim ersten Hydrate-Snapshot immer "unknown": Werbung
 * darf niemals im SSR-HTML auftauchen.
 */
const serverSnapshot = (): ConsentStatus => "unknown";

export function useConsentStatus(): ConsentStatus {
  return useSyncExternalStore(subscribeConsent, getConsentStatus, serverSnapshot);
}
