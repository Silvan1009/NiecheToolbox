"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatInteger } from "@/lib/format";
import { PayoffDisplay, type PayoffTone } from "./PayoffDisplay";

/**
 * Das Signature-Element: die Payoff-Zahl.
 *
 * Kurze Count-up-Animation von der zuletzt gezeigten Zahl zum neuen Ergebnis –
 * bei `prefers-reduced-motion: reduce` springt sie ohne Animation. Die
 * Darstellung selbst kommt aus `PayoffDisplay`, damit Zahl und Datum in
 * derselben Typografie stehen.
 *
 * Die Dauer kommt aus dem Token --dur-payoff, damit auch Bewegung aus den
 * Design-Tokens gesteuert wird.
 */

function payoffDuration(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--dur-payoff")
    .trim();
  if (raw.endsWith("ms")) return Number.parseFloat(raw);
  if (raw.endsWith("s")) return Number.parseFloat(raw) * 1000;
  return 620;
}

export function NumberDisplay({
  value,
  format = formatInteger,
  caption,
  suffix,
  hint,
  announce,
  tone = "positive",
}: {
  value: number;
  format?: (n: number) => string;
  /** Kleines Label über der Zahl. */
  caption?: string;
  /** Einheit direkt neben der Zahl, z. B. "Tage frei". */
  suffix?: string;
  /** Ergebnis-Satz in Nutzersprache, unter der Zahl. */
  hint?: ReactNode;
  /** Vorgelesener Satz für Screenreader. Default: Zahl + Einheit. */
  announce?: string;
  tone?: PayoffTone;
}) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const from = displayRef.current;
    if (from === value) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    const duration = reduceMotion ? 0 : payoffDuration();

    // Auch der Sprung ohne Animation läuft über den Frame-Callback: so wird
    // niemals synchron im Effekt-Körper Zustand gesetzt.
    const start = performance.now();
    const tick = (now: number) => {
      const t = duration <= 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3; // easeOutCubic
      const next = from + (value - from) * eased;
      displayRef.current = t < 1 ? next : value;
      setDisplay(displayRef.current);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value]);

  return (
    <PayoffDisplay
      value={format(display)}
      caption={caption}
      suffix={suffix}
      hint={hint}
      tone={tone}
      // Der vorgelesene Satz nennt den Zielwert, nicht den Zwischenstand.
      announce={announce ?? `${format(value)}${suffix ? ` ${suffix}` : ""}`}
    />
  );
}
