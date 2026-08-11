import { ChevronDown } from "lucide-react";
import type { FaqEntry } from "@/tools/types";

/** Native <details> – zugänglich, tastaturbedienbar, ohne JavaScript. */
export function Faq({ entries }: { entries: FaqEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="section-title">
        Häufige Fragen
      </h2>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-card bg-surface shadow-[var(--elev-soft),var(--elev-inset)]">
        {entries.map((entry) => (
          <details key={entry.question} className="group">
            <summary className="faq-summary">
              {entry.question}
              <ChevronDown className="chevron-rotate" aria-hidden="true" />
            </summary>
            <div className="faq-answer">{entry.answer}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
