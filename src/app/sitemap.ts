import type { MetadataRoute } from "next";
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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  for (const tool of publicTools()) {
    entries.push({
      url: absoluteUrl(toolPath(tool.slug)),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });

    for (const variant of tool.getVariants?.() ?? []) {
      entries.push({
        url: absoluteUrl(variantPath(tool.slug, variant.slug)),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  for (const weg of publicWege()) {
    entries.push({
      url: absoluteUrl(wegPath(weg.slug)),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    });

    for (const variant of weg.getVariants?.() ?? []) {
      entries.push({
        url: absoluteUrl(wegVariantPath(weg.slug, variant.slug)),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  entries.push({
    url: absoluteUrl("/rechner/"),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  });

  if (publicWege().length > 0) {
    entries.push({
      url: absoluteUrl("/wege/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  entries.push({
    url: absoluteUrl("/ueber/"),
    lastModified,
    changeFrequency: "yearly",
    priority: 0.5,
  });

  for (const path of ["/rechtliches/impressum/", "/rechtliches/datenschutz/"]) {
    entries.push({
      url: absoluteUrl(path),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    });
  }

  return entries;
}
