import type { ReactNode } from "react";

/**
 * Die Bühne für das Ergebnis – reine Darstellung, kein Zustand.
 *
 * Eine große, in Mono gesetzte Angabe in der Erfolgsfarbe. Der Rest der Seite
 * ist bewusst zurückhaltend, damit diese Zeile trägt.
 *
 * Nicht jedes Ergebnis ist eine Zahl: Der Kündigungsfrist-Rechner zeigt ein
 * Datum, und das gehört genauso groß gesetzt. `NumberDisplay` baut auf dieser
 * Komponente auf und ergänzt nur das Hochzählen.
 */

const tones = {
  positive: "text-positive",
  accent: "text-accent",
  ink: "text-ink",
} as const;

export type PayoffTone = keyof typeof tones;

export function PayoffDisplay({
  /** Was groß dasteht – bereits fertig formatiert. */
  value,
  caption,
  suffix,
  hint,
  announce,
  tone = "positive",
}: {
  value: string;
  /** Kleines Label über dem Wert. */
  caption?: string;
  /** Einheit direkt daneben, z. B. "Tage frei". */
  suffix?: string;
  /** Ergebnis-Satz in Nutzersprache, darunter. */
  hint?: ReactNode;
  /** Vorgelesener Satz. Ohne Angabe: Wert + Einheit. */
  announce?: string;
  tone?: PayoffTone;
}) {
  return (
    <div className="text-center">
      {caption && <p className="font-display field-label">{caption}</p>}

      <p
        aria-hidden="true"
        className={`mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 ${tones[tone]}`}
      >
        <span className="font-mono text-[clamp(2.75rem,13vw,4.5rem)] leading-none font-semibold tracking-tighter tabular-nums">
          {value}
        </span>
        {/* Die Einheit steht in Tinte, nicht in der Erfolgsfarbe: Grün ist für
            den Wert reserviert, und bei dieser Schriftgröße bräuchte sie
            4,5:1 Kontrast. */}
        {suffix && (
          <span className="font-display text-[clamp(1.1rem,4vw,1.5rem)] leading-none font-semibold text-ink">
            {suffix}
          </span>
        )}
      </p>

      {/* Screenreader bekommen nur das fertige Ergebnis, nicht jeden Zwischenwert. */}
      <span className="sr-only" aria-live="polite">
        {announce ?? `${value}${suffix ? ` ${suffix}` : ""}`}
      </span>

      {hint && (
        <p className="mx-auto mt-4 max-w-md text-[15px] text-muted">{hint}</p>
      )}
    </div>
  );
}
