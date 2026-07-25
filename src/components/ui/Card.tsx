import type { ComponentProps, ElementType, ReactNode } from "react";

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

export function CardHeader({
  title,
  hint,
  icon,
}: {
  title: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-control bg-accent-soft text-accent">
          {icon}
        </span>
      )}
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
      </div>
    </div>
  );
}
