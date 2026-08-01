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
