import type { MetadataRoute } from "next";
import { lastModified, lastModifiedKey } from "@/lib/lastModified";
import {
  absoluteUrl,
  toolPath,
  variantPath,
  wegPath,
  wegVariantPath,
} from "@/lib/seo";
import { publicTools } from "@/tools/registry";
import { publicWege } from "@/wege/registry";

export const dynamic = "force-static";

/**
 * Vollständig aus der Registry erzeugt: Startseite, jede Tool-Seite und jede
 * SEO-Variante. Ein neues Tool erscheint hier automatisch.
 *
 * Nur `loc` und `lastmod`. `changefreq` und `priority` standen hier früher –
 * Google wertet beide nach eigener Aussage nicht aus, sie waren reine
 * Dekoration. `lastmod` dagegen zählt, solange es stimmt: Es kommt deshalb aus
 * der Git-Historie der jeweiligen Seite (lib/lastModified.ts) und nicht mehr
 * aus dem Build-Zeitpunkt, der bei jedem Deploy alle Seiten auf „heute“
 * gesetzt hat. Fehlt das Datum, fehlt das Feld.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, key: string): MetadataRoute.Sitemap[number] => {
    const date = lastModified(key);
    return { url: absoluteUrl(path), ...(date ? { lastModified: date } : {}) };
  };

  const entries: MetadataRoute.Sitemap = [
    entry("/", lastModifiedKey.page("start")),
  ];

  for (const tool of publicTools()) {
    const key = lastModifiedKey.tool(tool.slug);
    entries.push(entry(toolPath(tool.slug), key));
    for (const variant of tool.getVariants?.() ?? []) {
      entries.push(entry(variantPath(tool.slug, variant.slug), key));
    }
  }

  for (const weg of publicWege()) {
    const key = lastModifiedKey.weg(weg.slug);
    entries.push(entry(wegPath(weg.slug), key));
    for (const variant of weg.getVariants?.() ?? []) {
      entries.push(entry(wegVariantPath(weg.slug, variant.slug), key));
    }
  }

  entries.push(entry("/rechner/", lastModifiedKey.page("rechner")));
  if (publicWege().length > 0) {
    entries.push(entry("/wege/", lastModifiedKey.page("wege")));
  }
  entries.push(entry("/ueber/", lastModifiedKey.page("ueber")));
  entries.push(
    entry("/rechtliches/impressum/", lastModifiedKey.page("impressum")),
    entry("/rechtliches/datenschutz/", lastModifiedKey.page("datenschutz")),
  );

  return entries;
}
