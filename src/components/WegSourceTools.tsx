import { WegCallout } from "@/components/WegCallout";
import { toolPath } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import type { WegSourceTool } from "@/wege/types";

/**
 * "Im Detail weiterrechnen": mechanisch aus weg.sourceTools erzeugt.
 *
 * Server-Component, und das muss so bleiben: Sie importiert tools/registry.ts
 * und damit die Manifeste aller Rechner samt Erklärtexten. WegPageShell
 * rendert sie und reicht das Ergebnis als Knoten in den Weg hinein. Ein
 * Import aus einem Client-Modul (den Weg-Components) hat genau diese Texte
 * als 461-KiB-Chunk auf jede Weg-Seite gelegt.
 */
export function WegSourceTools({ tools }: { tools: WegSourceTool[] }) {
  const items = tools.flatMap((entry) => {
    const tool = getTool(entry.slug);
    return tool ? [{ entry, tool }] : [];
  });
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="weg-weiterrechnen">
      <h2
        id="weg-weiterrechnen"
        className="font-display text-lg font-semibold tracking-tight"
      >
        Im Detail weiterrechnen
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map(({ entry, tool }) => (
          <li key={entry.slug}>
            <WegCallout
              href={toolPath(entry.slug)}
              icon={tool.icon}
              eyebrow={entry.detailEyebrow}
              title={tool.name}
              description={entry.detailDescription}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
