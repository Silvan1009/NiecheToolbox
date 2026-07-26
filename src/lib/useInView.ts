"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Meldet, sobald sich das Element dem sichtbaren Bereich nähert.
 *
 * Gedacht für Werbeplätze: die Anzeige wird erst angefordert, wenn jemand
 * tatsächlich in ihre Nähe scrollt. Das hebt die Sichtbarkeitsquote – und die
 * ist es, wonach Anzeigen bezahlt werden. Ein Slot unter der FAQ, den kaum
 * jemand erreicht, würde sonst bei jedem Seitenaufruf eine Anfrage auslösen und
 * als ausgeliefert, aber nie gesehen gezählt.
 *
 * Der Vorlauf von 400 px sorgt dafür, dass die Anzeige beim Ankommen schon da
 * ist statt sichtbar nachzuladen.
 */
export function useInView<T extends Element>(
  rootMargin = "400px 0px",
): { ref: React.RefObject<T | null>; inView: boolean } {
  const ref = useRef<T>(null);

  // Ohne IntersectionObserver lieber sofort laden als gar nicht. Die Prüfung
  // steht im Initialwert statt in einem Effekt: `inView` steuert nur, wann die
  // Anzeige angefordert wird, und nie das gerenderte Markup – ein anderer Wert
  // auf Server und Client kann deshalb keinen Hydrate-Konflikt auslösen.
  const [inView, setInView] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (inView) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
