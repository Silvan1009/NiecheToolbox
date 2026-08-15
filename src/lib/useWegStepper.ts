"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Wie ShareBars hasShareApi(): Query-String lesen, ohne Hydrate-Konflikt und ohne Effekt. */
const noopSubscribe = () => () => {};
const hasSearchParams = () => window.location.search.length > 0;
const noSearchParamsOnServer = () => false;

export interface WegStepper {
  /** Bis zu diesem Schritt (inklusive) ist alles sichtbar. */
  revealedUpTo: number;
  /** Ziel eines Klicks auf Pille oder "Weiter"-Button: schaltet frei und scrollt hin. */
  goTo: (step: number, id: string) => void;
}

/**
 * Fortschritt eines mehrstufigen Wegs.
 *
 * Ankunft über einen geteilten Link (arrivedViaLink): sofort alles bis
 * stepCount zeigen statt von vorn beginnen zu lassen. useSyncExternalStore
 * statt Effekt+setState liest dabei einen Browser-Wert, ohne SSR-HTML und
 * ersten Client-Render auseinanderlaufen zu lassen (kein Hydrate-Konflikt).
 * Serverseitig liefert noSearchParamsOnServer immer false, revealedUpTo
 * bleibt im statisch exportierten HTML also immer 1.
 *
 * Fortschritt ist sonst kein Wert, der das Ergebnis bestimmt – bleibt
 * lokaler State statt in der URL (README-Regel für useUrlState).
 */
export function useWegStepper(stepCount: number): WegStepper {
  const arrivedViaLink = useSyncExternalStore(
    noopSubscribe,
    hasSearchParams,
    noSearchParamsOnServer,
  );

  const [manualStep, setManualStep] = useState(1);
  const revealedUpTo = arrivedViaLink ? stepCount : manualStep;

  // Ziel eines Klicks: ein Ref statt State, damit der Scroll-Effekt unten
  // keinen eigenen setState-Aufruf braucht (nur lesen + scrollIntoView).
  // scrollPulse ist der einzige Auslöser des Effekts – auch wenn manualStep
  // sich nicht ändert (z. B. Klick auf die bereits aktive Pille), muss
  // trotzdem gescrollt werden.
  const pendingScrollRef = useRef<string | null>(null);
  const [scrollPulse, setScrollPulse] = useState(0);

  useEffect(() => {
    const target = pendingScrollRef.current;
    if (!target) return;
    document
      .getElementById(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollPulse]);

  function goTo(step: number, id: string) {
    pendingScrollRef.current = id;
    setManualStep((current) => (step > current ? step : current));
    setScrollPulse((pulse) => pulse + 1);
  }

  return { revealedUpTo, goTo };
}
