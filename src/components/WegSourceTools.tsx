import { WegCallout } from "@/components/WegCallout";
import { toolPath } from "@/lib/seo";
import { getTool } from "@/tools/registry";
import type { WegSourceTool } from "@/wege/types";

/** "Im Detail weiterrechnen": mechanisch aus weg.sourceTools erzeugt. */
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
