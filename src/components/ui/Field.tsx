import type { ComponentProps, ReactNode } from "react";

const controlClasses =
  "w-full rounded-control bg-surface px-3.5 py-2.5 text-[15px] text-ink " +
  "shadow-[var(--elev-inset)] transition-shadow duration-(--dur-fast) " +
  "hover:shadow-[inset_0_0_0_1px_var(--accent-ring)] " +
  "focus:shadow-[inset_0_0_0_1px_var(--accent)] focus:outline-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: ReactNode;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-semibold tracking-wide text-muted uppercase"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

export function TextInput({ className = "", ...props }: ComponentProps<"input">) {
  return <input className={`${controlClasses} ${className}`} {...props} />;
}

export function TextArea({
  className = "",
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      className={`${controlClasses} min-h-40 resize-y leading-relaxed ${className}`}
      {...props}
    />
  );
}

export function Select({
  className = "",
  children,
  ...props
}: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={`${controlClasses} appearance-none pr-10 ${className}`}
        {...props}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted"
      >
        <path
          d="M4 6.5 8 10.5 12 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Ja/Nein-Schalter mit erklärender Zeile – die ganze Fläche ist klickbar. */
export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-control bg-ink-soft p-3.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
      />
      <span>
        <span className="font-semibold">{label}</span>
        {hint && <span className="mt-0.5 block text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/**
 * Zwei bis vier gleichrangige Alternativen als Pillen-Reihe.
 *
 * Bewusst Buttons mit `aria-pressed` statt Radios: es sind Umschalter für die
 * Ansicht, keine Formularwerte, die abgeschickt werden.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (next: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex w-fit max-w-full flex-wrap items-center gap-0.5 rounded-pill bg-surface p-0.5 shadow-[var(--elev-inset)]"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`rounded-pill px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-(--dur-fast) ${
              active
                ? "bg-accent text-white shadow-soft"
                : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Zahlen-Eingabe mit −/+ Steppern: auf Mobile deutlich angenehmer. */
export function Stepper({
  id,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix,
  ariaLabel,
}: {
  id: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  suffix?: string;
  ariaLabel?: string;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className="flex items-stretch gap-2">
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label="Wert verringern"
        className="grid size-11 shrink-0 place-items-center rounded-control bg-surface text-lg text-ink shadow-[var(--elev-inset)] transition-colors duration-(--dur-fast) hover:bg-ink-soft disabled:opacity-40"
      >
        −
      </button>
      <div className="relative flex-1">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          step={step}
          aria-label={ariaLabel}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onChange(clamp(next));
          }}
          className={`${controlClasses} text-center font-mono ${suffix ? "pr-14" : ""} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
        />
        {suffix && (
          <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label="Wert erhöhen"
        className="grid size-11 shrink-0 place-items-center rounded-control bg-surface text-lg text-ink shadow-[var(--elev-inset)] transition-colors duration-(--dur-fast) hover:bg-ink-soft disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
