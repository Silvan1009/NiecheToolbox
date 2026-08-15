export interface WegStepDef {
  step: number;
  id: string;
  label: string;
}

/** Pillen-Navigation eines Wegs: aktiv, erreichbar oder noch nicht freigeschaltet. */
export function WegSteps({
  steps,
  revealedUpTo,
  onSelect,
}: {
  steps: readonly WegStepDef[];
  revealedUpTo: number;
  onSelect: (step: number, id: string) => void;
}) {
  return (
    <nav aria-label="Fortschritt" className="flex flex-wrap items-center gap-2">
      {steps.map(({ step, id, label }) => {
        const active = revealedUpTo === step;
        const reachable = revealedUpTo >= step;
        return (
          <button
            key={step}
            type="button"
            onClick={() => onSelect(step, id)}
            aria-current={active ? "step" : undefined}
            className={`rounded-pill px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-(--dur-fast) ${
              active
                ? "bg-accent text-white shadow-soft"
                : reachable
                  ? "bg-ink-soft text-ink hover:bg-accent-soft hover:text-accent"
                  : "bg-ink-soft text-muted hover:bg-accent-soft hover:text-accent"
            }`}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
