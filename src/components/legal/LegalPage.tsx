import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import { legal } from "@/config/site";

/** Einheitlicher Rahmen für die Rechtsseiten. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">
      <div className="tool-column">
        <h1 className="font-display text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">Stand: {updated}</p>

        {legal.isPlaceholder && <PlaceholderNotice />}

        <div className="mt-10 flex flex-col gap-8">{children}</div>
      </div>
    </div>
  );
}

/**
 * Deutlich sichtbarer Hinweis, solange die Angaben in config/site.ts noch
 * Platzhalter sind. Verschwindet, sobald `legal.isPlaceholder` auf false steht.
 */
function PlaceholderNotice() {
  return (
    <aside className="mt-6 rounded-card bg-accent-soft p-5 shadow-[inset_0_0_0_1px_var(--accent-ring)]">
      <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
        <AlertTriangle className="size-4 text-accent" aria-hidden="true" />
        Platzhaltertext – noch nicht rechtsverbindlich
      </h2>
      <p className="mt-2 text-sm text-muted">
        Dieser Text ist ein Gerüst und noch nicht veröffentlichungsreif. Vor dem
        Livegang: echte Angaben in{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px]">
          src/config/site.ts
        </code>{" "}
        eintragen, den Text von einer fachkundigen Person prüfen lassen und{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[13px]">
          legal.isPlaceholder
        </code>{" "}
        auf <code className="font-mono text-[13px]">false</code> setzen.
        Impressum (§ 5 DDG) und Datenschutzerklärung (Art. 13 DSGVO) sind in
        Deutschland Pflicht – ein fehlerhafter Text ist abmahnfähig.
      </p>
    </aside>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[16px] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}
