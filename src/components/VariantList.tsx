import Link from "next/link";
import { variantPath } from "@/lib/seo";
import type { ToolManifest, ToolVariant } from "@/tools/types";

/**
 * Alle Unterseiten eines Tools, sichtbar auf der Tool-Seite und auf jeder
 * Unterseite.
 *
 * Vorher waren 122 der 174 Variantenseiten aus der Navigation überhaupt nicht
 * erreichbar – sie standen nur in der Sitemap. Eine Seite, zu der kein
 * sichtbarer Link führt, ist genau das, was Google als Doorway-Seite
 * beschreibt: erzeugt für die Suchmaschine, nicht für Besucher. Der einzige
 * belastbare Gegenbeweis ist ein echter Link an einer Stelle, an der ihn auch
 * ein Mensch findet und benutzt.
 *
 * Deshalb steht die Liste im Fluss und nicht in einem Hover-Flyout: Was nur
 * bei Mauskontakt erscheint, sieht auf dem Telefon niemand und zählt als
 * versteckter Link.
 */
export function VariantList({
  tool,
  currentSlug,
}: {
  tool: ToolManifest;
  /** Slug der gerade offenen Variante – bleibt in der Liste, aber ohne Link. */
  currentSlug?: string;
}) {
  const variants = tool.getVariants?.() ?? [];
  if (variants.length === 0) return null;

  const groups = groupVariants(variants);

  return (
    <section aria-labelledby="varianten-heading">
      <h2 id="varianten-heading" className="section-title">
        Direkt zu deinem Fall
      </h2>
      <p className="mt-2 field-hint">
        {variants.length} fertig eingestellte Seiten – jede rechnet denselben
        Rechner mit anderen Startwerten und erklärt den jeweiligen Fall.
      </p>

      <div className="mt-5 flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.label ?? "alle"}>
            {group.label && (
              <h3 className="card-title text-[15px]">{group.label}</h3>
            )}
            <ul
              className={`grid gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 ${
                group.label ? "mt-2" : ""
              }`}
            >
              {group.items.map((variant) => (
                <li key={variant.slug} className="text-[15px]">
                  {variant.slug === currentSlug ? (
                    <span aria-current="page" className="font-semibold">
                      {labelOf(variant)}
                    </span>
                  ) : (
                    <Link
                      prefetch={false}
                      href={variantPath(tool.slug, variant.slug)}
                      className="text-muted link-hover-ink underline decoration-(--link-line) underline-offset-2"
                    >
                      {labelOf(variant)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function labelOf(variant: ToolVariant): string {
  return variant.listLabel ?? variant.heading ?? variant.title;
}

interface VariantGroup {
  /** `undefined` = ungruppiert, dann entfällt die Zwischenüberschrift. */
  label?: string;
  items: ToolVariant[];
}

/**
 * Gruppiert nur, wenn mindestens eine Variante eine Gruppe nennt. Bei zehn
 * Backform-Umrechnungen wäre eine Zwischenüberschrift Ballast, bei 48
 * Brückentage-Seiten über drei Jahre ist sie das, was die Liste überhaupt
 * lesbar macht.
 */
function groupVariants(variants: ToolVariant[]): VariantGroup[] {
  if (!variants.some((variant) => variant.listGroup)) {
    return [{ items: variants }];
  }

  const groups: VariantGroup[] = [];

  for (const variant of variants) {
    const label = variant.listGroup ?? "Weitere";
    const existing = groups.find((group) => group.label === label);
    if (existing) {
      existing.items.push(variant);
    } else {
      groups.push({ label, items: [variant] });
    }
  }

  return groups;
}
