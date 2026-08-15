import { WegCallout } from "@/components/WegCallout";
import { wegPath } from "@/lib/seo";
import { wegeForTool } from "@/wege/registry";

/**
 * Rückverweis von einem Tool auf jeden Weg, der es verkettet.
 *
 * Bewusst kein "use client": importiert wege/registry.ts (reine Manifest-
 * Daten), niemals wege/components.ts – sonst zöge jede Tool-Seite den
 * Stepper-Client-Code aller Wege mit. Derselbe Grund, aus dem
 * tools/components.ts von tools/registry.ts getrennt ist.
 */
export function WegBacklinks({ slug }: { slug: string }) {
  const wege = wegeForTool(slug);
  if (wege.length === 0) return null;

  return (
    <>
      {wege.flatMap((weg) => {
        const source = weg.sourceTools.find((s) => s.slug === slug);
        if (!source) return [];
        return [
          <WegCallout
            key={weg.slug}
            href={wegPath(weg.slug)}
            icon={weg.icon}
            eyebrow="Weg"
            title={weg.name}
            description={source.backlinkDescription}
          />,
        ];
      })}
    </>
  );
}
