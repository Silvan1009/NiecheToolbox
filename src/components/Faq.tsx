import { ChevronDown } from "lucide-react";
import type { FaqEntry } from "@/tools/types";

/** Native <details> – zugänglich, tastaturbedienbar, ohne JavaScript. */
export function Faq({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading">
      <h2
        id="faq-heading"
        className="font-display text-xl font-semibold tracking-tight"
      >
        Häufige Fragen
      </h2>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        {entries.map((entry) => (
          <details key={entry.question} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-semibold transition-colors duration-(--dur-fast) hover:bg-ink-soft">
              {entry.question}
              <ChevronDown
                className="size-4 shrink-0 text-muted transition-transform duration-(--dur-base) group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="px-5 pb-5 text-[15px] text-muted">
              {entry.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
