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

/** Eine Karte, die zugeklappt startet – <details>, kein State nötig. */
export function Disclosure({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 transition-colors duration-(--dur-fast) hover:bg-ink-soft">
        <span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {title}
          </span>
          <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>
        </span>
        <ChevronDown
          className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="px-6 pb-6">{children}</div>
    </details>
  );
}
