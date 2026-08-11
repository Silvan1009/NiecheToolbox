"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { Bug, Send, X } from "lucide-react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { Field, TextArea, TextInput } from "@/components/ui/Field";

/**
 * Natives <dialog> statt eigenem Modal-Unterbau – Fokusfalle, Esc-zum-
 * Schließen und Backdrop kommen dadurch gratis vom Browser.
 *
 * Versand läuft über mailto:, nicht über eine API-Route: der Export ist
 * statisch (next.config.ts, output: "export"), es gibt keinen Node-Server auf
 * IONOS. Rechner, Seite, Browser und Zeitpunkt werden dem Text automatisch
 * angehängt, damit eine Meldung ohne Rückfrage nachvollziehbar ist.
 */
export function BugReportButton({ toolName }: { toolName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const subjectId = useId();
  const descriptionId = useId();

  const [subject, setSubject] = useState(`Fehler bei ${toolName}`);
  const [description, setDescription] = useState("");

  // Setzt die Beschreibung selbst zurück statt sich auf das "close"-Event des
  // <dialog> zu verlassen – das feuert je nach Browser erst beim nächsten
  // Rendering-Tick, Abbrechen/Absenden sollen aber sofort sauber sein.
  const close = () => {
    dialogRef.current?.close();
    setDescription("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const context = [
      `Rechner: ${toolName}`,
      `Seite: ${window.location.href}`,
      `Browser: ${window.navigator.userAgent}`,
      `Zeitpunkt: ${new Date().toLocaleString("de-DE")}`,
    ].join("\n");
    const body = `${description.trim()}\n\n---\n${context}`;
    const mailto = `mailto:${site.bugReportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex items-center gap-1.5 rounded-control px-2.5 py-1.5 text-[13px] text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
      >
        <Bug className="size-3.5" aria-hidden="true" />
        Fehler melden
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setDescription("")}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        className="m-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-card border-0 bg-surface p-0 text-ink shadow-lift backdrop:bg-ink/45"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id={titleId}
                className="font-display text-lg font-semibold tracking-tight"
              >
                Fehler melden
              </h2>
              <p className="mt-1 text-[13px] text-muted">
                Rückmeldungen zu falschen Ergebnissen haben Vorrang vor allem
                anderen.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Schließen"
              className="grid size-8 shrink-0 place-items-center rounded-control text-muted transition-colors duration-(--dur-fast) hover:bg-ink-soft hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <Field label="Betreff" htmlFor={subjectId}>
            <TextInput
              id={subjectId}
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </Field>

          <Field
            label="Was ist passiert?"
            htmlFor={descriptionId}
            hint="Welches Ergebnis kam raus, welches hättest du erwartet?"
          >
            <TextArea
              id={descriptionId}
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="z. B.: Bei Eingabe X zeigt der Rechner Y an, erwartet hätte ich Z."
            />
          </Field>

          <p className="text-[13px] text-muted">
            Rechner, Seite, Browser und Zeitpunkt werden automatisch angehängt.
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={close}>
              Abbrechen
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Send className="size-4" aria-hidden="true" />
              E-Mail öffnen
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
