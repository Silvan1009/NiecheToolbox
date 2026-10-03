import Link from "next/link";
import { legal } from "@/config/site";
import { formatGermanDate } from "@/lib/lastModified";
import type { ContentSection, SourceLink } from "@/tools/types";

/**
 * Wer für die Seite einsteht und wann sie zuletzt angefasst wurde.
 *
 * Ein Rechner zu Steuern, Fristen oder Gesundheit ist nur so viel wert wie die
 * Antwort auf zwei Fragen: Wer hat das gerechnet, und von wann ist es? Beides
 * stand bisher nur auf der Über-uns-Seite. Das Datum kommt aus der
 * Git-Historie (lib/lastModified.ts) – fehlt es, entfällt der Halbsatz, statt
 * ein erfundenes Datum zu zeigen.
 *
 * Steht bewusst außerhalb von `data-prose`: Der Satz ist auf jeder Seite
 * derselbe und kein Inhalt, den scripts/content-audit.ts mitzählen soll.
 */
export function PageStand({ date }: { date?: string }) {
  return (
    <p className="text-sm text-muted">
      {date && (
        <>
          Zuletzt aktualisiert am{" "}
          <time dateTime={date}>{formatGermanDate(date)}</time>.{" "}
        </>
      )}
      Rechenweg und Text:{" "}
      <Link
        prefetch={false}
        href="/ueber/"
        className="text-link"
      >
        {legal.operator.name}
      </Link>
      .
    </p>
  );
}

/**
 * Die Quellen eines Rechners als eigener Abschnitt – in derselben Form wie
 * jeder andere Abschnitt, damit `Prose` ihn ohne Sonderweg rendert.
 */
export function sourcesSection(sources?: SourceLink[]): ContentSection[] {
  if (!sources || sources.length === 0) return [];
  return [
    {
      heading: "Quellen und Rechtsgrundlagen",
      blocks: [{ type: "links", items: sources }],
    },
  ];
}
