import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";

/**
 * Ein Eingabeschritt eines Wegs: Karte, die ab `revealedUpTo >= step`
 * erscheint, mit "Weiter"-Button nur auf dem gerade aktiven Schritt.
 *
 * Gilt nur für Eingabeschritte. Der Urteilsschritt am Ende eines Wegs bleibt
 * handgeschrieben – das ist der eigentliche Payoff und kein Template-Material.
 */
export function WegStep({
  step,
  id,
  title,
  ariaLabel,
  revealedUpTo,
  continueLabel,
  onContinue,
  children,
}: {
  step: number;
  id: string;
  title: string;
  ariaLabel: string;
  revealedUpTo: number;
  /** Weglassen beim letzten Eingabe-Schritt vor dem Urteil. */
  continueLabel?: string;
  onContinue?: () => void;
  children: ReactNode;
}) {
  if (revealedUpTo < step) return null;

  return (
    <Card
      as="section"
      id={id}
      className="scroll-mt-8 p-6"
      aria-label={ariaLabel}
    >
      <CardTitle>{title}</CardTitle>
      {children}
      {revealedUpTo === step && continueLabel && onContinue && (
        <div className="mt-6 flex justify-end">
          <Button onClick={onContinue}>{continueLabel}</Button>
        </div>
      )}
    </Card>
  );
}
