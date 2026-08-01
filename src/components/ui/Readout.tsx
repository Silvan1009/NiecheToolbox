import type { ReactNode } from "react";
import { formatEuro } from "@/lib/format";

/**
 * Eine Kennzahl neben dem Ergebnis: Label, Zahl, eine Zeile Einordnung.
 *
 * Gehört in ein <dl>; dt/dd statt div/div, weil Label und Wert genau das
 * sind. Das Icon bekommt nur, wer mehrere Stats nebeneinander optisch
 * trennen muss – ohne Icon bleibt das dt eine reine Textzeile.
 */
export function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="surface-soft p-5">
      <dt
        className={
          icon
            ? "flex items-center gap-2 text-[13px] font-semibold text-muted"
            : "text-[13px] font-semibold text-muted"
        }
      >
        {icon && <span className="text-accent">{icon}</span>}
        {label}
      </dt>
      <dd className="mt-2">
        <span className="font-mono text-2xl leading-none font-semibold tabular-nums">
          {value}
        </span>
        {hint !== undefined && (
          <span className="mt-1 block text-[13px] text-muted">{hint}</span>
        )}
      </dd>
    </div>
  );
}

/**
 * Eine Zeile einer Aufstellung: Label links, Betrag rechts in Mono.
 *
 * `stark` markiert die Summenzeile. Die Null wird bewusst durch sich selbst
 * ersetzt: -0 === 0, und ohne das stünde in der Aufstellung "-0,00 €" – ein
 * Vorzeichen vor einer Null, die keine ist.
 */
export function AmountRow({
  label,
  value,
  stark = false,
}: {
  label: string;
  value: number;
  stark?: boolean;
}) {
  return (
    <li
      className={`flex items-baseline justify-between gap-4 ${
        stark ? "border-t border-line pt-2 font-semibold" : ""
      }`}
    >
      <span className={stark ? "" : "text-muted"}>{label}</span>
      <span className="font-mono tabular-nums">
        {formatEuro(value === 0 ? 0 : value)}
      </span>
    </li>
  );
}
