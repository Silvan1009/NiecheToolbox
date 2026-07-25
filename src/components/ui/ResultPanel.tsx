import type { ReactNode } from "react";

/**
 * Die Bühne für die Payoff-Zahl. Sehr ruhig, sehr weich – die Zahl trägt.
 */
export function ResultPanel({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section
      aria-label="Ergebnis"
      className="rounded-card bg-positive-soft p-7 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--positive)_16%,transparent)] sm:p-9"
    >
      {children}
      {footer && (
        <div className="mt-7 flex justify-center border-t border-[color-mix(in_srgb,var(--positive)_16%,transparent)] pt-5">
          {footer}
        </div>
      )}
    </section>
  );
}
