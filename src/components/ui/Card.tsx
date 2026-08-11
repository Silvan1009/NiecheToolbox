import type { ComponentProps, ElementType, ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Weiche Fläche: Tiefe kommt aus mehrschichtigem Schatten, die 1px-Linie ist
 * nur eine Andeutung (inset). Keine harten Kanten.
 */
export function Card({
  as,
  className = "",
  children,
  ...props
}: ComponentProps<"div"> & { as?: ElementType; children: ReactNode }) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag className={`surface-soft ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/** Überschrift einer Karte. Immer h2 – die h1 gehört der Seite, nicht der Karte. */
export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="card-title">{children}</h2>;
}

/** Eine Karte, die zugeklappt startet – <details>, kein State nötig. */
export function Disclosure({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
        <span>
          <span className="card-title">{title}</span>
          {hint && <span className="mt-0.5 block field-hint">{hint}</span>}
        </span>
        <ChevronDown className="chevron-rotate" aria-hidden="true" />
      </summary>
      <div className="px-6 pb-6">{children}</div>
    </details>
  );
}
