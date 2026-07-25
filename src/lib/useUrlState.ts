"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Spiegelt den Zustand, der ein Ergebnis erzeugt, in die URL – damit jedes
 * Ergebnis teilbar und verlinkbar ist.
 *
 * Bewusst über `history.replaceState` statt über den Next-Router: das ist ein
 * reiner Client-Rechner, ein Server-Roundtrip pro Tastendruck wäre Verschwendung.
 *
 * Ablauf:
 *  1. Erster Render kommt aus `initialState` (Defaults bzw. SEO-Varianten-Params).
 *     Dadurch ist das SSR-HTML identisch zum ersten Client-Render.
 *  2. Nach dem Mount wird der Zustand aus der URL übernommen – so funktionieren
 *     geteilte Links.
 *  3. Jede Nutzer-Änderung landet gedrosselt wieder in der URL.
 */
export function useUrlState<T extends Record<string, unknown>>({
  initialState,
  parse,
  serialize,
  debounceMs = 250,
}: {
  initialState: T;
  /** Liest den Zustand aus der Query-String, fällt auf `fallback` zurück. */
  parse: (search: URLSearchParams, fallback: T) => T;
  /** Nur Werte, die vom Default abweichen sollten hier landen (kurze Links). */
  serialize: (state: T) => Record<string, string>;
  debounceMs?: number;
}): [T, (patch: Partial<T>) => void] {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef(initialState);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    if (Array.from(search.keys()).length === 0) return;

    const fromUrl = parse(search, stateRef.current);
    stateRef.current = fromUrl;
    setState(fromUrl);
    // Nur beim Mount: die URL ist danach Ergebnis, nicht Quelle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const update = useCallback(
    (patch: Partial<T>) => {
      const next = { ...stateRef.current, ...patch };
      stateRef.current = next;
      setState(next);

      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        const search = new URLSearchParams(window.location.search);
        for (const [key, value] of Object.entries(serialize(next))) {
          if (value === "") search.delete(key);
          else search.set(key, value);
        }
        const query = search.toString();
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${query ? `?${query}` : ""}`,
        );
      }, debounceMs);
    },
    [serialize, debounceMs],
  );

  return [state, update];
}
